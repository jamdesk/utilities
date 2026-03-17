'use client'

import { useRef, useState, useCallback } from 'react'
import { CodeEditor } from './CodeEditor'

interface InputPanelProps {
  value: string
  onChange: (value: string) => void
  onLoadSample?: () => void
  ariaLabel?: string
}

export function InputPanel({ value, onChange, onLoadSample, ariaLabel = 'MDX input editor' }: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlError, setUrlError] = useState('')

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          onChange(text)
        }
      }
      reader.readAsText(file)
    },
    [onChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.mdx') || file.name.endsWith('.md'))) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
      // Reset so the same file can be re-selected
      e.target.value = ''
    },
    [handleFile]
  )

  const handleLoadFromUrl = useCallback(async () => {
    const trimmed = url.trim()
    if (!trimmed) return

    // Only allow https:// URLs to prevent SSRF probing of local/internal networks
    try {
      const parsed = new URL(trimmed)
      if (parsed.protocol !== 'https:') {
        setUrlError('Only HTTPS URLs are supported')
        return
      }
      const host = parsed.hostname.toLowerCase()
      if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host.endsWith('.local')) {
        setUrlError('Cannot fetch from local or internal addresses')
        return
      }
    } catch {
      setUrlError('Invalid URL')
      return
    }

    setUrlLoading(true)
    setUrlError('')

    try {
      const res = await fetch(trimmed)
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const text = await res.text()
      onChange(text)
      setShowUrlInput(false)
      setUrl('')
    } catch {
      setUrlError('Failed to fetch URL')
    } finally {
      setUrlLoading(false)
    }
  }, [url, onChange])

  return (
    <div
      className="flex h-full flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header — dark to match editor body */}
      <div className="flex h-9 items-center justify-between bg-[#0f0d17] px-2 sm:h-11 sm:px-3">
        <span className="text-xs font-medium text-[#e0e0e4] sm:text-sm">Input</span>
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] items-center rounded-md px-1.5 py-1 text-xs text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] sm:px-2.5 sm:py-1.5 sm:text-sm"
          >
            Upload
          </button>
          {onLoadSample && (
            <button
              type="button"
              onClick={onLoadSample}
              className="min-h-[44px] items-center rounded-md px-1.5 py-1 text-xs text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] sm:px-2.5 sm:py-1.5 sm:text-sm"
            >
              Sample
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="hidden rounded-md px-2.5 py-1.5 text-sm text-[#6b6b78] transition-colors hover:bg-[#1a1725] hover:text-[#e0e0e4] sm:block"
            aria-expanded={showUrlInput}
          >
            Open from URL
          </button>
        </div>
      </div>

      {/* URL input bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setUrlError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadFromUrl()
            }}
            placeholder={"https://raw.githubusercontent.com/\u2026"}
            name="mdx-url"
            className="min-h-[44px] flex-1 rounded-md border border-border bg-card px-3 py-2 text-base text-foreground placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="URL to fetch MDX content from"
          />
          <button
            type="button"
            onClick={handleLoadFromUrl}
            disabled={urlLoading || !url.trim()}
            className="min-h-[44px] rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
          >
            {urlLoading ? 'Loading\u2026' : 'Fetch'}
          </button>
          {urlError && (
            <span className="text-sm text-destructive">{urlError}</span>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mdx,.md"
        onChange={handleFileInput}
        className="hidden"
        aria-hidden="true"
      />

      {/* Editor area */}
      <div className="relative flex-1">
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-primary bg-[#ff3621]/10">
            <span className="text-sm font-medium text-primary">
              Drop .mdx or .md file
            </span>
          </div>
        )}
        <CodeEditor
          value={value}
          onChange={onChange}
          aria-label={ariaLabel}
        />
      </div>
    </div>
  )
}
