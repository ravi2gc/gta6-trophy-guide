// Vice Atlas — hand-in program for the gta6-trophy-guide-01 entry.
//
// The guide itself is plain static files under app/ (index.html, style.css,
// app.js and data/trophies.json) plus four screenshots. This program copies
// those two folders from beside this file into the hand-in directory and
// writes dossier.json there with the vendored make.fun library, which is
// what the scorer reads. vendor/makefun-frontend.ts is left untouched: the
// scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's own caps: only text_max_bytes shapes the dossier text; the
// rest refuse an entry the scorer would refuse anyway (at most 4 screenshots
// and none over 256 KiB; at most 993 files and directories in app/ and
// 48 MiB of app files, beside /output's own 1000-entry and 64 MiB caps).
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function countTree(dir: string): number {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    total += 1;
    if (statSync(p).isDirectory()) total += countTree(p);
  }
  return total;
}

function handIn(): void {
  const repoRoot = dirname(fileURLToPath(import.meta.url));
  const target = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  mkdirSync(target, { recursive: true });
  cpSync(join(repoRoot, 'app'), join(target, 'app'), { recursive: true });
  mkdirSync(join(target, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(target, 'screenshots'), { recursive: true });
  }

  const dossier = buildDossier(target, DOSSIER_LIMITS);
  writeFileSync(join(target, 'dossier.json'), dossier);

  const shots = readdirSync(join(target, 'screenshots')).filter((n) => !n.startsWith('.'));
  console.log(`handed in ${countTree(join(target, 'app'))} app entries and ${shots.length} screenshots to ${target}`);
  console.log(`dossier.json: ${Buffer.byteLength(dossier, 'utf8')} bytes`);
}

handIn();
