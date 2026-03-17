'use client'

interface ToolbarOption {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

interface EditorToolbarProps {
  options?: ToolbarOption[]
  status?: {
    valid: boolean
    errorCount?: number
  }
}

export function EditorToolbar({ options = [], status }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-1.5 sm:px-3 sm:py-2">
      {/* Option chips — scrollable on mobile, smaller text on small screens */}
      <div className="flex items-center gap-1 overflow-x-auto sm:gap-1.5" role="group" aria-label="Editor options">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            role="switch"
            aria-checked={option.value}
            onClick={() => option.onChange(!option.value)}
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm ${
              option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-surface-deep hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Status indicator */}
      {status && (
        <div aria-live="polite" className="shrink-0">
          {status.valid ? (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <span aria-hidden="true">&#10003;</span>
              Valid MDX
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-warning">
              {status.errorCount ?? 0} {(status.errorCount ?? 0) === 1 ? 'error' : 'errors'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
