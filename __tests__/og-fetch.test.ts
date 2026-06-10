import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchPreview, OgFetchError } from '../lib/og-fetch'

// 1×1 transparent PNG
const PNG_1X1 = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
  (c) => c.charCodeAt(0)
)

const HTML = `<html><head>
<title>Fallback Title</title>
<meta property="og:title" content="OG Title">
<meta property="og:image" content="/og.png">
</head></html>`

function htmlResponse(body: string, init?: ResponseInit) {
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    ...init,
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchPreview', () => {
  it('rejects blocked targets without any network call', async () => {
    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    await expect(fetchPreview('http://127.0.0.1/x')).rejects.toThrow(OgFetchError)
    expect(spy).not.toHaveBeenCalled()
  })

  it('fetches, parses, and deep-checks the og:image', async () => {
    const mock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://example.com/page') return Promise.resolve(htmlResponse(HTML))
      if (url === 'https://example.com/og.png')
        return Promise.resolve(
          new Response(PNG_1X1, { status: 200, headers: { 'content-type': 'image/png' } })
        )
      return Promise.reject(new Error(`unexpected fetch ${url}`))
    })
    vi.stubGlobal('fetch', mock)

    const result = await fetchPreview('https://example.com/page')
    expect(result.status).toBe(200)
    expect(result.finalUrl).toBe('https://example.com/page')
    expect(result.meta.og.title).toBe('OG Title')
    const check = result.images['https://example.com/og.png']
    expect(check.ok).toBe(true)
    expect(check.contentType).toBe('image/png')
    expect(check.width).toBe(1)
    expect(check.height).toBe(1)
  })

  it('follows redirects but rejects when a hop targets a blocked address', async () => {
    const mock = vi.fn().mockResolvedValue(
      new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/' } })
    )
    vi.stubGlobal('fetch', mock)
    await expect(fetchPreview('https://example.com/')).rejects.toThrow(/blocked/i)
  })

  it('follows allowed redirects and reports the final URL', async () => {
    const mock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://example.com/')
        return Promise.resolve(
          new Response(null, { status: 301, headers: { location: 'https://www.example.com/' } })
        )
      return Promise.resolve(htmlResponse('<head><title>Moved</title></head>'))
    })
    vi.stubGlobal('fetch', mock)
    const result = await fetchPreview('https://example.com/')
    expect(result.finalUrl).toBe('https://www.example.com/')
    expect(result.meta.title).toBe('Moved')
  })

  it('rejects non-HTML responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('%PDF-1.4', { status: 200, headers: { 'content-type': 'application/pdf' } })
      )
    )
    await expect(fetchPreview('https://example.com/doc.pdf')).rejects.toThrow(/not an HTML page/i)
  })

  it('records a failed image check instead of failing the whole preview', async () => {
    const mock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://example.com/page') return Promise.resolve(htmlResponse(HTML))
      return Promise.resolve(new Response('nope', { status: 404 }))
    })
    vi.stubGlobal('fetch', mock)
    const result = await fetchPreview('https://example.com/page')
    const check = result.images['https://example.com/og.png']
    expect(check.ok).toBe(false)
    expect(check.status).toBe(404)
  })

  it('resolves the preview when the image body stream errors mid-read', async () => {
    const erroringBody = new ReadableStream({
      pull() {
        throw new Error('stream broke')
      },
    })
    const mock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://example.com/page') return Promise.resolve(htmlResponse(HTML))
      return Promise.resolve(
        new Response(erroringBody, { status: 200, headers: { 'content-type': 'image/png' } })
      )
    })
    vi.stubGlobal('fetch', mock)
    const result = await fetchPreview('https://example.com/page')
    const check = result.images['https://example.com/og.png']
    expect(check.ok).toBe(false)
    expect(check.error).toMatch(/could not be read/i)
  })

  it('rejects redirect chains longer than 5 hops', async () => {
    let hop = 0
    const mock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(null, {
          status: 302,
          headers: { location: `https://example.com/${++hop}` },
        })
      )
    )
    vi.stubGlobal('fetch', mock)
    await expect(fetchPreview('https://example.com/')).rejects.toThrow(/too many redirects/i)
  })

  it('prefers the content-length header for the reported image bytes', async () => {
    const mock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://example.com/page') return Promise.resolve(htmlResponse(HTML))
      return Promise.resolve(
        new Response(PNG_1X1, {
          status: 200,
          headers: { 'content-type': 'image/png', 'content-length': '52428800' },
        })
      )
    })
    vi.stubGlobal('fetch', mock)
    const result = await fetchPreview('https://example.com/page')
    expect(result.images['https://example.com/og.png'].bytes).toBe(52428800)
  })
})
