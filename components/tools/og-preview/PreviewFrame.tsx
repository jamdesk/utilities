import type { ReactNode } from 'react'

interface PreviewFrameProps {
  label: string
  children: ReactNode
}

export function PreviewFrame({ label, children }: PreviewFrameProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      {children}
    </div>
  )
}
