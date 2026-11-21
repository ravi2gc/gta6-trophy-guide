// The Leonida Trophy Codex — entrypoint for gta6-trophy-guide-01.
//
// The guide itself is a static, offline web app in app/ (index.html + app.js +
// style.css + data/trophies.json). This program hands it in: it copies app/ and
// screenshots/ into the output directory and writes dossier.json, the summary
// the judge reads, using the vendored make.fun library. The vendor file is kit
// code and must be left exactly as shipped.
//
// Run locally with MAKEFUN_OUTPUT_DIR set to a scratch directory:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// Caps mirror the scorer's gate: at most 4 screenshots of 256 KiB each, app/
// under 993 entries and 48 MiB, and the dossier text under 163,840 bytes.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
