import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import MdxVsMarkdownPage from '@/app/mdx-vs-markdown/page'
import { mdxVsMarkdownFaqs } from '@/app/mdx-vs-markdown/layout'

describe('MDX vs Markdown page', () => {
  it('renders the H1', () => {
    const html = renderToString(MdxVsMarkdownPage())
    expect(html).toContain('<h1')
    expect(html).toContain('MDX vs Markdown')
  })

  it('renders the comparison table', () => {
    const html = renderToString(MdxVsMarkdownPage())
    expect(html).toContain('<table')
    expect(html).toContain('JSX components')
  })

  it('renders an internal link to the MDX-to-Markdown converter', () => {
    // basePath is injected by Next at request time, not by renderToString
    const html = renderToString(MdxVsMarkdownPage())
    expect(html).toMatch(/<a [^>]*href="\/mdx-to-markdown"/)
  })

  it('renders all four FAQ headings', () => {
    const html = renderToString(MdxVsMarkdownPage())
    // React encodes apostrophes as &#x27; in text content.
    const encode = (s: string) => s.replace(/'/g, '&#x27;')
    for (const faq of mdxVsMarkdownFaqs) {
      expect(html).toContain(encode(faq.question))
    }
  })

  it('contains the lead sentence verbatim', () => {
    // Guards against an accidental rewrite that drifts the AI-Overview-quotable opener.
    const html = renderToString(MdxVsMarkdownPage())
    expect(html).toContain('MDX is Markdown plus JSX.')
  })

  it('renders 8 comparison rows + 1 header row', () => {
    // Catches accidental row deletion; the row count is the contract.
    const html = renderToString(MdxVsMarkdownPage())
    const rowMatches = html.match(/<tr/g) ?? []
    expect(rowMatches.length).toBe(9)
  })

  it('renders the decision tree as an ordered list', () => {
    const html = renderToString(MdxVsMarkdownPage())
    expect(html).toMatch(/<ol[^>]*list-decimal/)
    expect(html).toContain('Decision tree')
  })

  it('renders the byline with the freshness date', () => {
    const html = renderToString(MdxVsMarkdownPage())
    expect(html).toContain('Maintained by Jamdesk')
    expect(html).toMatch(/<time dateTime="\d{4}-\d{2}-\d{2}"/)
  })
})
