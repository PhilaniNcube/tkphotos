## Copilot / AI Assistant Project Guide for `tkphotos`

Purpose: Give Copilot (and humans) the context + conventions needed to produce high‑quality, consistent contributions to this Next.js (App Router) + TypeScript + Tailwind (v4) + shadcn/ui project.

---
### 1. Project Snapshot
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4, utility-first; component primitives from `components/ui/*` (shadcn/ui variants)
- Icons: `lucide-react`
- Forms: `react-hook-form` + `zod` (validation)
- Date: `date-fns`
- Carousel: `embla-carousel-react`
- Charts: `recharts`
- Theming: `next-themes`
- Misc helpers: `clsx`, `class-variance-authority`, `tailwind-merge`
- Brand Color Theme: Yellow & Black. Primary accent: Yellow (placeholder `#FFC500` – adjust once palette finalized). Core dark/base: Near-black `#000000` or `#0A0A0A` for backgrounds. Maintain WCAG AA contrast; pair yellow mainly with dark backgrounds or black text on pale yellow tints.

Intended domain (placeholder—refine when domain clarified): A photo-oriented application (gallery / portfolio / management). Update this section once product scope is solid.

---
### 2. Repository Structure (Current)
```
app/              # Next.js App Router entrypoints (route segments, layouts, pages)
components/ui/    # Reusable presentational & interactive UI primitives (shadcn adjusted)
hooks/            # Reusable React hooks
lib/              # Utilities (pure functions, formatting, config helpers)
public/           # Static assets
```
Add feature-specific composites under `components/` (e.g. `components/gallery/`) or `app/(feature)/` when tightly coupled to a route.

---
### 3. Architectural Guidelines
1. Prefer Server Components by default; only mark files with `"use client"` when client interactivity or browser APIs are required.
2. Keep UI primitives dumb—push domain logic upward into server components or feature hooks.
3. Co-locate minor helpers (≤ ~30 LOC) with their component; move to `lib/` when reused.
4. Avoid large global state; lean on URL params / server data fetching. Introduce a state library only if a clear cross-cutting concern emerges.
5. Data Fetching: Use native `fetch` in Server Components with caching options (`{ cache: 'no-store' }` or `revalidate`) rather than external wrappers unless needed.
6. Accessibility: All interactive elements must have accessible names, focus states, keyboard navigation. Leverage Radix primitives which handle much of this; still test with keyboard.
7. Variants: When adding size / color / state style variants to a component, use `class-variance-authority` + `tailwind-merge` to compose classes safely.
8. Error Handling: Fail fast in server code (`throw new Error`) and surface user-friendly messages in client via boundary / toast (see `sonner`).
9. Performance: Split heavy client-only libs into dynamic imports (`dynamic(() => import('...'), { ssr: false })`) if they bloat initial bundle.
10. Images (once added): Use Next.js `<Image />` with proper `sizes` for responsive performance.

---
### 4. Coding Conventions
- TypeScript: No `any` unless absolutely necessary—use generics or `unknown` + narrowing.
- Exports: Prefer named exports. Default exports only for top-level route components (e.g. `app/page.tsx`).
- File Naming: `kebab-case` for files; React components PascalCase inside file if the file holds multiple exports.
- Props Interfaces: `type ComponentNameProps = { ... }` then `function ComponentName(props: ComponentNameProps) { ... }`.
- Styles: Only Tailwind utility classes + variant composition; avoid inline style objects except dynamic calculated values.
- Conditional Classes: `clsx` (or `cn` helper if defined) for readability.
- Form Schemas: Define `z.object({ ... })` next to the form or in a `schema.ts` and infer types (`z.infer<typeof schema>`).
- Keep components ≤ ~150 LOC; refactor if larger.

---
### 5. Accessibility & UX Checklist (AI should self-check)
- All interactive elements reachable by Tab.
- Visible focus outline (Tailwind ring or outline) not removed without replacement.
- Provide `aria-label` / `aria-describedby` where text not visible.
- Color contrast meets WCAG AA (Tailwind default grays normally OK—verify custom colors).
- Motion / animation: Avoid unnecessary infinite animations.

---
### 6. Performance Checklist
- Avoid adding `"use client"` at layout level; constrain to leaves.
- Memoize expensive computations in client components (`useMemo`, `useCallback`) only after measuring.
- Limit third-party dependencies; prefer native or existing utilities.
- Ensure tree-shakable imports (e.g., `import { X } from 'lucide-react'` not entire icon pack default export).

---
### 7. Adding a New UI Component (Pattern)
1. Create `components/ui/component-name.tsx` (or under feature directory).
2. Implement presentational logic + variants.
3. Export types.
4. Add story/docs (future step—storybook not yet configured; note in next steps section).
5. Add simple usage example in commit message or PR description.

---
### 8. Commit & PR Guidance
- Conventional style (light-weight): `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`, `test:`.
- One logical change per commit when practical.
- PR Description Template (short form):
  - Summary: (1–2 lines)
  - Motivation / Context
  - Changes
  - Screenshots (if UI)
  - Testing Notes
  - Accessibility Notes
  - Follow-ups

---
### 9. AI (Copilot Chat) Usage Guidelines
When requesting changes, ALWAYS provide:
1. File path(s)
2. Goal / intent (user story or outcome)
3. Constraints (performance, accessibility, API contracts)
4. Edge cases (list at least 2)

Prompt Patterns:
"Refactor `components/ui/button.tsx` to add a `loading` variant that shows a spinner and disables clicks. Keep API backward compatible. Provide tests or a test plan."
"Create a reusable gallery grid component in `components/gallery/gallery-grid.tsx` that supports variable column counts (responsive) and keyboard navigation."
"Add form validation to the signup form using zod + react-hook-form; show inline errors below each field."

What to Avoid in Prompts:
- Vague instructions ("Improve performance")—instead specify what metric or which route.
- Massive multi-purpose asks; break large tasks into sequential atomic steps.

AI Should (Self-Verification Checklist):
- Confirm no unrelated files modified.
- Run type check mentally (avoid missing imports, mismatched prop names).
- Maintain existing exports & public API unless explicit permission to change.
- Provide fallback / graceful degradation for optional data.

---
### 10. Product Requirements Document (PRD) Inline Template
Copy & adapt this for small / incremental features. For the full product PRD see `PRD_PHOTOGRAPHER_PORTFOLIO.md` (master document). Larger epics should add a short feature-specific section to that file instead of duplicating.

#### PRD: <Feature Name>
1. Objective
   - Single-sentence description of desired user outcome.
2. Background / Rationale
   - Why this matters (user pain / metric impact).
3. Scope
   - In Scope: bullet list
   - Out of Scope: bullet list
4. User Stories
   - As a [role], I want [action], so that [benefit].
5. UX Notes / Wireframe Links
   - (Link to design or quick ASCII / description)
6. Functional Requirements
   - FR1: ...
   - FR2: ...
7. Non-Functional Requirements
   - Performance (e.g., LCP < 2.5s route /gallery)
   - Accessibility (keyboard nav for gallery, ARIA roles...)
   - Security / Privacy (no PII in logs)
8. Data / API
   - Endpoints / shape / caching expectations
9. Edge Cases
   - Empty state
   - Error / network failure
   - Loading transitions
10. Success Metrics
   - e.g., Time-on-task, conversion, reduction in bounce
11. Rollout / Release Plan
   - Feature flag? Gradual? A/B test placeholder.
12. Open Questions
   - List & assign owner to resolve.

---
### 11. Edge Case Catalogue (Generic)
- Empty collections (show placeholder UI asset from `public/` soon)
- Network failure (retry or toast error)
- Slow loading (skeleton components in `components/ui/skeleton.tsx` already available)
- Mobile viewport (use `use-mobile` hook if behavior diverges)
- High contrast / dark mode (verify theming classes applied)

---
### 12. Future Enhancements (Backlog Seeds)
- Add Storybook for component documentation.
- Introduce Playwright or Vitest + React Testing Library for smoke tests.
- Implement image optimization & gallery domain logic.
- Introduce logging & analytics abstraction.
- Internationalization (i18n) foundation.

---
### 13. Quick Quality Gate (Manual) Before PR
- Types: `pnpm typecheck` (add script alias if needed)
- Lint: `pnpm lint`
- Local run: `pnpm dev` – verify pages load w/o errors
- Accessibility spot-check: keyboard nav + basic screen reader labels

---
### 14. Tailwind / Styling Patterns
- Prefer composable utility classes over deep custom CSS.
- Use `@layer` only for base resets or tokens (keep minimal).
- For animations, prefer Tailwind's `animate-*` or small keyframes; avoid large libraries.
- Brand Colors Usage:
  - Primary CTA buttons, active nav indicator, highlight accents: brand yellow.
  - Backgrounds predominantly neutral (black / near-black) to let photography pop.
  - Avoid large solid yellow backgrounds behind large image collections (visual noise, contrast risk).
  - Provide hover/focus states by darkening yellow slightly (e.g., `#E5B300`) or adding ring offset.
  - Ensure text on yellow meets contrast (use black text; avoid gray-on-yellow).

---
### 15. Decision Log (Record notable architectural choices here)
| Date | Decision | Context | Alternatives | Outcome |
|------|----------|---------|--------------|---------|
| 2025-08-15 | Established AI guidance file | Bootstrapping clarity | Ad-hoc knowledge spread | Central reference |
| 2025-08-15 | Added standalone comprehensive PRD | Need detailed product scope | Keep only inline template | Clear separation of master PRD vs feature templates |

Append new rows as decisions are made.

---
### 16. Maintaining This File
Update when: stack adds lib, architectural decision changes folder patterns, or process adjustments (testing, CI). Keep concise—prune obsolete sections.

---
End of Copilot Instructions.
