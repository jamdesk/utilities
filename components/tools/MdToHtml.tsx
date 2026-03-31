'use client'

import { useState, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { mdToHtmlSample } from '@/lib/samples'

const importEngine = () => import('@/lib/md-to-html-engine')

export function MdToHtml() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(
    mdToHtmlSample,
    'Markdown to HTML'
  )
  const [output, setOutput] = useState('')
  const [stripFrontmatter, setStripFrontmatter] = useState(false)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setOutput('')
      return
    }
    getEngine()
      .then((engine) => engine.convertMdToHtml(input, { stripFrontmatter }))
      .then((result) => {
        if (!cancelled) setOutput(result)
      })
      .catch((err) => {
        if (!cancelled) {
          setOutput(
            `Error: ${err instanceof Error ? err.message : 'Failed to convert Markdown to HTML'}`
          )
        }
      })
    return () => {
      cancelled = true
    }
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
      toolName="Markdown to HTML"
      toolbar={<EditorToolbar options={toolbarOptions} />}
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="Markdown input editor"
          acceptExtensions={['.md', '.mdx']}
        />
      }
      outputPanel={
        <OutputPanel
          value={output}
          toolName="Markdown to HTML"
          downloadExtension=".html"
          ariaLabel="HTML output"
        />
      }
    />
  )
}
