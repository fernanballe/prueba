// Arregla un problema de compatibilidad entre @expo/cli 0.22.x y metro 0.81.5:
// metro 0.81+ eliminó './src/*' del campo exports, que @expo/cli usa internamente
// (por ejemplo para './src/lib/TerminalReporter').

const fs = require('fs');
const path = require('path');

const nodeModules = path.resolve(__dirname, '../node_modules');

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

// Si una corrida previa dejó el parche legacy en sourceMapString.js (necesario
// para metro 0.84.x pero rompe metro 0.81.x al referenciar un símbolo inexistente),
// hay que limpiarlo.
const sourceMapPath = path.join(
  nodeModules,
  'metro/src/DeltaBundler/Serializers/sourceMapString.js'
);

if (fs.existsSync(sourceMapPath)) {
  const content = fs.readFileSync(sourceMapPath, 'utf8');
  const marker = '// patched: default export added';
  if (content.includes(marker)) {
    const cleaned = content.replace(
      /\n\/\/ patched: default export added\nexports\.default = sourceMapString;\n?/g,
      ''
    );
    fs.writeFileSync(sourceMapPath, cleaned);
    console.log('postinstall: sourceMapString.js — parche legacy eliminado.');
  }
}

console.log('postinstall: todos los parches de metro aplicados.');
