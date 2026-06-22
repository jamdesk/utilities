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
      'Free Developer Utilities — MDX, Markdown, Mermaid, YAML | Jamdesk',
  },
  description:
    'Free, open-source tools for documentation work: format and validate MDX, convert Markdown, edit Mermaid diagrams, and check YAML, JSON, and social cards.',
  alternates: {
    canonical: 'https://www.jamdesk.com/utilities',
  },
  openGraph: {
    title: 'Free Developer Utilities — MDX, Markdown, Mermaid, YAML | Jamdesk',
    description:
      'Free, open-source tools for documentation work: format and validate MDX, convert Markdown, edit Mermaid diagrams, and check YAML, JSON, and social cards.',
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
    title: 'Free Developer Utilities — MDX, Markdown, Mermaid, YAML | Jamdesk',
    description:
      'Free, open-source tools for documentation work: format and validate MDX, convert Markdown, edit Mermaid diagrams, and check YAML, JSON, and social cards.',
    images: ['https://www.jamdesk.com/utilities/og/hub.png'],
  },
}

const FAQ_ITEMS = [
  {
    question: 'What can I do with these utilities?',
    answer:
      'Format, validate, preview, and convert MDX and Markdown. Validate YAML and convert between JSON and YAML. Turn CSV or spreadsheet data into Markdown tables. Edit Mermaid diagrams with a live preview. Check the social preview for any URL: how its share card looks on X, LinkedIn, Slack, Discord, and other platforms.',
  },
  {
    question: 'Are these tools free?',
    answer:
      'Yes, all Jamdesk Utilities are completely free to use. The project is open source under the Apache 2.0 license, so you can also inspect the source code and contribute on GitHub.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Almost everything runs entirely in your browser: your content is never sent to a server, never stored, and never logged. The one exception is the OpenGraph Preview, which fetches the URL you enter through a Jamdesk server because browsers block reading other sites directly. That response is parsed and discarded, never stored.',
  },
  {
    question: 'Can I use these tools offline?',
    answer:
      'Mostly, yes. Once the page has loaded, the client-side tools keep working without an internet connection. The OpenGraph Preview is the exception since it has to fetch the URL you want to check.',
  },
  {
    question: 'What is MDX?',
    answer:
      'MDX is a format that combines Markdown with JSX. It lets you write content using familiar Markdown syntax while embedding React components directly in your documents. MDX is widely used for documentation sites, blogs, and content-driven applications.',
  },
  {
    question: 'Are the tools open source?',
    answer:
      'Yes. Jamdesk Utilities is open source under the Apache 2.0 license. You can view the source code, report issues, and contribute at github.com/jamdesk/utilities.',
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
          Free, open source tools for MDX, Markdown, diagrams, config files,
          and social previews
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

      {/* Workflow overview */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground [text-wrap:balance]">
          Tools for the whole docs workflow
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Writing the words is the easy part of documentation. The slow parts
          are the chores around it: a table pasted from a spreadsheet that
          needs to become Markdown, a frontmatter block that won&apos;t parse,
          a diagram that needs three more boxes, a published page that looks
          wrong when someone shares it in Slack. Each utility here handles one
          of those chores. The MDX and Markdown tools format, validate,
          preview, and convert your content. The YAML and JSON tools catch
          config errors and convert between formats. The Mermaid Editor
          renders diagrams as you type, the table generator turns CSV or
          spreadsheet data into clean Markdown, and the OpenGraph Preview
          shows the social preview for any URL: how its share card will look
          on X, LinkedIn, Slack, and a half dozen other platforms.
          {' '}
          <a
            href="https://www.jamdesk.com/docs/quickstart"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get started with Jamdesk
          </a>{' '}
          if you want the finished docs site too.
        </p>
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
          covers Markdown basics, MDX additions, and the blank-line gotcha. Not
          sure which format to pick?{' '}
          <Link
            href="/mdx-vs-markdown"
            className="text-primary hover:underline"
          >
            MDX vs Markdown
          </Link>{' '}
          walks through the trade-offs.
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
