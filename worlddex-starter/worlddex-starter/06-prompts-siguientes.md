# 06 · Prompts siguientes (uno por feature)

Después del prompt inicial que generó la base, estos son los **prompts ordenados** para construir cada mecánica del juego. Hazlos en orden — cada uno se apoya en el anterior.

**Regla de oro:** después de cada prompt, **pruébalo en tu móvil** y haz commit antes de pasar al siguiente.

---

## 🗺️ PROMPT 2 — Atlas mundial con países

```
Vamos a construir la pantalla del Atlas (la pestaña principal del juego).

Quiero:

1. En la pantalla `app/(tabs)/atlas.tsx`, mostrar un mapa del mundo con react-native-maps
2. Cargar los países desde Supabase usando React Query
3. Marcar cada país con un pin de color según el estado del usuario:
   - Gris claro: no visitado, sin coleccionables
   - Dorado tenue: con algún coleccionable
   - Dorado fuerte: completado (todos los coleccionables comunes)
   - Con sello: visitado físicamente (GPS)
4. Al tocar un país, navegar a `app/country/[id].tsx` que muestre:
   - Nombre del país, capital, bandera
   - Nivel de Visado actual del usuario en ese país
   - Lista de coleccionables del país (los que tiene marcados, los que faltan en silueta)
   - Botones: "Jugar trivia", "Juego tradicional" (cuando haya), "Ver minijuegos"
5. La pantalla del país debe usar el componente `CollectibleCard` reutilizable
6. Toda la lógica de cómo determinar el estado de un país (gris, dorado, etc.) va en `packages/game-engine/src/country-status.ts`

Usa el diseño visual del GDD: colores papel/dorado/tinta, fuentes Playfair + DM Sans, sensación de pasaporte clásico. Los pines del mapa pueden ser sellos circulares pequeños.

Cuando termines, dime qué falta y cómo probarlo. Haz un commit con mensaje descriptivo.
```

---

## 🧠 PROMPT 3 — Sistema de Trivia

```
Ahora la mecánica core: trivia por país.

1. Crea `app/trivia/[countryId].tsx` que:
   - Carga 10 preguntas aleatorias del país desde Supabase
   - Muestra una pregunta a la vez con 4 opciones de respuesta
   - Al responder, anima si es correcta (verde) o incorrecta (rojo)
   - Muestra la explicación
   - Al terminar las 10, muestra un resumen con Sellos ganados

2. Lógica de puntuación (en `packages/game-engine/src/trivia-scoring.ts`):
   - Respuesta correcta: 10 Sellos + 5 XP de país
   - Racha de 3+ correctas seguidas: bonus +50%
   - Racha de 5+: bonus +100%
   - Tiempo de respuesta < 5s: bonus extra +20%

3. Después de cada partida, actualizar en Supabase:
   - `profiles.total_seals` y `lifetime_seals`
   - `user_visas.country_seals` y `country_xp` (crear visa si no existe)
   - `trivia_attempts` con cada respuesta

4. Lógica para desbloquear coleccionables (también en game-engine):
   - Al alcanzar 5 country_seals → desbloquear primer Poco Común
   - Al alcanzar 20 → primer Raro
   - Al alcanzar 80 → primer Épico (si no tiene visita GPS)
   Inserta los coleccionables en `user_collectibles` cuando se desbloqueen

5. Componente `TriviaQuestion.tsx` reutilizable
6. Hook `useTrivia(countryId)` que encapsula la lógica de la sesión

IMPORTANTE: Si no hay preguntas en la base de datos para algunos países, crea un script de seed con preguntas de muestra para España, Japón y México (al menos 20 por país, mezcla de difícultades). Pon ese script en `apps/mobile/scripts/seed-trivia.ts`.

Cuando termines, prueba que puedo jugar trivia de España y ver Sellos sumándose. Commit.
```

---

## 🛂 PROMPT 4 — El Pasaporte Vivo (la feature estrella)

```
Vamos con la mecánica diferenciadora: el Pasaporte Vivo compartible.

1. Pantalla `app/(tabs)/passport.tsx`:
   - Diseño tipo pasaporte real abierto: dos páginas visibles
   - Página izquierda: foto del usuario, nombre, "Embajador WorldDex desde [fecha]", países completados, sellos totales
   - Página derecha: grid de sellos del usuario (de la tabla user_stamps)
   - Cada sello se renderiza diferente según `stamp_type`:
     * physical: con textura, tinta densa, ligera rotación aleatoria
     * cultural: tinta más clara, redondo
     * expedition: con borde dorado y la fecha grabada
     * seasonal: con un emoji del evento
   - Permite hacer scroll infinito si hay muchas páginas

2. Componente `PassportStamp.tsx` con las 4 variantes visuales

3. Botón "Compartir mi pasaporte" en la esquina superior derecha:
   - Genera una imagen del pasaporte usando react-native-view-shot
   - Abre el share sheet del sistema (expo-sharing)
   - El texto del compartir es "Mi pasaporte WorldDex · [N] países descubiertos"
   - Incluye el username del usuario en la imagen como marca de agua

4. Lógica para generar sellos automáticamente:
   - Al completar todos los coleccionables comunes de un país → cultural stamp
   - Al hacer una visita GPS verificada → physical stamp
   - Al participar y completar una expedición → expedition stamp
   Esa lógica va en `packages/game-engine/src/stamp-rules.ts`

5. Cuando se gana un sello nuevo, mostrar una animación de celebración en pantalla (modal con confetti opcional, sello apareciendo con bounce, sonido si lo añades).

Asegúrate de que los sellos se ven bonitos en la imagen compartida — esto es lo que va a viralizar el juego.

Cuando termines, prueba que puedo conseguir un sello completando trivias de un país y compartirlo. Commit.
```

---

## 📍 PROMPT 5 — Detección GPS

```
Ahora la mecánica que da los items raros: detección de país por GPS.

1. Configura permisos de ubicación en `app.json` (NSLocationWhenInUseUsageDescription para iOS, ACCESS_FINE_LOCATION para Android)

2. Hook `useLocationTracking()` en `src/hooks/useLocationTracking.ts`:
   - Solicita permisos al usuario con un mensaje amigable explicando para qué
   - Usa expo-location para obtener la ubicación periódicamente (cada 5 minutos cuando la app está abierta)
   - Determina en qué país está el usuario usando los polígonos de countries.bounds_geojson (lógica point-in-polygon en `packages/game-engine/src/geo.ts`)

3. Lógica de verificación anti-trampa (en game-engine):
   - Una visita solo se "verifica" tras 30 minutos consecutivos detectado en el país
   - Antes de los 30 min se guarda como visita en progreso
   - Si el usuario sale del país antes, se reinicia
   
4. Cuando una visita se verifica:
   - Insertar en gps_visits con verified=true
   - Otorgar automáticamente:
     * Un sello físico (user_stamps con type='physical')
     * Un coleccionable Épico aleatorio del país
     * 30% probabilidad de coleccionable Legendario del país
   - Mostrar notificación push: "¡Bienvenido a [País]! Has desbloqueado [coleccionable]"

5. Pantalla `app/(tabs)/play.tsx` muestra una sección "Visita actual":
   - Si está en su país de residencia: nada especial
   - Si está en otro país: muestra "Estás en [País]" con el progreso (ej: "23/30 minutos para verificar visita")
   
6. Considera el caso de no tener internet: guarda visitas localmente y sincroniza después.

IMPORTANTE: en desarrollo es difícil probar visitas internacionales. Añade un modo "fake GPS" en development (botón oculto en pantalla de profile que solo aparece si __DEV__ es true) que permita simular estar en cualquier país para probar la lógica.

Cuando termines, prueba el modo fake GPS simulando estar en Japón. Debería darte un sello físico y un coleccionable Épico de Japón. Commit.
```

---

## 🎲 PROMPT 6 — Juegos tradicionales (Mancala como piloto)

```
Ahora la mecánica más original: juegos tradicionales reales por país. Empezamos con UNO solo, Mancala (Oware), de Ghana.

1. Crea `apps/mobile/app/game/mancala.tsx` — la pantalla del juego

2. Implementa la lógica del Mancala (versión Oware) en `packages/game-engine/src/games/mancala/`:
   - rules.ts → reglas del juego (siembra y captura)
   - ai.ts → IA simple para jugar contra el móvil (minimax básico, profundidad 4)
   - state.ts → tipos de estado y transiciones
   
3. La lógica debe ser pura (sin React Native), testeable con tests unitarios. Añade tests para los movimientos básicos.

4. UI:
   - Tablero horizontal con dos filas de 6 hoyos + 2 almacenes en los extremos
   - Animación de las semillas moviéndose hoyo a hoyo
   - Indicador de turno
   - Marcador de semillas capturadas
   
5. Antes de la primera partida, mostrar un tutorial obligatorio (3-4 pantallas) explicando:
   - Qué es el Mancala/Oware
   - De dónde viene (Ghana, África subsahariana, +7000 años de historia)
   - Reglas básicas del juego con ejemplos visuales
   - Cómo se llama en otros países (Bao en Tanzania, Awale en Costa de Marfil...)

6. Recompensas al ganar contra la IA:
   - Primera victoria: desbloquea coleccionable "Tablero de Oware" (Raro) de Ghana
   - 5 victorias: desbloquea "Máscara Ashanti" (Épico) de Ghana
   - 10 victorias: cualifica para ganar el sello cultural de Ghana
   
7. Añade el juego al detalle del país de Ghana con un botón "Jugar Oware".

8. Importante: este juego es el piloto. Diseña la arquitectura de forma que añadir más juegos (Shogi, Mahjong, Pachisi...) sea modular: una carpeta por juego, una interfaz común. La pantalla `app/game/[gameId].tsx` debe poder cargar cualquier juego dinámicamente.

Cuando termines, prueba que puedo jugar al Mancala desde el detalle de Ghana, ver el tutorial, ganar contra la IA y obtener mi primer coleccionable. Commit.
```

---

## 📦 PROMPT 7 — Sobres y ruleta diaria

```
Vamos a añadir el sistema de sobres (gacha controlado) y la ruleta diaria.

1. Pantalla `app/shop.tsx` con los sobres disponibles:
   - Lee de pack_definitions
   - Muestra para cada sobre: nombre, coste en Sellos, qué garantiza, num_collectibles
   - Botón "Comprar y abrir"
   
2. Lógica de apertura en `packages/game-engine/src/pack-opener.ts`:
   - Función pura que recibe (pack_definition, available_collectibles, user_existing_collectibles) y devuelve los coleccionables a otorgar
   - Respeta las probabilidades de rarity_weights
   - Respeta guaranteed_min_rarity
   - Prioriza coleccionables que el usuario aún no tiene (90% de probabilidad de no-duplicado si hay disponibles)
   - Si todos son duplicados, da quantity++ en user_collectibles
   
3. Animación de apertura del sobre:
   - Sobre cerrado en el centro
   - Tap → animación de abrirse con luz dorada
   - Coleccionables aparecen uno a uno con animación tipo card flip
   - Los más raros se revelan al final con más fanfarria visual
   - Música/sonido opcional (deja un hook por si añadimos audio después)
   
4. Ruleta diaria (`app/daily.tsx`):
   - 8 segmentos en la ruleta
   - Premios: 50/100/200 Sellos, 1 coleccionable común, 1 coleccionable poco común, XP boost x2 30min, ticket sobre básico
   - Animación de rotación con desaceleración natural
   - Solo 1 tirada gratis por día (verificar último spun_at en roulette_spins)
   - Botón "Tirada extra (ver anuncio)" — placeholder, dejaremos AdMob para más adelante
   
5. Crear datos semilla en Supabase para 4 sobres iniciales:
   - "Sobre Básico" — 20 Sellos, 3 coleccionables
   - "Sobre Continental Europa" — 60 Sellos, 5 coleccionables filtrados a Europe
   - "Caja de Monumentos" — 120 Sellos, 5 con category=monument
   - "Sobre Estelar" — 200 Sellos, 5 con garantía Épico

6. Pantalla de "Mis sobres" donde se ven los sobres comprados pero aún no abiertos (timer de 4-6h o ver anuncio para abrir al instante — placeholder de momento).

Cuando termines, prueba comprar un sobre, abrirlo, y verificar que los coleccionables aparecen en mi colección. Commit.
```

---

## 🏆 PROMPT 8 — Liga semanal y rankings

```
Sistema de competición: liga semanal con ascenso y descenso.

1. Pantalla `app/(tabs)/social.tsx` muestra:
   - Sección "Tu liga": liga actual, posición, jugadores arriba y abajo, días restantes
   - Sección "Rankings": top 100 global de coleccionistas, top viajeros (más países GPS), top Sellos del mes
   - Sección "Amigos": lista de amigos y su progreso resumido
   - Botón "Añadir amigo" (por username)
   
2. Lógica de ligas (en `packages/game-engine/src/league.ts`):
   - 5 niveles: bronze, silver, gold, diamond, elite
   - Cada lunes a las 00:00 UTC se cierra la semana
   - Top 3 de cada liga sube
   - Bottom 5 baja (excepto en bronze)
   - Resto se mantiene
   - profiles.weekly_league_xp se reinicia
   - Reasignación a grupos de 20-30 jugadores del mismo nivel
   
3. Se necesita un cron job (Edge Function de Supabase) que ejecute esa lógica cada lunes. Crea el archivo en `supabase/functions/process-weekly-league/index.ts`. Documenta cómo desplegarlo.

4. La XP semanal de liga viene de:
   - Cada Sello ganado: +1 XP de liga
   - Misión semanal completada: +500 XP de liga
   - Victoria en duelo: +50 XP de liga
   
5. Sistema de amigos (tabla friendships):
   - Pantalla "Añadir amigo" busca por username
   - Al añadir queda en estado pending
   - El otro recibe la solicitud y la acepta/rechaza
   - Una vez accepted, ambos se ven en su lista
   
6. En el detalle de un amigo: ver su pasaporte (sin sellos ocultos), su liga, número de coleccionables (sin detalle exacto para mantener algo de mística).

Cuando termines, prueba registrar dos cuentas, añadirlas como amigos, y ver el ranking. Commit.
```

---

## ⚔️ PROMPT 9 — Duelos 1v1 en tiempo real

```
Duelos de trivia 1v1 en tiempo real entre amigos.

1. Pantalla `app/duel/new.tsx` para retar:
   - Selección de amigo de la lista de amigos
   - Selección de país (o aleatorio)
   - Crea registro en `duels` con status='pending' y notifica al oponente
   
2. Pantalla `app/duel/[id].tsx` para jugar:
   - Usa Supabase Realtime para sincronizar estado entre los dos jugadores
   - 10 preguntas, ambos jugadores las ven al mismo tiempo
   - Cronómetro de 15s por pregunta
   - Cada respuesta correcta vale 1 punto (rapidez = bonus de hasta 0.5)
   - Vista en tiempo real del marcador del rival
   
3. Al terminar:
   - Quien tenga más puntos gana
   - Empate → muerte súbita (1 pregunta, primer acierto gana)
   - Ganador se queda con un coleccionable duplicado del perdedor (si tiene alguno)
   - Si el perdedor no tiene duplicados, el ganador se lleva 100 Sellos
   - Ambos ganan XP de liga
   
4. Toda la lógica de elección de pregunta y validación va por servidor (función Supabase) para evitar trampas — el cliente nunca conoce la respuesta correcta antes de responder.

5. Crea Edge Function `supabase/functions/duel-engine/index.ts`:
   - POST /create → inicia un duelo
   - POST /answer → registra una respuesta y avanza
   - GET /state → devuelve estado actual

6. Notificaciones push cuando llega una invitación de duelo (placeholder OK por ahora).

7. Límite: máximo 5 duelos al día por usuario.

Cuando termines, prueba un duelo entre dos cuentas reales. Commit.
```

---

## 🌍 PROMPT 10 — Expediciones Globales

```
La mecánica viral: expediciones globales colectivas.

1. Una expedición está activa siempre. Cuando una termina, otra comienza al lunes siguiente.

2. Pantalla `app/expedition.tsx` (accesible desde el hub de play):
   - Muestra la expedición activa con:
     * Título grande, descripción, imagen
     * Barra de progreso global (current_points / target_points) animada
     * Días/horas restantes
     * Tu contribución personal y tu rank actual
     * Top 10 contribuidores en tiempo real
   - Botón "Contribuir" → te lleva al hub para jugar y ganar puntos

3. Lógica de contribución:
   - Cada Sello ganado durante la expedición suma 1 punto a tu contribución y 1 punto al global
   - Multiplicadores si la acción es del continente target de la expedición (x3)
   - El global se actualiza en tiempo real con Supabase Realtime
   
4. Al cerrar (función programada el viernes 23:59):
   - Si current_points >= target_points → completed
     * Todos los contribuyentes (>0 puntos) reciben el sello único de Expedición con la fecha grabada
     * Top 10 reciben además 500 Sellos extra
     * Top 1 recibe coleccionable Épico exclusivo "Líder de Expedición"
   - Si no se alcanza → failed
     * Sin sellos. El sello desaparece para siempre. FOMO real.
   
5. Crea Edge Function `process-expedition` que se ejecute al cerrar.

6. Las expediciones se crean manualmente desde admin (de momento, mete una primera de muestra a mano: "Conquista Asia · 7 días · 1.000.000 puntos globales").

7. La barra de progreso debe ser visible siempre desde el hub de play, no solo desde la pantalla de expedición. Crear ansiedad/motivación constante.

8. Push notifications:
   - Cuando empieza una nueva expedición
   - Cuando faltan 24h y el progreso global está bajo
   - Cuando alguien que conoces (amigo) sube al top 10

Cuando termines, prueba contribuir a la expedición de muestra y ver cómo sube la barra global. Commit.
```

---

## 🎯 PROMPT 11 — Pulido y polishing

```
Última pasada de pulido antes de pasar a anuncios y monetización.

1. Pantalla de onboarding (primer login):
   - 4-5 pantallas explicando el concepto:
     * "Bienvenido a WorldDex" + el mundo entero como tablero
     * "Aprende, juega, viaja" — las tres vías de progreso
     * "Tu pasaporte cuenta tu historia" — el pasaporte vivo
     * "Compite contra el mundo" — liga, expediciones
   - Pedir permisos de ubicación con explicación clara
   - Solicitar nombre de usuario

2. Notificaciones inteligentes (expo-notifications):
   - Recordatorio de racha diaria (a la hora habitual del usuario)
   - "Llevas 23h sin jugar, no pierdas tu racha de 14 días"
   - Anuncio de nueva expedición
   - Invitaciones de duelo de amigos

3. Sonidos sutiles para:
   - Respuesta correcta de trivia
   - Coleccionable obtenido
   - Sello nuevo
   - Sobre abierto
   - Subir de liga
   Hazlos opt-out (silenciables desde profile)

4. Animaciones con react-native-reanimated:
   - Transiciones entre pantallas más fluidas
   - Cards de coleccionables con efecto holográfico en los Épicos y Legendarios (gradiente animado)
   - Confetti al completar un país

5. Empty states bonitos:
   - "Aún no has visitado ningún país" → CTA a empezar trivia
   - "No tienes amigos todavía" → CTA a invitar
   - "No has comprado ningún sobre" → CTA a la tienda

6. Manejo de errores global:
   - Si falla la conexión, mostrar banner "Sin conexión, jugando offline"
   - Cachear preguntas de trivia para poder jugar sin red
   - Sincronizar al recuperar conexión

7. Performance:
   - Lazy loading de imágenes con expo-image
   - Memoizar componentes pesados (CountryCard, CollectibleCard)
   - Virtualizar listas largas (FlatList con getItemLayout)

Cuando termines, asegúrate de que todo el flujo onboarding → trivia → coleccionable → sello → compartir funciona suavemente. Commit final pre-monetización.
```

---

## 💰 PROMPT 12 — Anuncios voluntarios (rewarded ads)

```
Última fase: monetización con anuncios voluntarios en momentos de alta tensión.

1. Integra react-native-google-mobile-ads (AdMob)
   - Necesito que me digas qué pasos necesito hacer en la consola de AdMob para obtener los IDs (créame las instrucciones, no inventes IDs)
   - Configura la app con un ID de prueba primero

2. Implementa solo rewarded ads en estos 6 momentos:
   a) "Salvar racha" → al final del día sin haber jugado, modal "¿Salvar tu racha de X días?"
   b) "Segunda oportunidad en duelo" → al perder un duelo cerrado
   c) "Abrir sobre al instante" → en lugar de esperar el timer
   d) "Doblar recompensa de Expedición" → al recibir el sello de expedición completada
   e) "Revivir en minijuego" → al perder en Buscaminas u otros minijuegos
   f) "Tirada extra de ruleta" → tras la tirada gratis diaria
   
3. Cada uno con un componente común `RewardedAdButton.tsx` que:
   - Muestra el botón con el premio que se obtiene
   - Carga el anuncio
   - Si el usuario lo ve completo, ejecuta el callback de recompensa
   - Si lo cierra antes, no recompensa
   - Maneja errores gracefully (anuncio no disponible → "Inténtalo en unos minutos")

4. Tracking básico de conversiones (cuántos ven el anuncio vs cuántos lo cierran). Guarda en una tabla `ad_events` para analítica.

5. NO implementes ningún otro tipo de anuncio (banner, intersticial). Solo rewarded. La idea es que el usuario nunca sienta el anuncio como interrupción, solo como decisión voluntaria.

6. Documenta en docs/MONETIZATION.md el modelo y los puntos de conversión esperados.

Cuando termines, dime cómo configurar mi cuenta de AdMob para obtener los IDs reales. Commit.
```

---

## 🎓 Cómo usar estos prompts

1. **No los pegues todos a la vez.** Uno por sesión.
2. **Después de cada prompt, prueba en tu móvil** lo que se construyó.
3. **Haz commit** ("git add . && git commit -m 'Feature: ...'") antes del siguiente.
4. **Si algo no funciona**, en la siguiente conversación pega el error a Claude Code y deja que lo arregle antes de continuar con la siguiente feature.
5. **Si tienes ideas nuevas a mitad del proceso**, anótalas pero no las implementes hasta llegar a un punto estable.

---

## 📍 Después de los 12 prompts

Tendrás una versión funcional completa de WorldDex con:
- ✅ Atlas de países
- ✅ Trivia con sistema de Sellos
- ✅ Pasaporte Vivo compartible
- ✅ GPS con sellos físicos
- ✅ Mancala como juego tradicional piloto
- ✅ Sobres y ruleta diaria
- ✅ Liga semanal + amigos
- ✅ Duelos 1v1
- ✅ Expediciones Globales
- ✅ Onboarding y pulido
- ✅ Rewarded ads para monetizar

A partir de ahí, las siguientes prioridades naturales son:
1. **Más juegos tradicionales** (Shogi, Mahjong, Pachisi, Yut Nori...)
2. **Minijuegos de territorio** (Buscaminas, Snake, Puzzle de regiones)
3. **Sistema de idiomas estilo Duolingo**
4. **Más contenido de trivia** (curado por país)
5. **Beta cerrada con usuarios reales**
6. **Lanzamiento en stores**

---

WorldDex · Prompts siguientes · Mayo 2026
