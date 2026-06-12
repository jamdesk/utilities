'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

const MdxFormatter = dynamic(
  () => import('@/components/tools/MdxFormatter').then((m) => m.MdxFormatter),
  { ssr: false }
)
const MdxValidator = dynamic(
  () => import('@/components/tools/MdxValidator').then((m) => m.MdxValidator),
  { ssr: false }
)
const MdxViewer = dynamic(
  () => import('@/components/tools/MdxViewer').then((m) => m.MdxViewer),
  { ssr: false }
)
const MdxToMarkdown = dynamic(
  () =>
    import('@/components/tools/MdxToMarkdown').then((m) => m.MdxToMarkdown),
  { ssr: false }
)
const MdToHtml = dynamic(
  () => import('@/components/tools/MdToHtml').then((m) => m.MdToHtml),
  { ssr: false }
)
const HtmlToMdx = dynamic(
  () => import('@/components/tools/HtmlToMdx').then((m) => m.HtmlToMdx),
  { ssr: false }
)
const YamlValidator = dynamic(
  () =>
    import('@/components/tools/YamlValidator').then((m) => m.YamlValidator),
  { ssr: false }
)
const JsonYamlConverter = dynamic(
  () =>
    import('@/components/tools/JsonYamlConverter').then(
      (m) => m.JsonYamlConverter
    ),
  { ssr: false }
)
const TableGenerator = dynamic(
  () => import('@/components/tools/TableGenerator').then((m) => m.TableGenerator),
  { ssr: false }
)
const OgPreview = dynamic(
  () => import('@/components/tools/OgPreview').then((m) => m.OgPreview),
  { ssr: false }
)
const MermaidEditor = dynamic(
  () => import('@/components/tools/MermaidEditor').then((m) => m.MermaidEditor),
  { ssr: false }
)

const COMPONENTS: Record<string, ComponentType> = {
  'mdx-formatter': MdxFormatter,
  'mdx-validator': MdxValidator,
  'mdx-viewer': MdxViewer,
  'mdx-to-markdown': MdxToMarkdown,
  'markdown-to-html': MdToHtml,
  'html-to-mdx': HtmlToMdx,
  'yaml-validator': YamlValidator,
  'json-yaml-converter': JsonYamlConverter,
  'markdown-table-generator': TableGenerator,
  'opengraph-preview': OgPreview,
  'mermaid-editor': MermaidEditor,
}

interface ToolEditorProps {
  slug: string
}

export function ToolEditor({ slug }: ToolEditorProps) {
  // The editor tools need a tall panel up front; the OG preview starts as a
  // single input row and grows once results arrive.
  const minHeight = slug === 'opengraph-preview' ? '' : 'min-h-[400px] '
  const Component = COMPONENTS[slug]
  return (
    <div className={`flex ${minHeight}flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_16px_rgba(0,0,0,0.06)]`}>
      {Component ? <Component /> : null}
    </div>
  )
}
