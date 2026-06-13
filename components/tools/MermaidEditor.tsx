'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { InputPanel } from '@/components/editor/InputPanel'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToolInput } from '@/lib/use-tool-input'
import { useLazyModule } from '@/lib/use-lazy-module'
import { copyToClipboard } from '@/lib/clipboard'
import { downloadAsFile } from '@/lib/download'
import { trackEvent } from '@/lib/analytics'
import { mermaidSample } from '@/lib/samples'
import type { PreviewTheme } from '@/lib/mermaid-engine'

const importEngine = () => import('@/lib/mermaid-engine')
const THEME_STORAGE_KEY = 'jd-mermaid-preview-theme'

export function MermaidEditor() {
  const { input, handleInputChange, handleLoadSample } = useToolInput(mermaidSample, 'Mermaid Editor')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Default 'dark' matches the server-rendered markup (no hydration mismatch);
  // the saved preference is restored client-side below.
  const [theme, setTheme] = useState<PreviewTheme>('dark')
  const getEngine = useLazyModule(importEngine)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') setTheme(saved)
    } catch {
      // localStorage can throw (private mode / blocked storage) — keep default.
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: PreviewTheme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // ignore persistence failure — the toggle still works for the session.
      }
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    if (!input.trim()) {
      setSvg(null)
      setError(null)
      return
    }
    // Debounce: a mermaid render is a full parse+layout cycle — don't run it
    // on every keystroke. (useToolInput's debounce covers only the URL hash.)
    // theme is a dependency so toggling re-renders the diagram in the new theme.
    const timer = setTimeout(() => {
      getEngine()
        .then(async (engine) => {
          // Validate first: mermaid.parse gives the clean parser message (the
          // tool's advertised error behavior); renderMermaid's throw can be a
          // render-stage error.
          const validation = await engine.validateMermaid(input)
          if (!validation.valid) throw new Error(validation.error)
          return engine.renderMermaid(input, theme)
        })
        .then((rendered) => {
          if (!cancelled) {
            setSvg(rendered)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to render diagram')
            // keep last good svg visible while the user types through an error
          }
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [input, theme, getEngine])

  return (
    <ToolLayout
      toolName="Mermaid Editor"
      inputPanel={
        <InputPanel
          value={input}
          onChange={handleInputChange}
          onLoadSample={handleLoadSample}
          ariaLabel="Mermaid diagram input editor"
        />
      }
      outputPanel={<MermaidPreview svg={svg} error={error} theme={theme} onToggleTheme={toggleTheme} />}
    />
  )
}

// Exported for direct testing of the error/retention contract.
export function MermaidPreview({
  svg,
  error,
  theme = 'dark',
  onToggleTheme,
}: {
  svg: string | null
  error: string | null
  theme?: PreviewTheme
  onToggleTheme?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isLight = theme === 'light'
  const [copied, setCopied] = useState(false)

  // Inject via ref: the svg prop is ALWAYS DOMPurify-sanitized by
  // renderMermaid (input can arrive from the URL hash — attacker-
  // influenceable). Never assign unsanitized markup here.
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svg ?? ''
    }
  }, [svg])

  // Export the rendered SVG as-is (vector, lossless). PNG is intentionally not
  // offered here: mermaid v11 renders labels inside <foreignObject>, which
  // browsers refuse to rasterize when drawing an SVG to <canvas> — the labels
  // would come out blank. PNG would need a server-side headless-Chrome render.
  const handleCopy = useCallback(async () => {
    if (!svg) return
    if (await copyToClipboard(svg)) {
      setCopied(true)
      trackEvent('Copy', { tool: 'Mermaid Editor', format: 'svg' })
      setTimeout(() => setCopied(false), 2000)
    }
  }, [svg])

  const handleDownload = useCallback(() => {
    if (!svg) return
    downloadAsFile(svg, 'diagram.svg', 'image/svg+xml;charset=utf-8')
    trackEvent('Download', { tool: 'Mermaid Editor', format: 'svg' })
  }, [svg])

  // Mirror the theme toggle's compact, theme-aware styling so the export
  // actions sit consistently beside it in the preview header.
  const headerBtnClass = `flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
    isLight
      ? 'text-[#3a3a44] hover:bg-black/5'
      : 'text-[#a0a0aa] hover:bg-white/10 hover:text-[#e0e0e4]'
  }`

  return (
    <div className="flex h-full flex-col" aria-live="polite">
      <div
        className={`flex h-9 items-center justify-between px-2 sm:h-11 sm:px-3 ${
          isLight ? 'bg-[#e9e8ef]' : 'bg-[#0f0d17]'
        }`}
      >
        <span className={`text-xs font-medium sm:text-sm ${isLight ? 'text-[#3a3a44]' : 'text-[#e0e0e4]'}`}>
          Preview
        </span>
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          {svg && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy SVG"
                title="Copy SVG markup to clipboard"
                className={headerBtnClass}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy SVG'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                aria-label="Download SVG"
                title="Download diagram as an SVG file"
                className={headerBtnClass}
              >
                <DownloadIcon />
                <span className="hidden sm:inline">Download SVG</span>
              </button>
            </>
          )}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isLight ? 'Switch preview to dark mode' : 'Switch preview to light mode'}
              title={isLight ? 'Switch to dark preview' : 'Switch to light preview'}
              className={headerBtnClass}
            >
              {isLight ? <MoonIcon /> : <SunIcon />}
              <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>
          )}
        </div>
      </div>
      <div className={`flex-1 overflow-auto p-4 ${isLight ? 'bg-white' : 'bg-[#1a1725]'}`}>
        {error && (
          <div className="mb-3 rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <span className="text-sm font-medium text-destructive">Diagram Error</span>
            <p className={`mt-1 whitespace-pre-wrap text-sm ${isLight ? 'text-[#6a6a76]' : 'text-[#6b6b78]'}`}>
              {error}
            </p>
          </div>
        )}
        {!svg && !error ? (
          <div
            className={`flex h-full items-center justify-center text-sm ${
              isLight ? 'text-[#8a8a94]' : 'text-[#6b6b78]'
            }`}
          >
            Enter Mermaid syntax to preview
          </div>
        ) : (
          <div ref={containerRef} className="flex justify-center [&_svg]:max-w-full" />
        )}
      </div>
    </div>
  )
}

// Inline icons keep the toggle dependency-free. currentColor inherits the
// button's text color so they adapt to each theme automatically.
function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
