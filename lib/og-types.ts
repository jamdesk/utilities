/**
 * Shared types for the OpenGraph Preview tool — used by the API route
 * (server) and the preview UI (client). Keep this file dependency-free
 * so importing it never drags server code into the client bundle.
 */

export interface RawTag {
  /** Tag identifier as authored, e.g. 'og:title', 'twitter:card', 'title', 'description', 'canonical', 'theme-color' */
  name: string
  content: string
  /** Where the tag came from: an og:* meta, a twitter:* meta, or plain HTML (<title>, meta description, link rel) */
  source: 'og' | 'twitter' | 'html'
}

export interface ParsedMeta {
  /** <title> text */
  title?: string
  /** <meta name="description"> */
  description?: string
  /** <link rel="canonical"> href, resolved to absolute */
  canonical?: string
  /** <meta name="theme-color"> — Discord uses it for the embed accent bar */
  themeColor?: string
  /** Favicon resolved to absolute (falls back to /favicon.ico) — Slack and Google previews show it */
  faviconUrl?: string
  /** og:* values keyed without the 'og:' prefix; first occurrence wins (per OG spec) */
  og: Record<string, string>
  /** twitter:* values keyed without the 'twitter:' prefix; first occurrence wins */
  twitter: Record<string, string>
  /** Every recognized tag in document order, for the raw tags table */
  rawTags: RawTag[]
}

export interface ImageCheck {
  url: string
  ok: boolean
  status?: number
  contentType?: string
  bytes?: number
  width?: number
  height?: number
  error?: string
}

export interface OgPreviewResult {
  inputUrl: string
  finalUrl: string
  status: number
  meta: ParsedMeta
  /** Deep-checks keyed by absolute image URL (og:image, twitter:image) */
  images: Record<string, ImageCheck>
}
