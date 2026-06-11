# Jamdesk Utilities

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Website](https://img.shields.io/badge/jamdesk.com%2Futilities-live-brightgreen)](https://www.jamdesk.com/utilities)

Free, open-source tools for MDX, Markdown, YAML, JSON, and Mermaid diagrams that run in your browser wherever possible. No uploads, no accounts. Paste your content, get results. (The OpenGraph Preview is the exception: it fetches the URL you enter through a small server endpoint, since browsers block cross-site reads — nothing is stored or logged.)

**[jamdesk.com/utilities](https://www.jamdesk.com/utilities)**

Built with Next.js 16, React 19, CodeMirror 6, Prettier, Mermaid, and the unified/remark ecosystem. Licensed under Apache 2.0.

---

## Tools

### MDX Formatter

Paste messy MDX and get clean, consistently indented output. Uses Prettier's MDX parser under the hood, so the formatting rules match what most documentation projects already enforce in CI. Handles frontmatter, JSX component props, nested markdown, and code blocks without mangling anything inside fences.

Options: 2-space or 4-space indentation.

### MDX Validator

Catches syntax errors before your build does. Paste MDX and the validator parses it with the same remark-mdx pipeline that documentation compilers use. Unclosed JSX tags, malformed frontmatter, unbalanced expressions: each error shows the line number, column, and a description. Click an error to jump to that line in the editor.

### MDX Viewer

Live preview of your MDX without spinning up a dev server. The viewer parses MDX to an AST and renders headings, paragraphs, lists, code blocks, and frontmatter as styled elements. JSX components show as labeled stubs with their props displayed, so you can see your content structure without the actual component implementations.

`<Callout type="warning">` renders as a bordered box with "Callout (type: warning)" as the label. Self-closing components like `<ApiEndpoint method="GET" path="/users" />` render as compact badges.

### MDX to Markdown

Strips JSX from MDX and gives you standard Markdown. Import and export statements are removed. JSX wrapper components (`<Callout>text</Callout>`) keep their children text and lose the tags. Self-closing components (`<ApiEndpoint />`) are removed entirely. Frontmatter stays untouched.

Useful when migrating away from MDX, publishing to Markdown-only platforms, or diffing content without JSX noise.

### Markdown to HTML

Convert Markdown into clean, semantic HTML. Paste Markdown and get headings, lists, links, tables, code blocks, and inline formatting as standards-compliant markup, ready to drop into a template, email, or CMS. Runs entirely in the browser through the remark/rehype pipeline.

### YAML Validator

Catch YAML errors before they break a build. Paste frontmatter, a CI config, or a Kubernetes manifest and the validator parses it, reporting syntax errors with the line and column. Valid documents show a parsed-structure preview so you can confirm the shape is what you expected.

### JSON ↔ YAML

Convert between JSON and YAML in either direction. Paste one format and get the other with formatting preserved. Handy for moving config between tools that disagree on format, or reading a dense block of JSON as more legible YAML.

### Markdown Table Generator

Turn CSV or TSV into a Markdown table. Paste comma- or tab-separated rows and get a properly aligned Markdown table to drop into docs, a README, or a GitHub issue. The delimiter and header row are detected automatically.

### Mermaid Editor

Write [Mermaid](https://mermaid.js.org/) syntax and watch the diagram render live as you type. Supports every Mermaid diagram type — flowcharts, sequence diagrams, timelines, pie charts, Gantt charts, class and state diagrams, and entity relationship diagrams — each with a built-in sample to start from. A light/dark preview toggle matches the diagram to the background you're targeting. Mermaid runs in strict security mode and every rendered SVG is sanitized (the diagram source can arrive through a share link), so a pasted diagram can't smuggle in a script.

### OpenGraph Preview

Preview and validate how any URL renders when shared on X, Facebook, LinkedIn, Slack, Discord, WhatsApp, iMessage, and Google — with tag-level validation, image dimension checks, and fix hints. Uses a small server endpoint (`/api/og-preview`) because browsers block cross-site reads.

---

## How It Works

Processing happens client-side wherever the browser allows it — only the OpenGraph Preview calls a server, to work around cross-site read restrictions. Otherwise your content never leaves the browser.

Each tool lazy-loads only the engine it needs, so a page pays only for what it uses:

1. **Formatting** uses Prettier's standalone browser build with the built-in MDX parser. About 400KB gzipped, loaded when you first open the formatter.
2. **Parsing, validation, and stripping** use a remark pipeline: `remark-parse` + `remark-mdx` + `remark-frontmatter`. About 100KB gzipped, lighter than the full `@mdx-js/mdx` compiler since it skips the compilation step.
3. **Diagrams, Markdown, and config** load on demand too: the Mermaid editor pulls in Mermaid (~1.5MB) only when you open it, the Markdown tools use the remark/rehype pipeline, and the YAML/JSON tools load a small YAML parser.

The formatter page doesn't load the remark pipeline. The validator doesn't load Prettier. Open the Mermaid editor and nothing else pulls in Mermaid. Each tool pays only for what it needs.

The editor is CodeMirror 6 with markdown + JSX syntax highlighting, line numbers, and bracket matching. Paste events trigger processing immediately; keystrokes are debounced at 300ms.

---

## Features

**Share links.** Content is encoded in the URL hash (`#content=base64...`). Copy the URL to share a pre-populated tool state with someone. Nothing hits a server.

**File upload.** Drag and drop `.mdx` or `.md` files onto the input panel, or click Upload. You can also fetch raw files from any URL (handy for GitHub raw links).

**Sample content.** Each tool loads with example MDX that shows off what it does. Hit "Load Sample" to reset.

**Command palette.** `Cmd+K` / `Ctrl+K` opens a search palette to jump between tools.

**Copy and download.** One click to copy output to clipboard or download as a file. The MDX-to-Markdown tool saves as `.md`; the others save as `.mdx`.

**Mobile layout.** Responsive two-panel design with a tab toggle (Input / Output) on narrow screens.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Code editor | CodeMirror 6 |
| MDX formatting | Prettier standalone (browser build) |
| MDX parsing | unified + remark-parse + remark-mdx + remark-frontmatter |
| Command palette | cmdk |
| Testing | Vitest + Testing Library |
| OG images | Satori + @resvg/resvg-js (build-time) |

---

## Development

```bash
git clone https://github.com/jamdesk/utilities.git
cd utilities
npm install
npm run dev
```

Opens at [localhost:3000/utilities](http://localhost:3000/utilities). The `/utilities` prefix comes from `basePath` in `next.config.ts`.

### Project Structure

```
app/
├── layout.tsx              # Root layout, header, footer, fonts
├── page.tsx                # Hub page with tool grid
├── sitemap.ts              # Auto-generated sitemap
├── llms.txt/route.ts       # Machine-readable tool list for AI crawlers
└── [tool]/
    ├── layout.tsx          # Per-tool metadata, OG, JSON-LD
    └── page.tsx            # Tool UI + SEO content
components/
├── editor/                 # CodeMirror wrapper, input/output panels, toolbar
├── tools/                  # MdxFormatter, MdxValidator, MdxViewer, MdxToMarkdown
├── shell/                  # Header, footer
├── command-palette/        # cmdk integration
└── seo/                    # JSON-LD, FAQ, conversion CTA
lib/
├── mdx-engine.ts           # Remark pipeline (parse, validate, strip)
├── mdx-formatter.ts        # Prettier standalone wrapper
├── tools.ts                # Tool registry (drives routing, sitemap, metadata)
├── samples.ts              # Sample MDX per tool
├── share.ts                # URL hash encode/decode for share links
└── analytics.ts            # Plausible event tracking
```

### Adding a New Tool

1. Add an entry to `lib/tools.ts` (slug, name, description, SEO fields, CTA text)
2. Create a component in `components/tools/YourTool.tsx`
3. Add the slug case in `components/tools/ToolEditor.tsx`
4. Add sample content in `lib/samples.ts`
5. Add SEO content (how-to, FAQ) in `lib/tool-seo-content.ts`

The tool registry drives everything else: hub grid, routing, sitemap, OG images, llms.txt, and the command palette.

---

## Testing

```bash
npx vitest run          # 92 unit + integration tests
npx tsc --noEmit        # Type check
npm run build           # Production build (generates OG images)
```

Tests cover the MDX engines (formatting, validation, stripping with edge cases), tool registry, share link encoding, analytics helper, and component rendering.

---

## License

Apache 2.0. See [LICENSE](LICENSE).

Built by [Jamdesk](https://www.jamdesk.com).
