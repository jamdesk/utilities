# Jamdesk Utilities

Free, open-source MDX tools that run entirely in your browser. No server, no uploads, no accounts. Paste your MDX, get results.

**[jamdesk.com/utilities](https://www.jamdesk.com/utilities)**

Built with Next.js 16, React 19, CodeMirror 6, Prettier, and the unified/remark ecosystem. Licensed under Apache 2.0.

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

---

## How It Works

All processing happens client-side. Your MDX never leaves the browser.

Two engines, each lazy-loaded only when its tool is opened:

1. **Formatting** uses Prettier's standalone browser build with the built-in MDX parser. About 400KB gzipped, loaded when you first open the formatter.
2. **Parsing, validation, and stripping** use a remark pipeline: `remark-parse` + `remark-mdx` + `remark-frontmatter`. About 100KB gzipped, lighter than the full `@mdx-js/mdx` compiler since it skips the compilation step.

The formatter page doesn't load the remark pipeline. The validator doesn't load Prettier. Each tool pays only for what it needs.

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
