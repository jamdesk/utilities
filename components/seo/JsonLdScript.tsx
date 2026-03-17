import type { Tool } from '@/lib/tools'

interface JsonLdScriptProps {
  type: 'collection' | 'tool'
  tools: Tool[]
  /** Required when type is 'tool' */
  tool?: Tool
  /** How-to content for tool pages */
  howTo?: { title: string; content: string }
}

function buildCollectionSchema(tools: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MDX Utilities',
    description:
      'Free, open-source MDX tools. Format, validate, preview, and convert MDX files — all client-side.',
    url: 'https://www.jamdesk.com/utilities',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Jamdesk',
      url: 'https://www.jamdesk.com',
    },
    hasPart: tools.map((tool) => ({
      '@type': 'WebApplication',
      name: tool.name,
      description: tool.description,
      url: `https://www.jamdesk.com/utilities/${tool.slug}`,
      applicationCategory: 'DeveloperApplication',
      isAccessibleForFree: true,
      browserRequirements: 'Requires JavaScript',
      operatingSystem: 'Any',
    })),
  }
}

function buildToolSchema(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.seoDescription,
    url: `https://www.jamdesk.com/utilities/${tool.slug}`,
    applicationCategory: 'DeveloperApplication',
    isAccessibleForFree: true,
    browserRequirements: 'Requires JavaScript',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

function buildHowToSchema(tool: Tool, howTo: { title: string; content: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.title,
    description: howTo.content.slice(0, 200),
    step: [
      {
        '@type': 'HowToStep',
        name: 'Open the tool',
        text: `Navigate to the ${tool.name} at jamdesk.com/utilities/${tool.slug}`,
      },
      {
        '@type': 'HowToStep',
        name: 'Paste your MDX',
        text: 'Paste your MDX content into the input editor, or upload an .mdx file',
      },
      {
        '@type': 'HowToStep',
        name: 'Get results',
        text: 'The tool processes your MDX instantly. Copy or download the output.',
      },
    ],
    tool: {
      '@type': 'HowToTool',
      name: tool.name,
    },
  }
}

/**
 * Renders structured data for search engines.
 * Content is safe — built from our own static tool registry, not user input.
 */
export function JsonLdScript({ type, tools, tool, howTo }: JsonLdScriptProps) {
  const schemas =
    type === 'collection'
      ? [buildCollectionSchema(tools)]
      : [buildToolSchema(tool!), ...(howTo ? [buildHowToSchema(tool!, howTo)] : [])]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
