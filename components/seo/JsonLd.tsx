/**
 * Generic JSON-LD wrapper for emitting structured data from a static schema object.
 * Content is safe — built from our own static data, not user input.
 *
 * This is the single permitted home for `dangerouslySetInnerHTML` in this project —
 * `JsonLdScript.tsx` delegates here so the escape rule lives in one place. Don't
 * introduce a second usage; route any new page-level JSON-LD through this wrapper.
 *
 * `</script>` escape is defense-in-depth: HTML parsers terminate a script tag on
 * a literal `</script>` anywhere in its body, including inside a JSON string.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/<\/script/gi, '<\\/script'),
      }}
    />
  )
}
