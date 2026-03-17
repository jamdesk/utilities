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

/**
 * Parse MDX content into an AST tree.
 */
export async function parseMdxToAst(input: string): Promise<Root> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter)

  return processor.parse(input)
}

/**
 * Validate MDX content, returning structured errors with positions.
 * Uses remark-mdx parsing which throws on malformed JSX (unclosed tags, etc).
 */
export async function validateMdx(input: string): Promise<ValidationResult> {
  const errors: ValidationError[] = []

  try {
    // Parse the MDX -- remark-mdx throws VFileMessages for syntax errors
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkFrontmatter)
      .use(remarkStringify)

    const file = await processor.process(input)

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
    const line = extractLine(err)
    const column = extractColumn(err)
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
 */
export async function stripMdxToMarkdown(input: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkStripMdx)
    .use(remarkStringify)

  const file = await processor.process(input)
  return String(file)
}

/**
 * Remark plugin that strips MDX-specific nodes from the AST:
 * - Removes mdxjsEsm (import/export declarations)
 * - Unwraps mdxJsxFlowElement/mdxJsxTextElement with children
 * - Removes self-closing JSX elements (no children)
 */
function remarkStripMdx() {
  return (tree: Root) => {
    // Remove ESM nodes (imports/exports)
    visit(tree, 'mdxjsEsm', (_node, index, parent) => {
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        return [SKIP, index]
      }
    })

    // Handle JSX flow elements (block-level)
    visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        const jsxNode = node as unknown as { children: RootContent[] }
        if (jsxNode.children && jsxNode.children.length > 0) {
          // Unwrap: replace node with its children
          parent.children.splice(
            index,
            1,
            ...(jsxNode.children as typeof parent.children)
          )
          return [SKIP, index]
        } else {
          // Self-closing: remove entirely
          parent.children.splice(index, 1)
          return [SKIP, index]
        }
      }
    })

    // Handle JSX text elements (inline)
    visit(tree, 'mdxJsxTextElement', (node, index, parent) => {
      if (parent && typeof index === 'number') {
        const jsxNode = node as unknown as { children: RootContent[] }
        if (jsxNode.children && jsxNode.children.length > 0) {
          parent.children.splice(
            index,
            1,
            ...(jsxNode.children as typeof parent.children)
          )
          return [SKIP, index]
        } else {
          parent.children.splice(index, 1)
          return [SKIP, index]
        }
      }
    })

    // Remove mdxFlowExpression and mdxTextExpression nodes
    visit(tree, 'mdxFlowExpression', (_node, index, parent) => {
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        return [SKIP, index]
      }
    })

    visit(tree, 'mdxTextExpression', (_node, index, parent) => {
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        return [SKIP, index]
      }
    })
  }
}

/** Extract line number from a VFileMessage-like error */
function extractLine(err: unknown): number {
  // VFileMessage has .line but it may be undefined
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    if (typeof e.line === 'number') return e.line
    // The `name` property may be "line:column"
    if (typeof e.name === 'string') {
      const match = e.name.match(/^(\d+):(\d+)/)
      if (match) return parseInt(match[1], 10)
    }
  }
  return 1
}

/** Extract column number from a VFileMessage-like error */
function extractColumn(err: unknown): number {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    if (typeof e.column === 'number') return e.column
    if (typeof e.name === 'string') {
      const match = e.name.match(/^(\d+):(\d+)/)
      if (match) return parseInt(match[2], 10)
    }
  }
  return 1
}
