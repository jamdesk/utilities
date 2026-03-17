export function DefaultFooter() {
  return (
    <footer className="bg-[#1b3139]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-sm text-[#8fa8b3] sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-1">
          <span>Built by</span>
          <a
            href="https://www.jamdesk.com"
            className="text-[#c5d3d9] transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jamdesk
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/jamdesk/jamdesk-utilities"
            className="text-[#c5d3d9] transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source on GitHub
          </a>
          <span className="text-[#3a5563]" aria-hidden="true">
            |
          </span>
          <span>Apache 2.0</span>
        </div>
      </div>
    </footer>
  )
}
