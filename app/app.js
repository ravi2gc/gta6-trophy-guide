// Leonida Legend — GTA 6 trophy guide & tracker.
// Vanilla JS, no libraries, no network at run time except the local
// fetch of data/trophies.json. Progress lives in localStorage; export and
// import move it as a plain JSON file. URL state: ?view=roadmap,
// ?kind=story, ?grade=silver, ?spoiler=on, ?earned=2,3,8 (session-only
// preset when nothing is saved yet), ?guide=17, #trophy-<id>.
(function () {
  'use strict';

  var STORAGE_KEY = 'leonida-legend-progress-v1';
  var DATA_URL = 'data/trophies.json';
  var KIND_LABELS = {
    all: 'All', story: 'Story', missable: 'Missable', collectible: 'Collectibles',
    activity: 'Activities', side: 'Side stories', crime: 'Crime', economy: 'Money',
    exploration: 'Exploration', misc: 'Secrets', meta: 'Platinum & 100%'
  };
  var KIND_ORDER = ['all', 'story', 'missable', 'collectible', 'activity', 'side', 'crime', 'economy', 'exploration', 'misc', 'meta'];
  var STAGES = [
    { n: 1, title: 'Play the story', text: 'Chapters 1–4, the named missions and the final mission. Do the story-moment trophies while their missions are live — the guides report no mission replay. In Chapter 1, take the meditation for Positive Mental Attitude.' },
    { n: 2, title: 'Strangers & side stories', text: 'Meet every stranger on the map and finish their strands. Eight strands earn the Strangers & Freaks silver; six named-character trophies sit in this stage.' },
    { n: 3, title: 'Activities & skills', text: 'Shooting Range golds, drone races, races, fishing, arcade, bowling and meditation. Sample every activity type once for Master of None, then work the long grinds a few at a time.' },
    { n: 4, title: 'Collectibles & exploration', text: 'Card sets, WAiNK It locations, vehicles and the whole map of Leonida. Fold WAiNK It and vehicle discovery into the same exploration trips.' },
    { n: 5, title: 'Crime & money', text: 'Bank vaults, armored trucks, gang operations and jewelry heists. The money funds the garages, and laundered Marked Bills feed Dime on the Dollar while spending feeds Treat Yo Self.' },
    { n: 6, title: '100% & the Platinum', text: 'Finish the in-game 100% checklist (Progress > Stats > 100% Completion) for A Long Road. The Platinum pops by itself once the other 54 are earned.' }
  ];

  var trophies = [];
  var byId = {};
  var earned = new Set();
  var openGuides = new Set();
  var state = { kind: 'all', grade: '', search: '', earnedOnly: false, unearnedOnly: false, spoiler: false, view: 'checklist' };
  var sessionPreset = false;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    list: $('trophyList'), roadmap: $('roadmapList'), progressText: $('progressText'),
    progressFill: $('progressFill'), gradeCounts: $('gradeCounts'), resultCount: $('resultCount'),
    emptyNote: $('emptyNote'), kindFilters: $('kindFilters'), search: $('searchInput'),
    gradeFilter: $('gradeFilter'), earnedOnly: $('earnedOnly'), unearnedOnly: $('unearnedOnly'),
    spoiler: $('spoilerToggle'), saveNote: $('saveNote'), viewChecklist: $('viewChecklist'),
    viewRoadmap: $('viewRoadmap'), tabChecklist: $('tabChecklist'), tabRoadmap: $('tabRoadmap')
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      var ids = Array.isArray(data) ? data : data.earned;
      if (!Array.isArray(ids)) return false;
      ids.forEach(function (id) { earned.add(Number(id)); });
      return true;
    } catch (e) { return false; }
  }

  function saveProgress(note) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ app: 'leonida-legend', version: 1, earned: Array.from(earned).sort(function (a, b) { return a - b; }) }));
      els.saveNote.textContent = note || 'Progress saved on this device.';
    } catch (e) {
      els.saveNote.textContent = 'Could not save progress in this browser.';
    }
  }

  function readUrlState() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'roadmap') state.view = 'roadmap';
    if (params.get('kind') && KIND_LABELS[params.get('kind')]) state.kind = params.get('kind');
    if (params.get('grade')) { state.grade = params.get('grade'); els.gradeFilter.value = state.grade; }
    if (params.get('spoiler') === 'on') { state.spoiler = true; els.spoiler.checked = true; }
    if (params.get('search')) { state.search = params.get('search'); els.search.value = state.search; }
    var guideId = Number(params.get('guide'));
    if (guideId && byId[guideId]) openGuides.add(guideId);
    var earnedParam = params.get('earned');
    if (earnedParam && earned.size === 0) {
      earnedParam.split(',').forEach(function (part) {
        var id = Number(part);
        if (byId[id]) { earned.add(id); sessionPreset = true; }
      });
      if (sessionPreset) els.saveNote.textContent = 'Showing a shared progress preset — tick a trophy to save your own progress.';
    }
  }

  function isMasked(t) {
    return state.spoiler && t.spoiler && !earned.has(t.id);
  }

  function matchesFilters(t) {
    if (state.kind === 'missable') { if (!t.missable) return false; }
    else if (state.kind !== 'all' && t.kind !== state.kind) return false;
    if (state.grade && t.grade !== state.grade) return false;
    if (state.earnedOnly && !earned.has(t.id)) return false;
    if (state.unearnedOnly && earned.has(t.id)) return false;
    if (state.search) {
      var q = state.search.toLowerCase();
      var hay = (t.name + ' ' + t.description + ' ' + (t.guide || '') + ' ' + (t.roadmap_note || '')).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function trophyCard(t) {
    var li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    li.id = 'trophy-' + t.id;
    var masked = isMasked(t);
    var displayName = masked ? 'Hidden story trophy' : t.name;
    var displayDesc = masked ? 'Hidden until earned — tick it off when it pops in-game.' : t.description;
    var head = '<div class="trophy-head">' +
      '<input type="checkbox" class="trophy-check" data-id="' + t.id + '"' + (earned.has(t.id) ? ' checked' : '') + ' aria-label="Mark ' + escapeHtml(displayName) + ' as earned">' +
      '<div class="trophy-main">' +
      '<div class="trophy-title"><h3>' + escapeHtml(displayName) + '</h3>' +
      '<span class="grade grade-' + t.grade + '">' + t.grade + '</span>' +
      (t.missable ? '<span class="pill missable-pill">MISSABLE</span>' : '') +
      (t.hidden ? '<span class="pill hidden-pill">HIDDEN</span>' : '') +
      (t.count ? '<span class="pill count-pill">× ' + (t.count >= 1000 ? '$' + t.count.toLocaleString('en-US') : t.count) + '</span>' : '') +
      '</div>' +
      '<p class="trophy-desc">' + escapeHtml(displayDesc) + '</p>' +
      '<div class="trophy-meta"><span class="kind">' + escapeHtml(KIND_LABELS[t.kind] || t.kind) + '</span>' +
      '<span>Roadmap stage ' + t.roadmap + '</span>' +
      (t.roadmap_note ? '<span>' + escapeHtml(t.roadmap_note) + '</span>' : '') +
      '</div>';
    var guideOpen = openGuides.has(t.id);
    head += '<button type="button" class="guide-toggle" data-guide="' + t.id + '" aria-expanded="' + guideOpen + '">' +
      (guideOpen ? 'Hide guide ▲' : 'Show guide ▼') + '</button>';
    if (guideOpen) {
      if (masked) {
        head += '<div class="guide"><p class="spoiler-hidden">Guide hidden by the spoiler setting until this trophy is earned.</p></div>';
      } else {
        head += '<div class="guide"><h4>How to earn it</h4><p>' + escapeHtml(t.guide) + '</p>';
        if (t.steps && t.steps.length) {
          head += '<h4>Steps</h4><ol>' + t.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>';
        }
        if (t.sources && t.sources.length) {
          head += '<h4>Sources — where each fact comes from</h4><ul class="sources">' +
            t.sources.map(function (s) { return '<li><a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener">' + escapeHtml(s.name) + '</a></li>'; }).join('') + '</ul>';
        }
        head += '</div>';
      }
    }
    head += '</div></div>';
    li.innerHTML = head;
    return li;
  }

  function renderList() {
    var shown = trophies.filter(matchesFilters);
    els.list.innerHTML = '';
    shown.forEach(function (t) { els.list.appendChild(trophyCard(t)); });
    els.emptyNote.hidden = shown.length > 0;
    els.resultCount.textContent = 'Showing ' + shown.length + ' of ' + trophies.length + ' trophies' +
      (earned.size ? ' · ' + earned.size + ' earned' : '') + '.';
  }

  function renderProgress() {
    var total = trophies.length;
    var done = trophies.filter(function (t) { return earned.has(t.id); }).length;
    var pct = total ? Math.round(done / total * 100) : 0;
    els.progressText.textContent = done + ' of ' + total + ' earned · ' + pct + '%';
    els.progressFill.style.width = pct + '%';
    var counts = {};
    trophies.forEach(function (t) {
      counts[t.grade] = counts[t.grade] || { done: 0, total: 0 };
      counts[t.grade].total += 1;
      if (earned.has(t.id)) counts[t.grade].done += 1;
    });
    els.gradeCounts.innerHTML = ['platinum', 'gold', 'silver', 'bronze'].map(function (g) {
      var c = counts[g] || { done: 0, total: 0 };
      return '<span><b>' + g + '</b> ' + c.done + '/' + c.total + '</span>';
    }).join('');
  }

  function renderKindFilters() {
    els.kindFilters.innerHTML = '';
    KIND_ORDER.forEach(function (kind) {
      var count = kind === 'all' ? trophies.length
        : kind === 'missable' ? trophies.filter(function (t) { return t.missable; }).length
        : trophies.filter(function (t) { return t.kind === kind; }).length;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = KIND_LABELS[kind];
      btn.setAttribute('aria-pressed', state.kind === kind ? 'true' : 'false');
      var n = document.createElement('span');
      n.className = 'n';
      n.textContent = '(' + count + ')';
      btn.appendChild(n);
      btn.addEventListener('click', function () { state.kind = kind; renderKindFilters(); renderList(); });
      els.kindFilters.appendChild(btn);
    });
  }

  function renderRoadmap() {
    els.roadmap.innerHTML = '';
    STAGES.forEach(function (stage) {
      var members = trophies.filter(function (t) { return t.roadmap === stage.n; });
      var done = members.filter(function (t) { return earned.has(t.id); }).length;
      var li = document.createElement('li');
      li.className = 'roadmap-stage';
      var html = '<h3>' + escapeHtml(stage.title) + ' <span class="stage-count">' + done + '/' + members.length + ' earned</span></h3>' +
        '<p>' + escapeHtml(stage.text) + '</p><ul class="roadmap-trophies">';
      members.forEach(function (t) {
        var masked = isMasked(t);
        html += '<li><a href="#trophy-' + t.id + '" data-jump="' + t.id + '"' + (earned.has(t.id) ? ' class="done"' : '') + '>' +
          escapeHtml(masked ? 'Hidden story trophy' : t.name) + '</a>' +
          '<span class="grade grade-' + t.grade + '">' + t.grade + '</span>' +
          (t.missable ? '<span class="pill missable-pill">MISSABLE</span>' : '') +
          (t.count ? '<span class="pill count-pill">× ' + (t.count >= 1000 ? '$' + t.count.toLocaleString('en-US') : t.count) + '</span>' : '') +
          '<span>' + escapeHtml(t.roadmap_note || '') + '</span></li>';
      });
      html += '</ul>';
      li.innerHTML = html;
      els.roadmap.appendChild(li);
    });
  }

  function renderAll() { renderProgress(); renderList(); renderRoadmap(); }

  function switchView(view) {
    state.view = view;
    els.viewChecklist.hidden = view !== 'checklist';
    els.viewRoadmap.hidden = view !== 'roadmap';
    els.tabChecklist.classList.toggle('active', view === 'checklist');
    els.tabRoadmap.classList.toggle('active', view === 'roadmap');
  }

  function jumpToTrophy(id) {
    switchView('checklist');
    state.kind = 'all'; state.grade = ''; state.search = '';
    els.search.value = ''; els.gradeFilter.value = '';
    els.earnedOnly.checked = false; els.unearnedOnly.checked = false;
    state.earnedOnly = false; state.unearnedOnly = false;
    renderKindFilters(); renderList();
    openGuides.add(id);
    renderList();
    var el = document.getElementById('trophy-' + id);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function exportProgress() {
    var payload = { app: 'leonida-legend', version: 1, game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: Array.from(earned).sort(function (a, b) { return a - b; }) };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gta6-trophy-progress.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    els.saveNote.textContent = 'Progress exported as gta6-trophy-progress.json.';
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var ids = Array.isArray(data) ? data : data.earned;
        if (!Array.isArray(ids)) throw new Error('bad file');
        var valid = ids.map(Number).filter(function (id) { return byId[id]; });
        earned = new Set(valid);
        saveProgress('Imported ' + valid.length + ' earned trophies.');
        renderAll();
      } catch (e) {
        els.saveNote.textContent = 'That file could not be imported — it is not a progress file from this guide.';
      }
    };
    reader.readAsText(file);
  }

  function wireEvents() {
    els.list.addEventListener('change', function (e) {
      var box = e.target.closest('.trophy-check');
      if (!box) return;
      var id = Number(box.dataset.id);
      if (box.checked) earned.add(id); else earned.delete(id);
      saveProgress();
      renderProgress(); renderList(); renderRoadmap();
    });
    els.list.addEventListener('click', function (e) {
      var btn = e.target.closest('.guide-toggle');
      if (!btn) return;
      var id = Number(btn.dataset.guide);
      if (openGuides.has(id)) openGuides.delete(id); else openGuides.add(id);
      renderList();
    });
    els.roadmap.addEventListener('click', function (e) {
      var link = e.target.closest('[data-jump]');
      if (!link) return;
      e.preventDefault();
      jumpToTrophy(Number(link.dataset.jump));
    });
    els.search.addEventListener('input', function () { state.search = els.search.value; renderList(); });
    els.gradeFilter.addEventListener('change', function () { state.grade = els.gradeFilter.value; renderList(); });
    els.earnedOnly.addEventListener('change', function () { state.earnedOnly = els.earnedOnly.checked; if (state.earnedOnly) { state.unearnedOnly = false; els.unearnedOnly.checked = false; } renderList(); });
    els.unearnedOnly.addEventListener('change', function () { state.unearnedOnly = els.unearnedOnly.checked; if (state.unearnedOnly) { state.earnedOnly = false; els.earnedOnly.checked = false; } renderList(); });
    els.spoiler.addEventListener('change', function () { state.spoiler = els.spoiler.checked; renderList(); renderRoadmap(); });
    $('exportBtn').addEventListener('click', exportProgress);
    $('importBtn').addEventListener('click', function () { $('importFile').click(); });
    $('importFile').addEventListener('change', function (e) { if (e.target.files[0]) importProgress(e.target.files[0]); e.target.value = ''; });
    $('resetBtn').addEventListener('click', function () {
      if (!window.confirm('Clear all earned trophies in this tracker?')) return;
      earned = new Set();
      saveProgress('Progress reset.');
      renderAll();
    });
    els.tabChecklist.addEventListener('click', function () { switchView('checklist'); });
    els.tabRoadmap.addEventListener('click', function () { switchView('roadmap'); });
  }

  function boot() {
    loadSaved();
    fetch(DATA_URL).then(function (r) {
      if (!r.ok) throw new Error('trophies.json failed to load');
      return r.json();
    }).then(function (data) {
      trophies = data.trophies || data;
      trophies.forEach(function (t) { byId[t.id] = t; });
      readUrlState();
      renderKindFilters();
      wireEvents();
      switchView(state.view);
      renderAll();
      var hash = window.location.hash.match(/^#trophy-(\d+)$/);
      if (hash && byId[Number(hash[1])]) {
        openGuides.add(Number(hash[1]));
        renderList();
        var el = document.getElementById('trophy-' + hash[1]);
        if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }).catch(function () {
      els.list.innerHTML = '<li class="trophy"><p>Could not load the trophy data. Open this guide from a local server (node serve.ts) so it can read data/trophies.json.</p></li>';
    });
  }

  boot();
})();
