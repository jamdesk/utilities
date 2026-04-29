import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import MdxCheatsheetPage from '@/app/mdx-cheatsheet/page'
import { cheatsheetEntries } from '@/lib/mdx-cheatsheet-data'

describe('MDX Cheatsheet page', () => {
  it('renders the H1', () => {
    const html = renderToString(MdxCheatsheetPage())
    expect(html).toContain('<h1')
    expect(html).toContain('MDX Cheatsheet')
  })

  it('renders one row per cheatsheet entry', () => {
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
})
