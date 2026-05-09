-- ═══════════════════════════════════════════════════════════════════════
-- WorldDex · Database Schema v1.0
-- ═══════════════════════════════════════════════════════════════════════
-- Ejecuta este archivo completo en Supabase:
--   1. Ve a tu proyecto en supabase.com
--   2. Menú lateral → SQL Editor → New Query
--   3. Pega TODO este contenido
--   4. Click "Run" (o Cmd+Enter)
--   5. Verifica que no haya errores
-- ═══════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────
-- EXTENSIONES
-- ─────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- Para queries geográficas (GPS)

-- ─────────────────────────────────────────────────────────────────────
-- ENUMS — tipos enumerados
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE rarity_level AS ENUM (
  'common',      -- ⭐
  'uncommon',    -- ⭐⭐
  'rare',        -- ⭐⭐⭐
  'epic',        -- ⭐⭐⭐⭐
  'legendary'    -- ⭐⭐⭐⭐⭐
);

CREATE TYPE visa_level AS ENUM (
  'tourist',     -- 1: Turista (gratis al entrar)
  'traveler',    -- 2: Viajero
  'resident',    -- 3: Residente
  'ambassador'   -- 4: Embajador
);

CREATE TYPE stamp_type AS ENUM (
  'physical',    -- Sello físico (GPS real)
  'cultural',    -- Sello cultural (trivia + idioma + juego)
  'expedition',  -- Sello de Expedición Global
  'seasonal'    -- Sello de evento estacional
);

CREATE TYPE collectible_category AS ENUM (
  'flag',
  'capital',
  'shield',
  'currency',
  'dish',
  'language',
  'monument',
  'animal',
  'festival',
  'historical_figure',
  'traditional_costume',
  'passport_stamp',
  'secret_legendary'
);

CREATE TYPE league_tier AS ENUM (
  'bronze',
  'silver',
  'gold',
  'diamond',
  'elite'
);

CREATE TYPE expedition_status AS ENUM (
  'active',
  'completed',
  'failed'
);

-- ─────────────────────────────────────────────────────────────────────
-- COUNTRIES — los 195 países (catálogo maestro)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE countries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  iso_code        VARCHAR(2) UNIQUE NOT NULL,        -- ES, FR, JP...
  iso_code_3      VARCHAR(3) UNIQUE NOT NULL,        -- ESP, FRA, JPN...
  name_es         VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100) NOT NULL,
  continent       VARCHAR(50) NOT NULL,              -- Europe, Asia...
  region          VARCHAR(100),                      -- Western Europe...
  capital         VARCHAR(100),
  official_lang   VARCHAR(50),
  currency_code   VARCHAR(10),
  currency_name   VARCHAR(100),
  flag_emoji      VARCHAR(10),
  flag_image_url  TEXT,
  bounds_geojson  JSONB,                             -- Polígono de fronteras
  centroid_lat    DOUBLE PRECISION,
  centroid_lng    DOUBLE PRECISION,
  area_km2        BIGINT,
  population      BIGINT,
  fun_fact        TEXT,
  traditional_game VARCHAR(100),                     -- Mancala, Shogi...
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_countries_continent ON countries(continent);
CREATE INDEX idx_countries_iso ON countries(iso_code);

-- ─────────────────────────────────────────────────────────────────────
-- USERS — extiende auth.users de Supabase
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username            VARCHAR(30) UNIQUE NOT NULL,
  display_name        VARCHAR(60),
  avatar_url          TEXT,
  passport_skin       VARCHAR(50) DEFAULT 'classic',
  total_seals         INTEGER DEFAULT 0,             -- Moneda actual
  lifetime_seals      INTEGER DEFAULT 0,             -- Total ganado
  total_xp            INTEGER DEFAULT 0,
  current_streak      INTEGER DEFAULT 0,
  longest_streak      INTEGER DEFAULT 0,
  last_played_at      TIMESTAMPTZ,
  countries_visited   INTEGER DEFAULT 0,             -- Por GPS
  countries_completed INTEGER DEFAULT 0,             -- Cualquier sello
  current_league      league_tier DEFAULT 'bronze',
  weekly_league_xp    INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_league ON profiles(current_league, weekly_league_xp DESC);

-- ─────────────────────────────────────────────────────────────────────
-- COLLECTIBLES — definición de coleccionables (catálogo)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE collectibles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id      UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  category        collectible_category NOT NULL,
  rarity          rarity_level NOT NULL,
  name_es         VARCHAR(150) NOT NULL,
  name_en         VARCHAR(150) NOT NULL,
  description_es  TEXT,
  description_en  TEXT,
  image_url       TEXT,
  unlock_method   VARCHAR(100),                       -- 'trivia', 'gps', 'pack', 'language'
  is_legendary_secret BOOLEAN DEFAULT FALSE,           -- 1 por país
  fun_fact        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collectibles_country ON collectibles(country_id);
CREATE INDEX idx_collectibles_rarity ON collectibles(rarity);

-- ─────────────────────────────────────────────────────────────────────
-- USER_COLLECTIBLES — qué tiene cada jugador
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE user_collectibles (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collectible_id     UUID NOT NULL REFERENCES collectibles(id) ON DELETE CASCADE,
  obtained_at        TIMESTAMPTZ DEFAULT NOW(),
  obtained_method    VARCHAR(100),                     -- 'trivia', 'gps', 'pack'...
  quantity           INTEGER DEFAULT 1,                -- Para duplicados (intercambios)
  is_favorite        BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, collectible_id)
);

CREATE INDEX idx_user_collectibles_user ON user_collectibles(user_id);

-- ─────────────────────────────────────────────────────────────────────
-- USER_VISAS — nivel de visado de cada usuario por país
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE user_visas (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  country_id      UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  level           visa_level DEFAULT 'tourist',
  country_seals   INTEGER DEFAULT 0,                  -- Sellos ganados en este país
  country_xp      INTEGER DEFAULT 0,
  trivia_completed INTEGER DEFAULT 0,
  language_level  INTEGER DEFAULT 0,                  -- 0-4
  game_mastered   BOOLEAN DEFAULT FALSE,
  obtained_at     TIMESTAMPTZ DEFAULT NOW(),
  upgraded_at     TIMESTAMPTZ,
  UNIQUE(user_id, country_id)
);

CREATE INDEX idx_user_visas_user ON user_visas(user_id);

-- ─────────────────────────────────────────────────────────────────────
-- USER_STAMPS — el Pasaporte Vivo
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE user_stamps (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  country_id      UUID REFERENCES countries(id) ON DELETE SET NULL,
  stamp_type      stamp_type NOT NULL,
  stamp_image_url TEXT,
  obtained_at     TIMESTAMPTZ DEFAULT NOW(),
  metadata        JSONB,                              -- Datos extra: GPS coords, expedition_id, evento...
  is_unique       BOOLEAN DEFAULT FALSE               -- Sellos irrepetibles (Expediciones)
);

CREATE INDEX idx_user_stamps_user ON user_stamps(user_id);
CREATE INDEX idx_user_stamps_country ON user_stamps(country_id);

-- ─────────────────────────────────────────────────────────────────────
-- TRIVIA_QUESTIONS — banco de preguntas
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE trivia_questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id      UUID REFERENCES countries(id) ON DELETE CASCADE,
  category        VARCHAR(50),                        -- history, food, geography, culture
  difficulty      INTEGER DEFAULT 1,                  -- 1-3
  question_es     TEXT NOT NULL,
  question_en     TEXT,
  correct_answer  TEXT NOT NULL,
  wrong_answers   TEXT[] NOT NULL,                    -- Array de 3 respuestas falsas
  explanation     TEXT,                               -- Explicación tras responder
  source          VARCHAR(255),
  approved        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trivia_country ON trivia_questions(country_id);
CREATE INDEX idx_trivia_difficulty ON trivia_questions(difficulty);

-- ─────────────────────────────────────────────────────────────────────
-- TRIVIA_ATTEMPTS — historial de intentos del usuario
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE trivia_attempts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES trivia_questions(id) ON DELETE CASCADE,
  is_correct      BOOLEAN NOT NULL,
  time_taken_ms   INTEGER,
  attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trivia_attempts_user ON trivia_attempts(user_id);

-- ─────────────────────────────────────────────────────────────────────
-- GPS_VISITS — registro de visitas por GPS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE gps_visits (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  country_id        UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  duration_minutes  INTEGER DEFAULT 0,                 -- Tiempo permanecido (anti-trampa)
  verified          BOOLEAN DEFAULT FALSE,             -- Pasó el umbral mínimo
  rewarded          BOOLEAN DEFAULT FALSE,             -- Ya se le dio el Épico
  visited_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gps_visits_user ON gps_visits(user_id);

-- ─────────────────────────────────────────────────────────────────────
-- PACKS — sobres comprables
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE pack_definitions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_es         VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  cost_seals      INTEGER NOT NULL,
  num_collectibles INTEGER DEFAULT 5,
  rarity_weights  JSONB NOT NULL,                     -- {"common": 60, "uncommon": 30, ...}
  guaranteed_min_rarity rarity_level,
  continent_filter VARCHAR(50),                       -- Si es continental
  category_filter  VARCHAR(50),                       -- Si es temático
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pack_openings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pack_id         UUID NOT NULL REFERENCES pack_definitions(id),
  collectibles_obtained UUID[] NOT NULL,
  opened_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pack_openings_user ON pack_openings(user_id);

-- ─────────────────────────────────────────────────────────────────────
-- DAILY_MISSIONS — misiones diarias y semanales
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE missions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            VARCHAR(20) NOT NULL,               -- 'daily', 'weekly'
  title_es        VARCHAR(200) NOT NULL,
  description_es  TEXT,
  goal_type       VARCHAR(50),                        -- 'trivia_correct', 'gps_visit', 'pack_open'
  goal_target     INTEGER,
  reward_seals    INTEGER DEFAULT 0,
  reward_pack_id  UUID REFERENCES pack_definitions(id),
  active_from     TIMESTAMPTZ NOT NULL,
  active_until    TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_mission_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id      UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  reward_claimed  BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, mission_id)
);

CREATE INDEX idx_user_missions_user ON user_mission_progress(user_id);

-- ─────────────────────────────────────────────────────────────────────
-- EXPEDITIONS — expediciones globales (mecánica viral)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE expeditions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_es          VARCHAR(200) NOT NULL,
  description_es    TEXT,
  target_continent  VARCHAR(50),
  target_points     BIGINT NOT NULL,                   -- Meta global
  current_points    BIGINT DEFAULT 0,
  status            expedition_status DEFAULT 'active',
  unique_stamp_url  TEXT,                              -- Imagen del sello irrepetible
  starts_at         TIMESTAMPTZ NOT NULL,
  ends_at           TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expedition_contributions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expedition_id   UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points          BIGINT DEFAULT 0,
  rank            INTEGER,                             -- Posición final
  stamp_awarded   BOOLEAN DEFAULT FALSE,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(expedition_id, user_id)
);

CREATE INDEX idx_expedition_contributions_exp ON expedition_contributions(expedition_id, points DESC);

-- ─────────────────────────────────────────────────────────────────────
-- DUELS — duelos 1v1
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE duels (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opponent_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  country_id      UUID REFERENCES countries(id),
  status          VARCHAR(20) DEFAULT 'pending',       -- pending, in_progress, finished
  winner_id       UUID REFERENCES profiles(id),
  challenger_score INTEGER DEFAULT 0,
  opponent_score   INTEGER DEFAULT 0,
  stolen_collectible_id UUID REFERENCES collectibles(id),
  started_at      TIMESTAMPTZ,
  finished_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_duels_challenger ON duels(challenger_id);
CREATE INDEX idx_duels_opponent ON duels(opponent_id);

-- ─────────────────────────────────────────────────────────────────────
-- FRIENDSHIPS — sistema de amigos
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE friendships (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status          VARCHAR(20) DEFAULT 'pending',       -- pending, accepted, blocked
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK(user_id != friend_id)
);

-- ─────────────────────────────────────────────────────────────────────
-- DAILY_ROULETTE — registro de la ruleta diaria
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE roulette_spins (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_type     VARCHAR(50),                         -- 'seals', 'collectible', 'xp_boost'
  reward_value    JSONB,
  spun_at         TIMESTAMPTZ DEFAULT NOW(),
  is_ad_bonus     BOOLEAN DEFAULT FALSE                -- Si fue tirada extra por anuncio
);

CREATE INDEX idx_roulette_user ON roulette_spins(user_id, spun_at DESC);

-- ─────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — seguridad de Supabase
-- ─────────────────────────────────────────────────────────────────────

-- Activar RLS en tablas con datos de usuario
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collectibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedition_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE roulette_spins ENABLE ROW LEVEL SECURITY;

-- Políticas: el usuario solo ve y modifica sus propios datos
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users see own collectibles" ON user_collectibles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own visas" ON user_visas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own stamps" ON user_stamps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own attempts" ON trivia_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own gps visits" ON gps_visits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own pack openings" ON pack_openings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own mission progress" ON user_mission_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own expedition contributions" ON expedition_contributions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own roulette spins" ON roulette_spins FOR ALL USING (auth.uid() = user_id);

-- Lectura pública de datos compartidos
CREATE POLICY "Public reads countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public reads collectibles catalog" ON collectibles FOR SELECT USING (true);
CREATE POLICY "Public reads trivia (approved)" ON trivia_questions FOR SELECT USING (approved = true);
CREATE POLICY "Public reads packs" ON pack_definitions FOR SELECT USING (active = true);
CREATE POLICY "Public reads missions" ON missions FOR SELECT USING (true);
CREATE POLICY "Public reads expeditions" ON expeditions FOR SELECT USING (true);

-- Profiles públicos (para rankings, amigos)
CREATE POLICY "Public reads profiles basic" ON profiles FOR SELECT USING (true);

-- Duelos: ambos jugadores pueden ver
CREATE POLICY "Duel participants see" ON duels FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Amistades: ambos lados ven
CREATE POLICY "Friendship participants see" ON friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users manage own friendships" ON friendships FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────
-- TRIGGERS — actualizar updated_at automáticamente
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────────────
-- DATOS SEMILLA — algunos países iniciales para empezar a probar
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO countries (iso_code, iso_code_3, name_es, name_en, continent, region, capital, official_lang, currency_code, currency_name, flag_emoji, centroid_lat, centroid_lng, traditional_game) VALUES
('ES', 'ESP', 'España', 'Spain', 'Europe', 'Southern Europe', 'Madrid', 'Español', 'EUR', 'Euro', '🇪🇸', 40.4637, -3.7492, 'Mus'),
('FR', 'FRA', 'Francia', 'France', 'Europe', 'Western Europe', 'París', 'Francés', 'EUR', 'Euro', '🇫🇷', 46.2276, 2.2137, 'Pétanque'),
('JP', 'JPN', 'Japón', 'Japan', 'Asia', 'Eastern Asia', 'Tokio', 'Japonés', 'JPY', 'Yen', '🇯🇵', 36.2048, 138.2529, 'Shogi'),
('CN', 'CHN', 'China', 'China', 'Asia', 'Eastern Asia', 'Pekín', 'Mandarín', 'CNY', 'Yuan', '🇨🇳', 35.8617, 104.1954, 'Mahjong'),
('IN', 'IND', 'India', 'India', 'Asia', 'Southern Asia', 'Nueva Delhi', 'Hindi', 'INR', 'Rupia', '🇮🇳', 20.5937, 78.9629, 'Pachisi'),
('GH', 'GHA', 'Ghana', 'Ghana', 'Africa', 'Western Africa', 'Acra', 'Inglés', 'GHS', 'Cedi', '🇬🇭', 7.9465, -1.0232, 'Oware'),
('BR', 'BRA', 'Brasil', 'Brazil', 'Americas', 'South America', 'Brasilia', 'Portugués', 'BRL', 'Real', '🇧🇷', -14.2350, -51.9253, 'Capoeira'),
('MX', 'MEX', 'México', 'Mexico', 'Americas', 'Central America', 'Ciudad de México', 'Español', 'MXN', 'Peso', '🇲🇽', 23.6345, -102.5528, 'Lotería'),
('AR', 'ARG', 'Argentina', 'Argentina', 'Americas', 'South America', 'Buenos Aires', 'Español', 'ARS', 'Peso', '🇦🇷', -38.4161, -63.6167, 'Truco'),
('KR', 'KOR', 'Corea del Sur', 'South Korea', 'Asia', 'Eastern Asia', 'Seúl', 'Coreano', 'KRW', 'Won', '🇰🇷', 35.9078, 127.7669, 'Yut Nori'),
('TR', 'TUR', 'Turquía', 'Turkey', 'Asia', 'Western Asia', 'Ankara', 'Turco', 'TRY', 'Lira', '🇹🇷', 38.9637, 35.2433, 'Tavla'),
('MN', 'MNG', 'Mongolia', 'Mongolia', 'Asia', 'Eastern Asia', 'Ulán Bator', 'Mongol', 'MNT', 'Tugrik', '🇲🇳', 46.8625, 103.8467, 'Shagai'),
('GB', 'GBR', 'Reino Unido', 'United Kingdom', 'Europe', 'Northern Europe', 'Londres', 'Inglés', 'GBP', 'Libra', '🇬🇧', 55.3781, -3.4360, 'Cricket'),
('IT', 'ITA', 'Italia', 'Italy', 'Europe', 'Southern Europe', 'Roma', 'Italiano', 'EUR', 'Euro', '🇮🇹', 41.8719, 12.5674, 'Briscola'),
('DE', 'DEU', 'Alemania', 'Germany', 'Europe', 'Western Europe', 'Berlín', 'Alemán', 'EUR', 'Euro', '🇩🇪', 51.1657, 10.4515, 'Skat')
ON CONFLICT (iso_code) DO NOTHING;

-- Ejemplo: coleccionables iniciales para España
INSERT INTO collectibles (country_id, category, rarity, name_es, name_en, description_es, unlock_method)
SELECT
  c.id,
  cat::collectible_category,
  rar::rarity_level,
  CASE cat
    WHEN 'flag' THEN 'Bandera de España'
    WHEN 'capital' THEN 'Madrid'
    WHEN 'currency' THEN 'Euro'
    WHEN 'dish' THEN 'Paella Valenciana'
    WHEN 'monument' THEN 'Sagrada Familia'
    WHEN 'animal' THEN 'Toro Bravo'
    WHEN 'historical_figure' THEN 'Cervantes'
    WHEN 'secret_legendary' THEN 'Tesoro Secreto Español'
  END,
  CASE cat
    WHEN 'flag' THEN 'Flag of Spain'
    WHEN 'capital' THEN 'Madrid'
    WHEN 'currency' THEN 'Euro'
    WHEN 'dish' THEN 'Valencian Paella'
    WHEN 'monument' THEN 'Sagrada Familia'
    WHEN 'animal' THEN 'Spanish Bull'
    WHEN 'historical_figure' THEN 'Cervantes'
    WHEN 'secret_legendary' THEN 'Spanish Hidden Treasure'
  END,
  'Coleccionable inicial de España',
  CASE rar
    WHEN 'common' THEN 'trivia'
    WHEN 'uncommon' THEN 'trivia'
    WHEN 'rare' THEN 'pack'
    WHEN 'epic' THEN 'gps_or_pack'
    WHEN 'legendary' THEN 'gps_only'
  END
FROM countries c
CROSS JOIN (VALUES
  ('flag', 'common'),
  ('capital', 'common'),
  ('currency', 'uncommon'),
  ('dish', 'uncommon'),
  ('monument', 'rare'),
  ('animal', 'rare'),
  ('historical_figure', 'epic'),
  ('secret_legendary', 'legendary')
) AS coll(cat, rar)
WHERE c.iso_code = 'ES'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- ¡LISTO!
-- ─────────────────────────────────────────────────────────────────────
-- Para verificar que todo se creó correctamente:
-- SELECT count(*) FROM countries;          -- Debería mostrar 15
-- SELECT count(*) FROM collectibles;        -- Debería mostrar 8 (España)
-- SELECT * FROM countries WHERE iso_code = 'ES';
-- ─────────────────────────────────────────────────────────────────────
