/**
 * Source of truth for /utilities/mdx-vs-markdown FAQs.
 *
 * Entry 3 keeps a literal URL fragment in its `answer` string so the FAQPage
 * JSON-LD remains self-contained for AI crawlers (citable without fetching the
 * page). The visible JSX in page.tsx renders the same answer with a real Next
 * <Link> in place of the URL — `mdxVsMarkdownFaq3Parts` exposes the typed
 * pieces so visible and JSON-LD versions cannot drift.
 */
// linkHref is the source of truth; linkUrl is derived so the visible
// <Link> and the JSON-LD answer string can never drift apart.
const FAQ3_HREF = '/mdx-to-markdown'

const FAQ3 = {
  question: 'Can MDX be converted to plain Markdown?',
  lead:
    'Yes. JSX components, imports, and exports can be stripped to produce plain Markdown. Inline content inside components is preserved; component-only behavior like custom layouts is lost.',
  linkText: 'MDX to Markdown converter',
  linkHref: FAQ3_HREF,
  linkUrl: `jamdesk.com/utilities${FAQ3_HREF}`,
  trailing: 'does this in the browser.',
} as const

export const mdxVsMarkdownFaq3Parts = FAQ3

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
    question: FAQ3.question,
    answer: `${FAQ3.lead} The ${FAQ3.linkText} at ${FAQ3.linkUrl} ${FAQ3.trailing}`,
  },
  {
    question: 'Is MDX slower than Markdown?',
    answer:
      'MDX adds a JSX compilation step, which is slightly slower than parsing plain Markdown. The overhead is negligible at build time and irrelevant at runtime when MDX is statically rendered. For very large content sets, plain Markdown stays marginally faster.',
  },
] as const
