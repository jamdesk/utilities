'use client'

import { useState, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { formatterSample } from '@/lib/samples'

const importFormatter = () => import('@/lib/mdx-formatter')

export function MdxFormatter() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(formatterSample, 'MDX Formatter')
  const [output, setOutput] = useState('')
  const [tabWidth, setTabWidth] = useState(2)
  const [sortFrontmatter, setSortFrontmatter] = useState(false)
  const [trimTrailingWhitespace, setTrimTrailingWhitespace] = useState(false)
  const [collapseBlankLines, setCollapseBlankLines] = useState(false)
  const [printWidth, setPrintWidth] = useState(80)
  const getEngine = useLazyModule(importFormatter)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setOutput('')
      return
    }
    getEngine().then((engine) =>
      engine.formatMdx(input, {
        tabWidth,
        sortFrontmatter,
        trimTrailingWhitespace,
        collapseBlankLines,
        printWidth,
      })
    ).then((result) => {
      if (!cancelled) setOutput(result.formatted)
    })
    return () => { cancelled = true }
  }, [input, tabWidth, sortFrontmatter, trimTrailingWhitespace, collapseBlankLines, printWidth, getEngine])

  const toolbarOptions = [
    {
      label: '4-space tabs',
      value: tabWidth === 4,
      onChange: (v: boolean) => setTabWidth(v ? 4 : 2),
    },
    {
      label: 'Sort frontmatter',
      value: sortFrontmatter,
      onChange: setSortFrontmatter,
    },
    {
      label: 'Trim trailing whitespace',
      value: trimTrailingWhitespace,
      onChange: setTrimTrailingWhitespace,
    },
    {
      label: 'Collapse blank lines',
      value: collapseBlankLines,
      onChange: setCollapseBlankLines,
    },
    {
      label: 'Wide (120)',
      value: printWidth === 120,
      onChange: (v: boolean) => setPrintWidth(v ? 120 : 80),
    },
  ]

  return (
    <ToolLayout
      toolName="MDX Formatter"
      toolbar={<EditorToolbar options={toolbarOptions} />}
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="MDX input editor"
        />
      }
      outputPanel={
        <OutputPanel
          value={output}
          toolName="MDX Formatter"
          ariaLabel="Formatted MDX output"
        />
      }
    />
  )
}
