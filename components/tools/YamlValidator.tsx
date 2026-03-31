'use client'

import { useState, useCallback, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { copyToClipboard } from '@/lib/clipboard'
import { downloadAsFile } from '@/lib/download'
import { trackEvent } from '@/lib/analytics'
import { yamlValidatorSample } from '@/lib/samples'
import type { YamlValidationResult } from '@/lib/yaml-engine'

const importEngine = () => import('@/lib/yaml-engine')

export function YamlValidator() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(
    yamlValidatorSample,
    'YAML Validator'
  )
  const [result, setResult] = useState<YamlValidationResult | null>(null)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setResult({ valid: true, errors: [], parsed: '' })
      return
    }
    getEngine().then((engine) => {
      const validationResult = engine.validateYaml(input)
      if (!cancelled) setResult(validationResult)
    })
    return () => {
      cancelled = true
    }
  }, [input, getEngine])

  const formatOutput = useCallback(() => {
    if (!result) return ''
    if (result.valid) return result.parsed
    return result.errors
      .map((e) => `${e.line}:${e.column} [${e.severity}] ${e.message}`)
      .join('\n')
  }, [result])

  const handleCopy = useCallback(async () => {
    const text = formatOutput()
    if (!text) return
    await copyToClipboard(text)
    trackEvent('Copy', { tool: 'YAML Validator' })
  }, [formatOutput])

  const handleDownload = useCallback(() => {
    const text = formatOutput()
    if (!text) return
    downloadAsFile(
      text,
      result?.valid ? 'parsed.json' : 'validation-errors.txt'
    )
    trackEvent('Download', { tool: 'YAML Validator' })
  }, [formatOutput, result])

  return (
    <ToolLayout
      toolName="YAML Validator"
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="YAML input editor"
          acceptExtensions={['.yaml', '.yml']}
        />
      }
      outputPanel={
        <YamlOutput
          result={result}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      }
    />
  )
}

function YamlOutput({
  result,
  onCopy,
  onDownload,
}: {
  result: YamlValidationResult | null
  onCopy: () => void
  onDownload: () => void
}) {
  if (!result) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {/* eslint-disable-next-line react/jsx-no-literals */}
        Validating{'\u2026'}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col" aria-live="polite">
      <div className="flex h-9 items-center justify-between bg-[#0f0d17] px-2 sm:h-11 sm:px-3">
        <span className="text-xs font-medium text-[#e0e0e4] sm:text-sm">
          {result.valid
            ? 'Parsed JSON'
            : `${result.errors.length} ${result.errors.length === 1 ? 'Issue' : 'Issues'}`}
        </span>
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            onClick={onCopy}
            className="min-h-[44px] items-center rounded-md px-1.5 py-1 text-xs text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] sm:px-2.5 sm:py-1.5 sm:text-sm"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="min-h-[44px] items-center rounded-md px-1.5 py-1 text-xs text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] sm:px-2.5 sm:py-1.5 sm:text-sm"
          >
            Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {result.valid ? (
          result.parsed ? (
            <pre className="whitespace-pre-wrap text-sm text-[#c0bdd0]">
              <code>{result.parsed}</code>
            </pre>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <span
                className="text-3xl text-success"
                aria-hidden="true"
              >
                &#10003;
              </span>
              <span className="text-sm font-medium text-success">
                Valid YAML
              </span>
            </div>
          )
        ) : (
          <ul
            className="space-y-2"
            role="list"
            aria-label="Validation errors"
          >
            {result.errors.map((error, i) => (
              <li
                key={i}
                className="rounded-md border border-border bg-secondary p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded bg-destructive/20 px-1.5 py-0.5 text-xs font-medium text-destructive">
                    {error.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-muted-foreground">
                      {error.line}:{error.column}
                    </span>
                    <p className="mt-0.5 break-words text-sm text-foreground">
                      {error.message}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
