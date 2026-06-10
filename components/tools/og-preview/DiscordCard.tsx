import type { PlatformPreview } from '@/lib/og-platforms'

export function DiscordCard({ p }: { p: PlatformPreview }) {
  return (
    <div className="rounded-lg bg-[#2b2d31] p-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="flex max-w-[432px] overflow-hidden rounded-[4px] bg-[#1e1f22]">
        <div className="w-1 shrink-0" style={{ backgroundColor: p.themeColor ?? '#3f4147' }} />
        <div className="min-w-0 flex-1 p-3">
          {p.siteName && <p className="truncate text-xs text-[#b5bac1]">{p.siteName}</p>}
          <p className="mt-1 line-clamp-2 text-[15px] font-semibold text-[#00a8fc]">
            {p.title ?? p.domain}
          </p>
          {p.description && (
            <p className="mt-1 line-clamp-3 text-[14px] text-[#dbdee1]">{p.description}</p>
          )}
          {p.imageUrl && (
            <img src={p.imageUrl} alt="" className="mt-3 w-full rounded object-cover" />
          )}
        </div>
      </div>
    </div>
  )
}
