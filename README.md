[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Andy74453533/makefun-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Andy74453533/makefun-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

An offline, open-source guide and tracker for all 55 PlayStation 5 trophies of
Grand Theft Auto VI. Built for the [$250 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## The list

55 trophies in all: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 of them are
hidden on PlayStation until earned. No online trophies, no DLC, one
playthrough — roughly 200 hours to the platinum (PowerPyx; Push Square says
250 or more).

## What it does

A static web app that opens in a desktop browser and keeps working with the
network off. It tracks your progress on the official list and guides you to
every trophy:

- **Checklist** — tick trophies off; progress is saved in the browser
  (localStorage) and can be exported to a JSON file and imported back.
  Filters by grade and kind, full-text search, a "hide earned" switch, and a
  spoiler setting that hides story trophies until you earn them. A "Next up"
  planner points at the next trophy in roadmap order.
- **Roadmap** — three stages to the platinum: the story first (~60–80 hours),
  then the 100% checklist (~100 hours), then Strangers & Freaks and cleanup
  (~10 hours). Each stage lists its trophies with per-stage progress.
- **Missables** — the one trophy that may be missable, Positive Mental
  Attitude (and the Chapter 1 meditation that protects it), plus the things
  that look missable but are not.
- **A guide to each trophy, written in our own words, with its sources named
  beside it** — what to do, where, and when it can be missed. Nothing is
  copied from the cited guides. Where the method has not yet been pinned down,
  the guide says so plainly instead of inventing a step.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network at run time. Every file the app loads lives under
`app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory
and writes `output/dossier.json` with the vendored make.fun library
(`vendor/makefun-frontend.ts`, copied from the kit unchanged).

## Sources

The official trophy names, descriptions and grades are as PlayStation
publishes them (Exophase and PSNProfiles, frozen 18 Nov 2026). The guides
draw on, and cite, PowerPyx, Push Square, KeenGamer, GTABase and RadioTimes.
See the About & Sources view in the app for the full list with links.

## License

MIT. See [LICENSE](LICENSE).
