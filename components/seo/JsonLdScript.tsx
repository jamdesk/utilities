import type { Tool } from '@/lib/tools'

type JsonLdScriptProps =
  | { type: 'collection'; tools: Tool[] }
  | { type: 'tool'; tools: Tool[]; tool: Tool; howTo?: { title: string; content: string } }

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
  const inputDescription = tool.slug.startsWith('mdx')
    ? 'Paste your MDX content into the input editor, or upload an .mdx file'
    : tool.slug === 'yaml-validator'
      ? 'Paste your YAML content into the input editor'
      : tool.slug === 'json-yaml-converter'
        ? 'Paste your JSON or YAML content into the input editor'
        : tool.slug === 'markdown-table-generator'
          ? 'Paste your CSV or TSV data into the input editor'
          : 'Paste your content into the input editor, or upload a file'

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
        name: 'Add your content',
        text: inputDescription,
      },
      {
        '@type': 'HowToStep',
        name: 'Get results',
        text: 'The tool processes your content instantly. Copy or download the output.',
      },
    ],
    tool: {
      '@type': 'HowToTool',
      name: tool.name,
    },
  }
}

function buildBreadcrumbSchema(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Jamdesk',
        item: 'https://www.jamdesk.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Utilities',
        item: 'https://www.jamdesk.com/utilities',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `https://www.jamdesk.com/utilities/${tool.slug}`,
      },
    ],
  }
}

/**
 * Renders structured data for search engines.
 * Content is safe — built from our own static tool registry, not user input.
 */
export function JsonLdScript(props: JsonLdScriptProps) {
  const schemas =
    props.type === 'collection'
      ? [buildCollectionSchema(props.tools)]
      : [
          buildToolSchema(props.tool),
          buildBreadcrumbSchema(props.tool),
          ...(props.howTo ? [buildHowToSchema(props.tool, props.howTo)] : []),
        ]

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
