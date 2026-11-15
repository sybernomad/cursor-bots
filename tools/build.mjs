// Usage: node tools/build.mjs
// Bundles the ES-module sources in js/ into one classic script, js/game.bundle.js,
// so the game runs when index.html is opened straight from disk (file://) as well as on a web server.
// Needs esbuild: `npm i -g esbuild` once, or it is fetched automatically via npx.
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const cmd = 'npx --yes esbuild js/main.js --bundle --format=iife --target=es2020 --legal-comments=none --outfile=js/game.bundle.js';
execSync(cmd, { cwd: root, stdio: 'inherit' });
console.log('Built js/game.bundle.js');
