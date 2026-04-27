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
