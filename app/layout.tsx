import type { Metadata } from 'next'
import Script from 'next/script'
import { inter, dmSans, jetbrainsMono } from '@/lib/fonts'
import { DefaultHeader } from '@/components/shell/DefaultHeader'
import { DefaultFooter } from '@/components/shell/DefaultFooter'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Jamdesk Utilities',
    default: 'MDX Utilities — Free Online Tools | Jamdesk',
  },
  description:
    'Free, open-source MDX tools. Format, validate, preview, and convert MDX files — all client-side.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#faf8f5" />
        <link rel="icon" href="https://www.jamdesk.com/favicon.ico" sizes="any" />
        <Script
          defer
          data-domain="jamdesk.com"
          src="https://plausible.io/js/script.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <CommandPalette />
        <DefaultHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <DefaultFooter />
      </body>
    </html>
  )
}
