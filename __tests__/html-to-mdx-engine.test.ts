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

  describe('security stripping', () => {
    it('strips <script> blocks (no executable JS in MDX output)', async () => {
      const out = await convertHtmlToMdx(
        '<p>Before</p><script>alert("xss")</script><p>After</p>',
      )
      expect(out).not.toContain('alert')
      expect(out).not.toMatch(/<script/i)
      expect(out).toContain('Before')
      expect(out).toContain('After')
    })

    it('strips <style> blocks', async () => {
      const out = await convertHtmlToMdx(
        '<style>body { background: red }</style><p>Visible</p>',
      )
      expect(out).not.toMatch(/<style/i)
      expect(out).not.toContain('background: red')
      expect(out).toContain('Visible')
    })

    it('strips inline event handlers (onclick, onload)', async () => {
      const out = await convertHtmlToMdx(
        '<a href="https://example.com" onclick="alert(1)">Link</a>',
      )
      expect(out).not.toContain('onclick')
      expect(out).not.toContain('alert(1)')
      expect(out).toContain('[Link](https://example.com)')
    })

    it('strips event handlers from non-anchor elements', async () => {
      const cases = [
        '<button onclick="alert(1)">Click</button>',
        '<div onclick="alert(1)">hi</div>',
        '<img onerror="alert(1)" src="https://x.test/y.png" alt="z">',
        '<svg onload="alert(1)"><circle r="10"/></svg>',
        '<details onclick="alert(1)"><summary>S</summary><p>P</p></details>',
      ]
      for (const html of cases) {
        const out = await convertHtmlToMdx(html)
        expect(out).not.toMatch(/onclick|onerror|onload/i)
        expect(out).not.toContain('alert(1)')
      }
    })

    it('strips javascript: URLs from <a href>', async () => {
      for (const href of [
        'javascript:alert(1)',
        'JaVaScRiPt:alert(1)',
        '  javascript:alert(1)  ',
        'java\tscript:alert(1)',
        'vbscript:msgbox',
      ]) {
        const out = await convertHtmlToMdx(`<a href="${href}">go</a>`)
        expect(out).not.toMatch(/javascript:/i)
        expect(out).not.toMatch(/vbscript:/i)
        expect(out).not.toContain('alert(1)')
      }
    })

    it('strips data:text/html from <a href> but preserves data:image/* in <img>', async () => {
      const navOut = await convertHtmlToMdx(
        '<a href="data:text/html,<script>alert(1)</script>">x</a>',
      )
      expect(navOut).not.toContain('data:text/html')
      expect(navOut).not.toContain('alert(1)')

      const imgOut = await convertHtmlToMdx(
        '<img src="data:image/svg+xml;base64,abc" alt="z">',
      )
      expect(imgOut).toContain('data:image/svg+xml')
    })

    it('strips protocol-relative URLs from <a href>', async () => {
      const out = await convertHtmlToMdx('<a href="//evil.example/x">go</a>')
      expect(out).not.toContain('//evil.example')
    })

    it('strips javascript: URLs from <img src>', async () => {
      const out = await convertHtmlToMdx(
        '<img src="javascript:alert(1)" alt="x">',
      )
      expect(out).not.toMatch(/javascript:/i)
      expect(out).not.toContain('alert(1)')
    })

    it('preserves safe URL schemes (https, mailto, tel, fragment, relative)', async () => {
      for (const href of [
        'https://example.com',
        'http://example.com',
        'mailto:x@y.com',
        'tel:+1234',
        '#section',
        '/relative/path',
      ]) {
        const out = await convertHtmlToMdx(`<a href="${href}">x</a>`)
        expect(out).toContain(href)
      }
    })
  })
})
