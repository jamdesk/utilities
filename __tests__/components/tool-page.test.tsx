import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { tools } from '../../lib/tools'
import { toolSeoContent } from '../../lib/tool-seo-content'

afterEach(() => {
  cleanup()
})

describe('tool page data', () => {
  it('every tool has SEO content', () => {
    for (const tool of tools) {
      const content = toolSeoContent[tool.slug]
      expect(content).toBeDefined()
      expect(content.howToTitle).toBeTruthy()
      expect(content.howToContent).toBeTruthy()
      expect(content.faq.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('every tool has CTA fields', () => {
    for (const tool of tools) {
      expect(tool.ctaText).toBeTruthy()
      expect(tool.ctaDescription).toBeTruthy()
    }
  })

  it('every tool has SEO metadata fields', () => {
    for (const tool of tools) {
      expect(tool.seoTitle).toBeTruthy()
      expect(tool.seoDescription).toBeTruthy()
      expect(tool.seoDescription.length).toBeGreaterThanOrEqual(80)
    }
  })

  it('generateStaticParams would return all tool slugs', () => {
    const params = tools.map((tool) => ({ tool: tool.slug }))
    expect(params).toHaveLength(4)
    expect(params.map((p) => p.tool)).toContain('mdx-formatter')
    expect(params.map((p) => p.tool)).toContain('mdx-validator')
    expect(params.map((p) => p.tool)).toContain('mdx-viewer')
    expect(params.map((p) => p.tool)).toContain('mdx-to-markdown')
  })

  it('each tool has 3 related tools', () => {
    for (const tool of tools) {
      const related = tools.filter((t) => t.slug !== tool.slug)
      expect(related).toHaveLength(3)
    }
  })
})

describe('ConversionCta', async () => {
  // Dynamic import to avoid issues with 'use client' directive in test
  const { ConversionCta } = await import(
    '../../components/seo/ConversionCta'
  )

  it('renders CTA text and description', () => {
    render(
      <ConversionCta
        text="Deploy formatted MDX as live docs"
        description="Jamdesk formats your MDX automatically when you deploy."
      />
    )
    expect(
      screen.getByText('Deploy formatted MDX as live docs')
    ).toBeDefined()
    expect(
      screen.getByText(/Jamdesk formats your MDX automatically/)
    ).toBeDefined()
  })

  it('links to pricing page', () => {
    render(
      <ConversionCta
        text="Test CTA"
        description="Test description"
      />
    )
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe(
      'https://www.jamdesk.com/pricing'
    )
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })
})

describe('JsonLdScript', async () => {
  const { JsonLdScript } = await import('../../components/seo/JsonLdScript')

  it('renders breadcrumb JSON-LD script for tool pages', () => {
    const tool = tools[0]
    render(
      <JsonLdScript
        type="tool"
        tools={tools}
        tool={tool}
        howTo={{ title: 'Test', content: 'Test content' }}
      />
    )
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    const schemas = Array.from(scripts).map((s) => JSON.parse(s.textContent!))
    const breadcrumb = schemas.find((s) => s['@type'] === 'BreadcrumbList')
    expect(breadcrumb).toBeDefined()
    expect(breadcrumb.itemListElement).toHaveLength(3)
    expect(breadcrumb.itemListElement[0].item).toBe('https://www.jamdesk.com')
    expect(breadcrumb.itemListElement[1].item).toBe(
      'https://www.jamdesk.com/utilities'
    )
  })
})

describe('FaqSection', async () => {
  const { FaqSection } = await import('../../components/seo/FaqSection')

  it('renders all FAQ items as details elements', () => {
    const items = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
      { question: 'Q3', answer: 'A3' },
    ]
    render(<FaqSection items={items} />)
    const details = document.querySelectorAll('details')
    expect(details).toHaveLength(3)
  })

  it('renders questions in summaries', () => {
    const items = [{ question: 'Test question?', answer: 'Test answer.' }]
    render(<FaqSection items={items} />)
    expect(screen.getByText('Test question?')).toBeDefined()
    expect(screen.getByText('Test answer.')).toBeDefined()
  })
})
