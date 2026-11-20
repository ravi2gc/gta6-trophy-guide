// Vice Atlas — GTA VI trophy guide and tracker.
// Loads data/trophies.json, keeps earned marks in localStorage, and renders
// the checklist, the six-stage platinum roadmap and the missable warnings.
// Everything runs offline; the only network use is the reader following a
// citation link out of the page.

const STORE_KEY = 'vice-atlas-earned-v1';
const DATA_URL = 'data/trophies.json';
const TOTAL = 55;

const STAGES = [
  { n: 1, title: 'Story, in chapter order', blurb: 'Play the five chapters and the named story missions. Every trophy here pops on completion — just play through.' },
  { n: 2, title: 'Collectibles and spots', blurb: 'Meditation spots, cards, WAiNK scans, vehicles, garages and the full map. Do the Chapter 1 meditation first — it is the one missable trophy.' },
  { n: 3, title: 'Activities and challenges', blurb: 'Stunts, shooting ranges, drone races, races, arcade, bowling and stranger strands. The long grinds live here.' },
  { n: 4, title: 'Heists, robberies and combat', blurb: 'Bank vaults, armored trucks, gang operations, jewelry stores, Combat Focus and the money trophies that ride along with them.' },
  { n: 5, title: 'One-offs and odd jobs', blurb: 'Partner trophies, one-off challenges and the strange ones whose methods are still being confirmed. Do the one-offs when they are offered.' },
  { n: 6, title: 'Completion and platinum', blurb: 'The 100% completion gold, then the platinum itself. Open Progress > Stats > 100% Completion after the credits and work the list.' },
];

const CAUTIONS = [
  { head: 'Only one trophy can be missed', body: 'Positive Mental Attitude: the first meditation, at Jason\u2019s house in Chapter 1 after the mission Down to Earth, is missable. Follow Lucia to the balcony and meditate before the chapter ends. Everything else can be finished in free roam after the story.' },
  { head: 'There is no mission replay', body: 'The game offers 15 manual save slots and one autosave, but no way to replay a mission. Keep a manual save before any one-off moment — a character finale, a one-off challenge, a strange encounter — so a mistake costs a reload, not a playthrough.' },
  { head: 'Cheats switch trophies off', body: 'Using a cheat disables trophies and saving on that run. Keep cheats off the whole way through a trophy run, even for fun, and start a separate save if you want to mess around.' },
  { head: 'Do partner and rival moments when they appear', body: 'The partner trophies and the one-off challenges against named rivals (Cal\u2019s fishing challenge, Bret\u2019s hunt) are offered for a while, not forever. Take them when they show up rather than saving them for the post-story cleanup.' },
];

const $ = (id) => document.getElementById(id);

const grid = $('va-grid');
const stagesBox = $('va-stages');
const warningsBox = $('va-warnings');
const statusLine = $('va-status');
const showingLine = $('va-showing');
const emptyNote = $('va-empty');

let trophies = [];
let earned = new Set();
let openGuide = null;

const filters = { q: '', kind: 'all', grade: 'all', earnedOnly: false, missableOnly: false, spoiler: false };
let currentView = 'checklist';

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    earned = new Set(Array.isArray(parsed) ? parsed.filter((v) => Number.isInteger(v)) : []);
  } catch {
    earned = new Set();
  }
}

function saveEarned() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch {
    // Storage full or blocked: the page still works for this visit.
  }
}

function masked(t) {
  return filters.spoiler && t.spoiler && !earned.has(t.id);
}

function displayName(t) {
  return masked(t) ? 'Hidden story trophy' : t.name;
}

function displayDesc(t) {
  return masked(t) ? 'Hidden until earned — turn spoilers off, or earn it, to reveal it.' : t.description;
}

function gradeLabel(g) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

function kindLabel(k) {
  return k === 'missable' ? 'Missable' : k.charAt(0).toUpperCase() + k.slice(1);
}

function passFilters(t) {
  if (filters.kind !== 'all' && t.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
  if (filters.earnedOnly && !earned.has(t.id)) return false;
  if (filters.missableOnly && !t.missable) return false;
  if (filters.q) {
    const hay = (t.name + ' ' + t.description).toLowerCase();
    if (!hay.includes(filters.q)) return false;
  }
  return true;
}

function renderTally() {
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  const tally = $('va-grade-tally');
  tally.replaceChildren();
  for (const g of grades) {
    const total = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = gradeLabel(g);
    li.append(b, document.createTextNode(' ' + got + '/' + total));
    tally.append(li);
  }
  const done = earned.size;
  $('va-count-line').textContent = done + ' of ' + TOTAL + ' earned';
  $('va-percent').textContent = Math.round((done / TOTAL) * 100) + '%';
  const fill = $('va-meter-fill');
  fill.style.width = ((done / TOTAL) * 100).toFixed(1) + '%';
  $('va-meter').setAttribute('aria-valuenow', String(done));
}

function buildCard(t) {
  const card = document.createElement('article');
  card.className = 'va-card' + (earned.has(t.id) ? ' va-earned' : '');
  card.id = 'trophy-' + t.id;

  const top = document.createElement('div');
  top.className = 'va-card-top';

  const boxWrap = document.createElement('label');
  boxWrap.className = 'va-earned-box';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveEarned();
    renderAll();
  });
  boxWrap.append(box);

  const head = document.createElement('div');
  head.className = 'va-card-head';
  const title = document.createElement('h3');
  title.textContent = displayName(t);
  if (masked(t)) title.className = 'va-masked-name';
  const desc = document.createElement('p');
  desc.textContent = displayDesc(t);
  if (masked(t)) desc.className = 'va-masked-text';
  head.append(title, desc);

  const pill = document.createElement('span');
  pill.className = 'va-pill va-pill-' + t.grade;
  pill.textContent = t.grade === 'platinum' ? 'Platinum' : t.grade === 'gold' ? 'Gold' : t.grade === 'silver' ? 'Silver' : 'Bronze';
  top.append(boxWrap, head, pill);
  card.append(top);

  const tags = document.createElement('div');
  tags.className = 'va-tags';
  const kindTag = document.createElement('span');
  kindTag.className = 'va-tag';
  kindTag.textContent = kindLabel(t.kind);
  tags.append(kindTag);
  const stageTag = document.createElement('span');
  stageTag.className = 'va-tag va-tag-stage';
  stageTag.textContent = 'Roadmap stage ' + t.roadmap;
  tags.append(stageTag);
  if (t.missable) {
    const miss = document.createElement('span');
    miss.className = 'va-tag va-tag-missable';
    miss.textContent = 'Missable';
    tags.append(miss);
  }
  if (t.spoiler) {
    const spoil = document.createElement('span');
    spoil.className = 'va-tag va-tag-spoiler';
    spoil.textContent = 'Story spoiler';
    tags.append(spoil);
  }
  card.append(tags);

  if (masked(t)) {
    const note = document.createElement('p');
    note.className = 'va-masked-text';
    note.textContent = 'Guide hidden while spoilers are on.';
    card.append(note);
    return card;
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'va-guide-toggle';
  const isOpen = openGuide === t.id;
  toggle.textContent = isOpen ? 'Hide guide' : 'Read the guide';
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  const guide = document.createElement('div');
  guide.className = 'va-guide';
  guide.hidden = !isOpen;
  const para = document.createElement('p');
  para.textContent = t.guide;
  guide.append(para);
  const steps = document.createElement('ol');
  for (const s of t.steps || []) {
    const li = document.createElement('li');
    li.textContent = s;
    steps.append(li);
  }
  guide.append(steps);
  const srcList = document.createElement('ul');
  srcList.className = 'va-sources';
  for (const s of t.sources || []) {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = 'Source: ';
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(label, a);
    srcList.append(li);
  }
  guide.append(srcList);

  toggle.addEventListener('click', () => {
    openGuide = openGuide === t.id ? null : t.id;
    syncUrl();
    renderGrid();
  });
  card.append(toggle, guide);
  return card;
}

function renderGrid() {
  const shown = trophies.filter(passFilters);
  grid.replaceChildren();
  for (const t of shown) grid.append(buildCard(t));
  showingLine.textContent = 'Showing ' + shown.length + ' of ' + TOTAL;
  emptyNote.hidden = shown.length !== 0;
}

function renderRoadmap() {
  stagesBox.replaceChildren();
  for (const stage of STAGES) {
    const members = trophies.filter((t) => t.roadmap === stage.n);
    const got = members.filter((t) => earned.has(t.id)).length;
    const block = document.createElement('div');
    block.className = 'va-stage';
    const h = document.createElement('h3');
    const num = document.createElement('span');
    num.textContent = 'Stage ' + stage.n + ' — ';
    h.append(num, document.createTextNode(stage.title));
    const meta = document.createElement('p');
    meta.textContent = stage.blurb + ' (' + got + ' of ' + members.length + ' earned)';
    const list = document.createElement('ol');
    for (const t of members) {
      const li = document.createElement('li');
      if (earned.has(t.id)) li.className = 'va-done';
      const b = document.createElement('b');
      b.textContent = '#' + t.id;
      li.append(b, document.createTextNode(' ' + displayName(t) + ' — ' + gradeLabel(t.grade)));
      list.append(li);
    }
    block.append(h, meta, list);
    stagesBox.append(block);
  }
}

function renderWarnings() {
  warningsBox.replaceChildren();
  for (const c of CAUTIONS) {
    const box = document.createElement('div');
    box.className = 'va-warning';
    const h = document.createElement('h3');
    h.textContent = c.head;
    const p = document.createElement('p');
    p.textContent = c.body;
    box.append(h, p);
    warningsBox.append(box);
  }
  const missables = trophies.filter((t) => t.missable);
  for (const t of missables) {
    const box = document.createElement('div');
    box.className = 'va-warning';
    const h = document.createElement('h3');
    h.textContent = 'Missable: ' + t.name;
    const p = document.createElement('p');
    p.textContent = t.guide;
    box.append(h, p);
    warningsBox.append(box);
  }
}

function renderAll() {
  renderTally();
  renderGrid();
  renderRoadmap();
  renderWarnings();
}

function showView(view) {
  currentView = view;
  $('va-list-view').hidden = view !== 'checklist';
  $('va-roadmap-view').hidden = view !== 'roadmap';
  $('va-missable-view').hidden = view !== 'missable';
  // The "Showing X of 55" count describes the checklist only; hide it on
  // the roadmap and warnings views so it never reads as a roadmap count.
  showingLine.hidden = view !== 'checklist';
  for (const [id, name] of [['va-view-checklist', 'checklist'], ['va-view-roadmap', 'roadmap'], ['va-view-missable', 'missable']]) {
    const btn = $(id);
    const active = name === view;
    btn.classList.toggle('va-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
  syncUrl();
}

function syncUrl() {
  const params = new URLSearchParams();
  if (currentView !== 'checklist') params.set('view', currentView);
  if (filters.kind !== 'all') params.set('kind', filters.kind);
  if (filters.grade !== 'all') params.set('grade', filters.grade);
  if (filters.q) params.set('q', filters.q);
  if (filters.earnedOnly) params.set('earned', 'only');
  if (filters.missableOnly) params.set('missable', 'only');
  if (filters.spoiler) params.set('spoiler', 'on');
  if (openGuide !== null) params.set('guide', String(openGuide));
  const query = params.toString();
  const hash = window.location.hash;
  history.replaceState(null, '', window.location.pathname + (query ? '?' + query : '') + hash);
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  if (view === 'roadmap' || view === 'missable') currentView = view;
  const kind = params.get('kind');
  if (['story', 'missable', 'collectibles', 'activities', 'online'].includes(kind)) filters.kind = kind;
  const grade = params.get('grade');
  if (['platinum', 'gold', 'silver', 'bronze'].includes(grade)) filters.grade = grade;
  filters.q = params.get('q') || '';
  filters.earnedOnly = params.get('earned') === 'only';
  filters.missableOnly = params.get('missable') === 'only';
  filters.spoiler = params.get('spoiler') === 'on';
  const guide = Number(params.get('guide'));
  if (Number.isInteger(guide) && guide >= 1 && guide <= TOTAL) openGuide = guide;

  $('va-search').value = filters.q;
  $('va-kind').value = filters.kind;
  $('va-grade').value = filters.grade;
  $('va-earned-only').checked = filters.earnedOnly;
  $('va-missable-only').checked = filters.missableOnly;
  $('va-spoiler').checked = filters.spoiler;
}

function bindControls() {
  $('va-search').addEventListener('input', (e) => {
    filters.q = e.target.value.trim().toLowerCase();
    syncUrl();
    renderGrid();
  });
  $('va-kind').addEventListener('change', (e) => {
    filters.kind = e.target.value;
    syncUrl();
    renderGrid();
  });
  $('va-grade').addEventListener('change', (e) => {
    filters.grade = e.target.value;
    syncUrl();
    renderGrid();
  });
  $('va-earned-only').addEventListener('change', (e) => {
    filters.earnedOnly = e.target.checked;
    syncUrl();
    renderGrid();
  });
  $('va-missable-only').addEventListener('change', (e) => {
    filters.missableOnly = e.target.checked;
    syncUrl();
    renderGrid();
  });
  $('va-spoiler').addEventListener('change', (e) => {
    filters.spoiler = e.target.checked;
    syncUrl();
    renderAll();
  });
  $('va-view-checklist').addEventListener('click', () => showView('checklist'));
  $('va-view-roadmap').addEventListener('click', () => showView('roadmap'));
  $('va-view-missable').addEventListener('click', () => showView('missable'));

  $('va-export').addEventListener('click', () => {
    const payload = {
      game: 'Grand Theft Auto VI',
      guide: 'Vice Atlas',
      exported: new Date().toISOString(),
      earned: [...earned].sort((a, b) => a - b),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vice-atlas-progress.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    statusLine.textContent = 'Exported ' + earned.size + ' earned trophies to vice-atlas-progress.json.';
  });

  $('va-import').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error('bad file');
      const known = new Set(trophies.map((t) => t.id));
      const names = new Map(trophies.map((t) => [t.name, t.id]));
      let applied = 0;
      for (const v of ids) {
        let id = null;
        if (Number.isInteger(v) && known.has(v)) id = v;
        else if (typeof v === 'string' && names.has(v)) id = names.get(v);
        if (id !== null && !earned.has(id)) {
          earned.add(id);
          applied += 1;
        }
      }
      saveEarned();
      renderAll();
      statusLine.textContent = 'Imported ' + applied + ' trophies as earned from ' + file.name + '.';
    } catch {
      statusLine.textContent = 'Could not read ' + file.name + ': not a Vice Atlas progress file.';
    }
  });

  $('va-reset').addEventListener('click', () => {
    if (!earned.size) return;
    if (!window.confirm('Clear all ' + earned.size + ' earned marks?')) return;
    earned.clear();
    saveEarned();
    renderAll();
    statusLine.textContent = 'Progress cleared.';
  });
}

async function boot() {
  loadEarned();
  readUrl();
  bindControls();
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('fetch failed');
    const doc = await res.json();
    trophies = doc.trophies || doc;
    trophies.sort((a, b) => a.id - b.id);
  } catch {
    statusLine.textContent = 'Could not load the trophy list. Check that data/trophies.json sits beside this page.';
    trophies = [];
  }
  showView(currentView);
  renderAll();
  const hash = window.location.hash;
  if (hash.startsWith('#trophy-')) {
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.scrollIntoView({ block: 'center' });
      el.classList.add('va-flash');
      setTimeout(() => el.classList.remove('va-flash'), 2500);
    }
  } else if (openGuide !== null) {
    const el = document.getElementById('trophy-' + openGuide);
    if (el) el.scrollIntoView({ block: 'center' });
  }
}

boot();
