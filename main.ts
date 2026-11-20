// Leonida Legend — GTA 6 trophy guide entry (Node 22, standard library only).
//
// The guide itself is plain static files in app/ (index.html, style.css,
// app.js, data/trophies.json): it opens in desktop Chrome, works offline,
// and loads nothing over the network. This program hands the entry in: it
// copies app/ and screenshots/ from beside this file into the output
// directory and writes output/dossier.json with buildDossier from the
// vendored make.fun library (vendor/makefun-frontend.ts, untouched).
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader runs it twice and requires byte-identical output both times,
// so this program does nothing time- or order-dependent: it copies the
// same files in the same order and writes the dossier the library builds.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Caps from the scorer: the dossier text is capped at 160 KiB, at most 4
// screenshots of at most 256 KiB each, app/ at most 993 files and 48 MiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
