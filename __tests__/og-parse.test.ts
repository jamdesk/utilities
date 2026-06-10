import { describe, it, expect } from 'vitest'
import { parseHead, resolveUrl } from '../lib/og-parse'

const PAGE_URL = 'https://example.com/docs/page'

const FULL_HTML = `<!doctype html>
<html><head>
<title>Page &amp; Title</title>
<meta name="description" content="Plain description">
<meta property="og:title" content="OG Title">
<meta property="og:title" content="Duplicate — must be ignored">
<meta property="og:description" content="OG description">
<meta property="og:image" content="https://example.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:site_name" content="Example Docs">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Twitter Title">
<meta name="theme-color" content="#ff0000">
<link rel="canonical" href="/docs/page">
<link rel="icon" href="/favicon.png">
</head><body></body></html>`

describe('parseHead', () => {
  it('extracts title, description, og, and twitter tags', () => {
    const meta = parseHead(FULL_HTML, PAGE_URL)
    expect(meta.title).toBe('Page & Title')
    expect(meta.description).toBe('Plain description')
    expect(meta.og.title).toBe('OG Title')
    expect(meta.og.description).toBe('OG description')
    expect(meta.og.image).toBe('https://example.com/og.png')
    expect(meta.og['image:width']).toBe('1200')
    expect(meta.og['site_name']).toBe('Example Docs')
    expect(meta.twitter.card).toBe('summary_large_image')
    expect(meta.twitter.title).toBe('Twitter Title')
    expect(meta.themeColor).toBe('#ff0000')
  })

  it('first occurrence wins for duplicate og tags', () => {
    const meta = parseHead(FULL_HTML, PAGE_URL)
    expect(meta.og.title).toBe('OG Title')
  })

  it('resolves canonical and favicon to absolute URLs', () => {
    const meta = parseHead(FULL_HTML, PAGE_URL)
    expect(meta.canonical).toBe('https://example.com/docs/page')
    expect(meta.faviconUrl).toBe('https://example.com/favicon.png')
  })

  it('defaults favicon to /favicon.ico when no icon link exists', () => {
    const meta = parseHead('<html><head><title>x</title></head></html>', PAGE_URL)
    expect(meta.faviconUrl).toBe('https://example.com/favicon.ico')
  })

  it('records rawTags in document order with sources', () => {
    const meta = parseHead(FULL_HTML, PAGE_URL)
    const names = meta.rawTags.map((t) => t.name)
    expect(names).toContain('og:title')
    expect(names).toContain('twitter:card')
    expect(meta.rawTags.find((t) => t.name === 'og:title')?.source).toBe('og')
    expect(meta.rawTags.find((t) => t.name === 'description')?.source).toBe('html')
    // duplicates still appear in the raw list even though first-wins for values
    expect(names.filter((n) => n === 'og:title')).toHaveLength(2)
  })

  it('handles og tags using name= instead of property= (common malformation)', () => {
    const meta = parseHead('<head><meta name="og:title" content="Via name"></head>', PAGE_URL)
    expect(meta.og.title).toBe('Via name')
  })

  it('returns empty records for a page with no metadata', () => {
    const meta = parseHead('<html><body>hi</body></html>', PAGE_URL)
    expect(meta.title).toBeUndefined()
    expect(meta.og).toEqual({})
    expect(meta.twitter).toEqual({})
  })
})

describe('resolveUrl', () => {
  it('resolves relative against base', () => {
    expect(resolveUrl('/img.png', PAGE_URL)).toBe('https://example.com/img.png')
  })
  it('passes through absolute URLs', () => {
    expect(resolveUrl('https://cdn.example.com/img.png', PAGE_URL)).toBe('https://cdn.example.com/img.png')
  })
  it('returns undefined for undefined or garbage input', () => {
    expect(resolveUrl(undefined, PAGE_URL)).toBeUndefined()
    expect(resolveUrl('http://', PAGE_URL)).toBeUndefined()
  })
})
