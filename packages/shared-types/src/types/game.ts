import type { RarityLevel } from './database';

export interface RarityConfig {
  level: RarityLevel;
  label: string;
  color: string;
  stars: number;
  dropRateBase: number; // porcentaje en sobres estándar
}

export const RARITY_CONFIG: Record<RarityLevel, RarityConfig> = {
  common: { level: 'common', label: 'Común', color: '#9E9E9E', stars: 1, dropRateBase: 60 },
  uncommon: { level: 'uncommon', label: 'Poco común', color: '#4CAF50', stars: 2, dropRateBase: 30 },
  rare: { level: 'rare', label: 'Raro', color: '#2196F3', stars: 3, dropRateBase: 8 },
  epic: { level: 'epic', label: 'Épico', color: '#9C27B0', stars: 4, dropRateBase: 1.8 },
  legendary: { level: 'legendary', label: 'Legendario', color: '#FF9800', stars: 5, dropRateBase: 0.2 },
};

export interface PackRarityWeights {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface GameSession {
  userId: string;
  countryId: string;
  startedAt: Date;
  gameType: 'trivia' | 'traditional_game' | 'language';
}
