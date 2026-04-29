export interface CheatsheetEntry {
  label: string
  description: string
  snippet: string
  toolSlug?: string  // Internal route slug (without basePath) — wired through <Link>
  toolLabel?: string
}

export const cheatsheetEntries: CheatsheetEntry[] = [
  {
    label: 'Headings',
    description: 'Standard Markdown headings, h1–h6.',
    snippet: '# H1\n## H2\n### H3',
    toolSlug: 'mdx-viewer',
    toolLabel: 'Preview headings in the MDX Viewer',
  },
  {
    label: 'Frontmatter',
    description: 'YAML between --- delimiters at the top of the file.',
    snippet: '---\ntitle: My Page\ndescription: A short description\n---',
    toolSlug: 'yaml-validator',
    toolLabel: 'Validate YAML frontmatter',
  },
  {
    label: 'JSX components',
    description: 'Use any imported React component inline.',
    snippet: "import { Callout } from '@/components/Callout'\n\n<Callout type=\"warning\">\n  This is important.\n</Callout>",
    toolSlug: 'mdx-validator',
    toolLabel: 'Catch unclosed JSX tags',
  },
  {
    label: 'JS expressions',
    description: 'Single-brace expressions evaluate JavaScript inline.',
    snippet: 'The current year is {new Date().getFullYear()}.',
  },
  {
    label: 'Imports',
    description: 'ES module imports at the top of the file.',
    snippet: "import Image from 'next/image'\nimport { Tabs, Tab } from '@/components/Tabs'",
  },
  {
    label: 'Exports',
    description: 'Export metadata or helpers from your MDX file.',
    snippet: "export const metadata = {\n  title: 'My Page',\n  date: '2026-04-29',\n}",
  },
  {
    label: 'Code blocks',
    description: 'Triple-backtick fences with optional language.',
    snippet: '```typescript\nfunction hello(name: string) {\n  return `Hi, ${name}`\n}\n```',
    toolSlug: 'markdown-to-html',
    toolLabel: 'Convert Markdown to HTML',
  },
  {
    label: 'Tables',
    description: 'Standard Markdown tables; pipes and dashes.',
    snippet: '| Feature | Markdown | MDX |\n|---------|----------|-----|\n| JSX     | No       | Yes |\n| YAML    | No       | Yes |',
    toolSlug: 'markdown-table-generator',
    toolLabel: 'Generate tables from CSV',
  },
  {
    label: 'Self-closing components',
    description: 'Components without children use self-closing syntax.',
    snippet: '<Image src="/hero.png" alt="Hero" width={1200} height={630} />',
  },
  {
    label: 'Comments',
    description: 'JSX-style comments inside MDX.',
    snippet: '{/* This is a comment, not rendered. */}',
  },
  {
    label: 'Strip to plain Markdown',
    description: 'When you need MDX-free output.',
    snippet: 'Use the MDX → Markdown converter to strip JSX, imports, exports.',
    toolSlug: 'mdx-to-markdown',
    toolLabel: 'Open MDX to Markdown converter',
  },
]
