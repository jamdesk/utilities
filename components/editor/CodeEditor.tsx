'use client'

import { useRef, useEffect, useCallback } from 'react'
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  drawSelection,
  ViewUpdate,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import dynamic from 'next/dynamic'

const darkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#1a1725',
      color: '#c0bdd0',
      fontSize: '14px',
      height: '100%',
    },
    '.cm-content': {
      caretColor: '#7c3aed',
      fontFamily: 'var(--font-mono, ui-monospace, monospace)',
      padding: '8px 0',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#7c3aed',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#7c3aed',
    },
    '.cm-gutters': {
      backgroundColor: '#0f0d17',
      color: '#4a4858',
      border: 'none',
      borderRight: '1px solid #2a2640',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#1a1725',
      color: '#6b6b78',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(42, 38, 64, 0.4)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: '#2a2640',
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(124, 58, 237, 0.3)',
      outline: 'none',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
  },
  { dark: true }
)

const highlightStyles = HighlightStyle.define([
  { tag: tags.heading, color: '#a78bfa', fontWeight: 'bold' },
  { tag: tags.emphasis, color: '#c0bdd0', fontStyle: 'italic' },
  { tag: tags.strong, color: '#e0e0e4', fontWeight: 'bold' },
  { tag: tags.keyword, color: '#7c3aed' },
  { tag: tags.atom, color: '#a78bfa' },
  { tag: tags.bool, color: '#34d399' },
  { tag: tags.url, color: '#a78bfa', textDecoration: 'underline' },
  { tag: tags.labelName, color: '#f0a050' },
  { tag: tags.inserted, color: '#34d399' },
  { tag: tags.deleted, color: '#ef4444' },
  { tag: tags.literal, color: '#34d399' },
  { tag: tags.string, color: '#34d399' },
  { tag: tags.number, color: '#f0a050' },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: '#f0a050' },
  { tag: tags.definition(tags.variableName), color: '#e0e0e4' },
  { tag: tags.typeName, color: '#a78bfa' },
  { tag: tags.className, color: '#a78bfa' },
  { tag: tags.comment, color: '#4a4858', fontStyle: 'italic' },
  { tag: tags.meta, color: '#6b6b78' },
  { tag: tags.link, color: '#a78bfa' },
  { tag: tags.processingInstruction, color: '#7c3aed' },
  { tag: tags.tagName, color: '#7c3aed' },
  { tag: tags.attributeName, color: '#a78bfa' },
  { tag: tags.attributeValue, color: '#34d399' },
])

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  'aria-label'?: string
}

/** Internal CodeMirror wrapper — not meant for direct import. Use CodeEditorDynamic. */
function CodeEditorInner({
  value,
  onChange,
  readOnly = false,
  'aria-label': ariaLabel,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep callback ref in sync without causing re-creation
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const handleUpdate = useCallback((update: ViewUpdate) => {
    if (!update.docChanged) return

    const newValue = update.state.doc.toString()

    // Detect paste: check if any transaction has an inputType of paste
    let isPaste = false
    for (const tr of update.transactions) {
      if (tr.isUserEvent('input.paste')) {
        isPaste = true
        break
      }
    }

    if (isPaste) {
      // Immediate callback for paste
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      onChangeRef.current?.(newValue)
    } else {
      // Debounced callback for keystrokes
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null
        onChangeRef.current?.(newValue)
      }, 300)
    }
  }, [])

  // Create editor on mount
  useEffect(() => {
    if (!containerRef.current) return

    const extensions = [
      darkTheme,
      syntaxHighlighting(highlightStyles),
      lineNumbers(),
      highlightActiveLine(),
      drawSelection(),
      bracketMatching(),
      markdown({ codeLanguages: (info) => (info === 'jsx' || info === 'tsx' || info === 'js' || info === 'ts') ? javascript({ jsx: true, typescript: info === 'tsx' || info === 'ts' }).language : null }),
      EditorView.updateListener.of(handleUpdate),
    ]

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true))
      extensions.push(EditorView.editable.of(false))
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      view.destroy()
      viewRef.current = null
    }
    // Only run on mount/unmount — value updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly])

  // Sync value prop to editor without losing cursor
  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    const currentValue = view.state.doc.toString()
    if (currentValue !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      })
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden rounded-md border border-border"
      aria-label={ariaLabel}
      role="textbox"
      aria-multiline="true"
      aria-readonly={readOnly || undefined}
    />
  )
}

/** Dynamically-loaded CodeEditor — safe for SSR. Use this in tool components. */
const CodeEditorDynamic = dynamic(() => Promise.resolve(CodeEditorInner), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-md border border-border bg-surface">
      <span className="text-sm text-muted-foreground">Loading editor...</span>
    </div>
  ),
})

export { CodeEditorDynamic as CodeEditor }
export type { CodeEditorProps }
