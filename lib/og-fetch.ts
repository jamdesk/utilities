import { imageSize } from 'image-size'
import { parseHead, resolveUrl } from '@/lib/og-parse'
import { validateTargetUrl } from '@/lib/og-url-guard'
import type { ImageCheck, OgPreviewResult } from '@/lib/og-types'

const USER_AGENT =
  'JamdeskOGPreview/1.0 (+https://www.jamdesk.com/utilities/opengraph-preview)'
const FETCH_TIMEOUT_MS = 8000
// Total budget across all hops + image fetches, kept below the route's
// maxDuration (30s) so we return a JSON error instead of a Vercel 504.
const TOTAL_TIMEOUT_MS = 25_000
const MAX_REDIRECTS = 5
const MAX_HTML_BYTES = 1024 * 1024
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

/** User-presentable fetch failure — the route maps these to 422 responses. */
export class OgFetchError extends Error {}

export async function fetchPreview(inputUrl: string): Promise<OgPreviewResult> {
  const guard = validateTargetUrl(inputUrl)
  if (!guard.ok) throw new OgFetchError(guard.error)

  const deadline = Date.now() + TOTAL_TIMEOUT_MS
  const { response, finalUrl } = await guardedFetch(
    guard.url,
    'text/html,application/xhtml+xml',
    deadline
  )

  const contentType = response.headers.get('content-type') ?? ''
  if (response.ok && !contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    response.body?.cancel().catch(() => {})
    throw new OgFetchError(
      `URL returned ${contentType.split(';')[0] || 'unknown content'}, not an HTML page`
    )
  }

  let html: string
  try {
    html = decodeBody(await readCapped(response, MAX_HTML_BYTES), contentType)
  } catch {
    throw new OgFetchError('Could not read the page body')
  }
  const meta = parseHead(html, finalUrl.toString())

  // `||` (not `??`) so an empty-string tag doesn't mask a valid fallback
  const candidates = [
    meta.og['image:secure_url'] || meta.og['image'],
    meta.twitter['image'] || meta.twitter['image:src'],
  ]
  const imageUrls = [
    ...new Set(
      candidates.flatMap((c) => {
        const abs = resolveUrl(c, finalUrl.toString())
        return abs ? [abs] : []
      })
    ),
  ]
  const images: Record<string, ImageCheck> = {}
  await Promise.all(
    imageUrls.map(async (url) => {
      images[url] = await checkImage(url, deadline)
    })
  )

  return {
    inputUrl,
    finalUrl: finalUrl.toString(),
    status: response.status,
    meta,
    images,
  }
}

/** Decode a body honoring the content-type charset, falling back to UTF-8. */
function decodeBody(body: Uint8Array, contentType: string): string {
  const charset = /charset=["']?([^;"'\s]+)/i.exec(contentType)?.[1]
  if (charset) {
    try {
      return new TextDecoder(charset).decode(body)
    } catch {
      // unknown charset label — fall back to UTF-8
    }
  }
  return new TextDecoder().decode(body)
}

/**
 * Fetch with manual redirect following so EVERY hop passes the SSRF guard —
 * a public page redirecting to an internal address must be rejected.
 * Each hop's timeout is clamped to the remaining total `deadline` budget.
 */
async function guardedFetch(
  startUrl: URL,
  accept: string,
  deadline: number
): Promise<{ response: Response; finalUrl: URL }> {
  let current = startUrl
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const remaining = deadline - Date.now()
    if (remaining <= 0) throw new OgFetchError('Timed out fetching the URL')
    let response: Response
    try {
      response = await fetch(current.toString(), {
        redirect: 'manual',
        signal: AbortSignal.timeout(Math.min(FETCH_TIMEOUT_MS, remaining)),
        headers: { 'user-agent': USER_AGENT, accept },
      })
    } catch {
      throw new OgFetchError('Could not reach the URL (timeout or network error)')
    }
    if (response.status >= 300 && response.status < 400) {
      response.body?.cancel().catch(() => {})
      const location = response.headers.get('location')
      const next = location ? resolveUrl(location, current.toString()) : undefined
      if (!next) throw new OgFetchError('Redirect without a valid Location header')
      const hopGuard = validateTargetUrl(next)
      if (!hopGuard.ok) throw new OgFetchError('Redirected to a blocked address')
      current = hopGuard.url
      continue
    }
    return { response, finalUrl: current }
  }
  throw new OgFetchError('Too many redirects')
}

async function checkImage(url: string, deadline: number): Promise<ImageCheck> {
  const guard = validateTargetUrl(url)
  if (!guard.ok) return { url, ok: false, error: guard.error }
  let response: Response
  try {
    ;({ response } = await guardedFetch(guard.url, 'image/*', deadline))
  } catch (err) {
    return { url, ok: false, error: err instanceof Error ? err.message : 'Image fetch failed' }
  }
  if (!response.ok) {
    response.body?.cancel().catch(() => {})
    return { url, ok: false, status: response.status, error: `Image request failed (${response.status})` }
  }
  const contentType = (response.headers.get('content-type') ?? '').split(';')[0]
  let body: Uint8Array
  try {
    body = await readCapped(response, MAX_IMAGE_BYTES)
  } catch {
    return { url, ok: false, status: response.status, error: 'Image could not be read' }
  }
  let width: number | undefined
  let height: number | undefined
  try {
    const dims = imageSize(body)
    width = dims.width
    height = dims.height
  } catch {
    // unknown format — dimensions stay undefined, lint flags the content type
  }
  // Prefer the declared content-length so images beyond MAX_IMAGE_BYTES
  // report their true size rather than the capped read length — but never
  // less than what was actually read (an under-declared header must not
  // shrink the size the lint evaluates).
  const lengthHeader = response.headers.get('content-length')
  const declaredBytes = lengthHeader ? Number(lengthHeader) : NaN
  const bytes =
    Number.isFinite(declaredBytes) && declaredBytes > 0
      ? Math.max(declaredBytes, body.byteLength)
      : body.byteLength
  return { url, ok: true, status: response.status, contentType, bytes, width, height }
}

/** Read a response body up to `cap` bytes, then cancel the stream. */
async function readCapped(response: Response, cap: number): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array(0)
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (total < cap) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.byteLength
  }
  reader.cancel().catch(() => {})
  const out = new Uint8Array(Math.min(total, cap))
  let offset = 0
  for (const chunk of chunks) {
    if (offset >= out.length) break
    const slice = chunk.subarray(0, Math.min(chunk.byteLength, out.length - offset))
    out.set(slice, offset)
    offset += slice.byteLength
  }
  return out
}
