// Leonida Legend — GTA VI trophy guide entry (Node 22, standard library only).
// The guide is this directory's app/ folder: plain static files a browser opens
// at app/index.html (ES module, CSS, no build step), offline: it loads nothing
// over the network, and its trophy list and guides are app/data/trophies.json.
// This program hands it in: it copies app/ and screenshots/ from beside this
// file to /output and writes /output/dossier.json, the summary the judge reads
// (the screenshots, the first load's files and bytes, and the source), with the
// vendored make.fun library. Leave vendor/makefun-frontend.ts as it is: the
// scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Pre-flight: the gate holds app/data/trophies.json to the same 55 official
// trophies, each named with a guide that is not blank. Fail loudly here,
// before copying anything, rather than handing in an entry the scorer
// would refuse.
const trophyFile = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophies = Array.isArray(trophyFile) ? trophyFile : trophyFile.trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`expected 55 trophies, found ${Array.isArray(trophies) ? trophies.length : 'none'}`);
}
const unusable = trophies.filter((t) => typeof t.name !== 'string' || !t.name.trim() || typeof t.guide !== 'string' || !t.guide.trim());
if (unusable.length > 0) {
  throw new Error(`${unusable.length} trophies are missing a name or a guide`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

// Summary for the build log: what was handed in, and how big it is.
import { readdirSync, statSync } from 'node:fs';
function countFiles(dir) {
  let files = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    files += entry.isDirectory() ? countFiles(path) : 1;
  }
  return files;
}
const dossierBytes = statSync(join(out, 'dossier.json')).size;
console.log(`handed in ${trophies.length} trophies, ${countFiles(join(out, 'app'))} app files, dossier.json ${dossierBytes} bytes -> ${out}`);
