import { describe, it, expect } from 'vitest'
import { lintOgResult } from '../lib/og-lint'
import type { OgPreviewResult, ImageCheck } from '../lib/og-types'

const GOOD_IMAGE: ImageCheck = {
  url: 'https://example.com/og.png',
  ok: true,
  status: 200,
  contentType: 'image/png',
  bytes: 100_000,
  width: 1200,
  height: 630,
}

function makeResult(overrides: {
  og?: Record<string, string>
  twitter?: Record<string, string>
  title?: string
  description?: string
  canonical?: string
  images?: Record<string, ImageCheck>
}): OgPreviewResult {
  return {
    inputUrl: 'https://example.com/',
    finalUrl: 'https://example.com/',
    status: 200,
    meta: {
      title: overrides.title,
      description: overrides.description,
      canonical: overrides.canonical,
      og: overrides.og ?? {},
      twitter: overrides.twitter ?? {},
      rawTags: [],
    },
    images: overrides.images ?? {},
  }
}

const COMPLETE = makeResult({
  title: 'Title',
  description: 'Desc',
  og: {
    title: 'OG Title',
    description: 'OG Desc',
    image: 'https://example.com/og.png',
    url: 'https://example.com/',
    site_name: 'Example',
  },
  twitter: { card: 'summary_large_image' },
  images: { 'https://example.com/og.png': GOOD_IMAGE },
})

function ids(result: OgPreviewResult): string[] {
  return lintOgResult(result).map((f) => f.id)
}

describe('lintOgResult', () => {
  it('passes a complete page with no findings', () => {
    expect(lintOgResult(COMPLETE)).toEqual([])
  })

  it('errors on missing og:title with no <title> fallback', () => {
    const findings = lintOgResult(makeResult({}))
    const f = findings.find((x) => x.id === 'missing-og-title')
    expect(f?.severity).toBe('error')
  })

  it('only warns on missing og:title when <title> exists', () => {
    const findings = lintOgResult(makeResult({ title: 'Fallback' }))
    const f = findings.find((x) => x.id === 'missing-og-title')
    expect(f?.severity).toBe('warning')
  })

  it('errors on missing og:image', () => {
    expect(ids(makeResult({ title: 't' }))).toContain('missing-og-image')
  })

  it('errors on relative og:image', () => {
    const r = makeResult({ og: { image: '/og.png' } })
    expect(ids(r)).toContain('image-not-absolute')
  })

  it('warns on http:// og:image', () => {
    const r = makeResult({ og: { image: 'http://example.com/og.png' } })
    expect(ids(r)).toContain('insecure-image')
  })

  it('warns on missing twitter:card', () => {
    expect(ids(makeResult({}))).toContain('missing-twitter-card')
  })

  it('errors when the image deep-check failed', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { url: 'https://example.com/og.png', ok: false, status: 404, error: 'Image request failed (404)' } },
    })
    expect(ids(r)).toContain('image-unreachable')
  })

  it('errors on images below 200×200 and warns below 1200×630', () => {
    const tiny = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, width: 100, height: 100 } },
    })
    expect(ids(tiny)).toContain('image-too-small')
    const small = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, width: 800, height: 419 } },
    })
    expect(ids(small)).toContain('image-small')
  })

  it('warns on bad aspect ratio', () => {
    const square = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, width: 1200, height: 1200 } },
    })
    expect(ids(square)).toContain('image-aspect')
  })

  it('warns when declared og:image:width mismatches actual', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png', 'image:width': '600', 'image:height': '630' },
      images: { 'https://example.com/og.png': GOOD_IMAGE },
    })
    expect(ids(r)).toContain('image-dims-mismatch')
  })

  it('warns on oversized image files', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, bytes: 6 * 1024 * 1024 } },
    })
    expect(ids(r)).toContain('image-too-large')
  })

  it('warns on webp format, errors on non-image content type', () => {
    const webp = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, contentType: 'image/webp' } },
    })
    expect(lintOgResult(webp).find((f) => f.id === 'image-format')?.severity).toBe('warning')
    const html = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, contentType: 'text/html' } },
    })
    expect(lintOgResult(html).find((f) => f.id === 'image-format')?.severity).toBe('error')
  })

  it('flags over-long titles and descriptions as info', () => {
    const r = makeResult({ og: { title: 'x'.repeat(80), description: 'y'.repeat(220) } })
    expect(ids(r)).toContain('title-long')
    expect(ids(r)).toContain('description-long')
  })

  it('info on missing og:url+canonical and missing og:site_name', () => {
    const r = makeResult({ title: 't' })
    expect(ids(r)).toContain('missing-og-url')
    expect(ids(r)).toContain('missing-site-name')
  })
})
