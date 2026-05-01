# Next.js 16 + React 19 Upgrade Plan

> Scope: update the existing Bun-based Next.js app dependencies and keep build, lint, and e2e tests passing. No feature work in this migration.

## Current State

- Runtime/package manager: Bun
- App framework: Next.js 14 App Router
- UI runtime: React 18 / React DOM 18
- Styling: Tailwind CSS 3
- Tests: Playwright e2e via `bunx playwright test`
- Linting: ESLint CLI via `bun run lint`

Known baseline issue before the framework bump:

- `bun run build` fails on `app/page.tsx` because the TypeScript config does not target ES2015+ iteration semantics for `Set`.

## Target State

- Next.js 16
- React 19
- React DOM 19
- Matching React type packages
- Matching `eslint-config-next`
- Bun lockfile refreshed with `bun install`
- `bun run build`, `bun run lint`, and `bun run test:e2e` passing

## Non-Goals

- Do not redesign UI.
- Do not add new product features.
- Do not change the data model.
- Do not migrate Tailwind versions unless Next/React compatibility requires it.
- Do not replace Bun with npm, pnpm, or yarn.

## Migration Steps

1. Create a clean checkpoint.
   - Commit or stash the existing Next.js + Bun migration first.
   - Keep the dependency bump in its own commit so upgrade fallout is easy to inspect.

2. Fix the baseline build before upgrading.
   - Preferred fix: add an explicit ES2015+ `target` in `tsconfig.json`, such as `ES2017`.
   - Alternative fix: replace `[...new Set(vals)]` with `Array.from(new Set(vals))`.
   - Verify with `bun run build`.

3. Update dependency declarations.
   - Update `next` to the latest stable `16.x`.
   - Update `react` and `react-dom` to the latest stable `19.x`.
   - Update `@types/react` and `@types/react-dom` to matching `19.x` packages.
   - Update `eslint-config-next` to match the Next.js major version.

4. Refresh dependencies with Bun.
   - Run `bun install`.
   - Keep `bun.lock` as the source of truth.
   - If Bun extraction fails, retry after clearing Bun's install cache rather than switching package managers.

5. Run official codemods only where applicable.
   - `next lint` has already been migrated to `eslint .`.
   - This app currently does not use the common high-risk upgrade APIs: `cookies`, `headers`, middleware/proxy, dynamic route `params`, custom webpack config, or `next/image`.
   - If new warnings appear after installing Next 16, run the relevant `@next/codemod` transform with Bun and review the diff before keeping it.

6. Verify locally.
   - `bun run lint`
   - `bun run build`
   - `bun run test:e2e`

7. Update docs after verification.
   - Change README and SPEC tech stack references from Next.js 14 / React 18 to Next.js 16 / React 19 only after all verification commands pass.
   - Note any migration caveats in this file if they affect future upgrades.

## Suggested Commands

```bash
# Baseline checks
bun run lint
bun run build

# Dependency edit can be manual in package.json, then:
bun install

# Optional codemod entrypoint, only when a specific migration applies:
bunx @next/codemod@canary <transform> .

# Final verification
bun run lint
bun run build
bun run test:e2e
```

## Risk Notes

- Next.js 16 expects the modern ESLint CLI flow, not `next lint`.
- React 19 can expose stricter type behavior through `@types/react`.
- The app is mostly client-side UI and static TypeScript data, so the upgrade should be relatively low-risk once the package install is stable.
- Google Fonts optimization may warn during builds if network access is unavailable; that is separate from the framework migration unless it becomes a hard build failure.
