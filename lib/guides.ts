/**
 * Long-form content pages that aren't tools. Consumed by the command palette,
 * llms.txt, and any future "all routes" surface so we don't have to remember to
 * update each file when a guide is added.
 */
export const guides = [
  {
    slug: 'mdx-cheatsheet',
    icon: '📘',
    name: 'MDX Cheatsheet',
    description: 'Syntax reference for Markdown and MDX',
  },
  {
    slug: 'mdx-vs-markdown',
    icon: '⚖️',
    name: 'MDX vs Markdown',
    description: 'Compare formats and choose the right one',
  },
] as const

export type Guide = (typeof guides)[number]
