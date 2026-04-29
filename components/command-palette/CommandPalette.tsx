'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { tools } from '@/lib/tools'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    function handleOpen() {
      setOpen(true)
    }
    document.addEventListener('open-command-palette', handleOpen)
    return () => document.removeEventListener('open-command-palette', handleOpen)
  }, [])

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false)
      router.push(`/${slug}`)
    },
    [router]
  )

  const guides = [
    {
      slug: 'mdx-cheatsheet',
      icon: '📘',
      name: 'MDX Cheatsheet',
      description: 'Syntax reference for Markdown and MDX',
    },
    {
      slug: 'mdx-vs-markdown',
      icon: '⚖️',
      name: 'MDX vs Markdown',
      description: 'Compare formats and choose the right one',
    },
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] overscroll-contain" role="dialog" aria-modal="true" aria-label="Command palette">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-x-0 top-0 flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
        <Command
          label="Command palette"
          className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20 sm:max-w-xl"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          loop
        >
          <Command.Input
            placeholder="Search tools..."
            className="w-full border-b border-border bg-transparent px-4 py-3 text-base text-foreground placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            autoFocus
          />
          <Command.List className="max-h-[300px] overflow-y-auto overscroll-contain p-2 sm:max-h-[320px]">
            <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
              No tools found.
            </Command.Empty>
            <Command.Group heading="Tools" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted">
              {tools.map((tool) => (
                <Command.Item
                  key={tool.slug}
                  value={tool.name}
                  keywords={[tool.slug, tool.description]}
                  onSelect={() => handleSelect(tool.slug)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors data-[selected=true]:bg-[#ff3621]/10 data-[selected=true]:text-primary"
                >
                  <span className="text-base" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {tool.description}
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Guides" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted">
              {guides.map((guide) => (
                <Command.Item
                  key={guide.slug}
                  value={guide.name}
                  keywords={[guide.slug, guide.description]}
                  onSelect={() => handleSelect(guide.slug)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors data-[selected=true]:bg-[#ff3621]/10 data-[selected=true]:text-primary"
                >
                  <span className="text-base" aria-hidden="true">
                    {guide.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{guide.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {guide.description}
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="border-t border-border px-4 py-2">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Navigate with arrow keys</span>
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  esc
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </Command>
      </div>
    </div>
  )
}
