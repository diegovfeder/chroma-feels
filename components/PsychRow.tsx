// ═══════════════════════════════════════════════════════════════════
// PsychRow Component — chroma-feels
// Psychology data row with expandable details
// ═══════════════════════════════════════════════════════════════════

'use client';

import type { PsychEmotion, ColorKey } from '@/types';
import { COLORS } from '@/data/colors';

interface PsychRowProps {
  item: PsychEmotion;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PsychRow({ item, isExpanded, onToggle }: PsychRowProps) {
  const dominant = COLORS[item.dominant];
  const secondary = COLORS[item.secondary];

  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-200"
      style={{
        background: isExpanded ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderLeft: `3px solid ${dominant.hex}`,
      }}
    >
      {/* Mini pie chart */}
      <svg width={32} height={32} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill={dominant.hex} />
        <path
          d={`M 16 16 L 16 2 A 14 14 0 0 1 ${16 + 14 * Math.sin(item.noneRatio * Math.PI * 2)} ${16 - 14 * Math.cos(item.noneRatio * Math.PI * 2)} Z`}
          fill={secondary.hex}
        />
      </svg>

      {/* Emotion name */}
      <span className="flex-1 text-sm text-gray-300">{item.name}</span>

      {/* None ratio indicator */}
      <span className="text-[9px] text-gray-500 font-mono">
        no color: {Math.round(item.noneRatio * 100)}%
      </span>
    </div>
  );
}
