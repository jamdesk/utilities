import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// The real engine renders SVG via browser APIs jsdom lacks — mock it so the
// test exercises the component contract (input -> engine -> preview/error).
vi.mock('@/lib/mermaid-engine', () => ({
  validateMermaid: vi.fn(async () => ({ valid: true })),
  renderMermaid: vi.fn(async () => '<svg data-testid="diagram"></svg>'),
}))

// CodeMirror's measure cycle logs errors under jsdom (no getClientRects) —
// stub the input panel; this test targets the preview contract, not editing.
vi.mock('@/components/editor/InputPanel', () => ({
  InputPanel: () => <div data-testid="input-panel" />,
}))

// Export actions delegate to the shared clipboard/download/analytics helpers —
// mock them so the test asserts the wiring, not browser file/clipboard APIs.
vi.mock('@/lib/clipboard', () => ({ copyToClipboard: vi.fn(async () => true) }))
vi.mock('@/lib/download', () => ({ downloadAsFile: vi.fn() }))
vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }))

import { MermaidEditor, MermaidPreview } from '@/components/tools/MermaidEditor'
import { renderMermaid } from '@/lib/mermaid-engine'
import { copyToClipboard } from '@/lib/clipboard'
import { downloadAsFile } from '@/lib/download'

beforeEach(() => {
  vi.mocked(renderMermaid).mockClear()
  localStorage.clear()
})

describe('MermaidEditor', () => {
  it('renders the preview header and the engine-rendered diagram for the default sample', async () => {
    render(<MermaidEditor />)
    expect(screen.getByText('Preview')).toBeTruthy()
    await waitFor(() => {
      expect(document.querySelector('[data-testid="diagram"]')).toBeTruthy()
    })
  })

  it('toggles the preview theme and re-renders the diagram in the new theme', async () => {
    render(<MermaidEditor />)
    // Defaults to dark: the toggle offers a switch to light, and the first
    // render passes the dark theme to the engine.
    const toggle = await screen.findByRole('button', { name: /switch preview to light mode/i })
    await waitFor(() => expect(renderMermaid).toHaveBeenCalledWith(expect.any(String), 'dark'))

    fireEvent.click(toggle)

    // The toggle flips, and the diagram re-renders in light.
    expect(screen.getByRole('button', { name: /switch preview to dark mode/i })).toBeTruthy()
    await waitFor(() => expect(renderMermaid).toHaveBeenCalledWith(expect.any(String), 'light'))
  })

  it('restores the saved preview theme on mount', async () => {
    localStorage.setItem('jd-mermaid-preview-theme', 'light')
    render(<MermaidEditor />)
    // Restored from storage → the toggle offers a switch back to dark.
    expect(await screen.findByRole('button', { name: /switch preview to dark mode/i })).toBeTruthy()
    await waitFor(() => expect(renderMermaid).toHaveBeenCalledWith(expect.any(String), 'light'))
  })
})

describe('MermaidPreview', () => {
  it('shows the parser error while retaining the last good diagram', () => {
    render(
      <MermaidPreview svg='<svg data-testid="diagram"></svg>' error="Syntax error at line 2" />
    )
    expect(screen.getByText('Diagram Error')).toBeTruthy()
    expect(screen.getByText('Syntax error at line 2')).toBeTruthy()
    // error and last-good diagram coexist — typing through a mistake must not
    // blank the preview
    expect(document.querySelector('[data-testid="diagram"]')).toBeTruthy()
  })

  it('renders the empty-state hint without error when there is nothing to show', () => {
    render(<MermaidPreview svg={null} error={null} />)
    expect(screen.getByText('Preview')).toBeTruthy()
    expect(screen.getByText('Enter Mermaid syntax to preview')).toBeTruthy()
    expect(screen.queryByText('Diagram Error')).toBeNull()
  })

  it('offers Copy SVG and Download SVG actions once a diagram exists', () => {
    render(<MermaidPreview svg='<svg data-testid="diagram"></svg>' error={null} />)
    expect(screen.getByRole('button', { name: /copy svg/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /download svg/i })).toBeTruthy()
  })

  it('hides the export actions when there is no diagram to export', () => {
    render(<MermaidPreview svg={null} error={null} />)
    expect(screen.queryByRole('button', { name: /copy svg/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /download svg/i })).toBeNull()
  })

  it('keeps export available on error while a last-good diagram is retained', () => {
    render(
      <MermaidPreview svg='<svg data-testid="diagram"></svg>' error="Syntax error at line 2" />
    )
    expect(screen.getByRole('button', { name: /copy svg/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /download svg/i })).toBeTruthy()
  })

  it('copies the SVG markup to the clipboard and confirms with a Copied! state', async () => {
    render(<MermaidPreview svg='<svg id="x"></svg>' error={null} />)
    fireEvent.click(screen.getByRole('button', { name: /copy svg/i }))
    await waitFor(() => expect(copyToClipboard).toHaveBeenCalledWith('<svg id="x"></svg>'))
    expect(await screen.findByText('Copied!')).toBeTruthy()
  })

  it('downloads the SVG as an image/svg+xml file named diagram.svg', () => {
    render(<MermaidPreview svg='<svg id="y"></svg>' error={null} />)
    fireEvent.click(screen.getByRole('button', { name: /download svg/i }))
    expect(downloadAsFile).toHaveBeenCalledWith(
      '<svg id="y"></svg>',
      'diagram.svg',
      'image/svg+xml;charset=utf-8'
    )
  })
})
