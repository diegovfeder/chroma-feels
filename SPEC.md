# Chroma Feels — Project Spec

> How humanity encodes emotion in color — across cultures, languages, psychology, and fiction.

## Purpose

An interactive explorer that maps the relationship between colors and human emotions. The project examines this through four lenses: cross-cultural data, linguistic expressions, psychological research, and fictional universes.

## Tech Stack

| Layer       | Choice                  | Why                                      |
|-------------|-------------------------|------------------------------------------|
| Runtime     | Bun                     | Fast installs, native TS, drop-in Node   |
| Framework   | Next.js 14 (App Router) | RSC, file-based routing, easy deployment |
| Language    | TypeScript              | Type-safe data layer                     |
| Styling     | Tailwind CSS            | Utility-first, dark theme via config     |
| Testing     | Playwright              | Real browser e2e coverage                |

## Design Tokens

```
background:  #0a0a0c
foreground:  #e0e0e0
font-mono:   JetBrains Mono
font-serif:  Newsreader
```

All UI text is monospace by default; serif is used for display headings and editorial/italic text.

## Data Model

### ColorKey
`'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'white' | 'black' | 'brown' | 'gold' | 'grey' | 'teal'`

### CultureKey
`'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'`

Cultures: Western (A), Japanese (B), Hindu (C), Native American (D), Chinese (E), South Asian (F), Eastern European (G), Muslim (H), African (I), South American (J).

### CulturalEmotion
```ts
{
  id: number
  name: string
  category: 'positive' | 'negative' | 'neutral'
  colors: Partial<Record<CultureKey, ColorKey>>  // which color = this emotion per culture
  insight: string
}
```

### PsychEmotion
```ts
{ name, dominant: ColorKey, secondary: ColorKey, noneRatio: number }
```
`noneRatio` = fraction of people who assign no specific color to this emotion.

### FictionSystem
```ts
{ id, title, source, character, description, mappings: FictionMapping[], insight }
```

## File Structure

```
app/
  layout.tsx      metadata + Google Fonts + global CSS
  page.tsx        main page (4 tabs, all state lives here)
  globals.css     Tailwind directives + CSS variables + scrollbar

components/
  EmotionWheel    SVG radial chart; each slice = one emotion, rings = cultures
  ColorStrip      horizontal color filter buttons
  CultureTags     culture-color badge row on selected emotion
  LanguageCard    color etymology + expressions card
  PsychRow        expandable psychology emotion row with mini pie chart
  FictionSystem   fictional universe mapping list

data/
  colors.ts       COLORS record + COLOR_KEYS
  cultures.ts     CULTURES record + CULTURE_KEYS
  emotions.ts     CULTURAL_EMOTIONS array (33 emotions × up to 10 cultures)
  language.ts     COLOR_LANGUAGE record (etymology + expressions per color)
  psychology.ts   PSYCH_EMOTIONS array (20 emotions, dominant/secondary/noneRatio)
  fiction.ts      FICTION_SYSTEMS array (One Piece, Inside Out, Star Wars)

types/
  index.ts        shared interfaces and ColorKey/CultureKey type unions

e2e/
  app.spec.ts     Playwright smoke tests (header, tabs, color filter)
```

## Tabs

### 1. Cultural Wheel
- SVG radial chart: each slice = one emotion, color rings = how each culture encodes that emotion
- Color filter strip at top — clicking a color dims all non-matching segments
- Clicking a segment shows culture-color tags, insight text, and cross-cultural consensus meter

### 2. Color Language
- Select any color to see its linguistic expressions across languages (e.g. "Feeling blue")
- Etymology section with historical origin of the color-emotion pairing
- Emotion list filtered by the selected color

### 3. Psychology
- Based on Mohr & Jonauskaite (2022) cross-cultural study across 30 countries
- Expandable rows: each emotion shows its dominant/secondary color association
- Mini pie chart visualizes the split; noneRatio shows % who assigned no color

### 4. In Fiction
- Three fictional color-emotion systems: One Piece (Colors Trap), Inside Out (Pixar), Star Wars (lightsabers)
- Each mapping is expandable to show the cultural analysis
- "Why It Works" insight box explains the psychological grounding

## E2E Test Coverage Goals

- [ ] Page loads and header is visible
- [ ] All 4 tabs render and are clickable
- [ ] Cultural Wheel tab: color filter strip renders
- [ ] Color Language tab: color selector and etymology card render
- [ ] Psychology tab: emotion list renders
- [ ] In Fiction tab: universe selector renders
- [ ] Color filter click highlights matching emotions

## Commands

```bash
bun install           # install dependencies
bun run dev           # dev server at localhost:3000
bun run build         # production build
bunx playwright test  # run e2e tests
```

## Active Technical Plan

- Next.js 16 + React 19 dependency bump: see `NEXT_REACT_UPGRADE.md`
- Keep the migration spec-driven: update dependencies only, run the verification suite, then update README/SPEC version labels after the app is green.
- Required verification for the bump: `bun run lint`, `bun run build`, and `bun run test:e2e`.

## Future Work

- [ ] Search input to filter emotions on the wheel
- [ ] Shareable URLs per tab/color/emotion
- [ ] Mobile-optimized layout for the SVG wheel
- [ ] Add more fictional systems (Naruto chakra colors, Avatar elements)
- [ ] Source citations with links per data point
