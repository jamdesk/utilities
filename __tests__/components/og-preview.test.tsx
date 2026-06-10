import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { OgPreview } from '@/components/tools/OgPreview'
import type { OgPreviewResult } from '@/lib/og-types'

const fakeResult: OgPreviewResult = {
  inputUrl: 'https://example.com/',
  finalUrl: 'https://example.com/',
  status: 200,
  meta: {
    title: 'HTML Title',
    description: undefined,
    og: {
      title: 'OG Example Title',
      description: 'OG description',
      image: 'https://example.com/og.png',
      site_name: 'Example',
      url: 'https://example.com/',
    },
    twitter: { card: 'summary_large_image' },
    rawTags: [
      { name: 'og:title', content: 'OG Example Title', source: 'og' },
      { name: 'twitter:card', content: 'summary_large_image', source: 'twitter' },
    ],
  },
  images: {
    'https://example.com/og.png': {
      url: 'https://example.com/og.png',
      ok: true,
      contentType: 'image/png',
      bytes: 50_000,
      width: 1200,
      height: 630,
    },
  },
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(fakeResult) })
  )
})

afterEach(() => {
  cleanup()
  // The component writes ?url=… via history.replaceState; reset so the
  // deep-link effect doesn't auto-run in the next test.
  window.history.replaceState(null, '', '/')
  vi.unstubAllGlobals()
})

describe('OgPreview', () => {
  it('fetches the API and renders all platform previews', async () => {
    render(<OgPreview />)
    fireEvent.change(screen.getByLabelText('URL to preview'), {
      target: { value: 'https://example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))

    expect(await screen.findByText('X (Twitter)')).toBeDefined()
    for (const label of ['Facebook', 'LinkedIn', 'Slack', 'Discord', 'WhatsApp', 'iMessage', 'Google']) {
      expect(screen.getByText(label)).toBeDefined()
    }
    // og:title flows into multiple cards
    expect(screen.getAllByText('OG Example Title').length).toBeGreaterThan(1)
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/utilities/api/og-preview?url=' + encodeURIComponent('https://example.com')
    )
  })

  it('prepends https:// to bare domains', async () => {
    render(<OgPreview />)
    fireEvent.change(screen.getByLabelText('URL to preview'), {
      target: { value: 'example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))
    await screen.findByText('X (Twitter)')
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      '/utilities/api/og-preview?url=' + encodeURIComponent('https://example.com')
    )
  })

  it('shows the API error message on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: 'Local and internal addresses are not allowed' }),
      })
    )
    render(<OgPreview />)
    fireEvent.change(screen.getByLabelText('URL to preview'), {
      target: { value: 'http://localhost' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))
    expect(await screen.findByRole('alert')).toBeDefined()
    expect(screen.getByText('Local and internal addresses are not allowed')).toBeDefined()
  })
})
