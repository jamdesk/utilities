'use client'

import { useState, useCallback } from 'react'
import { CodeEditor } from './CodeEditor'
import { trackEvent } from '@/lib/analytics'

interface OutputPanelProps {
  value: string
  toolName: string
  downloadExtension?: string
  ariaLabel?: string
}

export function OutputPanel({
  value,
  toolName,
  downloadExtension = '.mdx',
  ariaLabel = 'MDX output editor',
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      trackEvent('Copy', { tool: toolName })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select-all approach won't work in readOnly CodeMirror,
      // but clipboard API is broadly supported in modern browsers
    }
  }, [value, toolName])

  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `output${downloadExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    trackEvent('Download', { tool: toolName })
  }, [value, toolName, downloadExtension])

  return (
    <div className="flex h-full flex-col" aria-live="polite">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium text-foreground">Output</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!value}
            className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </div>

      {/* Editor area (read-only) */}
      <div className="flex-1">
        <CodeEditor
          value={value}
          readOnly
          aria-label={ariaLabel}
        />
      </div>
    </div>
  )
}
