# The Leonida Trophy Codex — GTA VI Platinum Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-01/ravi2gc/gta6-trophy-guide/rank.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-01/ravi2gc/gta6-trophy-guide/reward.svg)](https://make.fun/competitions/gta6-trophy-guide-01)

An unofficial, offline-first trophy guide and tracker for **Grand Theft Auto VI** on PlayStation 5 — an entry for the [gta6-trophy-guide-01 bounty](https://make.fun/competitions/gta6-trophy-guide-01) on make.fun.

## What it is

- **All 55 PS5 trophies** (1 platinum, 2 gold, 6 silver, 46 bronze), names, descriptions and grades matching the official list, each with an **own-words guide** (670–906 characters each) covering what to do, where, and when it can be missed.
- **165 citations** — 3 cited sources per trophy, from 18 source pages across 15+ sites (PowerPyx, GTABase, Push Square, Sixshore, eGamers, KeenGamer, Insider Gaming, Gamemapa and more), all read on 21 November 2026. Guide text is never copied from a source.
- **Working tracker**: mark trophies earned, progress saved in localStorage, overall + per-grade progress, with export/import of progress as JSON.
- **Filters** by grade, category, earned/unearned/missable, plus text search. **Spoiler shield** hides the 28 hidden trophies' names and guides until revealed or earned. **URL state**: earned set, filters and open tab are encoded in the address hash.
- **Six-stage platinum roadmap** (~200 hours, staged: story 60–80h, 100% checklist ~100h, cleanup 10–20h), an **at-risk section** (the one potentially missable trophy and the traps around it) and an **unconfirmed section** for what no guide has settled.
- **11 disputes** where the guides disagree (platinum time, hidden count, medal counts, final-mission chapter, and more) — both versions shown, with **our call** on each.
- **100% ledger**: 34 counted lines for A Long Road, trophy target vs 100% target shown separately, money lines in dollars listed separately, with interactive counters.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests, no external fonts, images or scripts. Open `app/index.html` directly from disk also works, except `fetch` of the data file needs a server in some browsers — use `serve.ts`.

## Layout

- `app/index.html`, `app/app.js`, `app/style.css` — the app.
- `app/data/trophies.json` — the 55 trophies, guides and citations.
- `screenshots/` — 4 JPEG captures of the running app (1280×800).
- `main.ts` — entrypoint: copies `app/` + `screenshots/` to the output dir and writes `dossier.json` via the vendored make.fun library.
- `serve.ts` — local static server for development.

## Sources and honesty notes

- Trophy names, descriptions and grades follow the official list. Everything else is written fresh for this codex.
- Five trophies (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) have no confirmed unlock method in any guide read; the codex says so plainly instead of guessing.
- PSNProfiles, Exophase, TrueTrophies and PlayStationTrophies.org could not be opened directly during this build, so they are cited second-hand through the pages that report their data; the hidden-flag count of 28 is cross-checked across GTABase, Insider Gaming, eGamers, Sixshore and PlanetGTA6.
- An unofficial fan guide. Grand Theft Auto, GTA and Rockstar Games are trademarks of their owners; this project is not affiliated with or endorsed by Rockstar Games or Sony.

## License

MIT — see [LICENSE](LICENSE).
