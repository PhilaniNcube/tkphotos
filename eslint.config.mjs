import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      // The existing UI predates these stylistic rules; keep them visible as
      // warnings without blocking `pnpm lint`.
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  {
    files: ["scripts/**/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "scripts/migrate/data/**",
    "migrations/**",
    "payload-types.ts",
    "next-env.d.ts",
  ]),
]);
