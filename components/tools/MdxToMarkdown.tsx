'use client'

import { useState, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { mdxToMarkdownSample } from '@/lib/samples'

const importEngine = () => import('@/lib/mdx-engine')

export function MdxToMarkdown() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(mdxToMarkdownSample, 'MDX to Markdown')
  const [output, setOutput] = useState('')
  const [stripFrontmatter, setStripFrontmatter] = useState(false)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setOutput('')
      return
    }
    getEngine().then((engine) =>
      engine.stripMdxToMarkdown(input, { stripFrontmatter })
    ).then((result) => {
      if (!cancelled) setOutput(result)
    }).catch((err) => {
      if (!cancelled) {
        setOutput(
          `Error: ${err instanceof Error ? err.message : 'Failed to convert MDX to Markdown'}`
        )
      }
    })
    return () => { cancelled = true }
  }, [input, stripFrontmatter, getEngine])

  const toolbarOptions = [
    {
      label: 'Strip frontmatter',
      value: stripFrontmatter,
      onChange: setStripFrontmatter,
    },
  ]

  return (
    <ToolLayout
      toolName="MDX to Markdown"
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
          toolName="MDX to Markdown"
          downloadExtension=".md"
          ariaLabel="Converted Markdown output"
        />
      }
    />
  )
}
