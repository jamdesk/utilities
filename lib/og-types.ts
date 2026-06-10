/**
 * Shared types for the OpenGraph Preview tool — used by the API route
 * (server) and the preview UI (client). Keep this file dependency-free
 * so importing it never drags server code into the client bundle.
 * Also holds tiny shared dependency-free helpers used by both sides.
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
  finalUrl: string
  status: number
  meta: ParsedMeta
  /** Deep-checks keyed by absolute image URL (og:image, twitter:image) */
  images: Record<string, ImageCheck>
}

// `||` (not `??`) so an empty-string tag doesn't mask a valid fallback.
// These chains decide which images get deep-checked (server), linted, and
// rendered (client) — keep them in one place so the three can't drift.

/** The image og:* consumers (Facebook, LinkedIn, Slack, …) would use. */
export function ogImageCandidate(meta: ParsedMeta): string | undefined {
  return meta.og['image:secure_url'] || meta.og['image'] || undefined
}

/** The image twitter:* consumers (X) would use, before their og fallback. */
export function twitterImageCandidate(meta: ParsedMeta): string | undefined {
  return meta.twitter['image'] || meta.twitter['image:src'] || undefined
}
