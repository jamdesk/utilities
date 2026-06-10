import { ogImageCandidate, twitterImageCandidate, type OgPreviewResult } from '@/lib/og-types'

export type LintSeverity = 'error' | 'warning' | 'info'

export interface LintFinding {
  severity: LintSeverity
  id: string
  message: string
  hint?: string
  /** Absolute image URL for per-image findings — disambiguates duplicates when og:image and twitter:image differ */
  url?: string
}

/**
 * Validate fetched metadata against platform requirements. Pure function —
 * runs client-side over the API response. Severities: error = card will be
 * broken/missing, warning = degraded rendering, info = nice-to-have.
 */
export function lintOgResult(result: OgPreviewResult): LintFinding[] {
  const findings: LintFinding[] = []
  const { og, twitter, title, description, canonical } = result.meta
  const add = (severity: LintSeverity, id: string, message: string, hint?: string, url?: string) =>
    findings.push({ severity, id, message, hint, url })

  if (result.status >= 400) {
    add('error', 'page-status', `Page returned HTTP ${result.status}`,
      'Scrapers refuse non-200 pages — Facebook reports "Bad Response Code" and shows no card.')
  }

  if (!og.title) {
    if (title) {
      add('warning', 'missing-og-title', 'Missing og:title',
        'Platforms fall back to the <title> tag, which is often longer than ideal for share cards.')
    } else {
      add('error', 'missing-og-title', 'Missing og:title and <title>',
        'Add <meta property="og:title"> — without it most platforms show only the bare URL.')
    }
  }

  if (!og.description) {
    if (description) {
      add('info', 'missing-og-description', 'Missing og:description',
        'Platforms fall back to the meta description.')
    } else {
      add('warning', 'missing-og-description', 'Missing og:description and meta description',
        'Cards will render without summary text.')
    }
  }

  const ogImage = ogImageCandidate(result.meta)
  const rawImage = ogImage || twitterImageCandidate(result.meta)
  if (!rawImage) {
    add('error', 'missing-og-image', 'Missing og:image',
      'Most platforms render a text-only card — or no card at all — without an image.')
  } else if (!ogImage) {
    add('warning', 'missing-og-image', 'Missing og:image — only twitter:image is set',
      'Only X reads twitter:image. Facebook, LinkedIn, Slack, Discord, WhatsApp, and iMessage need og:image.')
  } else if (!/^https?:\/\//i.test(rawImage)) {
    add('error', 'image-not-absolute', `og:image is not an absolute URL ("${rawImage}")`,
      'The Open Graph spec requires a fully-qualified URL; many scrapers will not resolve relative paths.')
  } else if (rawImage.toLowerCase().startsWith('http://')) {
    add('warning', 'insecure-image', 'og:image uses http://',
      'Some platforms refuse mixed-content images; serve it over https or add og:image:secure_url.')
  }

  if (!twitter['card']) {
    add('warning', 'missing-twitter-card', 'Missing twitter:card',
      'X defaults to a small summary card. Add <meta name="twitter:card" content="summary_large_image"> for the full-width card.')
  }

  for (const check of Object.values(result.images)) {
    if (!check.ok) {
      add('error', 'image-unreachable', `Image failed to load: ${check.url}`, check.error, check.url)
      continue
    }
    const type = check.contentType ?? ''
    if (type === 'image/webp' || type === 'image/avif') {
      add('warning', 'image-format', `Image is ${type}`,
        'WebP/AVIF are not supported by every scraper; JPEG or PNG is the safe choice.', check.url)
    } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(type)) {
      add('error', 'image-format', `Image content-type is ${type || 'unknown'}`,
        'Use JPEG, PNG, or GIF.', check.url)
    }
    if (check.width && check.height) {
      if (check.width < 200 || check.height < 200) {
        add('error', 'image-too-small', `Image is ${check.width}×${check.height}`,
          'Facebook ignores images smaller than 200×200.', check.url)
      } else if (check.width < 1200 || check.height < 628) {
        add('warning', 'image-small',
          `Image is ${check.width}×${check.height} — below the recommended 1200×630`,
          'Small images render as low-resolution or thumbnail cards on X, Facebook, and LinkedIn.', check.url)
      }
      const ratio = check.width / check.height
      if (ratio < 1.5 || ratio > 2.1) {
        add('warning', 'image-aspect', `Image aspect ratio is ${ratio.toFixed(2)}:1`,
          'Large cards crop to roughly 1.91:1; key content may be cut off.', check.url)
      }
      const declaredW = Number(og['image:width'])
      const declaredH = Number(og['image:height'])
      if (declaredW && declaredW !== check.width) {
        add('warning', 'image-dims-mismatch',
          `og:image:width says ${declaredW} but the image is ${check.width}px wide`,
          'Scrapers that trust declared dimensions will lay the card out incorrectly.', check.url)
      } else if (declaredH && declaredH !== check.height) {
        add('warning', 'image-dims-mismatch',
          `og:image:height says ${declaredH} but the image is ${check.height}px tall`,
          'Scrapers that trust declared dimensions will lay the card out incorrectly.', check.url)
      }
    }
    if (check.bytes && check.bytes > 5 * 1024 * 1024) {
      add('warning', 'image-too-large', `Image is ${(check.bytes / 1024 / 1024).toFixed(1)} MB`,
        'X rejects images over 5 MB; Facebook over 8 MB.', check.url)
    }
  }

  const effectiveTitle = twitter['title'] ?? og['title'] ?? title
  if (effectiveTitle && effectiveTitle.length > 70) {
    add('info', 'title-long', `Title is ${effectiveTitle.length} characters`,
      'X and Google truncate around 60–70 characters.')
  }
  const effectiveDesc = twitter['description'] ?? og['description'] ?? description
  if (effectiveDesc && effectiveDesc.length > 200) {
    add('info', 'description-long', `Description is ${effectiveDesc.length} characters`,
      'Most platforms truncate around 200 characters; front-load the key message.')
  }

  if (!og['url'] && !canonical) {
    add('info', 'missing-og-url', 'Missing og:url and canonical link',
      'Helps platforms deduplicate shares of URL variants (tracking params, http/https).')
  }
  if (!og['site_name']) {
    add('info', 'missing-site-name', 'Missing og:site_name',
      'Slack and Discord display the site name above the title.')
  }

  return findings
}
