/**
 * Site chrome components for rendering header/footer/consent HTML
 * from our own site-chrome API. Content is trusted (same-origin).
 */

interface SiteChromeProps {
  header: string
  footer: string
  css: string
  consent: string
}

/**
 * Renders the site chrome header with associated CSS.
 * Uses dangerouslySetInnerHTML because this is trusted content
 * served from our own site-chrome API endpoint.
 */
export function SiteChromeHeader({ header, css }: Pick<SiteChromeProps, 'header' | 'css'>) {
  return (
    <>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {header && (
        <div dangerouslySetInnerHTML={{ __html: header }} />
      )}
    </>
  )
}

/**
 * Renders the site chrome footer and consent banner.
 * Uses dangerouslySetInnerHTML because this is trusted content
 * served from our own site-chrome API endpoint.
 */
export function SiteChromeFooter({ footer, consent }: Pick<SiteChromeProps, 'footer' | 'consent'>) {
  return (
    <>
      {footer && (
        <div dangerouslySetInnerHTML={{ __html: footer }} />
      )}
      {consent && (
        <div dangerouslySetInnerHTML={{ __html: consent }} />
      )}
    </>
  )
}
