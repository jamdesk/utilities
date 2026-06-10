import type { PlatformPreview } from '@/lib/og-platforms'
import { ImagePlaceholder } from './ImagePlaceholder'

export function LinkedInCard({ p }: { p: PlatformPreview }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="aspect-[1.91/1] bg-[#eef3f8]">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="px-3 py-2">
        <p className="line-clamp-2 text-[14px] font-semibold text-black/90">{p.title ?? p.domain}</p>
        <p className="mt-1 truncate text-[12px] text-black/60">{p.domain}</p>
      </div>
    </div>
  )
}
