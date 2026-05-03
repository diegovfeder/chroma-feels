'use client';

import type { ColorKey } from '@/types';
import { COLORS } from '@/data/colors';

interface ColorStripProps {
  active: ColorKey | null;
  onSelect: (color: ColorKey) => void;
}

export function ColorStrip({ active, onSelect }: ColorStripProps) {
  const colorKeys = Object.keys(COLORS) as ColorKey[];

  return (
    <div className="flex flex-wrap gap-2">
      {colorKeys.map((key) => {
        const color = COLORS[key];
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="px-3 py-1.5 text-xs uppercase tracking-wider font-mono rounded transition-all duration-200"
            style={{
              background: isActive ? color.hex : 'rgba(255,255,255,0.04)',
              color: isActive ? (color.light ? '#111' : '#fff') : 'rgba(255,255,255,0.5)',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
            }}
          >
            {color.name}
          </button>
        );
      })}
    </div>
  );
}
