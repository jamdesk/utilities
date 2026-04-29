'use client'

import { useEffect, useState } from 'react'

/**
 * Single hydration root for all copy buttons on the cheatsheet.
 * Reads the target snippet from the button's adjacent <pre data-snippet>
 * element via DOM traversal, copies to clipboard, and shows a transient
 * "Copied!" announcement via a polite aria-live region.
 */
export function CheatsheetCopyHandler() {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const button = target.closest<HTMLButtonElement>('button[data-copy-snippet]')
      if (!button) return
      const card = button.closest('[data-cheatsheet-row]')
      const pre = card?.querySelector<HTMLElement>('pre[data-snippet]')
      const snippet = pre?.dataset.snippet
      if (!snippet) return
      // Note: this is a synchronous click handler — calling clipboard.writeText
      // directly from the event preserves the user gesture on iOS Safari.
      // If you ever introduce async work BEFORE this call (e.g., transforming
      // the snippet), switch to the ClipboardItem + Promise<Blob> pattern used
      // in build-service AIActionsMenu.tsx — see MEMORY.md.
      navigator.clipboard.writeText(snippet).then(
        () => {
          button.dataset.state = 'copied'
          setAnnouncement(`${button.dataset.label ?? 'Snippet'} copied`)
          setTimeout(() => {
            button.dataset.state = ''
            setAnnouncement('')
          }, 1200)
        },
        () => {
          setAnnouncement('Copy failed')
          setTimeout(() => setAnnouncement(''), 1200)
        }
      )
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>
  )
}
