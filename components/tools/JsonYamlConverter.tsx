'use client'

import { useState, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { jsonYamlSample } from '@/lib/samples'

const importEngine = () => import('@/lib/json-yaml-engine')

export function JsonYamlConverter() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(jsonYamlSample, 'JSON YAML Converter')
  const [output, setOutput] = useState('')
  const [yamlToJsonMode, setYamlToJsonMode] = useState(false)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setOutput('')
      return
    }
    getEngine().then((engine) => {
      const result = yamlToJsonMode
        ? engine.yamlToJson(input)
        : engine.jsonToYaml(input)
      if (!cancelled) {
        setOutput(result.error ? `Error: ${result.error}` : result.output)
      }
    })
    return () => { cancelled = true }
  }, [input, yamlToJsonMode, getEngine])

  return (
    <ToolLayout
      toolName="JSON ↔ YAML"
      toolbar={
        <EditorToolbar
          options={[
            {
              label: 'YAML → JSON',
              value: yamlToJsonMode,
              onChange: setYamlToJsonMode,
            },
          ]}
        />
      }
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel={yamlToJsonMode ? 'YAML input editor' : 'JSON input editor'}
          acceptExtensions={['.json', '.yaml', '.yml']}
        />
      }
      outputPanel={
        <OutputPanel
          value={output}
          toolName="JSON YAML Converter"
          downloadExtension={yamlToJsonMode ? '.json' : '.yaml'}
          ariaLabel={yamlToJsonMode ? 'JSON output' : 'YAML output'}
        />
      }
    />
  )
}
