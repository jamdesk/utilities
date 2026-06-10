import type { PlatformPreview } from '@/lib/og-platforms'

export function SlackCard({ p }: { p: PlatformPreview }) {
  return (
    <div
      className="flex rounded-lg border border-[#e2e2e2] bg-white p-3"
      style={{ fontFamily: 'Lato, system-ui, sans-serif' }}
    >
      <div className="w-1 shrink-0 rounded-full bg-[#dddddd]" />
      <div className="min-w-0 flex-1 pl-3">
        <div className="flex items-center gap-1.5">
          {p.faviconUrl && <img src={p.faviconUrl} alt="" className="h-4 w-4 rounded" />}
          <span className="truncate text-[15px] font-bold text-[#1d1c1d]">
            {p.siteName ?? p.domain}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[15px] font-bold text-[#1264a3]">
          {p.title ?? p.domain}
        </p>
        {p.description && (
          <p className="mt-0.5 line-clamp-2 text-[15px] text-[#1d1c1d]">{p.description}</p>
        )}
        {p.imageUrl && (
          <img src={p.imageUrl} alt="" className="mt-2 max-h-40 w-full rounded-lg object-cover" />
        )}
      </div>
    </div>
  )
}
