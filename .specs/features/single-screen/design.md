# Design: Single-Screen Focus Pass

Companion to `./spec.md`. Captures the architectural choices behind viewport lock, typography, wheel rotation, and per-tab layout.

## 1. Layout chassis

### Why CSS Grid at the root

The constraint is "header + tabs visible always, content fills the rest, footer pinned." That's `grid-template-rows: auto 1fr auto`. Flexbox would also work but CSS Grid makes the row contract more explicit and survives content changes better.

### Structure

```
<div id="app" class="grid grid-rows-[auto_1fr_auto] md:h-dvh md:overflow-hidden">
  <header>...</header>            ← row 1: auto
  <main class="min-h-0">...</main> ← row 2: 1fr (THIS is the locked viewport)
  <footer>...</footer>            ← row 3: auto
</div>
```

- `md:h-dvh` — dynamic viewport height, immune to mobile browser chrome jumps.
- `md:overflow-hidden` — prevents body scroll on desktop only.
- `min-h-0` on `<main>` — without this, grid children default to `min-height: auto` and refuse to shrink below their content size, defeating the lock.
- No `md:` lock on mobile → `overflow: visible` (default), `height: auto` (default), page scrolls naturally.

### Internal scroll containers

Inside `<main>`, each tab opts into its own scroll strategy:

- **Cultural Wheel**: 2-col grid; left col (wheel) doesn't scroll; right col is `overflow-y: auto`.
- **Color Language**: 2-col grid; right col `overflow-y: auto`.
- **Psychology**: single column; the list itself is `overflow-y: auto` while a sticky header stays put.
- **Fiction**: 2-col grid; right col `overflow-y: auto`.

The pattern: any scrollable region is wrapped in a `min-h-0` parent and uses `overflow-y: auto` directly. **Never** put `overflow` on the grid track itself.

### `overscroll-behavior: contain`

Apply to the root locked container so trackpad bounces don't escape to the address bar.

## 2. Typography scale

### Base

```css
html { font-size: 16px; line-height: 1.5; }
```

Single source of truth. Removes browser-default ambiguity.

### Tailwind `fontSize` extension

```js
// tailwind.config.js
theme: {
  extend: {
    fontSize: {
      '2xs': ['0.6875rem', { lineHeight: '1rem' }],   // 11px / 16px
      'xs':  ['0.75rem',   { lineHeight: '1rem' }],   // 12px / 16px (Tailwind default reaffirmed)
      'sm':  ['0.875rem',  { lineHeight: '1.25rem' }], // 14px / 20px
      'base':['1rem',      { lineHeight: '1.5rem' }],  // 16px / 24px
      'lg':  ['1.125rem',  { lineHeight: '1.75rem' }], // 18px
      'xl':  ['1.25rem',   { lineHeight: '1.75rem' }], // 20px
      '2xl': ['1.5rem',    { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem',  { lineHeight: '2.25rem' }], // 30px (for the H1 if we want)
    },
  },
}
```

`2xs` (11px) is the only addition; the rest match Tailwind defaults but are declared explicitly so tomorrow's "let me bump body to 17px" change is one file edit.

### Replacement table (per `spec.md` R2.3)

| Current                | Replace with | Used for                                 |
|------------------------|-------------|------------------------------------------|
| `text-[9px]`           | `text-2xs`  | uppercase tracking-widest section labels |
| `text-[10px]`          | `text-xs`   | body/meta lines, button labels           |
| `text-[11px]`          | `text-sm`   | mapping detail copy, paragraph body      |
| `text-[17px]`          | `text-lg`   | active filter color name                 |
| `text-[26px]`          | `text-2xl`  | H1 page title                            |

Net effect: ~2px bump where it matters most (body + meta), label hierarchy preserved.

### Wheel SVG labels

SVG `fontSize` is in viewBox units (560×560 viewBox). Current `6` is roughly 6/560 of the rendered wheel — at 560px wheel, that's literally 6px text, which is why it's hard to read.

Bumping to `11` is ~80% larger. At `560px` rendered: 11px effective. At `420px` rendered (mobile-ish): ~8.3px — still readable for short labels.

Center text "colour × culture": `7.5` → `13`. Same rationale.

## 3. Wheel rotation

### State

In `EmotionWheel.tsx`:

```tsx
const [wheelRotation, setWheelRotation] = useState(0);
```

When `selected` becomes a new emotion, compute and set rotation. When selection clears (re-click same), rotation returns to `0`.

### Math

Each slice spans angular range `[sa, ea]` where:

```ts
sa = (i / total) * 2π - π/2 + ε
ea = ((i+1) / total) * 2π - π/2 - ε
mid = (sa + ea) / 2
```

(`-π/2` puts slice 0 at the 3 o'clock position by SVG convention; the existing code does this.)

To bring a slice to **12 o'clock** (which is `-π/2` in SVG-radians, or `-90°`), the rotation needed is:

```ts
targetDeg = -((mid + π/2) * 180/π)   // negate because we want to rotate the wheel, not the angle
```

Wrap result to `[-180, 180]` to take the shortest path on each click.

### Rendering

Wrap all slice `<g>` elements in a single rotation group:

```tsx
<g
  transform={`rotate(${wheelRotation} ${cx} ${cy})`}
  style={{ transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
>
  {emotions.map(...slice geometry + label...)}
</g>
```

The center "colour × culture" text and the outer ring decorations stay **outside** the rotation group — they're invariant.

### Why this approach (not Framer Motion)

- Plain CSS transition on an SVG `transform` attribute is hardware-accelerated in modern browsers (Chrome, Safari, Firefox).
- Zero new deps.
- The `cubic-bezier(0.34, 1.56, 0.64, 1)` curve is the standard "back-out" — overshoot ~12% past target then settle. Recognizable as "intentional motion" without being cartoonish.

### Edge cases

- **Re-click same slice**: `setSelected(null); setWheelRotation(0)`. Wheel returns to origin.
- **Color-filter click**: does not change `selected` for this tab today; it only sets `activeColor`. We don't change rotation. (Spec R4.5.)
- **Search filter** (when added later — not in this spec): would change the slice count, which would invalidate the rotation. Future feature; defer.

## 4. Per-tab layouts

### Cultural Wheel

```
[ color filter strip            ]   ← row 1: auto, full width
[ wheel column | detail column  ]   ← row 2: 1fr, 2-col grid
   60%           40%
```

- Left column: `<EmotionWheel>` centered, `aspect-ratio: 1`, max-size capped to `min(60vw - chrome, 100% - chrome, 70vh)` so it never blows out vertically.
- Right column: detail card (existing markup) wrapped in `min-h-0 overflow-y-auto`.
- Mobile: stack — color strip / wheel / detail, each `auto`-sized.

### Color Language

```
[ color picker col | content col ]
   ~30%               ~70%
```

- Left: vertical list of color buttons (currently horizontal — change to vertical at `md:`).
- Right: etymology + expressions + filtered emotions, internal scroll.

### Psychology

```
[ section header (sticky) ]
[ scrollable list         ]
```

Single column. List is `overflow-y: auto` inside a `min-h-0` parent. Already nearly fits viewport — main change is removing page scroll and adding internal scroll.

### Fiction

```
[ universe selector + description | mappings + insight ]
   ~35%                                ~65%
```

- Left: universe button row (turns into a vertical list at `md:`?) + system description + character byline.
- Right: mappings list (internal scroll for Green Lantern's 9 entries on shorter viewports) + insight box pinned at bottom or below scroll.

Decision: keep universe selector horizontal at top across breakpoints — the row-of-tabs metaphor reads better than a side rail.

## 5. Animation principle

> Move only when the user moves something.

- No idle motion (no auto-spin, no shimmer, no breathing).
- No entrance animation (fade-in adds latency-feel without value here).
- Tab switching: instant. The user picked the tab; honor that.
- Wheel rotation: only on direct slice click.
- Detail expansion in Psychology / Fiction: existing height/opacity transitions stay (they're already short and unobtrusive).

This is consistent with the editorial / serif-quotation tone of the project — "documentary, not arcade."

## 6. Risks & mitigations

| Risk                                                                                        | Mitigation                                                                                              |
|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Wheel rotation breaks slice click targets (rotated `<g>` still receives clicks at original DOM position) | SVG rotation transforms hitboxes correctly in all modern browsers; verify in manual smoke. |
| `100dvh` not supported on some older Safari versions                                        | Falls back to `100vh`; minor UX nit (chrome jump) but functional. Acceptable.                            |
| Internal scroll containers can hide content from keyboard users without focus indicators    | Existing focus styles inherit; no regression. Future audit candidate.                                    |
| Type bump pushes some tab content past viewport on smaller desktops (e.g. 1024×768)         | Internal scroll containers absorb this. Acceptance is "fits at 1280×900"; below that, scroll-inside is OK. |
| Wheel labels overlap at the bottom rotation positions                                       | Existing label rotation logic flips text orientation past 90°/270° (line 124-125 of EmotionWheel.tsx). Bigger labels stress this — verify in smoke. |

## 7. Files touched

| File                              | Change                                                              |
|-----------------------------------|---------------------------------------------------------------------|
| `app/globals.css`                 | base font-size, line-height, `overscroll-behavior`                  |
| `app/layout.tsx`                  | possibly — add `min-h-screen` removal, wrapper class                |
| `app/page.tsx`                    | top-level grid chassis; per-tab 2-col layouts; replace `text-[Npx]` |
| `tailwind.config.js`              | `fontSize` extension                                                |
| `components/EmotionWheel.tsx`     | bigger labels, rotation state + transform group                     |
| `components/ColorStrip.tsx`       | replace `text-[10px]` with `text-xs`                                |
| `components/CultureTags.tsx`      | replace `text-[9px]`                                                |
| `components/LanguageCard.tsx`     | replace `text-[9px]`, `text-[10px]`                                 |
| `components/PsychRow.tsx`         | replace `text-[9px]`, `text-[10px]`                                 |
| `components/FictionSystem.tsx`    | replace `text-[9px]`, `text-[10px]`, `text-[11px]`                  |
| `e2e/app.spec.ts`                 | no change (existing assertions are loose enough)                    |
