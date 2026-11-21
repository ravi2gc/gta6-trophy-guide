"use strict";
/* The Leonida Trophy Codex — offline tracker. No network requests: all data is local. */
var LS_KEY = "leonida-codex-v3";
var DEMO_EARNED = [2, 3, 4, 8, 15, 16, 18, 20, 21, 32, 35, 42, 55];
var DEMO_LEDGER = { "stunts": 187, "challenges": 34, "waink": 61, "vehicles": 132, "meditations": 11, "cardsets": 2, "bankvaults": 3, "gangops": 14, "races": 12, "optional": 58, "markedbills": 142000, "styles": 31 };

var ROADMAP = [
  { n: 1, title: "Before you start — set up the run", hours: "0–1 hour",
    text: "Turn on progress and collectible notifications in the settings, and criminal-profile notifications so you can watch the 500-action count for Actions Speak Louder. Decide on your save plan now: 15 manual slots, one per chapter start and end, because there is no mission replay. Keep cheats off your platinum save from the first minute. Read the At-risk section below before you play Chapter 1 — one meditation there may be missable.",
    trophies: [] },
  { n: 2, title: "Story, Chapters 1–2", hours: "25–35 hours",
    text: "Play the opening and the second chapter, doing optional missions as they appear. Do the Chapter 1 balcony meditation the morning after Down to Earth — it is the one thing in the whole game you may not get back. Meet Cal, start Kenton's treasure diving, and after Coffee Break begin Billy's and Bret's strands and Moses. Scan every new vehicle and study every new animal through the binoculars from day one: the checklist later wants 200 of 277 vehicles and 100 of 255 animals.",
    trophies: [2, 3, 4, 8, 20, 28] },
  { n: 3, title: "Story, Chapters 3–5", hours: "35–45 hours",
    text: "Finish the story. Chapter 3 opens Andy's, Randy's, Tyrone's and Yasmani's strands, the Cartel Heist, and the Dye Pack Jammer through Credit Check. Chapter 4 opens the bank vaults through That's Where The Money Is... and holds three mission trophies. The final mission closes the story and free roam begins. Keep a manual save at every chapter boundary. Story plus this stage is the 60–80 hours PowerPyx quotes.",
    trophies: [5, 6, 7, 9, 10, 11, 12, 13, 22, 26, 27] },
  { n: 4, title: "The 100% checklist, part 1 — robberies and money", hours: "About 50 hours",
    text: "Open the checklist under Progress, then Stats, and work the robbery lines first, because they pay for everything else: all 39 gang operations, 22 bank jobs, 7 Payday Loan jobs, 8 bank vaults, 34 of 35 smash 'n' grabs and 50 of 91 stick-ups, plus $100,000 of narcotics fenced, $100,000 of jewelry, $250,000 of marked bills and $200,000 of vehicles. Buy the 8 garages ($160,000) and register 10 vehicles as you go. Most robbery trophies pop during this stage.",
    trophies: [14, 33, 34, 39, 40, 41, 43, 52, 53, 54, 55] },
  { n: 5, title: "The 100% checklist, part 2 — activities and collectibles", hours: "About 50 hours",
    text: "Finish the activity and collection lines: 300 stunts, 30 race wins, 10 of 13 race-challenge golds, all 42 shooting-range golds, all 42 drone races, 70 of 80 challenges, 15 of 18 card sets, 100 WAiNK scans, 33 underwater discoveries, 15 of 18 meditations, 100 flamingos, 200 vehicle scans, 100 animals studied, 50 of 66 weapons and all 15 of Bret's Target Decks. Stages 4 and 5 together are the roughly 100 hours PowerPyx quotes for the checklist.",
    trophies: [15, 16, 17, 18, 19, 21, 30, 31, 32, 36, 42, 46, 47, 48] },
  { n: 6, title: "Strangers, loose ends and the platinum", hours: "10–20 hours",
    text: "Finish the eight qualifying Strangers & Freaks strands, the five character questlines, and whatever miscellaneous trophies are left — the tank, the jet, the five still-unconfirmed trophies as the community pins them down. Check the trophy list for stragglers, then watch Vice Got a Price! pop. Total run: about 200 hours on PowerPyx's numbers, up to 250-plus on Push Square's.",
    trophies: [1, 22, 23, 24, 25, 26, 27, 29, 37, 38, 44, 45, 49, 50, 51] }
];

var LEDGER = [
  { g: "Robberies", id: "optional", name: "Optional missions completed", t: null, h: 100, total: 300, unit: "" },
  { g: "Robberies", id: "gangops", name: "Illegal gang operations robbed", t: 9, h: 39, total: 39, unit: "" },
  { g: "Robberies", id: "bankjobs", name: "Bank jobs completed", t: null, h: 22, total: 22, unit: "" },
  { g: "Robberies", id: "payday", name: "Payday Loan jobs completed", t: null, h: 7, total: 7, unit: "" },
  { g: "Robberies", id: "smash", name: "Smash 'n' Grabs completed", t: null, h: 34, total: 35, unit: "" },
  { g: "Robberies", id: "stickups", name: "Stick-ups completed", t: null, h: 50, total: 91, unit: "" },
  { g: "Robberies", id: "bankvaults", name: "Bank vaults robbed", t: 5, h: 8, total: 8, unit: "" },
  { g: "Robberies", id: "narcotics", name: "Narcotics fenced", t: null, h: 100000, total: null, unit: "$", money: true },
  { g: "Robberies", id: "jewelry", name: "Jewelry fenced", t: null, h: 100000, total: null, unit: "$", money: true },
  { g: "Robberies", id: "markedbills", name: "Marked bills laundered", t: 250000, h: 250000, total: null, unit: "$", money: true },
  { g: "Robberies", id: "vehiclesfenced", name: "Vehicles fenced (value)", t: null, h: 200000, total: null, unit: "$", money: true },
  { g: "Collectibles & exploration", id: "kenton", name: "Kenton's treasure sets", t: null, h: 5, total: 7, unit: "" },
  { g: "Collectibles & exploration", id: "cardsets", name: "Collectible card sets completed", t: 3, h: 15, total: 18, unit: "" },
  { g: "Collectibles & exploration", id: "waink", name: "WAiNK locations scanned", t: 100, h: 100, total: 89, unit: "", note: "31 landmarks + 35 curiosities + 23 sculptures + No Flusher tags" },
  { g: "Collectibles & exploration", id: "underwater", name: "Underwater discoveries", t: null, h: 33, total: 33, unit: "" },
  { g: "Collectibles & exploration", id: "magazines", name: "Magazines, books and comics found", t: null, h: 30, total: 34, unit: "" },
  { g: "Collectibles & exploration", id: "meditations", name: "Meditation spots completed", t: 18, h: 15, total: 18, unit: "", note: "trophy needs all 18; checklist only 15" },
  { g: "Collectibles & exploration", id: "flamingos", name: "Cocaine Flamingos found", t: null, h: 100, total: 125, unit: "" },
  { g: "Collectibles & exploration", id: "playlists", name: "Unique playlists found", t: null, h: 2, total: 2, unit: "" },
  { g: "Collectibles & exploration", id: "styles", name: "Styles discovered", t: null, h: 70, total: 79, unit: "" },
  { g: "Collectibles & exploration", id: "vehicles", name: "Base-model vehicles scanned", t: 100, h: 200, total: 277, unit: "" },
  { g: "Collectibles & exploration", id: "weapons", name: "Standard-issue weapons discovered", t: null, h: 50, total: 66, unit: "" },
  { g: "Collectibles & exploration", id: "animals", name: "Animals studied (binoculars)", t: null, h: 100, total: 255, unit: "" },
  { g: "Activities", id: "races", name: "Unique races won", t: 20, h: 30, total: 40, unit: "" },
  { g: "Activities", id: "racegolds", name: "Race-challenge gold medals", t: null, h: 10, total: 13, unit: "" },
  { g: "Activities", id: "rangegolds", name: "Shooting Range gold medals", t: 42, h: 42, total: 42, unit: "" },
  { g: "Activities", id: "videogames", name: "Video games played (all four)", t: 1, h: 4, total: 4, unit: "" },
  { g: "Activities", id: "pool", name: "Pool opponents defeated", t: null, h: 5, total: 7, unit: "" },
  { g: "Activities", id: "golf", name: "Mini-golf locations played", t: null, h: 2, total: 3, unit: "" },
  { g: "Activities", id: "hoops", name: "Basketball hoops scored", t: null, h: 90, total: 100, unit: "" },
  { g: "Activities", id: "drones", name: "Drone time trials completed", t: 14, h: 42, total: 42, unit: "", note: "trophy needs 1 win at each of 14 locations" },
  { g: "Activities", id: "stunts", name: "Stunts completed", t: 250, h: 300, total: 397, unit: "" },
  { g: "Activities", id: "challenges", name: "Challenges completed", t: 50, h: 70, total: 80, unit: "" },
  { g: "Activities", id: "targetdecks", name: "Bret's Target Decks completed", t: null, h: 15, total: 15, unit: "" }
];

var DISPUTES = [
  { t: "How long is the platinum, really?",
    a: { v: "About 200 hours: 60–80 story, about 100 checklist, about 10 cleanup.", s: "PowerPyx; KeenGamer and GTABase agree" },
    b: { v: "250+ hours in the summary, and “up to 300 hours or more” in the intro.", s: "Push Square" },
    call: "Plan on 200 hours and budget 250. PowerPyx's staged breakdown adds up (170–190), and KeenGamer and GTABase independently land on 200, while Push Square's own two numbers disagree with each other. One outlier, GameTrek, says 100–200 hours and rates difficulty 7/10 against everyone else's 4/10." },
  { t: "How many trophies are hidden — 27 or 28?",
    a: { v: "28 hidden, 27 visible.", s: "GTABase, Insider Gaming, eGamers, PlanetGTA6" },
    b: { v: "27 hidden — Personal Best is not marked hidden.", s: "Push Square, as reported by Sixshore" },
    call: "28 hidden. The PSN-derived lists agree, and the only dissent is one guide's marking of a single trophy. This codex flags 28 as spoilers, including Personal Best." },
  { t: "Is Maximum Withdrawal silver or bronze?",
    a: { v: "Silver — rob 5 bank vaults.", s: "Official list, PowerPyx, GTABase, KeenGamer, eGamers" },
    b: { v: "Bronze.", s: "Push Square's trophy list" },
    call: "Silver. The official grade and every other guide agree; Push Square's entry is a typo in its list." },
  { t: "Do you need 15 or 18 meditations?",
    a: { v: "The trophy needs all 18 meditation spots.", s: "PowerPyx, GTABase" },
    b: { v: "The 100% checklist needs only 15 of 18.", s: "PowerPyx, KeenGamer" },
    call: "Both numbers are right, for different things. The trophy is stricter than the checklist here — one of the few places it is. Do all 18, plus the Chapter 1 balcony meditation (see Unconfirmed)." },
  { t: "Which chapter is the final mission in?",
    a: { v: "Chapter 5: Snow Storm (Operation Savage Glory) is a Chapter 5 mission and the final mission follows it.", s: "GTABase, Insider Gaming, eGamers" },
    b: { v: "The final mission follows Chapter 4's Starting From Zero; no fifth chapter is named.", s: "PowerPyx's trophy table" },
    call: "Five chapters. Three independent lists agree, and Sixshore counts the story trophies as one in Chapter 2, one in Chapter 3, three in Chapter 4 and one in Chapter 5. PowerPyx's table appears to mislabel the ending." },
  { t: "Which stranger strands count for Strangers & Freaks?",
    a: { v: "Kirk, Kyle, Yago and Pilot Pete count; Moses, Tyrone, Yasmani, Andy, Billy and Eddie do not.", s: "PowerPyx and GTABase, in agreement" },
    b: { v: "The remaining qualifying strands are still being confirmed — the game does not list them.", s: "PowerPyx; GTABase" },
    call: "Do the four confirmed strands first, then check the trophy's own progress counter before assuming any other strand counted. Do not trust a list that names eight strands without saying which are confirmed." },
  { t: "Which animal triggers Fair Game?",
    a: { v: "Unconfirmed — clear all 15 of Bret's Target Decks and it should pop along the way.", s: "PowerPyx, GTABase, eGamers" },
    b: { v: "No guide names the animal.", s: "All guides read" },
    call: "No call to make yet: the trigger is genuinely unknown. Clearing all 15 Target Decks is the safe play because the 100% checklist needs them anyway." },
  { t: "What unlocks the five unsolved trophies?",
    a: { v: "Unknown: In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin have no confirmed method.", s: "PowerPyx" },
    b: { v: "Educated guesses: crash a car out of a showroom window; a strange event in Leonida; a melee drive-by; a Payday Loans link; a UFO questline.", s: "GTABase and PowerPyx's stated beliefs" },
    call: "Treat the guesses as guesses. This codex lists all five as unconfirmed and gives the guessed methods only as things to try, not as facts." },
  { t: "Is anything missable?",
    a: { v: "Potentially one: Positive Mental Attitude, via the Chapter 1 balcony meditation.", s: "PowerPyx, GTABase, KeenGamer" },
    b: { v: "No known missables.", s: "Push Square" },
    call: "One potentially missable trophy. Push Square lists none known, which is not the same as none — and TechWiser, reported by eGamers, adds that stranger chains have story-linked windows. Do the meditation and start stranger chains early." },
  { t: "How much of the game is 100%, really?",
    a: { v: "Closer to 60% true completion — most side quests are not needed and collectibles are only partly required.", s: "PowerPyx" },
    b: { v: "You do not need everything, but you do need almost everything.", s: "Push Square" },
    call: "PowerPyx. Its staged numbers support it: 100 of several hundred optional missions, 200 of 277 vehicles, 100 of 255 animals, 15 of 18 card sets, 70 of 80 challenges. Push Square's phrasing overstates the grind." },
  { t: "How many shooting ranges are there — 2 or 12?",
    a: { v: "12 ranges holding the 42 challenges.", s: "PowerPyx" },
    b: { v: "Two locations named: Rodgers Ranch & Shooting Range and Griffin Shooting Range.", s: "Push Square" },
    call: "12 ranges. Push Square names two locations, which reads as a partial list rather than a total — it never says there are only two. Use the in-game Activities filter to find all 12." }
];

var ATRISK = [
  { t: "Positive Mental Attitude — the one that can lock", risk: true,
    text: "The morning after the Chapter 1 mission Down to Earth, Lucia mentions meditating in the kitchen at Jason's house and walks to the balcony. Follow her and accept. That meditation is gone after Chapter 1, and it is still unconfirmed whether the trophy needs it. PowerPyx's author had done it when the trophy unlocked. It takes a minute: just do it." },
  { t: "Stranger chains may have story windows", risk: true,
    text: "TechWiser, reported by eGamers, says the stranger mission chains behind five hidden trophies have windows linked to story progress. Only one source gives this warning, and PowerPyx says all trophy quest givers return after the story — but start Andy, Kenton, Billy, Randy, Tyrone and Bret as soon as they unlock, rather than leaving them all for cleanup." },
  { t: "The Irredeemable criminal profile is permanent", risk: true,
    text: "Pushing your criminal profile to Irredeemable cannot be undone, and police become far more aggressive. It does not block any trophy, but it makes the whole cleanup harder. Avoid excessive violence against cops and civilians; the 500 profile actions for Actions Speak Louder can be earned with ordinary robberies." },
  { t: "Cheats disable trophies and saving", risk: true,
    text: "PowerPyx and Push Square agree: turning on a cheat disables trophies and stops the game saving. Gamemapa adds that cheats only unlock after the story — exactly when most of the mop-up happens — so the temptation arrives at the worst moment. Keep cheats off the platinum save entirely." },
  { t: "Kenton goes quiet after Chapter 1 — looks missable, is not", risk: false,
    text: "Kenton disappears after Chapter 1 and his treasure strand stalls. He texts Jason again later in the story and the strand stays available after the ending. PowerPyx notes you can speed it up by calling Brian as Jason later in Chapter 2. Do not start a new save over this." },
  { t: "No mission replay — save at every chapter boundary", risk: false,
    text: "There are 15 manual save slots and one autosave, and no way to replay a mission. Keep a save at the start and end of each chapter (10 slots) and rotate the other five during free roam. Optional missions with hourglass icons can expire, but none of them is tied to a trophy." }
];

var UNCONFIRMED = [
  "In The Beginning… — the exact trigger for the Ocean Beach cocktail is not confirmed (GTABase guesses a cocktail spot with a view; PowerPyx lists it as unknown).",
  "Capital Offense — the exact trigger is not confirmed (GTABase guesses crashing a car out through a showroom window).",
  "Bad Luck, I Guess — the exact trigger is not confirmed (PowerPyx believes it relates to the Payday Loans store from the prologue).",
  "The Truth Is Out There — the exact trigger is not confirmed (PowerPyx believes it relates to a UFO questline).",
  "Ten Pin — the exact trigger is not confirmed (PowerPyx believes it is a kick from a motorcycle).",
  "Fair Game — which animal triggers it is not confirmed by any guide read; clearing all 15 Target Decks is the safe play.",
  "Positive Mental Attitude — whether the Chapter 1 balcony meditation is required is not confirmed; PowerPyx's author had done it when the trophy unlocked.",
  "Strangers & Freaks — the qualifying strands beyond Kirk, Kyle, Yago and Pilot Pete are not confirmed; check the trophy's own progress counter.",
  "Cheats — Gamemapa reports cheats only unlock after the story; no other guide read confirms the timing."
];

var state = { earned: {}, ledger: {}, spoiler: true, tab: "trophies", grade: "", cat: "", status: "", q: "", open: null };
var DATA = null;

function $(id) { return document.getElementById(id); }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function fmt(n) { return Number(n).toLocaleString("en-US"); }

function loadState() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) { var s = JSON.parse(raw); if (s && typeof s === "object") { state.earned = s.earned || {}; state.ledger = s.ledger || {}; if (typeof s.spoiler === "boolean") state.spoiler = s.spoiler; } }
  } catch (e) { /* corrupted save: start fresh */ }
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ earned: state.earned, ledger: state.ledger, spoiler: state.spoiler, v: 3 })); } catch (e) { /* storage full or blocked */ }
}
function readHash() {
  var h = location.hash.slice(1);
  var p = new URLSearchParams(h);
  if (p.get("tab")) state.tab = p.get("tab");
  if (p.get("grade")) state.grade = p.get("grade");
  if (p.get("q")) state.q = p.get("q");
  if (p.get("guide")) state.open = Number(p.get("guide")) || null;
  if (p.get("spoiler") === "off") state.spoiler = false;
  if (p.get("demo") === "1") {
    DEMO_EARNED.forEach(function (id) { state.earned[id] = true; });
    Object.keys(DEMO_LEDGER).forEach(function (k) { state.ledger[k] = DEMO_LEDGER[k]; });
  }
  if (p.get("earned")) {
    state.earned = {};
    p.get("earned").split(",").forEach(function (x) { var n = Number(x); if (n >= 1 && n <= 55) state.earned[n] = true; });
  }
}
function writeHash() {
  var p = new URLSearchParams();
  if (state.tab && state.tab !== "trophies") p.set("tab", state.tab);
  if (state.grade) p.set("grade", state.grade);
  if (state.q) p.set("q", state.q);
  if (state.open) p.set("guide", String(state.open));
  if (!state.spoiler) p.set("spoiler", "off");
  var ids = Object.keys(state.earned).filter(function (k) { return state.earned[k]; });
  if (ids.length) p.set("earned", ids.join(","));
  var h = p.toString();
  history.replaceState(null, "", h ? "#" + h : location.pathname + location.search);
}
function trophyById(id) { return DATA.trophies.find(function (t) { return t.id === id; }); }
function srcByKey(k) { return DATA.sources.find(function (s) { return s.key === k; }); }

function renderProgress() {
  var total = DATA.trophies.length;
  var done = DATA.trophies.filter(function (t) { return state.earned[t.id]; }).length;
  var pct = total ? Math.round(done / total * 100) : 0;
  $("ring-pct").textContent = pct + "%";
  $("ring-count").textContent = done + " of " + total;
  $("ring-fg").style.strokeDashoffset = String(326.7 * (1 - done / total));
  var grades = ["platinum", "gold", "silver", "bronze"];
  $("grade-bars").innerHTML = grades.map(function (g) {
    var all = DATA.trophies.filter(function (t) { return t.grade === g; });
    var d = all.filter(function (t) { return state.earned[t.id]; }).length;
    return '<div class="bar-row ' + g + '"><span>' + g + '</span><span class="bar"><i style="width:' + (all.length ? d / all.length * 100 : 0) + '%"></i></span><span>' + d + "/" + all.length + '</span></div>';
  }).join("");
  var pts = { platinum: 300, gold: 90, silver: 30, bronze: 15 };
  var score = DATA.trophies.reduce(function (a, t) { return a + (state.earned[t.id] ? (pts[t.grade] || 15) : 0); }, 0);
  $("points-line").textContent = "PSN points: " + fmt(score) + " of 1,350 · " + done + " earned, " + (total - done) + " to go.";
}

function visibleName(t) {
  if (t.spoiler && state.spoiler && !state.earned[t.id]) return "Hidden trophy — reveal?";
  return t.name;
}
function renderList() {
  var q = state.q.trim().toLowerCase();
  var list = DATA.trophies.filter(function (t) {
    if (state.grade && t.grade !== state.grade) return false;
    if (state.cat && t.category !== state.cat) return false;
    if (state.status === "earned" && !state.earned[t.id]) return false;
    if (state.status === "unearned" && state.earned[t.id]) return false;
    if (state.status === "missable" && !t.missable) return false;
    if (q) {
      var hay = (t.name + " " + t.description + " " + t.guide + " " + t.category).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  $("result-count").textContent = list.length + " of 55 trophies shown" + (q ? ' for "' + state.q + '"' : "") + ".";
  $("trophy-list").innerHTML = list.map(function (t) {
    var hidden = t.spoiler && state.spoiler && !state.earned[t.id];
    var earned = !!state.earned[t.id];
    var srcLinks = t.src.map(function (k) { var s = srcByKey(k); return s ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.site) + '</a>' : esc(k); }).join(" · ");
    var guide = hidden ? "<p class=\"guide-text\">This trophy is hidden on PlayStation until you earn it. Its name and description name a story beat, so the spoiler shield keeps the guide covered too. Reveal it from the toggle in the left rail, or earn it in-game.</p>" : "<p class=\"guide-text\">" + esc(t.guide) + "</p>";
    var name = hidden ? "Hidden trophy — reveal?" : esc(t.name);
    var desc = hidden ? "Hidden on PSN until unlocked." : esc(t.description);
    var stage = ROADMAP[t.stage - 1];
    return '<article class="trophy' + (earned ? " earned" : "") + (state.open === t.id ? " open" : "") + '" data-id="' + t.id + '">' +
      '<button type="button" class="trophy-head" data-head="' + t.id + '" aria-expanded="' + (state.open === t.id) + '">' +
      '<span class="grade-dot grade-' + t.grade + '" title="' + t.grade + '"></span>' +
      '<span class="trophy-titles"><span class="name">' + name + '</span><span class="desc">' + desc + '</span></span>' +
      '<span class="trophy-meta"><span class="grade-tag">' + t.grade + '</span><span>' + esc(t.category) + '</span>' +
      (t.missable ? '<span class="flag">Potentially missable</span>' : "") +
      (t.spoiler ? '<span class="flag spoiler">Hidden / spoiler</span>' : "") + '</span>' +
      '<span class="earn-btn' + (earned ? " earned" : "") + '" data-earn="' + t.id + '">' + (earned ? "✓ Earned" : "Mark earned") + '</span></button>' +
      '<div class="trophy-body">' + guide +
      '<p class="when"><b>When:</b> ' + esc(stage.title) + ' · Roadmap stage ' + t.stage + ' of 6.</p>' +
      '<p class="sources"><b>Sources (' + t.src.length + '):</b> ' + srcLinks + '. Read 21 November 2026. Guide text is original; the sources back the facts, they are not copied.</p>' +
      '</div></article>';
  }).join("") || '<p class="muted">No trophies match those filters.</p>';
}

function renderRoadmap() {
  $("roadmap").innerHTML = ROADMAP.map(function (s) {
    var names = s.trophies.map(function (id) { var t = trophyById(id); return t ? esc(t.name) : ""; }).filter(Boolean).join(" · ");
    return '<div class="stage"><h3>Stage ' + s.n + ' — ' + esc(s.title) + ' <span class="hours">' + esc(s.hours) + '</span></h3><p>' + esc(s.text) + '</p>' +
      (names ? '<p class="trophy-ids"><b>Trophies in this stage:</b> ' + names + '</p>' : '<p class="trophy-ids">Preparation stage — no trophies, but it protects the ones that follow.</p>') + '</div>';
  }).join("");
  $("mini-roadmap").innerHTML = ROADMAP.map(function (s) { return "<li><b>Stage " + s.n + ":</b> " + esc(s.title) + " <span class=\"muted\">(" + esc(s.hours) + ")</span></li>"; }).join("");
  $("atrisk").innerHTML = ATRISK.map(function (r) {
    return '<div class="risk' + (r.risk ? "" : " safe") + '"><h3>' + esc(r.t) + '</h3><p>' + esc(r.text) + '</p></div>';
  }).join("");
  $("unconfirmed").innerHTML = UNCONFIRMED.map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("");
}

function ledgerRow(item) {
  var v = state.ledger[item.id] || 0;
  var tCell = item.t == null ? "—" : (item.money ? "$" + fmt(item.t) : fmt(item.t));
  var hCell = item.money ? "$" + fmt(item.h) : fmt(item.h);
  var done = v >= item.h;
  var step = item.money ? 10000 : 1;
  return '<tr class="' + (done ? "done" : "") + '"><td>' + esc(item.name) + (item.note ? '<br><span class="muted small">' + esc(item.note) + '</span>' : "") + '</td>' +
    '<td class="num">' + tCell + '</td><td class="num">' + hCell + (item.total ? ' <span class="muted">/ ' + fmt(item.total) + ' total</span>' : "") + '</td>' +
    '<td><span class="counter"><button type="button" data-ledger-dec="' + item.id + '" data-step="' + step + '" aria-label="Decrease">−</button><output>' + (item.money ? "$" + fmt(v) : fmt(v)) + '</output><button type="button" data-ledger-inc="' + item.id + '" data-step="' + step + '" aria-label="Increase">+</button></span></td></tr>';
}
function renderLedger() {
  var groups = {};
  LEDGER.forEach(function (it) { (groups[it.g] = groups[it.g] || []).push(it); });
  $("ledger").innerHTML = Object.keys(groups).map(function (g) {
    return '<div class="ledger-group"><h3>' + esc(g) + '</h3><table><thead><tr><th>Item</th><th class="num">Trophy target</th><th class="num">100% target</th><th>Your count</th></tr></thead><tbody>' +
      groups[g].map(ledgerRow).join("") + '</tbody></table></div>';
  }).join("");
  var done = LEDGER.filter(function (it) { return (state.ledger[it.id] || 0) >= it.h; }).length;
  $("ledger-summary").textContent = done + " of " + LEDGER.length + " ledger lines complete. " + LEDGER.length + " counted items in total: 1,590 counted units across the non-money lines, plus $650,000 across the four money lines (narcotics, jewelry, marked bills, vehicles fenced).";
  var head = LEDGER.filter(function (it) { return it.t != null; });
  $("ledger-preview").innerHTML = '<table><thead><tr><th>Item</th><th class="num">Trophy target</th><th class="num">100% target</th></tr></thead><tbody>' +
    head.map(function (it) { return "<tr><td>" + esc(it.name) + "</td><td class=\"num\">" + (it.money ? "$" + fmt(it.t) : fmt(it.t)) + "</td><td class=\"num\">" + (it.money ? "$" + fmt(it.h) : fmt(it.h)) + "</td></tr>"; }).join("") + '</tbody></table>';
}

function renderDisputes() {
  $("disputes").innerHTML = DISPUTES.map(function (d, i) {
    return '<div class="dispute"><h3>' + (i + 1) + '. ' + esc(d.t) + '</h3><div class="versus">' +
      '<div class="version"><b>Version A</b>' + esc(d.a.v) + '<br><span class="muted small">Source: ' + esc(d.a.s) + '</span></div>' +
      '<div class="version"><b>Version B</b>' + esc(d.b.v) + '<br><span class="muted small">Source: ' + esc(d.b.s) + '</span></div></div>' +
      '<p class="call"><b>Our call:</b> ' + esc(d.call) + '</p></div>';
  }).join("");
}

function renderSources() {
  var counts = {};
  DATA.sources.forEach(function (s) { counts[s.key] = 0; });
  DATA.trophies.forEach(function (t) { t.src.forEach(function (k) { counts[k] = (counts[k] || 0) + 1; }); });
  var cited = DATA.sources.filter(function (s) { return counts[s.key] > 0; });
  var total = DATA.trophies.reduce(function (a, t) { return a + t.src.length; }, 0);
  var pairs = [];
  for (var i = 0; i < DATA.sources.length; i += 2) pairs.push([DATA.sources[i], DATA.sources[i + 1]]);
  $("source-counts").innerHTML = "<p><strong>" + DATA.sources.length + " source pages</strong> from <strong>" + new Set(DATA.sources.map(function (s) { return new URL(s.url).hostname; })).size + " sites</strong>, read 21 November 2026. <strong>" + total + " citations</strong> across 55 guides (3 per trophy). " + cited.length + " of the sources are cited by at least one trophy guide; the rest back the roadmap, ledger and disputes.</p>" +
    '<table><thead><tr><th>Source</th><th class="num">Guides citing it</th><th>Source</th><th class="num">Guides citing it</th></tr></thead><tbody>' +
    pairs.map(function (pr) {
      function cell(s) { return s ? "<td>" + esc(s.site) + "</td><td class=\"num\">" + (counts[s.key] || 0) + "</td>" : "<td></td><td class=\"num\"></td>"; }
      return "<tr>" + cell(pr[0]) + cell(pr[1]) + "</tr>";
    }).join("") + '</tbody></table>';
  $("source-list").innerHTML = DATA.sources.map(function (s) {
      return '<div class="src-card"><b>' + esc(s.site) + '</b> — <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url) + '</a><br><span class="muted">Cited by ' + (counts[s.key] || 0) + ' trophy guide' + ((counts[s.key] || 0) === 1 ? "" : "s") + '.</span></div>';
    }).join("");
  var keys = DATA.sources.map(function (s) { return s.key; });
  $("matrix").innerHTML = '<table class="matrix"><thead><tr><th>Trophy</th>' + keys.map(function (k) { return "<th>" + esc(k) + "</th>"; }).join("") + '</tr></thead><tbody>' +
    DATA.trophies.map(function (t) {
      return "<tr><td>" + esc(t.name) + "</td>" + keys.map(function (k) { return '<td class="' + (t.src.indexOf(k) !== -1 ? "yes" : "no") + '">' + (t.src.indexOf(k) !== -1 ? "●" : "·") + "</td>"; }).join("") + "</tr>";
    }).join("") + '</tbody></table>';
}

function renderTabs() {
  document.querySelectorAll(".tabs button").forEach(function (b) { b.classList.toggle("active", b.dataset.tab === state.tab); });
  document.querySelectorAll(".tabpage").forEach(function (p) { p.classList.toggle("active", p.id === "tab-" + state.tab); });
  $("hash-note").textContent = state.tab === "trophies" ? "" : "Share link: your earned set, filters and this tab are encoded in the page address.";
}

function renderAll() {
  renderProgress(); renderList(); renderRoadmap(); renderLedger(); renderDisputes(); renderSources(); renderTabs();
}

function exportProgress() {
  var payload = { app: "leonida-codex", version: 3, exported: new Date().toISOString(), earned: Object.keys(state.earned).filter(function (k) { return state.earned[k]; }).map(Number), ledger: state.ledger, spoiler: state.spoiler };
  var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leonida-codex-progress.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}
function importProgress(file) {
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var data = JSON.parse(String(reader.result));
      if (!data || data.app !== "leonida-codex" || !Array.isArray(data.earned)) throw new Error("not a codex file");
      var earned = {};
      data.earned.forEach(function (id) { if (Number.isInteger(id) && id >= 1 && id <= 55) earned[id] = true; });
      var ledger = {};
      if (data.ledger && typeof data.ledger === "object") {
        Object.keys(data.ledger).forEach(function (k) { if (LEDGER.some(function (it) { return it.id === k; }) && Number.isFinite(data.ledger[k]) && data.ledger[k] >= 0) ledger[k] = Math.floor(data.ledger[k]); });
      }
      state.earned = earned; state.ledger = ledger;
      if (typeof data.spoiler === "boolean") state.spoiler = data.spoiler;
      saveState(); syncControls(); renderAll();
      $("export-note").textContent = "Imported " + Object.keys(earned).length + " earned trophies and " + Object.keys(ledger).length + " ledger counts.";
    } catch (e) {
      $("export-note").textContent = "Import failed: that file is not a valid Leonida Codex progress file. Nothing was changed.";
    }
  };
  reader.readAsText(file);
}

function syncControls() {
  $("search").value = state.q;
  $("filter-grade").value = state.grade;
  $("filter-status").value = state.status;
  $("spoiler-toggle").checked = state.spoiler;
  var cats = Array.from(new Set(DATA.trophies.map(function (t) { return t.category; }))).sort();
  var sel = $("filter-cat");
  if (sel.options.length <= 1) cats.forEach(function (c) { var o = document.createElement("option"); o.value = c; o.textContent = c; sel.appendChild(o); });
  sel.value = state.cat;
}

function bind() {
  window.addEventListener("hashchange", function () {
    state.tab = "trophies"; state.grade = ""; state.q = ""; state.open = null;
    readHash();
    syncControls();
    renderAll();
  });
  document.querySelectorAll(".tabs button").forEach(function (b) {
    b.addEventListener("click", function () { state.tab = b.dataset.tab; state.open = null; writeHash(); renderTabs(); renderList(); });
  });
  $("search").addEventListener("input", function (e) { state.q = e.target.value; writeHash(); renderList(); });
  $("filter-grade").addEventListener("change", function (e) { state.grade = e.target.value; writeHash(); renderList(); });
  $("filter-cat").addEventListener("change", function (e) { state.cat = e.target.value; renderList(); });
  $("filter-status").addEventListener("change", function (e) { state.status = e.target.value; renderList(); });
  $("spoiler-toggle").addEventListener("change", function (e) { state.spoiler = e.target.checked; saveState(); writeHash(); renderList(); });
  $("export-btn").addEventListener("click", exportProgress);
  $("import-btn").addEventListener("click", function () { $("import-file").click(); });
  $("import-file").addEventListener("change", function (e) { if (e.target.files[0]) importProgress(e.target.files[0]); e.target.value = ""; });
  $("reset-btn").addEventListener("click", function () {
    if (window.confirm("Reset all earned trophies and ledger counts?")) { state.earned = {}; state.ledger = {}; saveState(); writeHash(); renderAll(); }
  });
  $("trophy-list").addEventListener("click", function (e) {
    var earn = e.target.closest("[data-earn]");
    if (earn) {
      e.stopPropagation();
      var id = Number(earn.dataset.earn);
      if (state.earned[id]) delete state.earned[id]; else state.earned[id] = true;
      saveState(); writeHash(); renderProgress(); renderList();
      return;
    }
    var head = e.target.closest("[data-head]");
    if (head) {
      var tid = Number(head.dataset.head);
      state.open = state.open === tid ? null : tid;
      writeHash(); renderList();
    }
  });
  $("ledger").addEventListener("click", function (e) {    var inc = e.target.closest("[data-ledger-inc]");
    var dec = e.target.closest("[data-ledger-dec]");
    var btn = inc || dec;
    if (!btn) return;
    var id = (inc || dec).dataset.ledgerInc || (inc || dec).dataset.ledgerDec;
    var step = Number(btn.dataset.step) || 1;
    var cur = state.ledger[id] || 0;
    var next = inc ? cur + step : Math.max(0, cur - step);
    state.ledger[id] = next;
    saveState(); renderLedger();
  });
}

fetch("data/trophies.json").then(function (r) { return r.json(); }).then(function (data) {
  DATA = data;
  loadState();
  readHash();
  syncControls();
  bind();
  renderAll();
  if (state.open) {
    var el = document.querySelector('.trophy[data-id="' + state.open + '"]');
    if (el) el.scrollIntoView({ block: "start" });
  }
}).catch(function (e) {
  document.getElementById("trophy-list").innerHTML = "<p>Could not load the trophy data. This guide works offline, but the data file must sit beside it in app/data/trophies.json.</p>";
});
