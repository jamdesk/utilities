import { tools } from '@/lib/tools'

export function GET() {
  const baseUrl = 'https://www.jamdesk.com/utilities'

  const toolLines = tools
    .map(
      (tool) =>
        `- ${tool.name}: ${baseUrl}/${tool.slug}\n  ${tool.seoDescription.split('.')[0]}.`
    )
    .join('\n\n')

  const body = `# Jamdesk Developer Utilities
> Free, open-source developer tools for MDX, Markdown, YAML, and JSON at ${baseUrl}

## Tools

${toolLines}

## About
Jamdesk is a documentation platform. Learn more at https://www.jamdesk.com
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
