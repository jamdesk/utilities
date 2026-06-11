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

  // Mermaid v11 renders node labels as HTML inside <foreignObject> and ignores
  // htmlLabels:false, so the sanitizer MUST preserve foreignObject (sanitizing
  // its HTML) — forbidding it outright deletes every label (regression guard:
  // the shipped tool rendered empty shapes for ~3 months until this was found).
  it('preserves foreignObject label markup (text + nodeLabel class)', () => {
    // Mirrors real mermaid v11 flowchart-node output.
    const labelSvg =
      '<svg xmlns="http://www.w3.org/2000/svg"><g class="node">' +
      '<rect class="basic label-container" width="120" height="40"></rect>' +
      '<g class="label"><foreignObject width="100" height="24">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: nowrap; text-align: center;">' +
      '<span class="nodeLabel"><p>User Request</p></span></div>' +
      '</foreignObject></g></g></svg>'
    const clean = sanitizeSvg(labelSvg)
    expect(clean).toContain('User Request')
    expect(clean).toContain('foreignObject')
    expect(clean).toContain('nodeLabel')
  })

  it('sanitizes XSS inside a foreignObject label but keeps the text', () => {
    const hostile =
      '<svg xmlns="http://www.w3.org/2000/svg"><g class="node"><foreignObject>' +
      '<div xmlns="http://www.w3.org/1999/xhtml"><span class="nodeLabel">' +
      '<p>Safe Label<img src="x" onerror="alert(1)" /><script>alert(2)<\/script></p>' +
      '</span></div></foreignObject></g></svg>'
    const clean = sanitizeSvg(hostile)
    expect(clean).toContain('Safe Label')
    expect(clean).not.toContain('onerror')
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('alert(2)')
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
    expect(clean).toContain('style="background:none"')
    expect(clean).toContain('<rect')
  })

  it('strips uppercase @IMPORT without leaving residue', () => {
    const dirty = '<svg><style>@IMPORT url("https://evil.example/x.css"); .a{fill:red}</style></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('evil.example')
    expect(clean).not.toContain('none')
    expect(clean).toContain('fill:red')
  })

  it('keeps whitespace-padded local fragment refs', () => {
    const dirty = '<svg><style>.y{fill:url( #grad)}</style></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).toContain('url( #grad)')
  })

  it('strips feImage (external-href network beacon allowed by the svgFilters profile)', () => {
    const dirty = '<svg><filter id="f"><feImage href="http://evil.example/x.png"/></filter><circle r="5"/></svg>'
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain('feImage')
    expect(clean).not.toContain('evil.example')
    expect(clean).toContain('<circle')
  })
})
