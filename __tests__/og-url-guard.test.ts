import { describe, it, expect } from 'vitest'
import { validateTargetUrl } from '../lib/og-url-guard'

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
