import type { RarityLevel } from '@worlddex/shared-types';

const XP_BY_RARITY: Record<RarityLevel, number> = {
  common: 10,
  uncommon: 25,
  rare: 60,
  epic: 150,
  legendary: 500,
};

export function xpForCollectible(rarity: RarityLevel): number {
  return XP_BY_RARITY[rarity];
}

export function xpForTriviaAnswer(correct: boolean, timeTakenMs: number): number {
  if (!correct) return 0;
  const baseXp = 20;
  const speedBonus = timeTakenMs < 5000 ? 10 : timeTakenMs < 10000 ? 5 : 0;
  return baseXp + speedBonus;
}

export function xpForGpsVisit(): number {
  return 200;
}
