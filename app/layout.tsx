import type { Metadata } from 'next'
import Script from 'next/script'
import { inter, dmSans, jetbrainsMono } from '@/lib/fonts'
import { DefaultHeader } from '@/components/shell/DefaultHeader'
import { DefaultFooter } from '@/components/shell/DefaultFooter'
import { SiteChromeHeader, SiteChromeFooter } from '@/components/shell/SiteChrome'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { fetchSiteChrome } from '@/lib/site-chrome'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Jamdesk Utilities',
    default: 'MDX Utilities — Free Online Tools | Jamdesk',
  },
  description:
    'Free, open-source MDX tools. Format, validate, preview, and convert MDX files — all client-side.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteChrome = await fetchSiteChrome()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#faf8f5" />
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
        {siteChrome ? (
          <>
            <SiteChromeHeader header={siteChrome.header} css={siteChrome.css} />
            {/* Spacer for fixed-position site chrome nav */}
            <div className="h-14 md:h-16" />
          </>
        ) : (
          <DefaultHeader />
        )}
        <main id="main-content" className="flex-1">{children}</main>
        {siteChrome ? (
          <SiteChromeFooter footer={siteChrome.footer} consent={siteChrome.consent} />
        ) : (
          <DefaultFooter />
        )}
      </body>
    </html>
  )
}
