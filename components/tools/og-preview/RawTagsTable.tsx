import type { RawTag } from '@/lib/og-types'

export function RawTagsTable({ tags }: { tags: RawTag[] }) {
  if (tags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No Open Graph, Twitter, or standard metadata tags were detected on this page.
      </p>
    )
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-3 py-2 font-medium">Tag</th>
            <th className="px-3 py-2 font-medium">Content</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tags.map((tag, i) => (
            <tr key={i} className="bg-card align-top">
              <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-foreground">{tag.name}</td>
              <td className="break-all px-3 py-2 font-mono text-xs text-muted-foreground">{tag.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
