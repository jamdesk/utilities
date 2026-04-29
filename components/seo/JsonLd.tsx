/**
 * Generic JSON-LD wrapper for emitting structured data from a static schema object.
 * Content is safe — built from our own static data, not user input.
 *
 * Together with `JsonLdScript.tsx`, this is one of the only two files in the project
 * permitted to use `dangerouslySetInnerHTML`. Don't introduce a third — reuse this
 * wrapper for any new page-level JSON-LD.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
