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

  it('empty-string og:image:secure_url does not mask a valid og:image', () => {
    const r = makeResult({
      og: { 'image:secure_url': '', image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': GOOD_IMAGE },
    })
    expect(ids(r)).not.toContain('missing-og-image')
  })

  it('warns (not errors) when only twitter:image is set', () => {
    const r = makeResult({
      twitter: { image: 'https://example.com/tw.png' },
      images: { 'https://example.com/tw.png': { ...GOOD_IMAGE, url: 'https://example.com/tw.png' } },
    })
    const f = lintOgResult(r).find((x) => x.id === 'missing-og-image')
    expect(f?.severity).toBe('warning')
    expect(f?.message).toBe('Missing og:image — only twitter:image is set')
  })

  it('per-image findings carry distinct url fields', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png' },
      twitter: { image: 'https://example.com/tw.png' },
      images: {
        'https://example.com/og.png': { url: 'https://example.com/og.png', ok: false, status: 404 },
        'https://example.com/tw.png': { url: 'https://example.com/tw.png', ok: false, status: 500 },
      },
    })
    const unreachable = lintOgResult(r).filter((f) => f.id === 'image-unreachable')
    expect(unreachable.map((f) => f.url).sort()).toEqual([
      'https://example.com/og.png',
      'https://example.com/tw.png',
    ])
  })

  it('does not flag 1200×628 (exact 1.91:1) as small', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...GOOD_IMAGE, width: 1200, height: 628 } },
    })
    expect(ids(r)).not.toContain('image-small')
  })

  it('detects insecure image regardless of scheme case', () => {
    const r = makeResult({ og: { image: 'HTTP://example.com/og.png' } })
    expect(ids(r)).toContain('insecure-image')
  })

  it('warns when only og:image:height mismatches actual', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png', 'image:width': '1200', 'image:height': '600' },
      images: { 'https://example.com/og.png': GOOD_IMAGE },
    })
    const f = lintOgResult(r).find((x) => x.id === 'image-dims-mismatch')
    expect(f?.message).toBe('og:image:height says 600 but the image is 630px tall')
    expect(f?.url).toBe('https://example.com/og.png')
  })
})
