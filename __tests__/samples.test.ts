import { describe, it, expect } from 'vitest'
import { tools } from '../lib/tools'
import {
  formatterSample,
  validatorSample,
  viewerSample,
  mdxToMarkdownSample,
  mdToHtmlSample,
  htmlToMdxSample,
  yamlValidatorSample,
  jsonYamlSample,
  tableSample,
  ogPreviewSample,
  mermaidSample,
} from '../lib/samples'

const sampleMap: Record<string, string> = {
  'mdx-formatter': formatterSample,
  'mdx-validator': validatorSample,
  'mdx-viewer': viewerSample,
  'mdx-to-markdown': mdxToMarkdownSample,
  'markdown-to-html': mdToHtmlSample,
  'html-to-mdx': htmlToMdxSample,
  'yaml-validator': yamlValidatorSample,
  'json-yaml-converter': jsonYamlSample,
  'markdown-table-generator': tableSample,
  'mermaid-editor': mermaidSample,
  'opengraph-preview': ogPreviewSample,
}

describe('sample content', () => {
  it('has a sample for each tool', () => {
    for (const tool of tools) {
      expect(sampleMap[tool.slug]).toBeDefined()
      expect(sampleMap[tool.slug].length).toBeGreaterThan(0)
    }
  })

  it('formatter sample contains frontmatter', () => {
    expect(formatterSample).toContain('---')
    expect(formatterSample).toMatch(/title:/)
  })

  it('viewer sample contains JSX components', () => {
    expect(viewerSample).toContain('<Callout')
    expect(viewerSample).toContain('<ApiEndpoint')
    expect(viewerSample).toContain('<CodeBlock')
    expect(viewerSample).toContain('<Tab')
  })

  it('mdx-to-markdown sample contains imports', () => {
    expect(mdxToMarkdownSample).toContain('import {')
    expect(mdxToMarkdownSample).toContain("from '@/components/")
  })

  it('validator sample contains code blocks', () => {
    expect(validatorSample).toContain('```tsx')
    expect(validatorSample).toContain('```js')
  })

  it('all samples are non-trivial (>100 chars)', () => {
    for (const [slug, sample] of Object.entries(sampleMap)) {
      // The OG preview sample is a URL, not document content
      if (slug === 'opengraph-preview') continue
      expect(sample.length).toBeGreaterThan(100)
    }
  })
})
