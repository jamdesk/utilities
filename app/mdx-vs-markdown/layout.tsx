import type { Metadata } from 'next'
import { LAST_REVIEWED } from '@/lib/tools'
import { ORG_NAME, ORG_URL, LICENSE_URL } from '@/lib/site'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildFaqSchema } from '@/components/seo/JsonLdScript'

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

const CREATOR = { '@type': 'Organization', name: ORG_NAME, url: ORG_URL }

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MDX vs Markdown',
  description:
    'Comparison of MDX and Markdown including syntax, performance, and ecosystem support.',
  url: PAGE_URL,
  mainEntityOfPage: PAGE_URL,
  inLanguage: 'en',
  author: CREATOR,
  publisher: CREATOR,
  dateModified: LAST_REVIEWED,
  license: LICENSE_URL,
  isPartOf: { '@type': 'WebSite', name: 'Jamdesk', url: 'https://www.jamdesk.com' },
}

/**
 * Source of truth for the four FAQ questions. The visible FAQ section in
 * page.tsx imports this so the JSON-LD `acceptedAnswer.text` and the rendered
 * answer never drift apart.
 *
 * The third answer's visible version replaces the trailing literal URL with a
 * `<Link>` to the converter. The plain-text URL stays here so AI crawlers
 * extracting the FAQPage schema get a self-contained citable answer.
 */
export const mdxVsMarkdownFaqs = [
  {
    question: 'What is the difference between MDX and Markdown?',
    answer:
      'Markdown is a plain-text formatting syntax. MDX extends Markdown with JSX, so you can embed React components, JavaScript expressions, and ES module imports inside your content. Every valid Markdown file is also valid MDX.',
  },
  {
    question: 'Should I use MDX or Markdown?',
    answer:
      'Use Markdown when content is static and needs to render in many places without a build step: READMEs, GitHub wikis, Notion exports. Use MDX when you need interactive components, dynamic data, or React-driven layouts inside your content.',
  },
  {
    question: 'Can MDX be converted to plain Markdown?',
    answer:
      'Yes. JSX components, imports, and exports can be stripped to produce plain Markdown. Inline content inside components is preserved; component-only behavior like custom layouts is lost. The MDX to Markdown converter at jamdesk.com/utilities/mdx-to-markdown does this in the browser.',
  },
  {
    question: 'Is MDX slower than Markdown?',
    answer:
      'MDX adds a JSX compilation step, which is slightly slower than parsing plain Markdown. The overhead is negligible at build time and irrelevant at runtime when MDX is statically rendered. For very large content sets, plain Markdown stays marginally faster.',
  },
] as const

export default function MdxVsMarkdownLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={buildFaqSchema([...mdxVsMarkdownFaqs])} />
      {children}
    </>
  )
}
