export interface CheatsheetEntry {
  label: string
  description: string
  snippet: string
  toolSlug?: string
  toolLabel?: string
}

export interface CheatsheetGroup {
  heading: string
  entries: CheatsheetEntry[]
}

export const cheatsheetGroups: CheatsheetGroup[] = [
  {
    heading: 'Markdown basics',
    entries: [
      {
        label: 'Headings',
        description: 'h1 through h6, same as plain Markdown.',
        snippet: '# H1\n## H2\n### H3',
        toolSlug: 'mdx-viewer',
        toolLabel: 'Preview headings in the MDX Viewer',
      },
      {
        label: 'Lists',
        description:
          "Bulleted with `-` or `*`. Numbered with `1.`; the actual number doesn't matter, since renderers reflow them.",
        snippet: '- Item one\n- Item two\n  - Nested\n\n1. First\n2. Second',
      },
      {
        label: 'Links and images',
        description:
          'Standard Markdown. Use the JSX `<Image>` component when you need optimization or layout control.',
        snippet:
          '[Read the docs](https://mdxjs.com)\n\n![Hero illustration](/hero.png)',
      },
      {
        label: 'Inline formatting',
        description: 'Bold, italic, inline code. Combine them.',
        snippet: '**bold**, *italic*, `code`, ***both***',
      },
      {
        label: 'Blockquotes',
        description: 'A `>` at the start of a line. Nest them by stacking.',
        snippet: '> A quote.\n>\n> > Nested.',
      },
      {
        label: 'Code blocks',
        description:
          'Triple-backtick fences. Most MDX setups also accept a meta string for titles and line highlights, though support varies by toolchain.',
        snippet:
          '```typescript title="hello.ts" {2}\nfunction hello(name: string) {\n  return `Hi, ${name}`\n}\n```',
        toolSlug: 'markdown-to-html',
        toolLabel: 'Convert Markdown to HTML',
      },
      {
        label: 'Tables',
        description:
          'Pipes and dashes. Use `:---:`, `:---`, or `---:` to align columns.',
        snippet:
          '| Feature | Markdown | MDX |\n|---------|----------|-----|\n| JSX     | No       | Yes |\n| YAML    | No       | Yes |',
        toolSlug: 'markdown-table-generator',
        toolLabel: 'Generate tables from CSV',
      },
    ],
  },
  {
    heading: 'MDX additions',
    entries: [
      {
        label: 'Frontmatter',
        description:
          'YAML between `---` delimiters at the top of the file. Parsed by remark-frontmatter, and usually exposed as a `frontmatter` export.',
        snippet:
          '---\ntitle: My Page\ndescription: A short description\n---',
        toolSlug: 'yaml-validator',
        toolLabel: 'Validate YAML frontmatter',
      },
      {
        label: 'JS expressions',
        description:
          'A single curly brace runs JavaScript. Works in body text and inside JSX attributes.',
        snippet:
          'Year: {new Date().getFullYear()}\n\n<a href={`/posts/${slug}`}>Read more</a>',
      },
      {
        label: 'Imports',
        description:
          'ES module imports at the top of the file. Components, data, even other MDX files.',
        snippet:
          "import { Tabs, Tab } from '@/components/Tabs'\nimport About from './about.mdx'",
      },
      {
        label: 'Exports',
        description:
          'Export metadata or helpers from your file. Frameworks read these at build time.',
        snippet:
          "export const metadata = {\n  title: 'My Page',\n  date: '2026-04-29',\n}",
      },
      {
        label: 'Comments',
        description: 'JSX-style. Stripped from output.',
        snippet: '{/* Reminder to update this section after launch. */}',
      },
    ],
  },
  {
    heading: 'Components and layout',
    entries: [
      {
        label: 'JSX components',
        description:
          'Drop any imported React component inline. Self-close when there are no children.',
        snippet:
          '<Callout type="warning">\n  Read this first.\n</Callout>\n\n<Image src="/hero.png" alt="Hero" width={1200} height={630} />',
        toolSlug: 'mdx-validator',
        toolLabel: 'Catch unclosed JSX tags',
      },
      {
        label: 'Markdown inside components (the gotcha)',
        description:
          "Markdown sitting flush against a JSX tag won't render. Leave a blank line and it will. This is the most common MDX bug.",
        snippet:
          '<Callout>\n  **Wrong** — sits next to the tag, renders as plain text.\n</Callout>\n\n<Callout>\n\n  **Right** — blank line above and below.\n\n</Callout>',
      },
      {
        label: 'Mapping arrays in JSX',
        description: 'Need a generated list? Map inside braces.',
        snippet:
          "<ul>\n  {['Docs', 'Blog', 'API'].map((label) => (\n    <li key={label}>{label}</li>\n  ))}\n</ul>",
      },
      {
        label: 'Default export (page-level layout)',
        description:
          'Wrap every page in shared chrome by default-exporting a function. Frameworks like Next.js call it with the rest of the file as `children`.',
        snippet:
          "import Layout from '@/components/DocLayout'\n\nexport default function Page({ children }) {\n  return <Layout>{children}</Layout>\n}",
      },
    ],
  },
]

// Flat enumeration. Used by tests and any future programmatic consumer.
export const cheatsheetEntries: CheatsheetEntry[] = cheatsheetGroups.flatMap(
  (g) => g.entries
)

export const cheatsheetFaqs: { question: string; answer: string }[] = [
  {
    question: "What's the difference between MDX and Markdown?",
    answer:
      'MDX is a superset. It adds imports, exports, and JSX to Markdown. Everything in Markdown still works the same way: headings, lists, code blocks, tables. What is new is rendering React components inline and running JavaScript inside curly braces. MDX compiles to a JavaScript module; plain Markdown compiles to HTML.',
  },
  {
    question: 'How do I use Markdown inside an MDX component?',
    answer:
      "Leave a blank line between the component's tag and the Markdown content. Putting <Callout>**bold**</Callout> on a single line renders as plain text. The same content with a blank line above and below renders the bold correctly. It's the most common MDX bug, and it trips up almost everyone the first time.",
  },
  {
    question: 'Does MDX support TypeScript?',
    answer:
      "Yes, indirectly. MDX itself has no TypeScript syntax. You can't write `: string` in an MDX file. The components, helpers, and data you import are TypeScript files, though, and your toolchain's compiler type-checks them as usual. Type the imports, not the MDX file.",
  },
  {
    question: 'Why do I need a cheatsheet if MDX is just Markdown plus JSX?',
    answer:
      "Roughly, yes. Friction lives at the edges. Frontmatter parsing depends on a remark plugin, JSX adjacent to Markdown doesn't render the way you'd expect, and code-block meta strings vary by toolchain. This page exists because those edges cost an hour the first time you hit them.",
  },
]
