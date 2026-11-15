// Cursor Bots — screens, garage, shop, HUD & touch controls.
import { PART, PARTS, RARITY, CATS, LEAGUES, PRO, ARENAS, TIPS, MAX_LEVEL, partStats, hazardList } from './data.js';
import { drawBot, drawPartIcon } from './render.js';
import { Match, computeStats, powerRating, weaponStatus } from './engine.js';
import * as SV from './save.js';
import { play, setHum, vibrate, Sfx, initAudio } from './audio.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const D = () => SV.S.data;
const coin = '<i class="coin"></i>';

export const UI = {
  screen: null, match: null, previews: [], input: { x: 0, y: 0, mag: 0, fire: [false, false, false], boost: false },
  keys: new Set(), touchStick: false, installPrompt: null, version: '', paused: false,
};

// --------------------------------------------------------------------------
// Basics
// --------------------------------------------------------------------------
function show(name) {
  for (const s of $$('.screen')) s.classList.toggle('active', s.id === 'scr-' + name);
  UI.screen = name;
  UI.previews = UI.previews.filter((p) => document.body.contains(p.canvas) && p.canvas.closest('.screen.active, .sheet, .modal'));
  document.body.classList.toggle('in-match', name === 'hud');
  hideCoach();
}
let toastT = 0;
export function toast(msg, ms = 2200) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
}
function modal(html, onBind) {
  const m = $('#modal'); m.innerHTML = `<div class="inner">${html}</div>`; m.classList.remove('hidden');
  m.onclick = (e) => { if (e.target === m) closeModal(); };
  if (onBind) onBind(m);
  drawIcons(m); registerPreviews(m);
}
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').innerHTML = ''; }
function sheet(html, onBind) {
  const s = $('#sheet'); s.innerHTML = `<div class="inner">${html}</div>`; s.classList.remove('hidden');
  s.onclick = (e) => { if (e.target === s) closeSheet(); };
  if (onBind) onBind(s);
  drawIcons(s);
}
function closeSheet() { $('#sheet').classList.add('hidden'); $('#sheet').innerHTML = ''; }
let coachCb = null;
function coach(html, target, cb) {
  const c = $('#coach');
  c.innerHTML = `<div>${html}</div><div class="row"><button class="btn primary small" data-ok>Got it</button></div>`;
  c.classList.remove('hidden');
  $$('.pulse-hl').forEach((e) => e.classList.remove('pulse-hl'));
  if (target) { const t = typeof target === 'string' ? $(target) : target; if (t) t.classList.add('pulse-hl'); }
  coachCb = cb;
  $('[data-ok]', c).onclick = () => { click(); hideCoach(); };
}
function hideCoach() {
  $('#coach').classList.add('hidden');
  $$('.pulse-hl').forEach((e) => e.classList.remove('pulse-hl'));
  if (coachCb) { const f = coachCb; coachCb = null; f(); }
}
function click() { play('ui'); }
function bind(root, handlers) {
  for (const el of $$('[data-act]', root)) {
    el.addEventListener('click', (e) => {
      const act = el.dataset.act; const fn = handlers[act];
      if (fn) { initAudio(); click(); fn(el.dataset.arg, el, e); }
    });
  }
}

// canvases
function fit(c) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = c.clientWidth || +c.getAttribute('width') || 100, h = c.clientHeight || +c.getAttribute('height') || 100;
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); return { g, w, h };
}
function drawIcons(root) {
  for (const c of $$('canvas[data-icon]', root)) {
    const p = PART[c.dataset.icon]; if (!p) continue;
    const { g, w, h } = fit(c); g.clearRect(0, 0, w, h);
    const s = Math.min(w, h);
    g.save(); g.translate((w - s) / 2, (h - s) / 2); drawPartIcon(g, p, s, c.dataset.team || 'player'); g.restore();
  }
}
function registerPreviews(root) {
  for (const c of $$('canvas[data-preview]', root)) {
    UI.previews.push({ canvas: c, kind: c.dataset.preview, spin: c.dataset.spin !== '0', mirror: c.dataset.mirror === '1' });
  }
}
function botView(build, team, cx, cy, r, a, t, extra = {}) {
  const ws = (build.weapons || []).map((id) => {
    if (!id) return null; const d = PART[id];
    const rpm = d.kind === 'spin' ? 0.75 : 0;
    return { rpm, spin: t * (d.kind === 'spin' ? 22 : d.kind === 'saw' ? 18 : 0), swing: 0, wind: 0, active: d.kind === 'saw', cd: 0 };
  });
  const st = computeStats(build);
  return { build, x: cx, y: cy, r, a, team, ws, shieldFrac: st.shieldCap ? 0.8 : 0, phase: t * 3, ...extra };
}
function drawPreview(p, t) {
  const { g, w, h } = fit(p.canvas);
  g.clearRect(0, 0, w, h);
  let build, team = 'player';
  if (p.kind === 'player') build = D().build;
  else if (p.kind === 'enemy') { const e = SV.nextEnemy(); build = e.build; team = e.team || 'enemy'; }
  else return;
  const F = PART[build.frame];
  const r = Math.min(w, h) * 0.21 * (0.85 + 0.15 * F.size);
  // floor glow
  const gr = g.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.min(w, h) * 0.5);
  gr.addColorStop(0, team === 'player' ? 'rgba(63,240,255,0.16)' : team === 'boss' ? 'rgba(255,178,63,0.18)' : 'rgba(255,77,122,0.16)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const a = p.spin ? -Math.PI / 2 + Math.sin(t * 0.6) * 0.9 + t * 0.25 : p.mirror ? Math.PI : 0;
  drawBot(g, botView(build, team, w / 2, h / 2, r, a, t));
}
export function menuFrame(t) {
  for (const p of UI.previews) if (p.canvas.isConnected && p.canvas.offsetParent !== null) drawPreview(p, t);
}

// --------------------------------------------------------------------------
// Title
// --------------------------------------------------------------------------
export function renderTitle() {
  const el = $('#scr-title');
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  el.innerHTML = `
    <div>
      <canvas class="title-bot" data-preview="player"></canvas>
      <div class="logo">Cursor<span>Bots</span></div>
      <div class="tagline">Build. Upgrade. Destroy.</div>
      <div class="title-actions">
        <button class="btn primary big" data-act="play">${D().tut.match ? 'Continue' : 'Play'}</button>
        ${!standalone && (UI.installPrompt || ios) ? `<button class="btn" data-act="install">Install App</button>` : ''}
        <div class="grid2">
          <button class="btn ghost" data-act="settings">Settings</button>
          <button class="btn ghost" data-act="credits">Credits</button>
        </div>
      </div>
    </div>
    <div class="ver">v${esc(UI.version || '')}</div>`;
  bind(el, {
    play: () => renderHub(),
    install: () => doInstall(),
    settings: () => openSettings(),
    credits: () => openCredits(),
  });
  show('title'); registerPreviews(el);
}
export function setInstallPrompt(p) { UI.installPrompt = p; if (UI.screen === 'title') renderTitle(); }
async function doInstall() {
  if (UI.installPrompt) {
    UI.installPrompt.prompt();
    try { await UI.installPrompt.userChoice; } catch (e) { /* ignore */ }
    UI.installPrompt = null; renderTitle();
  } else {
    modal(`<h3>Install on iPhone / iPad</h3><p>Tap the <b>Share</b> button in Safari, then choose <b>Add to Home Screen</b>. Cursor Bots will launch full-screen and update itself automatically.</p><div class="acts"><button class="btn primary" data-act="x">OK</button></div>`, (m) => bind(m, { x: closeModal }));
  }
}

// --------------------------------------------------------------------------
// Hub
// --------------------------------------------------------------------------
function topbar(title, back) {
  return `<div class="topbar">
    ${back ? `<button class="icon-btn" data-act="${back}" aria-label="Back">&#8249;</button>` : ''}
    <div class="title">${title}</div><div class="spacer"></div>
    <div class="pill">${coin}<span data-credits>${D().credits}</span></div>
    <button class="icon-btn" data-act="settings" aria-label="Settings">&#9881;</button>
  </div>`;
}
function refreshCredits() { for (const e of $$('[data-credits]')) e.textContent = D().credits; }

export function renderHub() {
  const d = D(); const L = SV.currentLeague();
  const st = SV.playerStats();
  const tutorial = SV.isTutorialMatch();
  const enemy = SV.nextEnemy();
  const boss = SV.isBossMatch();
  const nodes = [];
  for (let i = 0; i < L.matches; i++) {
    const isBoss = L.pro ? i === 4 : i === L.matches - 1;
    const cls = i < d.match ? 'done' : i === d.match ? 'cur' : '';
    const label = L.index === 0 && i === 0 ? 'T' : isBoss ? 'BOSS' : String(i + (L.index === 0 ? 0 : 1));
    nodes.push(`<div class="node ${cls} ${isBoss ? 'boss' : ''}">${i < d.match ? '&#10003;' : label}</div>`);
  }
  const lv = SV.pilotLevel(); const curXp = 60 * (lv - 1) ** 2, nextXp = 60 * lv ** 2;
  const xpPct = Math.round(((d.xp - curXp) / (nextXp - curXp)) * 100);
  const leagues = [...LEAGUES, PRO].map((lg, i) => {
    const cls = i < d.league ? 'done' : i === Math.min(d.league, LEAGUES.length) ? 'cur' : 'locked';
    return `<div class="lg ${cls}"><span class="dot" style="background:${lg.color}"></span><b>${lg.name}</b><span class="spacer"></span><span class="muted small">${i < d.league ? 'Cleared' : cls === 'cur' ? 'In progress' : 'Locked'}</span></div>`;
  }).join('');
  const shopFresh = d.shop && d.shop.fresh;
  const el = $('#scr-hub');
  el.innerHTML = `<div class="wrap">
    ${topbar('Cursor Bots', 'title')}
    <div class="hub-grid">
      <div class="panel league-card">
        <div class="glowbar" style="background:${L.color};box-shadow:0 0 20px ${L.color}"></div>
        <h2>Current series</h2>
        <div class="lname" style="color:${L.color}">${L.name}</div>
        <div class="muted small">Arena: ${ARENAS[L.arena].name}${L.pro ? ' · endless' : ''}</div>
        <div class="track">${nodes.join('')}</div>
        <div class="small muted">${tutorial ? 'Learn the controls against a training dummy.' : boss ? `Boss fight: <b style="color:var(--gold)">${esc(enemy.name)}</b>` : `Next opponent: <b>${esc(enemy.name)}</b>`}</div>
        <div class="leagues">${leagues}</div>
      </div>
      <div class="panel">
        <h2>Your bot</h2>
        <canvas class="botview" data-preview="player"></canvas>
        <div class="statgrid">
          <div class="stat"><b>${st.hp}</b><span>Health</span></div>
          <div class="stat"><b>${powerRating(st)}</b><span>Power</span></div>
          <div class="stat"><b>${Math.round(st.maxSpeed)}</b><span>Speed</span></div>
          <div class="stat"><b>${Math.round(st.dps)}</b><span>Damage</span></div>
          <div class="stat"><b style="color:${st.over > 0 ? 'var(--hot)' : 'inherit'}">${st.weight}/${st.cap}</b><span>Weight kg</span></div>
          <div class="stat"><b>${d.stats.wins}-${d.stats.losses}</b><span>Record</span></div>
        </div>
        <div class="row small" style="margin-top:10px"><b>Pilot Lv ${lv}</b><span class="spacer"></span><span class="muted">${d.xp - curXp}/${nextXp - curXp} XP</span></div>
        <div class="xpbar"><i style="width:${xpPct}%"></i></div>
      </div>
    </div>
    <div class="hub-actions">
      <button class="btn ${boss ? 'gold' : 'primary'} big fight" data-act="fight">${tutorial ? 'Start Tutorial' : boss ? 'Boss Fight' : 'Fight'}</button>
      <button class="btn" data-act="garage" ${tutorial ? 'disabled' : ''}>Garage</button>
      <button class="btn" data-act="shop" ${tutorial ? 'disabled' : ''}>Workshop${shopFresh ? '<span class="badge">NEW</span>' : ''}</button>
    </div>
  </div>`;
  bind(el, {
    title: () => renderTitle(), settings: () => openSettings(),
    fight: () => renderVS(), garage: () => renderGarage(), shop: () => renderShop(),
  });
  show('hub'); registerPreviews(el);
}

// --------------------------------------------------------------------------
// Garage
// --------------------------------------------------------------------------
function statBars(st) {
  const bar = (lbl, v, max, txt, warn) => `<div class="sbar"><span class="lbl">${lbl}</span><span class="track2"><i class="${warn ? 'warn' : ''}" style="width:${Math.max(3, Math.min(100, (v / max) * 100))}%"></i></span><span class="val">${txt}</span></div>`;
  return `<div class="bars">
    ${bar('Health', st.hp, 520, st.hp)}
    ${bar('Armor', st.dr, 0.55, Math.round(st.dr * 100) + '%')}
    ${bar('Shield', st.shieldCap, 130, Math.round(st.shieldCap))}
    ${bar('Damage', st.dps, 110, Math.round(st.dps))}
    ${bar('Speed', st.maxSpeed, 380, Math.round(st.maxSpeed))}
    ${bar('Handling', st.turn, 7, st.turn.toFixed(1))}
    ${bar('Weight', st.weight, st.cap, `${st.weight}/${st.cap}`, st.over > 0)}
  </div>`;
}
function slotRow(cat, slot, id, label) {
  if (!id) return `<div class="slot empty" data-act="pick" data-arg="${cat}:${slot}"><canvas></canvas><div><div class="nm">Empty ${label}</div><div class="sub">Tap to equip</div></div></div>`;
  const p = PART[id]; const u = SV.upgradeInfo(id);
  return `<div class="slot r-${p.rarity}" data-act="pick" data-arg="${cat}:${slot}">
    <canvas data-icon="${id}"></canvas>
    <div><div class="nm">${esc(p.name)}</div><div class="sub"><span class="rtag">${RARITY[p.rarity].name}</span> · ${esc(partStats(p, SV.lvl(id))[0])}</div></div>
    <span class="lv">Lv ${SV.lvl(id)}</span>${u && u.can ? '<span class="up">UP</span>' : ''}
  </div>`;
}
export function renderGarage() {
  const d = D(); const b = d.build; const F = PART[b.frame];
  const st = SV.playerStats();
  const W = PART[b.wheel];
  const groups = [];
  groups.push(`<div class="slotgroup"><h3>Frame</h3>${slotRow('frame', 0, b.frame, 'frame')}</div>`);
  groups.push(`<div class="slotgroup"><h3>Wheels &times; ${F.slots.wheel}</h3>${slotRow('wheel', 0, b.wheel, 'wheels')}</div>`);
  groups.push(`<div class="slotgroup"><h3>Weapons (${F.slots.weapon})</h3>${b.weapons.map((id, i) => slotRow('weapon', i, id, i === 0 ? 'front weapon' : 'side weapon')).join('')}</div>`);
  groups.push(`<div class="slotgroup"><h3>Armor (${F.slots.armor})</h3>${b.armor.map((id, i) => slotRow('armor', i, id, 'armor')).join('')}</div>`);
  if (F.slots.shield) groups.push(`<div class="slotgroup"><h3>Shield</h3>${slotRow('shield', 0, b.shield, 'shield')}</div>`);
  if (F.slots.util) groups.push(`<div class="slotgroup"><h3>Utility (${F.slots.util})</h3>${b.util.map((id, i) => slotRow('util', i, id, 'utility')).join('')}</div>`);
  const warns = [];
  if (st.over > 0) warns.push(`Overweight by ${(st.weight - st.cap).toFixed(1)}kg: speed and handling reduced.`);
  if (!b.weapons.some(Boolean)) warns.push('No weapon equipped! You can only ram.');
  const el = $('#scr-garage');
  el.innerHTML = `<div class="wrap">
    ${topbar('Garage', 'back')}
    <div class="garage-grid">
      <div class="panel preview">
        <canvas data-preview="player"></canvas>
        <div class="row small"><b>${esc(F.name)}</b><span class="muted">${esc(W.name)}</span><span class="spacer"></span><span class="pill" style="font-size:12px">Power ${powerRating(st)}</span></div>
        ${statBars(st)}
        ${warns.map((w) => `<div class="warnbox">${w}</div>`).join('')}
      </div>
      <div class="panel slots" id="slotlist">${groups.join('')}</div>
    </div>
    <div class="hub-actions"><button class="btn primary" data-act="fight">Ready</button><button class="btn" data-act="shop">Workshop</button></div>
  </div>`;
  bind(el, {
    back: () => renderHub(), settings: () => openSettings(), fight: () => renderHub(), shop: () => renderShop(),
    pick: (arg) => { const [cat, slot] = arg.split(':'); openPicker(cat, +slot); },
  });
  show('garage'); drawIcons(el); registerPreviews(el);
  if (!d.tut.garage) {
    d.tut.garage = true; SV.save();
    setTimeout(() => coach('<b>Garage:</b> tap any slot to swap parts. Bigger frames carry more wheels, weapons and armor, and every part changes how your bot looks. Watch your <b>weight</b> against the frame\'s capacity!', '#slotlist'), 350);
  }
}
function openPicker(cat, slot) {
  const d = D(); const b = d.build;
  const ownedIds = Object.keys(d.inv).filter((id) => PART[id].cat === cat);
  const rOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
  ownedIds.sort((a, c) => rOrder[PART[c].rarity] - rOrder[PART[a].rarity] || PART[a].name.localeCompare(PART[c].name));
  const current = cat === 'frame' ? b.frame : cat === 'wheel' ? b.wheel : cat === 'shield' ? b.shield : (cat === 'weapon' ? b.weapons : b[cat])[slot];
  const canEmpty = !['frame', 'wheel'].includes(cat);
  const items = ownedIds.map((id) => {
    const p = PART[id]; const u = SV.upgradeInfo(id); const on = id === current;
    const elsewhere = !on && ['weapon', 'armor', 'util'].includes(cat) && (cat === 'weapon' ? b.weapons : b[cat]).includes(id);
    const prog = u.max ? '<span class="small" style="color:var(--gold)">MAX</span>' : `<div class="prog" title="copies"><i style="width:${Math.min(100, (u.copies / u.need) * 100)}%"></i></div><span class="small muted">${u.copies}/${u.need} copies</span>`;
    return `<div class="pick r-${p.rarity} ${on ? 'on' : ''}">
      <canvas data-icon="${id}"></canvas>
      <div><div class="nm">${esc(p.name)} <span class="small muted">Lv ${u.lvl}</span></div>
        <div class="rtag">${RARITY[p.rarity].name} · ${p.wt}kg</div>
        <div class="st">${partStats(p, u.lvl).map(esc).join('<br>')}</div>
        <div class="st muted">${esc(p.desc)}</div></div>
      <div class="acts">
        ${on ? '<span class="small" style="color:var(--accent);font-weight:800">EQUIPPED</span>' : `<button class="btn small primary" data-act="equip" data-arg="${id}">${elsewhere ? 'Move here' : 'Equip'}</button>`}
        ${prog}
        ${u.max ? '' : `<button class="btn small ${u.can ? 'gold' : ''}" data-act="up" data-arg="${id}" ${u.can ? '' : 'disabled'}>Lv ${u.lvl + 1} · ${u.cost}</button>`}
      </div></div>`;
  }).join('');
  sheet(`<div class="row" style="margin-bottom:10px"><h2>${CATS[cat]}${cat === 'wheel' ? ' (fills every wheel slot)' : ''}</h2><span class="spacer"></span><div class="pill">${coin}<span data-credits>${d.credits}</span></div><button class="icon-btn" data-act="close">&times;</button></div>
    ${canEmpty && current ? `<button class="btn small block ghost" style="margin-bottom:8px" data-act="empty">Unequip</button>` : ''}
    ${items || '<p class="muted">You don\'t own any parts of this type yet. Buy them in the Workshop.</p>'}
    <p class="small muted">Buy duplicate cards in the Workshop to collect copies and level parts up (+12% stats per level, max Lv ${MAX_LEVEL}).</p>`, (s) => bind(s, {
    close: closeSheet,
    equip: (id) => { SV.equip(cat, slot, id); closeSheet(); renderGarage(); },
    empty: () => { SV.equip(cat, slot, null); closeSheet(); renderGarage(); },
    up: (id) => { if (SV.upgrade(id)) { play('upgrade'); toast(`${PART[id].name} upgraded to Lv ${SV.lvl(id)}!`); openPicker(cat, slot); renderGarageKeepSheet(); } else play('error'); },
  }));
}
function renderGarageKeepSheet() {
  // refresh garage underneath without closing the sheet
  const s = $('#sheet').innerHTML; const hidden = $('#sheet').classList.contains('hidden');
  renderGarage();
  if (!hidden) { $('#sheet').innerHTML = s; $('#sheet').classList.remove('hidden'); }
}

// --------------------------------------------------------------------------
// Shop / Workshop
// --------------------------------------------------------------------------
function cardHtml(c, i) {
  const p = PART[c.id]; const d = D(); const own = d.inv[c.id];
  const price = SV.priceOf(c.id);
  let ownTxt = '<div class="own new">NEW PART</div>';
  if (own) {
    const u = SV.upgradeInfo(c.id);
    ownTxt = u.max ? '<div class="own">OWNED · MAX LEVEL</div>' : `<div class="own">OWNED Lv ${own.lvl} · copy ${own.copies}/${u.need}</div><div class="prog"><i style="width:${Math.min(100, own.copies / u.need * 100)}%"></i></div>`;
  }
  return `<div class="card r-${p.rarity} ${c.sold ? 'sold' : ''} ${p.rarity === 'legendary' ? 'legendary-glow' : ''}" style="animation-delay:${i * 0.08}s">
    <span class="rtag">${RARITY[p.rarity].name}</span>
    <canvas data-icon="${c.id}"></canvas>
    <div class="cat">${CATS[p.cat]}</div>
    <div class="nm">${esc(p.name)}</div>
    <div class="st">${partStats(p).map(esc).join('<br>')}</div>
    ${ownTxt}
    <button class="btn small ${c.sold ? '' : d.credits >= price ? 'primary' : ''}" data-act="buy" data-arg="${i}" ${!c.sold && d.credits < price ? 'disabled' : ''}>${c.sold ? 'Purchased' : `${coin} ${price}`}</button>
  </div>`;
}
export function renderShop(animate = true) {
  const d = D();
  if (!d.shop) SV.dealShop();
  const el = $('#scr-shop');
  const rc = SV.rerollCost();
  el.innerHTML = `<div class="wrap">
    ${topbar('Workshop', 'back')}
    <div class="row wrap-row" style="margin-bottom:12px"><div><h2>Dealt for you</h2><div class="small muted">A fresh hand of part cards is dealt after every match.</div></div>
      <span class="spacer"></span><button class="btn small" data-act="reroll" ${d.credits < rc ? 'disabled' : ''}>Reroll &middot; ${coin} ${rc}</button></div>
    <div class="cards" id="cards">${d.shop.cards.map(cardHtml).join('')}</div>
    <div class="hub-actions"><button class="btn primary" data-act="garage">Garage</button><button class="btn" data-act="back">Done</button></div>
  </div>`;
  if (!animate) $$('.card', el).forEach((c) => (c.style.animation = 'none'));
  bind(el, {
    back: () => { d.shop.fresh = false; SV.save(); renderHub(); },
    settings: () => openSettings(),
    garage: () => { d.shop.fresh = false; SV.save(); renderGarage(); },
    reroll: () => { if (SV.reroll()) { play('deal'); renderShop(); } else play('error'); },
    buy: (i) => {
      const id = d.shop.cards[+i].id; const res = SV.buy(+i);
      if (!res) { play('error'); return; }
      play('buy'); vibrateIf(20);
      toast(res.dup ? `+1 copy of ${PART[id].name}. Level it up in the Garage!` : `${PART[id].name} added to your Garage!`);
      renderShop(false);
    },
  });
  show('shop'); drawIcons(el);
  if (animate) d.shop.cards.forEach((_, i) => setTimeout(() => play('deal'), i * 80));
  if (!d.tut.shop) {
    d.tut.shop = true; SV.save();
    setTimeout(() => coach('<b>The Workshop:</b> after every match you\'re dealt 5 part cards from the deck. Rarer cards appear in higher leagues. Try the <b>Brick</b> frame (4 wheels + a utility slot) and the <b>Hammer</b>, then equip them in the Garage.', '#cards'), 700);
  }
}
function vibrateIf(ms) { if (D().settings.haptics) vibrate(ms); }

// --------------------------------------------------------------------------
// VS screen
// --------------------------------------------------------------------------
function renderVS() {
  const e = SV.nextEnemy(); const L = SV.currentLeague();
  const ps = SV.playerStats(); const es = computeStats(e.build, (id) => e.levels[id] || 1);
  const arenaId = e.tutorial ? 'tutorial' : L.arena;
  const haz = hazardList(ARENAS[arenaId]);
  const tip = e.tutorial ? 'This is a training match. Nothing can go wrong!' : TIPS[(D().stats.matches * 3 + 1) % TIPS.length];
  const el = $('#scr-vs');
  el.innerHTML = `<div style="width:100%"><div class="vs" style="margin:0 auto">
      <div class="side"><canvas data-preview="player" data-spin="0"></canvas><div class="bname" style="color:var(--accent)">You</div><div class="small muted">Power ${powerRating(ps)} · HP ${ps.hp}</div></div>
      <div class="vsx">VS</div>
      <div class="side"><canvas data-preview="enemy" data-spin="0" data-mirror="1"></canvas><div class="bname" style="color:${e.boss ? 'var(--gold)' : 'var(--hot)'}">${esc(e.name)}</div><div class="small muted">${esc(e.title || '')} · Power ${powerRating(es)} · HP ${es.hp}</div></div>
    </div>
    <div class="chips"><span class="chip">${ARENAS[arenaId].name}</span>${haz.map((h) => `<span class="chip danger">${h}</span>`).join('')}</div>
    <div class="tip">${esc(tip)}</div>
    <div class="row" style="justify-content:center;margin-top:16px;gap:12px"><button class="btn ghost" data-act="back">Back</button><button class="btn ${e.boss ? 'gold' : 'hot'} big" data-act="go">${e.tutorial ? 'Begin' : 'Fight!'}</button></div>
  </div>`;
  bind(el, { back: () => renderHub(), go: () => startMatch() });
  show('vs'); registerPreviews(el);
}

// --------------------------------------------------------------------------
// Match + HUD
// --------------------------------------------------------------------------
function startMatch() {
  initAudio();
  const d = D(); const e = SV.nextEnemy(); const L = SV.currentLeague();
  const arena = e.tutorial ? 'tutorial' : L.arena;
  UI.input = { x: 0, y: 0, mag: 0, fire: [false, false, false], boost: false };
  const m = new Match({
    arena, tutorial: !!e.tutorial,
    player: { build: JSON.parse(JSON.stringify(d.build)), levels: SV.levelsMap() },
    enemy: { build: e.build, levels: e.levels, diff: e.diff, name: e.name, dummy: e.dummy, team: e.team },
    onEvent: onMatchEvent,
  });
  UI.match = m; UI.paused = false;
  buildHud(m);
  show('hud');
  resizeCanvas();
  m.start();
  if (window.innerHeight > window.innerWidth && !sessionStorage.getItem('cb-rot')) { sessionStorage.setItem('cb-rot', '1'); setTimeout(() => toast('Tip: landscape gives you a wider view of the arena', 2600), 1200); }
}

function buildHud(m) {
  const el = $('#scr-hud');
  const ws = m.player.weapons;
  el.innerHTML = `
    <div class="hud-top">
      <div class="hpbox player"><div class="nm" style="color:var(--accent)">You</div><div class="hpbar"><i class="lag" data-plag></i><i class="hp" data-php></i></div>${m.player.st.shieldCap ? '<div class="shbar"><i data-psh></i></div>' : ''}</div>
      <div class="timer" data-timer>${m.tut ? 'TRAIN' : '2:00'}</div>
      <div class="hpbox enemy"><div class="nm" style="color:${m.enemy.team === 'boss' ? 'var(--gold)' : 'var(--hot)'}">${esc(m.enemy.name)}</div><div class="hpbar"><i class="lag" data-elag></i><i class="hp" data-ehp></i></div>${m.enemy.st.shieldCap ? '<div class="shbar"><i data-esh></i></div>' : ''}</div>
    </div>
    <button class="icon-btn pause" data-act="pause" aria-label="Pause">II</button>
    <div class="stick-zone" data-zone><div class="stick idle" data-stick><div class="knob" data-knob></div></div></div>
    <div class="abtns" data-btns>
      <div class="abtn boost" data-boost><div class="ring" style="--rcol:var(--gold)"></div><span class="bolt">&#9889;</span><span class="lab">Boost</span></div>
      ${ws.map((w, i) => `<div class="abtn" data-w="${i}"><div class="ring"></div><span class="mode">${['spin', 'saw', 'flame', 'gun'].includes(w.def.kind) ? 'HOLD' : 'TAP'}</span><canvas data-icon="${w.def.id}"></canvas><span class="lab">${esc(ws.length > 1 ? w.def.name.split(' ').slice(-1)[0] : w.def.name)}</span></div>`).join('')}
    </div>
    <div data-tut></div>
    <div data-banner></div>`;
  drawIcons(el);
  $('[data-act="pause"]', el).onclick = () => { click(); pauseMatch(); };
  // idle stick position
  const stick = $('[data-stick]', el), knob = $('[data-knob]', el), zone = $('[data-zone]', el);
  const placeIdle = () => { const r = zone.getBoundingClientRect(); stick.style.left = Math.min(130, r.width * 0.35) + 'px'; stick.style.top = (r.height - 110) + 'px'; stick.classList.add('idle'); stick.classList.remove('on'); knob.style.transform = ''; };
  requestAnimationFrame(placeIdle);
  let sp = null, ox = 0, oy = 0;
  const R = 60;
  zone.addEventListener('pointerdown', (e) => {
    if (sp !== null) return;
    e.preventDefault(); initAudio();
    sp = e.pointerId; const r = zone.getBoundingClientRect(); ox = e.clientX; oy = e.clientY;
    stick.style.left = (ox - r.left) + 'px'; stick.style.top = (oy - r.top) + 'px';
    stick.classList.add('on'); stick.classList.remove('idle');
    try { zone.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    UI.touchStick = true;
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== sp) return;
    let dx = e.clientX - ox, dy = e.clientY - oy; const l = Math.hypot(dx, dy);
    if (l > R) { dx = dx / l * R; dy = dy / l * R; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    if (l < 6) { UI.input.mag = 0; return; }
    UI.input.x = dx; UI.input.y = dy; UI.input.mag = Math.min(1, l / R);
  });
  const end = (e) => { if (e.pointerId !== sp) return; sp = null; UI.input.mag = 0; UI.touchStick = false; placeIdle(); };
  zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);
  const hold = (btn, on, off) => {
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); initAudio(); btn.classList.add('down'); on(); try { btn.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } vibrateIf(8); });
    const up = () => { btn.classList.remove('down'); off(); };
    btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up); btn.addEventListener('lostpointercapture', up);
  };
  hold($('[data-boost]', el), () => (UI.input.boost = true), () => (UI.input.boost = false));
  for (const b of $$('[data-w]', el)) { const i = +b.dataset.w; hold(b, () => (UI.input.fire[i] = true), () => (UI.input.fire[i] = false)); }
  UI.hud = {
    php: $('[data-php]', el), plag: $('[data-plag]', el), psh: $('[data-psh]', el),
    ehp: $('[data-ehp]', el), elag: $('[data-elag]', el), esh: $('[data-esh]', el),
    timer: $('[data-timer]', el), boost: $('[data-boost]', el), wbtns: $$('[data-w]', el), tut: $('[data-tut]', el), banner: $('[data-banner]', el),
  };
}

function banner(text, color) {
  const b = UI.hud.banner; b.innerHTML = `<div class="banner pop" style="color:${color || '#fff'}">${text}</div>`;
}

function onMatchEvent(type, data) {
  const s = D().settings;
  switch (type) {
    case 'sfx': play(data.name, data); break;
    case 'hit': if (data.player && s.haptics) vibrate(data.big ? 40 : 15); break;
    case 'toast': toast(data); break;
    case 'count': if (data > 0) { banner(String(data)); play('count'); } else { banner('FIGHT!', 'var(--accent)'); play('go'); } break;
    case 'tut': {
      const total = 4;
      UI.hud.tut.innerHTML = `<div class="tutbox"><span class="stepn">TRAINING ${data.step + 1}/${total}</span>${esc(data.text)}</div>`;
      $$('.pulse-hl').forEach((e) => e.classList.remove('pulse-hl'));
      if (data.step === 2) UI.hud.boost.classList.add('pulse-hl');
      if (data.step === 3 && UI.hud.wbtns[0]) UI.hud.wbtns[0].classList.add('pulse-hl');
      if (data.step === 0) $('[data-stick]').classList.add('pulse-hl');
      break;
    }
    case 'end': endMatch(data); break;
  }
}

function pauseMatch() {
  if (!UI.match || UI.match.state === 'over') return;
  UI.paused = true; setHum(0);
  const tut = !!UI.match.tut;
  modal(`<h3>Paused</h3>
    ${toggles()}
    <div class="acts"><button class="btn primary" data-act="resume">Resume</button>${tut ? '' : '<button class="btn hot" data-act="forfeit">Forfeit match</button>'}</div>`, (m) => {
    bindToggles(m);
    bind(m, {
      resume: () => { closeModal(); UI.paused = false; },
      forfeit: () => { closeModal(); UI.paused = false; const r = { win: false, how: 'forfeit', time: UI.match.time, dmgDealt: Math.round(UI.match.player.dmgDealt), hpLeft: 0 }; UI.match.state = 'over'; endMatch(r); },
    });
  });
}
export function onHidden() { if (UI.match && !UI.paused && UI.screen === 'hud') pauseMatch(); }

export function matchFrame(dt, ctx, w, h) {
  const m = UI.match; if (!m) return;
  if (!UI.paused) {
    // keyboard
    const k = UI.keys;
    if (!UI.touchStick) {
      let x = 0, y = 0;
      if (k.has('arrowleft') || k.has('a')) x -= 1; if (k.has('arrowright') || k.has('d')) x += 1;
      if (k.has('arrowup') || k.has('w')) y -= 1; if (k.has('arrowdown') || k.has('s')) y += 1;
      if (x || y) { UI.input.x = x; UI.input.y = y; UI.input.mag = 1; UI.kbDrive = true; } else if (UI.kbDrive) { UI.input.mag = 0; UI.kbDrive = false; }
    }
    const kf = [k.has(' ') || k.has('j'), k.has('k'), k.has('l')];
    const pin = m.player.input;
    pin.x = UI.input.x; pin.y = UI.input.y; pin.mag = UI.input.mag;
    pin.fire = [0, 1, 2].map((i) => UI.input.fire[i] || kf[i]);
    pin.boost = UI.input.boost || k.has('shift');
    const steps = dt > 1 / 45 ? 2 : 1;
    for (let i = 0; i < steps; i++) m.update(dt / steps);
  }
  m.draw(ctx, w, h);
  // HUD
  const H = UI.hud; if (!H) return;
  const pf = Math.max(0, m.player.hp / m.player.maxHp), ef = Math.max(0, m.enemy.hp / m.enemy.maxHp);
  H.php.style.width = pf * 100 + '%'; H.plag.style.width = pf * 100 + '%';
  H.ehp.style.width = ef * 100 + '%'; H.elag.style.width = ef * 100 + '%';
  if (H.psh) H.psh.style.width = (m.player.shield / m.player.st.shieldCap) * 100 + '%';
  if (H.esh) H.esh.style.width = (m.enemy.shield / m.enemy.st.shieldCap) * 100 + '%';
  if (!m.tut) {
    const left = Math.max(0, Math.ceil(m.duration - m.time));
    const txt = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    if (H.timer.textContent !== txt) H.timer.textContent = txt;
    H.timer.classList.toggle('low', left <= 10);
  }
  const bf = m.player.boostCd <= 0 ? 1 : 1 - m.player.boostCd / m.player.st.boostCd;
  H.boost.firstElementChild.style.setProperty('--p', bf.toFixed(3));
  H.boost.classList.toggle('ready', bf >= 1);
  let hum = 0;
  m.player.weapons.forEach((w, i) => {
    const b = H.wbtns[i]; if (!b) return;
    const s = weaponStatus(w);
    b.firstElementChild.style.setProperty('--p', s.frac.toFixed(3));
    b.classList.toggle('ready', s.ready);
    if (w.def.kind === 'spin') hum = Math.max(hum, w.rpm);
  });
  setHum(UI.paused || m.state === 'over' ? 0 : hum);
}

function endMatch(res) {
  setHum(0);
  const m = UI.match; UI.match = null; UI.hud = null;
  const enemy = SV.nextEnemy();
  const L = SV.currentLeague();
  const out = SV.applyResult(res);
  renderResult(res, out, enemy, L);
  const g = $('#cv').getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 99999, 99999);
  if (UI.onMatchEnd) UI.onMatchEnd();
}

// --------------------------------------------------------------------------
// Results
// --------------------------------------------------------------------------
function renderResult(res, out, enemy, L) {
  const how = { ko: 'Knockout', pit: 'Into the pit!', decision: 'Judges\' decision', forfeit: 'Forfeit' }[res.how] || '';
  const total = out.lines.reduce((a, l) => a + l[1], 0) + (out.levelUp ? out.levelUp.bonus : 0);
  const el = $('#scr-result');
  el.innerHTML = `<div class="result panel">
    <div class="big ${res.win ? 'win' : 'lose'}">${res.tutorial ? 'Trained!' : res.win ? 'Victory' : 'Defeat'}</div>
    <div class="muted">${res.tutorial ? 'You\'re ready for the arena.' : `${how} vs <b>${esc(enemy.name)}</b>`}</div>
    ${out.leagueUp ? `<div class="announce">&#127942; ${esc(L.name)} cleared! Unlocked: ${esc(out.leagueUp)}</div>` : ''}
    ${out.levelUp ? `<div class="announce" style="border-color:var(--accent);color:var(--accent);background:rgba(63,240,255,.08)">Pilot level ${out.levelUp.level}!</div>` : ''}
    <div class="rlines">
      ${res.tutorial ? '' : `<div class="rline"><span class="muted">Damage dealt / taken</span><span>${res.dmgDealt} / ${res.dmgTaken ?? '-'}</span></div>`}
      ${out.lines.map((l, i) => `<div class="rline" style="animation-delay:${0.15 + i * 0.12}s"><span>${esc(l[0])}</span><span>${coin} +${l[1]}</span></div>`).join('')}
      ${out.levelUp ? `<div class="rline"><span>Level-up bonus</span><span>${coin} +${out.levelUp.bonus}</span></div>` : ''}
      <div class="rline total" style="animation-delay:${0.2 + out.lines.length * 0.12}s"><span>Total</span><span>${coin} +${total}</span></div>
      <div class="rline"><span class="muted">Pilot XP</span><span>+${out.xp}</span></div>
    </div>
    <div class="grid2"><button class="btn" data-act="hub">Hub</button><button class="btn primary" data-act="shop">Workshop<span class="badge">NEW</span></button></div>
  </div>`;
  bind(el, { hub: () => renderHub(), shop: () => renderShop() });
  show('result');
}

// --------------------------------------------------------------------------
// Settings & credits
// --------------------------------------------------------------------------
function toggles() {
  const s = D().settings;
  return `<div class="toggle" data-tog="sound">Sound effects<span class="switch ${s.sound ? 'on' : ''}"></span></div>
    <div class="toggle" data-tog="haptics">Vibration<span class="switch ${s.haptics ? 'on' : ''}"></span></div>`;
}
function bindToggles(root) {
  for (const t of $$('[data-tog]', root)) t.onclick = () => {
    const k = t.dataset.tog; const s = D().settings; s[k] = !s[k]; SV.save();
    Sfx.enabled = s.sound; t.lastElementChild.classList.toggle('on', s[k]); click();
  };
}
export function openSettings() {
  modal(`<h3>Settings</h3>${toggles()}
    <p class="small muted">Version ${esc(UI.version)}. Updates download automatically in the background and apply between matches.</p>
    <div class="acts">
      <button class="btn" data-act="upd">Check for updates</button>
      <button class="btn" data-act="credits">Credits &amp; licenses</button>
      <button class="btn hot" data-act="reset">Reset progress</button>
      <button class="btn primary" data-act="close">Close</button>
    </div>`, (m) => {
    bindToggles(m);
    bind(m, {
      close: closeModal, credits: openCredits,
      upd: () => { if (UI.checkUpdate) UI.checkUpdate(true); },
      reset: () => modal(`<h3>Reset progress?</h3><p>This erases your parts, credits and league progress. It can't be undone.</p><div class="acts"><button class="btn hot" data-act="yes">Erase everything</button><button class="btn" data-act="no">Cancel</button></div>`, (m2) => bind(m2, {
        yes: () => { SV.reset(); closeModal(); renderTitle(); toast('Progress reset'); }, no: openSettings,
      })),
    });
  });
}
export function openCredits() {
  modal(`<h3>Credits</h3><div class="credits-list">
    <h4>Cursor Bots</h4>Game design, code, art and sound are original to this project. Licensed under the MIT License (see LICENSE).
    <h4>Third-party code &amp; assets</h4>None. No libraries, frameworks, fonts, images or audio files are bundled. Graphics are drawn procedurally on HTML canvas, sound is synthesized live with the Web Audio API, and text uses your device's system font.
    <h4>Inspiration</h4>Inspired by classic arcade vector shooters, televised robot combat, and card-based upgrade games. Not affiliated with or endorsed by any of them; all trademarks belong to their owners.
    <h4>Controls</h4>Touch: drag the left half to drive, buttons on the right to attack and boost. Keyboard: WASD/arrows to drive, Space/J, K, L for weapons, Shift to boost.
  </div><div class="acts"><button class="btn primary" data-act="close">Close</button></div>`, (m) => bind(m, { close: closeModal }));
}

// --------------------------------------------------------------------------
// Canvas sizing for match
// --------------------------------------------------------------------------
export function resizeCanvas() {
  const c = $('#cv'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.round(window.innerWidth * dpr); c.height = Math.round(window.innerHeight * dpr);
  UI.dpr = dpr;
}

export function initUI() {
  Sfx.enabled = D().settings.sound;
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase(); UI.keys.add(k);
    if (UI.screen === 'hud' && [' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
    if (k === 'escape' && UI.screen === 'hud') { if (UI.paused) { closeModal(); UI.paused = false; } else pauseMatch(); }
  });
  window.addEventListener('keyup', (e) => UI.keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur', () => UI.keys.clear());
  document.addEventListener('contextmenu', (e) => { if (UI.screen === 'hud') e.preventDefault(); });
}
export { show, closeModal };
