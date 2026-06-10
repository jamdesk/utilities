import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('node:dns/promises', () => {
  const lookup = vi.fn()
  // Node builtin interop: vitest requires the default export on the mock too
  return { default: { lookup }, lookup }
})

import { lookup } from 'node:dns/promises'
import { validateResolvedHost, validateTargetUrl } from '../lib/og-url-guard'

describe('validateTargetUrl', () => {
  const blocked = [
    'not a url',
    'ftp://example.com/',
    'file:///etc/passwd',
    'https://example.com:8080/',
    'http://localhost/',
    'http://localhost./',
    'http://sub.localhost/',
    'https://foo.internal./',
    'https://foo.local/',
    'https://router.internal/',
    'https://printer.home.arpa/',
    'http://127.0.0.1/',
    'http://127.255.0.1/',
    'http://0.0.0.0/',
    'http://10.1.2.3/',
    'http://100.64.0.1/',
    'http://169.254.169.254/latest/meta-data/',
    'http://172.16.0.1/',
    'http://172.31.255.255/',
    'http://192.168.1.1/',
    'http://[::1]/',
    'http://[fc00::1]/',
    'http://[fd12::1]/',
    'http://[fe80::1]/',
    'http://[febf::1]/',
    'http://[::ffff:127.0.0.1]/',
    'http://2130706433/',
    'http://0x7f000001/',
    'http://127.1/',
  ]
  const allowed = [
    'https://example.com/',
    'http://example.com/page?a=1',
    'https://docs.firmreader.com/features/analytics',
    'https://example.com:443/',
    'http://example.com:80/',
    'http://172.32.0.1/', // just outside 172.16/12
    'http://11.0.0.1/', // public, despite starting with 1
    'http://8.8.8.8/',
  ]

  it.each(blocked)('blocks %s', (url) => {
    expect(validateTargetUrl(url).ok).toBe(false)
  })

  it.each(allowed)('allows %s', (url) => {
    const result = validateTargetUrl(url)
    expect(result.ok).toBe(true)
  })

  it('returns the parsed URL on success', () => {
    const result = validateTargetUrl('https://example.com/path')
    if (!result.ok) throw new Error('expected ok')
    expect(result.url.hostname).toBe('example.com')
  })
})

describe('validateResolvedHost', () => {
  beforeEach(() => {
    vi.mocked(lookup).mockReset()
  })

  it('allows hosts resolving only to public addresses', async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: '93.184.216.34', family: 4 }] as never)
    expect((await validateResolvedHost('example.com')).ok).toBe(true)
  })

  it('blocks hosts where ANY address is private (rebinding via mixed records)', async () => {
    vi.mocked(lookup).mockResolvedValue([
      { address: '93.184.216.34', family: 4 },
      { address: '10.0.0.5', family: 4 },
    ] as never)
    const result = await validateResolvedHost('rebind.attacker.example')
    expect(result.ok).toBe(false)
  })

  it('blocks hosts resolving to IPv6 unique-local addresses', async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: 'fd00::1', family: 6 }] as never)
    expect((await validateResolvedHost('v6.attacker.example')).ok).toBe(false)
  })

  it('blocks hosts resolving to the cloud metadata address', async () => {
    vi.mocked(lookup).mockResolvedValue([{ address: '169.254.169.254', family: 4 }] as never)
    expect((await validateResolvedHost('metadata.attacker.example')).ok).toBe(false)
  })

  it('errors on unresolvable hosts', async () => {
    vi.mocked(lookup).mockRejectedValue(new Error('ENOTFOUND'))
    const result = await validateResolvedHost('does-not-exist.example')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/resolve/i)
  })
})
