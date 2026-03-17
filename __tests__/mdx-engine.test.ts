import { describe, it, expect } from 'vitest'
import { validateMdx, stripMdxToMarkdown, parseMdxToAst } from '../lib/mdx-engine'

describe('validateMdx', () => {
  it('returns no errors for valid MDX', async () => {
    const result = await validateMdx(
      '---\ntitle: "Test"\n---\n# Hello\n<Callout>text</Callout>'
    )
    expect(result.errors).toHaveLength(0)
    expect(result.valid).toBe(true)
  })

  it('returns errors with positions for invalid MDX', async () => {
    const result = await validateMdx('<Callout>\nunclosed')
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toHaveProperty('line')
    expect(result.errors[0]).toHaveProperty('message')
  })

  it('handles empty input', async () => {
    const result = await validateMdx('')
    expect(result.valid).toBe(true)
  })

  it('validates MDX with nested JSX', async () => {
    const input = '<Tabs>\n<Tab label="A">\n\n# Content\n\n</Tab>\n</Tabs>'
    const result = await validateMdx(input)
    expect(result.valid).toBe(true)
  })
})

describe('stripMdxToMarkdown', () => {
  it('strips JSX wrapper components, keeps children', async () => {
    const input = '<Callout>Important note</Callout>'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('Important note')
    expect(result).not.toContain('Callout')
  })

  it('removes self-closing components', async () => {
    const input = 'Hello\n\n<ApiEndpoint method="GET" path="/users" />\n\nWorld'
    const result = await stripMdxToMarkdown(input)
    expect(result).not.toContain('ApiEndpoint')
    expect(result).toContain('Hello')
    expect(result).toContain('World')
  })

  it('removes import/export declarations', async () => {
    const input = 'import { Callout } from "./components"\n\n# Title'
    const result = await stripMdxToMarkdown(input)
    expect(result).not.toContain('import')
    expect(result).toContain('# Title')
  })

  it('preserves frontmatter', async () => {
    const input = '---\ntitle: "Test"\n---\n\n# Hello'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('title: "Test"')
    expect(result).toContain('# Hello')
  })

  it('strips nested JSX wrappers, keeping all text', async () => {
    const input = '<Tabs><Tab label="Setup">Install the package</Tab></Tabs>'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('Install the package')
    expect(result).not.toContain('Tabs')
    expect(result).not.toContain('Tab')
  })

  it('strips mixed JSX and markdown', async () => {
    const input =
      '# Title\n\nRegular paragraph.\n\n<Callout type="info">\nImportant info\n</Callout>\n\n## Next Section'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('# Title')
    expect(result).toContain('Regular paragraph')
    expect(result).toContain('Important info')
    expect(result).toContain('## Next Section')
    expect(result).not.toContain('Callout')
  })

  it('handles MDX with export declarations', async () => {
    const input = 'export const meta = { title: "Test" }\n\n# Hello'
    const result = await stripMdxToMarkdown(input)
    expect(result).not.toContain('export')
    expect(result).toContain('# Hello')
  })
})

describe('parseMdxToAst', () => {
  it('returns an AST for valid MDX', async () => {
    const ast = await parseMdxToAst('# Hello\n\n<Callout>test</Callout>')
    expect(ast).toBeDefined()
    expect(ast.type).toBe('root')
    expect(ast.children.length).toBeGreaterThan(0)
  })

  it('handles empty input', async () => {
    const ast = await parseMdxToAst('')
    expect(ast).toBeDefined()
    expect(ast.type).toBe('root')
  })
})

describe('validateMdx — GFM tables', () => {
  it('validates MDX with GFM tables', async () => {
    const input = `# Table Test

| Header A | Header B |
|----------|----------|
| Cell 1   | Cell 2   |
`
    const result = await validateMdx(input)
    expect(result.valid).toBe(true)
  })

  it('validates MDX with GFM table inside JSX', async () => {
    const input = `<Callout>

| Col A | Col B |
|-------|-------|
| A1    | B1    |

</Callout>`
    const result = await validateMdx(input)
    expect(result.valid).toBe(true)
  })
})

describe('stripMdxToMarkdown — inline JSX expressions', () => {
  it('strips inline JSX expressions like {variable}', async () => {
    const input = 'Hello {name}, welcome!'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('Hello')
    expect(result).toContain('welcome!')
    expect(result).not.toContain('{name}')
  })

  it('strips block-level JSX expressions', async () => {
    const input = '# Title\n\n{/* This is a comment */}\n\nParagraph'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('# Title')
    expect(result).toContain('Paragraph')
    expect(result).not.toContain('{/*')
  })
})

describe('stripMdxToMarkdown — export declarations', () => {
  it('strips named exports', async () => {
    const input = 'export const meta = { title: "Test" }\n\nexport const config = { sidebar: true }\n\n# Hello'
    const result = await stripMdxToMarkdown(input)
    expect(result).not.toContain('export const meta')
    expect(result).not.toContain('export const config')
    expect(result).toContain('# Hello')
  })

  it('strips default exports', async () => {
    const input = 'export default function Layout({ children }) { return children }\n\n# Hello'
    const result = await stripMdxToMarkdown(input)
    expect(result).not.toContain('export default')
    expect(result).toContain('# Hello')
  })
})

describe('stripMdxToMarkdown — stripFrontmatter option', () => {
  it('removes frontmatter when stripFrontmatter is true', async () => {
    const input = '---\ntitle: "Test"\ndescription: "A test"\n---\n\n# Hello\n\nWorld'
    const result = await stripMdxToMarkdown(input, { stripFrontmatter: true })
    expect(result).not.toContain('---')
    expect(result).not.toContain('title:')
    expect(result).toContain('# Hello')
    expect(result).toContain('World')
  })

  it('preserves frontmatter when stripFrontmatter is false', async () => {
    const input = '---\ntitle: "Test"\n---\n\n# Hello'
    const result = await stripMdxToMarkdown(input, { stripFrontmatter: false })
    expect(result).toContain('title: "Test"')
    expect(result).toContain('# Hello')
  })

  it('preserves frontmatter when no options given', async () => {
    const input = '---\ntitle: "Test"\n---\n\n# Hello'
    const result = await stripMdxToMarkdown(input)
    expect(result).toContain('title: "Test"')
    expect(result).toContain('# Hello')
  })
})
