import { describe, it, expect, beforeAll } from 'vitest'
import { renderToString } from 'react-dom/server'
import MdxVsMarkdownPage from '@/app/mdx-vs-markdown/page'
import { mdxVsMarkdownFaqs } from '@/lib/mdx-vs-markdown-faqs'

describe('MDX vs Markdown page', () => {
  let html: string
  beforeAll(() => {
    html = renderToString(<MdxVsMarkdownPage />)
  })

  it('renders the H1', () => {
    expect(html).toContain('<h1')
    expect(html).toContain('MDX vs Markdown')
  })

  it('renders the comparison table', () => {
    expect(html).toContain('<table')
    expect(html).toContain('JSX components')
  })

  it('renders an internal link to the MDX-to-Markdown converter', () => {
    // basePath is injected by Next at request time, not by renderToString
    expect(html).toMatch(/<a [^>]*href="\/mdx-to-markdown"/)
    // Visible link text — guards against the FAQ #3 typed-parts split going wrong.
    expect(html).toContain('MDX to Markdown converter</a>')
  })

  it('renders an internal link to the MDX cheatsheet', () => {
    expect(html).toMatch(/<a [^>]*href="\/mdx-cheatsheet"/)
  })

  it('links out to mdxjs.com (authority signal)', () => {
    expect(html).toMatch(/<a [^>]*href="https:\/\/mdxjs\.com"/)
  })

  it('renders all four FAQ headings', () => {
    // React encodes apostrophes as &#x27; in text content.
    const encode = (s: string) => s.replace(/'/g, '&#x27;')
    for (const faq of mdxVsMarkdownFaqs) {
      expect(html).toContain(encode(faq.question))
    }
  })

  it('contains the lead sentence verbatim', () => {
    // Guards against an accidental rewrite that drifts the AI-Overview-quotable opener.
    expect(html).toContain('MDX is Markdown plus JSX.')
  })

  it('renders 8 comparison rows + 1 header row', () => {
    // Catches accidental row deletion; the row count is the contract.
    const rowMatches = html.match(/<tr/g) ?? []
    expect(rowMatches.length).toBe(9)
  })

  it('renders the decision tree as an ordered list', () => {
    expect(html).toMatch(/<ol[^>]*list-decimal/)
    expect(html).toContain('Decision tree')
  })

  it('renders the byline with the freshness date', () => {
    expect(html).toContain('Maintained by Jamdesk')
    expect(html).toMatch(/<time dateTime="\d{4}-\d{2}-\d{2}"/)
  })
})
