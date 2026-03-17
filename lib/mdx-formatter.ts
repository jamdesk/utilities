import { format } from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginMarkdown from 'prettier/plugins/markdown'
import * as prettierPluginHtml from 'prettier/plugins/html'

export interface FormatResult {
  formatted: string
  error: string | null
}

/**
 * Normalize leading whitespace on markdown lines.
 * Prettier's MDX parser formats JSX and imports but leaves markdown
 * indentation untouched (4+ spaces = code block in Markdown).
 * This preprocessor strips leading spaces from lines that are clearly
 * markdown content (headings, paragraphs, lists) rather than code blocks.
 */
function normalizeMarkdownIndentation(input: string): string {
  const lines = input.split('\n')
  const result: string[] = []
  let inFrontmatter = false
  let inCodeBlock = false

  for (const line of lines) {
    // Track frontmatter boundaries
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter
      result.push(line.trimStart())
      continue
    }

    // Track fenced code blocks
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      result.push(line.trimStart())
      continue
    }

    // Don't touch lines inside code blocks or frontmatter
    if (inCodeBlock || inFrontmatter) {
      result.push(line)
      continue
    }

    // Strip leading whitespace from markdown content lines
    const trimmed = line.trimStart()

    // Empty lines stay empty
    if (trimmed === '') {
      result.push('')
      continue
    }

    // These are clearly markdown, not indented code: strip leading spaces
    // Headings, list items, blockquotes, JSX tags, import/export, thematic breaks
    if (
      /^#{1,6}\s/.test(trimmed) ||     // headings
      /^[-*+]\s/.test(trimmed) ||       // unordered list items
      /^\d+[.)]\s/.test(trimmed) ||     // ordered list items
      /^>/.test(trimmed) ||             // blockquotes
      /^<[A-Z/]/.test(trimmed) ||       // JSX components
      /^import\s/.test(trimmed) ||      // import statements
      /^export\s/.test(trimmed) ||      // export statements
      /^---\s*$/.test(trimmed) ||       // thematic breaks
      /^\|/.test(trimmed)               // table rows
    ) {
      result.push(trimmed)
      continue
    }

    // For regular paragraph text: strip if it has excessive leading whitespace (4+)
    // but preserve intentional 1-3 space indentation (continuation lines)
    const leadingSpaces = line.length - trimmed.length
    if (leadingSpaces >= 4) {
      result.push(trimmed)
    } else {
      result.push(line)
    }
  }

  return result.join('\n')
}

export interface FormatOptions {
  tabWidth?: number
  sortFrontmatter?: boolean
  trimTrailingWhitespace?: boolean
  collapseBlankLines?: boolean
  printWidth?: number
}

/**
 * Sort YAML frontmatter keys alphabetically.
 * Detects the `---` delimited block at the start of the file, parses key-value
 * lines, sorts by key, and reassembles.
 */
function sortFrontmatterKeys(input: string): string {
  const match = input.match(/^(---\r?\n)([\s\S]*?\r?\n)(---(?:\r?\n|$))/)
  if (!match) return input

  const [fullMatch, openFence, body, closeFence] = match
  const lines = body.split('\n').filter((l) => l.trim() !== '')
  // Simple key: value lines — don't reorder multiline values or nested YAML
  const sortable = lines.every((l) => /^\S+:/.test(l))
  if (!sortable) return input

  const sorted = [...lines].sort((a, b) => {
    const keyA = a.split(':')[0].toLowerCase()
    const keyB = b.split(':')[0].toLowerCase()
    return keyA.localeCompare(keyB)
  })

  return input.replace(fullMatch, openFence + sorted.join('\n') + '\n' + closeFence)
}

/**
 * Trim trailing whitespace from every line.
 */
function trimTrailingWhitespaceLines(input: string): string {
  return input.split('\n').map((line) => line.trimEnd()).join('\n')
}

/**
 * Collapse 3+ consecutive blank lines down to 2.
 */
function collapseConsecutiveBlankLines(input: string): string {
  return input.replace(/(\n\s*){3,}\n/g, '\n\n\n')
}

export async function formatMdx(
  input: string,
  options?: FormatOptions
): Promise<FormatResult> {
  try {
    if (!input.trim()) {
      return { formatted: '', error: null }
    }

    // Pre-process: sort frontmatter if requested
    let processed = options?.sortFrontmatter ? sortFrontmatterKeys(input) : input

    // Normalize markdown indentation before Prettier (which only formats JSX/imports)
    const normalized = normalizeMarkdownIndentation(processed)

    let formatted = await format(normalized, {
      parser: 'mdx',
      plugins: [
        prettierPluginBabel,
        prettierPluginEstree,
        prettierPluginMarkdown,
        prettierPluginHtml,
      ],
      tabWidth: options?.tabWidth ?? 2,
      printWidth: options?.printWidth ?? 80,
      proseWrap: 'preserve',
    })

    // Post-process: trim trailing whitespace
    if (options?.trimTrailingWhitespace) {
      formatted = trimTrailingWhitespaceLines(formatted)
    }

    // Post-process: collapse blank lines
    if (options?.collapseBlankLines) {
      formatted = collapseConsecutiveBlankLines(formatted)
    }

    return { formatted, error: null }
  } catch (err) {
    return {
      formatted: input,
      error: err instanceof Error ? err.message : 'Unknown formatting error',
    }
  }
}
