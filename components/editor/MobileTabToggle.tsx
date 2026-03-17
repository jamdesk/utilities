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
          className={`min-h-[44px] flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'input'
              ? 'border-b-2 border-accent-purple text-foreground'
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
          className={`min-h-[44px] flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'output'
              ? 'border-b-2 border-accent-purple text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Output
        </button>
      </div>
    </div>
  )
}
