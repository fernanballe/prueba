// Arregla dos problemas de compatibilidad entre metro 0.84.x y @expo/metro-config + @expo/cli:
//
// 1. metro 0.82+ eliminó './src/*' del campo exports, que @expo/cli 0.22.x usa internamente.
// 2. metro 0.84.x cambió sourceMapString.js a exports nombrados sin default,
//    pero @expo/metro-config@0.19.12 espera un export default.

const fs = require('fs');
const path = require('path');

const nodeModules = path.resolve(__dirname, '../node_modules');

// ── Fix 1: añadir ./src/* al campo exports de todos los paquetes metro-* ──────
const metroPackages = [
  'metro',
  'metro-cache',
  'metro-cache-key',
  'metro-config',
  'metro-core',
  'metro-file-map',
  'metro-resolver',
  'metro-runtime',
  'metro-source-map',
  'metro-babel-transformer',
  'metro-transform-plugins',
  'metro-transform-worker',
  'metro-symbolicate',
  'metro-minify-terser',
];

for (const pkg of metroPackages) {
  const pkgPath = path.join(nodeModules, pkg, 'package.json');
  if (!fs.existsSync(pkgPath)) continue;

  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkgJson.exports) continue;
  if (pkgJson.exports['./src/*']) continue;

  pkgJson.exports = {
    ...pkgJson.exports,
    './src/*': './src/*.js',
    './src/*.js': './src/*.js',
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
  console.log(`postinstall: parchado exports de ${pkg}@${pkgJson.version}`);
}

// ── Fix 2: añadir export default a sourceMapString.js ─────────────────────────
// @expo/metro-config@0.19.12 hace require("metro/src/DeltaBundler/Serializers/sourceMapString")
// y espera que .default sea la función sourceMapString, pero metro 0.84.x solo
// tiene exports nombrados. Añadimos "exports.default = sourceMapString" al final.
const sourceMapPath = path.join(
  nodeModules,
  'metro/src/DeltaBundler/Serializers/sourceMapString.js'
);

if (fs.existsSync(sourceMapPath)) {
  const content = fs.readFileSync(sourceMapPath, 'utf8');
  const marker = '// patched: default export added';
  if (!content.includes(marker)) {
    fs.appendFileSync(
      sourceMapPath,
      `\n${marker}\nexports.default = sourceMapString;\n`
    );
    console.log('postinstall: sourceMapString.js parchado — export default añadido.');
  } else {
    console.log('postinstall: sourceMapString.js ya está parchado.');
  }
}

console.log('postinstall: todos los parches de metro aplicados.');
