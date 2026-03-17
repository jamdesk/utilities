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

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false)
      router.push(`/${slug}`)
    },
    [router]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Command palette">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-x-0 top-0 flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
        <Command
          label="Command palette"
          className="w-full max-w-lg overflow-hidden rounded-xl border border-[#2a2640] bg-[#1a1725] shadow-2xl shadow-black/40 sm:max-w-xl"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          loop
        >
          <Command.Input
            placeholder="Search tools..."
            className="w-full border-b border-[#2a2640] bg-transparent px-4 py-3 text-base text-[#e0e0e4] placeholder:text-[#4a4858] focus:outline-none"
            autoFocus
          />
          <Command.List className="max-h-[300px] overflow-y-auto p-2 sm:max-h-[320px]">
            <Command.Empty className="px-4 py-8 text-center text-sm text-[#6b6b78]">
              No tools found.
            </Command.Empty>
            <Command.Group heading="Tools" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#4a4858]">
              {tools.map((tool) => (
                <Command.Item
                  key={tool.slug}
                  value={tool.name}
                  keywords={[tool.slug, tool.description]}
                  onSelect={() => handleSelect(tool.slug)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#e0e0e4] transition-colors data-[selected=true]:bg-[#7c3aed]/15 data-[selected=true]:text-[#a78bfa]"
                >
                  <span className="text-base" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-[#6b6b78]">
                      {tool.description}
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="border-t border-[#2a2640] px-4 py-2">
            <div className="flex items-center justify-between text-xs text-[#4a4858]">
              <span>Navigate with arrow keys</span>
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-[#2a2640] bg-[#13111a] px-1.5 py-0.5 text-[10px] font-medium text-[#6b6b78]">
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
