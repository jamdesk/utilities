import Link from 'next/link'
import { LAST_REVIEWED } from '@/lib/tools'
import { mdxVsMarkdownFaqs } from './layout'

export default function MdxVsMarkdownPage() {
  return (
    <>
      {/* Hero — opens with a one-line answer so AI Overviews can extract it */}
      <section className="mx-auto max-w-3xl px-6 pb-6 pt-12">
        <span className="mb-3 inline-block rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
          Updated <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </span>
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight">
          MDX vs Markdown
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          MDX is Markdown plus JSX. Reach for Markdown when your content is
          static and needs to render in lots of places without a build step.
          Pick MDX when you want React components, computed values, or
          interactivity inline with your prose.
        </p>
      </section>

      {/* At a glance — comparison table */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          At a glance
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border bg-card [&_td]:px-4 [&_td]:py-3 [&_tr]:border-b [&_tr]:border-border last:[&_tr]:border-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Markdown</th>
                <th className="px-4 py-3 font-semibold">MDX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JSX components</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Imports / exports</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>JS expressions</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>YAML frontmatter</td>
                <td>Yes (with parser)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Standard Markdown syntax</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>GitHub renders directly</td>
                <td>Yes</td>
                <td>No (renders as text)</td>
              </tr>
              <tr>
                <td>Build step required</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Best for</td>
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
          Stick with Markdown for content that needs to travel. READMEs, GitHub
          wikis, GitLab pages, Confluence exports, Notion documents, internal
          team docs: all of these render Markdown natively. The format is
          portable, easy to diff, and survives copy-paste between tools without
          mangling. If a future maintainer might open the file in a basic
          editor and expect it to just work, that&apos;s a Markdown file.
        </p>
      </section>

      {/* When to use MDX */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          When to use MDX
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Pick MDX when prose alone isn&apos;t enough. Code playgrounds,
          callout components, tabbed examples, live charts, conditional
          rendering against your own data: all of it slots into MDX without
          leaving the file. Adoption is broad. Next.js, Docusaurus, Astro, and
          Gatsby all ship first-class MDX support. Best of all, the move is
          additive, not disruptive. Because every Markdown file is already
          valid MDX, you can rename <code>.md</code> to <code>.mdx</code> and
          start adding components incrementally. No rewrite required.
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
              Yes. JSX components, imports, and exports can be stripped to
              produce plain Markdown. Inline content inside components is
              preserved; component-only behavior like custom layouts is lost.
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
          <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </p>
      </section>
    </>
  )
}
