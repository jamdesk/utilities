import { describe, it, expect } from 'vitest'
import { tools, getToolBySlug } from '../lib/tools'

describe('tool registry', () => {
  it('has no duplicate slugs', () => {
    const slugs = tools.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('all slugs are valid URL segments', () => {
    for (const tool of tools) {
      expect(tool.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('all tools have required fields', () => {
    for (const tool of tools) {
      expect(tool.name).toBeTruthy()
      expect(tool.description).toBeTruthy()
      expect(tool.seoTitle).toBeTruthy()
      expect(tool.seoDescription).toBeTruthy()
    }
  })

  it('getToolBySlug returns correct tool', () => {
    expect(getToolBySlug('mdx-formatter')?.name).toBe('MDX Formatter')
  })

  it('getToolBySlug returns undefined for unknown slug', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })
})
