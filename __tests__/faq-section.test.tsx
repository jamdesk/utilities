import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { FaqSection } from '@/components/seo/FaqSection'
import { REPO_URL } from '@/lib/site'

describe('FaqSection', () => {
  it('turns github.com/jamdesk/utilities into a clickable link', () => {
    const html = renderToString(
      <FaqSection
        items={[
          {
            question: 'Is it open source?',
            answer:
              'Yes. The full source code is on GitHub at github.com/jamdesk/utilities, and there are no ads.',
          },
        ]}
      />
    )
    expect(html).toContain(`href="${REPO_URL}"`)
    expect(html).toContain('>github.com/jamdesk/utilities</a>')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('preserves surrounding text on both sides of the link', () => {
    const html = renderToString(
      <FaqSection
        items={[
          {
            question: 'Q?',
            answer: 'before github.com/jamdesk/utilities after',
          },
        ]}
      />
    )
    expect(html).toContain('before ')
    expect(html).toContain(' after')
  })

  it('renders unchanged when the answer has no repo URL', () => {
    const html = renderToString(
      <FaqSection
        items={[{ question: 'Q?', answer: 'Just plain text.' }]}
      />
    )
    expect(html).toContain('Just plain text.')
    expect(html).not.toContain('<a ')
  })
})
