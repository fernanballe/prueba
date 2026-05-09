import type { LeagueTier } from './database';

export interface LeagueConfig {
  tier: LeagueTier;
  label: string;
  color: string;
  minXpToPromote: number;
  maxXpToRelegate: number;
}

export const LEAGUE_CONFIG: Record<LeagueTier, LeagueConfig> = {
  bronze: { tier: 'bronze', label: 'Bronce', color: '#CD7F32', minXpToPromote: 1000, maxXpToRelegate: 0 },
  silver: { tier: 'silver', label: 'Plata', color: '#C0C0C0', minXpToPromote: 2500, maxXpToRelegate: 300 },
  gold: { tier: 'gold', label: 'Oro', color: '#FFD700', minXpToPromote: 5000, maxXpToRelegate: 800 },
  diamond: { tier: 'diamond', label: 'Diamante', color: '#B9F2FF', minXpToPromote: 10000, maxXpToRelegate: 1500 },
  elite: { tier: 'elite', label: 'Élite', color: '#FF6B6B', minXpToPromote: Infinity, maxXpToRelegate: 3000 },
};

export interface AuthUser {
  id: string;
  email: string | null;
  username?: string;
}
