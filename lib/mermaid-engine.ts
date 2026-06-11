// Lazy mermaid wrapper. Import this module only via dynamic import (the
// mermaid package is ~1.5 MB) — see use-lazy-module.ts pattern.
//
// SECURITY: input can arrive via the shareable URL hash (useToolInput), so
// rendered output is attacker-influenceable. securityLevel 'strict' alone is
// not sufficient (history of sanitizer-bypass CVEs) — every SVG string is
// additionally passed through DOMPurify before the component injects it.
import mermaid from 'mermaid'
import DOMPurify from 'dompurify'

/** Preview theme. Maps to a mermaid built-in: dark bg vs the light 'default'. */
export type PreviewTheme = 'dark' | 'light'
const MERMAID_THEME: Record<PreviewTheme, 'dark' | 'default'> = {
  dark: 'dark',
  light: 'default',
}

// Tracks the theme mermaid is currently initialized with (null = never). Theme
// is global state in mermaid, so switching means re-initializing before render.
let currentTheme: PreviewTheme | null = null
function applyConfig(theme: PreviewTheme) {
  // securityLevel 'strict' makes mermaid DOMPurify-sanitize label HTML
  // internally. NOTE: it does NOT disable htmlLabels — mermaid v11 renders
  // flowchart (and most) node labels as HTML inside <foreignObject> regardless
  // of securityLevel, and ignores htmlLabels:false. So sanitizeSvg below must
  // preserve foreignObject (sanitizing its HTML) rather than forbid it; doing
  // the latter silently deleted every label (empty shapes only).
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: MERMAID_THEME[theme] })
  currentTheme = theme
}
// Parser-only callers (validateMermaid) are theme-agnostic: initialize once if
// nothing has been configured yet, but never override a theme already chosen
// for rendering.
function ensureInit() {
  if (currentTheme === null) applyConfig('dark')
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

// DOMPurify deliberately does not sanitize CSS. Mermaid's own theming
// <style> block must survive, so instead of forbidding style we strip the
// network-capable constructs: @import rules and any url() that is not a
// local fragment reference like url(#marker).
const NETWORK_CSS = /@import[^;{}]*;?|url\((?!\s*['"]?\s*#)[^)]*\)/gi

function stripNetworkCss(css: string): string {
  return css.replace(NETWORK_CSS, (m) => (m.toLowerCase().startsWith('@import') ? '' : 'none'))
}

/**
 * Second sanitization layer over mermaid's own (defense-in-depth: input can
 * arrive via the share-URL hash, and strict mode has a CVE history).
 * Exported for direct testing.
 *
 * Mermaid v11 emits node labels as HTML inside <foreignObject>, so a naive
 * single-pass DOMPurify call is impossible here: DOMPurify's SVG profile
 * empties foreignObject (the SVG↔HTML namespace boundary), deleting every
 * label. We therefore sanitize in two passes:
 *
 *   1. LABELS — allowlist-sanitize each <foreignObject>'s inner HTML with the
 *      HTML profile (where DOMPurify works correctly), preserving the styled
 *      div/span.nodeLabel/p markup while stripping scripts/handlers.
 *   2. SKELETON — scrub the surrounding SVG: drop <script>/<feImage>, strip
 *      every on* handler, drop any href/xlink:href that is not a local #ref
 *      (kills javascript:/external/data: in one rule — strict-mode mermaid only
 *      uses internal #refs), and neutralize network-capable CSS.
 *
 * XSS (script execution) is fully closed. A residual low-severity vector
 * remains — a markdown image label can still load an external <img> (a
 * beacon) — but that only reveals the victim opened a link the attacker
 * already sent them, and forbidding <img> would break legitimate image labels.
 */
export function sanitizeSvg(svg: string): string {
  // Parse as an HTML fragment — matches how the component injects the result
  // (innerHTML) and never throws on imperfect markup (unlike image/svg+xml).
  const tpl = document.createElement('template')
  tpl.innerHTML = svg
  const root = tpl.content.querySelector('svg')
  if (!root) return ''

  // Pass 1: foreignObject HTML labels — allowlist sanitize.
  root.querySelectorAll('foreignObject').forEach((fo) => {
    fo.innerHTML = DOMPurify.sanitize(fo.innerHTML, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    })
  })

  // Pass 2: SVG skeleton scrub. feImage loads an external href at render time
  // (network beacon); <script> never appears in mermaid output.
  root.querySelectorAll('script, feImage, feimage').forEach((n) => n.remove())
  // querySelectorAll('*') excludes the root element itself, so include it —
  // a malicious on*/href/style attribute on the <svg> root must be scrubbed too.
  ;[root, ...root.querySelectorAll('*')].forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
      } else if (name === 'href' || name === 'xlink:href') {
        // strict-mode mermaid only emits local fragment refs (url(#marker),
        // <use href="#...">). Anything else is injected — drop it.
        if (!attr.value.trim().startsWith('#')) el.removeAttribute(attr.name)
      } else if (name === 'style') {
        el.setAttribute('style', stripNetworkCss(attr.value))
      }
    }
  })
  root.querySelectorAll('style').forEach((styleEl) => {
    styleEl.textContent = stripNetworkCss(styleEl.textContent || '')
  })

  return root.outerHTML
}

let renderSeq = 0
/** Browser-only: parse + render to a SANITIZED SVG string. Throws on invalid input. */
export async function renderMermaid(code: string, theme: PreviewTheme = 'dark'): Promise<string> {
  if (currentTheme !== theme) applyConfig(theme)
  renderSeq += 1
  const { svg } = await mermaid.render(`jd-mermaid-${renderSeq}`, code)
  return sanitizeSvg(svg)
}
