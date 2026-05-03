'use client';

import { useEffect, useState } from 'react';
import type { CulturalEmotion, ColorKey } from '@/types';
import { COLORS } from '@/data/colors';

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
  const r4 = (n: number) => Math.round(n * 1e4) / 1e4;
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = colors.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {colors.map((colorKey, i) => {
        const startAngle = r4((i / total) * Math.PI * 2 - Math.PI / 2);
        const endAngle = r4(((i + 1) / total) * Math.PI * 2 - Math.PI / 2);
        const large = endAngle - startAngle > Math.PI ? 1 : 0;
        const x1 = r4(cx + r * Math.cos(startAngle));
        const y1 = r4(cy + r * Math.sin(startAngle));
        const x2 = r4(cx + r * Math.cos(endAngle));
        const y2 = r4(cy + r * Math.sin(endAngle));
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

  const [wheelRotation, setWheelRotation] = useState(0);

  useEffect(() => {
    if (!selected) {
      setWheelRotation((current) => current + ((0 - current) % 360 + 540) % 360 - 180);
      return;
    }
    const i = emotions.findIndex((e) => e.id === selected.id);
    if (i < 0) return;
    const sa = (i / total) * Math.PI * 2 - Math.PI / 2 + 0.007;
    const ea = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - 0.007;
    const mid = (sa + ea) / 2;
    const target = -90 - (mid * 180) / Math.PI;
    setWheelRotation((current) => current + ((target - current) % 360 + 540) % 360 - 180);
  }, [selected, emotions, total]);

  return (
    <svg
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className="w-full max-w-[560px] max-h-full h-auto block mx-auto"
    >
      <defs>
        <filter id="seg-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#0a0a0c" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={outerR + 16} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={innerR - 4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

      <g
        transform={`rotate(${wheelRotation} ${cx} ${cy})`}
        style={{ transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {emotions.map((emo, i) => {
          const r4 = (n: number) => Math.round(n * 1e4) / 1e4;
          const sa = r4((i / total) * Math.PI * 2 - Math.PI / 2 + 0.007);
          const ea = r4(((i + 1) / total) * Math.PI * 2 - Math.PI / 2 - 0.007);
          const pairs = Object.entries(emo.colors);
          const ringW = r4((outerR - innerR) / Math.max(pairs.length, 1));
          const isSel = selected?.id === emo.id;

          return (
            <g key={emo.id} onClick={() => onSelect(emo)} style={{ cursor: 'pointer' }}>
              {pairs.map(([cultureKey, colorKey], ci) => {
                if (!colorKey) return null;
                const r1 = r4(innerR + ci * ringW);
                const r2 = r4(innerR + (ci + 1) * ringW);
                const c = COLORS[colorKey];
                const large = ea - sa > Math.PI ? 1 : 0;
                const d = [
                  `M ${r4(cx + r1 * Math.cos(sa))} ${r4(cy + r1 * Math.sin(sa))}`,
                  `L ${r4(cx + r2 * Math.cos(sa))} ${r4(cy + r2 * Math.sin(sa))}`,
                  `A ${r2} ${r2} 0 ${large} 1 ${r4(cx + r2 * Math.cos(ea))} ${r4(cy + r2 * Math.sin(ea))}`,
                  `L ${r4(cx + r1 * Math.cos(ea))} ${r4(cy + r1 * Math.sin(ea))}`,
                  `A ${r1} ${r1} 0 ${large} 0 ${r4(cx + r1 * Math.cos(sa))} ${r4(cy + r1 * Math.sin(sa))}`,
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
                    stroke={isSel ? '#fff' : 'rgba(0,0,0,0.5)'}
                    strokeWidth={isSel ? 1.5 : 0.4}
                    style={{ transition: 'opacity 0.35s ease' }}
                  />
                );
              })}

              {(() => {
                const mid = r4((sa + ea) / 2);
                const lr = outerR + 12;
                const lx = r4(cx + lr * Math.cos(mid));
                const ly = r4(cy + lr * Math.sin(mid));
                const rot = r4((mid * 180) / Math.PI + (mid > Math.PI / 2 && mid < 1.5 * Math.PI ? 180 : 0));
                const anchor = mid > Math.PI / 2 && mid < 1.5 * Math.PI ? 'end' : 'start';

                return (
                  <text
                    x={lx}
                    y={ly}
                    fill={isSel ? '#fff' : 'rgba(255,255,255,0.4)'}
                    fontSize="11"
                    fontWeight={isSel ? 500 : 400}
                    fontFamily="'JetBrains Mono', monospace"
                    textAnchor={anchor as 'start' | 'middle' | 'end'}
                    dominantBaseline="central"
                    transform={`rotate(${rot}, ${lx}, ${ly})`}
                    style={{ transition: 'fill 0.3s', pointerEvents: 'none', letterSpacing: '0.03em' }}
                  >
                    {emo.name}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </g>

      <circle cx={cx} cy={cy} r={innerR - 6} fill="url(#center-grad)" />
      <text x={cx} y={cy - 8} fill="rgba(255,255,255,0.25)" fontSize="13"
        fontFamily="'Newsreader', serif" fontStyle="italic" textAnchor="middle">colour</text>
      <text x={cx} y={cy + 12} fill="rgba(255,255,255,0.25)" fontSize="13"
        fontFamily="'Newsreader', serif" fontStyle="italic" textAnchor="middle">× culture</text>
    </svg>
  );
}
