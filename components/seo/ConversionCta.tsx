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
      className="block rounded-lg border-l-4 border-l-[#7c3aed] bg-[#1a1725] p-5 transition-colors hover:bg-[#1e1b2e]"
    >
      <p className="mb-1 font-medium text-[#e0e0e4]">{text}</p>
      <p className="text-sm text-[#6b6b78]">
        {description}{' '}
        <span className="text-[#a78bfa]">Learn more &rarr;</span>
      </p>
    </a>
  )
}
