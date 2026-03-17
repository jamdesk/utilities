import { describe, it, expect, vi, beforeEach } from 'vitest'
import { trackEvent } from '../lib/analytics'

describe('trackEvent', () => {
  beforeEach(() => {
    delete (window as any).plausible
  })

  it('calls plausible when available', () => {
    const mock = vi.fn()
    ;(window as any).plausible = mock
    trackEvent('Copy', { tool: 'mdx-formatter' })
    expect(mock).toHaveBeenCalledWith('Copy', { props: { tool: 'mdx-formatter' } })
  })

  it('does not throw when plausible is not loaded', () => {
    expect(() => trackEvent('Copy', { tool: 'mdx-formatter' })).not.toThrow()
  })

  it('passes undefined props when none provided', () => {
    const mock = vi.fn()
    ;(window as any).plausible = mock
    trackEvent('PageView')
    expect(mock).toHaveBeenCalledWith('PageView', { props: undefined })
  })
})
