'use client'
import { useState, type ReactNode } from 'react'
import { MobileTabToggle } from '@/components/editor/MobileTabToggle'
import { EngineErrorBoundary } from '@/components/editor/EngineErrorBoundary'

interface ToolLayoutProps {
  toolName: string
  toolbar?: ReactNode
  inputPanel: ReactNode
  outputPanel: ReactNode
}

export function ToolLayout({ toolName, toolbar, inputPanel, outputPanel }: ToolLayoutProps) {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input')

  return (
    <EngineErrorBoundary toolName={toolName}>
      {toolbar}
      <MobileTabToggle activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="grid min-h-[400px] flex-1 grid-cols-1 sm:grid-cols-2">
        <div
          id="input-panel"
          role="tabpanel"
          aria-labelledby="input-tab"
          className={`border-r border-[#e8e4df] ${activeTab === 'output' ? 'hidden sm:flex' : 'flex'} flex-col`}
        >
          {inputPanel}
        </div>
        <div
          id="output-panel"
          role="tabpanel"
          aria-labelledby="output-tab"
          className={`${activeTab === 'input' ? 'hidden sm:flex' : 'flex'} flex-col`}
        >
          {outputPanel}
        </div>
      </div>
    </EngineErrorBoundary>
  )
}
