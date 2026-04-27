import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { tools } from '../../lib/tools'
import { REPO_URL } from '../../lib/site'
import Home from '../../app/page'

afterEach(() => {
  cleanup()
})

describe('hub page', () => {
  it('has tools in registry', () => {
    expect(tools.length).toBeGreaterThanOrEqual(4)
  })

  it('all tools have valid links', () => {
    for (const tool of tools) {
      expect(`/utilities/${tool.slug}`).toMatch(/^\/utilities\/[a-z0-9-]+$/)
    }
  })

  it('all tools have display content', () => {
    for (const tool of tools) {
      expect(tool.name).toBeTruthy()
      expect(tool.description).toBeTruthy()
      expect(tool.icon).toBeTruthy()
    }
  })

  it('renders all tool cards with names and descriptions', () => {
    render(<Home />)
    for (const tool of tools) {
      expect(screen.getByText(tool.name)).toBeDefined()
      expect(screen.getByText(tool.description)).toBeDefined()
    }
  })

  it('renders tool cards as links to /[slug]', () => {
    render(<Home />)
    const links = screen.getAllByRole('link')
    const toolLinks = links.filter((link) =>
      tools.some((t) => link.getAttribute('href') === `/${t.slug}`)
    )
    expect(toolLinks).toHaveLength(tools.length)
  })

  it('renders the hero heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /utilities/i,
    })
    expect(heading).toBeDefined()
  })

  it('renders FAQ section with details elements', () => {
    render(<Home />)
    const detailsElements = document.querySelectorAll('details')
    expect(detailsElements.length).toBeGreaterThanOrEqual(5)
  })

  it('renders JSON-LD script', () => {
    render(<Home />)
    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const json = JSON.parse(script!.textContent!)
    expect(json['@type']).toBe('CollectionPage')
    expect(json.hasPart).toHaveLength(tools.length)
  })

  it('renders SEO content sections', () => {
    render(<Home />)
    // "What is MDX?" appears both as h2 and FAQ question
    expect(screen.getAllByText('What is MDX?').length).toBeGreaterThanOrEqual(1)
    expect(
      screen.getByText('Why use MDX for documentation?')
    ).toBeDefined()
    expect(
      screen.getByText('Frequently Asked Questions')
    ).toBeDefined()
  })

  it('renders the badge', () => {
    render(<Home />)
    expect(screen.getByText(/Client-side/)).toBeDefined()
  })

  it('links Open source to the canonical repo URL', () => {
    render(<Home />)
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === REPO_URL)
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })
})
