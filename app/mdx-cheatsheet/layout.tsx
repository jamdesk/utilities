import type { Metadata } from 'next'
import { LAST_REVIEWED } from '@/lib/tools'
import { ORG_NAME, ORG_URL, LICENSE_URL } from '@/lib/site'
import { JsonLd } from '@/components/seo/JsonLd'

const PAGE_URL = 'https://www.jamdesk.com/utilities/mdx-cheatsheet'

export const metadata: Metadata = {
  title: { absolute: 'MDX Cheatsheet — Syntax Reference with Live Examples | Jamdesk' },
  description:
    'Complete MDX syntax reference with copy-paste examples. Headings, frontmatter, JSX components, expressions, imports — every MDX feature in one page.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'MDX Cheatsheet — Syntax Reference | Jamdesk',
    description: 'Complete MDX syntax reference with copy-paste examples.',
    url: PAGE_URL,
    siteName: 'Jamdesk',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDX Cheatsheet — Syntax Reference | Jamdesk',
    description: 'Complete MDX syntax reference with copy-paste examples.',
  },
}

const CREATOR = { '@type': 'Organization', name: ORG_NAME, url: ORG_URL }

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MDX Cheatsheet',
  description: 'Complete MDX syntax reference with copy-paste examples.',
  url: PAGE_URL,
  mainEntityOfPage: PAGE_URL,
  inLanguage: 'en',
  author: CREATOR,
  publisher: CREATOR,
  dateModified: LAST_REVIEWED,
  license: LICENSE_URL,
  isPartOf: { '@type': 'WebSite', name: 'Jamdesk', url: 'https://www.jamdesk.com' },
}

export default function CheatsheetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={articleSchema} />
      {children}
    </>
  )
}
