import type { PlatformPreview } from '@/lib/og-platforms'

export function WhatsAppCard({ p }: { p: PlatformPreview }) {
  return (
    <div className="rounded-lg bg-[#efeae2] p-3" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="ml-auto max-w-[300px] rounded-lg bg-[#d9fdd3] p-1 shadow-sm">
        <div className="overflow-hidden rounded-md bg-[#d1f0c8]">
          {p.imageUrl && (
            <div className="aspect-[1.91/1]">
              <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="px-2 py-1.5">
            <p className="line-clamp-2 text-[13px] font-medium text-[#111b21]">
              {p.title ?? p.domain}
            </p>
            {p.description && (
              <p className="line-clamp-2 text-[12px] text-[#54656f]">{p.description}</p>
            )}
            <p className="mt-0.5 truncate text-[11px] text-[#54656f]">{p.domain}</p>
          </div>
        </div>
        <p className="truncate px-1 pt-1 text-[13px] text-[#027eb5]">{p.domain}</p>
      </div>
    </div>
  )
}
