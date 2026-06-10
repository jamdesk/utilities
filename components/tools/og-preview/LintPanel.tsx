import type { LintFinding } from '@/lib/og-lint'

const SEVERITY_STYLES: Record<LintFinding['severity'], { badge: string; label: string }> = {
  error: { badge: 'bg-red-100 text-red-700', label: 'Error' },
  warning: { badge: 'bg-amber-100 text-amber-700', label: 'Warning' },
  info: { badge: 'bg-sky-100 text-sky-700', label: 'Info' },
}

const SEVERITY_ORDER: Record<LintFinding['severity'], number> = { error: 0, warning: 1, info: 2 }

export function LintPanel({ findings }: { findings: LintFinding[] }) {
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        ✓ No issues found — this page&apos;s social metadata looks complete.
      </div>
    )
  }
  const sorted = [...findings].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <ul className="divide-y divide-border">
        {sorted.map((f) => (
          <li key={`${f.id}-${f.url ?? ''}-${f.message}`} className="flex items-start gap-3 bg-card px-4 py-3">
            <span
              className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${SEVERITY_STYLES[f.severity].badge}`}
            >
              {SEVERITY_STYLES[f.severity].label}
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-medium text-foreground">{f.message}</p>
              {f.hint && <p className="mt-0.5 text-muted-foreground">{f.hint}</p>}
              {f.url && (
                <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">{f.url}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
