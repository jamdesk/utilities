// Validates JSON-LD schemas on a rendered page.
// Usage: node scripts/check-schemas.mjs <url> <comma,separated,required,@types>
// Exits non-zero if any required schema is missing or any payload is malformed.
const url = process.argv[2]
const requiredTypes = process.argv[3]?.split(',') ?? []

const html = await fetch(url).then((r) => r.text())
const matches = [
  ...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  ),
]
if (matches.length === 0) {
  console.error(`FAIL: no JSON-LD found at ${url}`)
  process.exit(1)
}

const types = new Set()
for (const [, payload] of matches) {
  try {
    const parsed = JSON.parse(payload)
    types.add(parsed['@type'])
  } catch (e) {
    console.error(`FAIL: malformed JSON-LD at ${url}: ${e.message}`)
    process.exit(1)
  }
}

const missing = requiredTypes.filter((t) => !types.has(t))
if (missing.length > 0) {
  console.error(`FAIL: missing schemas at ${url}: ${missing.join(', ')}`)
  console.error(`  found: ${[...types].join(', ')}`)
  process.exit(1)
}
console.log(`OK: ${url} has [${[...types].join(', ')}]`)
