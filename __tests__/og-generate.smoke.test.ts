import { describe, it, expect } from 'vitest'
import { execFileSync } from 'child_process'
import { mkdtempSync, existsSync, statSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { expectedOgSlugs } from '../scripts/generate-og'

// Resolve the repo root from THIS file so the spawned script finds scripts/fonts
// (it reads them relative to process.cwd()) regardless of where vitest is invoked
// from — otherwise a wrong cwd silently triggers the no-font fallback.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('OG generation smoke', () => {
  it('generates all OG PNGs with bundled fonts (real render, not the no-font fallback)', () => {
    const out = mkdtempSync(join(tmpdir(), 'og-smoke-'))
    // Use the LOCAL tsx binary, not `npx` — npx may be absent from PATH in a
    // minimal CI shell (ENOENT) and can probe the network. tsx is a
    // devDependency, so node_modules/.bin/tsx is always present after install.
    const tsxBin = join(repoRoot, 'node_modules', '.bin', 'tsx')
    const stdout = execFileSync(tsxBin, ['scripts/generate-og.ts'], {
      cwd: repoRoot,
      env: { ...process.env, OG_OUT_DIR: out },
      stdio: 'pipe',
    }).toString()
    // The no-font fallback returns BEFORE printing "Done." — asserting the line
    // proves the bundled fonts loaded and real generation ran (not the fallback).
    expect(stdout).toContain('Done.')
    for (const slug of expectedOgSlugs()) {
      const path = join(out, `${slug}.png`)
      expect(existsSync(path), `${slug}.png not generated`).toBe(true)
      expect(statSync(path).size, `${slug}.png too small`).toBeGreaterThan(5_000)
    }
  }, 120_000) // generous: process spinup + 14 native renders on a contended CI box
})
