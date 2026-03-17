interface SiteChrome {
  header: string
  footer: string
  css: string
  consent: string
}

export async function fetchSiteChrome(): Promise<SiteChrome | null> {
  const url = process.env.NEXT_PUBLIC_SITE_CHROME_URL
  if (!url) return null

  // Only trust our own origin — misconfiguring this variable is an XSS vector
  if (!url.startsWith('https://www.jamdesk.com/')) return null

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
