import Link from 'next/link'
import { LAST_REVIEWED } from '@/lib/tools'
import { cheatsheetEntries } from '@/lib/mdx-cheatsheet-data'
import { CheatsheetCopyHandler } from '@/components/cheatsheet/CheatsheetCopyHandler'

export default function MdxCheatsheetPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-12">
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight">
          MDX Cheatsheet
        </h1>
        <p className="text-lg text-muted-foreground">
          Every MDX feature in one page, with copy-paste examples. Validate your
          MDX with the{' '}
          <Link href="/mdx-validator" className="text-primary underline-offset-2 hover:underline">
            MDX Validator
          </Link>{' '}
          or format it with the{' '}
          <Link href="/mdx-formatter" className="text-primary underline-offset-2 hover:underline">
            MDX Formatter
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-4 px-6 pb-12">
        {cheatsheetEntries.map((entry) => (
          <div
            key={entry.label}
            data-cheatsheet-row
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {entry.label}
              </h2>
              <button
                type="button"
                data-copy-snippet
                data-label={entry.label}
                aria-label={`Copy ${entry.label} snippet`}
                className="group rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground data-[state=copied]:text-primary"
              >
                <span className="group-data-[state=copied]:hidden">Copy</span>
                <span className="hidden group-data-[state=copied]:inline">Copied!</span>
              </button>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{entry.description}</p>
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
      </section>

      <CheatsheetCopyHandler />

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <p className="text-xs text-muted-foreground">
          Maintained by Jamdesk &middot; Last reviewed <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </p>
      </section>
    </>
  )
}
