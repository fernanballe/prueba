# 07 · Comandos útiles · Cheatsheet

Tu chuleta de comandos para no buscar en Google. Imprime esta página o ten el archivo abierto.

---

## 📦 Git — uso diario

```bash
# Ver qué archivos cambiaron
git status

# Añadir todo y commitear
git add .
git commit -m "Mensaje claro de qué hiciste"

# Subir a GitHub
git push

# Ver historial
git log --oneline -20

# Crear y cambiar a una rama nueva
git checkout -b feature/nombre-feature

# Volver a main
git checkout main

# Deshacer cambios sin commitear
git restore .                  # cuidado: pierdes los cambios

# Ver qué cambiaste antes de commitear
git diff
```

### Si rompes algo y quieres volver atrás

```bash
# Ver últimos commits
git log --oneline -10

# Volver a un commit anterior (PIERDES los siguientes)
git reset --hard <hash-del-commit>

# O volver atrás creando un commit nuevo (más seguro)
git revert <hash-del-commit>
```

### Configuración inicial del repo remoto (solo una vez)

```bash
# Después del primer commit local, conectar con GitHub:
git remote add origin https://github.com/TUUSER/worlddex.git
git branch -M main
git push -u origin main
```

---

## 📱 Expo — desarrollo de la app

```bash
# Arrancar en modo desarrollo
npm run dev
# o desde apps/mobile:
npx expo start

# Limpiar caché de Expo (cuando algo va raro)
npx expo start -c

# Modo tunnel (cuando WiFi tiene problemas)
npx expo start --tunnel

# Ver logs detallados
npx expo start --verbose

# Comprobar que la config es correcta
npx expo config

# Forzar reinstalación de dependencias nativas
npx expo prebuild --clean
```

### EAS Build (compilaciones de instalación)

```bash
# Login (una sola vez)
eas login

# Configurar el proyecto (una sola vez)
eas build:configure

# Build de desarrollo (incluye debug, módulos nativos custom)
eas build --profile development --platform ios
eas build --profile development --platform android

# Build de producción
eas build --profile production --platform ios
eas build --profile production --platform android

# Ver builds en curso
eas build:list

# Subir a las tiendas
eas submit --platform ios
eas submit --platform android
```

---

## 📥 npm — gestión de paquetes

```bash
# Instalar todo
npm install

# Instalar un paquete específico
npm install nombre-paquete

# Instalar como dev dependency
npm install -D nombre-paquete

# Actualizar paquetes (con cuidado)
npm update

# Ver paquetes obsoletos
npm outdated

# Limpiar caché si algo falla raro
npm cache clean --force

# Reinstalar todo desde cero (cuando hay desastres)
rm -rf node_modules package-lock.json
npm install
```

### En un monorepo con Turborepo

```bash
# Instalar paquete solo en mobile
npm install nombre-paquete -w apps/mobile

# Instalar paquete solo en game-engine
npm install nombre-paquete -w packages/game-engine

# Correr un script en todos los workspaces
npx turbo run build
npx turbo run dev
```

---

## 🗄️ Supabase — gestión de la base de datos

```bash
# Login (una sola vez)
npx supabase login

# Vincular proyecto local con el remoto
npx supabase link --project-ref TU_PROJECT_REF

# Generar tipos TypeScript del schema actual
npx supabase gen types typescript --linked > packages/supabase-schema/src/database.types.ts

# Ver el estado de la base de datos
npx supabase db dump

# Aplicar migraciones (si las usas)
npx supabase db push

# Conectar a la DB con psql (para queries directas)
psql "postgresql://postgres:[PASS]@db.[PROJECT].supabase.co:5432/postgres"
```

### Edge Functions

```bash
# Crear nueva función
npx supabase functions new nombre-funcion

# Servir localmente para test
npx supabase functions serve nombre-funcion

# Desplegar a producción
npx supabase functions deploy nombre-funcion

# Ver logs en producción
npx supabase functions logs nombre-funcion
```

---

## 🤖 Claude Code — productividad

### En cada sesión nueva

Empieza siempre dándole contexto:

```
Estoy trabajando en WorldDex. Ya tenemos hecho: [lista de features].
Ahora voy a hacer: [lo que toca].
Antes de empezar, lee `docs/GDD.md` para refrescar el contexto del producto.
```

### Cuando algo falla

Pega el error completo. No resumido, no editado. Tal cual lo ves.

### Cuando una tarea es grande

Pídele que primero **planifique** y te enseñe el plan antes de tocar código:

```
Antes de implementar nada, escríbeme un plan paso a paso de cómo abordarías
esta tarea, qué archivos vas a crear o modificar, y qué decisiones de diseño
estás tomando. No escribas código todavía.
```

Después de aprobar el plan, le dices "adelante".

### Para revisar el código que generó

```
Revisa el código que acabas de escribir como si fueras un senior reviewer.
Identifica:
- Bugs potenciales
- Casos edge no manejados
- Posibles mejoras de performance
- Código duplicado que podría refactorizarse
```

---

## 🛠️ TypeScript — comandos útiles

```bash
# Verificar que todo el código tipa correctamente (sin compilar)
npx tsc --noEmit

# En el monorepo, comprobar todo
npx turbo run typecheck

# Generar tipos faltantes de un paquete sin tipos
npm install -D @types/nombre-paquete
```

---

## 🐛 Cuando algo no funciona

Tu lista de comprobación rápida:

1. ¿`.env` tiene las variables correctas?
2. ¿`.env` está en `.gitignore`?
3. ¿`npm install` se ejecutó después de cambios en package.json?
4. ¿Reiniciaste Expo después de cambios en config?
5. ¿Móvil y ordenador en la misma red WiFi?
6. ¿Probaste limpiar caché con `npx expo start -c`?
7. ¿La versión de Node es 20+?
8. ¿Cerraste y volviste a abrir el editor?

Si tras todo eso sigue fallando: pasa el error completo a Claude Code.

---

## 🚀 Atajos para Claude Code dentro del proyecto

Crea un archivo `CLAUDE.md` en la raíz del proyecto con contexto persistente. Claude Code lo lee automáticamente:

```markdown
# Contexto del proyecto WorldDex

## Stack
- Monorepo Turborepo
- React Native + Expo (apps/mobile)
- Supabase (backend)
- TypeScript estricto en todo

## Convenciones
- Variables y código en inglés
- UI strings en español
- Lógica de juego en packages/game-engine
- Llamadas a Supabase en services/
- Tipos compartidos en packages/shared-types

## Comandos comunes
- npm run dev → arranca Expo
- npx tsc --noEmit → typecheck
- npx supabase gen types ... → regenerar tipos de DB

## NO hacer
- No commitear .env
- No instalar paquetes pesados sin justificación
- No usar `any` en TypeScript
- No mezclar lógica de juego con UI
```

Esto evita repetirle lo mismo cada sesión.

---

WorldDex · Cheatsheet · Mayo 2026
