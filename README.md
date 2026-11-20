# Leonida Legend — GTA VI Trophy Guide & Tracker

![Leonida Legend](https://img.shields.io/badge/make.fun-bounty-gta6--trophy--guide--01)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![GTA VI trophies: 55](https://img.shields.io/badge/trophies-55-blue)

An offline, open-source guide and tracker for all 55 PlayStation 5 trophies of
Grand Theft Auto VI. Made for the [$250 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

A static web app that opens in a desktop browser and works with the network
off. It tracks your progress on the official list — every trophy with its
official name, description and grade — and guides you to each one:

- **Checklist** — tick trophies off; progress is saved in the browser
  (localStorage), with export to a JSON file and import back. Filters by grade
  and kind, full-text search, a "hide earned" switch, and a spoiler setting
  that hides story trophies until you earn them. A "Next up" planner points at
  the next trophy in roadmap order.
- **Roadmap** — three stages to the platinum (story first, ~60–80 hours; the
  100% checklist, ~100 hours; Strangers & Freaks and cleanup, ~10 hours),
  each with its trophies and per-stage progress.
- **Missables** — the one trophy that may be missable (Positive Mental
  Attitude, and the Chapter 1 meditation that protects it), plus the things
  that look missable but are not.
- **A guide to each trophy, in our own words, with its sources named beside
  it** — what to do, where, and when it can be missed. Nothing is copied from
  the cited guides. Where the guide writers have not yet pinned a method
  down, the guide says so plainly instead of inventing a step.

## The list at a glance

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 are hidden on
PlayStation until earned (12 story trophies and 16 hidden side trophies).
No online trophies, no DLC, one playthrough, about 200 hours to the
platinum (PowerPyx; Push Square says 250 or more).

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network at run time. Every file the app loads is under
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
