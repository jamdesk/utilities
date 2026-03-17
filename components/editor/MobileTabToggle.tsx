'use client'

type Tab = 'input' | 'output'

interface MobileTabToggleProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function MobileTabToggle({ activeTab, onTabChange }: MobileTabToggleProps) {
  return (
    <div className="block sm:hidden" role="tablist" aria-label="Editor panels">
      <div className="flex border-b border-border">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'input'}
          aria-controls="input-panel"
          id="input-tab"
          onClick={() => onTabChange('input')}
          className={`min-h-[44px] flex-1 px-3 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:px-4 sm:py-2.5 sm:text-sm ${
            activeTab === 'input'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Input
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'output'}
          aria-controls="output-panel"
          id="output-tab"
          onClick={() => onTabChange('output')}
          className={`min-h-[44px] flex-1 px-3 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:px-4 sm:py-2.5 sm:text-sm ${
            activeTab === 'output'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Output
        </button>
      </div>
    </div>
  )
}
