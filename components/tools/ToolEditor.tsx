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

interface ToolEditorProps {
  slug: string
}

export function ToolEditor({ slug }: ToolEditorProps) {
  return (
    <div className="flex min-h-[400px] flex-col overflow-hidden rounded-xl border border-[#e8e4df] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      {slug === 'mdx-formatter' && <MdxFormatter />}
      {slug === 'mdx-validator' && <MdxValidator />}
      {slug === 'mdx-viewer' && <MdxViewer />}
      {slug === 'mdx-to-markdown' && <MdxToMarkdown />}
    </div>
  )
}
