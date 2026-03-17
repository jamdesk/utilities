'use client'
import { useState, useCallback } from 'react'
import { getContentFromHash, setContentHash } from '@/lib/share'
import { trackEvent } from '@/lib/analytics'

// Debounced hash update (1 second), capped at 50KB to prevent browser issues
const MAX_SHARE_BYTES = 50_000
let hashTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSetHash(content: string) {
  if (hashTimer) clearTimeout(hashTimer)
  if (content.length > MAX_SHARE_BYTES) return // too large for URL hash
  hashTimer = setTimeout(() => setContentHash(content), 1000)
}

export function useToolInput(sample: string, toolName: string) {
  const [input, setInput] = useState(() => getContentFromHash() ?? sample)

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    debouncedSetHash(value)
  }, [])

  const handleLoadSample = useCallback(() => {
    setInput(sample)
    setContentHash(sample)
    trackEvent('Load Sample', { tool: toolName })
  }, [sample, toolName])

  return { input, setInput, handleInputChange, handleLoadSample }
}
