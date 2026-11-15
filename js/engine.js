// Cursor Bots — match simulation: physics, weapons, hazards, AI, tutorial, camera + draw.
import { PART, levelMult, ARENAS, WORLD } from './data.js';
import { drawArena, drawBot, cyc, weaponMount, TEAM } from './render.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hyp = Math.hypot;
export const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
const RANGED = new Set(['gun', 'rocket', 'emp', 'rail']);
const HP_MULT = 1.7; // global match-length tuning

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
export function computeStats(build, lvlOf = () => 1) {
  const F = PART[build.frame];
  const W = PART[build.wheel] || PART.rubber;
  const L = (id) => lvlOf(id) || 1;
  const n = F.slots.wheel;
  const weapons = (build.weapons || []).slice(0, F.slots.weapon).map((id, slot) => (id ? { def: PART[id], lvl: L(id), slot } : null)).filter(Boolean);
  const armors = (build.armor || []).slice(0, F.slots.armor).filter(Boolean).map((id) => ({ def: PART[id], lvl: L(id) }));
  const shield = F.slots.shield && build.shield ? { def: PART[build.shield], lvl: L(build.shield) } : null;
  const utils = (build.util || []).slice(0, F.slots.util).filter(Boolean).map((id) => ({ def: PART[id], lvl: L(id) }));

  let hp = F.hp * levelMult(L(F.id));
  let keep = 1, kbRes = W.kb || 0, thorns = 0, reactive = 0;
  for (const a of armors) {
    hp += a.def.hp * levelMult(a.lvl);
    keep *= 1 - a.def.dr * (1 + 0.06 * (a.lvl - 1));
    kbRes += a.def.kb || 0; thorns += a.def.thorns || 0; reactive = Math.max(reactive, a.def.reactive || 0);
  }
  const dr = Math.min(0.55, 1 - keep);
  hp *= HP_MULT;

  let weight = F.wt + W.wt * n;
  for (const w of weapons) weight += w.def.wt;
  for (const a of armors) weight += a.def.wt;
  if (shield) weight += shield.def.wt;
  for (const u of utils) weight += u.def.wt;

  let regen = 0, cdMul = 1, dmgMul = 1, stunRes = 0, anchor = false, crit = 0, homing = 1, boost = 1, boostCd = 6, shieldRegenMul = 1;
  for (const u of utils) {
    const d = u.def, m = levelMult(u.lvl);
    if (d.regen) regen += d.regen * m;
    if (d.cdMul) cdMul *= d.cdMul;
    if (d.dmgMul) dmgMul *= d.dmgMul * (1 + 0.02 * (u.lvl - 1));
    if (d.stunRes) stunRes = Math.max(stunRes, d.stunRes);
    if (d.kb) kbRes += d.kb;
    if (d.anchor) anchor = true;
    if (d.crit) crit = Math.max(crit, d.crit * (1 + 0.05 * (u.lvl - 1)));
    if (d.homing) homing = Math.max(homing, d.homing);
    if (d.boost) { boost = Math.max(boost, d.boost); boostCd *= d.boostCd; }
    if (d.shieldRegen) shieldRegenMul *= d.shieldRegen;
  }
  if (W.boostCd) boostCd *= W.boostCd;
  kbRes = Math.min(0.75, kbRes);

  const power = W.power * n * levelMult(L(W.id));
  const pw = power / weight;
  const over = Math.max(0, weight - F.cap) / F.cap;
  const ovm = clamp(1 - over * 1.6, 0.35, 1);
  const maxSpeed = (140 + 125 * Math.min(pw, 1.5)) * W.top * ovm;
  const accel = maxSpeed * (1.5 + 1.5 * Math.min(pw, 1.3)) * ovm;
  const grip = W.grip;
  const turn = 3.7 * F.turn * (0.75 + 0.25 * grip) * (W.turn || 1) * (0.75 + 0.25 * ovm);

  // rough offense rating for UI
  let dps = 0;
  for (const w of weapons) {
    const d = w.def, m = levelMult(w.lvl) * dmgMul;
    if (d.kind === 'spin') dps += d.dmg * m * 0.9;
    else if (d.kind === 'saw' || d.kind === 'flame') dps += d.dps * m * 0.8;
    else if (d.kind === 'gun') dps += d.dmg * d.rof * m * 0.5;
    else dps += (d.dmg * m) / ((d.cd || 1) * cdMul) * 1.1;
  }

  return {
    hp: Math.round(hp), dr, weight: Math.round(weight * 10) / 10, cap: F.cap, over, maxSpeed, accel, turn, grip,
    r: 17 * F.size, kbRes, thorns, reactive, regen, cdMul, dmgMul, stunRes, anchor, crit, homing, boost, boostCd,
    shieldCap: shield ? shield.def.cap * levelMult(shield.lvl) : 0,
    shieldRegen: shield ? shield.def.regen * levelMult(shield.lvl) * shieldRegenMul : 0,
    shieldDelay: shield ? shield.def.delay : 99,
    hover: !!W.hover, contact: (W.contact || 0) * levelMult(L(W.id)), ram: F.ram || 1,
    weapons, dps, power, speedRating: maxSpeed,
  };
}

export function powerRating(st) {
  const ehp = (st.hp + st.shieldCap * 1.5) / (1 - st.dr);
  return Math.round(ehp * 0.35 + st.dps * 3 + st.maxSpeed * 0.15);
}

// ---------------------------------------------------------------------------
// Bot
// ---------------------------------------------------------------------------
class Bot {
  constructor(build, levels, team, x, y, a, name) {
    this.build = build; this.levels = levels || {}; this.team = team; this.name = name;
    this.st = computeStats(build, (id) => this.levels[id] || 1);
    this.x = x; this.y = y; this.a = a; this.vx = 0; this.vy = 0;
    this.r = this.st.r; this.hp = this.st.hp; this.maxHp = this.st.hp;
    this.shield = this.st.shieldCap; this.shieldT = 0; this.shieldHit = 0;
    this.weapons = this.st.weapons.map((w) => ({ def: w.def, lvl: w.lvl, slot: w.slot, cd: 0, rpm: 0, spin: Math.random() * 6, swing: 0, wind: 0, active: false, heat: 0, over: false, hitCd: 0, tick: 0 }));
    this.stun = 0; this.air = 0; this.airMax = 0; this.spinDir = 1;
    this.boostCd = 0; this.boostT = 0; this.kbT = 0;
    this.burn = 0; this.burnDps = 0; this.burnTick = 0;
    this.alive = true; this.fall = null; this.anchorUsed = false;
    this.input = { x: 0, y: 0, mag: 0, fire: [false, false, false], boost: false };
    this.flash = 0; this.dmgDealt = 0; this.hazCd = 0; this.ramCd = 0; this.phase = 0;
    this.invuln = false; this.minHp = 0; this.ai = null;
  }
  mountPos(slot) {
    const F = PART[this.build.frame]; const m = weaponMount(F, slot);
    const c = Math.cos(this.a), s = Math.sin(this.a);
    return { x: this.x + (m.x * c - m.y * s) * this.r, y: this.y + (m.x * s + m.y * c) * this.r };
  }
}

// ---------------------------------------------------------------------------
// AI controller
// ---------------------------------------------------------------------------
export class AI {
  constructor(diff) { this.d = clamp(diff, 0, 1); this.think = 0; this.goal = null; this.flank = Math.random() < 0.5 ? 1 : -1; this.backoff = 0; this.aimJit = 0; this.react = 0; }
  update(b, t, m, dt) {
    const inp = b.input; inp.fire = [false, false, false]; inp.boost = false;
    if (!t || !t.alive || m.state !== 'fight') { inp.mag = 0; return; }
    const d = this.d;
    const dx = t.x - b.x, dy = t.y - b.y, dist = hyp(dx, dy) || 1;
    const angTo = Math.atan2(dy, dx);
    const ferr = Math.abs(angDiff(b.a, angTo));
    const ranged = b.weapons.length > 0 && b.weapons.every((w) => RANGED.has(w.def.kind));
    const hasFlip = b.weapons.some((w) => w.def.kind === 'flipper') || b.st.ram > 1;
    const spinW = b.weapons.find((w) => w.def.kind === 'spin');
    this.think -= dt; this.backoff -= dt;
    if (this.think <= 0 || !this.goal) {
      this.think = 0.34 - 0.22 * d + Math.random() * 0.12;
      this.aimJit = (Math.random() - 0.5) * (1 - d) * 0.5;
      const lead = 0.2 + 0.3 * d;
      let gx = t.x + t.vx * lead, gy = t.y + t.vy * lead;
      if (ranged) {
        const pref = 270;
        if (dist < pref - 70) { gx = b.x - dx; gy = b.y - dy; }
        else if (dist < pref + 90) { gx = b.x - dy * this.flank + dx * 0.2; gy = b.y + dx * this.flank + dy * 0.2; }
      } else {
        const tFace = Math.abs(angDiff(t.a, Math.atan2(-dy, -dx)));
        const tHasFront = t.weapons.some((w) => !RANGED.has(w.def.kind));
        if (tHasFront && d > 0.3 && tFace < 0.7 && dist > 80 && dist < 340 && Math.random() < d * 0.9) {
          const px = -dy / dist, py = dx / dist;
          gx = t.x + px * 130 * this.flank; gy = t.y + py * 130 * this.flank;
        }
        if (hasFlip && m.pitOpen && d > 0.45) {
          const P = m.nearestPit(t.x, t.y);
          if (P) {
            const ux = t.x - P.x, uy = t.y - P.y, ul = hyp(ux, uy) || 1;
            const bx = t.x + (ux / ul) * (t.r + b.r + 20), by = t.y + (uy / ul) * (t.r + b.r + 20);
            if (hyp(bx - b.x, by - b.y) > 50 && ul < 420) { gx = bx; gy = by; }
          }
        }
        if (spinW && spinW.rpm < 0.3 && dist < 100 && d > 0.35) this.backoff = 0.35 + Math.random() * 0.3;
      }
      if (this.backoff > 0) { gx = b.x - dx; gy = b.y - dy; }
      if (Math.random() < 0.12) this.flank *= -1;
      this.goal = { x: gx, y: gy };
    }
    let vx = this.goal.x - b.x, vy = this.goal.y - b.y;
    const vl = hyp(vx, vy) || 1; vx /= vl; vy /= vl;
    // hazard avoidance
    if (Math.random() < 0.35 + 0.65 * d) {
      const look = 45 + hyp(b.vx, b.vy) * 0.5;
      if (m.danger(b.x + vx * look, b.y + vy * look, b)) {
        const base = Math.atan2(vy, vx);
        for (const off of [0.7, -0.7, 1.4, -1.4, 2.2, -2.2, Math.PI]) {
          const a = base + off * this.flank;
          if (!m.danger(b.x + Math.cos(a) * look, b.y + Math.sin(a) * look, b)) { vx = Math.cos(a); vy = Math.sin(a); break; }
        }
      }
    }
    if (this.aimJit) { const a = Math.atan2(vy, vx) + this.aimJit; vx = Math.cos(a); vy = Math.sin(a); }
    inp.x = vx; inp.y = vy; inp.mag = 0.72 + 0.28 * d;
    // tap weapons: low-skill bots react slowly and sometimes whiff the timing
    this.react -= dt;
    // weapons
    b.weapons.forEach((w, i) => {
      const k = w.def.kind;
      if (k === 'spin') inp.fire[i] = dist < 320;
      else if (k === 'hammer' || k === 'flipper') {
        const inRange = m.meleeCheck(b, i, w.def.range * 1.1, w.def.arc, t);
        if (inRange && this.react <= 0) { this.react = 0.45 * (1 - d) + 0.04; inp.fire[i] = Math.random() < 0.35 + 0.65 * d; }
      }
      else if (k === 'saw' || k === 'flame') inp.fire[i] = dist < w.def.range + t.r + b.r + 12 && ferr < 0.7;
      else if (k === 'rocket') inp.fire[i] = dist < w.def.range && ferr < 0.6;
      else inp.fire[i] = dist < w.def.range && ferr < 0.1 + (1 - d) * 0.2;
    });
    if (b.boostCd <= 0) {
      if (!ranged && dist > 110 && dist < 330 && ferr < 0.3 && Math.random() < dt * (0.4 + d * 1.6)) inp.boost = true;
      if (d > 0.4 && m.danger(b.x, b.y, b)) inp.boost = true;
    }
  }
}

// ---------------------------------------------------------------------------
// Match
// ---------------------------------------------------------------------------
const TUT_STEPS = [
  'Drag anywhere on the LEFT side of the screen to drive. Your bot turns toward your thumb.',
  'Nice! Now drive through the 3 glowing beacons.',
  'Tap the BOOST button for a burst of speed.',
  'Spinners need to spin up first! HOLD the weapon button, then ram the target dummy.',
];

export class Match {
  constructor(o) {
    this.o = o;
    this.arenaId = o.arena; this.arena = ARENAS[o.arena];
    this.events = o.onEvent || (() => {});
    this.time = 0; this.state = 'countdown'; this.countdown = o.tutorial ? 0.6 : 3.2; this.lastCount = 4;
    this.duration = o.tutorial ? Infinity : (o.duration || 120);
    this.player = new Bot(o.player.build, o.player.levels, 'player', 250, 500, 0, 'YOU');
    this.enemy = new Bot(o.enemy.build, o.enemy.levels, o.enemy.team || 'enemy', 1150, 500, Math.PI, o.enemy.name);
    if (!o.enemy.dummy) this.enemy.ai = new AI(o.enemy.diff ?? 0.3);
    if (o.player.ai) this.player.ai = new AI(o.player.ai);
    this.bots = [this.player, this.enemy];
    this.projectiles = []; this.particles = [];
    this.cam = { x: 700, y: 500, shake: 0 };
    this.pitOpen = false; this.result = null; this.endT = 0; this.slowmo = 0;
    this.hammerIdx = new Map();
    this.headless = !!o.headless;
    if (o.tutorial) {
      this.tut = { step: 0, dist: 0, beacons: [{ x: 520, y: 330 }, { x: 960, y: 300 }, { x: 1080, y: 720 }].map((b) => ({ ...b, got: false })), boosted: false, spikeTip: false };
      this.enemy.x = 1060; this.enemy.y = 480; this.enemy.invuln = true; this.enemy.team = 'dummy';
      this.player.minHp = 1;
      this.enemy.hidden = true;
    }
  }
  emit(type, data) { this.events(type, data); }
  other(b) { return b === this.player ? this.enemy : this.player; }

  start() { if (this.tut) this.emit('tut', { text: TUT_STEPS[0], step: 0 }); }

  hammerState(h) {
    const p = ((this.time + h.offset) % h.period + h.period) % h.period;
    return { warn: this.time > 1 && p > h.period - 0.9, slam: p < 0.3 && this.time > 1 ? 1 - p / 0.3 : 0, idx: Math.floor((this.time + h.offset) / h.period) };
  }
  nearestPit(x, y) {
    let best = null, bd = Infinity;
    for (const p of this.arena.pits) { const cx = p.x + p.w / 2, cy = p.y + p.h / 2; const d = hyp(cx - x, cy - y); if (d < bd) { bd = d; best = { x: cx, y: cy }; } }
    return best;
  }
  danger(x, y, b) {
    const A = this.arena, m = 26;
    if (x < m || y < m || x > WORLD.w - m || y > WORLD.h - m) return true;
    for (const p of A.pillars) if (hyp(x - p.x, y - p.y) < p.r + b.r) return true;
    for (const k of A.blocks) if (x > k.x - b.r && x < k.x + k.w + b.r && y > k.y - b.r && y < k.y + k.h + b.r) return true;
    const pitSoon = this.pitOpen || (A.pitOpen && this.time > A.pitOpen - 2);
    if (pitSoon) for (const p of A.pits) if (x > p.x - 20 && x < p.x + p.w + 20 && y > p.y - 20 && y < p.y + p.h + 20) return true;
    if (!b.st.hover) {
      for (const s of A.spikes) { const c = cyc(s, this.time); if ((c.on || c.f > 0.6) && x > s.x - 10 && x < s.x + s.w + 10 && y > s.y - 10 && y < s.y + s.h + 10) return true; }
      for (const v of A.vents) { const c = cyc(v, this.time); if ((c.on || c.f > 0.6) && hyp(x - v.x, y - v.y) < v.r + 14) return true; }
    }
    for (const s of A.saws) { const c = cyc(s, this.time); if ((c.on || c.f > 0.6) && hyp(x - s.x, y - s.y) < s.r + b.r + 16) return true; }
    for (const h of A.hammers) { const st = this.hammerState(h); if (st.warn && x > h.x && x < h.x + h.w && y > h.y && y < h.y + h.h) return true; }
    return false;
  }
  meleeCheck(b, slot, range, arc, t) {
    if (!t || !t.alive || t.hidden || t.air > 0.15) return false;
    const mp = b.mountPos(slot);
    const d = hyp(t.x - mp.x, t.y - mp.y);
    if (d - t.r > range + b.r * 0.25) return false;
    const ang = Math.abs(angDiff(b.a, Math.atan2(t.y - b.y, t.x - b.x)));
    return ang <= (arc / 2) * Math.PI / 180 + 0.18;
  }

  // ---------------- damage & effects
  damage(t, amt, src, o = {}) {
    if (!t.alive || amt <= 0 || t.hidden) return 0;
    if (t.invuln) { this.spark(t.x, t.y, 4, '#ffd23f'); return 0; }
    let crit = false;
    if (src && src.st.crit && o.kind !== 'hazard' && o.kind !== 'thorns' && Math.random() < src.st.crit) { amt *= 1.6; crit = true; }
    let a = amt, absorbed = 0;
    if (t.shield > 0 && o.kind !== 'burn') { absorbed = Math.min(t.shield, a); t.shield -= absorbed; a -= absorbed; t.shieldHit = 0.35; }
    t.shieldT = t.st.shieldDelay;
    a *= 1 - t.st.dr * (1 - (o.pierce || 0));
    t.hp -= a;
    if (t.minHp && t.hp < t.minHp) t.hp = t.minHp;
    t.flash = 0.12;
    const total = a + absorbed;
    if (src && src !== t) src.dmgDealt += total;
    if (!this.headless && total >= 0.5) this.text(t.x + (Math.random() - 0.5) * 20, t.y - t.r - 6, Math.round(total) + (crit ? '!' : ''), crit ? '#ffd23f' : absorbed > a ? '#8fdcff' : t === this.player ? '#ff6b8a' : '#ffffff', crit ? 1.3 : 1);
    if (o.kind === 'melee' && src && src !== t) {
      if (t.st.thorns) this.damage(src, total * t.st.thorns, t, { kind: 'thorns' });
      if (t.st.reactive) { const dx = src.x - t.x, dy = src.y - t.y, l = hyp(dx, dy) || 1; this.knock(src, dx / l, dy / l, t.st.reactive); this.ring(t.x, t.y, t.r * 2, '#ff9a3c'); }
    }
    const big = total > 14;
    if (t === this.player || src === this.player) {
      this.cam.shake = Math.max(this.cam.shake, Math.min(14, 2 + total * 0.35));
      this.emit('hit', { player: t === this.player, amount: total, big });
    }
    if (t.hp <= 0) this.kill(t, src);
    return total;
  }
  knock(t, nx, ny, force) {
    if (!t.alive) return;
    const f = force * (1 - t.st.kbRes) * Math.sqrt(40 / Math.max(20, t.st.weight));
    t.vx += nx * f; t.vy += ny * f; t.kbT = 0.35;
  }
  launch(t, nx, ny, force, air) {
    this.knock(t, nx, ny, force);
    const a = air * (1 - t.st.stunRes);
    if (a > 0.05) { t.air = Math.max(t.air, a); t.airMax = t.air; t.stun = Math.max(t.stun, t.air + 0.15); t.spinDir = Math.random() < 0.5 ? -1 : 1; }
  }
  kill(t, src) {
    if (!t.alive) return;
    t.alive = false; t.hp = 0;
    this.explode(t.x, t.y, 1.6);
    this.emit('sfx', { name: 'ko' });
    this.slowmo = 1.0;
    this.cam.shake = 18;
  }
  explode(x, y, s = 1) {
    if (this.headless) return;
    this.ring(x, y, 60 * s, '#ffd23f');
    for (let i = 0; i < 26 * s; i++) {
      const a = Math.random() * TAU, v = 80 + Math.random() * 320 * s;
      this.particles.push({ t: 'fire', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.5, max: 1, size: 6 + Math.random() * 10 * s });
    }
    for (let i = 0; i < 12 * s; i++) {
      const a = Math.random() * TAU, v = 60 + Math.random() * 260;
      this.particles.push({ t: 'debris', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1 + Math.random(), max: 2, size: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 20 });
    }
    for (let i = 0; i < 10 * s; i++) this.particles.push({ t: 'smoke', x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40, life: 1.4, max: 1.4, size: 16 + Math.random() * 20 });
  }
  spark(x, y, n = 8, color = '#ffe27a', speed = 1) {
    if (this.headless) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, v = (120 + Math.random() * 380) * speed;
      this.particles.push({ t: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.2 + Math.random() * 0.3, max: 0.5, color });
    }
  }
  ring(x, y, R, color) { if (!this.headless) this.particles.push({ t: 'ring', x, y, R, life: 0.35, max: 0.35, color }); }
  text(x, y, s, color, scale = 1) { this.particles.push({ t: 'text', x, y, s, color, life: 0.9, max: 0.9, vy: -60, scale }); }

  // ---------------- weapons
  hitMelee(b, w, t, dmg, kb, o = {}) {
    const dx = t.x - b.x, dy = t.y - b.y, l = hyp(dx, dy) || 1;
    const fx = Math.cos(b.a), fy = Math.sin(b.a);
    let nx = dx / l * 0.6 + fx * 0.4, ny = dy / l * 0.6 + fy * 0.4; const nl = hyp(nx, ny) || 1; nx /= nl; ny /= nl;
    const m = levelMult(w.lvl) * b.st.dmgMul;
    const dealt = this.damage(t, dmg * m, b, { kind: 'melee', pierce: o.pierce || w.def.pierce || 0 });
    if (o.air) this.launch(t, nx, ny, kb, o.air); else if (kb) this.knock(t, nx, ny, kb);
    const cx = (b.x + t.x) / 2, cy = (b.y + t.y) / 2;
    this.spark(cx, cy, Math.min(26, 6 + Math.round(dealt / 2)), o.color || '#ffe27a', 1 + Math.min(1, dealt / 30));
    if (dealt > 12) this.ring(cx, cy, 30 + dealt, 'rgba(255,255,255,0.8)');
    this.emit('sfx', { name: o.sfx || 'hit', vol: Math.min(1, 0.3 + dealt / 40), near: b === this.player || t === this.player });
    return dealt;
  }

  updateWeapons(b, dt, ctrl) {
    const t = this.other(b);
    const inp = b.input;
    for (const w of b.weapons) {
      const d = w.def; const held = ctrl && !!inp.fire[w.slot];
      w.cd = Math.max(0, w.cd - dt); w.hitCd -= dt; w.swing = Math.max(0, w.swing - dt);
      w.active = false;
      switch (d.kind) {
        case 'spin': {
          if (held) w.rpm = Math.min(1, w.rpm + dt / (d.spinup * b.st.cdMul)); else w.rpm = Math.max(0, w.rpm - dt * 0.3);
          w.spin += (2 + w.rpm * 38) * dt;
          if (w.rpm > 0.22 && w.hitCd <= 0 && this.meleeCheck(b, w.slot, d.range, d.arc, t)) {
            const e = w.rpm * w.rpm * 0.7 + w.rpm * 0.3;
            this.hitMelee(b, w, t, d.dmg * e, d.kb * e, { air: d.lift ? d.lift * w.rpm : 0, sfx: 'spinhit' });
            const rx = b.x - t.x, ry = b.y - t.y, rl = hyp(rx, ry) || 1;
            this.knock(b, rx / rl, ry / rl, d.kb * e * 0.35);
            w.rpm *= 0.45; w.hitCd = 0.25;
          }
          break;
        }
        case 'hammer': {
          if (held && w.cd <= 0 && w.wind <= 0) { w.wind = 0.2; this.emit('sfx', { name: 'whoosh', near: b === this.player }); }
          if (w.wind > 0) {
            w.wind -= dt;
            if (w.wind <= 0) {
              w.wind = 0; w.swing = 0.25; w.cd = d.cd * b.st.cdMul;
              const mp = b.mountPos(w.slot); const fx = Math.cos(b.a), fy = Math.sin(b.a);
              const hx = mp.x + fx * d.range * 0.7, hy = mp.y + fy * d.range * 0.7;
              if (this.meleeCheck(b, w.slot, d.range, d.arc, t)) this.hitMelee(b, w, t, d.dmg, 120, { sfx: 'slam', stun: 0.2 });
              else { this.spark(hx, hy, 5, '#aab4c3', 0.6); this.emit('sfx', { name: 'clank', vol: 0.4, near: b === this.player }); }
              if (b === this.player || t === this.player) this.cam.shake = Math.max(this.cam.shake, 5);
            }
          }
          break;
        }
        case 'flipper': {
          if (held && w.cd <= 0) {
            w.cd = d.cd * b.st.cdMul; w.swing = 0.3;
            this.emit('sfx', { name: 'flip', near: b === this.player });
            if (this.meleeCheck(b, w.slot, d.range, d.arc, t)) this.hitMelee(b, w, t, d.dmg, d.kb, { air: d.air, sfx: 'flip' });
          }
          break;
        }
        case 'saw': {
          if (held) {
            w.active = true; w.spin += dt * 30;
            if (w.hitCd <= 0 && this.meleeCheck(b, w.slot, d.range, d.arc, t)) {
              w.hitCd = 0.12;
              this.hitMelee(b, w, t, d.dps * 0.12, 30, { sfx: 'saw', color: d.style === 'plasma' ? '#ff5cf0' : '#ffe27a' });
            }
          } else w.spin += dt * 2;
          break;
        }
        case 'flame': {
          if (held && !w.over) {
            w.active = true; w.heat += dt / d.fuel;
            if (w.heat >= 1) { w.over = true; this.emit('sfx', { name: 'overheat', near: b === this.player }); }
            const mp = b.mountPos(w.slot); const a = b.a;
            if (!this.headless) for (let i = 0; i < 3; i++) {
              const sp = a + (Math.random() - 0.5) * (d.arc * Math.PI / 180), v = 260 + Math.random() * 160;
              this.particles.push({ t: 'fire', x: mp.x, y: mp.y, vx: Math.cos(sp) * v + b.vx, vy: Math.sin(sp) * v + b.vy, life: d.range / v, max: d.range / v, size: 5 + Math.random() * 6, grow: 3 });
            }
            w.tick -= dt;
            if (w.tick <= 0) {
              w.tick = 0.12;
              const dx = t.x - mp.x, dy = t.y - mp.y, dist = hyp(dx, dy);
              const ang = Math.abs(angDiff(a, Math.atan2(dy, dx)));
              if (t.alive && !t.hidden && dist < d.range + t.r && ang < (d.arc / 2) * Math.PI / 180 + 0.12) {
                this.damage(t, d.dps * 0.12 * levelMult(w.lvl) * b.st.dmgMul, b, { kind: 'flame' });
                t.burn = 2.2; t.burnDps = d.burn * levelMult(w.lvl); t.burnSrc = b;
              }
              this.emit('sfx', { name: 'flame', vol: 0.25, near: b === this.player });
            }
          } else {
            w.heat = Math.max(0, w.heat - dt * 0.35);
            if (w.over && w.heat < 0.35) w.over = false;
          }
          break;
        }
        case 'gun': {
          if (held && w.cd <= 0) {
            w.cd = (1 / d.rof) * b.st.cdMul; w.swing = 0.05;
            const mp = b.mountPos(w.slot); const a = b.a + (Math.random() - 0.5) * 0.08;
            this.projectiles.push({ k: 'nail', x: mp.x, y: mp.y, vx: Math.cos(a) * d.speed, vy: Math.sin(a) * d.speed, life: d.range / d.speed, owner: b, dmg: d.dmg * levelMult(w.lvl) * b.st.dmgMul, r: 3 });
            this.emit('sfx', { name: 'shoot', vol: 0.25, near: b === this.player });
          }
          break;
        }
        case 'rocket': {
          if (held && w.cd <= 0) {
            w.cd = d.cd * b.st.cdMul;
            const mp = b.mountPos(w.slot);
            this.projectiles.push({ k: 'rocket', x: mp.x, y: mp.y, a: b.a, v: d.speed * 0.5, vmax: d.speed, life: d.range / d.speed + 0.6, owner: b, dmg: d.dmg * levelMult(w.lvl) * b.st.dmgMul, radius: d.radius, kb: d.kb, r: 6, turn: 2.3 * b.st.homing, smoke: 0 });
            this.emit('sfx', { name: 'rocket', near: b === this.player });
          }
          break;
        }
        case 'emp': {
          if (held && w.cd <= 0) {
            w.cd = d.cd * b.st.cdMul;
            const mp = b.mountPos(w.slot);
            this.projectiles.push({ k: 'emp', x: mp.x, y: mp.y, vx: Math.cos(b.a) * d.speed, vy: Math.sin(b.a) * d.speed, life: d.range / d.speed, owner: b, dmg: d.dmg * levelMult(w.lvl) * b.st.dmgMul, stun: d.stun, r: 9 });
            this.emit('sfx', { name: 'zap', near: b === this.player });
          }
          break;
        }
        case 'rail': {
          if (held && w.cd <= 0 && w.wind <= 0) { w.wind = d.charge; this.emit('sfx', { name: 'charge', near: b === this.player }); }
          if (w.wind > 0) {
            w.wind -= dt;
            if (w.wind <= 0) {
              w.wind = 0; w.cd = d.cd * b.st.cdMul; w.swing = 0.1;
              const mp = b.mountPos(w.slot); const fx = Math.cos(b.a), fy = Math.sin(b.a);
              let len = d.range;
              if (t.alive && !t.hidden) {
                const rx = t.x - mp.x, ry = t.y - mp.y; const proj = rx * fx + ry * fy; const perp = Math.abs(rx * fy - ry * fx);
                if (proj > 0 && proj < d.range && perp < t.r + 10) {
                  this.damage(t, d.dmg * levelMult(w.lvl) * b.st.dmgMul, b, { kind: 'beam', pierce: d.pierce });
                  this.knock(t, fx, fy, d.kb); this.spark(t.x, t.y, 16, '#8cfff0', 1.4);
                }
              }
              this.particles.push({ t: 'beam', x: mp.x, y: mp.y, x2: mp.x + fx * len, y2: mp.y + fy * len, life: 0.3, max: 0.3, color: '#8cfff0' });
              this.knock(b, -fx, -fy, 160);
              this.emit('sfx', { name: 'rail', near: b === this.player });
              if (b === this.player) this.cam.shake = Math.max(this.cam.shake, 6);
            }
          }
          break;
        }
      }
    }
  }

  // ---------------- bot update
  updateBot(b, dt) {
    if (!b.alive) {
      if (b.fall != null) b.fall = Math.min(1, b.fall + dt * 1.4);
      b.vx *= Math.exp(-3 * dt); b.vy *= Math.exp(-3 * dt);
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (!this.headless && Math.random() < dt * 12 && b.fall == null) this.particles.push({ t: 'smoke', x: b.x, y: b.y, vx: 0, vy: -20, life: 1.2, max: 1.2, size: 14 });
      return;
    }
    const st = b.st;
    b.flash = Math.max(0, b.flash - dt); b.shieldHit = Math.max(0, b.shieldHit - dt);
    b.stun = Math.max(0, b.stun - dt); b.kbT = Math.max(0, b.kbT - dt); b.hazCd -= dt; b.ramCd -= dt;
    if (b.air > 0) { b.air -= dt; if (b.air <= 0) { b.air = 0; this.spark(b.x, b.y, 8, '#aab4c3', 0.6); this.emit('sfx', { name: 'clank', vol: 0.5, near: b === this.player }); } }
    const ctrl = this.state === 'fight' && b.stun <= 0 && b.air <= 0 && !b.hidden;
    const inp = b.input;

    let thrust = 0;
    if (ctrl && inp.mag > 0.08) {
      const ta = Math.atan2(inp.y, inp.x);
      const d = angDiff(b.a, ta);
      const mt = st.turn * dt;
      b.a += clamp(d, -mt, mt);
      const align = Math.cos(angDiff(b.a, ta));
      thrust = Math.min(1, inp.mag) * (0.25 + 0.75 * Math.max(0, align));
    }
    if (ctrl && inp.boost && b.boostCd <= 0) {
      b.boostT = 0.4; b.boostCd = st.boostCd;
      this.emit('sfx', { name: 'boost', near: b === this.player });
      if (b === this.player && this.tut) this.tut.boosted = true;
    }
    b.boostCd -= dt;
    const boosting = b.boostT > 0; b.boostT -= dt;

    const fx = Math.cos(b.a), fy = Math.sin(b.a);
    let fwd = b.vx * fx + b.vy * fy, lat = -b.vx * fy + b.vy * fx;
    const maxS = st.maxSpeed * (boosting ? 1 + 0.6 * st.boost : 1) * (b.burn > 0 ? 0.92 : 1);
    if (boosting) fwd += st.accel * 2.4 * st.boost * dt;
    else if (thrust > 0) fwd += st.accel * thrust * dt;
    const loose = b.air > 0 ? 0.4 : b.kbT > 0 || b.stun > 0 ? 1.6 : null;
    lat *= Math.exp(-(loose ?? 7 * st.grip) * dt);
    fwd *= Math.exp(-(loose ?? (thrust > 0 || boosting ? 0.3 : 2.4 * st.grip)) * dt);
    if (fwd > maxS) fwd = maxS + (fwd - maxS) * Math.exp(-6 * dt);
    if (fwd < -maxS * 0.7) fwd = -maxS * 0.7 + (fwd + maxS * 0.7) * Math.exp(-6 * dt);
    b.vx = fwd * fx - lat * fy; b.vy = fwd * fy + lat * fx;
    b.x += b.vx * dt; b.y += b.vy * dt;
    b.phase += fwd * dt / Math.max(8, b.r * 0.5);

    // regen
    if (st.regen && b.hp < b.maxHp) b.hp = Math.min(b.maxHp, b.hp + st.regen * dt);
    if (st.shieldCap) { b.shieldT -= dt; if (b.shieldT <= 0) b.shield = Math.min(st.shieldCap, b.shield + st.shieldRegen * dt); }
    if (b.burn > 0) {
      b.burn -= dt; b.burnTick -= dt;
      if (b.burnTick <= 0) { b.burnTick = 0.33; this.damage(b, b.burnDps * 0.33, b.burnSrc || null, { kind: 'burn' }); }
      if (!this.headless && Math.random() < dt * 20) this.particles.push({ t: 'fire', x: b.x + (Math.random() - 0.5) * b.r, y: b.y + (Math.random() - 0.5) * b.r, vx: 0, vy: -40, life: 0.4, max: 0.4, size: 5 });
    }
    this.updateWeapons(b, dt, ctrl);
    if (!this.headless && b.hp < b.maxHp * 0.3 && Math.random() < dt * 6) this.particles.push({ t: 'smoke', x: b.x, y: b.y, vx: (Math.random() - 0.5) * 20, vy: -30, life: 1, max: 1, size: 8 + Math.random() * 8 });
  }

  // ---------------- collisions
  collideWorld(b) {
    const A = this.arena;
    const bounce = (nx, ny) => {
      const vn = b.vx * nx + b.vy * ny;
      if (vn < 0) {
        b.vx -= 1.45 * vn * nx; b.vy -= 1.45 * vn * ny;
        if (-vn > 170) {
          this.spark(b.x - nx * b.r, b.y - ny * b.r, 6, '#9fb0c3', 0.7);
          this.emit('sfx', { name: 'clank', vol: Math.min(1, -vn / 500), near: b === this.player });
          if (-vn > 380 && b.kbT > 0) this.damage(b, (-vn - 380) * 0.04, this.other(b), { kind: 'wall' });
        }
      }
    };
    const r = b.r;
    if (b.x < r) { b.x = r; bounce(1, 0); }
    if (b.x > WORLD.w - r) { b.x = WORLD.w - r; bounce(-1, 0); }
    if (b.y < r) { b.y = r; bounce(0, 1); }
    if (b.y > WORLD.h - r) { b.y = WORLD.h - r; bounce(0, -1); }
    for (const p of A.pillars) {
      const dx = b.x - p.x, dy = b.y - p.y, d = hyp(dx, dy);
      if (d < p.r + r && d > 0) { const nx = dx / d, ny = dy / d; b.x = p.x + nx * (p.r + r); b.y = p.y + ny * (p.r + r); bounce(nx, ny); }
    }
    for (const k of A.blocks) {
      const cx = clamp(b.x, k.x, k.x + k.w), cy = clamp(b.y, k.y, k.y + k.h);
      const dx = b.x - cx, dy = b.y - cy, d = hyp(dx, dy);
      if (d < r) {
        let nx, ny;
        if (d > 0) { nx = dx / d; ny = dy / d; } else { nx = 0; ny = b.y < k.y + k.h / 2 ? -1 : 1; }
        b.x = cx + nx * r; b.y = cy + ny * r; bounce(nx, ny);
      }
    }
  }
  collideBots(a, b) {
    if (!a.alive || !b.alive || a.hidden || b.hidden || a.air > 0.1 || b.air > 0.1) return;
    const dx = b.x - a.x, dy = b.y - a.y, d = hyp(dx, dy), R = a.r + b.r;
    if (d >= R || d === 0) return;
    const nx = dx / d, ny = dy / d;
    const ma = a.st.weight * (1 + a.st.kbRes), mb = b.st.weight * (1 + b.st.kbRes);
    const pen = R - d;
    a.x -= nx * pen * (mb / (ma + mb)); a.y -= ny * pen * (mb / (ma + mb));
    b.x += nx * pen * (ma / (ma + mb)); b.y += ny * pen * (ma / (ma + mb));
    const sa = a.vx * nx + a.vy * ny, sb = -(b.vx * nx + b.vy * ny);
    const rel = sa + sb;
    if (rel > 0) {
      const j = (1.35 * rel) / (1 / ma + 1 / mb);
      a.vx -= (j / ma) * nx; a.vy -= (j / ma) * ny;
      b.vx += (j / mb) * nx; b.vy += (j / mb) * ny;
      if (a.ramCd <= 0 && b.ramCd <= 0 && rel > 110) {
        a.ramCd = b.ramCd = 0.4;
        const dmgToB = Math.max(0, sa - 110) * 0.05 * a.st.ram + a.st.contact;
        const dmgToA = Math.max(0, sb - 110) * 0.05 * b.st.ram + b.st.contact;
        if (dmgToB > 0.5) this.damage(b, dmgToB, a, { kind: 'ram' });
        if (dmgToA > 0.5) this.damage(a, dmgToA, b, { kind: 'ram' });
        this.spark(a.x + nx * a.r, a.y + ny * a.r, 6 + Math.round(rel / 60), '#cfd7e2', 0.8);
        this.emit('sfx', { name: 'clank', vol: Math.min(1, rel / 400), near: true });
      }
    }
  }
  hazards(b, dt) {
    if (!b.alive || b.hidden) return;
    const A = this.arena, t = this.time;
    const grounded = b.air <= 0;
    if (grounded && !b.st.hover) {
      for (const s of A.spikes) {
        if (!cyc(s, t).on) continue;
        if (b.x > s.x - b.r * 0.4 && b.x < s.x + s.w + b.r * 0.4 && b.y > s.y - b.r * 0.4 && b.y < s.y + s.h + b.r * 0.4 && b.hazCd <= 0) {
          b.hazCd = 0.35; this.damage(b, 9, null, { kind: 'hazard' });
          const a = Math.random() * TAU; this.knock(b, Math.cos(a), Math.sin(a), 120); this.spark(b.x, b.y, 6, '#ff4d6d');
          this.emit('sfx', { name: 'spike', near: b === this.player });
          if (this.tut && b === this.player && !this.tut.spikeTip) { this.tut.spikeTip = true; this.emit('toast', 'Ouch! Spike strips hurt. Steer clear of hazards.'); }
        }
      }
      for (const v of A.vents) {
        if (!cyc(v, t).on) continue;
        if (hyp(b.x - v.x, b.y - v.y) < v.r + b.r * 0.3 && b.hazCd <= 0) {
          b.hazCd = 0.3; this.damage(b, 6, null, { kind: 'hazard' }); b.burn = 1.5; b.burnDps = 8; b.burnSrc = null;
        }
      }
    }
    if (grounded || b.air < 0.2) {
      for (const s of A.saws) {
        const c = cyc(s, t); if (!c.on) continue;
        const up = Math.min(1, c.f * 6, (1 - c.f) * 6); if (up < 0.3) continue;
        const dx = b.x - s.x, dy = b.y - s.y, d = hyp(dx, dy) || 1;
        if (d < s.r * up + b.r && b.hazCd <= 0) {
          b.hazCd = 0.3; this.damage(b, 15, null, { kind: 'hazard' }); this.knock(b, dx / d, dy / d, 380);
          this.spark(s.x + dx / d * s.r, s.y + dy / d * s.r, 14, '#ffe27a', 1.2); this.emit('sfx', { name: 'saw', vol: 0.9, near: b === this.player });
        }
      }
    }
    for (const h of A.hammers) {
      const st = this.hammerState(h);
      const last = this.hammerIdx.get(h);
      if (st.slam > 0.9 && last !== st.idx) {
        this.hammerIdx.set(h, st.idx);
        this.emit('sfx', { name: 'slam', vol: 1, near: true }); this.cam.shake = Math.max(this.cam.shake, 8);
        for (const bb of this.bots) if (bb.alive && !bb.hidden && bb.x > h.x && bb.x < h.x + h.w && bb.y > h.y && bb.y < h.y + h.h) {
          this.damage(bb, 32, null, { kind: 'hazard' }); bb.stun = Math.max(bb.stun, 0.6 * (1 - bb.st.stunRes)); this.spark(bb.x, bb.y, 20, '#ffffff', 1.3);
        }
      }
    }
    if (this.pitOpen && grounded) {
      for (const p of A.pits) {
        if (b.x > p.x && b.x < p.x + p.w && b.y > p.y && b.y < p.y + p.h) {
          if (b.st.anchor && !b.anchorUsed) {
            b.anchorUsed = true;
            const cx = p.x + p.w / 2, cy = p.y + p.h / 2; let dx = b.x - cx, dy = b.y - cy; const l = hyp(dx, dy) || 1; dx /= l; dy /= l;
            b.x = cx + dx * (p.w * 0.75 + b.r); b.y = cy + dy * (p.h * 0.75 + b.r); b.vx = dx * 300; b.vy = dy * 300; b.kbT = 0.4;
            this.damage(b, 20, null, { kind: 'hazard' }); this.ring(b.x, b.y, 50, '#b86bff');
            this.emit('toast', b === this.player ? 'Anchor Magnet saved you!' : 'Enemy Anchor Magnet activated!');
          } else {
            b.alive = false; b.fall = 0; b.hp = 0; b.pitted = true;
            b.vx *= 0.3; b.vy *= 0.3;
            const cx = p.x + p.w / 2, cy = p.y + p.h / 2; b.vx += (cx - b.x) * 2; b.vy += (cy - b.y) * 2;
            this.emit('sfx', { name: 'fall', near: true }); this.slowmo = 1.0;
            this.text(b.x, b.y - 30, 'PITTED!', '#ffd23f', 1.5);
          }
          break;
        }
      }
    }
  }
  updateProjectiles(dt) {
    const A = this.arena;
    for (const p of this.projectiles) {
      const t = this.other(p.owner);
      if (p.k === 'rocket') {
        if (t.alive && !t.hidden) { const da = angDiff(p.a, Math.atan2(t.y - p.y, t.x - p.x)); p.a += clamp(da, -p.turn * dt, p.turn * dt); }
        p.v = Math.min(p.vmax, p.v + p.vmax * 1.5 * dt);
        p.vx = Math.cos(p.a) * p.v; p.vy = Math.sin(p.a) * p.v;
        p.smoke -= dt;
        if (p.smoke <= 0 && !this.headless) { p.smoke = 0.03; this.particles.push({ t: 'smoke', x: p.x, y: p.y, vx: 0, vy: 0, life: 0.5, max: 0.5, size: 5 }); }
      }
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      let dead = p.life <= 0;
      if (p.x < 0 || p.y < 0 || p.x > WORLD.w || p.y > WORLD.h) dead = true;
      for (const q of A.pillars) if (hyp(p.x - q.x, p.y - q.y) < q.r) dead = true;
      for (const k of A.blocks) if (p.x > k.x && p.x < k.x + k.w && p.y > k.y && p.y < k.y + k.h) dead = true;
      let hit = false;
      if (!dead && t.alive && !t.hidden && t.air < 0.3 && hyp(p.x - t.x, p.y - t.y) < t.r + p.r) { hit = true; dead = true; }
      if (dead) {
        p.dead = true;
        if (p.k === 'rocket') {
          this.explode(p.x, p.y, 0.7); this.emit('sfx', { name: 'boom', near: true });
          for (const b of this.bots) {
            if (!b.alive || b.hidden) continue;
            const d = hyp(b.x - p.x, b.y - p.y);
            if (d < p.radius + b.r) {
              const f = 1 - Math.max(0, d - b.r) / p.radius;
              this.damage(b, p.dmg * (b === p.owner ? 0.3 : 1) * (0.4 + 0.6 * f), p.owner, { kind: 'blast' });
              const l = d || 1; this.knock(b, (b.x - p.x) / l, (b.y - p.y) / l, p.kb * f);
            }
          }
          if (p.owner === this.player || t === this.player) this.cam.shake = Math.max(this.cam.shake, 9);
        } else if (hit && p.k === 'nail') {
          this.damage(t, p.dmg, p.owner, { kind: 'proj' }); this.spark(p.x, p.y, 3, '#ffe27a', 0.6);
          this.knock(t, p.vx / 600, p.vy / 600, 30);
          this.emit('sfx', { name: 'tick', vol: 0.3, near: true });
        } else if (hit && p.k === 'emp') {
          t.shield = 0; t.shieldT = t.st.shieldDelay + 1;
          this.damage(t, p.dmg, p.owner, { kind: 'proj' });
          t.stun = Math.max(t.stun, p.stun * (1 - t.st.stunRes));
          this.ring(p.x, p.y, 50, '#6ec8ff'); this.spark(p.x, p.y, 14, '#6ec8ff');
          this.emit('sfx', { name: 'zap', near: true });
        } else if (p.k === 'emp') this.ring(p.x, p.y, 24, '#6ec8ff');
      }
    }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  }
  updateParticles(dt) {
    for (const p of this.particles) {
      p.life -= dt;
      if (p.vx != null) { p.x += p.vx * dt; p.y += (p.vy || 0) * dt; }
      if (p.t === 'spark' || p.t === 'debris') { p.vx *= Math.exp(-4 * dt); p.vy *= Math.exp(-4 * dt); }
      if (p.t === 'fire') { p.vx *= Math.exp(-2 * dt); p.vy *= Math.exp(-2 * dt); if (p.grow) p.size += p.grow * dt * 10; }
      if (p.t === 'debris') p.rot += p.vr * dt;
      if (p.t === 'text') p.vy *= Math.exp(-3 * dt);
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    if (this.particles.length > 900) this.particles.splice(0, this.particles.length - 900);
  }

  // ---------------- tutorial
  updateTutorial(dt) {
    const T = this.tut, p = this.player;
    if (!T) return;
    if (T.step === 0) {
      T.dist += hyp(p.vx, p.vy) * dt;
      if (T.dist > 320) this.tutNext();
    } else if (T.step === 1) {
      for (const b of T.beacons) if (!b.got && hyp(b.x - p.x, b.y - p.y) < 40 + p.r) { b.got = true; this.ring(b.x, b.y, 60, '#3ff0ff'); this.emit('sfx', { name: 'beacon' }); }
      if (T.beacons.every((b) => b.got)) this.tutNext();
    } else if (T.step === 2) {
      if (T.boosted) this.tutNext();
    } else if (T.step === 3) {
      if (!this.enemy.alive) T.step = 4;
    }
  }
  tutNext() {
    const T = this.tut; T.step++;
    if (T.step === 3) { this.enemy.hidden = false; this.enemy.invuln = false; this.ring(this.enemy.x, this.enemy.y, 80, '#ffd23f'); }
    this.emit('sfx', { name: 'beacon' });
    this.emit('tut', { text: TUT_STEPS[T.step], step: T.step });
  }

  // ---------------- main loop
  update(dt) {
    if (this.state === 'over') { this.updateParticles(dt); return; }
    if (this.slowmo > 0) { this.slowmo -= dt; dt *= 0.3; }
    if (this.state === 'countdown') {
      this.countdown -= dt;
      const c = Math.ceil(this.countdown);
      if (c !== this.lastCount && c > 0 && !this.tut) { this.lastCount = c; this.emit('count', c); }
      if (this.countdown <= 0) { this.state = 'fight'; if (!this.tut) this.emit('count', 0); }
      for (const b of this.bots) { b.input.mag = 0; this.updateBot(b, dt); }
      this.updateParticles(dt); this.updateCamera(dt, true);
      return;
    }
    if (this.state === 'fight') this.time += dt;
    if (this.arena.pitOpen && !this.pitOpen && this.time >= this.arena.pitOpen) {
      this.pitOpen = true; this.emit('toast', 'THE PIT IS OPEN!'); this.emit('sfx', { name: 'alarm' }); this.cam.shake = 6;
    }
    for (const b of this.bots) if (b.ai) b.ai.update(b, this.other(b), this, dt);
    if (this.state === 'ending') for (const b of this.bots) { b.input.mag = 0; b.input.fire = [false, false, false]; }
    for (const b of this.bots) this.updateBot(b, dt);
    this.collideBots(this.player, this.enemy);
    for (const b of this.bots) { if (b.alive || b.fall == null) this.collideWorld(b); this.hazards(b, dt); }
    this.updateProjectiles(dt);
    this.updateParticles(dt);
    this.updateTutorial(dt);
    this.updateCamera(dt);
    this.checkEnd(dt);
  }
  checkEnd(dt) {
    if (this.state === 'fight') {
      let res = null;
      if (!this.player.alive) res = { win: false, how: this.player.pitted ? 'pit' : 'ko' };
      else if (!this.enemy.alive) res = { win: true, how: this.enemy.pitted ? 'pit' : 'ko' };
      else if (this.time >= this.duration) {
        const pd = this.player.dmgDealt, ed = this.enemy.dmgDealt;
        res = { win: pd >= ed, how: 'decision' };
        this.emit('toast', 'TIME! Judges\' decision...');
      }
      if (this.tut && this.tut.step >= 4) res = { win: true, how: 'ko', tutorial: true };
      if (res) {
        res.time = this.time; res.dmgDealt = Math.round(this.player.dmgDealt); res.dmgTaken = Math.round(this.enemy.dmgDealt);
        res.hpLeft = Math.max(0, this.player.hp / this.player.maxHp);
        this.result = res; this.state = 'ending'; this.endT = 2.0;
        this.emit('sfx', { name: res.win ? 'win' : 'lose' });
      }
    } else if (this.state === 'ending') {
      this.endT -= dt;
      if (this.endT <= 0) { this.state = 'over'; this.emit('end', this.result); }
    }
  }

  // ---------------- camera & drawing
  zoomFor(w, h) { return Math.max(0.5, Math.min(w, h) / 420, Math.max(w, h) / 1150); }
  updateCamera(dt, snap = false) {
    const p = this.player, e = this.enemy;
    let tx = p.x, ty = p.y;
    if (e.alive && !e.hidden) { tx += (e.x - p.x) * 0.35; ty += (e.y - p.y) * 0.35; }
    const k = snap ? 1 : 1 - Math.exp(-5 * dt);
    this.cam.x += (tx - this.cam.x) * k; this.cam.y += (ty - this.cam.y) * k;
    this.cam.shake = Math.max(0, this.cam.shake - dt * 30);
  }
  view(b) {
    return {
      build: b.build, x: b.x, y: b.y, a: b.a, r: b.r, team: b.team, ws: b.weapons,
      shieldFrac: b.st.shieldCap ? b.shield / b.st.shieldCap : 0, shieldHit: b.shieldHit, flash: b.flash,
      boosting: b.boostT > 0, air: b.air, airMax: b.airMax, stun: b.stun, phase: b.phase, burn: b.burn,
      fall: b.fall, spinDir: b.spinDir,
    };
  }
  draw(ctx, w, h) {
    const z = this.zoomFor(w, h);
    const hw = w / 2 / z, hh = h / 2 / z;
    let cx = this.cam.x, cy = this.cam.y;
    cx = hw * 2 >= WORLD.w + 80 ? WORLD.w / 2 : clamp(cx, hw - 40, WORLD.w - hw + 40);
    cy = hh * 2 >= WORLD.h + 80 ? WORLD.h / 2 : clamp(cy, hh - 40, WORLD.h - hh + 40);
    const sh = this.cam.shake * (this.o.shake ?? 1);
    const sx = (Math.random() - 0.5) * sh, sy = (Math.random() - 0.5) * sh;
    ctx.fillStyle = '#05070b'; ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2); ctx.scale(z, z); ctx.translate(-cx + sx, -cy + sy);
    drawArena(ctx, this);

    if (this.tut && this.tut.step === 1) {
      const t = performance.now() / 1000;
      for (const b of this.tut.beacons) {
        if (b.got) continue;
        ctx.beginPath(); ctx.arc(b.x, b.y, 30 + Math.sin(t * 4) * 5, 0, TAU);
        ctx.strokeStyle = '#3ff0ff'; ctx.lineWidth = 4; ctx.shadowColor = '#3ff0ff'; ctx.shadowBlur = 20; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(b.x, b.y, 10, 0, TAU); ctx.fillStyle = 'rgba(63,240,255,0.6)'; ctx.fill();
      }
    }
    // smoke underlay
    for (const p of this.particles) if (p.t === 'smoke') {
      const f = p.life / p.max; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1.6 - f * 0.6), 0, TAU);
      ctx.fillStyle = `rgba(60,64,72,${f * 0.35})`; ctx.fill();
    }
    // falling bots under others
    const order = [...this.bots].sort((a, b) => (a.fall != null ? -1 : 0) - (b.fall != null ? -1 : 0) || a.air - b.air);
    for (const b of order) {
      if (b.hidden) continue;
      if (!b.alive && b.fall == null) {
        drawBot(ctx, { ...this.view(b), team: b.team }, { glow: false });
        ctx.save(); ctx.translate(b.x, b.y); ctx.beginPath(); ctx.arc(0, 0, b.r * 1.3, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fill(); ctx.restore();
      } else drawBot(ctx, this.view(b));
    }
    // projectiles
    for (const p of this.projectiles) {
      if (p.k === 'nail') { ctx.strokeStyle = '#ffe27a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02); ctx.stroke(); }
      else if (p.k === 'rocket') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = '#dfe4ea'; ctx.fillRect(-8, -3, 14, 6); ctx.fillStyle = '#ff4d4d'; ctx.beginPath(); ctx.moveTo(6, -3); ctx.lineTo(11, 0); ctx.lineTo(6, 3); ctx.fill();
        ctx.fillStyle = `rgba(255,200,80,${0.6 + Math.random() * 0.4})`; ctx.beginPath(); ctx.moveTo(-8, -3); ctx.lineTo(-16 - Math.random() * 6, 0); ctx.lineTo(-8, 3); ctx.fill();
        ctx.restore();
      } else if (p.k === 'emp') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16); g.addColorStop(0, 'rgba(220,245,255,1)'); g.addColorStop(1, 'rgba(110,200,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, TAU); ctx.fill();
      }
    }
    // particles
    for (const p of this.particles) {
      const f = Math.max(0, p.life / p.max);
      switch (p.t) {
        case 'spark': ctx.strokeStyle = p.color; ctx.globalAlpha = f * 1.5; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); ctx.stroke(); ctx.globalAlpha = 1; break;
        case 'fire': { const c = f > 0.6 ? '255,240,180' : f > 0.3 ? '255,140,40' : '200,50,20'; ctx.fillStyle = `rgba(${c},${Math.min(1, f * 1.4)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.6 + (1 - f) * 0.8), 0, TAU); ctx.fill(); break; }
        case 'debris': ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = `rgba(150,160,175,${f})`; ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66); ctx.restore(); break;
        case 'ring': ctx.strokeStyle = p.color; ctx.globalAlpha = f; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, p.R * (1.2 - f), 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; break;
        case 'beam': ctx.strokeStyle = p.color; ctx.globalAlpha = f; ctx.lineWidth = 8 * f + 2; ctx.shadowColor = p.color; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x2, p.y2); ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; break;
        case 'text': ctx.globalAlpha = Math.min(1, f * 2); ctx.fillStyle = p.color; ctx.font = `800 ${Math.round(18 * p.scale)}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.strokeText(p.s, p.x, p.y); ctx.fillText(p.s, p.x, p.y); ctx.globalAlpha = 1; break;
      }
    }
    ctx.restore();

    // off-screen enemy indicator
    const e = this.enemy;
    if (e.alive && !e.hidden) {
      const ex = (e.x - cx) * z + w / 2, ey = (e.y - cy) * z + h / 2;
      const m = 30;
      if (ex < 0 || ey < 0 || ex > w || ey > h) {
        const ix = clamp(ex, m, w - m), iy = clamp(ey, m + 60, h - m);
        const a = Math.atan2(ey - h / 2, ex - w / 2);
        ctx.save(); ctx.translate(ix, iy); ctx.rotate(a);
        ctx.fillStyle = TEAM[e.team].accent; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-8, -9); ctx.lineTo(-3, 0); ctx.lineTo(-8, 9); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
  }
}

// Weapon status for HUD buttons
export function weaponStatus(w) {
  const d = w.def;
  switch (d.kind) {
    case 'spin': return { frac: w.rpm, ready: w.rpm > 0.9, label: `${Math.round(w.rpm * 100)}%` };
    case 'flame': return { frac: 1 - w.heat, ready: !w.over, label: w.over ? 'HOT' : '' };
    case 'saw': return { frac: 1, ready: true, label: '' };
    default: {
      const max = (d.kind === 'gun' ? 1 / d.rof : d.cd) || 1;
      return { frac: 1 - Math.min(1, w.cd / max), ready: w.cd <= 0, label: '' };
    }
  }
}
