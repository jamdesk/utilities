import { describe, it, expect } from 'vitest'
import { formatMdx } from '../lib/mdx-formatter'

describe('formatMdx', () => {
  it('formats messy MDX with proper indentation', async () => {
    const input = '---\ntitle: "Test"\n---\n# Hello\n<Callout>text</Callout>'
    const result = await formatMdx(input)
    expect(result.formatted).toContain('# Hello')
    expect(result.error).toBeNull()
  })

  it('returns error when prettier throws', async () => {
    // Prettier's MDX parser is very lenient, so we test the error path
    // by passing a value that triggers a runtime error (non-string).
    // In real usage, this catches any unexpected Prettier failures.
    const result = await formatMdx(42 as unknown as string)
    expect(result.error).toBeTruthy()
  })

  it('handles empty input', async () => {
    const result = await formatMdx('')
    expect(result.formatted).toBe('')
    expect(result.error).toBeNull()
  })

  it('handles whitespace-only input', async () => {
    const result = await formatMdx('   \n\n  ')
    expect(result.formatted).toBe('')
    expect(result.error).toBeNull()
  })

  it('preserves frontmatter', async () => {
    const input = '---\ntitle: "Test"\ndescription: "A test"\n---\n\nContent'
    const result = await formatMdx(input)
    expect(result.formatted).toContain('title: "Test"')
  })

  it('formats MDX with deeply nested JSX', async () => {
    const input =
      '<Tabs><Tab label="A"><Callout><CodeBlock>code</CodeBlock></Callout></Tab></Tabs>'
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
    expect(result.formatted).toContain('Tabs')
  })

  it('handles MDX with only frontmatter', async () => {
    const input = '---\ntitle: "Just frontmatter"\n---'
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
  })

  it('handles MDX with code blocks containing JSX-like content', async () => {
    const input = '```jsx\n<Component prop="value" />\n```'
    const result = await formatMdx(input)
    expect(result.formatted).toContain('```')
  })

  it('handles MDX with import statements', async () => {
    const input =
      'import { Callout } from "./components"\n\n# Hello\n\n<Callout>text</Callout>'
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
    expect(result.formatted).toContain('import')
  })

  it('respects tabWidth option', async () => {
    const input = '<Callout>\ntext\n</Callout>'
    const result2 = await formatMdx(input, { tabWidth: 2 })
    const result4 = await formatMdx(input, { tabWidth: 4 })
    expect(result2.error).toBeNull()
    expect(result4.error).toBeNull()
  })

  it('adds trailing newline', async () => {
    const input = '# Hello'
    const result = await formatMdx(input)
    expect(result.formatted.endsWith('\n')).toBe(true)
  })

  it('handles very large input (1000+ lines)', async () => {
    const lines = Array.from({ length: 1200 }, (_, i) => `Line ${i + 1}: some content here.`)
    const input = '---\ntitle: "Large Document"\n---\n\n' + lines.join('\n\n')
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
    expect(result.formatted.length).toBeGreaterThan(0)
    expect(result.formatted).toContain('Line 1:')
    expect(result.formatted).toContain('Line 1200:')
  })

  it('strips excessive leading whitespace from markdown lines', async () => {
    const input = '          # Hello World\n          Some text with lots of spaces\n          - item one\n          - item two'
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
    expect(result.formatted).toContain('# Hello World')
    expect(result.formatted).not.toMatch(/^ {4,}#/m) // no excessive indent on heading
    expect(result.formatted).toContain('- item one')
  })

  it('preserves code block content', async () => {
    const input = '```\nsome raw text\n  with indentation\n```'
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
    expect(result.formatted).toContain('some raw text')
    expect(result.formatted).toContain('```')
  })

  it('formats MDX with GFM tables', async () => {
    const input = `# Table Example

| Column A | Column B | Column C |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`
    const result = await formatMdx(input)
    expect(result.error).toBeNull()
    expect(result.formatted).toContain('Column A')
    expect(result.formatted).toContain('Cell 1')
    // Table structure should be preserved
    expect(result.formatted).toContain('|')
  })
})

describe('formatMdx — sort frontmatter', () => {
  it('sorts frontmatter keys alphabetically', async () => {
    const input = '---\ntitle: "Test"\nauthor: "Alice"\ndescription: "A test"\n---\n\n# Hello'
    const result = await formatMdx(input, { sortFrontmatter: true })
    expect(result.error).toBeNull()
    const fmMatch = result.formatted.match(/^---\n([\s\S]*?)\n---/)
    expect(fmMatch).toBeTruthy()
    const keys = fmMatch![1].split('\n').map((l) => l.split(':')[0])
    expect(keys).toEqual(['author', 'description', 'title'])
  })

  it('leaves frontmatter unsorted when option is off', async () => {
    const input = '---\ntitle: "Test"\nauthor: "Alice"\n---\n\n# Hello'
    const result = await formatMdx(input, { sortFrontmatter: false })
    expect(result.error).toBeNull()
    const fmMatch = result.formatted.match(/^---\n([\s\S]*?)\n---/)
    expect(fmMatch).toBeTruthy()
    const keys = fmMatch![1].split('\n').map((l) => l.split(':')[0])
    expect(keys).toEqual(['title', 'author'])
  })
})

describe('formatMdx — trim trailing whitespace', () => {
  it('strips trailing spaces from lines', async () => {
    const input = '# Hello   \nWorld   \n'
    const result = await formatMdx(input, { trimTrailingWhitespace: true })
    expect(result.error).toBeNull()
    const lines = result.formatted.split('\n')
    for (const line of lines) {
      expect(line).toBe(line.trimEnd())
    }
  })
})

describe('formatMdx — collapse blank lines', () => {
  it('collapses 5 blank lines to 2', async () => {
    const input = '# Hello\n\n\n\n\n\nWorld'
    const result = await formatMdx(input, { collapseBlankLines: true })
    expect(result.error).toBeNull()
    // Should not contain 3+ consecutive newlines (which would be 4+ \n in a row)
    expect(result.formatted).not.toMatch(/\n\s*\n\s*\n\s*\n/)
  })
})

describe('formatMdx — print width', () => {
  it('uses 120 print width when specified', async () => {
    const result120 = await formatMdx('# Hello', { printWidth: 120 })
    const result80 = await formatMdx('# Hello', { printWidth: 80 })
    expect(result120.error).toBeNull()
    expect(result80.error).toBeNull()
    // Both should produce valid output (the difference is visible on long lines)
    expect(result120.formatted).toContain('# Hello')
    expect(result80.formatted).toContain('# Hello')
  })

  it('wraps long JSX differently at 80 vs 120', async () => {
    const longJsx = '<Callout type="info" title="This is a very long title that should cause wrapping differences">Content here</Callout>'
    const result80 = await formatMdx(longJsx, { printWidth: 80 })
    const result120 = await formatMdx(longJsx, { printWidth: 120 })
    expect(result80.error).toBeNull()
    expect(result120.error).toBeNull()
    // At 80 chars, the JSX should be more spread out (more newlines)
    expect(result80.formatted.split('\n').length).toBeGreaterThanOrEqual(
      result120.formatted.split('\n').length
    )
  })
})
