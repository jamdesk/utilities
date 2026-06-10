import { describe, it, expect } from 'vitest'
import { resolvePlatform } from '../lib/og-platforms'
import type { OgPreviewResult, ImageCheck } from '../lib/og-types'

const OK_CHECK: ImageCheck = {
  url: 'https://example.com/og.png', ok: true, contentType: 'image/png',
  bytes: 1000, width: 1200, height: 630,
}

function makeResult(overrides: {
  og?: Record<string, string>
  twitter?: Record<string, string>
  title?: string
  description?: string
  themeColor?: string
  images?: Record<string, ImageCheck>
}): OgPreviewResult {
  return {
    finalUrl: 'https://example.com/page',
    status: 200,
    meta: {
      title: overrides.title,
      description: overrides.description,
      themeColor: overrides.themeColor,
      faviconUrl: 'https://example.com/favicon.ico',
      og: overrides.og ?? {},
      twitter: overrides.twitter ?? {},
      rawTags: [],
    },
    images: overrides.images ?? {},
  }
}

describe('resolvePlatform', () => {
  it('X prefers twitter:* over og:* over html', () => {
    const r = makeResult({
      title: 'HTML', description: 'HTML desc',
      og: { title: 'OG', description: 'OG desc' },
      twitter: { title: 'TW', description: 'TW desc' },
    })
    const p = resolvePlatform('x', r)
    expect(p.title).toBe('TW')
    expect(p.description).toBe('TW desc')
  })

  it('X falls back to og then html when twitter tags absent', () => {
    const p = resolvePlatform('x', makeResult({ title: 'HTML' }))
    expect(p.title).toBe('HTML')
  })

  it('X cardType reflects twitter:card, defaulting to summary', () => {
    expect(resolvePlatform('x', makeResult({ twitter: { card: 'summary_large_image' } })).cardType)
      .toBe('summary_large_image')
    expect(resolvePlatform('x', makeResult({})).cardType).toBe('summary')
  })

  it('Google prefers the <title> tag over og:title', () => {
    const r = makeResult({ title: 'HTML', og: { title: 'OG' } })
    expect(resolvePlatform('google', r).title).toBe('HTML')
  })

  it('Facebook uses og:* with html fallback', () => {
    const r = makeResult({ title: 'HTML', og: { title: 'OG' } })
    expect(resolvePlatform('facebook', r).title).toBe('OG')
    expect(resolvePlatform('facebook', makeResult({ title: 'HTML' })).title).toBe('HTML')
  })

  it('resolves relative og:image against the final URL', () => {
    const r = makeResult({
      og: { image: '/og.png' },
      images: { 'https://example.com/og.png': OK_CHECK },
    })
    expect(resolvePlatform('facebook', r).imageUrl).toBe('https://example.com/og.png')
  })

  it('drops images whose deep-check failed', () => {
    const r = makeResult({
      og: { image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': { ...OK_CHECK, ok: false } },
    })
    expect(resolvePlatform('facebook', r).imageUrl).toBeUndefined()
  })

  it('exposes domain, site name, theme color, and favicon', () => {
    const r = makeResult({ og: { site_name: 'Example' }, themeColor: '#123456' })
    const p = resolvePlatform('discord', r)
    expect(p.domain).toBe('example.com')
    expect(p.siteName).toBe('Example')
    expect(p.themeColor).toBe('#123456')
    expect(p.faviconUrl).toBe('https://example.com/favicon.ico')
  })

  it('empty-string og:image:secure_url does not mask a valid og:image', () => {
    const r = makeResult({
      og: { 'image:secure_url': '', image: 'https://example.com/og.png' },
      images: { 'https://example.com/og.png': OK_CHECK },
    })
    expect(resolvePlatform('facebook', r).imageUrl).toBe('https://example.com/og.png')
  })

  it('twitter:image-only: X gets the image, Facebook does not', () => {
    const r = makeResult({
      twitter: { image: 'https://example.com/tw.png' },
      images: { 'https://example.com/tw.png': { ...OK_CHECK, url: 'https://example.com/tw.png' } },
    })
    expect(resolvePlatform('x', r).imageUrl).toBe('https://example.com/tw.png')
    expect(resolvePlatform('facebook', r).imageUrl).toBeUndefined()
  })

  it('Slack prefers twitter:* over og:*', () => {
    const r = makeResult({
      title: 'HTML',
      og: { title: 'OG', description: 'OG desc' },
      twitter: { title: 'TW', description: 'TW desc' },
    })
    const p = resolvePlatform('slack', r)
    expect(p.title).toBe('TW')
    expect(p.description).toBe('TW desc')
  })
})
