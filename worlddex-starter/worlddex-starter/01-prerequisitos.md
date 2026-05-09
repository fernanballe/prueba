# 01 · Prerequisitos

Antes de tocar código, necesitas tener estas cuentas creadas y estas herramientas instaladas. Tiempo aproximado: **1 hora**.

---

## 🔑 Cuentas a crear (todas gratis para empezar)

### 1. GitHub — para guardar el código
- Ve a https://github.com/signup
- Crea cuenta si no la tienes
- Crea un repositorio privado nuevo llamado `worlddex` (déjalo vacío, sin README)
- **Guarda la URL del repo**, la usarás más tarde

### 2. Supabase — backend y base de datos
- Ve a https://supabase.com → "Start your project"
- Login con GitHub (más rápido)
- Crea un nuevo proyecto:
  - Name: `worlddex`
  - Database password: **genera una fuerte y guárdala** (la necesitarás)
  - Region: elige la más cercana a ti (Frankfurt, Madrid, etc.)
- Espera 2 minutos a que se provisione
- Ve a `Settings → API` y **guarda estas dos cosas**:
  - `Project URL` (algo como `https://xxxxx.supabase.co`)
  - `anon public key` (una clave larga que empieza por `eyJ...`)

### 3. Expo — para compilar la app móvil
- Ve a https://expo.dev/signup
- Crea cuenta
- Esto lo usarás más tarde para compilar versiones definitivas

### 4. Expo Go — la app en tu móvil
- En tu móvil, ve al App Store (iOS) o Play Store (Android)
- Busca "Expo Go" y instálala
- Ábrela e inicia sesión con la misma cuenta de Expo de arriba
- Esto te permite probar tu app sin compilar nada

---

## 💻 Herramientas a instalar en tu ordenador

### Node.js (versión 20 o superior)
- Descarga desde https://nodejs.org → versión LTS
- Verifica que funciona abriendo terminal:
  ```bash
  node --version   # debería mostrar v20.x.x o superior
  npm --version    # debería mostrar 10.x.x o superior
  ```

### Git
- Mac: ya viene instalado, comprueba con `git --version`
- Windows: https://git-scm.com/download/win
- Linux: `sudo apt install git`

Configura tu identidad:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Claude Code
- Sigue las instrucciones en https://docs.claude.com/en/docs/claude-code/overview
- Necesitarás iniciar sesión con tu cuenta de Anthropic

### Editor de código (recomendado: VS Code)
- Descarga desde https://code.visualstudio.com
- Te servirá para revisar el código que Claude Code va generando

### Expo CLI (se instala vía npm)
```bash
npm install -g expo-cli eas-cli
```

---

## ✅ Checklist antes de continuar

Marca estos puntos antes de pasar al siguiente archivo:

- [ ] Tengo cuenta de GitHub y un repo `worlddex` vacío creado
- [ ] Tengo la URL del repo guardada
- [ ] Tengo proyecto en Supabase y guardé `Project URL` + `anon key`
- [ ] Tengo cuenta de Expo
- [ ] Tengo Expo Go instalado en mi móvil y logueado
- [ ] `node --version` me devuelve v20 o superior
- [ ] `git --version` me devuelve algo
- [ ] Tengo Claude Code instalado y funcionando
- [ ] Tengo VS Code (o el editor de tu preferencia) instalado

---

## 📋 Datos que debes tener guardados

Crea un archivo de texto seguro (NO en el repo) con:

```
WORLDDEX - CREDENCIALES
========================

GitHub repo URL: https://github.com/TUUSER/worlddex.git

Supabase:
  Project URL: https://xxxxx.supabase.co
  Anon Key: eyJxxxxx...
  DB Password: xxxxx
  Region: xxxxx

Expo:
  Email: tu@email.com
```

Estos datos los pegarás más adelante en archivos `.env` que **no se suben a Git**.

---

## 📍 Siguiente paso

👉 Abre **`03-database-schema.sql`** y léelo. Después ve a Supabase → SQL Editor y ejecútalo.

---

WorldDex · Prerequisitos · Mayo 2026
