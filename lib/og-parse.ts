import { Parser } from 'htmlparser2'
import type { ParsedMeta, RawTag } from '@/lib/og-types'

/** Resolve a possibly-relative URL against the page URL; undefined if unparseable. */
export function resolveUrl(href: string | undefined, base: string): string | undefined {
  if (!href) return undefined
  try {
    const resolved = new URL(href, base)
    if (!resolved.hostname) return undefined
    return resolved.toString()
  } catch {
    return undefined
  }
}

/**
 * Extract social metadata from an HTML document. Scans the whole provided
 * string (not just <head>) because real-world pages sometimes emit og tags
 * in the body. First occurrence wins for og:/twitter: values, matching how
 * platform scrapers behave; every occurrence is recorded in rawTags.
 */
export function parseHead(html: string, pageUrl: string): ParsedMeta {
  const og: Record<string, string> = {}
  const twitter: Record<string, string> = {}
  const rawTags: RawTag[] = []
  let title: string | undefined
  let description: string | undefined
  let canonical: string | undefined
  let themeColor: string | undefined
  let faviconHref: string | undefined
  let inTitle = false
  let titleText = ''

  const parser = new Parser(
    {
      onopentag(name, attrs) {
        if (name === 'title' && title === undefined) {
          inTitle = true
          titleText = ''
        }
        if (name === 'meta') {
          // og: officially uses property=, twitter: uses name=, but sites mix
          // them up constantly — accept either.
          const key = (attrs.property ?? attrs.name ?? '').toLowerCase()
          const content = attrs.content
          if (!key || content === undefined) return
          if (key.startsWith('og:')) {
            const short = key.slice(3)
            if (!(short in og)) og[short] = content
            rawTags.push({ name: key, content, source: 'og' })
          } else if (key.startsWith('twitter:')) {
            const short = key.slice(8)
            if (!(short in twitter)) twitter[short] = content
            rawTags.push({ name: key, content, source: 'twitter' })
          } else if (key === 'description') {
            if (description === undefined) description = content
            rawTags.push({ name: 'description', content, source: 'html' })
          } else if (key === 'theme-color') {
            if (themeColor === undefined) themeColor = content
            rawTags.push({ name: 'theme-color', content, source: 'html' })
          }
        }
        if (name === 'link' && attrs.rel && attrs.href) {
          const rel = attrs.rel.toLowerCase()
          if (rel === 'canonical' && canonical === undefined) {
            canonical = resolveUrl(attrs.href, pageUrl)
            rawTags.push({ name: 'canonical', content: attrs.href, source: 'html' })
          }
          if ((rel === 'icon' || rel === 'shortcut icon' || rel === 'apple-touch-icon') && faviconHref === undefined) {
            faviconHref = attrs.href
          }
        }
      },
      ontext(text) {
        if (inTitle) titleText += text
      },
      onclosetag(name) {
        if (name === 'title' && inTitle) {
          inTitle = false
          const trimmed = titleText.trim()
          if (trimmed && title === undefined) {
            title = trimmed
            rawTags.push({ name: 'title', content: trimmed, source: 'html' })
          }
        }
      },
    },
    { decodeEntities: true, lowerCaseAttributeNames: true }
  )
  parser.write(html)
  parser.end()

  return {
    title,
    description,
    canonical,
    themeColor,
    faviconUrl: resolveUrl(faviconHref, pageUrl) ?? resolveUrl('/favicon.ico', pageUrl),
    og,
    twitter,
    rawTags,
  }
}
