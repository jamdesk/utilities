'use client'

import { trackEvent } from '@/lib/analytics'

interface ConversionCtaProps {
  text: string
  description: string
  toolSlug?: string
}

export function ConversionCta({
  text,
  description,
  toolSlug,
}: ConversionCtaProps) {
  return (
    <a
      href="https://www.jamdesk.com/pricing"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('CTA Click', { tool: toolSlug ?? text })}
      className="group block rounded-xl border border-primary/20 bg-gradient-to-r from-primary/[0.04] to-transparent p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(255,54,33,0.08)]"
    >
      <p className="mb-1.5 text-lg font-semibold text-foreground">{text}</p>
      <p className="text-sm text-muted-foreground">
        {description}{' '}
        <span className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
          Learn more
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </p>
    </a>
  )
}
