// ═══════════════════════════════════════════════════════════════════
// FictionSystem Component — chroma-feels
// Displays fictional color-emotion systems
// ═══════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import type { FictionSystem, ColorKey } from '@/types';
import { COLORS } from '@/data/colors';

interface FictionSystemProps {
  system: FictionSystem;
}

export function FictionSystem({ system }: FictionSystemProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="p-4">
      {/* Header */}
      <h2 className="font-serif text-xl text-white mb-1">{system.title}</h2>
      <div className="text-[10px] text-gray-400 italic font-serif mb-3">
        {system.source} — {system.character}
      </div>
      <p className="text-sm text-gray-400 leading-relaxed mb-4">
        {system.description}
      </p>

      {/* Mappings list */}
      <div className="space-y-0.5">
        {system.mappings.map((m, i) => {
          const isExp = expandedIndex === i;
          const colorKey =
            m.color === 'rainbow'
              ? null
              : m.color === 'yellow-green'
                ? 'green'
                : (m.color as ColorKey);
          const c = colorKey ? COLORS[colorKey] : null;

          return (
            <div
              key={i}
              onClick={() => setExpandedIndex(isExp ? null : i)}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200"
              style={{
                background: isExp ? 'rgba(255,255,255,0.04)' : 'transparent',
                borderLeft:
                  isExp && c ? `3px solid ${c.hex}` : '3px solid transparent',
              }}
            >
              <div className="flex items-center gap-2">
                {/* Color swatch */}
                {m.color === 'rainbow' ? (
                  <div
                    className="w-5.5 h-5.5 rounded"
                    style={{
                      background:
                        'conic-gradient(#DC2626, #EA580C, #FACC15, #16A34A, #2563EB, #7C3AED, #DC2626)',
                    }}
                  />
                ) : (
                  <div
                    className="w-5.5 h-5.5 rounded"
                    style={{
                      background:
                        m.color === 'yellow-green'
                          ? 'linear-gradient(135deg, #FACC15, #16A34A)'
                          : c?.hex || '#333',
                      border: c?.light ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    }}
                  />
                )}

                {/* Emotion name */}
                <span className="flex-1 text-sm text-gray-300">{m.emotion}</span>

                {/* Japanese/system name */}
                <span className="text-[9px] text-gray-400 italic font-serif">
                  {m.name.split('—')[0].trim()}
                </span>
              </div>

              {/* Expanded details */}
              {isExp && (
                <div className="mt-2 ml-7">
                  <div
                    className="text-[11px] italic font-serif mb-1"
                    style={{ color: `${c?.hex || '#aaa'}aa` }}
                  >
                    {m.name}
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    {m.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insight box */}
      <div
        className="p-3.5 mt-4 rounded-lg border-l-4"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderLeftColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
          Why It Works
        </div>
        <p className="text-sm leading-relaxed text-gray-400">{system.insight}</p>
      </div>
    </div>
  );
}
