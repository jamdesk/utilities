import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
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

import { MermaidEditor, MermaidPreview } from '@/components/tools/MermaidEditor'

describe('MermaidEditor', () => {
  it('renders the editor and a preview panel with the diagram for the default sample', async () => {
    render(<MermaidEditor />)
    expect(screen.getByText('Preview')).toBeTruthy()
    await waitFor(() => {
      expect(document.querySelector('[data-testid="diagram"]')).toBeTruthy()
    })
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

  it('renders empty preview without error when there is nothing to show', () => {
    render(<MermaidPreview svg={null} error={null} />)
    expect(screen.getByText('Preview')).toBeTruthy()
    expect(screen.queryByText('Diagram Error')).toBeNull()
  })
})
