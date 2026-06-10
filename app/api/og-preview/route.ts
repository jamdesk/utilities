import { NextRequest, NextResponse } from 'next/server'
import { fetchPreview, OgFetchError } from '@/lib/og-fetch'

export const dynamic = 'force-dynamic'
// Page fetch (8s) + image fetches (8s, parallel) can exceed Vercel's default
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
