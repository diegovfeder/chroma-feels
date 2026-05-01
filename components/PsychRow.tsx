'use client';

import type { PsychEmotion } from '@/types';
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
      className="flex flex-col p-2 rounded cursor-pointer transition-all duration-200"
      style={{
        background: isExpanded ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderLeft: `3px solid ${dominant.hex}`,
      }}
    >
      <div className="flex items-center gap-3">
        <svg width={32} height={32} viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill={dominant.hex} />
          <path
            d={`M 16 16 L 16 2 A 14 14 0 0 1 ${16 + 14 * Math.sin(item.noneRatio * Math.PI * 2)} ${16 - 14 * Math.cos(item.noneRatio * Math.PI * 2)} Z`}
            fill={secondary.hex}
          />
        </svg>
        <span className="flex-1 text-sm text-gray-300">{item.name}</span>
        <span className="text-[9px] text-gray-500 font-mono">
          no color: {Math.round(item.noneRatio * 100)}%
        </span>
      </div>

      {isExpanded && (
        <div className="mt-2 ml-10">
          <div className="flex gap-4 items-center text-[10px] text-white/40 mb-2">
            <span>
              dominant <span className="font-mono" style={{ color: dominant.hex }}>{dominant.name}</span>
            </span>
            <span>
              secondary <span className="font-mono" style={{ color: secondary.hex }}>{secondary.name}</span>
            </span>
          </div>
          <div className="h-1.5 rounded bg-white/[0.05] overflow-hidden flex">
            <div style={{ width: `${(1 - item.noneRatio) * 65}%`, background: dominant.hex, transition: 'width 0.4s' }} />
            <div style={{ width: `${(1 - item.noneRatio) * 35}%`, background: secondary.hex, opacity: 0.7, transition: 'width 0.4s' }} />
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
