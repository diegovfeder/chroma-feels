import type { FictionSystem } from '../types';

export const FICTION_SYSTEMS: FictionSystem[] = [
  {
    id: 'onepiece',
    title: 'Colors Trap — One Piece',
    source: 'One Piece (Eiichiro Oda)',
    character: 'Ms. Goldenweek (Marianne)',
    description: "A paint-based hypnotic ability that forces targets to feel specific emotions based on the color painted on them. Each technique is named as '[Color] of [Emotion]' in Japanese.",
    mappings: [
      { color: 'black',       emotion: 'Betrayal',        name: '裏切りの黒 — Uragiri no Kuro',      detail: 'Causes the target to betray their friends, doing the opposite of what they say. Maps to the universal association of black with evil and deception.' },
      { color: 'yellow',      emotion: 'Laughter',        name: '笑いの黄色 — Warai no Kiiro',        detail: 'Causes uncontrollable laughter. Yellow = joy is nearly universal across all 10 cultures in our data.' },
      { color: 'red',         emotion: 'Aggression',      name: '闘牛の赤 — Togyu no Aka',            detail: 'Causes the target to attack a red mark like a bull. Red = anger/danger is unanimous across cultures.' },
      { color: 'blue',        emotion: 'Sadness',         name: '悲しみの青 — Kanashimi no Ao',       detail: "Causes deep sadness. Directly mirrors 'feeling blue' — from Chaucer's 1385 poem through blue devils to the Blues genre." },
      { color: 'green',       emotion: 'Calm / Soothing', name: 'なごみの緑 — Nagomi no Midori',      detail: 'A mix of blue + yellow that creates tranquility. Green = balance/calm maps to at least 7 of our 10 cultures.' },
      { color: 'yellow-green',emotion: 'Friendship',      name: '友達の黄緑 — Tomodachi no Kimidori', detail: 'Yellow-green creates bonds of friendship. Combines joy (yellow) with natural harmony (green).' },
      { color: 'rainbow',     emotion: 'Dreams',          name: '夢の虹色 — Yume no Nijiiro',         detail: "All colors combined reveal the target's deepest dream. The full spectrum = full human potential." },
    ],
    insight: "Oda clearly studied color psychology when designing Ms. Goldenweek. Her mappings align with cross-cultural research at an almost 1:1 level. She's a character with zero combat ability who defeats opponents through pure emotional manipulation via color — a villain built entirely on the science we're exploring here.",
  },
  {
    id: 'insideout',
    title: 'Inside Out — Pixar',
    source: 'Inside Out (2015, 2024)',
    character: 'Emotion Characters',
    description: "Pixar's emotions are literally color-coded characters living inside a child's mind. The color choices weren't arbitrary — the production team consulted psychologists.",
    mappings: [
      { color: 'yellow', emotion: 'Joy',                  name: 'Joy',                    detail: 'Bright yellow radiating warmth — matches the near-universal yellow = happiness association.' },
      { color: 'blue',   emotion: 'Sadness',              name: 'Sadness',                detail: "Blue Sadness is the 'feeling blue' etymology made literal. The filmmakers chose blue instinctively." },
      { color: 'red',    emotion: 'Anger',                name: 'Anger',                  detail: 'Red-hot Anger — matches the unanimous red = anger across all 10 cultures.' },
      { color: 'purple', emotion: 'Fear',                 name: 'Fear',                   detail: "Purple Fear breaks from the typical black = fear pattern. Purple's mystery/unknown quality drives this choice." },
      { color: 'green',  emotion: 'Disgust',              name: 'Disgust',                detail: "Green Disgust plays on the 'turning green' nausea association rather than green = nature." },
      { color: 'orange', emotion: 'Anxiety',              name: 'Anxiety (Inside Out 2)', detail: "Orange Anxiety in the sequel — the restless energy of orange, between red's urgency and yellow's brightness." },
      { color: 'pink',   emotion: 'Nostalgia',            name: 'Nostalgia (Inside Out 2)',detail: "Soft pink for warm memories — pink's tenderness association working perfectly." },
    ],
    insight: 'Inside Out proves these color-emotion associations are so deeply embedded in human cognition that a children\'s movie can use them without any explanation and audiences worldwide understand immediately.',
  },
  {
    id: 'starwars',
    title: 'Lightsabers — Star Wars',
    source: 'Star Wars (George Lucas)',
    character: 'Jedi & Sith',
    description: "Lightsaber colors encode moral alignment and emotional disposition. The kyber crystal 'chooses' its wielder and reflects their inner state.",
    mappings: [
      { color: 'blue',   emotion: 'Calm / Guardian',      name: 'Blue Lightsaber',          detail: 'Jedi Guardians carry blue — calm, duty, protection. Mirrors blue = calm across 8 of 10 cultures.' },
      { color: 'green',  emotion: 'Wisdom / Harmony',     name: 'Green Lightsaber',         detail: 'Jedi Consulars carry green — balance, nature, spiritual growth. Green = balance is universal.' },
      { color: 'red',    emotion: 'Rage / Power',         name: 'Red Lightsaber (Sith)',    detail: "Sith 'bleed' their crystals red through rage and pain. Red = anger/power across all cultures." },
      { color: 'purple', emotion: 'Balance of Light/Dark',name: 'Purple Lightsaber (Mace Windu)', detail: 'Purple sits between blue (calm) and red (rage) — a Jedi who channels controlled aggression.' },
      { color: 'white',  emotion: 'Purity / Neutrality',  name: 'White Lightsaber (Ahsoka)',detail: "Purified crystals glow white — purity is white's most universal cross-cultural meaning." },
    ],
    insight: "Lucas built an entire moral philosophy on color associations that audiences across 100+ countries decode instantly. No exposition needed — red blade = danger, blue blade = trust.",
  },
];
