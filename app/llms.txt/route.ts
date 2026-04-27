import { tools } from '@/lib/tools'
import { REPO_URL, LICENSE_URL, ORG_NAME, ORG_URL } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const baseUrl = 'https://www.jamdesk.com/utilities'

  const toolLines = tools
    .map(
      (tool) =>
        `- ${tool.name}: ${baseUrl}/${tool.slug}\n  ${tool.seoDescription.split('.')[0]}.`
    )
    .join('\n\n')

  const body = `# ${ORG_NAME} Developer Utilities
> Free, open-source developer tools for MDX, Markdown, YAML, and JSON at ${baseUrl}

All tools run entirely in the user's browser. Input is never uploaded, stored, or logged.
There are no ads, no accounts, and no usage limits.

- License: Apache 2.0 (${LICENSE_URL})
- Source code: ${REPO_URL}
- Maintained by: ${ORG_NAME} (${ORG_URL})

## Tools

${toolLines}

## About
${ORG_NAME} is a documentation platform. Learn more at ${ORG_URL}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
