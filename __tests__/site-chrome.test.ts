import { describe, it, expect, vi, beforeEach } from 'vitest'

// Must mock before importing the module
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('fetchSiteChrome', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    mockFetch.mockReset()
  })

  it('returns null when NEXT_PUBLIC_SITE_CHROME_URL is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CHROME_URL', '')

    const { fetchSiteChrome } = await import('../lib/site-chrome')
    const result = await fetchSiteChrome()
    expect(result).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns null for non-jamdesk origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CHROME_URL', 'https://evil.com/chrome')

    const { fetchSiteChrome } = await import('../lib/site-chrome')
    const result = await fetchSiteChrome()
    expect(result).toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('parses valid response correctly', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CHROME_URL', 'https://www.jamdesk.com/api/site-chrome')

    const chromeData = {
      header: '<header>Test Header</header>',
      footer: '<footer>Test Footer</footer>',
      css: '.header { color: red; }',
      consent: '<div>Consent Banner</div>',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => chromeData,
    })

    const { fetchSiteChrome } = await import('../lib/site-chrome')
    const result = await fetchSiteChrome()
    expect(result).toEqual(chromeData)
  })

  it('returns null on HTTP error', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CHROME_URL', 'https://www.jamdesk.com/api/site-chrome')

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { fetchSiteChrome } = await import('../lib/site-chrome')
    const result = await fetchSiteChrome()
    expect(result).toBeNull()
  })

  it('returns null on network error', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CHROME_URL', 'https://www.jamdesk.com/api/site-chrome')

    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { fetchSiteChrome } = await import('../lib/site-chrome')
    const result = await fetchSiteChrome()
    expect(result).toBeNull()
  })
})
