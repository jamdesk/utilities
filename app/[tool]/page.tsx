import Link from 'next/link'
import { notFound } from 'next/navigation'
import { tools, getToolBySlug } from '@/lib/tools'
import { toolSeoContent } from '@/lib/tool-seo-content'
import { FaqSection } from '@/components/seo/FaqSection'
import { ConversionCta } from '@/components/seo/ConversionCta'
import { ToolEditor } from '@/components/tools/ToolEditor'

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
  const relatedTools = tools.filter((t) => t.slug !== tool.slug)

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-8 pt-12">
        <span className="mb-4 inline-block rounded-full border border-[#2a2640] bg-[#1a1725] px-4 py-1.5 text-xs text-[#6b6b78]">
          Free &middot; Open Source &middot; Client-side
        </span>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#e0e0e4] sm:text-4xl">
          {tool.name}
        </h1>
        <p className="text-lg text-[#6b6b78]">{tool.description}</p>
      </section>

      {/* Editor */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <ToolEditor slug={slug} />
      </section>

      {/* Conversion CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-12">
        <ConversionCta
          text={tool.ctaText}
          description={tool.ctaDescription}
          toolSlug={tool.slug}
        />
      </section>

      {/* How-to section */}
      {seoContent && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 text-2xl font-bold text-[#e0e0e4]">
            {seoContent.howToTitle}
          </h2>
          <p className="leading-relaxed text-[#6b6b78]">
            {seoContent.howToContent}
          </p>
        </section>
      )}

      {/* FAQ */}
      {seoContent && seoContent.faq.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#e0e0e4]">
            Frequently Asked Questions
          </h2>
          <FaqSection items={seoContent.faq} />
        </section>
      )}

      {/* Related tools */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-[#e0e0e4]">
          Related Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {relatedTools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="group rounded-lg border border-[#2a2640] bg-[#1a1725] p-5 transition-all hover:border-[#7c3aed]/50 hover:shadow-[0_0_24px_-6px_rgba(124,58,237,0.15)]"
            >
              <span className="mb-2 block text-xl">{t.icon}</span>
              <h3 className="mb-1 text-sm font-semibold text-[#e0e0e4] transition-colors group-hover:text-[#a78bfa]">
                {t.name}
              </h3>
              <p className="text-xs text-[#6b6b78]">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
