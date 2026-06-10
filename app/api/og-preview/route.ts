import { NextRequest, NextResponse } from 'next/server'
import { fetchPreview, OgFetchError } from '@/lib/og-fetch'

export const dynamic = 'force-dynamic'
// The fetch layer enforces a 25s total budget (TOTAL_TIMEOUT_MS in og-fetch),
// kept below this Vercel limit so timeouts return JSON instead of a 504
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }
  try {
    const result = await fetchPreview(url)
    return NextResponse.json(result, {
      headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    const message = err instanceof OgFetchError ? err.message : 'Failed to fetch the URL'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
