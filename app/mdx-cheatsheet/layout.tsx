import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildArticleSchema, buildFaqSchema } from '@/components/seo/JsonLdScript'
import { cheatsheetFaqs } from '@/lib/mdx-cheatsheet-data'

const PAGE_URL = 'https://www.jamdesk.com/utilities/mdx-cheatsheet'
const DESCRIPTION =
  'MDX syntax with copy-paste examples for Markdown basics, MDX additions, JSX components, and the blank-line rule.'

export const metadata: Metadata = {
  title: { absolute: 'MDX Cheatsheet — Syntax Reference with Live Examples | Jamdesk' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'MDX Cheatsheet — Syntax Reference | Jamdesk',
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Jamdesk',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDX Cheatsheet — Syntax Reference | Jamdesk',
    description: DESCRIPTION,
  },
}

const articleSchema = buildArticleSchema({
  headline: 'MDX Cheatsheet',
  description: DESCRIPTION,
  url: PAGE_URL,
})

export default function CheatsheetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={buildFaqSchema(cheatsheetFaqs)} />
      {children}
    </>
  )
}
