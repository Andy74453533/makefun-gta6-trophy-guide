// Leonida Legend — GTA VI trophy guide & tracker.
// Plain static app: one fetch of data/trophies.json, progress in localStorage,
// no network at run time. Written for this entry.

const KEY = 'gta6-trophy-guide-v1';

const state = {
  earned: new Set(),
  spoiler: true,
  theme: 'night',
  open: new Set(),
};

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    if (Array.isArray(raw.earned)) state.earned = new Set(raw.earned);
    if (typeof raw.spoiler === 'boolean') state.spoiler = raw.spoiler;
    if (raw.theme === 'light' || raw.theme === 'night') state.theme = raw.theme;
  } catch {
    // Corrupt save: start fresh rather than crash.
  }
}

function saveState() {
  localStorage.setItem(KEY, JSON.stringify({
    earned: [...state.earned],
    spoiler: state.spoiler,
    theme: state.theme,
  }));
}

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const missableTrophy = trophies.find((t) => t.missable);

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const gradeSel = $('grade');
const kindSel = $('kind');
const searchInput = $('search');
const missableOnly = $('missable-only');
const hideEarned = $('hide-earned');
const spoilerBox = $('spoiler');
const themeBtn = $('theme');

loadState();
applyTheme();
spoilerBox.checked = state.spoiler;

function applyTheme() {
  document.body.classList.toggle('light', state.theme === 'light');
  themeBtn.textContent = state.theme === 'light' ? 'Dark theme' : 'Light theme';
}

function isStory(t) {
  return t.kind.includes('story');
}

function masked(t) {
  return state.spoiler && isStory(t) && !state.earned.has(t.id);
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function renderProgress() {
  const total = trophies.length;
  const earned = state.earned.size;
  $('earned-count').textContent = earned;
  $('bar-fill').style.width = `${Math.round((earned / total) * 100)}%`;
  const counts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const got = trophies.filter((t) => t.grade === g && state.earned.has(t.id)).length;
    const all = trophies.filter((t) => t.grade === g).length;
    return `${gradeLabel({ grade: g })} ${got}/${all}`;
  });
  $('grade-counts').textContent = counts.join(' · ');
  const next = [...trophies].sort((a, b) => (a.stage - b.stage) || (a.id - b.id))
    .find((t) => !state.earned.has(t.id));
  const nextEl = $('next-up');
  if (!next) {
    nextEl.innerHTML = '';
    nextEl.append('Platinum earned — you are a Leonida Legend.');
  } else {
    nextEl.innerHTML = '';
    nextEl.append('Next up: ');
    const strong = el('strong', null, masked(next) ? 'A hidden story trophy' : next.name);
    nextEl.append(strong);
    nextEl.append(` — ${next.stage === 1 ? 'story' : next.stage === 2 ? '100% cleanup' : 'final cleanup'}.`);
  }
}

function badge(text, cls) {
  return el('span', `badge ${cls}`, text);
}

function renderList() {
  const q = searchInput.value.trim().toLowerCase();
  const grade = gradeSel.value;
  const kind = kindSel.value;
  const shown = trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind !== 'all' && !t.kind.includes(kind)) return false;
    if (missableOnly.checked && !t.missable) return false;
    if (hideEarned.checked && state.earned.has(t.id)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  $('result-count').textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  listEl.replaceChildren();
  if (shown.length === 0) {
    listEl.append(el('p', 'note', 'Nothing matches those filters. Clear the search or widen the grade and kind.'));
    return;
  }
  for (const t of shown) {
    listEl.append(card(t));
  }
}

function card(t) {
  const earned = state.earned.has(t.id);
  const hidden = masked(t);
  const article = el('article', `card${earned ? ' earned' : ''}`);
  const top = el('div', 'card-top');

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned;
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(t.id);
    else state.earned.delete(t.id);
    saveState();
    renderProgress();
    renderList();
  });
  top.append(box);
  top.append(el('span', `medal ${t.grade}`));

  const body = el('div', 'card-body');
  body.append(el('h3', 'trophy-name', hidden ? 'Hidden story trophy' : t.name));
  body.append(el('p', 'trophy-desc', hidden
    ? 'Complete the story to reveal this trophy. Tick it off once you have earned it.'
    : t.description));

  const badges = el('div', 'badges');
  badges.append(badge(gradeLabel(t), `grade-${t.grade}`));
  for (const k of t.kind) badges.append(badge(k, ''));
  if (t.hidden) badges.append(badge('Hidden on PSN', 'hidden-badge'));
  if (t.count) badges.append(badge(`Target: ${t.count}`, 'count-badge'));
  if (t.missable) badges.append(badge('Possibly missable', 'missable'));
  body.append(badges);

  if (hidden) {
    body.append(el('p', 'spoiler-note', 'Spoilers hidden — earn this trophy (or turn the spoiler setting off) to see its guide.'));
  } else {
    if (t.missable) {
      body.append(el('p', 'warn', 'Possibly missable — read the guide below before you finish Chapter 1.'));
    }
    const toggle = el('button', 'guide-toggle', state.open.has(t.id) ? 'Hide guide ▲' : 'Show guide ▼');
    toggle.type = 'button';
    toggle.addEventListener('click', () => {
      if (state.open.has(t.id)) state.open.delete(t.id);
      else state.open.add(t.id);
      renderList();
    });
    body.append(toggle);
    if (state.open.has(t.id)) {
      const guide = el('div', 'guide');
      guide.append(el('p', null, t.guide));
      const src = el('p', 'sources', 'Sources: ');
      t.sources.forEach((s, i) => {
        if (i > 0) src.append(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.name;
        a.rel = 'noopener';
        src.append(a);
      });
      guide.append(src);
      body.append(guide);
    }
  }
  top.append(body);
  article.append(top);
  return article;
}

function renderRoadmap() {
  const wrap = $('roadmap');
  wrap.replaceChildren();
  for (const stage of doc.roadmap) {
    const members = trophies.filter((t) => t.stage === stage.stage);
    const done = members.filter((t) => state.earned.has(t.id)).length;
    const box = el('section', 'stage');
    box.append(el('h3', null, `Stage ${stage.stage} — ${stage.title}`));
    box.append(el('p', 'stage-meta', `${stage.hours} · ${done} of ${members.length} trophies earned in this stage`));
    box.append(el('p', null, stage.text));
    const ul = document.createElement('ul');
    for (const t of members) {
      const li = el('li', state.earned.has(t.id) ? 'done' : '',
        `${masked(t) ? 'Hidden story trophy' : t.name} — ${gradeLabel(t)}`);
      ul.append(li);
    }
    box.append(ul);
    wrap.append(box);
  }
}

function renderMissables() {
  const wrap = $('missables');
  wrap.replaceChildren();
  if (missableTrophy) {
    const cardEl = el('article', 'missable-card');
    cardEl.append(el('h3', null, `${missableTrophy.name} — possibly missable`));
    cardEl.append(el('p', null, missableTrophy.guide));
    const src = el('p', 'sources', 'Sources: ');
    missableTrophy.sources.forEach((s, i) => {
      if (i > 0) src.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.rel = 'noopener';
      src.append(a);
    });
    cardEl.append(src);
    wrap.append(cardEl);
  }
  const note = el('p', 'note',
    'Push Square lists no known missables, and PowerPyx flags this one only as a maybe — nobody has confirmed it either way yet. The safe move costs a minute in Chapter 1, so take it.');
  wrap.append(note);
}

function renderSources() {
  const ul = $('source-list');
  ul.replaceChildren();
  for (const s of doc.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.rel = 'noopener';
    li.append(a);
    ul.append(li);
  }
}

function showView(name) {
  for (const btn of document.querySelectorAll('.tabs button')) {
    btn.classList.toggle('active', btn.dataset.view === name);
  }
  for (const view of document.querySelectorAll('.view')) {
    view.hidden = view.id !== `view-${name}`;
  }
  if (name === 'roadmap') renderRoadmap();
  if (name === 'missables') renderMissables();
  if (name === 'checklist') renderList();
}

function route() {
  const name = (location.hash || '#/checklist').replace('#/', '');
  const known = ['checklist', 'roadmap', 'missables', 'about'];
  showView(known.includes(name) ? name : 'checklist');
}

for (const btn of document.querySelectorAll('.tabs button')) {
  btn.addEventListener('click', () => {
    location.hash = `#/${btn.dataset.view}`;
  });
}
window.addEventListener('hashchange', route);

for (const input of [gradeSel, kindSel, missableOnly, hideEarned]) {
  input.addEventListener('change', renderList);
}
searchInput.addEventListener('input', renderList);
spoilerBox.addEventListener('change', () => {
  state.spoiler = spoilerBox.checked;
  saveState();
  renderProgress();
  renderList();
});
themeBtn.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'night' : 'light';
  applyTheme();
  saveState();
});

$('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ earned: [...state.earned], exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const raw = JSON.parse(await file.text());
    const ids = Array.isArray(raw) ? raw : raw.earned;
    if (!Array.isArray(ids)) throw new Error('bad file');
    state.earned = new Set(ids.filter((id) => byId.has(id)));
    saveState();
    renderProgress();
    renderList();
  } catch {
    alert('That file is not a trophy progress export from this guide.');
  }
  e.target.value = '';
});

renderSources();
renderProgress();
route();
