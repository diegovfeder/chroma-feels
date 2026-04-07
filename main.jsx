import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// DATA LAYER — Extract these to separate files when porting to Next.js
// e.g. /data/cultures.ts, /data/colors.ts, /data/emotions.ts
// ═══════════════════════════════════════════════════════════════════

const CULTURES = {
  A: { name: "Western", region: "Europe & Americas" },
  B: { name: "Japanese", region: "East Asia" },
  C: { name: "Hindu", region: "South Asia" },
  D: { name: "Native American", region: "North America" },
  E: { name: "Chinese", region: "East Asia" },
  F: { name: "South Asian", region: "South Asia" },
  G: { name: "Eastern European", region: "Europe" },
  H: { name: "Muslim", region: "Middle East & Global" },
  I: { name: "African", region: "Africa" },
  J: { name: "South American", region: "South America" },
};

const COLORS = {
  red:    { hex: "#DC2626", name: "Red",    light: false },
  orange: { hex: "#EA580C", name: "Orange", light: false },
  yellow: { hex: "#FACC15", name: "Yellow", light: true  },
  green:  { hex: "#16A34A", name: "Green",  light: false },
  blue:   { hex: "#2563EB", name: "Blue",   light: false },
  purple: { hex: "#7C3AED", name: "Purple", light: false },
  pink:   { hex: "#EC4899", name: "Pink",   light: true  },
  white:  { hex: "#F1F1F1", name: "White",  light: true  },
  black:  { hex: "#1C1C1E", name: "Black",  light: false },
  brown:  { hex: "#92400E", name: "Brown",  light: false },
  gold:   { hex: "#D97706", name: "Gold",   light: false },
  grey:   { hex: "#6B7280", name: "Grey",   light: false },
  teal:   { hex: "#14B8A6", name: "Teal",   light: false },
};

// "Feeling blue" and other color-emotion language across cultures
// Source: Psychology Today, Reddit, etymological research
const COLOR_LANGUAGE = {
  red: {
    expressions: [
      { lang: "English", phrase: "Seeing red", meaning: "Feeling angry" },
      { lang: "French", phrase: "Voir rouge", meaning: "Seeing red — anger" },
      { lang: "German", phrase: "Sehen rot", meaning: "Seeing red — anger" },
      { lang: "Chinese", phrase: "红眼 (hóng yǎn)", meaning: "Red-eyed — jealousy" },
      { lang: "Portuguese", phrase: "Ver vermelho", meaning: "Seeing red — fury" },
    ],
    etymology: "Red's emotional power is nearly universal. The Proto-Indo-European root *h₁rewdʰ- simply meant 'to be red.' Cave painters at Lascaux used red ochre 17,000 years ago. It was likely the first color named by humans after black and white — because it's the color of blood, the most emotionally charged substance in human experience.",
  },
  blue: {
    expressions: [
      { lang: "English", phrase: "Feeling blue", meaning: "Feeling sad or depressed" },
      { lang: "French", phrase: "Avoir une peur bleue", meaning: "Having a blue fear — extreme anxiety" },
      { lang: "German", phrase: "Blau sein", meaning: "Being blue — being drunk" },
      { lang: "English", phrase: "Blue devils", meaning: "Depression, melancholy (1600s)" },
      { lang: "English", phrase: "True blue", meaning: "Loyal and faithful" },
    ],
    etymology: "\"Feeling blue\" has at least three origin theories that converge beautifully. The oldest: Chaucer wrote of \"teres blewe\" (tears of blue) around 1385. Then came \"blue devils\" in the 1600s — hallucinations from alcohol withdrawal that left you feeling terrible. Ships that lost a captain flew blue flags returning to port. West African mourning ceremonies used indigo-dyed garments. And there's even a physiological layer: sad people literally perceive colors on the blue-yellow spectrum less accurately (Psychological Science, 2015). The Blues music genre, formalized by W.C. Handy in 1912, cemented the association in popular culture.",
  },
  yellow: {
    expressions: [
      { lang: "English", phrase: "Yellow-bellied", meaning: "Cowardly" },
      { lang: "French", phrase: "Rire jaune", meaning: "Yellow laugh — forced, fake laugh" },
      { lang: "German", phrase: "Gelb vor Neid", meaning: "Yellow with envy" },
      { lang: "English", phrase: "Mellow yellow", meaning: "Relaxed, easy-going" },
    ],
    etymology: "From Old English 'geolu', sharing a root with 'gold.' Yellow's dual nature — joy AND cowardice — may stem from bile. Ancient Greek humoral medicine blamed an excess of yellow bile (choler) for both irritability and cowardice. In China, yellow was the exclusive imperial color; commoners wearing it faced execution.",
  },
  green: {
    expressions: [
      { lang: "English", phrase: "Green with envy", meaning: "Extremely jealous" },
      { lang: "English", phrase: "Green-eyed monster", meaning: "Jealousy (Shakespeare)" },
      { lang: "English", phrase: "Green thumb", meaning: "Skilled at gardening" },
      { lang: "Arabic", phrase: "أخضر (akhḍar)", meaning: "Green — sacred, paradise" },
    ],
    etymology: "From Proto-Germanic *grōni- ('to grow'). The word itself encodes the color-nature bond. Shakespeare coined 'green-eyed monster' in Othello, but green jealousy predates him — ancient Greeks believed jealousy caused overproduction of bile, turning the complexion green. Islamic green gained sacred status from Quranic descriptions of paradise as gardens.",
  },
  purple: {
    expressions: [
      { lang: "English", phrase: "Born to the purple", meaning: "Born into royalty or privilege" },
      { lang: "English", phrase: "Purple prose", meaning: "Excessively ornate writing" },
      { lang: "Latin", phrase: "Purpura", meaning: "From Greek porphyra — the murex snail" },
    ],
    etymology: "Tyrian purple required 12,000 murex sea snails per 1.5 grams of dye — literally worth more than gold. Roman sumptuary laws restricted it to the emperor. The phrase 'born to the purple' originated in Byzantine Constantinople's Purple Chamber where empresses gave birth. Purple dye production was so toxic that ancient dye works were banished to city outskirts.",
  },
  pink: {
    expressions: [
      { lang: "English", phrase: "In the pink", meaning: "In good health" },
      { lang: "English", phrase: "Tickled pink", meaning: "Very pleased" },
      { lang: "English", phrase: "Rose-tinted glasses", meaning: "Optimistic view" },
    ],
    etymology: "Named after the flower Dianthus (pinks), whose petals have fringed edges — 'pinked' with pinking shears. Pink-as-feminine is a 20th-century marketing invention. Before the 1940s, pink was considered masculine — a 'lighter red' suitable for boys. Department stores and advertisers flipped the association, and it stuck within a single generation.",
  },
  black: {
    expressions: [
      { lang: "English", phrase: "Black mood", meaning: "Very dark or angry mood" },
      { lang: "English", phrase: "Blacklisted", meaning: "Banned, excluded" },
      { lang: "English", phrase: "Black sheep", meaning: "Outsider, nonconformist" },
    ],
    etymology: "From Proto-Germanic *blakaz ('burned, charred'). Black absorbs all light wavelengths — the ultimate presence, or the ultimate absence. Its association with evil is nearly universal, rooted in humanity's primal fear of darkness where predators lurked. Yet in many African cultures, black represents ancestral earth and deep strength.",
  },
  white: {
    expressions: [
      { lang: "English", phrase: "White flag", meaning: "Surrender, peace" },
      { lang: "English", phrase: "White lie", meaning: "Harmless untruth" },
      { lang: "English", phrase: "Whitewash", meaning: "Cover up the truth" },
    ],
    etymology: "From Proto-Germanic *hwītaz ('bright, radiant'). White's purity symbolism predates recorded history — untouched snow, fresh milk, clean linen. Across every major religion, white garments mark purification rituals. But here's the twist: in East Asia, white is the color of death and mourning — a return to purity, the clean slate.",
  },
  orange: {
    expressions: [
      { lang: "English", phrase: "Agent Orange", meaning: "Destruction (from the defoliant)" },
    ],
    etymology: "The color was named after the fruit, not vice versa. Before the 16th century, English called it 'geoluhread' (yellow-red). The fruit's name traveled from Sanskrit 'nāranga' through Persian, Arabic, Spanish, and French. Orange combines red's urgency with yellow's brightness — pure energy.",
  },
  gold: {
    expressions: [
      { lang: "English", phrase: "Heart of gold", meaning: "Very kind person" },
      { lang: "English", phrase: "Gold standard", meaning: "The best benchmark" },
    ],
    etymology: "From Proto-Indo-European *ǵʰelh₃- ('to shine, to gleam'). Gold doesn't oxidize, corrode, or decay — this physical immortality made it the inevitable symbol for gods, kings, and eternal value across every civilization that discovered it.",
  },
  brown: {
    expressions: [
      { lang: "English", phrase: "Down to earth", meaning: "Practical, humble (earth = brown)" },
    ],
    etymology: "From Proto-Germanic *brūnaz ('dark, dusky'). Brown is earth's color — and 'humus' (soil) shares a root with 'human' and 'humble.' It grounds us literally and symbolically. The least glamorous color, yet the most foundational.",
  },
  grey: {
    expressions: [
      { lang: "English", phrase: "Grey area", meaning: "Ambiguous, unclear" },
    ],
    etymology: "From Proto-Germanic *grēwaz. Grey sits between absolutes — neither black nor white — making it the color of ambiguity, wisdom (grey hair), and the passage of time. It is the only color that is defined by what it is not.",
  },
};

// Cultural color symbolism (from the original wheel chart)
const CULTURAL_EMOTIONS = [
  { id: 1, name: "Anger", category: "negative",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "black", G: "red", H: "red", I: "red", J: "red" },
    insight: "Red dominates anger worldwide — tied to the visible flush of blood beneath skin during rage. China is the exception: black represents the face of fury in Beijing Opera." },
  { id: 2, name: "Art / Creativity", category: "positive",
    colors: { A: "purple", B: "blue", C: "yellow", E: "yellow", G: "purple", I: "blue", J: "orange" },
    insight: "Purple's creative link in the West stems from its rarity — only royals and artists could afford Tyrian purple. In Hindu tradition, yellow connects to Saraswati, goddess of arts." },
  { id: 3, name: "Authority", category: "neutral",
    colors: { A: "black", B: "purple", C: "gold", E: "yellow", G: "red", H: "green", I: "red", J: "black" },
    insight: "In Islam, green carries authority as the color of the Prophet's cloak. Chinese emperors claimed yellow exclusively. The West chose black — power through absorption." },
  { id: 5, name: "Balance", category: "positive",
    colors: { A: "blue", B: "white", C: "white", D: "green", E: "black", H: "green", I: "green" },
    insight: "Chinese philosophy ties black to yin — one half of cosmic balance. Japan's white represents the clean slate of harmony." },
  { id: 6, name: "Beauty", category: "positive",
    colors: { A: "pink", B: "pink", C: "red", D: "yellow", E: "pink", G: "blue", I: "blue", J: "red" },
    insight: "Pink connects to beauty through cherry blossoms (sakura) in Japan and rosy complexion in Western art. In Hindu culture, red sindoor powder marks married beauty." },
  { id: 7, name: "Calm", category: "positive",
    colors: { A: "blue", B: "blue", C: "white", D: "blue", E: "blue", G: "blue", H: "blue", I: "blue", J: "green" },
    insight: "Blue's calming effect is one of the most consistent cross-cultural associations — rooted in clear skies and still water. Universal tranquility." },
  { id: 9, name: "Children", category: "neutral",
    colors: { A: "pink", B: "red", C: "yellow", E: "red", I: "white", J: "yellow" },
    insight: "Pink for children is a post-1940s Western marketing invention. In Japan, red amulets protect children. Hindu yellow connects to Krishna's playful childhood." },
  { id: 12, name: "Courage", category: "positive",
    colors: { A: "red", B: "red", C: "orange", D: "red", E: "red", G: "red", H: "red", I: "red", J: "red" },
    insight: "From Roman soldiers' cloaks to Japanese warrior headbands — the color of blood shed in battle became synonymous with bravery itself." },
  { id: 15, name: "Danger", category: "negative",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "red", G: "red", H: "red", I: "red", J: "red" },
    insight: "Arguably humanity's oldest color association. Poisonous berries, venomous creatures, fire — all share this warning hue. Red triggers measurable physiological arousal." },
  { id: 16, name: "Death", category: "negative",
    colors: { A: "black", B: "white", C: "white", D: "black", E: "white", G: "black", H: "white", I: "red", J: "purple" },
    insight: "The great cultural divide: Western black mourning treats death as ending. Eastern white mourning treats death as transformation — a return to purity and light." },
  { id: 19, name: "Desire", category: "positive",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "red", G: "red", H: "red", I: "red", J: "red" },
    insight: "Red-light districts, red roses, and biology itself — seeing red increases heart rate and blood pressure. The universal color of wanting." },
  { id: 21, name: "Energy", category: "positive",
    colors: { A: "yellow", B: "orange", C: "orange", D: "yellow", E: "red", G: "orange", H: "orange", I: "yellow", J: "orange" },
    insight: "Warm colors dominate — directly referencing the sun and fire, humanity's two original energy sources." },
  { id: 24, name: "Evil", category: "negative",
    colors: { A: "black", B: "black", C: "black", D: "black", E: "black", G: "black", H: "black", I: "black", J: "black" },
    insight: "The only truly unanimous association. Black as evil is rooted in primal fear of darkness, where predators lurk unseen." },
  { id: 27, name: "Femininity", category: "neutral",
    colors: { A: "pink", B: "pink", C: "pink", E: "pink", G: "pink", I: "yellow", J: "pink" },
    insight: "A 20th-century invention. Before the 1940s, pink was considered masculine. In parts of Africa, yellow's warmth connects to feminine nurturing." },
  { id: 30, name: "Freedom", category: "positive",
    colors: { A: "blue", B: "blue", C: "white", D: "white", E: "blue", G: "white", H: "white", I: "green", J: "green" },
    insight: "Blue evokes endless sky and open ocean. White represents absence of imposition. Green connects to wild, untamed nature." },
  { id: 33, name: "God / Divine", category: "neutral",
    colors: { A: "white", B: "gold", C: "gold", D: "yellow", E: "gold", G: "gold", H: "green", I: "white", J: "gold" },
    insight: "Gold's incorruptibility (it doesn't tarnish) made it the perfect metaphor for eternal godhood. In Islam, green replaces gold as the sacred color." },
  { id: 35, name: "Good Luck", category: "positive",
    colors: { A: "green", B: "red", C: "red", D: "green", E: "red", G: "green", H: "green", I: "green", J: "red" },
    insight: "Red envelopes bring luck in China and Japan (red repels evil spirits). Western luck ties to green through Irish clovers and spring renewal." },
  { id: 43, name: "Holiness", category: "neutral",
    colors: { A: "white", B: "white", C: "gold", D: "white", E: "gold", G: "gold", H: "green", I: "white", J: "white" },
    insight: "White holiness = light metaphors in scripture. Gold halos in Christian, Hindu, Buddhist art = divine radiance. Islam's green = the Prophet's legacy." },
  { id: 49, name: "Jealousy", category: "negative",
    colors: { A: "green", B: "green", C: "green", E: "green", G: "green", H: "yellow" },
    insight: "Shakespeare coined 'green-eyed monster' in Othello, but green jealousy predates him — ancient Greeks believed jealousy caused bile overproduction, turning the skin green." },
  { id: 50, name: "Joy", category: "positive",
    colors: { A: "yellow", B: "yellow", C: "yellow", D: "yellow", E: "red", G: "yellow", H: "yellow", I: "yellow", J: "yellow" },
    insight: "Yellow as joy is solar — sunshine triggers serotonin. China's red joy connects to celebration and festivals." },
  { id: 53, name: "Love", category: "positive",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "red", G: "red", H: "red", I: "red", J: "red" },
    insight: "Universal. The color of a beating heart, flushed cheeks, and the life-giving blood. Valentine's red predates the holiday, rooted in ancient fertility rites." },
  { id: 56, name: "Marriage", category: "neutral",
    colors: { A: "white", B: "white", C: "red", D: "white", E: "red", G: "white", H: "green", I: "white", J: "white" },
    insight: "White wedding dresses are a Victorian invention (Queen Victoria, 1840). Hindu and Chinese brides wear red for prosperity. Islamic green weddings invoke divine blessing." },
  { id: 58, name: "Money", category: "neutral",
    colors: { A: "green", B: "gold", C: "gold", E: "red", G: "gold", H: "green", I: "green", J: "green" },
    insight: "Green-as-money is uniquely American — U.S. currency has used green ink since 1861. Most cultures associate money with gold, the original currency metal." },
  { id: 59, name: "Mourning", category: "negative",
    colors: { A: "black", B: "white", C: "white", D: "black", E: "white", G: "black", H: "white", I: "red", J: "purple" },
    insight: "Black mourning (Western) = death as ending. White mourning (Eastern) = death as transformation. African red mourning = life force honoring the deceased." },
  { id: 61, name: "Nature", category: "positive",
    colors: { A: "green", B: "green", C: "green", D: "green", E: "green", G: "green", H: "green", I: "green", J: "green" },
    insight: "Humanity's most unanimous association. Chlorophyll — the molecule that makes photosynthesis possible — is responsible for the green that dominates every landscape." },
  { id: 62, name: "Passion", category: "positive",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "red", G: "red", H: "red", I: "red", J: "red" },
    insight: "From Latin 'passio' (suffering). Red's physiological effects — increased pulse, heightened arousal — made the color-emotion bond inevitable." },
  { id: 63, name: "Peace", category: "positive",
    colors: { A: "white", B: "white", C: "white", D: "blue", E: "white", G: "white", H: "white", I: "white", J: "white" },
    insight: "The absence of color signals the absence of aggression. White doves, white flags, white helmets — ancient logic encoded into modern symbols." },
  { id: 65, name: "Power", category: "neutral",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "red", G: "red", H: "green", I: "black", J: "red" },
    insight: "Red echoes royal crimson and cardinal robes — dyes so expensive they broadcast dominance. In Africa, black power connects to ancestral earth strength." },
  { id: 67, name: "Purity", category: "positive",
    colors: { A: "white", B: "white", C: "white", D: "white", E: "white", G: "white", H: "white", I: "white", J: "white" },
    insight: "Humanity's most universal color symbol. Untouched snow, fresh milk, clean linen. Every major religion uses white for purification rituals." },
  { id: 73, name: "Royalty", category: "neutral",
    colors: { A: "purple", B: "purple", C: "gold", D: "yellow", E: "yellow", G: "purple", H: "green", I: "purple", J: "purple" },
    insight: "12,000 murex snails per 1.5g of Tyrian purple dye — worth more than gold. Roman law restricted purple to the emperor. Chinese emperors claimed yellow." },
  { id: 75, name: "Strength", category: "positive",
    colors: { A: "red", B: "red", C: "red", D: "red", E: "red", G: "red", H: "black", I: "black", J: "red" },
    insight: "Red strength = blood and vitality. Islamic and African black strength = the unyielding earth, iron, and the night that endures until dawn." },
  { id: 77, name: "Success", category: "positive",
    colors: { A: "gold", B: "gold", C: "gold", D: "green", E: "red", G: "gold", H: "green", I: "green", J: "gold" },
    insight: "Gold trophies, gold medals, gold standards. Chinese red success ties to lucky money envelopes. Green success in Africa = growth and harvest." },
  { id: 80, name: "Sadness", category: "negative",
    colors: { A: "blue", B: "blue", C: "grey", D: "blue", E: "blue", G: "blue", H: "blue", I: "blue", J: "blue" },
    insight: "\"Feeling blue\" traces to 1385 (Chaucer), \"blue devils\" in the 1600s (alcohol withdrawal hallucinations), and ships flying blue flags for dead officers. Sad people literally see blue differently." },
];

// Psychological color-emotion data (from Chart 2: pie chart proportions)
const PSYCH_EMOTIONS = [
  { name: "Anger",          dominant: "red",    secondary: "black",  noneRatio: 0.05 },
  { name: "Hate",           dominant: "black",  secondary: "red",    noneRatio: 0.10 },
  { name: "Contempt",       dominant: "black",  secondary: "grey",   noneRatio: 0.30 },
  { name: "Disgust",        dominant: "black",  secondary: "green",  noneRatio: 0.15 },
  { name: "Fear",           dominant: "black",  secondary: "red",    noneRatio: 0.10 },
  { name: "Disappointment", dominant: "black",  secondary: "grey",   noneRatio: 0.20 },
  { name: "Shame",          dominant: "red",    secondary: "black",  noneRatio: 0.15 },
  { name: "Regret",         dominant: "black",  secondary: "brown",  noneRatio: 0.20 },
  { name: "Guilt",          dominant: "black",  secondary: "grey",   noneRatio: 0.25 },
  { name: "Sadness",        dominant: "blue",   secondary: "black",  noneRatio: 0.10 },
  { name: "Compassion",     dominant: "grey",   secondary: "pink",   noneRatio: 0.35 },
  { name: "Relief",         dominant: "blue",   secondary: "green",  noneRatio: 0.25 },
  { name: "Love",           dominant: "red",    secondary: "pink",   noneRatio: 0.05 },
  { name: "Admiration",     dominant: "red",    secondary: "green",  noneRatio: 0.15 },
  { name: "Contentment",    dominant: "green",  secondary: "teal",   noneRatio: 0.20 },
  { name: "Pleasure",       dominant: "yellow", secondary: "orange", noneRatio: 0.10 },
  { name: "Joy",            dominant: "yellow", secondary: "orange", noneRatio: 0.05 },
  { name: "Pride",          dominant: "red",    secondary: "orange", noneRatio: 0.15 },
  { name: "Amusement",      dominant: "yellow", secondary: "green",  noneRatio: 0.10 },
  { name: "Interest",       dominant: "purple", secondary: "yellow", noneRatio: 0.20 },
];

// ═══════════════════════════════════════════════════════════════════
// COMPONENTS — Each maps cleanly to a file in /components/
// ═══════════════════════════════════════════════════════════════════

function MiniPie({ colors, size = 40 }) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = colors.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {colors.map((colorKey, i) => {
        const startAngle = (i / total) * Math.PI * 2 - Math.PI / 2;
        const endAngle = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2;
        const large = endAngle - startAngle > Math.PI ? 1 : 0;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        return <path key={i} d={d} fill={COLORS[colorKey]?.hex || "#333"} stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />;
      })}
    </svg>
  );
}

function EmotionWheel({ emotions, selected, onSelect, activeColor }) {
  const svgSize = 560;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const innerR = 72;
  const outerR = 245;
  const total = emotions.length;

  return (
    <svg viewBox={`0 0 ${svgSize} ${svgSize}`} style={{ width: "100%", maxWidth: 560, height: "auto", display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="seg-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="center-grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#18181b"/><stop offset="100%" stopColor="#0a0a0c"/></radialGradient>
      </defs>
      {/* Subtle rings */}
      <circle cx={cx} cy={cy} r={outerR + 16} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
      <circle cx={cx} cy={cy} r={innerR - 4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>

      {emotions.map((emo, i) => {
        const sa = (i / total) * Math.PI * 2 - Math.PI / 2 + 0.007;
        const ea = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - 0.007;
        const pairs = Object.entries(emo.colors);
        const ringW = (outerR - innerR) / Math.max(pairs.length, 1);
        const isSel = selected?.id === emo.id;

        return (
          <g key={emo.id} onClick={() => onSelect(emo)} style={{ cursor: "pointer" }}>
            {pairs.map(([culture, colorKey], ci) => {
              const r1 = innerR + ci * ringW;
              const r2 = innerR + (ci + 1) * ringW;
              const c = COLORS[colorKey];
              if (!c) return null;
              const large = ea - sa > Math.PI ? 1 : 0;
              const d = [
                `M ${cx + r1 * Math.cos(sa)} ${cy + r1 * Math.sin(sa)}`,
                `L ${cx + r2 * Math.cos(sa)} ${cy + r2 * Math.sin(sa)}`,
                `A ${r2} ${r2} 0 ${large} 1 ${cx + r2 * Math.cos(ea)} ${cy + r2 * Math.sin(ea)}`,
                `L ${cx + r1 * Math.cos(ea)} ${cy + r1 * Math.sin(ea)}`,
                `A ${r1} ${r1} 0 ${large} 0 ${cx + r1 * Math.cos(sa)} ${cy + r1 * Math.sin(sa)}`,
                "Z",
              ].join(" ");
              const isMatch = activeColor && colorKey === activeColor;
              const op = activeColor ? (isMatch ? 1 : 0.12) : isSel ? 1 : 0.7;
              return (
                <path key={`${emo.id}-${culture}`} d={d} fill={c.hex}
                  opacity={op} stroke={isSel ? "#fff" : "rgba(0,0,0,0.5)"} strokeWidth={isSel ? 1.5 : 0.4}
                  filter={isSel ? "url(#seg-glow)" : undefined}
                  style={{ transition: "opacity 0.35s ease" }} />
              );
            })}
            {(() => {
              const mid = (sa + ea) / 2;
              const lr = outerR + 12;
              const lx = cx + lr * Math.cos(mid);
              const ly = cy + lr * Math.sin(mid);
              const rot = (mid * 180) / Math.PI + (mid > Math.PI / 2 && mid < 1.5 * Math.PI ? 180 : 0);
              const anchor = mid > Math.PI / 2 && mid < 1.5 * Math.PI ? "end" : "start";
              return (
                <text x={lx} y={ly} fill={isSel ? "#fff" : "rgba(255,255,255,0.4)"} fontSize="6"
                  fontFamily="'Geist Mono', 'JetBrains Mono', monospace" textAnchor={anchor}
                  dominantBaseline="central" transform={`rotate(${rot},${lx},${ly})`}
                  style={{ transition: "fill 0.3s", pointerEvents: "none", letterSpacing: "0.03em" }}>
                  {emo.name}
                </text>
              );
            })()}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 6} fill="url(#center-grad)"/>
      <text x={cx} y={cy - 6} fill="rgba(255,255,255,0.25)" fontSize="7.5"
        fontFamily="'Newsreader', serif" fontStyle="italic" textAnchor="middle">colour</text>
      <text x={cx} y={cy + 10} fill="rgba(255,255,255,0.25)" fontSize="7.5"
        fontFamily="'Newsreader', serif" fontStyle="italic" textAnchor="middle">× culture</text>
    </svg>
  );
}

function CultureTags({ emotion }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
      {Object.entries(emotion.colors).map(([ck, colorKey]) => {
        const culture = CULTURES[ck];
        const color = COLORS[colorKey];
        if (!culture || !color) return null;
        return (
          <div key={ck} style={{
            background: color.hex, color: color.light ? "#111" : "#fff",
            padding: "3px 9px", borderRadius: 3, fontSize: 10,
            fontFamily: "'Geist Mono', monospace", letterSpacing: "0.02em",
            border: color.light ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
          }}>
            {culture.name}
          </div>
        );
      })}
    </div>
  );
}

function ColorStrip({ active, onSelect }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {Object.entries(COLORS).filter(([k]) => k !== "teal").map(([key, c]) => {
        const isOn = active === key;
        return (
          <button key={key} onClick={() => onSelect(isOn ? null : key)} title={c.name}
            style={{
              width: 32, height: 32, borderRadius: 5, background: c.hex, cursor: "pointer",
              border: isOn ? "2px solid #fff" : c.light ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.08)",
              transform: isOn ? "scale(1.12)" : "scale(1)", transition: "all 0.2s",
              boxShadow: isOn ? `0 0 14px ${c.hex}70` : "none",
            }} />
        );
      })}
    </div>
  );
}

function LanguageCard({ colorKey }) {
  const data = COLOR_LANGUAGE[colorKey];
  if (!data) return null;
  const color = COLORS[colorKey];
  return (
    <div style={{
      padding: "16px 20px", background: "rgba(255,255,255,0.025)",
      borderLeft: `3px solid ${color.hex}`, borderRadius: "0 6px 6px 0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 12, height: 12, borderRadius: 2, background: color.hex,
          border: color.light ? "1px solid rgba(255,255,255,0.2)" : "none" }}/>
        <span style={{ fontFamily: "'Newsreader', serif", fontSize: 18, color: "#fff" }}>{color.name}</span>
      </div>
      {data.expressions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, margin: "10px 0" }}>
          {data.expressions.map((ex, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 11 }}>
              <span style={{ color: "rgba(255,255,255,0.3)", minWidth: 55, fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: "0.05em" }}>{ex.lang}</span>
              <span style={{ color: `${color.hex}cc`, fontStyle: "italic", fontFamily: "'Newsreader', serif", fontSize: 13 }}>{ex.phrase}</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>— {ex.meaning}</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: 12, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", margin: "10px 0 0",
        fontFamily: "'Geist Mono', monospace" }}>
        {data.etymology}
      </p>
    </div>
  );
}

function PsychRow({ item, isExpanded, onToggle }) {
  const dom = COLORS[item.dominant];
  const sec = COLORS[item.secondary];
  return (
    <div onClick={onToggle} style={{
      padding: "10px 14px", cursor: "pointer", borderRadius: 6,
      background: isExpanded ? "rgba(255,255,255,0.04)" : "transparent",
      transition: "background 0.2s",
      borderLeft: isExpanded ? `2px solid ${dom.hex}` : "2px solid transparent",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: isExpanded ? "#fff" : "rgba(255,255,255,0.6)",
          fontFamily: "'Geist Mono', monospace" }}>{item.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 18, height: 18, borderRadius: 3, background: dom.hex,
            border: dom.light ? "1px solid rgba(255,255,255,0.15)" : "none" }}/>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: sec.hex, opacity: 0.7,
            border: sec.light ? "1px solid rgba(255,255,255,0.15)" : "none" }}/>
        </div>
      </div>
      {isExpanded && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Geist Mono', monospace" }}>DOMINANT</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: dom.hex }}/>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{dom.name}</span>
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>|</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Geist Mono', monospace" }}>SECONDARY</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: sec.hex }}/>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{sec.name}</span>
            </div>
          </div>
          <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(1 - item.noneRatio) * 65}%`, background: dom.hex, transition: "width 0.4s" }}/>
            <div style={{ width: `${(1 - item.noneRatio) * 35}%`, background: sec.hex, opacity: 0.7, transition: "width 0.4s" }}/>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.03)" }}/>
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 4, fontFamily: "'Geist Mono', monospace" }}>
            {Math.round(item.noneRatio * 100)}% of people associate no specific color
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP — maps to /app/page.tsx in Next.js
// ═══════════════════════════════════════════════════════════════════

// Fiction / Pop Culture color-emotion systems
// → /data/fiction.ts when porting
const FICTION_SYSTEMS = [
  {
    id: "onepiece",
    title: "Colors Trap — One Piece",
    source: "One Piece (Eiichiro Oda)",
    character: "Ms. Goldenweek (Marianne)",
    description: "A paint-based hypnotic ability that forces targets to feel specific emotions based on the color painted on them. Each technique is named as '[Color] of [Emotion]' in Japanese.",
    mappings: [
      { color: "black", emotion: "Betrayal", name: "裏切りの黒 — Uragiri no Kuro", detail: "Causes the target to betray their friends, doing the opposite of what they say. Maps to the universal association of black with evil and deception." },
      { color: "yellow", emotion: "Laughter", name: "笑いの黄色 — Warai no Kiiro", detail: "Causes uncontrollable laughter. Yellow = joy is nearly universal across all 10 cultures in our data." },
      { color: "red", emotion: "Aggression", name: "闘牛の赤 — Togyu no Aka", detail: "Causes the target to attack a red mark like a bull. Red = anger/danger is unanimous across cultures." },
      { color: "blue", emotion: "Sadness", name: "悲しみの青 — Kanashimi no Ao", detail: "Causes deep sadness. Directly mirrors 'feeling blue' — from Chaucer's 1385 poem through blue devils to the Blues genre." },
      { color: "green", emotion: "Calm / Soothing", name: "なごみの緑 — Nagomi no Midori", detail: "A mix of blue + yellow that creates tranquility. Green = balance/calm maps to at least 7 of our 10 cultures." },
      { color: "yellow-green", emotion: "Friendship", name: "友達の黄緑 — Tomodachi no Kimidori", detail: "Yellow-green creates bonds of friendship. Combines joy (yellow) with natural harmony (green)." },
      { color: "rainbow", emotion: "Dreams", name: "夢の虹色 — Yume no Nijiiro", detail: "All colors combined reveal the target's deepest dream. The full spectrum = full human potential." },
    ],
    insight: "Oda clearly studied color psychology when designing Ms. Goldenweek. Her mappings align with cross-cultural research at an almost 1:1 level. She's a character with zero combat ability who defeats opponents through pure emotional manipulation via color — a villain built entirely on the science we're exploring here."
  },
  {
    id: "insideout",
    title: "Inside Out — Pixar",
    source: "Inside Out (2015, 2024)",
    character: "Emotion Characters",
    description: "Pixar's emotions are literally color-coded characters living inside a child's mind. The color choices weren't arbitrary — the production team consulted psychologists.",
    mappings: [
      { color: "yellow", emotion: "Joy", name: "Joy", detail: "Bright yellow radiating warmth — matches the near-universal yellow = happiness association." },
      { color: "blue", emotion: "Sadness", name: "Sadness", detail: "Blue Sadness is the 'feeling blue' etymology made literal. The filmmakers chose blue instinctively." },
      { color: "red", emotion: "Anger", name: "Anger", detail: "Red-hot Anger — matches the unanimous red = anger across all 10 cultures." },
      { color: "purple", emotion: "Fear", name: "Fear", detail: "Purple Fear breaks from the typical black = fear pattern. Purple's mystery/unknown quality drives this choice." },
      { color: "green", emotion: "Disgust", name: "Disgust", detail: "Green Disgust plays on the 'turning green' nausea association rather than green = nature." },
      { color: "orange", emotion: "Anxiety", name: "Anxiety (Inside Out 2)", detail: "Orange Anxiety in the sequel — the restless energy of orange, between red's urgency and yellow's brightness." },
      { color: "pink", emotion: "Nostalgia", name: "Nostalgia (Inside Out 2)", detail: "Soft pink for warm memories — pink's tenderness association working perfectly." },
    ],
    insight: "Inside Out proves these color-emotion associations are so deeply embedded in human cognition that a children's movie can use them without any explanation and audiences worldwide understand immediately."
  },
  {
    id: "starwars",
    title: "Lightsabers — Star Wars",
    source: "Star Wars (George Lucas)",
    character: "Jedi & Sith",
    description: "Lightsaber colors encode moral alignment and emotional disposition. The kyber crystal 'chooses' its wielder and reflects their inner state.",
    mappings: [
      { color: "blue", emotion: "Calm / Guardian", name: "Blue Lightsaber", detail: "Jedi Guardians carry blue — calm, duty, protection. Mirrors blue = calm across 8 of 10 cultures." },
      { color: "green", emotion: "Wisdom / Harmony", name: "Green Lightsaber", detail: "Jedi Consulars carry green — balance, nature, spiritual growth. Green = balance is universal." },
      { color: "red", emotion: "Rage / Power", name: "Red Lightsaber (Sith)", detail: "Sith 'bleed' their crystals red through rage and pain. Red = anger/power across all cultures." },
      { color: "purple", emotion: "Balance of Light/Dark", name: "Purple Lightsaber (Mace Windu)", detail: "Purple sits between blue (calm) and red (rage) — a Jedi who channels controlled aggression." },
      { color: "white", emotion: "Purity / Neutrality", name: "White Lightsaber (Ahsoka)", detail: "Purified crystals glow white — purity is white's most universal cross-cultural meaning." },
    ],
    insight: "Lucas built an entire moral philosophy on color associations that audiences across 100+ countries decode instantly. No exposition needed — red blade = danger, blue blade = trust."
  },
];

const TABS = [
  { key: "wheel", label: "Cultural Wheel" },
  { key: "language", label: "Color Language" },
  { key: "psych", label: "Psychology" },
  { key: "fiction", label: "In Fiction" },
];

export default function App() {
  const [tab, setTab] = useState("wheel");
  const [selected, setSelected] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [search, setSearch] = useState("");
  const [psychExpanded, setPsychExpanded] = useState(null);
  const [langColor, setLangColor] = useState("blue");
  const [ficSystem, setFicSystem] = useState("onepiece");
  const [ficExpanded, setFicExpanded] = useState(null);
  const detailRef = useRef(null);

  const filteredEmotions = useMemo(() => {
    if (!search) return CULTURAL_EMOTIONS;
    const t = search.toLowerCase();
    return CULTURAL_EMOTIONS.filter(e => e.name.toLowerCase().includes(t));
  }, [search]);

  const colorMatches = useMemo(() => {
    if (!activeColor) return [];
    return CULTURAL_EMOTIONS.filter(e => Object.values(e.colors).includes(activeColor))
      .map(e => ({ ...e, matchCount: Object.values(e.colors).filter(c => c === activeColor).length }));
  }, [activeColor]);

  const handleSelect = useCallback((emo) => {
    setSelected(prev => prev?.id === emo.id ? null : emo);
    setActiveColor(null);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }, []);

  const handleColorFilter = useCallback((c) => {
    setActiveColor(c);
    setSelected(null);
  }, []);

  const langColors = Object.keys(COLOR_LANGUAGE);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#e0e0e0",
      fontFamily: "'Geist Mono', 'JetBrains Mono', 'SF Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet"/>

      {/* ─── Header ─── */}
      <header style={{ padding: "24px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 400, margin: 0, color: "#fff", letterSpacing: "-0.01em" }}>
          The Colour of Meaning
        </h1>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "5px 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Color × Emotion × Culture × Language
        </p>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSelected(null); setActiveColor(null); setFicExpanded(null); }}
              style={{
                padding: "8px 14px", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                fontFamily: "'Geist Mono', monospace",
                background: tab === t.key ? "rgba(255,255,255,0.07)" : "transparent",
                color: tab === t.key ? "#fff" : "rgba(255,255,255,0.3)",
                border: "none", borderBottom: tab === t.key ? "1px solid rgba(255,255,255,0.35)" : "1px solid transparent",
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ═══ CULTURAL WHEEL TAB ═══ */}
      {tab === "wheel" && (
        <div>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 8 }}>FILTER BY COLOR</div>
            <ColorStrip active={activeColor} onSelect={handleColorFilter}/>
          </div>

          {activeColor && (
            <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: COLORS[activeColor].hex }}/>
                <span style={{ fontFamily: "'Newsreader', serif", fontSize: 17, color: "#fff" }}>{COLORS[activeColor].name}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>{colorMatches.length} emotions</span>
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {COLOR_LANGUAGE[activeColor]?.etymology || ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                {colorMatches.map(e => (
                  <button key={e.id} onClick={() => handleSelect(e)} style={{
                    padding: "4px 9px", fontSize: 10, fontFamily: "'Geist Mono', monospace",
                    background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3, cursor: "pointer",
                  }}>
                    {e.name} <span style={{ color: "rgba(255,255,255,0.25)" }}>{e.matchCount}×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <EmotionWheel emotions={filteredEmotions} selected={selected} onSelect={handleSelect} activeColor={activeColor}/>

          {selected && (
            <div ref={detailRef} style={{
              padding: "18px 20px", borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 400, margin: 0, color: "#fff" }}>
                  {selected.name}
                </h2>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                  {Object.keys(selected.colors).length} CULTURES
                </span>
              </div>
              <CultureTags emotion={selected}/>
              <p style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: "12px 0 0" }}>
                {selected.insight}
              </p>
              {/* Consensus meter */}
              {(() => {
                const vals = Object.values(selected.colors);
                const unique = [...new Set(vals)];
                const consensus = Math.round(((vals.length - unique.length + 1) / vals.length) * 100);
                return (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4, letterSpacing: "0.05em" }}>
                      <span>CROSS-CULTURAL CONSENSUS</span>
                      <span>{consensus}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <div style={{ width: `${consensus}%`, height: "100%", borderRadius: 2,
                        background: consensus > 80 ? "#16A34A" : consensus > 50 ? "#D97706" : "#DC2626",
                        transition: "width 0.5s ease" }}/>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ═══ COLOR LANGUAGE TAB ═══ */}
      {tab === "language" && (
        <div>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 8 }}>SELECT A COLOR</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {langColors.map(k => {
                const c = COLORS[k];
                const isOn = langColor === k;
                return (
                  <button key={k} onClick={() => setLangColor(k)} style={{
                    padding: "5px 10px", fontSize: 10, borderRadius: 4, cursor: "pointer",
                    fontFamily: "'Geist Mono', monospace",
                    background: isOn ? c.hex : "rgba(255,255,255,0.04)",
                    color: isOn ? (c.light ? "#111" : "#fff") : "rgba(255,255,255,0.5)",
                    border: isOn ? "none" : "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.2s",
                  }}>
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <LanguageCard colorKey={langColor}/>
          </div>
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", marginBottom: 10 }}>EMOTIONS LINKED TO {COLORS[langColor]?.name.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CULTURAL_EMOTIONS.filter(e => Object.values(e.colors).includes(langColor)).map(e => (
                <div key={e.id} style={{ padding: "8px 12px", borderRadius: 4, background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{e.name}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {Object.entries(e.colors).filter(([, v]) => v === langColor).map(([ck]) => (
                      <span key={ck} style={{ fontSize: 8, padding: "2px 5px", background: "rgba(255,255,255,0.06)", borderRadius: 2, color: "rgba(255,255,255,0.4)" }}>
                        {CULTURES[ck]?.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ PSYCHOLOGY TAB ═══ */}
      {tab === "psych" && (
        <div>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <p style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Research across 30 countries shows color-emotion links are largely universal, though language shapes the strength of associations. Negative emotions cluster toward dark colors; positive emotions spread across the warm spectrum.
            </p>
          </div>
          <div style={{ padding: "8px 20px 20px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 8, marginTop: 8 }}>
              DOMINANT COLOR ASSOCIATIONS (TAP TO EXPAND)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {PSYCH_EMOTIONS.map((item, i) => (
                <PsychRow key={i} item={item} isExpanded={psychExpanded === i} onToggle={() => setPsychExpanded(psychExpanded === i ? null : i)}/>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ padding: 14, background: "rgba(255,255,255,0.02)", borderRadius: 6, borderLeft: "3px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 6 }}>KEY INSIGHT</div>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                People whose languages share more color-emotion metaphors show stronger agreement on associations. English and German speakers align closely (both "see red" for anger), while languages without color-emotion idioms show weaker — but still present — patterns.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FICTION TAB ═══ */}
      {tab === "fiction" && (() => {
        const sys = FICTION_SYSTEMS.find(s => s.id === ficSystem);
        return (
          <div>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 8 }}>SELECT A UNIVERSE</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {FICTION_SYSTEMS.map(s => (
                  <button key={s.id} onClick={() => { setFicSystem(s.id); setFicExpanded(null); }}
                    style={{
                      padding: "6px 12px", fontSize: 10, borderRadius: 4, cursor: "pointer",
                      fontFamily: "'Geist Mono', monospace", letterSpacing: "0.03em",
                      background: ficSystem === s.id ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                      color: ficSystem === s.id ? "#fff" : "rgba(255,255,255,0.4)",
                      border: ficSystem === s.id ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                      transition: "all 0.2s",
                    }}>
                    {s.title.split("—")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {sys && (
              <div style={{ padding: "16px 20px" }}>
                <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 400, margin: 0, color: "#fff" }}>
                  {sys.title}
                </h2>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, fontStyle: "italic", fontFamily: "'Newsreader', serif" }}>
                  {sys.source} — {sys.character}
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: "10px 0 16px" }}>
                  {sys.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {sys.mappings.map((m, i) => {
                    const isExp = ficExpanded === i;
                    const colorKey = m.color === "rainbow" ? null : m.color === "yellow-green" ? "green" : m.color;
                    const c = colorKey ? COLORS[colorKey] : null;
                    return (
                      <div key={i} onClick={() => setFicExpanded(isExp ? null : i)}
                        style={{
                          padding: "10px 14px", borderRadius: 6, cursor: "pointer",
                          background: isExp ? "rgba(255,255,255,0.04)" : "transparent",
                          borderLeft: isExp && c ? `3px solid ${c.hex}` : "3px solid transparent",
                          transition: "all 0.2s",
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {m.color === "rainbow" ? (
                            <div style={{ width: 22, height: 22, borderRadius: 4, background: "conic-gradient(#DC2626, #EA580C, #FACC15, #16A34A, #2563EB, #7C3AED, #DC2626)", }} />
                          ) : (
                            <div style={{
                              width: 22, height: 22, borderRadius: 4,
                              background: m.color === "yellow-green" ? "linear-gradient(135deg, #FACC15, #16A34A)" : (c?.hex || "#333"),
                              border: c?.light ? "1px solid rgba(255,255,255,0.15)" : "none",
                            }}/>
                          )}
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 12, color: isExp ? "#fff" : "rgba(255,255,255,0.6)" }}>{m.emotion}</span>
                          </div>
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "'Newsreader', serif", fontStyle: "italic" }}>
                            {m.name.split("—")[0].trim()}
                          </span>
                        </div>
                        {isExp && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 11, color: `${c?.hex || '#aaa'}aa`, fontStyle: "italic", fontFamily: "'Newsreader', serif", marginBottom: 4 }}>
                              {m.name}
                            </div>
                            <p style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                              {m.detail}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: 14, background: "rgba(255,255,255,0.02)", borderRadius: 6,
                  borderLeft: "3px solid rgba(255,255,255,0.08)", marginTop: 16 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 6 }}>WHY IT WORKS</div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    {sys.insight}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── Footer ─── */}
      <footer style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: "0.04em" }}>
        Sources: Psychology Today (Mohr & Jonauskaite, 2022), Princeton Creative, etymonline.com, One Piece Wiki (Colors Trap), cultural color symbolism research.
      </footer>
    </div>
  );
}
