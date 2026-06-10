import type { PlatformPreview } from '@/lib/og-platforms'

export function IMessageCard({ p }: { p: PlatformPreview }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <div
        className="ml-auto max-w-[280px] overflow-hidden rounded-[18px] bg-[#e9e9eb]"
        style={{ fontFamily: '-apple-system, system-ui, sans-serif' }}
      >
        {p.imageUrl && (
          <div className="aspect-[1.91/1] bg-[#d1d1d6]">
            <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="px-3 py-2">
          <p className="line-clamp-2 text-[13px] font-semibold text-[#1c1c1e]">
            {p.title ?? p.domain}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-[#8e8e93]">{p.domain}</p>
        </div>
      </div>
    </div>
  )
}
