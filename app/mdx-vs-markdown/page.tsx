import Link from 'next/link'
import { LAST_REVIEWED } from '@/lib/tools'
import { mdxVsMarkdownFaqs } from './layout'

const FORMATTED_DATE = new Date(LAST_REVIEWED + 'T00:00:00Z').toLocaleDateString(
  'en-US',
  { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
)

// Single source of truth for FAQ #3's visible body: take the lead from the
// const, render the trailing converter sentence as a Link. Falls back safely
// if the const is rewritten and no longer contains the marker.
const FAQ3_SUFFIX_MARKER = 'The MDX to Markdown converter'
const FAQ3_LEAD = (() => {
  const text = mdxVsMarkdownFaqs[2].answer
  const idx = text.indexOf(FAQ3_SUFFIX_MARKER)
  return idx >= 0 ? text.slice(0, idx) : text
})()

export default function MdxVsMarkdownPage() {
  return (
    <>
      {/* Hero — opens with a one-line answer so AI Overviews can extract it */}
      <section className="mx-auto max-w-3xl px-6 pb-6 pt-12">
        <span className="mb-3 inline-block rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
          Updated <time dateTime={LAST_REVIEWED}>{FORMATTED_DATE}</time>
        </span>
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight">
          MDX vs Markdown
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          MDX is Markdown plus JSX. Reach for Markdown when your content has to
          render in places you don&apos;t control, like GitHub, wikis, or any
          editor with a built-in renderer. Pick MDX when you want React
          components, computed values, or interactivity inline with your prose.
        </p>
      </section>

      {/* At a glance — comparison table */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          At a glance
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border bg-card [&_td]:px-4 [&_td]:py-3 [&_th[scope=row]]:px-4 [&_th[scope=row]]:py-3 [&_th[scope=row]]:font-normal [&_tr]:border-b [&_tr]:border-border last:[&_tr]:border-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Feature</th>
                <th scope="col" className="px-4 py-3 font-semibold">Markdown</th>
                <th scope="col" className="px-4 py-3 font-semibold">MDX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">JSX components</th>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Imports / exports</th>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">JS expressions</th>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">YAML frontmatter</th>
                <td>Yes (with parser)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Standard Markdown syntax</th>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Renders without a toolchain</th>
                <td>Yes (GitHub, wikis, editors)</td>
                <td>No</td>
              </tr>
              <tr>
                <th scope="row">Compiles to</th>
                <td>HTML</td>
                <td>JavaScript module</td>
              </tr>
              <tr>
                <th scope="row">Best for</th>
                <td>Static content, READMEs</td>
                <td>Interactive docs, blogs, content sites</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* When to use Markdown */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          When to use Markdown
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Stick with Markdown for content that needs to travel. READMEs, wikis,
          Notion exports, internal team docs: these render natively wherever you
          put them. It&apos;s portable, diffs cleanly, and survives a copy-paste
          into Slack without mangling. If a future maintainer might open the
          file in a basic editor and expect it to just work, that&apos;s a
          Markdown file.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          If your team&apos;s writers don&apos;t ship JavaScript, this is
          almost always the right answer. MDX&apos;s flexibility becomes your
          maintenance burden the first time a <code>&lt;Tabs&gt;</code>{' '}
          component throws in production and the only person who knows the
          wiring is out for the week.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The shared baseline is{' '}
          <a
            href="https://commonmark.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            CommonMark
          </a>
          ; most renderers also support{' '}
          <a
            href="https://github.github.com/gfm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub Flavored Markdown
          </a>{' '}
          for tables, task lists, and strikethrough.
        </p>
      </section>

      {/* When to use MDX */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          When to use MDX
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Pick MDX when prose alone isn&apos;t enough. Callouts, tabbed code
          examples, and conditional rendering against your own data slot in
          right next to the writing. Next.js, Docusaurus, Astro, and Gatsby all
          ship first-class MDX support; the format itself is documented at{' '}
          <a
            href="https://mdxjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mdxjs.com
          </a>
          .
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Most Markdown files are valid MDX too. MDX is stricter than CommonMark
          though, so expect a handful of fixes when migrating: raw <code>&lt;</code>{' '}
          characters in prose, certain HTML blocks, and some indentation
          patterns that parse fine as Markdown will throw in MDX. The{' '}
          <Link
            href="/mdx-cheatsheet"
            className="text-primary hover:underline"
          >
            MDX Cheatsheet
          </Link>{' '}
          covers the common gotchas.
        </p>
      </section>

      {/* Under the hood — the technical tradeoff most guides skip */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          Under the hood
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Markdown compiles to an HTML string. MDX compiles to a JavaScript
          module: your content becomes code, with everything that implies. That
          buys you imports, expressions, and components inline. It also buys you
          a real security boundary.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Never accept MDX from authors you don&apos;t trust. Their content can
          import anything your bundler can resolve. Markdown is safe to take
          from anywhere; MDX is safe only from people you&apos;d give commit
          access. If you&apos;re building a CMS where end users author content,
          this almost certainly means Markdown plus a sanitizer, not MDX.
        </p>
      </section>

      {/* Decision tree */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          Decision tree
        </h2>
        <ol className="list-decimal space-y-2 pl-6 leading-relaxed text-muted-foreground">
          <li>
            Does the file need to render directly on GitHub, GitLab, or a wiki
            that doesn&apos;t run a build? →{' '}
            <strong>Markdown.</strong>
          </li>
          <li>
            Are people you don&apos;t fully trust authoring the content? →{' '}
            <strong>Markdown.</strong> MDX content can import anything in your
            bundler.
          </li>
          <li>
            Do you want React components inline with the prose (callouts, tabs,
            live demos)? → <strong>MDX.</strong>
          </li>
          <li>
            Do you need computed values, imports, or expressions evaluated at
            build time? → <strong>MDX.</strong>
          </li>
          <li>
            Otherwise, when in doubt: → <strong>Markdown.</strong> You can
            promote it to MDX later without changing a line.
          </li>
        </ol>
      </section>

      {/* FAQ — rendered open (not as <details>) so AI crawlers can quote answers verbatim */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">
              {mdxVsMarkdownFaqs[0].question}
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              {mdxVsMarkdownFaqs[0].answer}
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">
              {mdxVsMarkdownFaqs[1].question}
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              {mdxVsMarkdownFaqs[1].answer}
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">
              {mdxVsMarkdownFaqs[2].question}
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              {FAQ3_LEAD}
              The{' '}
              <Link
                href="/mdx-to-markdown"
                className="text-primary underline-offset-2 hover:underline"
              >
                MDX to Markdown converter
              </Link>{' '}
              does this in the browser.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">
              {mdxVsMarkdownFaqs[3].question}
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              {mdxVsMarkdownFaqs[3].answer}
            </p>
          </div>
        </div>
      </section>

      {/* Byline */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <p className="text-xs text-muted-foreground">
          Maintained by Jamdesk &middot; Last reviewed{' '}
          <time dateTime={LAST_REVIEWED}>{FORMATTED_DATE}</time>
        </p>
      </section>
    </>
  )
}
