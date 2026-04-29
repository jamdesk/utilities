'use client'

import dynamic from 'next/dynamic'

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

interface ToolEditorProps {
  slug: string
}

export function ToolEditor({ slug }: ToolEditorProps) {
  return (
    <div className="flex min-h-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      {slug === 'mdx-formatter' && <MdxFormatter />}
      {slug === 'mdx-validator' && <MdxValidator />}
      {slug === 'mdx-viewer' && <MdxViewer />}
      {slug === 'mdx-to-markdown' && <MdxToMarkdown />}
      {slug === 'markdown-to-html' && <MdToHtml />}
      {slug === 'html-to-mdx' && <HtmlToMdx />}
      {slug === 'yaml-validator' && <YamlValidator />}
      {slug === 'json-yaml-converter' && <JsonYamlConverter />}
      {slug === 'markdown-table-generator' && <TableGenerator />}
    </div>
  )
}
