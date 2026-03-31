export function DefaultFooter() {
  return (
    <footer className="bg-footer-bg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-sm text-footer-muted sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-1">
          <span>Built by</span>
          <a
            href="https://www.jamdesk.com"
            className="text-footer-text transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jamdesk
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.jamdesk.com/blog"
            className="text-footer-text transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <span className="text-footer-separator" aria-hidden="true">|</span>
          <a
            href="https://jamdesk.com/docs"
            className="text-footer-text transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
          <span className="text-footer-separator" aria-hidden="true">|</span>
          <a
            href="https://github.com/jamdesk/jamdesk-utilities"
            className="text-footer-text transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="text-footer-separator" aria-hidden="true">|</span>
          <span>Apache 2.0</span>
        </div>
      </div>
    </footer>
  )
}
