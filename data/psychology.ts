import type { PsychEmotion } from '../types';

export const PSYCH_EMOTIONS: PsychEmotion[] = [
  { name: 'Anger',          dominant: 'red',    secondary: 'black',  noneRatio: 0.05 },
  { name: 'Hate',           dominant: 'black',  secondary: 'red',    noneRatio: 0.10 },
  { name: 'Contempt',       dominant: 'black',  secondary: 'grey',   noneRatio: 0.30 },
  { name: 'Disgust',        dominant: 'black',  secondary: 'green',  noneRatio: 0.15 },
  { name: 'Fear',           dominant: 'black',  secondary: 'red',    noneRatio: 0.10 },
  { name: 'Disappointment', dominant: 'black',  secondary: 'grey',   noneRatio: 0.20 },
  { name: 'Shame',          dominant: 'red',    secondary: 'black',  noneRatio: 0.15 },
  { name: 'Regret',         dominant: 'black',  secondary: 'brown',  noneRatio: 0.20 },
  { name: 'Guilt',          dominant: 'black',  secondary: 'grey',   noneRatio: 0.25 },
  { name: 'Sadness',        dominant: 'blue',   secondary: 'black',  noneRatio: 0.10 },
  { name: 'Compassion',     dominant: 'grey',   secondary: 'pink',   noneRatio: 0.35 },
  { name: 'Relief',         dominant: 'blue',   secondary: 'green',  noneRatio: 0.25 },
  { name: 'Love',           dominant: 'red',    secondary: 'pink',   noneRatio: 0.05 },
  { name: 'Admiration',     dominant: 'red',    secondary: 'green',  noneRatio: 0.15 },
  { name: 'Contentment',    dominant: 'green',  secondary: 'teal',   noneRatio: 0.20 },
  { name: 'Pleasure',       dominant: 'yellow', secondary: 'orange', noneRatio: 0.10 },
  { name: 'Joy',            dominant: 'yellow', secondary: 'orange', noneRatio: 0.05 },
  { name: 'Pride',          dominant: 'red',    secondary: 'orange', noneRatio: 0.15 },
  { name: 'Amusement',      dominant: 'yellow', secondary: 'green',  noneRatio: 0.10 },
  { name: 'Interest',       dominant: 'purple', secondary: 'yellow', noneRatio: 0.20 },
];
