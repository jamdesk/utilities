import type { Tool } from '@/lib/tools'
import { REPO_URL, LICENSE_URL, ORG_NAME, ORG_URL } from '@/lib/site'

interface OpenSourceNoteProps {
  heading?: string
  /** When provided, the opening sentence names the specific tool ("The MDX Viewer is free…") instead of the collection. */
  tool?: Tool
}

export function OpenSourceNote({ heading, tool }: OpenSourceNoteProps) {
  const resolvedHeading = heading ?? (tool ? 'About this tool' : 'About these tools')
  const subject = tool ? tool.seoSubject : `${ORG_NAME} Utilities`
  const isVerb = tool ? 'is' : 'are'
  const runsVerb = tool ? 'runs' : 'run'
  return (
    <>
      <h2 className="mb-4 font-heading text-2xl font-bold text-foreground [text-wrap:balance]">
        {resolvedHeading}
      </h2>
      <p className="leading-relaxed text-muted-foreground">
        {subject} {isVerb} free and open source, and {runsVerb} entirely in your
        browser. Your input is never uploaded, stored, or logged — you can verify
        this by opening the network tab in your browser developer tools while the
        tool runs. The full source code is on{' '}
        <a
          href={REPO_URL}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{' '}
        under the{' '}
        <a
          href={LICENSE_URL}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apache 2.0 license
        </a>
        , so you can read the code, file issues, or fork the project. There are
        no ads, no accounts, and no usage limits. Built and maintained by{' '}
        <a
          href={ORG_URL}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ORG_NAME}
        </a>
        .
      </p>
    </>
  )
}
