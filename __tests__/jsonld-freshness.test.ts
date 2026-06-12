import { describe, it, expect } from 'vitest'
import { buildToolSchema, buildArticleSchema } from '@/components/seo/JsonLdScript'
import { tools, LAST_REVIEWED } from '@/lib/tools'

describe('buildToolSchema freshness/author', () => {
  it('includes dateModified set to LAST_REVIEWED', () => {
    const schema = buildToolSchema(tools[0])
    expect(schema.dateModified).toBe(LAST_REVIEWED)
  })

  it('includes author as the Jamdesk Organization', () => {
    const schema = buildToolSchema(tools[0])
    expect(schema.author).toBeDefined()
    expect(schema.author['@type']).toBe('Organization')
    expect(schema.author.name).toBe('Jamdesk')
  })
})

describe('buildArticleSchema', () => {
  it('headline stays within Google rich-result cap (110 chars)', () => {
    // Long headlines silently disqualify the Article rich result. Guard against
    // a future copy edit that pushes either guide page past the cap.
    const cases = [
      { headline: 'MDX Cheatsheet', description: 'x', url: 'https://x.test' },
      { headline: 'MDX vs Markdown', description: 'x', url: 'https://x.test' },
    ]
    for (const c of cases) {
      const schema = buildArticleSchema(c)
      expect(schema.headline.length).toBeLessThanOrEqual(110)
    }
  })

  it('sets datePublished and dateModified', () => {
    const schema = buildArticleSchema({
      headline: 'x',
      description: 'x',
      url: 'https://x.test',
    })
    expect(schema.datePublished).toBe(LAST_REVIEWED)
    expect(schema.dateModified).toBe(LAST_REVIEWED)
  })
})
