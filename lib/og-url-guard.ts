/**
 * SSRF guard for the OG preview endpoint, two layers re-run on every
 * redirect hop: validateTargetUrl (sync hostname/IP-literal checks) and
 * validateResolvedHost (DNS lookup, rejects names that resolve to private
 * addresses). fetch() re-resolves the name afterwards, so a fast-rebinding
 * TOCTOU window remains — accepted; closing it needs IP pinning via a
 * custom dispatcher.
 */

import { lookup } from 'node:dns/promises'

const BLOCKED_HOSTNAME_SUFFIXES = ['.localhost', '.local', '.internal', '.home.arpa']

export type UrlGuardResult = { ok: true; url: URL } | { ok: false; error: string }

export function validateTargetUrl(raw: string): UrlGuardResult {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return { ok: false, error: 'Invalid URL' }
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, error: 'Only http(s) URLs are supported' }
  }
  if (url.port && url.port !== '80' && url.port !== '443') {
    return { ok: false, error: 'Non-standard ports are not supported' }
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  if (
    host === 'localhost' ||
    BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => host.endsWith(suffix)) ||
    isPrivateIp(host)
  ) {
    return { ok: false, error: 'Local and internal addresses are not allowed' }
  }
  return { ok: true, url }
}

export type HostResolutionResult = { ok: true } | { ok: false; error: string }

/**
 * Resolve a hostname and reject it when ANY returned address is private —
 * blocks DNS records statically pointed at internal ranges. Server-only
 * (node:dns); do not import from client code.
 */
export async function validateResolvedHost(hostname: string): Promise<HostResolutionResult> {
  const bare =
    hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname
  let addresses: { address: string }[]
  try {
    addresses = await lookup(bare, { all: true })
  } catch {
    return { ok: false, error: 'Could not resolve the host' }
  }
  if (addresses.some(({ address }) => isPrivateIp(address))) {
    return { ok: false, error: 'Local and internal addresses are not allowed' }
  }
  return { ok: true }
}

function isPrivateIp(host: string): boolean {
  // URL.hostname keeps brackets on IPv6 literals
  const bare = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host
  if (bare.includes(':')) {
    // IPv6: loopback, unique-local (fc00::/7), link-local (fe80::/10), and
    // v4-mapped (conservatively blocked — public mapped addresses are rare)
    return (
      bare === '::' ||
      bare === '::1' ||
      bare.startsWith('fc') ||
      bare.startsWith('fd') ||
      ['fe8', 'fe9', 'fea', 'feb'].some((p) => bare.startsWith(p)) ||
      bare.startsWith('::ffff:')
    )
  }
  const parts = bare.split('.')
  if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p))) return false
  const [a, b] = parts.map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // CGNAT
    (a === 169 && b === 254) || // link-local / cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  )
}
