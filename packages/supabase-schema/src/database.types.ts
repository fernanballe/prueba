// Este archivo se regenera con: npm run generate
// Cuando tengas el proyecto Supabase configurado, ejecuta ese comando
// para obtener los tipos reales generados desde tu esquema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
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
          bounds_geojson: Json | null;
          centroid_lat: number | null;
          centroid_lng: number | null;
          area_km2: number | null;
          population: number | null;
          fun_fact: string | null;
          traditional_game: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['countries']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['countries']['Insert']>;
      };
      profiles: {
        Row: {
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
          current_league: 'bronze' | 'silver' | 'gold' | 'diamond' | 'elite';
          weekly_league_xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      collectibles: {
        Row: {
          id: string;
          country_id: string;
          category: string;
          rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
          name_es: string;
          name_en: string;
          description_es: string | null;
          description_en: string | null;
          image_url: string | null;
          unlock_method: string | null;
          is_legendary_secret: boolean;
          fun_fact: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['collectibles']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['collectibles']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      rarity_level: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
      visa_level: 'tourist' | 'traveler' | 'resident' | 'ambassador';
      stamp_type: 'physical' | 'cultural' | 'expedition' | 'seasonal';
      league_tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'elite';
      expedition_status: 'active' | 'completed' | 'failed';
    };
  };
}
