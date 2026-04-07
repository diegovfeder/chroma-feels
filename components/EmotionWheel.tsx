// ═══════════════════════════════════════════════════════════════════
// EmotionWheel Component — chroma-feels
// Interactive radial chart mapping emotions across cultures
// ═══════════════════════════════════════════════════════════════════

'use client';

import { useCallback } from 'react';
import type { CulturalEmotion, ColorKey } from '@/types';
import { COLORS } from '@/data/colors';
import { CULTURES } from '@/data/cultures';

interface EmotionWheelProps {
  emotions: CulturalEmotion[];
  selected: CulturalEmotion | null;
  onSelect: (emotion: CulturalEmotion) => void;
  activeColor: ColorKey | null;
}

interface MiniPieProps {
  colors: ColorKey[];
  size?: number;
}

export function MiniPie({ colors, size = 40 }: MiniPieProps) {
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
        return (
          <path
            key={i}
            d={d}
            fill={COLORS[colorKey]?.hex || '#333'}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.5"
          />
        );
      })}
    </svg>
  );
}

export function EmotionWheel({ emotions, selected, onSelect, activeColor }: EmotionWheelProps) {
  const svgSize = 560;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const innerR = 72;
  const outerR = 245;
  const total = emotions.length;

  return (
    <svg
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className="w-full max-w-[560px] h-auto block mx-auto"
    >
      {emotions.map((emo, i) => {
        const sa = (i / total) * Math.PI * 2 - Math.PI / 2 + 0.007;
        const ea = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - 0.007;
        const pairs = Object.entries(emo.colors);
        const ringW = (outerR - innerR) / Math.max(pairs.length, 1);
        const isSel = selected?.id === emo.id;

        return (
          <g key={emo.id}>
            {/* Culture color rings */}
            {pairs.map(([cultureKey, colorKey], ci) => {
              if (!colorKey) return null;
              const r1 = innerR + ci * ringW;
              const r2 = innerR + (ci + 1) * ringW;
              const c = COLORS[colorKey];

              const large = ea - sa > Math.PI ? 1 : 0;
              const d = [
                `M ${cx + r1 * Math.cos(sa)} ${cy + r1 * Math.sin(sa)}`,
                `L ${cx + r2 * Math.cos(sa)} ${cy + r2 * Math.sin(sa)}`,
                `A ${r2} ${r2} 0 ${large} 1 ${cx + r2 * Math.cos(ea)} ${cy + r2 * Math.sin(ea)}`,
                `L ${cx + r1 * Math.cos(ea)} ${cy + r1 * Math.sin(ea)}`,
                `A ${r1} ${r1} 0 ${large} 0 ${cx + r1 * Math.cos(sa)} ${cy + r1 * Math.sin(sa)}`,
                'Z',
              ].join(' ');

              const isMatch = activeColor && colorKey === activeColor;
              const op = activeColor ? (isMatch ? 1 : 0.12) : isSel ? 1 : 0.7;

              return (
                <path
                  key={`${emo.id}-${cultureKey}`}
                  d={d}
                  fill={c.hex}
                  opacity={op}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onClick={() => onSelect(emo)}
                />
              );
            })}

            {/* Emotion label */}
            {(() => {
              const mid = (sa + ea) / 2;
              const lr = outerR + 12;
              const lx = cx + lr * Math.cos(mid);
              const ly = cy + lr * Math.sin(mid);
              const rot = (mid * 180) / Math.PI + (mid > Math.PI / 2 && mid < 1.5 * Math.PI ? 180 : 0);
              const anchor = mid > Math.PI / 2 && mid < 1.5 * Math.PI ? 'end' : 'start';

              return (
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor as 'start' | 'middle' | 'end'}
                  dominantBaseline="middle"
                  transform={`rotate(${rot}, ${lx}, ${ly})`}
                  className="font-serif"
                  style={{
                    fontSize: 11,
                    fill: '#fff',
                    pointerEvents: 'none',
                  }}
                >
                  {emo.name}
                </text>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}
