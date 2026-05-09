# 🚀 EMPIEZA AQUÍ — Ruta completa

Esta es tu guía maestra. Sigue los pasos en orden y al final del día tendrás WorldDex corriendo en tu móvil.

---

## 🗺️ La ruta completa (visión general)

```
┌──────────────────────────────────────────────────────────┐
│  FASE 0 · Prerequisitos                          ~1 hora │
│  Instalar Node, crear cuentas (Supabase, Expo, GitHub)   │
├──────────────────────────────────────────────────────────┤
│  FASE 1 · Base de datos                       ~30 minutos │
│  Crear proyecto Supabase + ejecutar el SQL              │
├──────────────────────────────────────────────────────────┤
│  FASE 2 · Generar el código                      ~1 hora │
│  Pegar el prompt en Claude Code y dejar que construya   │
├──────────────────────────────────────────────────────────┤
│  FASE 3 · Compilar e instalar                    ~1 hora │
│  Ejecutar Expo, escanear QR con tu móvil                │
├──────────────────────────────────────────────────────────┤
│  FASE 4 · Construir features                  Continuo   │
│  Usar los prompts ordenados para añadir cada mecánica   │
└──────────────────────────────────────────────────────────┘
```

---

## ⏱️ Por dónde empezar HOY

### Si tienes 1 hora ahora mismo:
→ Abre **`01-prerequisitos.md`** y empieza a instalar las herramientas y crear las cuentas. Eso destrabar todo lo demás.

### Si tienes 3 horas seguidas:
→ Haz prerequisitos (1h) + base de datos (30min) + Claude Code genera la app (1h) + ya la tienes en el móvil (30min).

### Si tienes un día libre:
→ Llegas hasta la Fase 4 con la app funcionando, navegando entre pantallas y la trivia básica operativa.

---

## 🧠 La filosofía de trabajo con Claude Code

**No le pidas todo de golpe.** Claude Code funciona mejor cuando le das tareas claras y enfocadas. Por eso este paquete tiene:

- **Un prompt inicial** que crea toda la base
- **Prompts siguientes** ordenados, uno por mecánica

Después de cada prompt, **prueba lo que se ha construido en tu móvil** antes de pasar al siguiente. Así detectas problemas pronto.

---

## ⚠️ Tres cosas importantes antes de empezar

### 1. Trabaja siempre con Git

Después del primer prompt, la primera acción es:
```bash
git add .
git commit -m "MVP base inicial generado"
git push
```

Hazlo después de **cada** sesión de Claude Code. Si algo se rompe, vuelves atrás sin drama.

### 2. Las claves secretas nunca se suben a Git

Supabase y otras claves van en un archivo `.env` que **se queda solo en tu ordenador**. Claude Code ya lo configurará así, pero tú revisa que `.env` esté en `.gitignore` antes del primer commit.

### 3. Empieza con dispositivo físico, no emulador

Para una app con GPS y compartir imágenes, el emulador miente. Instala **Expo Go** en tu móvil (es una app gratis del store) y desde el primer momento prueba ahí.

---

## 📍 Tu siguiente paso

👉 Abre **`01-prerequisitos.md`**

Cuando termines de instalar todo, vuelve aquí y avanza al siguiente archivo.

---

WorldDex · Empieza aquí · Mayo 2026
