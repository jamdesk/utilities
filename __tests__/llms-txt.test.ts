import { describe, it, expect } from 'vitest'
import { GET } from '../app/llms.txt/route'
import { REPO_URL, LICENSE_URL, ORG_URL } from '../lib/site'

describe('llms.txt', () => {
  it('returns plain text with the canonical license, repo, and org URLs', async () => {
    const res = GET()
    expect(res.headers.get('Content-Type')).toMatch(/text\/plain/)
    const body = await res.text()
    expect(body).toContain(REPO_URL)
    expect(body).toContain(LICENSE_URL)
    expect(body).toContain(ORG_URL)
    expect(body).toContain('All tools run entirely in the user\'s browser')
  })
})

describe('llms.txt route — facts', () => {
  it('includes per-tool facts as bullet sub-items', async () => {
    const res = GET()
    const body = await res.text()
    expect(body).toContain('MDX Formatter')
    expect(body).toContain('Uses Prettier 3.x with the official MDX parser.')
    expect(body).toContain('remark-mdx parser')
  })

  it('includes the privacy claim as a header-level fact', async () => {
    const res = GET()
    const body = await res.text()
    expect(body).toContain("All tools run entirely in the user's browser")
  })

  it('emits text/plain content-type', () => {
    const res = GET()
    expect(res.headers.get('Content-Type')).toContain('text/plain')
  })

  it('emits Last-Modified header keyed to LAST_REVIEWED', async () => {
    const res = GET()
    const lm = res.headers.get('Last-Modified')
    expect(lm).toBeTruthy()
    expect(new Date(lm!).toISOString().slice(0, 10)).toBe(
      new Date('2026-04-29').toISOString().slice(0, 10)
    )
  })
})
