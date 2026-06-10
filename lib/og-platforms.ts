import { ogImageCandidate, twitterImageCandidate, type OgPreviewResult } from '@/lib/og-types'

export type PlatformId =
  | 'x'
  | 'facebook'
  | 'linkedin'
  | 'slack'
  | 'discord'
  | 'whatsapp'
  | 'imessage'
  | 'google'

export interface PlatformPreview {
  title?: string
  description?: string
  /** Absolute image URL the platform would display; undefined when missing or its deep-check failed */
  imageUrl?: string
  siteName?: string
  /** Bare hostname, e.g. docs.example.com */
  domain: string
  /** Card layout requested by twitter:card — populated for every platform; XCard lays out by it */
  cardType: 'summary' | 'summary_large_image'
  themeColor?: string
  faviconUrl?: string
}

/**
 * Apply each platform's real metadata fallback chain. X and Slack read
 * twitter:* before og:* (Slack's precedence is oEmbed → twitter:* → og:*);
 * Google reads the plain HTML tags before og:*; everyone else reads og:*
 * with HTML fallback.
 */
export function resolvePlatform(platform: PlatformId, result: OgPreviewResult): PlatformPreview {
  const { og, twitter, title, description, themeColor, faviconUrl } = result.meta
  const domain = new URL(result.finalUrl).hostname

  // Local equivalent of og-parse's resolveUrl — importing og-parse here would pull htmlparser2 into the client bundle.
  const toAbsolute = (raw?: string): string | undefined => {
    if (!raw) return undefined
    try {
      return new URL(raw, result.finalUrl).toString()
    } catch {
      return undefined
    }
  }
  // Platforms don't render images their scraper couldn't load
  const usableImage = (raw?: string): string | undefined => {
    const abs = toAbsolute(raw)
    if (!abs) return undefined
    const check = result.images[abs]
    if (check && !check.ok) return undefined
    return abs
  }

  const ogImage = usableImage(ogImageCandidate(result.meta))
  const twitterImage = usableImage(twitterImageCandidate(result.meta)) ?? ogImage

  const base: PlatformPreview = {
    title: og.title ?? title,
    description: og.description ?? description,
    imageUrl: ogImage,
    siteName: og['site_name'],
    domain,
    cardType: twitter['card'] === 'summary_large_image' ? 'summary_large_image' : 'summary',
    themeColor,
    faviconUrl,
  }

  switch (platform) {
    case 'x':
    case 'slack':
      return {
        ...base,
        title: twitter.title ?? base.title,
        description: twitter.description ?? base.description,
        imageUrl: twitterImage,
      }
    case 'google':
      return {
        ...base,
        title: title ?? og.title,
        description: description ?? og.description,
      }
    default:
      return base
  }
}
