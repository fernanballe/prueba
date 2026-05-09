# 04 · Estructura del proyecto

Esta es la organización del monorepo. Tenerla clara te ayudará a saber dónde Claude Code debe poner cada cosa.

```
worlddex/
│
├── apps/
│   └── mobile/                          📱 La app React Native + Expo
│       ├── app/                         ← Expo Router: estructura de pantallas
│       │   ├── (auth)/                  ← Pantallas de login/registro
│       │   │   ├── login.tsx
│       │   │   └── signup.tsx
│       │   ├── (tabs)/                  ← Tabs principales del juego
│       │   │   ├── _layout.tsx          ← Definición de los tabs
│       │   │   ├── atlas.tsx            🗺️  Mapa mundial con países
│       │   │   ├── passport.tsx         🛂 Pasaporte Vivo
│       │   │   ├── play.tsx             🎮 Hub de mecánicas
│       │   │   ├── social.tsx           🏆 Liga, amigos, duelos
│       │   │   └── profile.tsx          👤 Perfil del usuario
│       │   ├── country/
│       │   │   └── [id].tsx             ← Detalle de un país (dinámico)
│       │   ├── trivia/
│       │   │   └── [countryId].tsx      ← Pantalla de trivia
│       │   ├── game/
│       │   │   └── [gameId].tsx         ← Juegos tradicionales
│       │   └── _layout.tsx              ← Layout raíz de la app
│       │
│       ├── src/
│       │   ├── components/              ← UI components reutilizables
│       │   │   ├── CountryCard.tsx
│       │   │   ├── CollectibleCard.tsx
│       │   │   ├── PassportStamp.tsx
│       │   │   ├── RarityBadge.tsx
│       │   │   └── ...
│       │   ├── hooks/                   ← Custom React hooks
│       │   │   ├── useAuth.ts
│       │   │   ├── useCountries.ts
│       │   │   └── ...
│       │   ├── stores/                  ← Estado global (Zustand)
│       │   │   ├── authStore.ts
│       │   │   ├── gameStore.ts
│       │   │   └── ...
│       │   ├── services/                ← APIs y conexiones externas
│       │   │   ├── supabase.ts          ← Cliente Supabase
│       │   │   ├── trivia.ts
│       │   │   ├── collectibles.ts
│       │   │   └── ...
│       │   ├── lib/                     ← Utilities puras
│       │   │   ├── geo.ts               ← Cálculos GPS, point-in-polygon
│       │   │   ├── rarity.ts            ← Pesos de rareza
│       │   │   └── format.ts
│       │   └── types/                   ← Tipos locales
│       │
│       ├── assets/
│       │   ├── fonts/
│       │   ├── flags/                   ← SVG/PNG de banderas
│       │   ├── stamps/                  ← Imágenes de sellos
│       │   └── icons/
│       │
│       ├── app.json                     ← Config Expo
│       ├── babel.config.js
│       ├── tailwind.config.js           ← Config NativeWind
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared-types/                    🔗 Tipos TS compartidos
│   │   └── src/
│   │       ├── domain.ts                ← Country, Collectible, User...
│   │       └── api.ts
│   │
│   ├── game-engine/                     ⚙️ Lógica pura del juego
│   │   └── src/
│   │       ├── rarity.ts                ← Cálculo de probabilidades
│   │       ├── seals.ts                 ← Lógica de sellos
│   │       ├── expeditions.ts           ← Reglas de expediciones
│   │       └── visa-progression.ts      ← Progresión de visados
│   │
│   └── supabase-schema/                 🗄️ Tipos generados de Supabase
│       └── src/
│           └── database.types.ts        ← Generado automáticamente
│
├── docs/
│   ├── GDD.md                           ← Game Design Document
│   └── architecture.md                  ← Decisiones técnicas
│
├── .env.example                         ← Plantilla de variables de entorno
├── .env                                 ← TUS credenciales (NO va a Git)
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── package.json                         ← Scripts del monorepo
├── turbo.json                           ← Config Turborepo
├── tsconfig.json                        ← TS base
└── README.md
```

---

## 🧠 Qué pone cada uno

### `apps/mobile/`
La app que se instala en el móvil. Todo lo visual, las pantallas, las interacciones. **Si Claude Code está creando una pantalla, va aquí**.

### `packages/game-engine/`
La **lógica pura** del juego, sin React Native. Funciones como "¿qué rareza me toca al abrir un sobre?" o "¿cuántos sellos cuesta subir a Embajador?". Se importa desde `apps/mobile`. **Esto es importante porque permite testear la lógica del juego sin levantar la app**.

### `packages/shared-types/`
Tipos TypeScript que usan tanto la app como los packages: `Country`, `Collectible`, `User`, etc. Una sola fuente de verdad.

### `packages/supabase-schema/`
Tipos **generados automáticamente** desde tu base de datos en Supabase. No los edites a mano — se regeneran con un comando.

---

## 🎯 Reglas que Claude Code debe respetar

1. **La lógica del juego va en `game-engine`**, no en componentes ni en pantallas
2. **Las llamadas a Supabase van en `services/`**, no directamente en componentes
3. **Los tipos de dominio van en `shared-types`**, no duplicados en cada archivo
4. **Las claves API nunca en código** — siempre desde `.env`

Si en algún prompt futuro Claude Code mete lógica de juego en una pantalla, recuérdale: *"Mueve esa lógica a `packages/game-engine/`"*.

---

WorldDex · Estructura · Mayo 2026
