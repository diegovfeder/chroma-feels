# 🎨 chroma-feels

**How humanity encodes emotion in color — across cultures, languages, psychology, and fiction.**

[chromafeels.com](https://chromafeels.com)

---

## What is this?

Chroma Feels is an interactive explorer that maps the relationship between colors and emotions across 10 cultural traditions, dozens of languages, psychological research, and fictional universes.

Ever wondered why "feeling blue" means sadness in English but blue means *drunk* in German? Why Western funerals use black but Japanese funerals use white? Why every culture on Earth agrees that red = danger, but they split completely on what color represents good luck?

This project turns static color psychology charts into something you can actually explore, connect, and learn from.

## Features

### 🌐 Cultural Wheel
An interactive radial chart mapping 30+ emotions across 10 cultural traditions (Western, Japanese, Hindu, Native American, Chinese, South Asian, Eastern European, Muslim, African, South American). Filter by color to see which emotions it carries across cultures. Each emotion includes a cross-cultural consensus meter showing how much humanity agrees.

### 💬 Color Language
Idiomatic expressions that link color to emotion across languages. "Seeing red" (English), "avoir une peur bleue" (French), "gelb vor Neid" (German). Deep etymological research on each color — from Proto-Indo-European roots to modern usage. The "feeling blue" entry alone traces through Chaucer (1385), blue devils (1600s), naval mourning flags, West African indigo ceremonies, and the Blues music genre.

### 🧠 Psychology
Data from cross-cultural research (30+ countries) on universal color-emotion associations. Dominant and secondary color mappings for 20 emotions, with "no color" ratios showing where associations break down.

### 🎬 In Fiction
How storytellers weaponize color psychology:
- **One Piece** — Ms. Goldenweek's Colors Trap: a paint-based hypnosis system that maps almost 1:1 to real cross-cultural research
- **Inside Out (Pixar)** — Emotion characters color-coded so intuitively that children worldwide understand without explanation
- **Star Wars** — Lightsaber colors encoding moral alignment through the same associations humans have used for millennia

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Newsreader (serif display), JetBrains Mono (monospace UI)
- **Testing**: Playwright (e2e)
- **Deployment**: Vercel
- **Data**: Static TypeScript (no database needed — the dataset is curated, not generated)

## Project Structure

```
chroma-feels/
├── SPEC.md                   # Living project spec (markdown-driven)
├── NEXT_REACT_UPGRADE.md     # Spec-driven Next.js + React bump plan
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Main explorer (4 tabs, all state)
│   └── globals.css
├── components/
│   ├── EmotionWheel.tsx      # Radial SVG chart
│   ├── ColorStrip.tsx        # Color filter bar
│   ├── CultureTags.tsx       # Culture-color badges
│   ├── LanguageCard.tsx      # Etymology + expressions
│   ├── PsychRow.tsx          # Psychology data row
│   └── FictionSystem.tsx     # Fictional universe mappings
├── data/
│   ├── colors.ts             # Color definitions (hex, name, light/dark)
│   ├── cultures.ts           # 10 cultural traditions
│   ├── emotions.ts           # Cultural emotion-color mappings
│   ├── language.ts           # Idiomatic expressions + etymology
│   ├── psychology.ts         # Cross-cultural research data
│   └── fiction.ts            # Fictional color systems
├── types/
│   └── index.ts              # Shared TypeScript interfaces
├── e2e/
│   └── app.spec.ts           # Playwright smoke tests
└── public/
    └── og-image.png
```

## Getting Started

```bash
# Clone
git clone https://github.com/diegovfeder/chroma-feels.git
cd chroma-feels

# Install (requires Bun — https://bun.sh)
bun install

# Dev server
bun run dev

# E2E tests
bunx playwright install chromium   # first time only
bunx playwright test
```

Open [http://localhost:3000](http://localhost:3000).

## Data Sources

- Cultural color symbolism: cross-cultural research spanning 10 traditions
- Psychology: Mohr & Jonauskaite (2022), *Psychology Today* — "Why Links Between Colors and Emotions May Be Universal"
- Etymology: etymonline.com, *Varsity* (Cambridge), historical linguistics research
- "Feeling blue" origins: Chaucer's *Complaint of Mars* (c. 1385), blue devils (17th century), naval traditions, West African indigo mourning
- Color language: cross-linguistic idiom research (English, French, German, Chinese, Portuguese, Arabic)
- Fiction: One Piece Wiki (Colors Trap), Pixar production notes, Star Wars canon
- Princeton Creative — "The Meaning of Colors: Exploring the Spectrum of Emotions" (2023)

## Roadmap

- [x] Port prototype to Next.js + TypeScript + Bun
- [ ] Upgrade to Next.js 16 + React 19 with passing build, lint, and e2e tests
- [ ] Full dataset: expand from 30 to 77+ emotions from original research
- [ ] Culture comparison mode: pick two cultures, see where they agree/disagree
- [ ] Story mode: auto-play through emotions with the most cultural divergence
- [ ] User-submitted fictional systems (Harry Potter, Power Rangers, Zelda, etc.)
- [ ] Shareable deep links (e.g. `chromafeels.com/emotion/death`, `chromafeels.com/color/blue`)
- [ ] i18n: Portuguese, Japanese, Spanish, French
- [ ] SEO pages per emotion and color for organic discovery
- [ ] Community contributions for additional cultural traditions

## Contributing

Contributions welcome — especially:
- **Cultural data**: corrections, additional traditions, or deeper regional breakdowns
- **Language**: color-emotion idioms in languages not yet covered
- **Fiction**: new fictional universes that use color-emotion systems
- **Research**: academic sources on color psychology

Open an issue or PR. Please include sources for any data additions.

## License

MIT

---

Built by [Diego Feder](https://github.com/diegovfeder) — started from a static PNG of a color symbolism wheel and a One Piece episode.
