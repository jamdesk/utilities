'use client'

import { useState, useCallback } from 'react'
import { CodeEditor } from './CodeEditor'
import { copyToClipboard } from '@/lib/clipboard'
import { downloadAsFile } from '@/lib/download'
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
    const ok = await copyToClipboard(value)
    if (ok) {
      setCopied(true)
      trackEvent('Copy', { tool: toolName })
      setTimeout(() => setCopied(false), 2000)
    }
  }, [value, toolName])

  const handleDownload = useCallback(() => {
    downloadAsFile(value, `output${downloadExtension}`)
    trackEvent('Download', { tool: toolName })
  }, [value, toolName, downloadExtension])

  return (
    <div className="flex h-full flex-col" aria-live="polite">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8e4df] px-3 py-2">
        <span className="text-sm font-medium text-[#1b3139]">Output</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139] disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!value}
            className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139] disabled:opacity-50"
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
