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
  'html-to-mdx': {
    howToTitle: 'How to Convert HTML to MDX',
    howToContent:
      'Paste HTML into the editor and the converter produces MDX-compatible Markdown. Headings, paragraphs, lists, links, and code blocks become standard Markdown. Tables, complex nested markup, and unknown elements are preserved as raw HTML — which is valid MDX. The output is ready to paste into a Next.js, Docusaurus, or Astro MDX file.',
    detailSections: [
      {
        heading: 'What gets converted',
        content:
          'Standard HTML elements with Markdown equivalents are converted: h1 through h6, p, strong, em, code, pre, a, ul, ol, li, blockquote, hr, img. Code blocks preserve language hints from class="language-*" attributes. Simple tables become Markdown tables; complex tables (with rowspan or colspan) stay as raw HTML.',
      },
      {
        heading: 'Migration use cases',
        content:
          'Use this converter when migrating content from a CMS that exports HTML — Notion, Confluence, WordPress, Ghost, or static-site exports. The output drops cleanly into any MDX-based docs platform (Next.js, Docusaurus, Astro, Gatsby) without further processing.',
      },
      {
        heading: 'Why preserve raw HTML',
        content:
          'MDX accepts raw HTML inline. When markup cannot be expressed in Markdown (complex tables, custom elements, embedded iframes), the converter leaves the original HTML in place rather than dropping data. The result is always lossless — content survives the conversion.',
      },
    ],
    faq: [
      {
        question: 'What HTML elements does it convert?',
        answer:
          'Standard elements with Markdown equivalents: headings, paragraphs, bold, italic, links, lists, code blocks, blockquotes, horizontal rules, and images. Tables convert when simple; complex tables stay as raw HTML.',
      },
      {
        question: 'Is the conversion lossless?',
        answer:
          'Yes. Markup that cannot be expressed in Markdown is preserved as raw HTML, which is valid MDX. No content is dropped during conversion.',
      },
      {
        question: 'Can I convert content from Notion or Confluence?',
        answer:
          'Yes. Export from Notion or Confluence as HTML (or copy as HTML), paste into the editor, and the output is ready for any MDX-based site.',
      },
      {
        question: 'Does it preserve syntax highlighting hints?',
        answer:
          'Yes. <code class="language-typescript"> and similar attributes are converted to fenced code blocks with the matching language tag.',
      },
    ],
  },
  'yaml-validator': {
    howToTitle: 'How to Validate YAML',
    howToContent:
      'Paste your YAML content into the editor and validation runs instantly. The validator checks syntax, catches duplicate keys at any nesting level, and flags tabs used for indentation. Valid YAML is parsed and displayed as formatted JSON in the output panel. Errors include line numbers, column positions, and descriptive messages.',
    detailSections: [
      {
        heading: 'What the validator checks',
        content:
          'The YAML Validator checks for syntax errors (malformed key-value pairs, incorrect indentation), duplicate keys at any nesting level (using the yaml package with uniqueKeys mode), and tabs in indentation (YAML requires spaces, not tabs). Valid input is parsed and displayed as formatted JSON so you can verify the parsed structure matches your intent.',
      },
      {
        heading: 'Duplicate key detection',
        content:
          'Duplicate keys in YAML silently overwrite earlier values, which causes hard-to-find bugs in configuration files. This validator uses strict mode to flag duplicate keys as errors instead of silently merging them. Keys with the same name under different parent objects are allowed — only true duplicates at the same level are flagged.',
      },
      {
        heading: 'Common YAML mistakes',
        content:
          'The most common YAML errors are: tabs instead of spaces for indentation, missing colons after keys, incorrect nesting depth, unquoted strings that look like booleans (yes/no become true/false), and duplicate keys that silently overwrite values. This validator catches all of these with clear error messages.',
      },
    ],
    faq: [
      {
        question: 'Does it catch duplicate keys?',
        answer:
          'Yes. The validator uses strict mode with duplicate key detection. If the same key appears twice at the same nesting level, it is flagged as an error with the exact line number.',
      },
      {
        question: 'What is the difference between YAML and JSON?',
        answer:
          'YAML uses indentation for structure while JSON uses braces and brackets. YAML supports comments, multi-line strings, and anchors. JSON is stricter but more widely supported by APIs. Both represent the same data structures — you can convert between them losslessly.',
      },
      {
        question: 'Why does YAML not allow tabs?',
        answer:
          'The YAML specification requires spaces for indentation because tab width varies between editors. A file that looks correct in one editor may have wrong indentation in another. Spaces ensure consistent parsing regardless of editor settings.',
      },
    ],
  },
  'json-yaml-converter': {
    howToTitle: 'How to Convert JSON to YAML (and YAML to JSON)',
    howToContent:
      'Paste JSON or YAML into the editor and toggle the direction to convert. JSON to YAML produces clean, readable YAML with 2-space indentation. YAML to JSON produces formatted JSON with proper nesting. Errors in the input are shown with descriptive messages. Copy or download the converted output.',
    detailSections: [
      {
        heading: 'Bidirectional conversion',
        content:
          'The converter works in both directions. Toggle between JSON → YAML and YAML → JSON using the toolbar switch. The conversion preserves all data types: strings, numbers, booleans, null values, arrays, and nested objects. YAML-specific features like comments and anchors are not preserved when converting to JSON since JSON does not support them.',
      },
      {
        heading: 'When to use JSON vs YAML',
        content:
          'JSON is the standard for APIs, package.json, and tsconfig.json. YAML is preferred for configuration files (Docker Compose, GitHub Actions, Kubernetes), CI/CD pipelines, and documentation frontmatter. Use this converter when moving configuration between systems or when you need to read a JSON config in a more human-friendly YAML format.',
      },
      {
        heading: 'Error handling',
        content:
          'Invalid input produces a clear error message instead of silent failure. For JSON input, syntax errors like missing quotes, trailing commas, or unmatched brackets are caught. For YAML input, indentation errors, invalid nesting, and malformed values are flagged with line numbers where possible.',
      },
    ],
    faq: [
      {
        question: 'Is the conversion lossless?',
        answer:
          'Data is preserved losslessly in both directions for standard types (strings, numbers, booleans, arrays, objects). YAML-only features like comments, anchors, and aliases are not preserved when converting to JSON because JSON has no equivalent syntax.',
      },
      {
        question: 'Does it handle nested objects?',
        answer:
          'Yes. Deeply nested objects and arrays are converted correctly in both directions. YAML uses indentation for nesting while JSON uses braces and brackets.',
      },
      {
        question: 'Can I convert YAML with comments?',
        answer:
          'YAML comments (lines starting with #) are parsed but not included in the JSON output since JSON does not support comments. The data values are converted correctly.',
      },
    ],
  },
  'markdown-table-generator': {
    howToTitle: 'How to Generate Markdown Tables',
    howToContent:
      'Paste CSV or TSV data into the editor and the generator produces a formatted Markdown table instantly. The first row becomes the table header. Toggle between CSV and TSV input formats using the toolbar. Copy the output or download it as a .md file. You can also paste data directly from spreadsheets — most spreadsheet applications copy as TSV.',
    detailSections: [
      {
        heading: 'CSV and TSV support',
        content:
          'The generator accepts both CSV (comma-separated) and TSV (tab-separated) input. CSV handles quoted fields correctly — commas inside double quotes are preserved as cell content, not treated as delimiters. TSV mode splits on tab characters, which is the default format when copying from Excel, Google Sheets, or Numbers.',
      },
      {
        heading: 'Pipe character escaping',
        content:
          'Pipe characters (|) in cell content are automatically escaped with a backslash (\\|) to prevent them from breaking the Markdown table syntax. This means you can safely include pipe characters in your data without manual escaping.',
      },
      {
        heading: 'Spreadsheet to Markdown workflow',
        content:
          'Copy cells from any spreadsheet application (Excel, Google Sheets, Numbers, LibreOffice Calc), switch to TSV mode, and paste directly into the editor. The tab-separated values are converted to a clean Markdown table. This is faster than manually typing pipe characters and alignment dashes for every row.',
      },
    ],
    faq: [
      {
        question: 'Can I paste from Excel or Google Sheets?',
        answer:
          'Yes. Copy cells from your spreadsheet, switch to TSV mode in the toolbar, and paste. Spreadsheets copy data as tab-separated values by default, which the TSV parser handles correctly.',
      },
      {
        question: 'How are special characters handled?',
        answer:
          'Pipe characters (|) are escaped automatically. Commas inside quoted CSV fields are preserved as content. Other characters like asterisks, brackets, and backticks pass through unchanged.',
      },
      {
        question: 'Does it support column alignment?',
        answer:
          'The generator produces standard left-aligned tables with --- separators. For center or right alignment, add colons to the separator row manually after generating: :--- for left, :---: for center, ---: for right.',
      },
    ],
  },
  'markdown-to-html': {
    howToTitle: 'How to Convert Markdown to HTML',
    howToContent:
      'Paste your Markdown content into the editor and the converter generates clean, semantic HTML in real time. The output uses standard HTML5 elements — headings become <h1> through <h6>, lists use <ul>/<ol>/<li>, code blocks use <pre><code>, and emphasis maps to <strong> and <em>. Copy the output or download it as an .html file.',
    detailSections: [
      {
        heading: 'What gets converted',
        content:
          'All standard Markdown syntax is converted: headings, paragraphs, bold, italic, inline code, code blocks (with language class attributes), links, images, blockquotes, horizontal rules, and both ordered and unordered lists. Tables are converted to <table> with <thead> and <tbody>. YAML frontmatter is either rendered as a preformatted block or stripped entirely.',
      },
      {
        heading: 'HTML output quality',
        content:
          'The converter produces clean, semantic HTML without inline styles or framework-specific classes. The output is suitable for embedding in CMSs, email templates, static sites, or any context that accepts raw HTML. The remark-rehype pipeline ensures spec-compliant output.',
      },
      {
        heading: 'Common use cases',
        content:
          'Use this converter when migrating Markdown content to a CMS that requires HTML, preparing documentation for email distribution, creating embeddable content snippets, or generating HTML previews for non-technical reviewers. It is also useful for developers building Markdown-to-HTML pipelines who want to preview the output before integrating it into their toolchain.',
      },
    ],
    faq: [
      {
        question: 'Does it support GitHub Flavored Markdown?',
        answer:
          'The converter handles standard Markdown syntax including headings, lists, code blocks, links, images, bold, italic, and blockquotes. GitHub-specific extensions like task lists and autolinked URLs are not currently supported.',
      },
      {
        question: 'Can I use the HTML output in an email?',
        answer:
          'The output is clean semantic HTML without CSS or JavaScript dependencies. Most email clients render semantic HTML correctly, though you may need to add inline styles for consistent email rendering across clients.',
      },
      {
        question: 'Does it handle code syntax highlighting?',
        answer:
          'Code blocks include language class attributes (e.g., class="language-js") so you can apply syntax highlighting with any client-side library like Prism.js or highlight.js. The converter does not add highlighting styles directly.',
      },
    ],
  },
}
