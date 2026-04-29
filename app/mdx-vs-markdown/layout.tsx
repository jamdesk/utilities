import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildArticleSchema, buildFaqSchema } from '@/components/seo/JsonLdScript'
import { mdxVsMarkdownFaqs } from '@/lib/mdx-vs-markdown-faqs'

const PAGE_URL = 'https://www.jamdesk.com/utilities/mdx-vs-markdown'
const DESCRIPTION =
  'MDX vs Markdown explained. Syntax differences, performance trade-offs, ecosystem support, and a decision tree for choosing between them.'

export const metadata: Metadata = {
  title: { absolute: 'MDX vs Markdown — When to Use Each (2026 Guide) | Jamdesk' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'MDX vs Markdown — When to Use Each | Jamdesk',
    description: 'MDX vs Markdown explained. Syntax, performance, and a decision tree.',
    url: PAGE_URL,
    siteName: 'Jamdesk',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDX vs Markdown — When to Use Each | Jamdesk',
    description: 'MDX vs Markdown explained. Syntax, performance, and a decision tree.',
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
