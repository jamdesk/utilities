'use client'

import { useState, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { htmlToMdxSample } from '@/lib/samples'

const importEngine = () => import('@/lib/html-to-mdx-engine')

export function HtmlToMdx() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(
    htmlToMdxSample,
    'HTML to MDX'
  )
  const [output, setOutput] = useState('')
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setOutput('')
      return
    }
    getEngine()
      .then((engine) => engine.convertHtmlToMdx(input))
      .then((result) => {
        if (!cancelled) setOutput(result)
      })
      .catch((err) => {
        if (!cancelled) {
          setOutput(
            `Error: ${err instanceof Error ? err.message : 'Failed to convert HTML to MDX'}`
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [input, getEngine])

  return (
    <ToolLayout
      toolName="HTML to MDX"
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="HTML input editor"
          acceptExtensions={['.html', '.htm']}
        />
      }
      outputPanel={
        <OutputPanel
          value={output}
          toolName="HTML to MDX"
          downloadExtension=".mdx"
          ariaLabel="MDX output"
        />
      }
    />
  )
}
