import { describe, it, expect } from 'vitest'
import { getRelatedTools, getToolBySlug } from '@/lib/tools'

describe('getRelatedTools', () => {
  it('returns exactly 3 tools', () => {
    const tool = getToolBySlug('mdx-formatter')!
    expect(getRelatedTools(tool)).toHaveLength(3)
  })

  it('never includes the current tool', () => {
    const tool = getToolBySlug('mdx-formatter')!
    const related = getRelatedTools(tool)
    expect(related.find((t) => t.slug === tool.slug)).toBeUndefined()
  })

  it('groups MDX tools together: mdx-formatter relates to other MDX tools', () => {
    const tool = getToolBySlug('mdx-formatter')!
    const related = getRelatedTools(tool)
    const mdxRelated = related.filter((t) => t.slug.startsWith('mdx-'))
    expect(mdxRelated.length).toBeGreaterThanOrEqual(2)
  })

  it('returns 3 even when the tool has no obvious group (yaml-validator)', () => {
    const tool = getToolBySlug('yaml-validator')!
    expect(getRelatedTools(tool)).toHaveLength(3)
  })

  it('honors explicit relatedSlugs override when present', () => {
    // Use yaml-validator (no registry override) so this test exercises the
    // override path rather than coincidentally matching a registered override.
    const tool = {
      ...getToolBySlug('yaml-validator')!,
      relatedSlugs: ['mdx-formatter', 'json-yaml-converter', 'mdx-validator'],
    }
    const related = getRelatedTools(tool)
    expect(related.map((t) => t.slug)).toEqual([
      'mdx-formatter',
      'json-yaml-converter',
      'mdx-validator',
    ])
  })

  it('mdx-to-markdown registry override is honored', () => {
    const tool = getToolBySlug('mdx-to-markdown')!
    expect(getRelatedTools(tool).map((t) => t.slug)).toEqual([
      'markdown-to-html',
      'mdx-validator',
      'mdx-viewer',
    ])
  })
})
