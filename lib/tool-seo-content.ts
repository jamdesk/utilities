interface DetailSection {
  heading: string
  content: string
}

interface ToolSeoContent {
  howToTitle: string
  howToContent: string
  detailSections?: DetailSection[]
  faq: { question: string; answer: string }[]
}

export const toolSeoContent: Record<string, ToolSeoContent> = {
  'mdx-formatter': {
    howToTitle: 'How to Format MDX',
    howToContent:
      'Paste your MDX into the editor and the formatter will apply consistent indentation, normalize frontmatter spacing, and clean up JSX component formatting. The formatter preserves your content while fixing whitespace issues, aligning attributes, and ensuring consistent line breaks between sections. It handles mixed Markdown and JSX syntax correctly, so component props stay readable alongside your prose. The output is ready to commit — no manual cleanup needed.',
    detailSections: [
      {
        heading: 'What the formatter does',
        content:
          'The MDX Formatter uses Prettier 3.x with the built-in MDX parser to format your files. It handles mixed Markdown prose and JSX component syntax in a single pass. Frontmatter (YAML between --- delimiters) is preserved and optionally sorted alphabetically. Import and export statements are normalized to use consistent quote style and spacing. The formatter processes files up to 50KB entirely in your browser — nothing is sent to a server.',
      },
      {
        heading: 'Formatting options',
        content:
          'Tab width toggles between 2-space and 4-space indentation. Sort frontmatter alphabetically orders your YAML keys for consistency across files. Trim trailing whitespace removes invisible spaces at the end of lines. Collapse blank lines reduces 3 or more consecutive blank lines to 2. Print width switches between 80 and 120 character line wrapping.',
      },
      {
        heading: 'When to use an MDX formatter',
        content:
          'Use the formatter before committing MDX files to version control, after copy-pasting content from external sources, or when onboarding a team to consistent formatting standards. It is especially useful for documentation repositories with multiple contributors where inconsistent whitespace creates noisy diffs. The formatter pairs well with the MDX Validator — format first, then validate.',
      },
    ],
    faq: [
      {
        question: 'Does the formatter change my content?',
        answer:
          'No. The formatter only adjusts whitespace, indentation, and formatting. Your actual content, component props, and frontmatter values are preserved exactly as written.',
      },
      {
        question: 'Does it handle frontmatter?',
        answer:
          'Yes. The formatter correctly handles YAML frontmatter blocks, preserving their structure while normalizing spacing and indentation within the frontmatter section.',
      },
      {
        question: 'What formatting rules does it follow?',
        answer:
          'The formatter uses Prettier with MDX support. It applies standard Prettier rules for Markdown and JSX, including consistent indentation, line wrapping, and attribute alignment.',
      },
      {
        question: 'Can I configure the formatting options?',
        answer:
          'Yes. The toolbar above the editor lets you toggle between 2-space and 4-space indentation, enable alphabetical frontmatter key sorting, trim trailing whitespace, collapse consecutive blank lines, and switch between 80 and 120 character print width. These options apply in real time as you edit.',
      },
    ],
  },
  'mdx-validator': {
    howToTitle: 'How to Validate MDX',
    howToContent:
      'Paste your MDX content into the editor and validation runs automatically. The validator checks for common issues: unclosed JSX tags, malformed frontmatter, unbalanced curly braces in expressions, and invalid Markdown syntax. Errors appear inline with line numbers and descriptions so you can find and fix problems quickly. The validator uses the same MDX compiler that documentation platforms use, so if your content passes validation here, it will compile correctly in your project.',
    detailSections: [
      {
        heading: 'How validation works',
        content:
          'The MDX Validator uses the remark-mdx parser (the same parser used by Next.js, Docusaurus, and other MDX build tools) to check your content. It runs a full parse pass and collects all warnings and errors from the unified pipeline. Each issue includes the exact line number, column position, severity level, and a descriptive message. Validation runs automatically as you type with a 300ms debounce to keep the editor responsive.',
      },
      {
        heading: 'Common errors the validator catches',
        content:
          'Unclosed JSX tags (e.g., <Callout> without </Callout>), malformed YAML frontmatter (missing closing --- or invalid syntax), unbalanced curly braces in MDX expressions, import statements with incorrect syntax, and components used before being imported. Strict mode filters results to errors only, hiding warnings for a cleaner output.',
      },
      {
        heading: 'Validating before deployment',
        content:
          'Catching MDX errors before deployment prevents broken documentation pages. Paste your content here to verify it compiles, then commit with confidence. For automated validation across an entire project, consider adding remark-mdx to your CI pipeline — this tool uses the same underlying parser.',
      },
    ],
    faq: [
      {
        question: 'What errors does the validator catch?',
        answer:
          'The validator catches JSX syntax errors (unclosed tags, mismatched components), frontmatter issues (invalid YAML), expression errors (unbalanced braces), and Markdown problems (malformed links, broken references).',
      },
      {
        question: 'Does validation run automatically?',
        answer:
          'Yes. Validation runs as you type with a short debounce delay. You do not need to click a button — errors and warnings appear inline as you edit.',
      },
      {
        question: 'Is this the same as my build-time validator?',
        answer:
          'The validator uses the standard remark-mdx parser, which is the same parser used by most MDX build tools. If your content validates here, it should compile in your project.',
      },
      {
        question: 'Can I validate multiple files at once?',
        answer:
          'Currently the validator handles one MDX file at a time. Paste your content into the editor to validate it. Batch validation across a project is better handled by your build toolchain.',
      },
    ],
  },
  'mdx-viewer': {
    howToTitle: 'How to Preview MDX',
    howToContent:
      'Paste MDX content into the editor and the viewer renders a live preview alongside it. The preview updates as you type, showing how your headings, paragraphs, lists, code blocks, and other Markdown elements will look. JSX components are rendered as labeled stubs showing the component name and props, so you can verify your content structure without needing the actual component implementations. The viewer is useful for checking content layout, verifying frontmatter, and catching formatting issues before committing.',
    detailSections: [
      {
        heading: 'What the preview shows',
        content:
          'The MDX Viewer parses your content into an abstract syntax tree (AST) and renders each node: headings with proper hierarchy (h1–h6), paragraphs, ordered and unordered lists, code blocks with syntax highlighting, blockquotes, links, images, bold, italic, and inline code. YAML frontmatter is displayed in a separate metadata box above the rendered content.',
      },
      {
        heading: 'How JSX components render',
        content:
          'Since the viewer runs without your component library, JSX components are rendered as labeled placeholder stubs. Block components (like <Callout> with children) show a bordered container with the component name and its props. Self-closing components (like <ApiEndpoint />) render as inline badges. This lets you verify content structure and prop values without needing actual component implementations.',
      },
      {
        heading: 'Using the viewer for documentation review',
        content:
          'The viewer is useful for reviewing documentation pull requests, verifying frontmatter metadata, and checking that heading hierarchy is correct before publishing. Combined with the MDX Formatter, you can clean up and preview content in one workflow — format, then switch to the viewer to see the result.',
      },
    ],
    faq: [
      {
        question: 'Does the viewer render my custom components?',
        answer:
          'Custom JSX components are rendered as labeled placeholder stubs that show the component name and its props. This lets you verify content structure without needing the actual component code.',
      },
      {
        question: 'Does the preview update in real time?',
        answer:
          'Yes. The preview updates as you type with a short debounce to keep the editor responsive. Changes appear in the preview panel within a fraction of a second.',
      },
      {
        question: 'Can I preview MDX with frontmatter?',
        answer:
          'Yes. The viewer parses frontmatter and displays it separately from the rendered content, so you can verify both your metadata and your content in one view.',
      },
    ],
  },
  'mdx-to-markdown': {
    howToTitle: 'How to Convert MDX to Markdown',
    howToContent:
      'Paste your MDX content into the editor and the converter strips JSX-specific syntax to produce clean Markdown. Import statements, export statements, and JSX component tags are removed. Content inside JSX components is preserved where possible, so your text is not lost. The output is standard Markdown that works in any Markdown renderer — GitHub, GitLab, VS Code preview, or static site generators that do not support MDX. Use this when migrating content away from MDX or when you need a plain Markdown version of your documentation.',
    detailSections: [
      {
        heading: 'What gets converted',
        content:
          'The converter removes all MDX-specific syntax: import statements, export statements, and JSX component tags. For wrapper components (like <Callout>text</Callout>), the inner content is preserved and unwrapped into the surrounding Markdown. Self-closing components (like <Image />) are removed entirely since they have no Markdown equivalent. Standard Markdown syntax — headings, lists, links, code blocks, images, tables — passes through unchanged.',
      },
      {
        heading: 'Frontmatter handling',
        content:
          'YAML frontmatter is preserved by default since frontmatter is valid in both MDX and standard Markdown. Toggle the "Strip frontmatter" option to remove it entirely — useful when converting content for platforms that do not support frontmatter metadata.',
      },
      {
        heading: 'Migration use cases',
        content:
          'Use this converter when migrating documentation from an MDX-based platform (Next.js, Docusaurus, Jamdesk) to a standard Markdown platform (GitHub wikis, GitLab pages, Confluence). It is also useful for generating plain-text versions of documentation for email newsletters or non-technical stakeholders who need content without component markup.',
      },
    ],
    faq: [
      {
        question: 'What gets removed during conversion?',
        answer:
          'Import statements, export statements, and JSX component tags are removed. Standard Markdown syntax (headings, lists, links, code blocks, images) is preserved. Content inside JSX components is kept where possible.',
      },
      {
        question: 'Is the conversion lossless?',
        answer:
          'No. JSX components that have no Markdown equivalent are removed, which means interactive elements, custom layouts, and component-specific styling are lost. The converter preserves all standard Markdown content.',
      },
      {
        question: 'Does it handle frontmatter?',
        answer:
          'Yes. YAML frontmatter is preserved in the Markdown output since frontmatter is valid in both MDX and standard Markdown.',
      },
      {
        question: 'Can I convert Markdown back to MDX?',
        answer:
          'Standard Markdown is already valid MDX, so no conversion is needed. You can add JSX components and imports to any Markdown file to turn it into MDX.',
      },
    ],
  },
}
