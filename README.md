# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ravi2gc/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ravi2gc/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Vice Atlas — an offline guide and checklist tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5, with a six-stage platinum roadmap, missable flags, a spoiler setting, and a guide with cited sources for every trophy.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network: every file the page loads sits under `app/`, and your progress is saved only in your browser (localStorage).

---

<sub>Entered on [make.fun](https://make.fun/?ref=vpfq6vhj&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

## What it does

- **Checklist tracker** — tick trophies off as you earn them; progress survives reloads and shows overall and per-grade counts.
- **Filters** — text search, kind (story / missable / collectibles / activities / online), grade, earned-only, missable-only. A "Showing X of 55" count stays visible.
- **Spoiler setting** — hides the names and descriptions of the 28 hidden story trophies until they are earned. Off by default.
- **Export / import** — download your earned set as JSON and import it back on another machine.
- **Platinum roadmap** — six ordered stages: story in chapter order, collectibles, activities, heists and robberies, one-offs, then the 100% completion gold and the platinum.
- **Missables & warnings** — the one trophy the published guides flag as potentially missable (Positive Mental Attitude, Chapter 1), plus the cautions that matter with no mission replay.
- **Deep links** — `?view=roadmap`, `?kind=`, `?grade=`, `?spoiler=on`, `?guide=<trophy id>` and `#trophy-<id>` anchors.

## The data

The trophy names, descriptions and grades are the official PlayStation list: 55 trophies — 1 platinum, 2 gold, 6 silver, 46 bronze — 28 of them hidden until earned, none of them online. Every guide is written for this page in its own words, with at least two cited sources per trophy, and says plainly where a method is still unconfirmed by players instead of guessing. Counts the guides agree on: 42 Shooting Range challenges, 14 drone race locations, 18 meditation spots, 18 card sets, 100 WAiNK locations, 250 stunts of 397, 200 of 277 vehicles scanned for 100%, about 200 hours to the platinum.

No Rockstar Games artwork or logo is used anywhere in this guide.
