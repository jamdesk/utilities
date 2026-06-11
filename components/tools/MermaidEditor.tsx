'use client'

import { useState, useEffect, useRef } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { mermaidSample } from '@/lib/samples'

const importEngine = () => import('@/lib/mermaid-engine')

export function MermaidEditor() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(mermaidSample, 'Mermaid Editor')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setSvg(null)
      setError(null)
      return
    }
    // Debounce: a mermaid render is a full parse+layout cycle — don't run it
    // on every keystroke. (useToolInput's debounce covers only the URL hash.)
    const timer = setTimeout(() => {
      getEngine()
        .then(async (engine) => {
          // Validate first: mermaid.parse gives the clean parser message (the
          // tool's advertised error behavior); renderMermaid's throw can be a
          // render-stage error.
          const validation = await engine.validateMermaid(input)
          if (!validation.valid) throw new Error(validation.error)
          return engine.renderMermaid(input)
        })
        .then((rendered) => {
          if (!cancelled) {
            setSvg(rendered)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to render diagram')
            // keep last good svg visible while the user types through an error
          }
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [input, getEngine])

  return (
    <ToolLayout
      toolName="Mermaid Editor"
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="Mermaid diagram input editor"
        />
      }
      outputPanel={<MermaidPreview svg={svg} error={error} />}
    />
  )
}

// Exported for direct testing of the error/retention contract.
export function MermaidPreview({ svg, error }: { svg: string | null; error: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Inject via ref: the svg prop is ALWAYS DOMPurify-sanitized by
  // renderMermaid (input can arrive from the URL hash — attacker-
  // influenceable). Never assign unsanitized markup here.
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svg ?? ''
    }
  }, [svg])

  return (
    <div className="flex h-full flex-col" aria-live="polite">
      <div className="flex h-9 items-center justify-between bg-[#0f0d17] px-2 sm:h-11 sm:px-3">
        <span className="text-xs font-medium text-[#e0e0e4] sm:text-sm">Preview</span>
      </div>
      <div className="flex-1 overflow-auto bg-[#1a1725] p-4">
        {error && (
          <div className="mb-3 rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <span className="text-sm font-medium text-destructive">Diagram Error</span>
            <p className="mt-1 whitespace-pre-wrap text-sm text-[#6b6b78]">{error}</p>
          </div>
        )}
        {!svg && !error ? (
          <div className="flex h-full items-center justify-center text-sm text-[#6b6b78]">
            Enter Mermaid syntax to preview
          </div>
        ) : (
          <div ref={containerRef} className="flex justify-center [&_svg]:max-w-full" />
        )}
      </div>
    </div>
  )
}
