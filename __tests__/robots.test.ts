import { describe, it, expect } from 'vitest'
import robots from '../app/robots'

describe('robots.txt', () => {
  it('returns valid robots metadata', () => {
    const result = robots()
    expect(result.rules).toBeDefined()
    expect(result.sitemap).toBe(
      'https://www.jamdesk.com/utilities/sitemap.xml'
    )
  })

  it('allows all user agents', () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
    const allRule = rules.find(
      (r: { userAgent: string }) => r.userAgent === '*'
    )
    expect(allRule).toBeDefined()
    expect(allRule!.allow).toBe('/')
  })
})
