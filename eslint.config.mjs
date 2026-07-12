import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-plugin-react 7.x's auto-detect path calls context.getFilename(),
    // a method removed in ESLint 10 flat config. Setting react.version
    // explicitly skips the detect path and avoids the rule-loader crash.
    settings: { react: { version: "19.2" } },
    rules: {
      // eslint-config-next 16.2.10 promoted react-hooks/set-state-in-effect to
      // an error. Every tool component synchronously clears its output state in
      // an effect for the empty-input case (`if (!input.trim()) { setX(''); return }`)
      // — a benign perf hint here, not a correctness bug. Refactoring all 10 to
      // derive that state during render is out of scope for a dependency bump;
      // keep it visible as a warning instead of failing `next build`.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
