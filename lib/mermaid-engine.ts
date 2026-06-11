// Lazy mermaid wrapper. Import this module only via dynamic import (the
// mermaid package is ~1.5 MB) — see use-lazy-module.ts pattern.
//
// SECURITY: input can arrive via the shareable URL hash (useToolInput), so
// rendered output is attacker-influenceable. securityLevel 'strict' alone is
// not sufficient (history of sanitizer-bypass CVEs) — every SVG string is
// additionally passed through DOMPurify before the component injects it.
import mermaid from 'mermaid'
import DOMPurify from 'dompurify'

let initialized = false
function ensureInit() {
  if (initialized) return
  // strict mode also disables htmlLabels, so no foreignObject is needed and
  // we can forbid it outright in sanitization below.
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'dark' })
  initialized = true
}

export type ValidationResult = { valid: true } | { valid: false; error: string }

export async function validateMermaid(code: string): Promise<ValidationResult> {
  if (!code.trim()) return { valid: false, error: 'Empty diagram — enter Mermaid syntax.' }
  ensureInit()
  try {
    await mermaid.parse(code)
    return { valid: true }
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid Mermaid syntax',
    }
  }
}

/** Second sanitization layer over mermaid's own. Exported for direct testing. */
export function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    // foreignObject embeds arbitrary HTML inside SVG — the classic vector.
    FORBID_TAGS: ['foreignObject'],
  })
}

let renderSeq = 0
/** Browser-only: parse + render to a SANITIZED SVG string. Throws on invalid input. */
export async function renderMermaid(code: string): Promise<string> {
  ensureInit()
  renderSeq += 1
  const { svg } = await mermaid.render(`jd-mermaid-${renderSeq}`, code)
  return sanitizeSvg(svg)
}
