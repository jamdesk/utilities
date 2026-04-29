import { describe, it, expect } from 'vitest'
import { buildToolSchema } from '@/components/seo/JsonLdScript'
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
