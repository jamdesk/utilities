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
      className="block rounded-lg border-l-4 border-l-[#ff3621] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#f3f0eb]"
    >
      <p className="mb-1 font-medium text-[#1b3139]">{text}</p>
      <p className="text-sm text-[#5a6f77]">
        {description}{' '}
        <span className="text-[#ff3621]">Learn more &rarr;</span>
      </p>
    </a>
  )
}
