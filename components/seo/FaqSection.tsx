interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  items: FaqItem[]
}

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-lg border border-[#e8e4df] bg-white"
        >
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-[#1b3139] transition-colors hover:text-[#ff3621] [&::-webkit-details-marker]:hidden">
            <span className="pr-4 font-medium">{item.question}</span>
            <span
              className="shrink-0 text-[#5a6f77] transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="border-t border-[#e8e4df] px-5 py-4 text-sm leading-relaxed text-[#5a6f77]">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  )
}
