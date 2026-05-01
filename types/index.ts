export type ColorKey =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'white'
  | 'black'
  | 'brown'
  | 'gold'
  | 'grey'
  | 'teal';

export interface Color {
  hex: string;
  name: string;
  light: boolean;
}

export interface Culture {
  name: string;
  region: string;
}

export type CultureKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface CulturalEmotion {
  id: number;
  name: string;
  category: 'positive' | 'negative' | 'neutral';
  colors: Partial<Record<CultureKey, ColorKey>>;
  insight: string;
}

export interface Expression {
  lang: string;
  phrase: string;
  meaning: string;
}

export interface ColorLanguageData {
  expressions: Expression[];
  etymology: string;
}

export interface PsychEmotion {
  name: string;
  dominant: ColorKey;
  secondary: ColorKey;
  noneRatio: number;
}

export interface FictionMapping {
  color: string;
  emotion: string;
  name: string;
  detail: string;
}

export interface FictionSystem {
  id: string;
  title: string;
  source: string;
  character: string;
  description: string;
  mappings: FictionMapping[];
  insight: string;
}

export interface Tab {
  key: string;
  label: string;
}

export interface EmotionWithConsensus extends CulturalEmotion {
  consensus: number;
}
