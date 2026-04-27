import { describe, it, expect } from 'vitest'
import { tools, getToolBySlug, freeFaqEntry } from '../lib/tools'

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
      expect(tool.seoSubject).toBeTruthy()
    }
  })

  it('freeFaqEntry names every tool with both keywords', () => {
    for (const tool of tools) {
      const entry = freeFaqEntry(tool)
      const subjectLower = tool.seoSubject.replace(/^The /, 'the ')
      expect(entry.question).toContain(subjectLower)
      expect(entry.question).toMatch(/free and open source/)
      expect(entry.answer).toContain(tool.seoSubject)
      expect(entry.answer).toMatch(/Apache 2\.0/)
      expect(entry.answer).toContain('github.com/jamdesk/utilities')
    }
  })

  it('getToolBySlug returns correct tool', () => {
    expect(getToolBySlug('mdx-formatter')?.name).toBe('MDX Formatter')
  })

  it('getToolBySlug returns undefined for unknown slug', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })
})
