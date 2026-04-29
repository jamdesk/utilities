import { REPO_URL } from '@/lib/site'

interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  items: FaqItem[]
}

const REPO_LABEL = REPO_URL.replace(/^https?:\/\//, '')

// Render the answer string with the repo URL turned into a clickable link.
// The underlying string is kept as-is so the FAQPage JSON-LD answer.text stays
// valid plain text (AI assistants quote it directly).
function renderAnswer(answer: string) {
  const idx = answer.indexOf(REPO_LABEL)
  if (idx === -1) return answer
  return (
    <>
      {answer.slice(0, idx)}
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline-offset-2 hover:underline"
      >
        {REPO_LABEL}
      </a>
      {answer.slice(idx + REPO_LABEL.length)}
    </>
  )
}

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-lg border border-border bg-card"
        >
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
            <span className="pr-4 font-medium">{item.question}</span>
            <span
              className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            {renderAnswer(item.answer)}
          </div>
        </details>
      ))}
    </div>
  )
}
