import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildArticleSchema, buildFaqSchema } from '@/components/seo/JsonLdScript'
import { mdxVsMarkdownFaqs } from '@/lib/mdx-vs-markdown-faqs'

const PAGE_URL = 'https://www.jamdesk.com/utilities/mdx-vs-markdown'
const DESCRIPTION =
  'MDX vs Markdown explained. Syntax differences, performance trade-offs, ecosystem support, and a decision tree for choosing between them.'
const OG_DESCRIPTION =
  'MDX vs Markdown explained. Syntax, performance, and a decision tree.'
// See note in mdx-cheatsheet/layout.tsx. Reuses hub image until per-page
// static images are generated.
const OG_IMAGE = 'https://www.jamdesk.com/utilities/og/hub.png'

export const metadata: Metadata = {
  title: { absolute: 'MDX vs Markdown — When to Use Each (2026 Guide) | Jamdesk' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'MDX vs Markdown — When to Use Each | Jamdesk',
    description: OG_DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Jamdesk',
    type: 'article',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'MDX vs Markdown — When to Use Each' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDX vs Markdown — When to Use Each | Jamdesk',
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
}

const articleSchema = buildArticleSchema({
  headline: 'MDX vs Markdown',
  description:
    'Comparison of MDX and Markdown including syntax, performance, and ecosystem support.',
  url: PAGE_URL,
})

export default function MdxVsMarkdownLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={buildFaqSchema(mdxVsMarkdownFaqs)} />
      {children}
    </>
  )
}
