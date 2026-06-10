/**
 * SSRF guard for the OG preview endpoint. Blocks obviously-internal
 * targets via hostname and IP-literal checks — same posture as the docs
 * proxy's /api/og (the DNS-rebinding residual is a deliberate accept).
 * Re-run on every redirect hop, not just the initial URL.
 */

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
  const host = url.hostname.toLowerCase()
  if (
    host === 'localhost' ||
    BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => host.endsWith(suffix)) ||
    isPrivateIp(host)
  ) {
    return { ok: false, error: 'Local and internal addresses are not allowed' }
  }
  return { ok: true, url }
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
      bare.startsWith('fe80') ||
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
