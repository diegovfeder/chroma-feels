// ═══════════════════════════════════════════════════════════════════
// CULTURES DATA — chroma-feels
// ═══════════════════════════════════════════════════════════════════

import type { Culture } from '../types';

export const CULTURES = {
  A: { name: 'Western', region: 'Europe & Americas' },
  B: { name: 'Japanese', region: 'East Asia' },
  C: { name: 'Hindu', region: 'South Asia' },
  D: { name: 'Native American', region: 'North America' },
  E: { name: 'Chinese', region: 'East Asia' },
  F: { name: 'South Asian', region: 'South Asia' },
  G: { name: 'Eastern European', region: 'Europe' },
  H: { name: 'Muslim', region: 'Middle East & Global' },
  I: { name: 'African', region: 'Africa' },
  J: { name: 'South American', region: 'South America' },
} as const;

export type CultureKey = keyof typeof CULTURES;

export const CULTURE_KEYS = Object.keys(CULTURES) as CultureKey[];
