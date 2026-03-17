import type { Metadata } from 'next'
import { tools, getToolBySlug } from '@/lib/tools'
import { toolSeoContent } from '@/lib/tool-seo-content'
import { JsonLdScript } from '@/components/seo/JsonLdScript'

export const dynamicParams = false

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>
}): Promise<Metadata> {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    return { title: 'Tool Not Found' }
  }

  return {
    title: { absolute: tool.seoTitle },
    description: tool.seoDescription,
    alternates: {
      canonical: `https://www.jamdesk.com/utilities/${tool.slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `https://www.jamdesk.com/utilities/${tool.slug}`,
      siteName: 'Jamdesk',
      type: 'website',
      images: [
        {
          url: `https://www.jamdesk.com/utilities/og/${tool.slug}.png`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  }
}

export default async function ToolLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tool: string }>
}) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)

  return (
    <>
      {tool && (
        <JsonLdScript
          type="tool"
          tools={tools}
          tool={tool}
          howTo={toolSeoContent[tool.slug] ? { title: toolSeoContent[tool.slug].howToTitle, content: toolSeoContent[tool.slug].howToContent } : undefined}
        />
      )}
      {children}
    </>
  )
}
