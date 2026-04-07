// ═══════════════════════════════════════════════════════════════════
// COLORS DATA — chroma-feels
// ═══════════════════════════════════════════════════════════════════

import type { Color, ColorKey } from '../types';

export const COLORS: Record<ColorKey, Color> = {
  red:    { hex: '#DC2626', name: 'Red',    light: false },
  orange: { hex: '#EA580C', name: 'Orange', light: false },
  yellow: { hex: '#FACC15', name: 'Yellow', light: true  },
  green:  { hex: '#16A34A', name: 'Green',  light: false },
  blue:   { hex: '#2563EB', name: 'Blue',   light: false },
  purple: { hex: '#7C3AED', name: 'Purple', light: false },
  pink:   { hex: '#EC4899', name: 'Pink',   light: true  },
  white:  { hex: '#F1F1F1', name: 'White',  light: true  },
  black:  { hex: '#1C1C1E', name: 'Black',  light: false },
  brown:  { hex: '#92400E', name: 'Brown',  light: false },
  gold:   { hex: '#D97706', name: 'Gold',   light: false },
  grey:   { hex: '#6B7280', name: 'Grey',   light: false },
  teal:   { hex: '#14B8A6', name: 'Teal',   light: false },
};

export const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];
