import type { PlatformPreview } from '@/lib/og-platforms'

export function GoogleSerpCard({ p }: { p: PlatformPreview }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1f3f4]">
          {p.faviconUrl ? (
            <img src={p.faviconUrl} alt="" className="h-[18px] w-[18px]" />
          ) : (
            <span className="text-[10px] text-[#5f6368]">●</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] text-[#202124]">{p.siteName ?? p.domain}</p>
          <p className="truncate text-[12px] text-[#4d5156]">{p.domain}</p>
        </div>
      </div>
      <p className="mt-1.5 line-clamp-1 text-[20px] leading-relaxed text-[#1a0dab]">
        {p.title ?? p.domain}
      </p>
      {p.description && (
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[#474747]">{p.description}</p>
      )}
    </div>
  )
}
