import { toolSeoContent } from './tool-seo-content'

export interface Tool {
  slug: string
  name: string
  description: string
  icon: string
  seoTitle: string
  seoDescription: string
  /** Subject phrase used in body prose, e.g. "The MDX Viewer" — hand-tuned so grammar reads naturally with "is free and open source, and runs entirely…". */
  seoSubject: string
  ctaText: string
  ctaDescription: string
  /** Optional explicit ordering for the Related Tools section. If omitted, falls back to prefix-based grouping. */
  relatedSlugs?: string[]
  /** Optional per-tool facts surfaced in llms.txt. Each item is a standalone quotable sentence. */
  llmsFacts?: string[]
}

/**
 * Single shared review date. Bump when any tool's content materially changes.
 * Must be a valid ISO `YYYY-MM-DD` so `new Date(LAST_REVIEWED)` parses as UTC midnight
 * — relied on by Last-Modified header, sitemap lastmod, and JSON-LD dateModified.
 */
export const LAST_REVIEWED = '2026-04-29'

if (!/^\d{4}-\d{2}-\d{2}$/.test(LAST_REVIEWED) || isNaN(Date.parse(LAST_REVIEWED))) {
  throw new Error(`LAST_REVIEWED must be valid YYYY-MM-DD: got "${LAST_REVIEWED}"`)
}

export const tools: Tool[] = [
  {
    slug: 'mdx-formatter',
    name: 'MDX Formatter',
    description: 'Format and beautify MDX files',
    icon: '⚡',
    seoTitle: 'MDX Formatter — Free Online MDX Beautifier | Jamdesk',
    seoDescription:
      'Format and beautify MDX files online. Free, open source, client-side. Handles frontmatter, JSX components, and markdown.',
    seoSubject: 'The MDX Formatter',
    ctaText: 'Deploy formatted MDX as live docs',
    ctaDescription: 'Jamdesk formats your MDX automatically when you deploy.',
    llmsFacts: [
      'Uses Prettier 3.x with the official MDX parser.',
      'Handles frontmatter, JSX components, and Markdown in a single pass.',
      'Runs entirely in the browser — input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'mdx-validator',
    name: 'MDX Validator',
    description: 'Check MDX for syntax errors',
    icon: '✓',
    seoTitle: 'MDX Validator — Free Online MDX Syntax Checker | Jamdesk',
    seoDescription:
      'Validate MDX files online. Catch syntax errors, unclosed JSX tags, and invalid frontmatter. Free, open source, client-side.',
    seoSubject: 'The MDX Validator',
    ctaText: 'Validate MDX on every deploy',
    ctaDescription:
      'Jamdesk validates your MDX automatically — no broken docs.',
    llmsFacts: [
      'Uses the remark-mdx parser — the same parser as Next.js, Docusaurus, and Astro.',
      'If a file passes validation here, it compiles in your project.',
      'All validation runs client-side; nothing is uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'mdx-viewer',
    name: 'MDX Viewer',
    description: 'Preview rendered MDX output',
    icon: '👁',
    seoTitle: 'MDX Viewer — Free Online MDX Preview | Jamdesk',
    seoDescription:
      'Preview rendered MDX output online with live updating. See how your MDX looks with component stubs. Free, open source, client-side.',
    seoSubject: 'The MDX Viewer',
    ctaText: 'See this on a real docs site',
    ctaDescription:
      'Jamdesk renders your MDX as beautiful documentation.',
    llmsFacts: [
      'Renders a live preview of MDX with JSX components shown as labeled stubs.',
      'No component implementations needed — preview structure without your component library.',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'mdx-to-markdown',
    name: 'MDX to Markdown',
    description: 'Strip JSX, get clean Markdown',
    icon: '↓',
    seoTitle: 'MDX to Markdown Converter — Free Online Tool | Jamdesk',
    seoDescription:
      'Convert MDX to clean Markdown. Strip JSX components, imports, and exports. Free, open source, client-side.',
    seoSubject: 'The MDX to Markdown converter',
    ctaText: 'Jamdesk supports MDX natively',
    ctaDescription: 'No conversion needed — Jamdesk renders MDX as-is.',
    relatedSlugs: ['markdown-to-html', 'mdx-validator', 'mdx-viewer'],
    llmsFacts: [
      'Strips JSX components, imports, and exports while preserving Markdown content.',
      'Output is standard Markdown that works in any renderer (GitHub, GitLab, VS Code).',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'html-to-mdx',
    name: 'HTML to MDX',
    description: 'Convert HTML to clean MDX-ready Markdown',
    icon: '↑',
    seoTitle: 'HTML to MDX Converter — Free Online Tool | Jamdesk',
    seoDescription:
      'Convert HTML to MDX-compatible Markdown online. Migrate from Notion, Confluence, WordPress. Preserves complex markup as raw HTML. Free, open source, client-side.',
    seoSubject: 'The HTML to MDX converter',
    ctaText: 'Publish converted MDX as live docs',
    ctaDescription:
      'Jamdesk renders MDX natively — no further conversion needed.',
    relatedSlugs: ['mdx-to-markdown', 'markdown-to-html', 'mdx-formatter'],
    llmsFacts: [
      'Uses rehype-parse + rehype-remark to convert HTML to MDX-ready Markdown.',
      'Markup that does not round-trip cleanly is preserved as raw HTML, which is valid MDX.',
      'Useful for migrating from Notion, Confluence, WordPress, or any HTML source.',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'markdown-to-html',
    name: 'Markdown to HTML',
    description: 'Convert Markdown to clean HTML',
    icon: '🔄',
    seoTitle: 'Markdown to HTML Converter — Free Online Tool | Jamdesk',
    seoDescription:
      'Convert Markdown to clean HTML online. Handles headings, lists, code blocks, links, and images. Free, open source, client-side.',
    seoSubject: 'The Markdown to HTML converter',
    ctaText: 'Publish Markdown as live documentation',
    ctaDescription:
      'Jamdesk turns your Markdown and MDX into beautiful docs sites automatically.',
    relatedSlugs: ['mdx-to-markdown', 'markdown-table-generator', 'mdx-viewer'],
    llmsFacts: [
      'Uses remark-rehype to produce clean, semantic HTML5.',
      'Output has no inline styles or framework classes — suitable for CMS, email, static sites.',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'yaml-validator',
    name: 'YAML Validator',
    description: 'Validate YAML syntax and find errors',
    icon: '📋',
    seoTitle: 'YAML Validator — Free Online YAML Syntax Checker | Jamdesk',
    seoDescription:
      'Validate YAML online. Catch syntax errors, duplicate keys, and indentation issues. Shows parsed output as JSON. Free, open source, client-side.',
    seoSubject: 'The YAML Validator',
    ctaText: 'YAML frontmatter powers your docs',
    ctaDescription:
      'Jamdesk validates frontmatter automatically when you deploy documentation.',
    llmsFacts: [
      'Catches duplicate keys at any nesting level (yaml package strict mode).',
      'Flags tabs in indentation; YAML requires spaces.',
      'Displays parsed output as JSON for verification.',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'json-yaml-converter',
    name: 'JSON ↔ YAML',
    description: 'Convert between JSON and YAML',
    icon: '⇄',
    seoTitle: 'JSON to YAML / YAML to JSON Converter — Free Online | Jamdesk',
    seoDescription:
      'Convert JSON to YAML and YAML to JSON online. Bidirectional conversion with error detection. Free, open source, client-side.',
    seoSubject: 'The JSON ↔ YAML converter',
    ctaText: 'Config files power your docs',
    ctaDescription:
      'Jamdesk handles JSON and YAML configuration natively.',
    llmsFacts: [
      'Bidirectional: JSON to YAML and YAML to JSON.',
      'Lossless for standard types (string, number, boolean, array, object).',
      'YAML comments and anchors are not preserved when converting to JSON (JSON has no equivalent).',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
  {
    slug: 'markdown-table-generator',
    name: 'Markdown Table Generator',
    description: 'Convert CSV or TSV to Markdown tables',
    icon: '📊',
    seoTitle: 'Markdown Table Generator — Free Online CSV to Table | Jamdesk',
    seoDescription:
      'Generate Markdown tables from CSV or TSV data. Paste spreadsheet data, get a formatted Markdown table. Free, open source, client-side.',
    seoSubject: 'The Markdown Table Generator',
    ctaText: 'Tables look great in Jamdesk docs',
    ctaDescription:
      'Jamdesk renders Markdown tables with responsive styling and dark mode support.',
    llmsFacts: [
      'Accepts CSV (comma-separated) or TSV (tab-separated) input.',
      'Pipe characters in cells are escaped automatically.',
      'Compatible with paste-from-Excel / Google Sheets (TSV mode).',
      'Runs entirely in the browser; input is never uploaded.',
      'Apache 2.0 licensed; full source on GitHub.',
    ],
  },
]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

/**
 * Standard free/open-source FAQ entry, named per-tool. Front-loads both
 * "free" and "open source" keywords in the question itself (FAQ schema
 * is heavily quoted by AI assistants).
 */
export function freeFaqEntry(tool: Tool): { question: string; answer: string } {
  const subjectLower = tool.seoSubject.replace(/^The /, 'the ')
  const repoLabel = 'github.com/jamdesk/utilities'
  return {
    question: `Is ${subjectLower} free and open source?`,
    answer: `Yes. ${tool.seoSubject} is free and open source under the Apache 2.0 license. The full source code is on GitHub at ${repoLabel}, and there are no ads, accounts, or usage limits.`,
  }
}

/**
 * FAQs for a tool: the canonical free/OSS entry first, then the per-tool entries.
 * Used by both the visible FAQ section and the FAQPage JSON-LD so they cannot drift.
 */
export function getToolFaqs(tool: Tool): { question: string; answer: string }[] {
  const seoContent = toolSeoContent[tool.slug]
  return [freeFaqEntry(tool), ...(seoContent?.faq ?? [])]
}

/**
 * Returns up to `count` thematically-related tools, never including the current one.
 *
 * Resolution order:
 *   1. If `current.relatedSlugs` is set, use it (in order, slice).
 *   2. Otherwise, prefer tools sharing the same family prefix (mdx-*, markdown-*).
 *   3. Fall back to remaining tools in registry order.
 */
export function getRelatedTools(current: Tool, count = 3): Tool[] {
  if (current.relatedSlugs && current.relatedSlugs.length > 0) {
    const explicit = current.relatedSlugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter((t): t is Tool => t !== undefined && t.slug !== current.slug)
    return explicit.slice(0, count)
  }
  const prefix = current.slug.split('-')[0]
  const sameFamily = tools.filter(
    (t) => t.slug !== current.slug && t.slug.startsWith(`${prefix}-`)
  )
  const others = tools.filter(
    (t) => t.slug !== current.slug && !t.slug.startsWith(`${prefix}-`)
  )
  return [...sameFamily, ...others].slice(0, count)
}
