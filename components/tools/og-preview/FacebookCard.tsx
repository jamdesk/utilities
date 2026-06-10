import type { PlatformPreview } from '@/lib/og-platforms'
import { CardImage } from './CardImage'

export function FacebookCard({ p }: { p: PlatformPreview }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-[#dadde1] bg-white"
      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
    >
      <CardImage src={p.imageUrl} className="aspect-[1.91/1] bg-[#f0f2f5]" />
      <div className="border-t border-[#dadde1] bg-[#f0f2f5] px-3 py-2.5">
        <p className="truncate text-[13px] text-[#606770]">{p.domain}</p>
        <p className="mt-0.5 line-clamp-2 text-[17px] font-semibold leading-snug text-[#1d2129]">
          {p.title ?? p.domain}
        </p>
        {p.description && (
          <p className="mt-0.5 line-clamp-1 text-[15px] text-[#606770]">{p.description}</p>
        )}
      </div>
    </div>
  )
}
