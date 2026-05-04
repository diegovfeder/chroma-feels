# Tasks: Single-Screen Focus Pass

Atomic tasks for the spec at `./spec.md`, grounded in `./design.md`. `[P]` = safe to run in parallel.

## Dependency graph

```
T1 (chassis)        ─┐
T2 (type scale)     ─┼─► T3 (replace [Npx]) ─┐
                                              ├─► T8 (CW tab) ──┐
T4 (wheel labels)   ─┐                        │                  │
                     ├─► T5 (wheel rotation) ─┘                  ├─► T11 (verify)
                                                                  │
T6 (Lang tab) [P]    ───────────────────────────────────────────►│
T7 (Psych tab) [P]   ───────────────────────────────────────────►│
T9 (Fiction tab) [P] ───────────────────────────────────────────►│
T10 (mobile pass)    ───────────────────────────────────────────►┘
```

T6/T7/T9 are independent of each other and the wheel changes — can land in any order or in parallel.

---

## T1. Layout chassis: viewport-locked grid

- **What:** Restructure root to grid `auto 1fr auto`; lock to `100dvh` on `md:` and up; mobile remains scrollable.
- **Where:** `app/page.tsx` outermost wrapper; `app/globals.css` for `overscroll-behavior: contain`.
- **Done when:**
  - Root `<div>` uses `grid grid-rows-[auto_1fr_auto] md:h-dvh md:overflow-hidden`.
  - Main content wrapper has `min-h-0`.
  - `globals.css` adds `html, body { height: 100%; overscroll-behavior: contain; }`.
  - `globals.css` adds explicit `font-size: 16px; line-height: 1.5;` on `html`.
- **Reuses:** existing classes `min-h-screen`, `bg-[#0a0a0c]`, `text-[#e0e0e0]` — only the structural wrapper changes.
- **Tests:** load page in dev → no body scrollbar at 1440×900; resize to 390×844 → page scrolls.
- **Gate:** `bun run build` passes.

## T2. Tailwind type scale extension

- **What:** Extend `theme.fontSize` per design.md §2 (adds `2xs`; reaffirms defaults explicitly).
- **Where:** `tailwind.config.js`.
- **Done when:** `2xs` (11px), and the standard scale through `3xl` are explicitly declared with their line-heights.
- **Independent of T1** (config-only change).
- **Gate:** `bun run build` passes; no Tailwind warnings.

## T3. Replace arbitrary `text-[Npx]` classes site-wide

- **What:** 38 instances across 6 files → semantic tokens per design.md §2 mapping table.
- **Where:** `app/page.tsx`, `components/{ColorStrip,CultureTags,LanguageCard,PsychRow,FictionSystem}.tsx`.
- **Mapping:**
  - `text-[9px]` → `text-2xs`
  - `text-[10px]` → `text-xs`
  - `text-[11px]` → `text-sm`
  - `text-[17px]` → `text-lg`
  - `text-[26px]` → `text-2xl`
- **Depends on:** T2 (the new tokens must exist).
- **Done when:** `grep -r "text-\[" app/ components/` returns 0 matches.
- **Gate:** `bun run build` passes; manual visual check that hierarchy is preserved (uppercase micro-labels still smaller than body).

## T4. EmotionWheel — larger SVG labels  `[P]`

- **What:** Bump SVG `fontSize` for slice labels and center text per spec R3.
- **Where:** `components/EmotionWheel.tsx` lines 132 and 148–151.
- **Done when:**
  - Slice label `fontSize="6"` → `fontSize="11"`.
  - Center text `fontSize="7.5"` (both lines) → `fontSize="13"`.
  - Selected slice gets `fontWeight: 500` via inline style or new class.
- **Independent of T1/T2/T3.**
- **Gate:** `bun run build`; visual smoke — labels readable at 1280×900.

## T5. EmotionWheel — snap-rotate on click

- **What:** Wrap slices in a rotation group; compute target angle on selection; CSS transition for the snap.
- **Where:** `components/EmotionWheel.tsx`.
- **Done when:**
  - Local state `wheelRotation` exists.
  - Selecting an emotion sets rotation to `-((mid + π/2) * 180/π)`, normalized to shortest path.
  - Re-selecting (deselecting) sets rotation to `0`.
  - Slices live inside a single `<g transform="rotate(...)">` with CSS `transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Center group + decorative rings stay **outside** the rotation group.
  - Color filter (`activeColor`) does not affect rotation.
- **Depends on:** T4 (same file, easier to land in order).
- **Tests:** manual — click 4 different slices, each lands at top with overshoot; click selected slice, wheel returns to origin.
- **Gate:** `bun run build`; manual interaction smoke.

## T6. Color Language tab — fit-viewport 2-col  `[P]`

- **What:** Restructure the Color Language tab to a 2-col grid on `md:` with internal scroll on the right column.
- **Where:** `app/page.tsx` (Color Language render block).
- **Done when:**
  - Color picker becomes vertical-ish on `md:` (left col, ~30%); horizontal on mobile.
  - Etymology + expressions + filtered emotions live in right col with `min-h-0 overflow-y-auto`.
  - At 1280×900 desktop: no body scroll regardless of which color is selected.
- **Independent of T1/T2/T3** (but T1 must land for the chassis to honor the locked viewport).
- **Gate:** manual desktop + mobile smoke.

## T7. Psychology tab — internal scroll  `[P]`

- **What:** Wrap the psych emotion list in an internal scroll container; section header stays put.
- **Where:** `app/page.tsx` (Psychology render block).
- **Done when:**
  - List wrapper is `flex-1 min-h-0 overflow-y-auto`.
  - Expanded row state is preserved on scroll.
  - At 1280×900: no body scroll.
- **Independent of others.**
- **Gate:** manual smoke.

## T8. Cultural Wheel tab — 2-col layout, wheel as anchor

- **What:** Restructure the Wheel tab to a 2-col grid; wheel left, detail right with internal scroll; placeholder copy when nothing selected.
- **Where:** `app/page.tsx` (Cultural Wheel render block).
- **Done when:**
  - Color filter strip stays full-width above the grid.
  - Below: 2-col grid (`md:grid-cols-[3fr_2fr]` or similar) at `md:` and up.
  - Wheel column: centered `<EmotionWheel>`, `aspect-ratio: 1`, capped so it never overflows vertically.
  - Detail column: existing emotion detail markup wrapped in `min-h-0 overflow-y-auto`.
  - When `!selected`: detail column shows a single-line prompt — *"Click a slice to read across cultures."*
  - Mobile: stack — color strip / wheel / detail.
- **Depends on:** T1 (chassis must exist), T3 (typography), T5 (rotation interaction lands here visually).
- **Gate:** manual desktop + mobile smoke; the wheel must be the visual anchor at 1280×900.

## T9. Fiction tab — 2-col layout  `[P]`

- **What:** Restructure to 2-col on `md:`; mappings list scrolls internally.
- **Where:** `app/page.tsx` (Fiction render block).
- **Done when:**
  - Universe selector + system description + character byline in left col.
  - Mappings + insight in right col with `min-h-0 overflow-y-auto`.
  - Green Lantern's 9 mappings + insight box do not push body scroll at 1280×900.
- **Independent of others** (but visually benefits from T1+T3).
- **Gate:** manual desktop smoke specifically with Green Lantern (9 entries, the worst case).

## T10. Mobile responsive pass

- **What:** Verify all 4 tabs at 390×844 viewport; fix anything that broke during desktop-first restructuring.
- **Where:** Mostly `app/page.tsx` — confirm `md:` prefixes are placed correctly so the layout falls back to stacked mobile.
- **Done when:**
  - Each tab is fully usable at 390×844 with page scroll allowed.
  - No horizontal scrollbar.
  - Wheel scales to viewport width.
  - Tab buttons do not overflow their row (existing `whitespace-nowrap` should hold; verify).
- **Depends on:** T6, T7, T8, T9.
- **Gate:** Playwright headless screenshot pass at mobile viewport for all 4 tabs.

## T11. Verification gate

- **What:** Run the full verification suite + capture screenshots.
- **Commands:**
  ```bash
  bun run build
  bun run test:e2e
  ```
- **Manual:** capture 8 screenshots (4 tabs × {desktop 1280×900, mobile 390×844}) using a small Playwright script, save under `.specs/features/single-screen/screenshots/`.
- **Depends on:** T1–T10.
- **Done when:**
  - Build green, e2e green.
  - 8 screenshots committed.
  - No body scrollbar visible in any of the 4 desktop screenshots.
- **Gate:** if anything fails, fix before declaring done.

---

## Suggested commit grouping

| Commit                                            | Tasks         |
|---------------------------------------------------|---------------|
| `Set 16px base + extend Tailwind type scale`      | T2            |
| `Lock desktop to viewport via grid chassis`       | T1            |
| `Replace arbitrary text-[Npx] with semantic tokens` | T3          |
| `Enlarge wheel labels`                            | T4            |
| `Snap-rotate wheel on slice click`                | T5            |
| `Cultural Wheel: 2-col viewport layout`           | T8            |
| `Color Language: 2-col viewport layout`           | T6            |
| `Psychology: internal-scroll list`                | T7            |
| `Fiction: 2-col viewport layout`                  | T9            |
| `Mobile pass + verification screenshots`          | T10, T11      |

Roughly one PR-worth of work, split into ~10 small commits for clean review.

## Estimated effort

~2–3 hours including verification and screenshot capture. T1, T5, and T8 are the load-bearing ones; the rest is mechanical or per-tab restructuring with the same pattern.
