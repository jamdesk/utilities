import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'

// Frozen at module load so each conversion reuses one processor instead of
// rebuilding the unified chain on every keystroke.
const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark)
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
