import type { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/lib/tools'
import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { FaqSection } from '@/components/seo/FaqSection'
import { OpenSourceNote } from '@/components/seo/OpenSourceNote'
import { REPO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: {
    absolute:
      'Free MDX & Developer Utilities | Jamdesk',
  },
  description:
    'Free, open-source developer tools for MDX, Markdown, YAML, and JSON. Format, validate, convert, and preview — all client-side, no data leaves your browser.',
  alternates: {
    canonical: 'https://www.jamdesk.com/utilities',
  },
  openGraph: {
    title: 'Free MDX & Developer Utilities | Jamdesk',
    description:
      'Free, open-source developer tools for MDX, Markdown, YAML, and JSON. Format, validate, convert, and preview — all client-side.',
    url: 'https://www.jamdesk.com/utilities',
    siteName: 'Jamdesk',
    type: 'website',
    images: [
      {
        url: 'https://www.jamdesk.com/utilities/og/hub.png',
        width: 1200,
        height: 630,
        alt: 'Developer Utilities by Jamdesk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free MDX & Developer Utilities | Jamdesk',
    description:
      'Free, open-source developer tools for MDX, Markdown, YAML, and JSON. Format, validate, convert, and preview — all client-side.',
    images: ['https://www.jamdesk.com/utilities/og/hub.png'],
  },
}

const FAQ_ITEMS = [
  {
    question: 'What is MDX?',
    answer:
      'MDX is a format that combines Markdown with JSX. It lets you write content using familiar Markdown syntax while embedding React components directly in your documents. MDX is widely used for documentation sites, blogs, and content-driven applications.',
  },
  {
    question: 'Are these tools free?',
    answer:
      'Yes, all MDX Utilities are completely free to use. The project is open source under the Apache 2.0 license, so you can also inspect the source code and contribute on GitHub.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'All processing happens entirely in your browser. Your MDX content is never sent to a server, never stored, and never logged. You can verify this by inspecting the network tab in your browser developer tools.',
  },
  {
    question: 'Can I use these tools offline?',
    answer:
      'Once the page has loaded, the tools work without an internet connection since all processing is client-side. However, you need an initial page load to download the JavaScript.',
  },
  {
    question: 'Are the tools open source?',
    answer:
      'Yes. MDX Utilities is open source under the Apache 2.0 license. You can view the source code, report issues, and contribute at github.com/jamdesk/utilities.',
  },
]

export default function Home() {
  return (
    <>
      <JsonLdScript type="collection" tools={tools} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-foreground [text-wrap:balance] sm:text-5xl">
          Developer Utilities
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Free, open source tools for documentation
        </p>
        <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
          Client-side &middot; No ads &middot;{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
            aria-label="Open source — view repository on GitHub (Apache 2.0)"
          >
            Open source
          </a>
        </span>
      </section>

      {/* Tool grid */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group rounded-xl border border-border bg-card p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <span className="mb-3 block text-2xl">{tool.icon}</span>
              <h2 className="mb-1 text-lg font-semibold text-foreground [text-wrap:balance] transition-colors group-hover:text-primary">
                {tool.name}
              </h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What is MDX? */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground [text-wrap:balance]">
          What is MDX?
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          MDX extends standard Markdown by letting you embed JSX components
          directly in your content. Write headings, lists, and paragraphs in
          Markdown, then drop in interactive React components wherever you need
          them — tabs, callouts, code playgrounds, or anything else your
          framework supports. MDX files are compiled to JavaScript, so they work
          with any React-based framework including Next.js, Gatsby, and Remix.
          The format has become the standard for documentation sites, design
          systems, and content-heavy applications where authors want the
          simplicity of Markdown with the flexibility of components.
          {' '}
          <a
            href="https://www.jamdesk.com/docs/content/react-components"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            See how Jamdesk uses MDX components
          </a>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Need the syntax for a specific MDX feature? The{' '}
          <Link
            href="/mdx-cheatsheet"
            className="text-primary hover:underline"
          >
            MDX Cheatsheet
          </Link>{' '}
          covers Markdown basics, MDX additions, and the blank-line gotcha.
        </p>
      </section>

      {/* Why use MDX for documentation? */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground [text-wrap:balance]">
          Why use MDX for documentation?
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Documentation written in MDX stays readable as source files while
          producing rich, interactive output. Authors write in Markdown they
          already know, and engineers define reusable components for API
          references, configuration tables, or live code examples. Version
          control works naturally since MDX is plain text. Frontmatter gives you
          structured metadata for titles, descriptions, and navigation without a
          separate CMS. Because MDX compiles to React, you get type checking,
          component composition, and the full npm ecosystem. Teams that adopt MDX
          for docs find that content stays closer to the codebase, updates ship
          faster, and the gap between writing and publishing narrows
          significantly.
          {' '}
          <a
            href="https://www.jamdesk.com/docs/quickstart"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get started with Jamdesk
          </a>.
        </p>
      </section>

      {/* Open source / client-side note */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <OpenSourceNote heading="Free, open source, and client-side" />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground [text-wrap:balance]">
          Frequently Asked Questions
        </h2>
        <FaqSection items={FAQ_ITEMS} />
      </section>
    </>
  )
}
