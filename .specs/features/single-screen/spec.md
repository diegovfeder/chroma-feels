# Feature: Single-Screen Focus Pass

## Goal

Make the desktop UI fit the viewport with **no page scroll**, raise text legibility across the app, and give the Cultural Wheel a deliberate "this is the thing" presence with a snap-rotate interaction.

The user's framing: *"avoid lack of attention."* Every decision below serves that.

## Scope sizing

**Large** — touches global layout, typography across ~38 sites, the wheel component's geometry and interaction, and per-tab layout for all 4 tabs.

- Specify: ✅ this document
- Design: ✅ `./design.md` (chassis + type scale + rotation math)
- Tasks: ✅ `./tasks.md`
- Execute: pending approval

## Why

Two surfaces of the same problem:

- **Cognitive**: small text (9–11px), monospace body, dark theme — readable but effortful. The user reports it's "hard to read."
- **Spatial**: the page scrolls vertically on desktop, so the wheel competes with header/footer/filter strip for attention. On a tab whose entire premise *is* the wheel, the wheel should anchor the viewport.

## Constraints

- **Desktop (≥`md`, 768px)**: viewport-locked layout, no `<html>` / `<body>` scroll. Internal scroll permitted inside specific content containers.
- **Mobile (<`md`)**: page scroll preserved — small viewports cannot hold all content without compromising legibility.
- **No new dependencies.** Animations via CSS transitions on SVG transforms; no Framer Motion.
- **Existing e2e** (`e2e/app.spec.ts:3-8`) must still pass — assertions are loose (title, h1, first button) so this is realistic.

## Requirements

### R1 — Desktop viewport lock
- **R1.1** Root layout uses CSS Grid: `grid-template-rows: auto 1fr auto` (header / main / footer).
- **R1.2** At `md:` and up, the root grid container is `height: 100dvh` with `overflow: hidden`. Below `md:`, the lock is removed.
- **R1.3** The `1fr` main row uses `min-height: 0` so flex/grid children can constrain themselves correctly.
- **R1.4** No horizontal scrollbar at any breakpoint.

### R2 — Typography baseline
- **R2.1** Set explicit base font size of `16px` on `<html>`, line-height `1.5`.
- **R2.2** Extend Tailwind `theme.fontSize` with the project's scale (see design.md §2). Add a `2xs` (11px) token for the few legitimate micro-label cases — replaces the existing `text-[9px]` instances used for `tracking-widest` section labels.
- **R2.3** Replace all 38 arbitrary `text-[Npx]` instances with semantic tokens (`text-2xs`, `text-xs`, `text-sm`, `text-base`, `text-lg`, etc.). Mapping:
  - `text-[9px]` (uppercase tracking-widest section labels) → `text-2xs` (11px) — kept small intentionally for hierarchy.
  - `text-[10px]` body/meta → `text-xs` (12px).
  - `text-[11px]` body copy → `text-sm` (14px).
  - `text-[17px]` / `text-[26px]` headings → existing Tailwind tokens (`text-lg` / `text-2xl`).
- **R2.4** No more arbitrary `text-[Npx]` classes anywhere in `app/` or `components/` after this pass.

### R3 — Wheel legibility
- **R3.1** Slice-label `fontSize` in `EmotionWheel.tsx` increases from `6` → `11` (SVG units, scales with viewBox).
- **R3.2** Center text "colour × culture" `fontSize` increases from `7.5` → `13`.
- **R3.3** Selected-slice label gets `fontWeight: 500` (currently default).
- **R3.4** No change to slice geometry, ring count, or color rendering.

### R4 — Wheel snap-rotate interaction
- **R4.1** Clicking any slice animates the wheel so that slice's angular midpoint lands at 12 o'clock.
- **R4.2** Animation: 600ms, `cubic-bezier(0.34, 1.56, 0.64, 1)` (soft overshoot, settle).
- **R4.3** Implementation: a single `<g transform="rotate(angle, cx, cy)">` wrapping all slices, driven by `wheelRotation` state in `EmotionWheel.tsx`. Labels rotate with the slices (acceptable — they're already positioned per-slice).
- **R4.4** Re-clicking the currently selected slice deselects (existing behavior) and animates rotation back to `0`.
- **R4.5** Color filter (clicking a color in the strip) does **not** rotate — it only highlights matching slices, as today.
- **R4.6** No idle/auto rotation. No entrance animation. Movement only on direct user input.

### R5 — Cultural Wheel tab layout
- **R5.1** Desktop: 2-column grid below the color filter strip — wheel ~60% (left), detail card ~40% (right). Detail card overflows internally (`overflow-y: auto`).
- **R5.2** Wheel is sized to fit the available column height/width with `aspect-ratio: 1` (no clipping, no forced minimum that exceeds viewport).
- **R5.3** When nothing is selected, the detail column shows a placeholder: a single-line prompt like *"Click a slice to read across cultures."*
- **R5.4** Mobile: wheel above detail, both fully visible with page scroll (current behavior, but with R3 + R4 applied).

### R6 — Other tabs (viewport fit)
- **R6.1** **Color Language**: 2-column desktop layout — color picker column (left), expression list + etymology (right, internal scroll if it overflows).
- **R6.2** **Psychology**: emotion list with internal scroll; expanded row state preserved on scroll.
- **R6.3** **Fiction**: 2-column desktop layout — universe selector and `description` (left), mappings list + insight (right, internal scroll). Mobile keeps current stacked layout.
- **R6.4** No tab introduces new functionality in this pass — layout-only changes.

### R7 — Verification
- **R7.1** `bun run build` passes.
- **R7.2** `bun run test:e2e` passes without modifications.
- **R7.3** Manual desktop smoke at 1280×900 and 1440×900: no body scrollbar on any tab; all content visible or reachable via internal scroll.
- **R7.4** Manual mobile smoke at 390×844 (iPhone 14 viewport via Playwright): page scroll works; no broken layout.
- **R7.5** Manual interaction smoke: click 4 different wheel slices, verify each lands at top with the overshoot ease.

## Out of scope

- New emotions (Death already exists per `data/emotions.ts:31`).
- Search/filter on the wheel (deferred — captured in `TODO.md`).
- Idle wheel animation, entrance animation, sound effects, color-filter rotation behavior.
- Animation library (Framer Motion etc.).
- Dark/light theme toggle.
- Any visual redesign beyond layout + type — color palette and component aesthetics stay.
- Fixing the pre-existing broken `bun run lint` config (separate concern).

## Open decisions (resolved inline)

| Question                                                     | Decision                                                      |
|--------------------------------------------------------------|---------------------------------------------------------------|
| Idle/auto wheel spin?                                        | **No.** Distracts from focus, conflicts with the project's editorial tone. Movement only on direct user click. |
| Should color filter also rotate the wheel?                   | **No.** Filter is a "view across" action, not a "focus on" action — different intent. |
| Replace JetBrains Mono with a sans body font?                | **No.** The mono aesthetic is part of the brand. We address legibility via size + line-height, not font swap. |
| Mobile: also viewport-locked?                                | **No.** Desktop attention frame doesn't apply to a 6" screen; forcing it harms readability more than it helps. |
| Drop the footer to reclaim space?                            | **No.** Source citations are part of the project's intellectual honesty. Compact, but keep. |
| Add a mid-scroll "scroll lock" or `overscroll-behavior`?     | **Yes** for the locked desktop root — `overscroll-behavior: contain` prevents bounce. |

## Acceptance criteria

- [ ] Desktop at 1280×900 and 1440×900: every tab fits in viewport with **no body scrollbar**. Internal scroll is OK where flagged.
- [ ] No `text-[Npx]` arbitrary classes remain in `app/` or `components/`.
- [ ] Body base size is 16px; smallest visible text is 11px (`text-2xs`, used only for uppercase micro-labels).
- [ ] Clicking any wheel slice triggers a smooth ~600ms rotation snapping that slice to the top, with a perceptible overshoot/settle.
- [ ] Mobile at 390×844: page scrolls; layout doesn't break; wheel remains tappable.
- [ ] `bun run build` and `bun run test:e2e` both pass.
- [ ] Visual smoke screenshots captured at desktop and mobile per tab (4 × 2 = 8 screenshots) and committed under `.specs/features/single-screen/screenshots/`.
