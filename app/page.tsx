'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import type { CulturalEmotion, ColorKey } from '@/types';
import { CULTURAL_EMOTIONS } from '@/data/emotions';
import { COLORS } from '@/data/colors';
import { COLOR_LANGUAGE, COLOR_LANGUAGE_KEYS } from '@/data/language';
import { PSYCH_EMOTIONS } from '@/data/psychology';
import { FICTION_SYSTEMS } from '@/data/fiction';
import { CULTURES } from '@/data/cultures';

// Components
import { EmotionWheel } from '@/components/EmotionWheel';
import { ColorStrip } from '@/components/ColorStrip';
import { CultureTags } from '@/components/CultureTags';
import { LanguageCard } from '@/components/LanguageCard';
import { PsychRow } from '@/components/PsychRow';
import { FictionSystem } from '@/components/FictionSystem';

const TABS = [
  { key: 'wheel', label: 'Cultural Wheel' },
  { key: 'language', label: 'Color Language' },
  { key: 'psych', label: 'Psychology' },
  { key: 'fiction', label: 'In Fiction' },
];

export default function Home() {
  // State
  const [tab, setTab] = useState('wheel');
  const [selected, setSelected] = useState<CulturalEmotion | null>(null);
  const [activeColor, setActiveColor] = useState<ColorKey | null>(null);
  const [search, setSearch] = useState('');
  const [psychExpanded, setPsychExpanded] = useState<number | null>(null);
  const [langColor, setLangColor] = useState<ColorKey>('blue');
  const [ficSystem, setFicSystem] = useState('onepiece');
  const [ficExpanded, setFicExpanded] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Filtered emotions for search
  const filteredEmotions = useMemo(() => {
    if (!search) return CULTURAL_EMOTIONS;
    const t = search.toLowerCase();
    return CULTURAL_EMOTIONS.filter((e) => e.name.toLowerCase().includes(t));
  }, [search]);

  // Color matches for filter
  const colorMatches = useMemo(() => {
    if (!activeColor) return [];
    return CULTURAL_EMOTIONS.filter((e) =>
      Object.values(e.colors).includes(activeColor)
    ).map((e) => ({
      ...e,
      matchCount: Object.values(e.colors).filter((c) => c === activeColor).length,
    }));
  }, [activeColor]);

  // Handlers
  const handleSelect = useCallback(
    (emo: CulturalEmotion) => {
      setSelected((prev) => (prev?.id === emo.id ? null : emo));
      setActiveColor(null);
      setTimeout(
        () => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
        100
      );
    },
    []
  );

  const handleColorFilter = useCallback((c: ColorKey) => {
    setActiveColor(c);
    setSelected(null);
  }, []);

  // Calculate consensus for selected emotion
  const calculateConsensus = (emotion: CulturalEmotion) => {
    const vals = Object.values(emotion.colors);
    const unique = [...new Set(vals)];
    return Math.round(((vals.length - unique.length + 1) / vals.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e0e0e0] font-mono">
      {/* Header */}
      <header className="pt-6 px-5 pb-0 border-b border-white/5">
        <h1 className="font-serif text-[26px] font-normal text-white m-0 tracking-tight">
          The Colour of Meaning
        </h1>
        <p className="text-[10px] text-white/30 mt-1 mb-3.5 tracking-widest uppercase">
          Color × Emotion × Culture × Language
        </p>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSelected(null);
                setActiveColor(null);
                setFicExpanded(null);
              }}
              className="px-3.5 py-2 text-[10px] uppercase tracking-wide font-mono bg-transparent border-b cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: tab === t.key ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.3)',
                borderBottom:
                  tab === t.key ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* CULTURAL WHEEL TAB */}
      {tab === 'wheel' && (
        <div>
          {/* Color filter */}
          <div className="p-3.5 border-b border-white/3">
            <div className="text-[9px] text-white/25 tracking-widest mb-2">
              FILTER BY COLOR
            </div>
            <ColorStrip active={activeColor} onSelect={handleColorFilter} />
          </div>

          {/* Active color info */}
          {activeColor && (
            <div className="p-3.5 bg-white/[0.015] border-b border-white/3">
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: COLORS[activeColor].hex }}
                />
                <span className="font-serif text-[17px] text-white">
                  {COLORS[activeColor].name}
                </span>
                <span className="text-[10px] text-white/25 ml-auto">
                  {colorMatches.length} emotions
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-white/45 m-0">
                {COLOR_LANGUAGE[activeColor]?.etymology || ''}
              </p>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {colorMatches.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleSelect(e)}
                    className="px-2 py-1 text-[10px] font-mono bg-white/[0.04] text-white/60 border border-white/7 rounded cursor-pointer hover:bg-white/[0.08] transition-colors"
                  >
                    {e.name}{' '}
                    <span className="text-white/25">{e.matchCount}×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emotion wheel */}
          <EmotionWheel
            emotions={filteredEmotions}
            selected={selected}
            onSelect={handleSelect}
            activeColor={activeColor}
          />

          {/* Selected emotion details */}
          {selected && (
            <div
              ref={detailRef}
              className="p-4.5 border-t border-white/5 bg-white/[0.02]"
            >
              <div className="flex justify-between items-baseline">
                <h2 className="font-serif text-[22px] font-normal text-white m-0">
                  {selected.name}
                </h2>
                <span className="text-[9px] text-white/20 tracking-wide">
                  {Object.keys(selected.colors).length} CULTURES
                </span>
              </div>
              <CultureTags emotion={selected} />
              <p className="text-[12px] leading-relaxed text-white/50 mt-3 m-0">
                {selected.insight}
              </p>

              {/* Consensus meter */}
              {(() => {
                const consensus = calculateConsensus(selected);
                return (
                  <div className="mt-3">
                    <div className="flex justify-between text-[9px] text-white/30 mb-1 tracking-wide">
                      <span>CROSS-CULTURAL CONSENSUS</span>
                      <span>{consensus}%</span>
                    </div>
                    <div className="h-1 rounded bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-500"
                        style={{
                          width: `${consensus}%`,
                          background:
                            consensus > 80
                              ? '#16A34A'
                              : consensus > 50
                                ? '#D97706'
                                : '#DC2626',
                        }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* COLOR LANGUAGE TAB */}
      {tab === 'language' && (
        <div>
          <div className="p-3.5 border-b border-white/3">
            <div className="text-[9px] text-white/25 tracking-widest mb-2">
              SELECT A COLOR
            </div>
            <div className="flex flex-wrap gap-1">
              {COLOR_LANGUAGE_KEYS.map((k) => {
                const c = COLORS[k];
                const isOn = langColor === k;
                return (
                  <button
                    key={k}
                    onClick={() => setLangColor(k)}
                    className="px-2.5 py-1.5 text-[10px] rounded cursor-pointer font-mono transition-all"
                    style={{
                      background: isOn ? c.hex : 'rgba(255,255,255,0.04)',
                      color: isOn ? (c.light ? '#111' : '#fff') : 'rgba(255,255,255,0.5)',
                      border: isOn ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4">
            <LanguageCard colorKey={langColor} />
          </div>

          <div className="px-5 pb-5">
            <div className="text-[9px] text-white/20 tracking-wide mb-2.5">
              EMOTIONS LINKED TO {COLORS[langColor]?.name.toUpperCase()}
            </div>
            <div className="flex flex-col gap-0.5">
              {CULTURAL_EMOTIONS.filter((e) =>
                Object.values(e.colors).includes(langColor)
              ).map((e) => (
                <div
                  key={e.id}
                  className="p-2 rounded bg-white/[0.02] flex justify-between items-center"
                >
                  <span className="text-[12px] text-white/60">{e.name}</span>
                  <div className="flex gap-0.5">
                    {Object.entries(e.colors)
                      .filter(([, v]) => v === langColor)
                      .map(([ck]) => (
                        <span
                          key={ck}
                          className="text-[8px] px-1 py-0.5 bg-white/[0.06] rounded text-white/40"
                        >
                          {CULTURES[ck as keyof typeof CULTURES]?.name}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PSYCHOLOGY TAB */}
      {tab === 'psych' && (
        <div>
          <div className="p-3.5 border-b border-white/3">
            <p className="text-[11px] leading-relaxed text-white/40 m-0">
              Research across 30 countries shows color-emotion links are largely universal, though
              language shapes the strength of associations. Negative emotions cluster toward dark
              colors; positive emotions spread across the warm spectrum.
            </p>
          </div>
          <div className="p-5 pb-5">
            <div className="text-[9px] text-white/25 tracking-widest mb-2 mt-2">
              DOMINANT COLOR ASSOCIATIONS (TAP TO EXPAND)
            </div>
            <div className="flex flex-col gap-0.5">
              {PSYCH_EMOTIONS.map((item, i) => (
                <PsychRow
                  key={i}
                  item={item}
                  isExpanded={psychExpanded === i}
                  onToggle={() => setPsychExpanded(psychExpanded === i ? null : i)}
                />
              ))}
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="p-3.5 bg-white/[0.02] rounded border-l-3 border-white/8">
              <div className="text-[9px] text-white/30 tracking-wide mb-1.5">KEY INSIGHT</div>
              <p className="text-[12px] leading-relaxed text-white/50 m-0">
                People whose languages share more color-emotion metaphors show stronger agreement
                on associations. English and German speakers align closely (both &ldquo;see
                red&rdquo; for anger), while languages without color-emotion idioms show weaker —
                but still present — patterns.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FICTION TAB */}
      {tab === 'fiction' && (() => {
        const sys = FICTION_SYSTEMS.find((s) => s.id === ficSystem);
        return (
          <div>
            <div className="p-3.5 border-b border-white/3">
              <div className="text-[9px] text-white/25 tracking-widest mb-2">
                SELECT A UNIVERSE
              </div>
              <div className="flex gap-1 flex-wrap">
                {FICTION_SYSTEMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setFicSystem(s.id);
                      setFicExpanded(null);
                    }}
                    className="px-3 py-1.5 text-[10px] rounded cursor-pointer font-mono tracking-wide transition-all"
                    style={{
                      background:
                        ficSystem === s.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                      color: ficSystem === s.id ? '#fff' : 'rgba(255,255,255,0.4)',
                      border:
                        ficSystem === s.id
                          ? '1px solid rgba(255,255,255,0.2)'
                          : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {s.title.split('—')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {sys && <FictionSystem system={sys} />}
          </div>
        );
      })()}

      {/* Footer */}
      <footer className="p-4 border-t border-white/3 text-[9px] text-white/15 tracking-wide">
        Sources: Psychology Today (Mohr & Jonauskaite, 2022), Princeton Creative, etymonline.com,
        One Piece Wiki (Colors Trap), cultural color symbolism research.
      </footer>
    </div>
  );
}
