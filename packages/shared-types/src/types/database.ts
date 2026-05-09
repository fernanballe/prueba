// Tipos que reflejan las tablas de Supabase

export type RarityLevel = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type VisaLevel = 'tourist' | 'traveler' | 'resident' | 'ambassador';
export type StampType = 'physical' | 'cultural' | 'expedition' | 'seasonal';
export type CollectibleCategory =
  | 'flag'
  | 'capital'
  | 'shield'
  | 'currency'
  | 'dish'
  | 'language'
  | 'monument'
  | 'animal'
  | 'festival'
  | 'historical_figure'
  | 'traditional_costume'
  | 'passport_stamp'
  | 'secret_legendary';
export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'elite';
export type ExpeditionStatus = 'active' | 'completed' | 'failed';

export interface Country {
  id: string;
  iso_code: string;
  iso_code_3: string;
  name_es: string;
  name_en: string;
  continent: string;
  region: string | null;
  capital: string | null;
  official_lang: string | null;
  currency_code: string | null;
  currency_name: string | null;
  flag_emoji: string | null;
  flag_image_url: string | null;
  bounds_geojson: unknown | null;
  centroid_lat: number | null;
  centroid_lng: number | null;
  area_km2: number | null;
  population: number | null;
  fun_fact: string | null;
  traditional_game: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  passport_skin: string;
  total_seals: number;
  lifetime_seals: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_played_at: string | null;
  countries_visited: number;
  countries_completed: number;
  current_league: LeagueTier;
  weekly_league_xp: number;
  created_at: string;
  updated_at: string;
}

export interface Collectible {
  id: string;
  country_id: string;
  category: CollectibleCategory;
  rarity: RarityLevel;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  image_url: string | null;
  unlock_method: string | null;
  is_legendary_secret: boolean;
  fun_fact: string | null;
  created_at: string;
}

export interface UserCollectible {
  id: string;
  user_id: string;
  collectible_id: string;
  obtained_at: string;
  obtained_method: string | null;
  quantity: number;
  is_favorite: boolean;
}

export interface UserVisa {
  id: string;
  user_id: string;
  country_id: string;
  level: VisaLevel;
  country_seals: number;
  country_xp: number;
  trivia_completed: number;
  language_level: number;
  game_mastered: boolean;
  obtained_at: string;
  upgraded_at: string | null;
}

export interface UserStamp {
  id: string;
  user_id: string;
  country_id: string | null;
  stamp_type: StampType;
  stamp_image_url: string | null;
  obtained_at: string;
  metadata: Record<string, unknown> | null;
  is_unique: boolean;
}

export interface TriviaQuestion {
  id: string;
  country_id: string | null;
  category: string | null;
  difficulty: number;
  question_es: string;
  question_en: string | null;
  correct_answer: string;
  wrong_answers: string[];
  explanation: string | null;
  source: string | null;
  approved: boolean;
  created_at: string;
}

export interface Expedition {
  id: string;
  title_es: string;
  description_es: string | null;
  target_continent: string | null;
  target_points: number;
  current_points: number;
  status: ExpeditionStatus;
  unique_stamp_url: string | null;
  starts_at: string;
  ends_at: string;
  created_at: string;
}
