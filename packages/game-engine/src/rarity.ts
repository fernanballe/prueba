import type { RarityLevel, PackRarityWeights } from '@worlddex/shared-types';

export function drawRarity(weights: PackRarityWeights): RarityLevel {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;

  const entries: Array<[RarityLevel, number]> = [
    ['legendary', weights.legendary],
    ['epic', weights.epic],
    ['rare', weights.rare],
    ['uncommon', weights.uncommon],
    ['common', weights.common],
  ];

  for (const [level, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return level;
  }

  return 'common';
}

export function getRarityStars(rarity: RarityLevel): string {
  const starMap: Record<RarityLevel, string> = {
    common: '⭐',
    uncommon: '⭐⭐',
    rare: '⭐⭐⭐',
    epic: '⭐⭐⭐⭐',
    legendary: '⭐⭐⭐⭐⭐',
  };
  return starMap[rarity];
}
