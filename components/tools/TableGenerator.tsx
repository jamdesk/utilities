'use client'

import { useState, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { tableSample } from '@/lib/samples'

const importEngine = () => import('@/lib/table-engine')

export function TableGenerator() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(tableSample, 'Markdown Table Generator')
  const [output, setOutput] = useState('')
  const [tsvMode, setTsvMode] = useState(false)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setOutput('')
      return
    }
    getEngine().then((engine) => {
      const result = tsvMode
        ? engine.tsvToMarkdownTable(input)
        : engine.csvToMarkdownTable(input)
      if (!cancelled) setOutput(result)
    })
    return () => { cancelled = true }
  }, [input, tsvMode, getEngine])

  return (
    <ToolLayout
      toolName="Markdown Table Generator"
      toolbar={
        <EditorToolbar
          options={[
            {
              label: 'TSV mode',
              value: tsvMode,
              onChange: setTsvMode,
            },
          ]}
        />
      }
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="CSV or TSV input editor"
          acceptExtensions={['.csv', '.tsv', '.txt']}
        />
      }
      outputPanel={
        <OutputPanel
          value={output}
          toolName="Markdown Table Generator"
          downloadExtension=".md"
          ariaLabel="Markdown table output"
        />
      }
    />
  )
}
