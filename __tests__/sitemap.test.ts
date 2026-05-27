import { describe, it, expect } from 'vitest'
import sitemap from '@/app/sitemap'
import { tools } from '@/lib/tools'
import { guides } from '@/lib/guides'

describe('sitemap', () => {
  const baseUrl = 'https://www.jamdesk.com/utilities'
  const urls = sitemap().map((e) => e.url)

  it('includes the hub URL', () => {
    expect(urls).toContain(baseUrl)
  })

  it('includes every tool slug', () => {
    for (const tool of tools) {
      expect(urls).toContain(`${baseUrl}/${tool.slug}`)
    }
  })

  it('includes every guide slug', () => {
    for (const guide of guides) {
      expect(urls).toContain(`${baseUrl}/${guide.slug}`)
    }
  })

  it('has no duplicate entries', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('total entry count matches hub + tools + guides', () => {
    expect(urls).toHaveLength(1 + tools.length + guides.length)
  })
})
