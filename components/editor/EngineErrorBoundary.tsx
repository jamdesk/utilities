'use client'

import React from 'react'

interface EngineErrorBoundaryProps {
  toolName: string
  onRetry?: () => void
  children: React.ReactNode
}

interface EngineErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class EngineErrorBoundary extends React.Component<
  EngineErrorBoundaryProps,
  EngineErrorBoundaryState
> {
  constructor(props: EngineErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): EngineErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[${this.props.toolName}] Engine error:`, error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      const isLoadError =
        this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('Failed to fetch') ||
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('load')

      if (isLoadError) {
        // Full-page fallback for engine load failures
        return (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-[#e8e4df] bg-white p-8 text-center">
            <div className="text-lg font-medium text-[#1b3139]">
              Failed to load {this.props.toolName}
            </div>
            <p className="max-w-md text-sm text-[#5a6f77]">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="min-h-[44px] rounded-md bg-[#ff3621] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#eb1600]"
            >
              Retry
            </button>
          </div>
        )
      }

      // Inline error for runtime errors
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="mb-1 text-sm font-medium text-destructive">
            Something went wrong in {this.props.toolName}
          </div>
          <p className="mb-3 text-sm text-[#5a6f77]">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="min-h-[44px] rounded-md border border-[#e8e4df] px-3 py-1.5 text-sm text-[#1b3139] transition-colors hover:bg-[#f3f0eb]"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
