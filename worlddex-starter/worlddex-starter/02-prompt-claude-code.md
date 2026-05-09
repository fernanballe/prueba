# 02 · El prompt inicial para Claude Code

Este es el prompt que pegarás en Claude Code cuando estés listo para arrancar. Está escrito para darle todo el contexto necesario para que construya la base sin ambigüedades.

---

## 📋 Antes de pegar el prompt

Asegúrate de que tienes:

1. ✅ Una carpeta vacía donde quieres el proyecto, ejemplo: `~/proyectos/worlddex`
2. ✅ Abierta una terminal en esa carpeta
3. ✅ Claude Code arrancado en esa terminal
4. ✅ Tus credenciales de Supabase a mano (Project URL + anon key)
5. ✅ La URL del repo de GitHub que creaste

---

## 🎯 PROMPT 1 — Inicialización del proyecto

> Copia y pega TODO este bloque en Claude Code en una sola conversación:

---

```
Hola Claude. Vamos a crear una nueva aplicación móvil llamada **WorldDex**, un juego de coleccionables culturales por países. Voy a darte primero el contexto completo y luego las tareas concretas.

═══════════════════════════════════════════════════════════════════
CONTEXTO DEL PRODUCTO
═══════════════════════════════════════════════════════════════════

WorldDex es un juego mobile (iOS y Android) donde los jugadores coleccionan items culturales de los 195 países del mundo a través de varias mecánicas:

1. Trivia por país (preguntas culturales)
2. GPS (al viajar físicamente al país, desbloquea items raros)
3. Juegos tradicionales reales del país (Mancala, Shogi, Mahjong, Pachisi...)
4. Minijuegos de territorio (el mapa del país es el tablero)
5. Lecciones de idioma (estilo Duolingo) por país
6. Sobres con coleccionables aleatorios
7. Misiones diarias y semanales
8. Liga semanal con ascenso y descenso
9. Duelos 1v1 contra amigos
10. Expediciones Globales (retos colectivos semanales)

El elemento central es el **Pasaporte Vivo**: cada usuario tiene un pasaporte digital que crece con sellos únicos según cómo conseguiste cada país. Es compartible en redes sociales (motor viral del juego).

Modelo de negocio: gratuito con anuncios voluntarios (rewarded ads) en momentos de alta tensión emocional (salvar racha, abrir sobre antes de tiempo, revivir en minijuego).

═══════════════════════════════════════════════════════════════════
STACK TÉCNICO
═══════════════════════════════════════════════════════════════════

- **Monorepo:** Turborepo
- **Mobile:** React Native + Expo (SDK más reciente estable)
- **Lenguaje:** TypeScript estricto
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Estado:** Zustand (cliente) + React Query (servidor)
- **Navegación:** Expo Router (file-based)
- **Estilos:** NativeWind (Tailwind para React Native)
- **Mapas:** react-native-maps
- **GPS:** expo-location
- **Notificaciones:** expo-notifications
- **Compartir:** expo-sharing + react-native-view-shot (para imagen del pasaporte)

═══════════════════════════════════════════════════════════════════
ESTRUCTURA DEL MONOREPO
═══════════════════════════════════════════════════════════════════

worlddex/
├── apps/
│   └── mobile/                  # App React Native + Expo
│       ├── app/                 # Expo Router (pantallas)
│       │   ├── (auth)/          # Login, registro
│       │   ├── (tabs)/          # Tabs principales
│       │   │   ├── atlas.tsx    # Mapa mundial
│       │   │   ├── passport.tsx # Pasaporte Vivo
│       │   │   ├── play.tsx     # Hub de juego
│       │   │   ├── social.tsx   # Liga, amigos, duelos
│       │   │   └── profile.tsx
│       │   ├── country/[id].tsx # Detalle de país
│       │   └── _layout.tsx
│       ├── src/
│       │   ├── components/      # Componentes UI
│       │   ├── hooks/           # Custom hooks
│       │   ├── stores/          # Zustand stores
│       │   ├── lib/             # Utilities
│       │   ├── services/        # Supabase, APIs
│       │   └── types/
│       └── assets/
├── packages/
│   ├── shared-types/            # Tipos TypeScript compartidos
│   ├── game-engine/             # Lógica pura del juego (rareza, sellos, expediciones)
│   └── supabase-schema/         # Tipos generados de Supabase
├── docs/
│   └── GDD.md                   # Game Design Document
├── .gitignore
├── .env.example
├── package.json
├── turbo.json
├── tsconfig.json
└── README.md

═══════════════════════════════════════════════════════════════════
TAREAS CONCRETAS PARA ESTA SESIÓN
═══════════════════════════════════════════════════════════════════

Quiero que en ESTA sesión hagas SOLO esto, sin pasar a features de juego todavía:

1. **Crea la estructura completa del monorepo** con Turborepo
2. **Configura TypeScript estricto** en todo el monorepo
3. **Inicializa la app Expo** en `apps/mobile` con Expo Router
4. **Configura NativeWind** (Tailwind para RN) con un tema base que use:
   - Color primario: dorado `#c9a84c`
   - Fondo: papel envejecido `#f5f0e8`
   - Tinta: negro `#0e0e0e`
   - Sello: gris `#7a7060`
   - Fuentes display: Playfair Display (serif clásica)
   - Fuentes body: DM Sans
   - Fuentes mono: DM Mono
5. **Configura el cliente de Supabase** en `apps/mobile/src/services/supabase.ts` leyendo de variables de entorno
6. **Crea las pantallas vacías** de la estructura de tabs con placeholders bonitos:
   - Atlas (mapa de mundo)
   - Pasaporte
   - Play (hub de juegos)
   - Social
   - Profile
7. **Configura autenticación** con Supabase Auth: pantalla de login y registro con email/password, redirección automática
8. **Crea el archivo `.env.example`** con las variables necesarias (sin valores reales) y `.env` con mis credenciales reales (te las pasaré ahora)
9. **Asegúrate de que `.env` está en `.gitignore`** (CRÍTICO)
10. **Inicializa Git**, haz el primer commit, pero NO hagas push todavía (yo configuraré el remote después)
11. **Genera tipos TypeScript desde el esquema de Supabase** usando la CLI de Supabase

Mis credenciales de Supabase (úsalas para el .env local pero NUNCA las commitees):

SUPABASE_URL=[YO_TE_DOY_LA_URL_AQUI]
SUPABASE_ANON_KEY=[YO_TE_DOY_LA_KEY_AQUI]

═══════════════════════════════════════════════════════════════════
PRINCIPIOS DE TRABAJO
═══════════════════════════════════════════════════════════════════

- **Calidad antes que velocidad**: código limpio, tipado, comentado en español donde aporte claridad
- **TypeScript estricto** en todo, sin `any`
- **Componentes pequeños** y reutilizables
- **No instales dependencias innecesarias**
- **Nombres en inglés** para código (variables, funciones, archivos), pero strings de UI en español
- Si tienes dudas sobre una decisión arquitectónica importante, **pregunta antes de implementar**
- Al terminar la sesión, dame un resumen claro de qué se creó, qué falta, y cómo correr la app

═══════════════════════════════════════════════════════════════════
RESULTADO ESPERADO AL FINAL
═══════════════════════════════════════════════════════════════════

Que pueda:
1. Correr `npm install` desde la raíz sin errores
2. Correr `npm run dev` (o el comando que configures) y que arranque Expo
3. Escanear el QR con Expo Go en mi móvil y ver la app con sus tabs vacías
4. Registrarme con email/password
5. Ver mi nombre en la pantalla de perfil

Empieza cuando quieras. Si necesitas alguna decisión por mi parte antes de empezar, pregúntame.
```

---

## 🔑 ANTES de pegar el prompt: rellena tus credenciales

Donde dice `[YO_TE_DOY_LA_URL_AQUI]` y `[YO_TE_DOY_LA_KEY_AQUI]`, sustituye por las que guardaste de Supabase en el paso 01.

Ejemplo:

```
SUPABASE_URL=https://abcdefghi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
```

---

## ⏱️ Qué esperar

Claude Code tardará entre **20 y 60 minutos** en completar todo. Te irá pidiendo confirmación para algunas acciones (instalar paquetes, ejecutar comandos). Acéptalas a menos que veas algo raro.

Al terminar, deberías poder:

```bash
cd worlddex
npm install
npm run dev
```

Y ver Expo arrancado, listo para escanear el QR con tu móvil.

---

## 📍 Siguiente paso

Cuando tengas la app corriendo, ve a **`05-compilar-instalar.md`** para verla en tu dispositivo.

Si todo va bien, después abre **`06-prompts-siguientes.md`** para construir las features una a una.

---

WorldDex · Prompt inicial · Mayo 2026
