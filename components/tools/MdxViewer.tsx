'use client'

import { useState, useEffect } from 'react'
import type { Root } from 'mdast'
import { InputPanel } from '@/components/editor/InputPanel'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { MdxRenderer } from './viewer/MdxRenderer'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { viewerSample } from '@/lib/samples'

const importEngine = () => import('@/lib/mdx-engine')

export function MdxViewer() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(viewerSample, 'MDX Viewer')
  const [ast, setAst] = useState<Root | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setAst(null)
      setParseError(null)
      return
    }
    getEngine().then((engine) =>
      engine.parseMdxToAst(input)
    ).then((result) => {
      if (!cancelled) {
        setAst(result)
        setParseError(null)
      }
    }).catch((err) => {
      if (!cancelled) {
        setParseError(err instanceof Error ? err.message : 'Failed to parse MDX')
        setAst(null)
      }
    })
    return () => { cancelled = true }
  }, [input, getEngine])

  return (
    <ToolLayout
      toolName="MDX Viewer"
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="MDX input editor"
        />
      }
      outputPanel={<PreviewPanel ast={ast} parseError={parseError} />}
    />
  )
}

function PreviewPanel({
  ast,
  parseError,
}: {
  ast: Root | null
  parseError: string | null
}) {
  return (
    <div className="flex h-full flex-col" aria-live="polite">
      {/* Header — dark, matches Input panel header height */}
      <div className="flex h-9 items-center justify-between bg-[#0f0d17] px-2 sm:h-11 sm:px-3">
        <span className="text-xs font-medium text-[#e0e0e4] sm:text-sm">Preview</span>
      </div>

      {/* Preview area — dark themed like the editor panels */}
      <div className="flex-1 overflow-y-auto bg-[#1a1725] p-4">
        {parseError ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <span className="text-sm font-medium text-destructive">
              Parse Error
            </span>
            <p className="mt-1 text-sm text-[#6b6b78]">{parseError}</p>
          </div>
        ) : ast ? (
          <MdxRenderer ast={ast} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#6b6b78]">
            Enter MDX to preview
          </div>
        )}
      </div>
    </div>
  )
}
