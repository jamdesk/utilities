import type { Metadata } from 'next'
import Script from 'next/script'
import { inter, jetbrainsMono } from '@/lib/fonts'
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <Script
          defer
          data-domain="jamdesk.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#13111a] text-[#e0e0e4] antialiased">
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
        <main className="flex-1">{children}</main>
        {siteChrome ? (
          <SiteChromeFooter footer={siteChrome.footer} consent={siteChrome.consent} />
        ) : (
          <DefaultFooter />
        )}
      </body>
    </html>
  )
}
