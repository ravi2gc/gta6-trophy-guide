[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ravi2gc/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ravi2gc/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA 6 Trophy Guide & Tracker

An offline guide and tracker for all **55 GTA 6 trophies on PlayStation 5** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze). Every trophy is shown with its official name, description and grade as PlayStation publishes them, plus a guide written in our own words, a step list, and named sources for the facts — a cited guide beats an uncited one, so every trophy links to the public lists its facts come from.

The tracker saves your progress in the browser (localStorage), exports it to a file and imports it back. Filters cover story, missable, collectibles, activities, side stories, crime, money and exploration, plus grade, search and earned/not-earned. A spoiler setting hides the 28 hidden story trophies' names, descriptions and guides until you earn them. A six-stage roadmap takes you from the opening mission to the Platinum in order — and flags the one trophy the public guides say can be missed (**Positive Mental Attitude**: meditate at every spot, starting with the Chapter 1 meditation).

The app is plain static files (vanilla JS, no libraries, no build step) and works fully offline. It fetches nothing at run time except its own `data/trophies.json`.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. (`node serve.ts --port <n>` picks another port.) The guide needs a server because it loads `data/trophies.json` with a relative path; opening the file directly will not work.

## Guide overview

- **Checklist** — all 55 trophies with official name, description, grade, kind, count targets (e.g. 250 stunts, 42 Shooting Range golds, 100 WAiNK It locations) and a missable flag. Tick a trophy off and it stays ticked.
- **Guides** — every trophy has a guide in our own words (what to do, where and how, when it can be missed), a short step list, and two cited sources per trophy (GTABase, KeenGamer, Insider Gaming, EGamers — the public lists that carry the official 55). Nothing is copied from another guide.
- **Roadmap to the Platinum** — six stages: (1) play the story, (2) strangers & side stories, (3) activities & skills, (4) collectibles & exploration, (5) crime & money, (6) 100% completion and the Platinum. Built from the official descriptions: which chapters and missions, which collectibles and counts, in what order.
- **Spoiler setting** — hides the 28 hidden story trophies until earned.
- **Export / import** — progress downloads as `gta6-trophy-progress.json` and imports back.
- **Deep links** — `?view=roadmap`, `?kind=story`, `?grade=silver`, `?spoiler=on`, `?earned=2,3,8`, `?guide=17`, `#trophy-28`.

## Facts the guide is built on

- 55 trophies: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden until earned.
- One playthrough (about 200 hours), no online trophies, no mission replay, free roam after the story.
- Hardest trophy: **A Long Road** (100% completion).
- Cheats disable trophies and saving — keep them off a trophy run.

<sub>Entered on [make.fun](https://make.fun/?ref=vpfq6vhj&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
