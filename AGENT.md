# AGENT.md — Leonida Legend (gta6-trophy-guide-01)

Build notes for the agent that made this entry, and for anyone rebuilding it.

## What this is

An offline static web app (app/) that guides and tracks all 55 GTA VI PS5
trophies, handed in by main.ts (Node 22) as a dossier (vendor/
makefun-frontend.ts, copied from the kit unchanged).

## How it was built

1. Read the kit (competition.yaml, RULES.txt, starter/) and the starter's
   app/data/trophies.json, which carries the official 55-trophy list frozen
   2026-11-18 (Exophase / PSNProfiles): 1 platinum, 2 gold, 6 silver,
   46 bronze, 28 hidden.
2. Researched the trophy details from the web in-session: PowerPyx's trophy
   guide and roadmap, Push Square's trophy guide and roadmap, KeenGamer's
   trophy guide and platinum roadmap, GTABase's achievements and trophies
   list, and RadioTimes' full trophy list. Key findings, all cited in the
   data: the platinum takes about 200 hours at difficulty 4/10; one
   playthrough; no online trophies; the only possibly missable trophy is
   Positive Mental Attitude (a Chapter 1 balcony meditation with Lucia);
   the 100% checklist is lenient (about 60% true completion); cheats
   disable trophies and saving; five trophies' methods were not yet pinned
   down at launch and are flagged as unconfirmed in the guides.
3. Wrote app/data/trophies.json from scratch: all 55 official names,
   descriptions and grades, each with a guide in our own words, its sources,
   its kind, its roadmap stage, a missable flag and a PSN count where one
   exists. Verified against the starter list: 55/55 names match exactly,
   no blank guides, every trophy cites at least one source.
4. Wrote app/index.html, app/style.css and app/app.js from scratch: a dark
   "night" theme (light theme toggle) with a coral accent; checklist with
   localStorage progress, export/import, grade and kind filters, search,
   hide-earned, a spoiler setting that masks story trophies until earned,
   and a Next-up planner; a roadmap view in three stages with per-stage
   progress; a missables view; an About & Sources view.
5. Wrote main.ts (copy app/ and screenshots/ to /output, write dossier.json
   with buildDossier) and serve.ts (tiny static server for local testing).
6. Served the app locally and took 4 screenshots of real renders with
   Playwright Chromium at 1280x800, progress seeded (13 of 55 earned):
   1-checklist.jpg (checklist with a guide open), 2-roadmap.jpg (roadmap),
   3-missables.jpg (missables), 4-spoiler.jpg (checklist with the spoiler
   setting on).
7. Ran `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` and verified
   /output contains app/, screenshots/ and dossier.json.
8. Published to GitHub (Andy74453533/makefun-gta6-trophy-guide) via the
   Contents API, with .makefun/owner.json in the first commit.

## Design choices worth knowing

- The judge reads screenshots and an outline, not the JSON: the four
  screenshots were chosen to show the checklist with a guide open, the
  roadmap, the missables, and the spoiler setting at work.
- Guides are honest about what is unconfirmed. The game is a day old;
  inventing a step for an unconfirmed trophy would be worse than saying
  "not yet confirmed".
- The app makes no network request at run time. Source links are plain
  <a> links that open only when the reader follows them.
- No Rockstar logo or official artwork anywhere; the look is our own.
