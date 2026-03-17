'use client'

import { useState, useCallback, useEffect } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { copyToClipboard } from '@/lib/clipboard'
import { downloadAsFile } from '@/lib/download'
import { trackEvent } from '@/lib/analytics'
import { validatorSample } from '@/lib/samples'
import type { ValidationError, ValidationResult } from '@/lib/mdx-engine'

const importEngine = () => import('@/lib/mdx-engine')

export function MdxValidator() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(validatorSample, 'MDX Validator')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setResult({ valid: true, errors: [] })
      return
    }
    getEngine().then((engine) =>
      engine.validateMdx(input)
    ).then((validationResult) => {
      if (!cancelled) setResult(validationResult)
    })
    return () => { cancelled = true }
  }, [input, getEngine])

  const formatErrors = useCallback(() => {
    if (!result || result.errors.length === 0) return ''
    return result.errors
      .map((e) => `${e.line}:${e.column} [${e.severity}] ${e.message}`)
      .join('\n')
  }, [result])

  const handleCopyErrors = useCallback(async () => {
    const text = formatErrors()
    if (!text) return
    await copyToClipboard(text)
    trackEvent('Copy', { tool: 'MDX Validator' })
  }, [formatErrors])

  const handleDownloadErrors = useCallback(() => {
    const text = formatErrors()
    if (!text) return
    downloadAsFile(text, 'validation-errors.txt')
    trackEvent('Download', { tool: 'MDX Validator' })
  }, [formatErrors])

  const status = result
    ? { valid: result.valid, errorCount: result.errors.length }
    : undefined

  return (
    <ToolLayout
      toolName="MDX Validator"
      toolbar={<EditorToolbar status={status} />}
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="MDX input editor"
        />
      }
      outputPanel={
        <ValidationOutput
          result={result}
          onCopy={handleCopyErrors}
          onDownload={handleDownloadErrors}
        />
      }
    />
  )
}

function ValidationOutput({
  result,
  onCopy,
  onDownload,
}: {
  result: ValidationResult | null
  onCopy: () => void
  onDownload: () => void
}) {
  if (!result) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#5a6f77]">
        Validating...
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col" aria-live="polite">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8e4df] px-3 py-2">
        <span className="text-sm font-medium text-[#1b3139]">
          {result.valid ? 'Validation Result' : `${result.errors.length} ${result.errors.length === 1 ? 'Issue' : 'Issues'}`}
        </span>
        {result.errors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onCopy}
              className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139]"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139]"
            >
              Download
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {result.valid ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <span className="text-3xl text-[#16a34a]" aria-hidden="true">
              &#10003;
            </span>
            <span className="text-sm font-medium text-[#16a34a]">
              Valid MDX
            </span>
            <span className="text-xs text-[#5a6f77]">
              No syntax errors found
            </span>
          </div>
        ) : (
          <ul className="space-y-2" role="list" aria-label="Validation errors">
            {result.errors.map((error, i) => (
              <ErrorItem key={i} error={error} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ErrorItem({ error }: { error: ValidationError }) {
  return (
    <li className="rounded-md border border-[#e8e4df] bg-[#f3f0eb] p-3">
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
            error.severity === 'error'
              ? 'bg-destructive/20 text-destructive'
              : 'bg-[#f0a050]/20 text-[#b07020]'
          }`}
        >
          {error.severity}
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-xs text-[#5a6f77]">
            {error.line}:{error.column}
          </span>
          <p className="mt-0.5 break-words text-sm text-[#1b3139]">
            {error.message}
          </p>
        </div>
      </div>
    </li>
  )
}
