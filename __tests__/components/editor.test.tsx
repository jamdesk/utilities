import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// EngineErrorBoundary tests
describe('EngineErrorBoundary', async () => {
  const { EngineErrorBoundary } = await import(
    '../../components/editor/EngineErrorBoundary'
  )

  it('renders children normally when no error', () => {
    render(
      <EngineErrorBoundary toolName="MDX Formatter">
        <div>Editor content</div>
      </EngineErrorBoundary>
    )
    expect(screen.getByText('Editor content')).toBeDefined()
  })

  it('catches errors and shows runtime fallback', () => {
    // Suppress console.error from React and our boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function Thrower(): React.ReactNode {
      throw new Error('Something broke')
    }

    render(
      <EngineErrorBoundary toolName="MDX Formatter">
        <Thrower />
      </EngineErrorBoundary>
    )

    expect(
      screen.getByText('Something went wrong in MDX Formatter')
    ).toBeDefined()
    expect(screen.getByText('Something broke')).toBeDefined()
    expect(screen.getByText('Try again')).toBeDefined()

    consoleSpy.mockRestore()
  })

  it('shows load-failure fallback for chunk errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function Thrower(): React.ReactNode {
      throw new Error('Loading chunk failed')
    }

    render(
      <EngineErrorBoundary toolName="MDX Validator">
        <Thrower />
      </EngineErrorBoundary>
    )

    expect(screen.getByText('Failed to load MDX Validator')).toBeDefined()
    expect(
      screen.getByText('Check your connection and try again.')
    ).toBeDefined()
    expect(screen.getByText('Retry')).toBeDefined()

    consoleSpy.mockRestore()
  })

  it('calls onRetry and resets when retry is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRetry = vi.fn()

    let shouldThrow = true
    function MaybeThrow() {
      if (shouldThrow) {
        throw new Error('test error')
      }
      return <div>Recovered</div>
    }

    render(
      <EngineErrorBoundary toolName="MDX Viewer" onRetry={onRetry}>
        <MaybeThrow />
      </EngineErrorBoundary>
    )

    // Should show error state
    expect(screen.getByText('Try again')).toBeDefined()

    // Stop throwing and click retry
    shouldThrow = false
    fireEvent.click(screen.getByText('Try again'))

    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Recovered')).toBeDefined()

    consoleSpy.mockRestore()
  })
})

// MobileTabToggle tests
describe('MobileTabToggle', async () => {
  const { MobileTabToggle } = await import(
    '../../components/editor/MobileTabToggle'
  )

  it('renders both tabs', () => {
    render(<MobileTabToggle activeTab="input" onTabChange={() => {}} />)
    expect(screen.getByRole('tab', { name: 'Input' })).toBeDefined()
    expect(screen.getByRole('tab', { name: 'Output' })).toBeDefined()
  })

  it('marks active tab as selected', () => {
    render(<MobileTabToggle activeTab="output" onTabChange={() => {}} />)
    const outputTab = screen.getByRole('tab', { name: 'Output' })
    const inputTab = screen.getByRole('tab', { name: 'Input' })
    expect(outputTab.getAttribute('aria-selected')).toBe('true')
    expect(inputTab.getAttribute('aria-selected')).toBe('false')
  })

  it('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn()
    render(<MobileTabToggle activeTab="input" onTabChange={onTabChange} />)

    fireEvent.click(screen.getByRole('tab', { name: 'Output' }))
    expect(onTabChange).toHaveBeenCalledWith('output')

    fireEvent.click(screen.getByRole('tab', { name: 'Input' }))
    expect(onTabChange).toHaveBeenCalledWith('input')
  })

  it('has tablist role on container', () => {
    render(<MobileTabToggle activeTab="input" onTabChange={() => {}} />)
    expect(screen.getByRole('tablist')).toBeDefined()
  })
})

// EditorToolbar tests
describe('EditorToolbar', async () => {
  const { EditorToolbar } = await import(
    '../../components/editor/EditorToolbar'
  )

  it('renders valid status indicator', () => {
    render(<EditorToolbar status={{ valid: true }} />)
    expect(screen.getByText('Valid MDX')).toBeDefined()
  })

  it('renders error count in status', () => {
    render(<EditorToolbar status={{ valid: false, errorCount: 3 }} />)
    expect(screen.getByText('3 errors')).toBeDefined()
  })

  it('renders singular error text for 1 error', () => {
    render(<EditorToolbar status={{ valid: false, errorCount: 1 }} />)
    expect(screen.getByText('1 error')).toBeDefined()
  })

  it('renders option chips', () => {
    const options = [
      { label: 'Trim whitespace', value: true, onChange: vi.fn() },
      { label: 'Sort imports', value: false, onChange: vi.fn() },
    ]
    render(<EditorToolbar options={options} />)
    expect(screen.getByText('Trim whitespace')).toBeDefined()
    expect(screen.getByText('Sort imports')).toBeDefined()
  })

  it('option chips have switch role and aria-checked', () => {
    const onChange = vi.fn()
    const options = [
      { label: 'Trim whitespace', value: true, onChange },
      { label: 'Sort imports', value: false, onChange },
    ]
    render(<EditorToolbar options={options} />)

    const switches = screen.getAllByRole('switch')
    expect(switches).toHaveLength(2)
    expect(switches[0].getAttribute('aria-checked')).toBe('true')
    expect(switches[1].getAttribute('aria-checked')).toBe('false')
  })

  it('toggles option chip on click', () => {
    const onChange = vi.fn()
    const options = [
      { label: 'Trim whitespace', value: true, onChange },
    ]
    render(<EditorToolbar options={options} />)

    fireEvent.click(screen.getByText('Trim whitespace'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('renders without options or status', () => {
    const { container } = render(<EditorToolbar />)
    // Should render without crashing
    expect(container.firstChild).toBeDefined()
  })
})
