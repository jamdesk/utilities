import type { PlatformPreview } from '@/lib/og-platforms'
import { ImagePlaceholder } from './ImagePlaceholder'

const FONT = { fontFamily: 'system-ui, sans-serif' }

export function XCard({ p }: { p: PlatformPreview }) {
  if (p.cardType === 'summary') {
    return (
      <div className="flex overflow-hidden rounded-2xl border border-[#cfd9de] bg-white text-[#0f1419]" style={FONT}>
        <div className="h-[88px] w-[88px] shrink-0 border-r border-[#cfd9de] bg-[#f7f9f9]">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center gap-0.5 px-3 py-2">
          <span className="truncate text-[13px] text-[#536471]">{p.domain}</span>
          <span className="truncate text-[15px] font-medium">{p.title ?? p.domain}</span>
          {p.description && (
            <span className="line-clamp-1 text-[13px] text-[#536471]">{p.description}</span>
          )}
        </div>
      </div>
    )
  }
  return (
    <div style={FONT}>
      <div className="relative overflow-hidden rounded-2xl border border-[#cfd9de] bg-white">
        <div className="aspect-[1.91/1] bg-[#f7f9f9]">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <span className="absolute bottom-2 left-2 max-w-[85%] truncate rounded bg-black/70 px-1.5 py-0.5 text-[13px] text-white">
          {p.title ?? p.domain}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-[#536471]">From {p.domain}</p>
    </div>
  )
}
