import { ImagePlaceholder } from './ImagePlaceholder'

/** Sized wrapper rendering the preview image or the platform-style gray placeholder. */
export function CardImage({ src, className }: { src?: string; className?: string }) {
  return (
    <div className={className}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <ImagePlaceholder />}
    </div>
  )
}
