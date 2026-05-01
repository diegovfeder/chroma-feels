import type { CulturalEmotion, ColorKey } from '@/types';
import { COLORS } from '@/data/colors';
import { CULTURES } from '@/data/cultures';

interface CultureTagsProps {
  emotion: CulturalEmotion;
}

export function CultureTags({ emotion }: CultureTagsProps) {
  const entries = Object.entries(emotion.colors) as [string, ColorKey][];

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {entries.map(([cultureKey, colorKey]) => {
        if (!colorKey) return null;
        const culture = CULTURES[cultureKey as keyof typeof CULTURES];
        const color = COLORS[colorKey];

        return (
          <span
            key={cultureKey}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase tracking-wider font-mono"
            style={{
              background: `${color.hex}20`,
              border: `1px solid ${color.hex}60`,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <span className="w-2 h-2 rounded-sm" style={{ background: color.hex }} />
            {culture?.name}
          </span>
        );
      })}
    </div>
  );
}
