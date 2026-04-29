import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildArticleSchema, buildFaqSchema } from '@/components/seo/JsonLdScript'
import { cheatsheetFaqs } from '@/lib/mdx-cheatsheet-data'

const PAGE_URL = 'https://www.jamdesk.com/utilities/mdx-cheatsheet'
const DESCRIPTION =
  'MDX syntax with copy-paste examples for Markdown basics, MDX additions, JSX components, and the blank-line rule.'
// Explicit absolute URL for the auto-generated /opengraph-image route. Next's
// metadataBase doesn't include basePath, so relying on auto-resolution
// produces /mdx-cheatsheet/opengraph-image (404) instead of the correct
// /utilities/mdx-cheatsheet/opengraph-image. Pin it manually.
const OG_IMAGE = 'https://www.jamdesk.com/utilities/mdx-cheatsheet/opengraph-image'

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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'MDX Cheatsheet — Syntax Reference' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDX Cheatsheet — Syntax Reference | Jamdesk',
    description: DESCRIPTION,
    images: [OG_IMAGE],
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
