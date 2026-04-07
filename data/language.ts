// ═══════════════════════════════════════════════════════════════════
// LANGUAGE DATA — Color expressions and etymology
// chroma-feels
// ═══════════════════════════════════════════════════════════════════

import type { ColorLanguageData, ColorKey } from '../types';

export const COLOR_LANGUAGE: Record<ColorKey, ColorLanguageData> = {
  red: {
    expressions: [
      { lang: 'English', phrase: 'Seeing red', meaning: 'Feeling angry' },
      { lang: 'French', phrase: 'Voir rouge', meaning: 'Seeing red — anger' },
      { lang: 'German', phrase: 'Sehen rot', meaning: 'Seeing red — anger' },
      { lang: 'Chinese', phrase: '红眼 (hóng yǎn)', meaning: 'Red-eyed — jealousy' },
      { lang: 'Portuguese', phrase: 'Ver vermelho', meaning: 'Seeing red — fury' },
    ],
    etymology: "Red's emotional power is nearly universal. The Proto-Indo-European root *h₁rewdʰ- simply meant 'to be red.' Cave painters at Lascaux used red ochre 17,000 years ago. It was likely the first color named by humans after black and white — because it's the color of blood, the most emotionally charged substance in human experience.",
  },
  blue: {
    expressions: [
      { lang: 'English', phrase: 'Feeling blue', meaning: 'Feeling sad or depressed' },
      { lang: 'French', phrase: 'Avoir une peur bleue', meaning: 'Having a blue fear — extreme anxiety' },
      { lang: 'German', phrase: 'Blau sein', meaning: 'Being blue — being drunk' },
      { lang: 'English', phrase: 'Blue devils', meaning: 'Depression, melancholy (1600s)' },
      { lang: 'English', phrase: 'True blue', meaning: 'Loyal and faithful' },
    ],
    etymology: '"Feeling blue" has at least three origin theories that converge beautifully. The oldest: Chaucer wrote of "teres blewe" (tears of blue) around 1385. Then came "blue devils" in the 1600s — hallucinations from alcohol withdrawal that left you feeling terrible. Ships that lost a captain flew blue flags returning to port. West African mourning ceremonies used indigo-dyed garments. And there\'s even a physiological layer: sad people literally perceive colors on the blue-yellow spectrum less accurately (Psychological Science, 2015). The Blues music genre, formalized by W.C. Handy in 1912, cemented the association in popular culture.',
  },
  yellow: {
    expressions: [
      { lang: 'English', phrase: 'Yellow-bellied', meaning: 'Cowardly' },
      { lang: 'French', phrase: 'Rire jaune', meaning: 'Yellow laugh — forced, fake laugh' },
      { lang: 'German', phrase: 'Gelb vor Neid', meaning: 'Yellow with envy' },
      { lang: 'English', phrase: 'Mellow yellow', meaning: 'Relaxed, easy-going' },
    ],
    etymology: "From Old English 'geolu', sharing a root with 'gold.' Yellow's dual nature — joy AND cowardice — may stem from bile. Ancient Greek humoral medicine blamed an excess of yellow bile (choler) for both irritability and cowardice. In China, yellow was the exclusive imperial color; commoners wearing it faced execution.",
  },
  green: {
    expressions: [
      { lang: 'English', phrase: 'Green with envy', meaning: 'Extremely jealous' },
      { lang: 'English', phrase: 'Green-eyed monster', meaning: 'Jealousy (Shakespeare)' },
      { lang: 'English', phrase: 'Green thumb', meaning: 'Skilled at gardening' },
      { lang: 'Arabic', phrase: 'أخضر (akhḍar)', meaning: 'Green — sacred, paradise' },
    ],
    etymology: "From Proto-Germanic *grōni- ('to grow'). The word itself encodes the color-nature bond. Shakespeare coined 'green-eyed monster' in Othello, but green jealousy predates him — ancient Greeks believed jealousy caused overproduction of bile, turning the complexion green. Islamic green gained sacred status from Quranic descriptions of paradise as gardens.",
  },
  purple: {
    expressions: [
      { lang: 'English', phrase: 'Born to the purple', meaning: 'Born into royalty or privilege' },
      { lang: 'English', phrase: 'Purple prose', meaning: 'Excessively ornate writing' },
      { lang: 'Latin', phrase: 'Purpura', meaning: 'From Greek porphyra — the murex snail' },
    ],
    etymology: "Tyrian purple required 12,000 murex sea snails per 1.5 grams of dye — literally worth more than gold. Roman sumptuary laws restricted it to the emperor. The phrase 'born to the purple' originated in Byzantine Constantinople's Purple Chamber where empresses gave birth. Purple dye production was so toxic that ancient dye works were banished to city outskirts.",
  },
  pink: {
    expressions: [
      { lang: 'English', phrase: 'In the pink', meaning: 'In good health' },
      { lang: 'English', phrase: 'Tickled pink', meaning: 'Very pleased' },
      { lang: 'English', phrase: 'Rose-tinted glasses', meaning: 'Optimistic view' },
    ],
    etymology: "Named after the flower Dianthus (pinks), whose petals have fringed edges — 'pinked' with pinking shears. Pink-as-feminine is a 20th-century marketing invention. Before the 1940s, pink was considered masculine — a 'lighter red' suitable for boys. Department stores and advertisers flipped the association, and it stuck within a single generation.",
  },
  black: {
    expressions: [
      { lang: 'English', phrase: 'Black mood', meaning: 'Very dark or angry mood' },
      { lang: 'English', phrase: 'Blacklisted', meaning: 'Banned, excluded' },
      { lang: 'English', phrase: 'Black sheep', meaning: 'Outsider, nonconformist' },
    ],
    etymology: "From Proto-Germanic *blakaz ('burned, charred'). Black absorbs all light wavelengths — the ultimate presence, or the ultimate absence. Its association with evil is nearly universal, rooted in humanity's primal fear of darkness where predators lurked. Yet in many African cultures, black represents ancestral earth and deep strength.",
  },
  white: {
    expressions: [
      { lang: 'English', phrase: 'White flag', meaning: 'Surrender, peace' },
      { lang: 'English', phrase: 'White lie', meaning: 'Harmless untruth' },
      { lang: 'English', phrase: 'Whitewash', meaning: 'Cover up the truth' },
    ],
    etymology: "From Proto-Germanic *hwītaz ('bright, radiant'). White's purity symbolism predates recorded history — untouched snow, fresh milk, clean linen. Across every major religion, white garments mark purification rituals. But here's the twist: in East Asia, white is the color of death and mourning — a return to purity, the clean slate.",
  },
  orange: {
    expressions: [
      { lang: 'English', phrase: 'Agent Orange', meaning: 'Destruction (from the defoliant)' },
    ],
    etymology: "The color was named after the fruit, not vice versa. Before the 16th century, English called it 'geoluhread' (yellow-red). The fruit's name traveled from Sanskrit 'nāranga' through Persian, Arabic, Spanish, and French. Orange combines red's urgency with yellow's brightness — pure energy.",
  },
  gold: {
    expressions: [
      { lang: 'English', phrase: 'Heart of gold', meaning: 'Very kind person' },
      { lang: 'English', phrase: 'Gold standard', meaning: 'The best benchmark' },
    ],
    etymology: "From Proto-Indo-European *ǵʰelh₃- ('to shine, to gleam'). Gold doesn't oxidize, corrode, or decay — this physical immortality made it the inevitable symbol for gods, kings, and eternal value across every civilization that discovered it.",
  },
  brown: {
    expressions: [
      { lang: 'English', phrase: 'Down to earth', meaning: 'Practical, humble (earth = brown)' },
    ],
    etymology: "From Proto-Germanic *brūnaz ('dark, dusky'). Brown is earth's color — and 'humus' (soil) shares a root with 'human' and 'humble.' It grounds us literally and symbolically. The least glamorous color, yet the most foundational.",
  },
  grey: {
    expressions: [
      { lang: 'English', phrase: 'Grey area', meaning: 'Ambiguous, unclear' },
    ],
    etymology: "From Proto-Germanic *grēwaz. Grey sits between absolutes — neither black nor white — making it the color of ambiguity, wisdom (grey hair), and the passage of time. It is the only color that is defined by what it is not.",
  },
  teal: {
    expressions: [],
    etymology: 'Teal sits between blue and green — combining calm with natural growth. Named after the Eurasian teal duck which displays a teal-colored stripe on its head.',
  },
};

export const COLOR_LANGUAGE_KEYS = Object.keys(COLOR_LANGUAGE) as ColorKey[];
