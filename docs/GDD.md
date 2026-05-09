# WorldDex — Game Design Document

## Visión

WorldDex es un juego mobile (iOS y Android) donde los jugadores coleccionan items culturales de los 195 países del mundo. El elemento central es el **Pasaporte Vivo**: un pasaporte digital que crece con sellos únicos según cómo conseguiste cada país.

## Mecánicas principales

1. **Trivia por país** — Preguntas culturales, históricas y geográficas
2. **GPS** — Al viajar físicamente al país, desbloquea items épicos/legendarios
3. **Juegos tradicionales** — Mancala, Shogi, Mahjong, Pachisi, Oware...
4. **Minijuegos de territorio** — El mapa del país es el tablero
5. **Lecciones de idioma** — Estilo Duolingo, por país
6. **Sobres de coleccionables** — Aperturas con rareza ponderada
7. **Misiones diarias y semanales** — Objetivos con recompensas
8. **Liga semanal** — Ascenso y descenso por XP semanal
9. **Duelos 1v1** — Contra amigos, con coleccionables en juego
10. **Expediciones Globales** — Retos colectivos semanales con sello único

## Rareza de coleccionables

| Nivel | Símbolo | % en sobres estándar | Cómo se consigue |
|-------|---------|---------------------|-----------------|
| Common | ⭐ | 60% | Trivia básica, sobres |
| Uncommon | ⭐⭐ | 30% | Trivia avanzada, sobres |
| Rare | ⭐⭐⭐ | 8% | Sobres premium, misiones |
| Epic | ⭐⭐⭐⭐ | 1.8% | GPS, sobres épicos |
| Legendary | ⭐⭐⭐⭐⭐ | 0.2% | GPS exclusivo (1 por país) |

## Sistema de Visados

Cada usuario tiene un nivel de visado por país:

- **Turista** (nivel 1) — Se desbloquea al empezar a explorar el país
- **Viajero** (nivel 2) — Completar trivia básica + 1 juego
- **Residente** (nivel 3) — Completar trivia avanzada + idioma nivel 2
- **Embajador** (nivel 4) — Máximo nivel cultural O visita GPS verificada

## Modelo de negocio

Gratuito con anuncios voluntarios (rewarded ads) en momentos de alta tensión emocional:
- Salvar racha de días
- Abrir sobre antes de tiempo
- Revivir en minijuego tras perder
