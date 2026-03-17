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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-x-0 top-0 flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
        <Command
          label="Command palette"
          className="w-full max-w-lg overflow-hidden rounded-xl border border-[#e8e4df] bg-white shadow-2xl shadow-black/20 sm:max-w-xl"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          loop
        >
          <Command.Input
            placeholder="Search tools..."
            className="w-full border-b border-[#e8e4df] bg-transparent px-4 py-3 text-base text-[#1b3139] placeholder:text-[#8fa8b3] focus:outline-none"
            autoFocus
          />
          <Command.List className="max-h-[300px] overflow-y-auto p-2 sm:max-h-[320px]">
            <Command.Empty className="px-4 py-8 text-center text-sm text-[#5a6f77]">
              No tools found.
            </Command.Empty>
            <Command.Group heading="Tools" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#8fa8b3]">
              {tools.map((tool) => (
                <Command.Item
                  key={tool.slug}
                  value={tool.name}
                  keywords={[tool.slug, tool.description]}
                  onSelect={() => handleSelect(tool.slug)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#1b3139] transition-colors data-[selected=true]:bg-[#ff3621]/10 data-[selected=true]:text-[#ff3621]"
                >
                  <span className="text-base" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-[#5a6f77]">
                      {tool.description}
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="border-t border-[#e8e4df] px-4 py-2">
            <div className="flex items-center justify-between text-xs text-[#8fa8b3]">
              <span>Navigate with arrow keys</span>
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-[#e8e4df] bg-[#f3f0eb] px-1.5 py-0.5 text-[10px] font-medium text-[#5a6f77]">
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
