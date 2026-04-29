import { describe, it, expect } from 'vitest'
import { convertHtmlToMdx } from '@/lib/html-to-mdx-engine'

describe('convertHtmlToMdx', () => {
  it('converts <h1> to # heading', async () => {
    const out = await convertHtmlToMdx('<h1>Hello</h1>')
    expect(out.trim()).toBe('# Hello')
  })

  it('converts <p>...<strong>...</strong></p> to bold Markdown', async () => {
    const out = await convertHtmlToMdx('<p>This is <strong>bold</strong>.</p>')
    expect(out.trim()).toContain('**bold**')
  })

  it('converts <ul><li> to a Markdown list', async () => {
    const out = await convertHtmlToMdx('<ul><li>One</li><li>Two</li></ul>')
    expect(out).toContain('* One')
    expect(out).toContain('* Two')
  })

  it('preserves <a href> as Markdown link', async () => {
    const out = await convertHtmlToMdx(
      '<p><a href="https://example.com">Example</a></p>',
    )
    expect(out.trim()).toBe('[Example](https://example.com)')
  })

  it('converts <pre><code> with class to fenced block with language', async () => {
    const out = await convertHtmlToMdx(
      '<pre><code class="language-typescript">const x = 1</code></pre>',
    )
    expect(out).toMatch(/```(typescript|ts)/)
    expect(out).toContain('const x = 1')
  })

  it('converts simple <table> to a Markdown table (with remark-gfm)', async () => {
    const html =
      '<table><thead><tr><th>X</th><th>Y</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
    const out = await convertHtmlToMdx(html)
    expect(out).toContain('| X | Y |')
    expect(out).toContain('| 1 | 2 |')
  })

  it('preserves <details>/<summary> content (losslessness for unknown elements)', async () => {
    const html =
      '<details><summary>Click me</summary><p>Hidden content</p></details>'
    const out = await convertHtmlToMdx(html)
    // Either the elements pass through as raw HTML (acceptable — valid MDX),
    // OR the inner content is preserved as Markdown. Both are lossless.
    // What's NOT acceptable: silent drop of "Click me" or "Hidden content".
    expect(out).toMatch(/Click me/)
    expect(out).toMatch(/Hidden content/)
  })

  it('returns empty string for empty input', async () => {
    expect((await convertHtmlToMdx('')).trim()).toBe('')
  })
})
