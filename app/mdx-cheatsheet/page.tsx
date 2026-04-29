import Link from 'next/link'
import { LAST_REVIEWED } from '@/lib/tools'
import {
  cheatsheetGroups,
  cheatsheetFaqs,
} from '@/lib/mdx-cheatsheet-data'
import { CheatsheetCopyHandler } from '@/components/cheatsheet/CheatsheetCopyHandler'
import { FaqSection } from '@/components/seo/FaqSection'

export default function MdxCheatsheetPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-6 pt-12">
        <span className="mb-3 inline-block rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
          Updated <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </span>
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight">
          MDX Cheatsheet
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          MDX combines Markdown with JSX. Write content in Markdown the way you
          always have, then drop in React components and JavaScript expressions
          wherever you need them: callouts, tabs, dynamic data, anything you
          can build with React. Because the file compiles to a JavaScript
          module, MDX works with React, Next.js, Astro, Remix, and Gatsby. The
          spec lives at{' '}
          <a
            href="https://mdxjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            mdxjs.com
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Validate your MDX with the{' '}
          <Link
            href="/mdx-validator"
            className="text-primary underline-offset-2 hover:underline"
          >
            MDX Validator
          </Link>{' '}
          or format it with the{' '}
          <Link
            href="/mdx-formatter"
            className="text-primary underline-offset-2 hover:underline"
          >
            MDX Formatter
          </Link>
          .
        </p>
      </section>

      {cheatsheetGroups.map((group) => (
        <section key={group.heading} className="mx-auto max-w-3xl px-6 pb-8">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            {group.heading}
          </h2>
          <div className="space-y-4">
            {group.entries.map((entry) => (
              <div
                key={entry.label}
                data-cheatsheet-row
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {entry.label}
                  </h3>
                  <button
                    type="button"
                    data-copy-snippet
                    data-label={entry.label}
                    aria-label={`Copy ${entry.label} snippet`}
                    className="group rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground data-[state=copied]:text-primary"
                  >
                    <span className="group-data-[state=copied]:hidden">
                      Copy
                    </span>
                    <span className="hidden group-data-[state=copied]:inline">
                      Copied!
                    </span>
                  </button>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {entry.description}
                </p>
                <pre
                  data-snippet={entry.snippet}
                  aria-label={`${entry.label} example`}
                  className="overflow-x-auto rounded bg-muted p-3 text-xs"
                >
                  <code>{entry.snippet}</code>
                </pre>
                {entry.toolSlug && entry.toolLabel && (
                  <p className="mt-3 text-xs">
                    <Link
                      href={`/${entry.toolSlug}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {entry.toolLabel} →
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <CheatsheetCopyHandler />

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <p className="text-sm text-muted-foreground">
          Need plain Markdown output? Run your file through the{' '}
          <Link
            href="/mdx-to-markdown"
            className="text-primary underline-offset-2 hover:underline"
          >
            MDX → Markdown converter
          </Link>
          . It strips imports, exports, and JSX, leaving the Markdown body.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <FaqSection items={cheatsheetFaqs} />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <p className="text-xs text-muted-foreground">
          Maintained by Jamdesk &middot; Last reviewed{' '}
          <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </p>
      </section>
    </>
  )
}
