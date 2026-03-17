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
      {/* Hero — left-aligned, same max-width as editor */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <span className="mb-4 inline-block rounded-full border border-[#e8e4df] bg-white px-4 py-1.5 text-xs text-[#5a6f77]">
          Free &middot; Open Source &middot; Client-side
        </span>
        <h1 className="mb-3 font-[family-name:var(--font-dm-sans)] text-3xl font-bold tracking-tight text-[#1b3139] sm:text-4xl">
          {tool.name}
        </h1>
        <p className="text-lg text-[#5a6f77]">{tool.description}</p>
      </section>

      {/* Editor — wider container */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
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
          <h2 className="mb-4 font-[family-name:var(--font-dm-sans)] text-2xl font-bold text-[#1b3139]">
            {seoContent.howToTitle}
          </h2>
          <p className="leading-relaxed text-[#5a6f77]">
            {seoContent.howToContent}
          </p>
        </section>
      )}

      {/* FAQ */}
      {seoContent && seoContent.faq.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-6 font-[family-name:var(--font-dm-sans)] text-2xl font-bold text-[#1b3139]">
            Frequently Asked Questions
          </h2>
          <FaqSection items={seoContent.faq} />
        </section>
      )}

      {/* Related tools */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="mb-6 font-[family-name:var(--font-dm-sans)] text-2xl font-bold text-[#1b3139]">
          Related Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {relatedTools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="group rounded-lg border border-[#e8e4df] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all hover:border-[#ff3621]/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <span className="mb-2 block text-xl">{t.icon}</span>
              <h3 className="mb-1 text-sm font-semibold text-[#1b3139] transition-colors group-hover:text-[#ff3621]">
                {t.name}
              </h3>
              <p className="text-xs text-[#5a6f77]">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
