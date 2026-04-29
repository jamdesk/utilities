'use client'

import { useState } from 'react'
import { REPO_URL } from '@/lib/site'

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/utilities', label: 'Tools' },
  { href: '/utilities/mdx-cheatsheet', label: 'Cheatsheet' },
  {
    href: REPO_URL,
    label: 'GitHub',
    external: true,
  },
]

export function DefaultHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-[72px]">
        {/* Logo + brand */}
        <a
          href="https://www.jamdesk.com"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.jamdesk.com/logo-light.png"
            alt="Jamdesk"
            className="h-8 w-auto"
            width={120}
            height={32}
            fetchPriority="high"
          />
          <span className="text-xs font-medium text-muted-foreground">
            Utilities
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="mr-1 flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-secondary hover:text-foreground"
            aria-label="Search tools"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="hidden lg:inline">Search tools...</span>
            <kbd className="hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
              ⌘K
            </kbd>
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              {...(link.label === 'GitHub'
                ? { 'aria-label': 'GitHub repository' }
                : {})}
            >
              {link.label === 'GitHub' ? (
                <span><GitHubIcon /></span>
              ) : (
                link.label
              )}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="min-h-[44px] min-w-[44px] rounded-md p-2.5 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card px-4 py-3 sm:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {link.label === 'GitHub' && <GitHubIcon />}
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
