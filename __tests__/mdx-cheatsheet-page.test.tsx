import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import MdxCheatsheetPage from '@/app/mdx-cheatsheet/page'
import {
  cheatsheetGroups,
  cheatsheetEntries,
  cheatsheetFaqs,
} from '@/lib/mdx-cheatsheet-data'

describe('MDX Cheatsheet page', () => {
  it('renders the H1', () => {
    const html = renderToString(MdxCheatsheetPage())
    expect(html).toContain('<h1')
    expect(html).toContain('MDX Cheatsheet')
  })

  it('renders one H2 section per group', () => {
    const html = renderToString(MdxCheatsheetPage())
    expect(cheatsheetGroups.length).toBeGreaterThan(1)
    for (const group of cheatsheetGroups) {
      expect(html).toContain(group.heading)
    }
  })

  it('renders one row per cheatsheet entry across all groups', () => {
    const html = renderToString(MdxCheatsheetPage())
    const matches = html.match(/data-cheatsheet-row/g) ?? []
    expect(matches.length).toBe(cheatsheetEntries.length)
  })

  it('emits a [data-snippet] attribute on every <pre>', () => {
    const html = renderToString(MdxCheatsheetPage())
    const snippetMatches = html.match(/data-snippet=/g) ?? []
    expect(snippetMatches.length).toBe(cheatsheetEntries.length)
  })

  it('renders an internal link to the MDX validator', () => {
    // basePath is injected by Next at request time, not by renderToString
    const html = renderToString(MdxCheatsheetPage())
    expect(html).toMatch(/<a [^>]*href="\/mdx-validator"/)
  })

  it('renders the actual snippet body inside each <pre>', () => {
    // Catches a regression where a refactor renders entry.label twice and
    // entry.snippet zero times — count-only assertions wouldn't notice.
    const html = renderToString(MdxCheatsheetPage())
    expect(html).toContain('# H1')
    expect(html).toContain('title: My Page')
  })

  it('links out to mdxjs.com (authority signal)', () => {
    const html = renderToString(MdxCheatsheetPage())
    expect(html).toMatch(/<a [^>]*href="https:\/\/mdxjs\.com"/)
  })

  it('renders every FAQ question', () => {
    const html = renderToString(MdxCheatsheetPage())
    expect(html).toContain('Frequently Asked Questions')
    // React encodes apostrophes as &#x27; in attribute and text content.
    const encode = (s: string) => s.replace(/'/g, '&#x27;')
    for (const faq of cheatsheetFaqs) {
      expect(html).toContain(encode(faq.question))
    }
  })

  it('surfaces an updated date near the H1', () => {
    const html = renderToString(MdxCheatsheetPage())
    // The freshness pill renders as: Updated <time dateTime="YYYY-MM-DD">YYYY-MM-DD</time>
    expect(html).toMatch(/Updated\s*<time/)
  })

  it('covers the gap-fix entries (Markdown basics, MDX gotchas, GFM extras)', () => {
    const labels = cheatsheetEntries.map((e) => e.label)
    expect(labels).toContain('Lists')
    expect(labels).toContain('Links and images')
    expect(labels).toContain('Inline formatting')
    expect(labels).toContain('Blockquotes')
    expect(labels).toContain('Footnotes')
    expect(labels).toContain('GFM extras')
    expect(labels).toContain('Escaping curly braces')
    expect(labels).toContain('Markdown inside components (the gotcha)')
  })
})
