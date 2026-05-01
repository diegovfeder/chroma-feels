import type { ColorKey } from '@/types';
import { COLORS } from '@/data/colors';
import { COLOR_LANGUAGE } from '@/data/language';

interface LanguageCardProps {
  colorKey: ColorKey;
}

export function LanguageCard({ colorKey }: LanguageCardProps) {
  const data = COLOR_LANGUAGE[colorKey];
  const color = COLORS[colorKey];

  if (!data) return null;

  return (
    <div
      className="p-4 rounded-lg border"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-6 h-6 rounded"
          style={{
            background: color.hex,
            border: color.light ? '1px solid rgba(255,255,255,0.2)' : 'none',
          }}
        />
        <h2 className="font-serif text-xl text-white">{color.name} in Language</h2>
      </div>

      <div className="mb-4">
        <div className="text-[9px] uppercase tracking-wider text-gray-400 mb-2">Expressions</div>
        <div className="space-y-2">
          {data.expressions.map((expr, i) => (
            <div
              key={i}
              className="flex justify-between items-baseline py-1.5 px-2 rounded"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="text-xs text-gray-300">
                <span className="text-[9px] uppercase tracking-wider text-gray-500 mr-2">
                  {expr.lang}
                </span>
                &ldquo;{expr.phrase}&rdquo;
              </span>
              <span className="text-[10px] text-gray-400 italic">{expr.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] uppercase tracking-wider text-gray-400 mb-2">Etymology</div>
        <p className="text-sm leading-relaxed text-gray-400">{data.etymology}</p>
      </div>
    </div>
  );
}
