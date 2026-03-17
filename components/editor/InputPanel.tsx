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
    if (!url.trim()) return
    setUrlLoading(true)
    setUrlError('')

    try {
      const res = await fetch(url.trim())
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      onChange(text)
      setShowUrlInput(false)
      setUrl('')
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : 'Failed to fetch URL')
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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8e4df] px-3 py-2">
        <span className="text-sm font-medium text-[#1b3139]">Input</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139]"
          >
            Upload
          </button>
          {onLoadSample && (
            <button
              type="button"
              onClick={onLoadSample}
              className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139]"
            >
              Load Sample
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="min-h-[44px] rounded-md px-2.5 py-1.5 text-sm text-[#5a6f77] transition-colors hover:bg-[#f3f0eb] hover:text-[#1b3139]"
            aria-expanded={showUrlInput}
          >
            Open from URL
          </button>
        </div>
      </div>

      {/* URL input bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 border-b border-[#e8e4df] bg-[#f3f0eb] px-3 py-2">
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
            placeholder="https://raw.githubusercontent.com/..."
            className="min-h-[44px] flex-1 rounded-md border border-[#e8e4df] bg-white px-3 py-2 text-base text-[#1b3139] placeholder:text-[#8fa8b3] focus:outline-none focus:ring-2 focus:ring-[#ff3621]"
            aria-label="URL to fetch MDX content from"
          />
          <button
            type="button"
            onClick={handleLoadFromUrl}
            disabled={urlLoading || !url.trim()}
            className="min-h-[44px] rounded-md bg-[#ff3621] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#eb1600] disabled:opacity-50"
          >
            {urlLoading ? 'Loading...' : 'Fetch'}
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
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-[#ff3621] bg-[#ff3621]/10">
            <span className="text-sm font-medium text-[#ff3621]">
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
