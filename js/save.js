// Cursor Bots — save data, economy, shop dealing, progression and opponent generation.
import { PART, PARTS, RARITY, RARITY_ORDER, LEAGUES, PRO, BOSSES, BOT_NAMES, STARTER_BUILD, MAX_LEVEL, ARENAS } from './data.js';
import { computeStats } from './engine.js';

const KEY = 'cursorbots.save.v1';

export function defaultSave() {
  return {
    v: 1,
    credits: 60,
    xp: 0,
    league: 0, match: 0, proWins: 0,
    inv: { dart: { lvl: 1, copies: 0 }, rubber: { lvl: 1, copies: 0 }, bar: { lvl: 1, copies: 0 }, steel: { lvl: 1, copies: 0 } },
    build: JSON.parse(JSON.stringify(STARTER_BUILD)),
    shop: null,
    nextEnemy: null,
    tut: { match: false, shop: false, garage: false },
    settings: { sound: true, haptics: true, music: true, sfxVol: 0.8, musicVol: 0.5, shake: true, difficulty: 'normal' },
    brawl: { offers: null, streak: 0, best: 0, wins: 0, played: 0 },
    stats: { wins: 0, losses: 0, kos: 0, pits: 0, matches: 0 },
    seed: Math.floor(Math.random() * 1e9),
  };
}

export const S = { data: null };

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      S.data = { ...defaultSave(), ...d, settings: { ...defaultSave().settings, ...(d.settings || {}) }, tut: { ...defaultSave().tut, ...(d.tut || {}) }, brawl: { ...defaultSave().brawl, ...(d.brawl || {}) }, stats: { ...defaultSave().stats, ...(d.stats || {}) } };
      sanitize();
      return S.data;
    }
  } catch (e) { console.warn('save load failed', e); }
  S.data = defaultSave();
  return S.data;
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S.data)); } catch (e) { /* storage full / private mode */ } }
export function reset() { S.data = defaultSave(); save(); }

function sanitize() {
  const d = S.data;
  for (const id of Object.keys(d.inv)) if (!PART[id]) delete d.inv[id];
  if (!d.inv[d.build.frame]) d.build = JSON.parse(JSON.stringify(STARTER_BUILD));
  fitBuild(d.build);
}

// --------------------------------------------------------------------------
// Inventory & build
// --------------------------------------------------------------------------
export const owned = (id) => !!S.data.inv[id];
export const lvl = (id) => (S.data.inv[id] ? S.data.inv[id].lvl : 1);
export const levelsMap = () => Object.fromEntries(Object.entries(S.data.inv).map(([k, v]) => [k, v.lvl]));
export function playerStats() { return computeStats(S.data.build, lvl); }

export function fitBuild(b) {
  const F = PART[b.frame];
  const fit = (arr, n) => { const a = (arr || []).slice(0, n); while (a.length < n) a.push(null); return a; };
  b.weapons = fit(b.weapons, F.slots.weapon);
  b.armor = fit(b.armor, F.slots.armor);
  b.util = fit(b.util, F.slots.util);
  if (!F.slots.shield) b.shield = null;
  return b;
}

export function equip(cat, slot, id) {
  const b = S.data.build;
  if (cat === 'frame') { b.frame = id; fitBuild(b); }
  else if (cat === 'wheel') b.wheel = id;
  else if (cat === 'shield') b.shield = id;
  else {
    const key = cat === 'weapon' ? 'weapons' : cat;
    const arr = b[key];
    if (id) { const other = arr.indexOf(id); if (other >= 0 && other !== slot) arr[other] = arr[slot]; }
    arr[slot] = id;
  }
  save();
}

export function equippedIds() {
  const b = S.data.build;
  return new Set([b.frame, b.wheel, b.shield, ...b.weapons, ...b.armor, ...b.util].filter(Boolean));
}

export function upgradeInfo(id) {
  const it = S.data.inv[id]; if (!it) return null;
  const p = PART[id];
  if (it.lvl >= MAX_LEVEL) return { max: true, lvl: it.lvl };
  const need = Math.ceil(it.lvl / 2); // copies needed to reach next level (1,1,2,2,3,3,4,4,5)
  const cost = Math.round(RARITY[p.rarity].price * 0.5 * it.lvl);
  return { max: false, lvl: it.lvl, copies: it.copies, need, cost, can: it.copies >= need && S.data.credits >= cost };
}
export function upgrade(id) {
  const u = upgradeInfo(id); if (!u || !u.can) return false;
  const it = S.data.inv[id];
  it.copies -= u.need; it.lvl++; S.data.credits -= u.cost; save();
  return true;
}

// --------------------------------------------------------------------------
// AI difficulty (Settings). Applied when a fight starts, so changes take effect immediately.
// --------------------------------------------------------------------------
export const DIFFICULTY = {
  easy:   { name: 'Easy',   desc: 'Slower, sloppier bots with weaker parts. Rewards x0.8.', mul: 0.55, add: -0.04, lvl: -1, reward: 0.8 },
  normal: { name: 'Normal', desc: 'The intended challenge. Rewards x1.', mul: 1, add: 0, lvl: 0, reward: 1 },
  hard:   { name: 'Hard',   desc: 'Sharper AI and upgraded enemy parts. Rewards x1.25.', mul: 1.12, add: 0.12, lvl: 1, reward: 1.25 },
  brutal: { name: 'Brutal', desc: 'Ruthless AI, heavily upgraded parts. Rewards x1.5.', mul: 1.2, add: 0.25, lvl: 2, reward: 1.5 },
};
export const difficulty = () => DIFFICULTY[S.data.settings.difficulty] || DIFFICULTY.normal;
export function adjustEnemy(e) {
  if (e.tutorial || e.dummy) return { levels: e.levels, diff: e.diff };
  const D = difficulty();
  const levels = {};
  for (const [id, l] of Object.entries(e.levels || {})) levels[id] = Math.max(1, Math.min(MAX_LEVEL, l + D.lvl));
  for (const id of [e.build.frame, e.build.wheel, ...e.build.weapons, ...e.build.armor, e.build.shield, ...e.build.util]) if (id && !levels[id]) levels[id] = Math.max(1, 1 + D.lvl);
  return { levels, diff: Math.max(0.02, Math.min(1, (e.diff || 0) * D.mul + D.add)) };
}
export function luckBonus() {
  let l = 0;
  for (const id of S.data.build.util || []) if (id && PART[id].luck) l += PART[id].luck + 0.02 * (lvl(id) - 1);
  return l;
}

// --------------------------------------------------------------------------
// Developer / testing helpers (Settings > Developer)
// --------------------------------------------------------------------------
export function devGiveAll() { for (const p of PARTS) if (!S.data.inv[p.id]) S.data.inv[p.id] = { lvl: 1, copies: 0 }; save(); }
export function devCredits(n) { S.data.credits += n; save(); }
export function devMaxAll() { for (const it of Object.values(S.data.inv)) { it.lvl = MAX_LEVEL; it.copies = 0; } save(); }
export function devNextLeague() { S.data.tut = { match: true, shop: true, garage: true }; if (S.data.league < LEAGUES.length) S.data.league++; S.data.match = 0; S.data.nextEnemy = null; S.data.brawl.offers = null; save(); }

// --------------------------------------------------------------------------
// Seeded RNG
// --------------------------------------------------------------------------
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function rollRarity(r, weights) {
  const tot = weights.reduce((a, b) => a + b, 0); let x = r() * tot;
  for (let i = 0; i < 4; i++) { x -= weights[i]; if (x <= 0) return RARITY_ORDER[i]; }
  return 'common';
}

// --------------------------------------------------------------------------
// League helpers
// --------------------------------------------------------------------------
export function currentLeague() {
  const d = S.data;
  if (d.league >= LEAGUES.length) {
    const arena = PRO.arenas[d.proWins % PRO.arenas.length];
    return { ...PRO, arena, matches: 5, index: LEAGUES.length, power: 5 + d.proWins * 0.12, pro: true };
  }
  return { ...LEAGUES[d.league], index: d.league };
}
export function isBossMatch() {
  const L = currentLeague();
  if (L.pro) return S.data.match === 4;
  return S.data.match === L.matches - 1;
}
export function isTutorialMatch() { return !S.data.tut.match; }

// --------------------------------------------------------------------------
// Shop — deal 5 cards from the league's deck
// --------------------------------------------------------------------------
export function priceOf(id) { return RARITY[PART[id].rarity].price; }

export function dealShop(forced) {
  const d = S.data, L = currentLeague();
  const r = rng(d.seed + d.stats.matches * 7919 + (d.shop ? d.shop.rerolls * 104729 : 0) + Date.now() % 1000);
  let cards = [];
  if (forced) cards = forced.slice();
  else {
    const used = new Set();
    const bias = { frame: 0.7, wheel: 0.9, weapon: 1.4, armor: 1.1, shield: 0.9, util: 0.9 };
    while (cards.length < 5) {
      const rar = rollRarity(r, L.rarity);
      const pool = PARTS.filter((p) => p.rarity === rar && !used.has(p.id));
      if (!pool.length) continue;
      // weighted by category
      const tot = pool.reduce((a, p) => a + bias[p.cat], 0); let x = r() * tot; let chosen = pool[0];
      for (const p of pool) { x -= bias[p.cat]; if (x <= 0) { chosen = p; break; } }
      used.add(chosen.id); cards.push(chosen.id);
    }
  }
  d.shop = { cards: cards.map((id) => ({ id, sold: false })), rerolls: d.shop && !forced ? d.shop.rerolls : 0, fresh: true };
  save();
}
export function rerollCost() { return 15 + (S.data.shop ? S.data.shop.rerolls : 0) * 15; }
export function reroll() {
  const c = rerollCost(); if (S.data.credits < c) return false;
  S.data.credits -= c; S.data.shop.rerolls++; dealShop(); S.data.shop.fresh = false; save(); return true;
}
export function buy(i) {
  const card = S.data.shop.cards[i]; if (!card || card.sold) return null;
  const price = priceOf(card.id); if (S.data.credits < price) return null;
  S.data.credits -= price; card.sold = true;
  const inv = S.data.inv;
  let dup = false;
  if (inv[card.id]) { inv[card.id].copies++; dup = true; } else inv[card.id] = { lvl: 1, copies: 0 };
  save();
  return { dup };
}
export function sellValue(id) { return Math.round(priceOf(id) * 0.4); }

// --------------------------------------------------------------------------
// Opponent generation
// --------------------------------------------------------------------------
export function nextEnemy() {
  const d = S.data;
  if (d.nextEnemy) return d.nextEnemy;
  const L = currentLeague();
  const r = rng(d.seed + L.index * 1000 + d.match * 31 + d.stats.matches * 17);
  let e;
  if (isTutorialMatch()) {
    e = { name: 'TARGET DUMMY', title: 'Training', build: JSON.parse(JSON.stringify(STARTER_BUILD)), levels: {}, diff: 0, dummy: true, team: 'dummy', tutorial: true };
    e.build.weapons = [null];
  } else if (isBossMatch() && !L.pro) {
    const B = BOSSES[L.index];
    const levels = {}; for (const id of [B.build.frame, B.build.wheel, ...B.build.weapons, ...B.build.armor, B.build.shield, ...B.build.util]) if (id) levels[id] = B.lvl;
    e = { name: B.name, title: B.title, build: JSON.parse(JSON.stringify(B.build)), levels, diff: B.diff, boss: true, team: 'boss' };
  } else {
    const boss = isBossMatch();
    const p = L.power + d.match / Math.max(1, L.matches) + (boss ? 1 : 0);
    const first = L.index === 0 && d.match === 1;
    e = genBot(r, p, { boss, first, rarity: L.rarity, title: boss ? 'Circuit Boss' : L.name });
  }
  fitBuild(e.build);
  d.nextEnemy = e; save();
  return e;
}

export function genBot(r, p, o = {}) {
  const { boss = false, first = false } = o;
  const w = (o.rarity || [60, 30, 9, 1]).slice(); if (boss) { w[2] += 15; w[3] += 10; }
  const roll = (cat, extra) => {
    for (let k = 0; k < 20; k++) {
      const rar = first ? 'common' : rollRarity(r, w);
      const pool = PARTS.filter((q) => q.cat === cat && q.rarity === rar && (!extra || extra(q)));
      if (pool.length) return pick(r, pool).id;
    }
    return PARTS.find((q) => q.cat === cat && (!extra || extra(q))).id;
  };
  const build = { frame: first ? 'dart' : roll('frame'), wheel: roll('wheel'), weapons: [], armor: [], shield: null, util: [] };
  const F = PART[build.frame];
  for (let i = 0; i < F.slots.weapon; i++) if (i === 0 || r() < 0.45 + 0.1 * p) build.weapons.push(roll('weapon', (q) => !build.weapons.includes(q.id)));
  if (first) { build.wheel = 'rubber'; build.weapons = ['flipper']; build.armor = ['bumpers']; }
  for (let i = 0; i < F.slots.armor; i++) if (i === 0 || r() < 0.5 + 0.1 * p) build.armor.push(roll('armor', (q) => !build.armor.includes(q.id)));
  if (F.slots.shield && r() < 0.25 + 0.15 * p) build.shield = roll('shield');
  for (let i = 0; i < F.slots.util; i++) if (r() < 0.2 + 0.15 * p) build.util.push(roll('util', (q) => !build.util.includes(q.id) && !q.luck));
  // respect capacity: drop extras until near cap
  const st = () => computeStats(build);
  while (st().over > 0.12 && (build.util.length || build.armor.length > 1 || build.weapons.length > 1)) {
    if (build.util.length) build.util.pop(); else if (build.armor.length > 1) build.armor.pop(); else build.weapons.pop();
  }
  const levels = {};
  const maxL = Math.max(1, Math.min(MAX_LEVEL, 1 + Math.floor(p * 0.8)));
  for (const id of [build.frame, build.wheel, ...build.weapons, ...build.armor, build.shield, ...build.util]) if (id) levels[id] = Math.max(1, Math.min(maxL, 1 + Math.floor(r() * (maxL + 0.5))));
  const diff = Math.min(0.95, (first ? 0.08 : 0.16 + p * 0.15) + (boss ? 0.1 : 0));
  const e = { name: boss ? pick(r, BOT_NAMES).toUpperCase() : pick(r, BOT_NAMES), title: o.title || '', build, levels, diff, boss, team: boss ? 'boss' : 'enemy' };
  fitBuild(e.build);
  return e;
}

// --------------------------------------------------------------------------
// Quick Brawl — side fights for credits. Three offers: warm-up, even, tough.
// No series progress; streaks and part drops keep it interesting.
// --------------------------------------------------------------------------
export const BRAWL_TIERS = [
  { key: 'easy', name: 'Warm-up', dp: -0.7, mult: 0.55, drop: 0.12, color: '#5be38a' },
  { key: 'even', name: 'Even Match', dp: 0, mult: 1, drop: 0.22, color: '#3ff0ff' },
  { key: 'tough', name: 'Tough', dp: 0.9, mult: 1.75, drop: 0.4, color: '#ff4d7a' },
];
export function brawlUnlocked() { return !!S.data.tut.match; }
export function unlockedArenas() {
  const ids = ['yard'];
  for (let i = 0; i <= Math.min(S.data.league, LEAGUES.length - 1); i++) if (!ids.includes(LEAGUES[i].arena)) ids.push(LEAGUES[i].arena);
  if (S.data.league >= LEAGUES.length) for (const a of PRO.arenas) if (!ids.includes(a)) ids.push(a);
  return ids.filter((a) => ARENAS[a]);
}
export function brawlOffers() {
  const d = S.data;
  if (d.brawl.offers) return d.brawl.offers;
  const L = currentLeague();
  const r = rng(d.seed ^ (d.brawl.played * 2654435761) ^ (Date.now() & 0xffff));
  const arenas = unlockedArenas();
  const baseP = L.power + (L.pro ? 0 : d.match / Math.max(1, L.matches)) + 0.2;
  d.brawl.offers = BRAWL_TIERS.map((t) => {
    const p = Math.max(0, baseP + t.dp);
    const e = genBot(r, p, { rarity: L.rarity, title: `${t.name} brawl`, first: L.index === 0 && t.key === 'easy' && p < 0.3 });
    if (t.key === 'tough') { e.team = 'boss'; e.diff = Math.min(0.95, e.diff + 0.06); }
    return { tier: t.key, enemy: e, arena: pick(r, arenas), reward: Math.round(L.reward * 0.6 * t.mult / 5) * 5 };
  });
  save();
  return d.brawl.offers;
}
export function rerollBrawl() { S.data.brawl.offers = null; S.data.brawl.played++; return brawlOffers(); }

function dropPart(rarityWeights, r) {
  const rar = rollRarity(r, rarityWeights);
  const pool = PARTS.filter((p) => p.rarity === rar);
  const p = pick(r, pool);
  const inv = S.data.inv;
  if (inv[p.id]) inv[p.id].copies++; else inv[p.id] = { lvl: 1, copies: 0 };
  return p.id;
}

function applyBrawl(res, offer) {
  const d = S.data, L = currentLeague(), Dm = difficulty();
  const T = BRAWL_TIERS.find((t) => t.key === offer.tier) || BRAWL_TIERS[1];
  const out = { credits: 0, xp: 0, lines: [], leagueUp: null, levelUp: null, drop: null, brawl: true };
  const before = pilotLevel();
  d.stats.matches++; d.brawl.played++;
  if (res.win) {
    d.stats.wins++; d.brawl.wins++; if (res.how === 'ko') d.stats.kos++; if (res.how === 'pit') d.stats.pits++;
    d.brawl.streak++; d.brawl.best = Math.max(d.brawl.best, d.brawl.streak);
    out.lines.push([`${T.name} win`, offer.reward]); out.credits += offer.reward;
    if (res.how === 'ko' || res.how === 'pit') { const b = Math.round(offer.reward * 0.25); out.lines.push([res.how === 'pit' ? 'Pit bonus' : 'Knockout bonus', b]); out.credits += b; }
    if (d.brawl.streak > 1) { const b = Math.round(offer.reward * Math.min(0.5, 0.1 * (d.brawl.streak - 1))); out.lines.push([`Win streak x${d.brawl.streak}`, b]); out.credits += b; }
    const r = rng(d.seed + d.stats.matches * 131);
    if (r() < T.drop) { out.drop = dropPart(L.rarity, r); }
    out.xp = 20 + L.index * 6 + (T.key === 'tough' ? 15 : 0);
  } else {
    d.stats.losses++; d.brawl.streak = 0;
    const c = Math.round(offer.reward * 0.25); out.lines.push(['Appearance fee', c]); out.credits += c; out.xp = 8;
  }
  finishRewards(out, before, Dm);
  d.brawl.offers = null;
  dealShop();
  save();
  return out;
}

function finishRewards(out, before, Dm) {
  const d = S.data;
  const base = out.credits;
  if (Dm.reward !== 1 && base) { const b = Math.round(base * (Dm.reward - 1)); out.lines.push([`${Dm.name} difficulty`, b]); out.credits += b; }
  const lk = luckBonus();
  if (lk > 0 && base) { const b = Math.round(base * lk); out.lines.push(['Lucky Bolt', b]); out.credits += b; }
  d.credits += out.credits; d.xp += out.xp;
  const after = pilotLevel();
  if (after > before) { const b = 40 * after; d.credits += b; out.levelUp = { level: after, bonus: b }; }
}

// --------------------------------------------------------------------------
// Results & rewards
// --------------------------------------------------------------------------
export const pilotLevel = (xp = S.data.xp) => Math.floor(Math.sqrt(xp / 60)) + 1;

export function applyResult(res, mode, offer) {
  if (mode === 'brawl') return applyBrawl(res, offer);
  const d = S.data, L = currentLeague();
  const boss = isBossMatch();
  const out = { credits: 0, xp: 0, lines: [], leagueUp: null, levelUp: null };
  const before = pilotLevel();
  d.stats.matches++;
  if (res.tutorial) {
    d.tut.match = true;
    out.credits = 130; out.xp = 30; out.lines.push(['Tutorial complete', 130]);
    d.match = 1;
  } else if (res.win) {
    d.stats.wins++; if (res.how === 'ko') d.stats.kos++; if (res.how === 'pit') d.stats.pits++;
    const base = L.reward + d.match * 6;
    out.lines.push(['Victory', base]); out.credits += base;
    if (res.how === 'ko' || res.how === 'pit') { const b = Math.round(L.reward * 0.25); out.lines.push([res.how === 'pit' ? 'Pit bonus' : 'Knockout bonus', b]); out.credits += b; }
    if (res.hpLeft > 0.7) { const b = Math.round(L.reward * 0.15); out.lines.push(['Flawless-ish', b]); out.credits += b; }
    if (boss) { const b = L.reward * 2; out.lines.push(['Champion purse', b]); out.credits += b; }
    out.xp = 40 + L.index * 10 + (boss ? 60 : 0);
    d.match++;
    if (L.pro) { d.proWins++; if (d.match >= 5) d.match = 0; }
    else if (d.match >= L.matches) { d.league++; d.match = 0; out.leagueUp = d.league < LEAGUES.length ? LEAGUES[d.league].name : PRO.name; }
  } else {
    d.stats.losses++;
    const c = Math.round(L.reward * 0.35);
    out.lines.push(['Repair stipend', c]); out.credits += c; out.xp = 15;
  }
  if (res.tutorial) { d.credits += out.credits; d.xp += out.xp; } else finishRewards(out, before, difficulty());
  d.nextEnemy = null; d.brawl.offers = null;
  // deal a fresh shop
  if (res.tutorial) dealShop(['brick', 'knobby', 'hammer', 'bumpers', 'nitro']);
  else dealShop();
  save();
  return out;
}
