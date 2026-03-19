'use client'

import { trackEvent } from '@/lib/analytics'

interface ConversionCtaProps {
  text: string
  description: string
  toolSlug?: string
}

export function ConversionCta({ text, description, toolSlug }: ConversionCtaProps) {
  return (
    <a
      href="https://www.jamdesk.com/pricing"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('CTA Click', { tool: toolSlug ?? text })}
      className="block rounded-lg border border-border bg-card p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-colors hover:bg-secondary"
    >
      <p className="mb-1 font-medium text-foreground">{text}</p>
      <p className="text-sm text-muted-foreground">
        {description}{' '}
        <span className="text-primary">Learn more &rarr;</span>
      </p>
    </a>
  )
}
