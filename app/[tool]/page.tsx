import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getToolBySlug, getToolFaqs, LAST_REVIEWED, getRelatedTools } from '@/lib/tools'
import { toolSeoContent } from '@/lib/tool-seo-content'
import { FaqSection } from '@/components/seo/FaqSection'
import { ConversionCta } from '@/components/seo/ConversionCta'
import { OpenSourceNote } from '@/components/seo/OpenSourceNote'
import { ToolEditor } from '@/components/tools/ToolEditor'
import { REPO_URL } from '@/lib/site'

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>
}) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  const seoContent = toolSeoContent[tool.slug]
  const relatedTools = getRelatedTools(tool)

  return (
    <>
      {/* Hero — left-aligned, same max-width as editor */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 sm:pb-8 sm:pt-12">
        <span className="mb-2 inline-block rounded-full border border-border bg-card px-3 py-1 text-[10px] sm:mb-4 sm:px-4 sm:py-1.5 sm:text-xs text-muted-foreground">
          Free &middot;{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
            aria-label="Open source — view repository on GitHub (Apache 2.0)"
          >
            Open source
          </a>
          {' '}&middot; Client-side
        </span>
        <h1 className="mb-1 font-heading text-xl font-bold tracking-tight text-foreground [text-wrap:balance] sm:mb-3 sm:text-4xl">
          {tool.name}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-lg">{tool.description}</p>
        {(tool.slug.startsWith('mdx-') || tool.slug.startsWith('markdown-') || tool.slug.endsWith('-mdx')) && (
          <p className="mt-2 text-xs text-muted-foreground">
            New to MDX? Read{' '}
            <Link href="/mdx-vs-markdown" className="text-primary underline-offset-2 hover:underline">
              MDX vs Markdown
            </Link>{' '}
            or browse the{' '}
            <Link href="/mdx-cheatsheet" className="text-primary underline-offset-2 hover:underline">
              MDX cheatsheet
            </Link>
            .
          </p>
        )}
      </section>

      {/* Editor — wider container, tighter padding on mobile */}
      <section className="mx-auto max-w-7xl px-2 pb-8 sm:px-6 sm:pb-12">
        <ToolEditor slug={slug} />
      </section>

      {/* How-to section */}
      {seoContent && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            {seoContent.howToTitle}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {seoContent.howToContent}
          </p>
        </section>
      )}

      {/* Detail sections */}
      {seoContent?.detailSections && seoContent.detailSections.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          {seoContent.detailSections.map((section, i) => (
            <div key={i} className={i > 0 ? 'mt-8' : ''}>
              <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                {section.heading}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* FAQ — leads with the tool-specific free/open-source entry to prime AI extraction */}
      {seoContent && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <FaqSection items={getToolFaqs(tool)} />
        </section>
      )}

      {/* Open source / client-side note */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <OpenSourceNote tool={tool} />
        <p className="mt-4 text-xs text-muted-foreground">
          Maintained by Jamdesk &middot; Last reviewed{' '}
          <time dateTime={LAST_REVIEWED}>{LAST_REVIEWED}</time>
        </p>
      </section>

      {/* Related tools */}
      <section className="mx-auto max-w-4xl px-6 pb-12">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          Related Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {relatedTools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="group rounded-lg border border-border bg-card p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <span className="mb-2 block text-xl">{t.icon}</span>
              <h3 className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {t.name}
              </h3>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Conversion CTA — placed at end so the page leads with content,
          not a pitch */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <ConversionCta
          text={tool.ctaText}
          description={tool.ctaDescription}
          toolSlug={tool.slug}
        />
      </section>
    </>
  )
}
