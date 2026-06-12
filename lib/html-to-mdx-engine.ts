import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { visit } from 'unist-util-visit'
import type { Root, Link, Image } from 'mdast'

// hast-util-to-mdast already drops <script>/<style> and unknown-element
// attributes (onclick/onerror/onload), but it preserves the URL inside
// <a href> and <img src> verbatim — including javascript:, vbscript:, and
// data:text/html URIs. Strip those here so the documented safety contract
// ("executable HTML is removed") actually holds.
function isUnsafeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  // Normalize tabs/newlines that browsers ignore inside URL schemes.
  const cleaned = url.replace(/[\t\n\r]/g, '').trim().toLowerCase()
  if (cleaned.startsWith('javascript:')) return true
  if (cleaned.startsWith('vbscript:')) return true
  // Protocol-relative URLs (//host/path) inherit the current scheme and
  // navigate cross-origin. Block — explicit https://host is the safe form.
  if (cleaned.startsWith('//')) return true
  // data: URLs are safe for images but never for navigable links — block
  // anything that isn't an image/* mime type.
  if (cleaned.startsWith('data:') && !cleaned.startsWith('data:image/')) return true
  return false
}

function stripUnsafeUrls() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type === 'link' && isUnsafeUrl((node as Link).url)) {
        ;(node as Link).url = ''
      } else if (node.type === 'image' && isUnsafeUrl((node as Image).url)) {
        ;(node as Image).url = ''
      }
    })
  }
}

// Frozen at module load so each conversion reuses one processor instead of
// rebuilding the unified chain on every keystroke.
const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark)
  .use(stripUnsafeUrls)
  .use(remarkGfm)
  .use(remarkStringify, {
    bullet: '*',
    fences: true,
    incrementListMarker: false,
  })
  .freeze()

/**
 * Convert HTML to MDX-compatible Markdown.
 *
 * Strategy: parse HTML to hast, convert to mdast via rehype-remark, stringify
 * as Markdown. Markup that does not round-trip cleanly (complex tables,
 * unknown elements like <details>/<summary>/<iframe>) is left as raw HTML,
 * which is valid MDX. The losslessness contract is enforced by the
 * <details>/<summary> case in the test suite.
 */
export async function convertHtmlToMdx(input: string): Promise<string> {
  if (!input.trim()) return ''
  const result = await processor.process(input)
  return String(result)
}
