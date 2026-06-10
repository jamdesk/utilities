'use client'

import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react'
import { lintOgResult } from '@/lib/og-lint'
import { resolvePlatform, type PlatformId, type PlatformPreview } from '@/lib/og-platforms'
import type { OgPreviewResult } from '@/lib/og-types'
import { ogPreviewSample } from '@/lib/samples'
import { LintPanel } from './og-preview/LintPanel'
import { PlatformLogo } from './og-preview/PlatformLogo'
import { RawTagsTable } from './og-preview/RawTagsTable'
import { XCard } from './og-preview/XCard'
import { FacebookCard } from './og-preview/FacebookCard'
import { LinkedInCard } from './og-preview/LinkedInCard'
import { SlackCard } from './og-preview/SlackCard'
import { DiscordCard } from './og-preview/DiscordCard'
import { WhatsAppCard } from './og-preview/WhatsAppCard'
import { IMessageCard } from './og-preview/IMessageCard'
import { GoogleSerpCard } from './og-preview/GoogleSerpCard'

// basePath is /utilities — client fetch() does not get the prefix automatically
const API_PATH = '/utilities/api/og-preview'

const PLATFORMS: { id: PlatformId; label: string; Card: ComponentType<{ p: PlatformPreview }> }[] = [
  { id: 'x', label: 'X (Twitter)', Card: XCard },
  { id: 'facebook', label: 'Facebook', Card: FacebookCard },
  { id: 'linkedin', label: 'LinkedIn', Card: LinkedInCard },
  { id: 'slack', label: 'Slack', Card: SlackCard },
  { id: 'discord', label: 'Discord', Card: DiscordCard },
  { id: 'whatsapp', label: 'WhatsApp', Card: WhatsAppCard },
  { id: 'imessage', label: 'iMessage', Card: IMessageCard },
  { id: 'google', label: 'Google', Card: GoogleSerpCard },
]

export function OgPreview() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<OgPreviewResult | null>(null)

  // Keystrokes in the URL input re-render this component — don't recompute
  // the lint pass and 8 platform resolutions on every one.
  const findings = useMemo(() => (result ? lintOgResult(result) : []), [result])
  const previews = useMemo(
    () =>
      result
        ? PLATFORMS.map((entry) => ({ ...entry, preview: resolvePlatform(entry.id, result) }))
        : [],
    [result]
  )

  const runPreview = useCallback(async (target: string) => {
    const trimmed = target.trim()
    if (!trimmed) return
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    setUrl(withScheme)
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_PATH}?url=${encodeURIComponent(withScheme)}`)
      // Gateway errors (e.g. a 504 page) aren't JSON — never surface the
      // parser failure as the user-facing message.
      const data = await res.json().catch(() => null)
      if (!res.ok || data === null) {
        const message =
          data && typeof data.error === 'string' ? data.error : `Request failed (${res.status})`
        throw new Error(message)
      }
      setResult(data as OgPreviewResult)
      const next = new URL(window.location.href)
      next.searchParams.set('url', withScheme)
      window.history.replaceState(null, '', next.toString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch the URL')
    } finally {
      setLoading(false)
    }
  }, [])

  // Deep links: /utilities/opengraph-preview?url=…
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('url')
    if (param) {
      // Syncing from the external URL is what effects are for; runPreview sets
      // the input state (with scheme normalization) before its first await.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void runPreview(param)
    }
  }, [runPreview])

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          void runPreview(url)
        }}
      >
        {/* text-base = 16px, required to avoid iOS auto-zoom on focus */}
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={ogPreviewSample}
          aria-label="URL to preview"
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-lg bg-primary px-5 py-2 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Fetching…' : 'Preview'}
        </button>
      </form>

      {error && (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}

      {result && (
        <>
          <LintPanel findings={findings} />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {previews.map(({ id, label, Card, preview }) => (
              <div key={id}>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <PlatformLogo platform={id} />
                  {label}
                </h3>
                <Card p={preview} />
              </div>
            ))}
          </div>
          <details>
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Raw tags ({result.meta.rawTags.length})
            </summary>
            <div className="mt-3">
              <RawTagsTable tags={result.meta.rawTags} />
            </div>
          </details>
        </>
      )}

      {!result && !error && !loading && (
        <p className="text-sm text-muted-foreground">
          Enter a URL to see how it renders when shared on X, Facebook, LinkedIn, Slack, Discord,
          WhatsApp, iMessage, and Google — with tag-level validation.{' '}
          <button
            type="button"
            className="text-primary underline-offset-2 hover:underline"
            onClick={() => void runPreview(ogPreviewSample)}
          >
            Try an example
          </button>
        </p>
      )}
    </div>
  )
}
