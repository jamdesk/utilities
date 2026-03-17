export function DefaultFooter() {
  return (
    <footer className="border-t border-[#2a2640] bg-[#13111a]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-[#4a4858] sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-1">
          <span>Built by</span>
          <a
            href="https://www.jamdesk.com"
            className="text-[#6b6b78] transition-colors hover:text-[#e0e0e4]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jamdesk
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/jamdesk/jamdesk-utilities"
            className="text-[#6b6b78] transition-colors hover:text-[#e0e0e4]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source on GitHub
          </a>
          <span className="text-[#2a2640]" aria-hidden="true">
            |
          </span>
          <span>Apache 2.0</span>
        </div>
      </div>
    </footer>
  )
}
