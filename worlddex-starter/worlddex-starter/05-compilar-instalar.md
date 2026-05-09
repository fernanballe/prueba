# 05 · Compilar e instalar en tu móvil

Hay tres modos de probar la app en tu dispositivo, ordenados de más rápido a más definitivo:

| Modo | Cuándo | Tiempo | Apto para |
|------|--------|--------|-----------|
| **Expo Go** | Desarrollo diario | 1 minuto | Probar cambios al vuelo |
| **Development Build** | Cuando uses paquetes nativos | 15-30 min | GPS, cámara, etc. |
| **Production Build** | Para distribuir | 30-60 min | Subir a stores |

Empieza por **Expo Go**. Solo pasa al siguiente cuando lo necesites.

---

## 🟢 Modo 1: Expo Go (lo usas el 95% del tiempo)

### Tu ordenador y tu móvil deben estar en la misma red WiFi

Eso es lo único que se suele olvidar y rompe todo. Comprueba antes de empezar.

### Pasos

1. **En el ordenador, abre terminal en la raíz del proyecto:**
   ```bash
   cd ~/proyectos/worlddex
   ```

2. **Arranca Expo:**
   ```bash
   npm run dev
   ```
   o, dependiendo de cómo lo configurara Claude Code:
   ```bash
   cd apps/mobile && npx expo start
   ```

3. **Verás un QR gigante en la terminal y se abrirá una página web** con más opciones.

4. **En tu móvil:**
   - Abre la app Expo Go
   - Pulsa "Scan QR code"
   - Escanea el QR de la terminal
   - La app se descargará y abrirá automáticamente (10-30 segundos la primera vez)

5. **¡Listo!** Cualquier cambio que Claude Code haga en el código se reflejará al instante en tu móvil sin reinstalar nada.

### Atajos útiles mientras Expo está corriendo

En la terminal donde corre Expo:
- `r` → recargar la app
- `m` → abrir el menú de desarrollo
- `j` → abrir el debugger
- `Ctrl+C` → detener Expo

---

## 🟡 Modo 2: Development Build (necesario para GPS y otros)

Expo Go incluye paquetes nativos predefinidos. En cuanto añadas algo no incluido (a veces ocurre con plugins de GPS específicos, AdMob, etc.), necesitas un **Development Build**.

### iOS

Necesitas un Mac y Xcode instalado, o usar EAS Build (servicio en la nube de Expo, gratis para empezar).

```bash
# Login una sola vez
eas login

# Configurar el proyecto (genera eas.json)
eas build:configure

# Build de desarrollo para iOS
eas build --profile development --platform ios
```

Cuando termine (15-30 min), Expo te da un enlace. Ábrelo en tu iPhone y permite la instalación.

### Android

```bash
eas build --profile development --platform android
```

Te da un `.apk`. Lo descargas en el móvil y lo instalas (tendrás que aceptar "instalar de origen desconocido" en ajustes).

---

## 🔴 Modo 3: Production Build (cuando vayas a publicar)

Esto es para subir a App Store o Google Play. **No lo necesitas durante el desarrollo**, pero lo dejo aquí para cuando llegue el momento.

```bash
# iOS (necesitas cuenta de Apple Developer, $99/año)
eas build --profile production --platform ios
eas submit --platform ios

# Android (Google Play, $25 una vez)
eas build --profile production --platform android
eas submit --platform android
```

---

## ✅ Checklist del primer arranque

Cuando Claude Code termine la primera sesión, comprueba lo siguiente en orden:

1. **¿Existe el archivo `.env`?**
   ```bash
   cat .env  # debe mostrar tus credenciales de Supabase
   ```

2. **¿Está `.env` en `.gitignore`?**
   ```bash
   grep ".env" .gitignore  # debe devolver al menos una línea
   ```

3. **¿Las dependencias instalan sin error?**
   ```bash
   npm install
   ```

4. **¿Arranca Expo?**
   ```bash
   npm run dev
   ```
   Debe mostrar el QR.

5. **¿Tu móvil escanea el QR y carga la app?**
   Si sí, ya tienes el ciclo completo. ¡Felicidades!

---

## 🐛 Errores frecuentes y cómo arreglarlos

### "Network response timed out" al escanear el QR
- Comprueba que móvil y ordenador están en la misma red WiFi
- Si tu red bloquea conexiones entre dispositivos (WiFi de hoteles, oficinas), prueba con `npx expo start --tunnel`

### "Invalid Supabase URL"
- Revisa el `.env`, debe ser `https://xxxx.supabase.co` (sin slash al final)
- Reinicia Expo después de cambiar `.env`

### La app abre pero pantalla blanca
- Mira la terminal donde corre Expo, suele haber un error visible
- Pulsa `r` en la terminal para recargar
- Si persiste, copia el error y pásaselo a Claude Code

### "Unable to resolve module..."
- Tras añadir un paquete: `npm install` y reiniciar Expo
- A veces hace falta limpiar caché: `npx expo start -c`

---

## 📍 Siguiente paso

Si la app está corriendo, ya estás listo para construir las features.

👉 Ve a **`06-prompts-siguientes.md`** para los siguientes prompts ordenados.

---

WorldDex · Compilar e instalar · Mayo 2026
