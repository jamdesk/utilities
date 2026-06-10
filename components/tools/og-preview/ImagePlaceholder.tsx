import { ImageIcon } from 'lucide-react'

/** Gray no-image state, matching how platforms render cards whose image is missing */
export function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#e8ebed] text-[#8899a6]">
      <ImageIcon className="h-6 w-6" aria-hidden />
    </div>
  )
}
