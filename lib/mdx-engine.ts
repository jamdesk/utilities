import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import type { Root, RootContent } from 'mdast'
import { visit, SKIP } from 'unist-util-visit'

export interface ValidationError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

// Cached pipelines — unified processors are frozen after first use,
// but parse() and process() handle that correctly.
const baseProcessor = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter)
const validateProcessor = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkStringify)
const stripProcessor = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkStripMdx).use(remarkStringify)

/**
 * Parse MDX content into an AST tree.
 */
export async function parseMdxToAst(input: string): Promise<Root> {
  return baseProcessor.parse(input)
}

/**
 * Validate MDX content, returning structured errors with positions.
 * Uses remark-mdx parsing which throws on malformed JSX (unclosed tags, etc).
 */
export async function validateMdx(input: string): Promise<ValidationResult> {
  const errors: ValidationError[] = []

  try {
    // Parse the MDX -- remark-mdx throws VFileMessages for syntax errors
    const file = await validateProcessor.process(input)

    // Collect any warnings/errors from the VFile
    for (const msg of file.messages) {
      errors.push({
        line: msg.line ?? 1,
        column: msg.column ?? 1,
        message: msg.reason || msg.message,
        severity: msg.fatal ? 'error' : 'warning',
      })
    }
  } catch (err: unknown) {
    // Parse errors (e.g., unclosed JSX tags) are thrown as VFileMessages
    const { line, column } = extractPosition(err)
    const message =
      err instanceof Error ? err.message : 'Unknown parse error'

    errors.push({
      line,
      column,
      message,
      severity: 'error',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Strip MDX-specific syntax (JSX components, imports, exports) and return
 * plain markdown. JSX wrappers with children are unwrapped (children kept),
 * self-closing components are removed entirely.
 *
 * Options:
 * - `stripFrontmatter`: Also remove the YAML frontmatter block.
 */
export async function stripMdxToMarkdown(
  input: string,
  options?: { stripFrontmatter?: boolean }
): Promise<string> {
  if (options?.stripFrontmatter) {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkFrontmatter)
      .use(remarkStripMdx)
      .use(remarkStripFrontmatter)
      .use(remarkStringify)
    const file = await processor.process(input)
    return String(file)
  }
  const file = await stripProcessor.process(input)
  return String(file)
}

/**
 * Remark plugin that strips YAML frontmatter nodes from the AST.
 */
function remarkStripFrontmatter() {
  return (tree: Root) => {
    visit(tree, 'yaml', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return
      parent.children.splice(index, 1)
      return [SKIP, index]
    })
  }
}

/**
 * Remark plugin that strips MDX-specific nodes from the AST:
 * - Removes mdxjsEsm (import/export declarations)
 * - Removes mdxFlowExpression and mdxTextExpression
 * - Unwraps mdxJsxFlowElement/mdxJsxTextElement with children
 * - Removes self-closing JSX elements (no children)
 */
function remarkStripMdx() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (!parent || typeof index !== 'number') return

      switch (node.type) {
        case 'mdxjsEsm':
        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          parent.children.splice(index, 1)
          return [SKIP, index]

        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement': {
          const jsxNode = node as unknown as { children: RootContent[] }
          if (jsxNode.children?.length > 0) {
            parent.children.splice(index, 1, ...(jsxNode.children as typeof parent.children))
          } else {
            parent.children.splice(index, 1)
          }
          return [SKIP, index]
        }
      }
    })
  }
}

/** Extract line and column from a VFileMessage-like error */
function extractPosition(err: unknown): { line: number; column: number } {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    const line = typeof e.line === 'number' ? e.line : undefined
    const column = typeof e.column === 'number' ? e.column : undefined
    if (line !== undefined && column !== undefined) return { line, column }
    if (typeof e.name === 'string') {
      const match = e.name.match(/^(\d+):(\d+)/)
      if (match) return { line: parseInt(match[1], 10), column: parseInt(match[2], 10) }
    }
  }
  return { line: 1, column: 1 }
}
