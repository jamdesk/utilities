# Bundled OG fonts (build-time only)

Used by `scripts/generate-og.ts` to render `public/og/*.png` deterministically
on every machine and on Vercel (whose build image ships no system fonts).
These are NOT served to users (not under `public/`).

| File | Family | Source | License |
|------|--------|--------|---------|
| Inter-Regular.ttf, Inter-Bold.ttf | Inter (static) | github.com/rsms/inter release `extras/ttf` | SIL OFL 1.1 (OFL-Inter.txt) |
| NotoEmoji-Regular.ttf | Noto Emoji (monochrome) | google/fonts `ofl/notoemoji/NotoEmoji[wght].ttf`, instanced to static wght=400 via fonttools | SIL OFL 1.1 (OFL-NotoEmoji.txt) |

Note: `⇄` (U+21C4, the JSON↔YAML icon) is absent from both Inter and Noto Emoji, so
`scripts/generate-og.ts` renders it from an inline monochrome SVG (`SYMBOL_SVGS`).

Regenerate the OG images after changing a tool name/description/icon:
`npx tsx scripts/generate-og.ts`
