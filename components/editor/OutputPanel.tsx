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
      {/* Header — dark to match editor body */}
      <div className="flex h-9 items-center justify-between bg-[#0f0d17] px-2 sm:h-11 sm:px-3">
        <span className="text-xs font-medium text-[#e0e0e4] sm:text-sm">Output</span>
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="rounded-md px-1.5 py-1 text-xs text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] disabled:opacity-50 sm:px-2.5 sm:py-1.5 sm:text-sm"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!value}
            className="rounded-md px-1.5 py-1 text-xs text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] disabled:opacity-50 sm:px-2.5 sm:py-1.5 sm:text-sm"
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
