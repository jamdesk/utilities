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
    <div className="flex items-center justify-between gap-3 border-b border-[#e8e4df] px-3 py-2">
      {/* Option chips — scrollable on mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto" role="group" aria-label="Editor options">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            role="switch"
            aria-checked={option.value}
            onClick={() => option.onChange(!option.value)}
            className={`min-h-[44px] shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              option.value
                ? 'bg-[#ff3621] text-white'
                : 'bg-[#f3f0eb] text-[#5a6f77] hover:bg-[#eae6e0] hover:text-[#1b3139]'
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
            <span className="flex items-center gap-1.5 text-sm text-[#16a34a]">
              <span aria-hidden="true">&#10003;</span>
              Valid MDX
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-[#f0a050]">
              {status.errorCount ?? 0} {(status.errorCount ?? 0) === 1 ? 'error' : 'errors'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
