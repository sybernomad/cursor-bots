// Cursor Bots — procedural drawing of bots, parts and arenas. No image assets.
import { PART, RARITY, WORLD } from './data.js';

const TAU = Math.PI * 2;

// Frame silhouettes, nose pointing +x, unit radius.
export const SHAPES = {
  arrow:   [[1.1, 0], [-0.8, -0.78], [-0.42, 0], [-0.8, 0.78]],
  box:     [[0.95, 0], [0.62, -0.72], [-0.82, -0.72], [-0.6, 0], [-0.82, 0.72], [0.62, 0.72]],
  wedge:   [[1.05, 0], [-0.78, -0.98], [-0.62, 0], [-0.78, 0.98]],
  stinger: [[1.4, 0], [-0.25, -0.46], [-0.9, -0.74], [-0.58, 0], [-0.9, 0.74], [-0.25, 0.46]],
  hex:     [[1.05, 0], [0.52, -0.88], [-0.52, -0.88], [-1.0, 0], [-0.52, 0.88], [0.52, 0.88]],
  talon:   [[1.25, 0], [0.22, -0.42], [-0.2, -1.0], [-0.72, -0.62], [-0.48, 0], [-0.72, 0.62], [-0.2, 1.0], [0.22, 0.42]],
  titan:   [[1.12, 0], [0.72, -0.62], [0.1, -0.96], [-0.92, -0.86], [-0.68, 0], [-0.92, 0.86], [0.1, 0.96], [0.72, 0.62]],
  scuttle: [[1.0, 0], [0.4, -0.62], [-0.7, -0.82], [-0.92, -0.3], [-0.92, 0.3], [-0.7, 0.82], [0.4, 0.62]],
  ram:     [[1.0, -0.4], [1.0, 0.4], [0.5, 0.88], [-0.85, 0.88], [-0.6, 0], [-0.85, -0.88], [0.5, -0.88]],
  viper:   [[1.3, 0], [0.5, -0.3], [-0.3, -0.75], [-1.0, -0.55], [-0.7, 0], [-1.0, 0.55], [-0.3, 0.75], [0.5, 0.3]],
  bastion: [[1.0, 0.42], [1.0, -0.42], [0.45, -0.96], [-0.45, -0.96], [-1.0, -0.45], [-1.0, 0.45], [-0.45, 0.96], [0.45, 0.96]],
  manta:   [[1.15, 0], [0.3, -0.5], [-0.1, -1.1], [-0.55, -0.95], [-0.85, -0.2], [-0.85, 0.2], [-0.55, 0.95], [-0.1, 1.1], [0.3, 0.5]],
  colossus:[[1.1, 0], [0.8, -0.5], [0.5, -0.96], [-0.3, -1.0], [-0.95, -0.72], [-0.75, 0], [-0.95, 0.72], [-0.3, 1.0], [0.5, 0.96], [0.8, 0.5]],
  phantom: [[1.35, 0], [0.0, -0.34], [-0.4, -1.05], [-0.56, -0.3], [-0.92, 0], [-0.56, 0.3], [-0.4, 1.05], [0.0, 0.34]],
};

export const TEAM = {
  player: { accent: '#3ff0ff', glow: 'rgba(63,240,255,0.55)', body: '#16202e', body2: '#233246' },
  enemy:  { accent: '#ff4d7a', glow: 'rgba(255,77,122,0.55)', body: '#24141c', body2: '#3a1e2a' },
  boss:   { accent: '#ffb23f', glow: 'rgba(255,178,63,0.6)', body: '#261c10', body2: '#3d2c15' },
  dummy:  { accent: '#ffd23f', glow: 'rgba(255,210,63,0.4)', body: '#2a2a2a', body2: '#3a3a3a' },
};

const ARMOR_LOOK = {
  steel:     { fill: '#5b6574', edge: '#8e99a8' },
  rubber:    { fill: '#2a2a2e', edge: '#55555c' },
  titanium:  { fill: '#6d7f95', edge: '#b4c6dc' },
  spiked:    { fill: '#4a4f58', edge: '#c9ced6', spikes: true },
  ceramic:   { fill: '#c9c2b3', edge: '#efe9dc' },
  composite: { fill: '#2f3b2f', edge: '#7fa07f' },
  neutron:   { fill: '#2a2140', edge: '#a98bff', glow: '#8a6bff' },
  reactive:  { fill: '#4a2a1a', edge: '#ff9a3c', glow: '#ff7a1a' },
  scrap:     { fill: '#4a3f33', edge: '#8a7a62' },
  kevlar:    { fill: '#3a3a22', edge: '#c8c27a' },
  bulk:      { fill: '#3c4450', edge: '#6f7b8c' },
  mirror:    { fill: '#9fb6c8', edge: '#f2fbff', glow: '#cfefff', spikes: true },
  dragon:    { fill: '#3a1220', edge: '#ff5a7a', glow: '#ff2a5a', spikes: true },
};

function poly(ctx, pts, sx, sy = sx) {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (i === 0) ctx.moveTo(x * sx, y * sy); else ctx.lineTo(x * sx, y * sy);
  }
  ctx.closePath();
}

function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function wheelPositions(frame) {
  const n = frame.slots.wheel;
  const per = Math.max(1, Math.round(n / 2));
  const xs = per === 1 ? [-0.18] : per === 2 ? [-0.52, 0.34] : [-0.62, -0.12, 0.38];
  const out = [];
  for (const x of xs) { out.push([x, -frame.wy]); out.push([x, frame.wy]); }
  return out.slice(0, n);
}

export function weaponMount(frame, slot) {
  if (slot === 0) return { x: frame.nose, y: 0, s: 1 };
  const side = slot === 1 ? -1 : 1;
  return { x: 0.12, y: side * (frame.wy + 0.08), s: 0.72 };
}

// --------------------------------------------------------------------------
// Wheels
// --------------------------------------------------------------------------
function drawWheel(ctx, style, r, phase) {
  ctx.save();
  switch (style) {
    case 'tread': {
      const L = r * 0.95, W = r * 0.3;
      rrect(ctx, -L / 2, -W / 2, L, W, W * 0.35); ctx.fillStyle = '#15171c'; ctx.fill();
      ctx.strokeStyle = '#3a3f4a'; ctx.lineWidth = Math.max(1, r * 0.04); ctx.stroke();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = '#4a505c'; ctx.lineWidth = Math.max(1, r * 0.05);
      const step = r * 0.14, off = ((phase * r * 0.5) % step + step) % step;
      for (let x = -L / 2 - step + off; x < L / 2 + step; x += step) { ctx.beginPath(); ctx.moveTo(x, -W / 2); ctx.lineTo(x, W / 2); ctx.stroke(); }
      ctx.restore();
      break;
    }
    case 'omni': {
      const R = r * 0.22;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = '#1a1d24'; ctx.fill();
      ctx.strokeStyle = '#7f8aa0'; ctx.lineWidth = Math.max(1, r * 0.035); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = phase * 0.6 + (i / 6) * TAU;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.68, Math.sin(a) * R * 0.68, R * 0.22, 0, TAU);
        ctx.fillStyle = '#9fb0c3'; ctx.fill();
      }
      break;
    }
    case 'mag': {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.32);
      g.addColorStop(0, 'rgba(120,240,255,0.9)'); g.addColorStop(1, 'rgba(120,240,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.38, r * 0.24, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.24, r * 0.13, 0, 0, TAU); ctx.fillStyle = '#1b2a33'; ctx.fill();
      ctx.strokeStyle = '#7ff3ff'; ctx.lineWidth = Math.max(1, r * 0.04); ctx.stroke();
      break;
    }
    case 'turbine': {
      const R = r * 0.25;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = '#1d1a12'; ctx.fill();
      ctx.strokeStyle = '#ffb23f'; ctx.lineWidth = Math.max(1, r * 0.04); ctx.stroke();
      ctx.save(); ctx.rotate(phase * 1.4);
      ctx.fillStyle = '#d9a64a';
      for (let i = 0; i < 5; i++) {
        ctx.rotate(TAU / 5);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(R * 0.5, -R * 0.5, R * 0.85, -R * 0.1); ctx.lineTo(R * 0.4, R * 0.1); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      break;
    }
    default: {
      const L = r * 0.56, W = r * 0.26;
      rrect(ctx, -L / 2, -W / 2, L, W, W * 0.4); ctx.fillStyle = '#16181d'; ctx.fill();
      ctx.strokeStyle = '#3d424d'; ctx.lineWidth = Math.max(1, r * 0.04); ctx.stroke();
      ctx.save(); ctx.clip();
      const step = r * (style === 'knobby' ? 0.11 : 0.16);
      const off = ((phase * r * 0.5) % step + step) % step;
      ctx.strokeStyle = style === 'knobby' ? '#5b6170' : '#353a44';
      ctx.lineWidth = Math.max(1, r * (style === 'knobby' ? 0.06 : 0.03));
      for (let x = -L / 2 - step + off; x < L / 2 + step; x += step) { ctx.beginPath(); ctx.moveTo(x, -W / 2); ctx.lineTo(x, W / 2); ctx.stroke(); }
      ctx.restore();
      if (style === 'spiked') {
        ctx.fillStyle = '#d0d6df';
        for (let i = -1; i <= 1; i++) {
          for (const s of [-1, 1]) {
            ctx.beginPath(); ctx.moveTo(i * L * 0.3 - r * 0.05, s * W / 2); ctx.lineTo(i * L * 0.3, s * (W / 2 + r * 0.13)); ctx.lineTo(i * L * 0.3 + r * 0.05, s * W / 2); ctx.fill();
          }
        }
      }
      // hub
      ctx.beginPath(); ctx.arc(0, 0, W * 0.22, 0, TAU); ctx.fillStyle = '#7d8696'; ctx.fill();
    }
  }
  ctx.restore();
}

// --------------------------------------------------------------------------
// Weapons (local space: +x forward from mount)
// --------------------------------------------------------------------------
function metal(ctx, x0, y0, x1, y1, a = '#c8d2de', b = '#6b7686') {
  const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g;
}

export function drawWeapon(ctx, def, ws, r, accent) {
  const rpm = ws ? ws.rpm || 0 : 0;
  const spin = ws ? ws.spin || 0 : 0;
  const swing = ws ? ws.swing || 0 : 0;
  const wind = ws ? ws.wind || 0 : 0;
  const active = ws ? ws.active : false;
  ctx.save();
  switch (def.style) {
    case 'bar': {
      ctx.translate(r * 0.22, 0);
      if (rpm > 0.15) {
        ctx.beginPath(); ctx.arc(0, 0, r * 0.86, 0, TAU);
        ctx.fillStyle = `rgba(200,220,255,${0.12 + rpm * 0.22})`; ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${rpm * 0.5})`; ctx.lineWidth = r * 0.05; ctx.stroke();
      }
      ctx.rotate(spin);
      rrect(ctx, -r * 0.86, -r * 0.1, r * 1.72, r * 0.2, r * 0.06);
      ctx.fillStyle = metal(ctx, 0, -r * 0.1, 0, r * 0.1); ctx.fill();
      ctx.fillStyle = accent; ctx.fillRect(r * 0.62, -r * 0.1, r * 0.24, r * 0.2); ctx.fillRect(-r * 0.86, -r * 0.1, r * 0.24, r * 0.2);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, TAU); ctx.fillStyle = '#222'; ctx.fill();
      break;
    }
    case 'drum': {
      const w = r * 0.42, h = r * 1.08;
      rrect(ctx, 0, -h / 2, w, h, r * 0.12); ctx.fillStyle = metal(ctx, 0, 0, w, 0, '#d6dde6', '#596474'); ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = rpm > 0.4 ? `rgba(255,255,255,${0.3 + rpm * 0.4})` : '#2f3540'; ctx.lineWidth = r * 0.07;
      const st = r * 0.22, off = (spin * r * 0.3) % st;
      for (let y = -h / 2 - st + off; y < h / 2 + st; y += st) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = accent; ctx.fillRect(-r * 0.06, -h / 2, r * 0.06, h);
      break;
    }
    case 'disc': {
      ctx.translate(r * 0.42, 0);
      const R = r * 0.62;
      if (rpm > 0.15) { ctx.beginPath(); ctx.arc(0, 0, R * 1.08, 0, TAU); ctx.fillStyle = `rgba(255,255,255,${rpm * 0.18})`; ctx.fill(); }
      ctx.rotate(spin);
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU, a2 = a + TAU / 32;
        ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.lineTo(Math.cos(a2) * R * 0.86, Math.sin(a2) * R * 0.86);
      }
      ctx.closePath(); ctx.fillStyle = metal(ctx, -R, -R, R, R, '#e5ebf2', '#6a7584'); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, R * 0.36, 0, TAU); ctx.fillStyle = '#1a1e26'; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, R * 0.18, 0, TAU); ctx.fillStyle = accent; ctx.fill();
      break;
    }
    case 'vertical': {
      const L = r * 0.75;
      ctx.fillStyle = '#2a2f38'; ctx.fillRect(-r * 0.1, -r * 0.34, r * 0.14, r * 0.68);
      const ext = Math.abs(Math.cos(spin));
      if (rpm > 0.2) {
        ctx.fillStyle = `rgba(255,220,150,${0.15 + rpm * 0.3})`;
        rrect(ctx, 0, -r * 0.16, L, r * 0.32, r * 0.1); ctx.fill();
      }
      rrect(ctx, 0, -r * 0.1, L * (0.35 + 0.65 * ext), r * 0.2, r * 0.05);
      ctx.fillStyle = metal(ctx, 0, 0, L, 0, '#fff1d0', '#9c7b3c'); ctx.fill();
      ctx.fillStyle = accent; ctx.fillRect(L * (0.35 + 0.65 * ext) - r * 0.12, -r * 0.1, r * 0.12, r * 0.2);
      break;
    }
    case 'hammer': case 'axe': {
      let reach = r * 0.55, raise = 0;
      if (wind > 0) { reach = r * 0.25; raise = 1; }
      else if (swing > 0) { reach = r * 0.95; }
      ctx.strokeStyle = '#8a95a5'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-r * 0.75, 0); ctx.lineTo(reach, 0); ctx.stroke();
      const hs = 1 + raise * 0.35;
      ctx.translate(reach, 0); ctx.scale(hs, hs);
      if (def.style === 'axe') {
        ctx.beginPath(); ctx.moveTo(-r * 0.05, -r * 0.08); ctx.quadraticCurveTo(r * 0.38, -r * 0.42, r * 0.28, -r * 0.05);
        ctx.lineTo(r * 0.28, r * 0.05); ctx.quadraticCurveTo(r * 0.38, r * 0.42, -r * 0.05, r * 0.08); ctx.closePath();
        ctx.fillStyle = metal(ctx, 0, -r * 0.4, 0, r * 0.4, '#eef3f8', '#7b8696'); ctx.fill();
        ctx.strokeStyle = accent; ctx.lineWidth = r * 0.04; ctx.stroke();
      } else {
        rrect(ctx, -r * 0.14, -r * 0.27, r * 0.3, r * 0.54, r * 0.06);
        ctx.fillStyle = metal(ctx, 0, -r * 0.27, 0, r * 0.27, '#cfd7e2', '#596474'); ctx.fill();
        ctx.fillStyle = accent; ctx.fillRect(r * 0.12, -r * 0.27, r * 0.04, r * 0.54);
      }
      if (swing > 0.12) {
        ctx.beginPath(); ctx.arc(r * 0.15, 0, r * (0.9 - swing * 1.8), 0, TAU);
        ctx.strokeStyle = `rgba(255,255,255,${swing * 2})`; ctx.lineWidth = r * 0.06; ctx.stroke();
      }
      break;
    }
    case 'flipper': case 'flipper2': {
      const up = swing > 0 ? Math.min(1, swing * 4) : 0;
      const L = r * (0.38 + up * 0.22), H = r * (def.style === 'flipper2' ? 0.7 : 0.6);
      ctx.beginPath(); ctx.moveTo(-r * 0.05, -H); ctx.lineTo(L, -H * 0.82); ctx.lineTo(L, H * 0.82); ctx.lineTo(-r * 0.05, H); ctx.closePath();
      ctx.fillStyle = up > 0 ? metal(ctx, 0, 0, L, 0, '#ffffff', '#9aa6b6') : metal(ctx, 0, 0, L, 0, '#a7b2c2', '#4e5866'); ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = r * 0.05; ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = r * 0.03;
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(L * i / 4, -H * 0.8); ctx.lineTo(L * i / 4, H * 0.8); ctx.stroke(); }
      if (def.style === 'flipper2') { ctx.fillStyle = '#5a6a80'; ctx.fillRect(-r * 0.35, -r * 0.12, r * 0.3, r * 0.24); }
      break;
    }
    case 'saw': case 'plasma': {
      ctx.translate(r * 0.38, 0);
      const R = r * 0.4;
      ctx.fillStyle = '#2a2f38'; ctx.fillRect(-R * 1.1, -r * 0.08, R * 1.1, r * 0.16);
      ctx.rotate(spin);
      ctx.beginPath();
      for (let i = 0; i < 20; i++) { const a = (i / 20) * TAU; const rr = i % 2 ? R * 0.8 : R; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      ctx.closePath();
      if (def.style === 'plasma') {
        ctx.fillStyle = active ? '#ff5cf0' : '#a84aa0'; ctx.shadowColor = '#ff5cf0'; ctx.shadowBlur = active ? r * 0.6 : 0;
      } else ctx.fillStyle = metal(ctx, -R, -R, R, R, '#e9eef4', '#6d7888');
      ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(0, 0, R * 0.25, 0, TAU); ctx.fillStyle = '#1a1e26'; ctx.fill();
      break;
    }
    case 'flame': {
      ctx.beginPath(); ctx.arc(-r * 0.2, 0, r * 0.2, 0, TAU); ctx.fillStyle = '#7a2a1a'; ctx.fill();
      ctx.strokeStyle = '#ff8a3c'; ctx.lineWidth = r * 0.04; ctx.stroke();
      rrect(ctx, -r * 0.05, -r * 0.08, r * 0.42, r * 0.16, r * 0.04); ctx.fillStyle = '#5a5f68'; ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.4, 0, r * 0.06, 0, TAU); ctx.fillStyle = active ? '#ffd23f' : '#ff6a2a'; ctx.fill();
      break;
    }
    case 'gun': {
      rrect(ctx, -r * 0.2, -r * 0.17, r * 0.36, r * 0.34, r * 0.06); ctx.fillStyle = '#3a4250'; ctx.fill();
      ctx.fillStyle = '#9aa6b6'; ctx.fillRect(r * 0.1, -r * 0.1, r * 0.48, r * 0.07); ctx.fillRect(r * 0.1, r * 0.03, r * 0.48, r * 0.07);
      ctx.fillStyle = accent; ctx.fillRect(-r * 0.2, -r * 0.03, r * 0.1, r * 0.06);
      if (swing > 0) { ctx.beginPath(); ctx.arc(r * 0.66, 0, r * 0.14, 0, TAU); ctx.fillStyle = 'rgba(255,230,120,0.9)'; ctx.fill(); }
      break;
    }
    case 'rocket': {
      rrect(ctx, -r * 0.2, -r * 0.27, r * 0.56, r * 0.54, r * 0.08); ctx.fillStyle = '#3c4656'; ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = r * 0.04; ctx.stroke();
      const ready = ws ? ws.cd <= 0 : true;
      for (const [x, y] of [[0.22, -0.12], [0.22, 0.12], [0.02, -0.12], [0.02, 0.12]]) {
        ctx.beginPath(); ctx.arc(x * r, y * r, r * 0.07, 0, TAU); ctx.fillStyle = ready ? '#ff5a3c' : '#151820'; ctx.fill();
      }
      break;
    }
    case 'emp': {
      ctx.strokeStyle = '#7d8aa0'; ctx.lineWidth = r * 0.08;
      ctx.beginPath(); ctx.moveTo(-r * 0.2, 0); ctx.lineTo(r * 0.62, 0); ctx.stroke();
      const ready = ws ? ws.cd <= 0 : true;
      const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 150);
      ctx.beginPath(); ctx.arc(r * 0.68, 0, r * 0.13, 0, TAU);
      ctx.fillStyle = ready ? `rgba(110,200,255,${pulse})` : '#24405a'; ctx.shadowColor = '#6ec8ff'; ctx.shadowBlur = ready ? r * 0.5 : 0; ctx.fill(); ctx.shadowBlur = 0;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(r * 0.3, 0); ctx.lineTo(r * 0.45, s * r * 0.16); ctx.strokeStyle = '#7d8aa0'; ctx.lineWidth = r * 0.04; ctx.stroke(); }
      break;
    }
    case 'rail': {
      ctx.fillStyle = '#2b313c'; ctx.fillRect(-r * 0.25, -r * 0.2, r * 0.3, r * 0.4);
      ctx.fillStyle = '#a7b3c4'; ctx.fillRect(0, -r * 0.17, r * 0.85, r * 0.07); ctx.fillRect(0, r * 0.1, r * 0.85, r * 0.07);
      const ch = wind > 0 ? 1 - wind / (def.charge || 0.45) : 0;
      if (ch > 0) { ctx.fillStyle = `rgba(140,255,240,${0.3 + ch * 0.7})`; ctx.fillRect(0, -r * 0.06, r * 0.85 * ch, r * 0.12); }
      ctx.fillStyle = accent; ctx.fillRect(-r * 0.25, -r * 0.03, r * 0.1, r * 0.06);
      break;
    }
  }
  ctx.restore();
}

// --------------------------------------------------------------------------
// Whole bot. v = { build, x, y, a, r, team, ws:[weapon runtime], shieldFrac, shieldHit, flash,
//                  boosting, air, airMax, stun, phase, burn }
// --------------------------------------------------------------------------
export function drawBot(ctx, v, opts = {}) {
  const b = v.build;
  const frame = PART[b.frame];
  const wheel = PART[b.wheel];
  const col = TEAM[v.team] || TEAM.player;
  const r = v.r;
  const shape = SHAPES[frame.shape];
  const airLift = v.air > 0 ? Math.sin(Math.min(1, v.air / (v.airMax || 1)) * Math.PI) : 0;
  const scale = (1 + airLift * 0.35) * (v.fall != null ? Math.max(0, 1 - v.fall) : 1);
  ctx.save();
  ctx.translate(v.x, v.y);

  // shadow
  if (!opts.noShadow) {
    ctx.save();
    ctx.translate(r * 0.12 + airLift * r * 0.5, r * 0.18 + airLift * r * 0.6);
    ctx.rotate(v.a);
    poly(ctx, shape, r * 1.05 * (1 - airLift * 0.2));
    ctx.fillStyle = `rgba(0,0,0,${0.35 - airLift * 0.15})`; ctx.fill();
    ctx.restore();
  }

  ctx.rotate(v.a + (v.air > 0 ? airLift * 0.6 * (v.spinDir || 1) : 0));
  ctx.scale(scale, scale);

  // boost flame
  if (v.boosting) {
    const L = r * (0.8 + Math.random() * 0.5);
    const g = ctx.createLinearGradient(-r * 0.6, 0, -r * 0.6 - L, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.3, col.accent); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.22); ctx.lineTo(-r * 0.6 - L, 0); ctx.lineTo(-r * 0.55, r * 0.22); ctx.closePath(); ctx.fill();
  }

  // wheels
  const wp = wheelPositions(frame);
  for (const [x, y] of wp) {
    ctx.save(); ctx.translate(x * r, y * r); drawWheel(ctx, wheel ? wheel.style : 'wheel', r, v.phase || 0); ctx.restore();
  }

  // armor layers (behind body, slightly larger)
  const armors = (b.armor || []).filter(Boolean);
  armors.forEach((id, i) => {
    const a = PART[id]; const look = ARMOR_LOOK[a.look] || ARMOR_LOOK.steel;
    const s = r * (1.12 + (armors.length - 1 - i) * 0.1);
    poly(ctx, shape, s);
    ctx.fillStyle = look.fill;
    if (look.glow) { ctx.shadowColor = look.glow; ctx.shadowBlur = r * 0.4; }
    ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = look.edge; ctx.lineWidth = Math.max(1, r * 0.05); ctx.stroke();
    // rivets
    ctx.fillStyle = look.edge;
    for (const [px, py] of shape) { ctx.beginPath(); ctx.arc(px * s * 0.9, py * s * 0.9, r * 0.035, 0, TAU); ctx.fill(); }
    if (look.spikes) {
      ctx.fillStyle = '#dfe4ea';
      for (let k = 0; k < shape.length; k++) {
        const [x1, y1] = shape[k], [x2, y2] = shape[(k + 1) % shape.length];
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const nx = my, ny = -mx; // outward-ish
        const len = Math.hypot(nx, ny) || 1;
        const ox = (mx / (Math.hypot(mx, my) || 1)), oy = (my / (Math.hypot(mx, my) || 1));
        ctx.beginPath();
        ctx.moveTo((mx - ny / len * 0.06) * s, (my + nx / len * 0.06) * s);
        ctx.lineTo((mx + ox * 0.22) * s, (my + oy * 0.22) * s);
        ctx.lineTo((mx + ny / len * 0.06) * s, (my - nx / len * 0.06) * s);
        ctx.fill();
      }
    }
  });

  // body
  poly(ctx, shape, r);
  const bg = ctx.createLinearGradient(-r, -r, r, r);
  bg.addColorStop(0, col.body2); bg.addColorStop(1, col.body);
  ctx.fillStyle = bg; ctx.fill();
  ctx.shadowColor = col.glow; ctx.shadowBlur = opts.glow === false ? 0 : r * 0.5;
  ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.lineJoin = 'round'; ctx.stroke();
  ctx.shadowBlur = 0;
  // inner panel
  poly(ctx, shape, r * 0.55);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = Math.max(1, r * 0.04); ctx.stroke();

  // utilities: little modules along spine
  const utils = (b.util || []).filter(Boolean);
  utils.forEach((id, i) => {
    const u = PART[id];
    const x = -r * (0.15 + i * 0.28), y = 0;
    rrect(ctx, x - r * 0.11, y - r * 0.11, r * 0.22, r * 0.22, r * 0.05);
    ctx.fillStyle = '#10151d'; ctx.fill();
    ctx.strokeStyle = RARITY[u.rarity].color; ctx.lineWidth = Math.max(1, r * 0.03); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * 0.045, 0, TAU); ctx.fillStyle = RARITY[u.rarity].color; ctx.fill();
    if (id === 'nitro') { ctx.fillStyle = '#555c68'; ctx.fillRect(-r * 0.75, -r * 0.2, r * 0.18, r * 0.12); ctx.fillRect(-r * 0.75, r * 0.08, r * 0.18, r * 0.12); }
  });

  // cockpit "cursor eye"
  ctx.beginPath(); ctx.moveTo(r * 0.42, 0); ctx.lineTo(r * 0.12, -r * 0.13); ctx.lineTo(r * 0.12, r * 0.13); ctx.closePath();
  ctx.fillStyle = col.accent; ctx.shadowColor = col.accent; ctx.shadowBlur = r * 0.4; ctx.fill(); ctx.shadowBlur = 0;

  // weapons
  (b.weapons || []).forEach((id, i) => {
    if (!id) return;
    const def = PART[id];
    const m = weaponMount(frame, i);
    ctx.save(); ctx.translate(m.x * r, m.y * r); ctx.scale(m.s, m.s);
    drawWeapon(ctx, def, v.ws ? v.ws[i] : null, r, col.accent);
    ctx.restore();
  });

  // hit flash
  if (v.flash > 0) {
    poly(ctx, shape, r * 1.05);
    ctx.fillStyle = `rgba(255,255,255,${Math.min(0.7, v.flash * 5)})`; ctx.fill();
  }
  if (v.burn > 0) {
    poly(ctx, shape, r);
    ctx.fillStyle = `rgba(255,110,30,${0.15 + 0.1 * Math.sin(performance.now() / 60)})`; ctx.fill();
  }
  ctx.restore();

  // shield bubble (world space)
  if (v.shieldFrac > 0.01) {
    ctx.save(); ctx.translate(v.x, v.y);
    const R = r * 1.55 * scale;
    const hit = v.shieldHit || 0;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); }
    ctx.closePath();
    ctx.fillStyle = `rgba(110,200,255,${0.05 + v.shieldFrac * 0.06 + hit * 0.4})`; ctx.fill();
    ctx.strokeStyle = `rgba(140,220,255,${0.2 + v.shieldFrac * 0.4 + hit})`; ctx.lineWidth = Math.max(1, r * 0.05); ctx.stroke();
    ctx.restore();
  }
  // stun stars
  if (v.stun > 0 && !(v.air > 0)) {
    ctx.save(); ctx.translate(v.x, v.y);
    const t = performance.now() / 300;
    for (let i = 0; i < 3; i++) {
      const a = t + (i / 3) * TAU;
      ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.5 - r * 0.9, r * 0.1, 0, TAU);
      ctx.fillStyle = '#9fe8ff'; ctx.fill();
    }
    ctx.restore();
  }
}

// --------------------------------------------------------------------------
// Part icons for shop cards / pickers
// --------------------------------------------------------------------------
export function drawPartIcon(ctx, part, size, team = 'player') {
  const col = TEAM[team];
  const r = size * 0.3;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  switch (part.cat) {
    case 'frame': {
      const shape = SHAPES[part.shape];
      for (const [x, y] of wheelPositions(part)) { ctx.save(); ctx.translate(x * r, y * r); drawWheel(ctx, 'wheel', r, 0); ctx.restore(); }
      poly(ctx, shape, r);
      const bg = ctx.createLinearGradient(-r, -r, r, r); bg.addColorStop(0, col.body2); bg.addColorStop(1, col.body);
      ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.lineJoin = 'round'; ctx.stroke();
      // weapon hardpoints
      for (let i = 0; i < part.slots.weapon; i++) {
        const m = weaponMount(part, i);
        ctx.beginPath(); ctx.arc(m.x * r, m.y * r, r * 0.09, 0, TAU); ctx.fillStyle = '#ffb23f'; ctx.fill();
      }
      break;
    }
    case 'wheel': ctx.scale(2.4, 2.4); drawWheel(ctx, part.style, r, 0.8); break;
    case 'weapon': {
      const off = { bar: -0.2, drum: -0.2, disc: -0.4, vertical: -0.35, hammer: -0.2, axe: -0.2, flipper: -0.2, flipper2: -0.15, saw: -0.4, plasma: -0.4, flame: -0.1, gun: -0.2, rocket: -0.08, emp: -0.25, rail: -0.3 }[part.style] || 0;
      ctx.scale(1.5, 1.5); ctx.translate(off * r, 0);
      drawWeapon(ctx, part, { rpm: 0, spin: 0.5, swing: 0, wind: 0, active: true, cd: 0 }, r, col.accent);
      break;
    }
    case 'armor': {
      const look = ARMOR_LOOK[part.look] || ARMOR_LOOK.steel;
      ctx.beginPath(); ctx.moveTo(0, -r * 1.1); ctx.lineTo(r * 0.95, -r * 0.6); ctx.lineTo(r * 0.8, r * 0.5); ctx.lineTo(0, r * 1.15); ctx.lineTo(-r * 0.8, r * 0.5); ctx.lineTo(-r * 0.95, -r * 0.6); ctx.closePath();
      ctx.fillStyle = look.fill; if (look.glow) { ctx.shadowColor = look.glow; ctx.shadowBlur = r * 0.6; }
      ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = look.edge; ctx.lineWidth = r * 0.1; ctx.stroke();
      ctx.fillStyle = look.edge;
      for (const [x, y] of [[-0.5, -0.5], [0.5, -0.5], [-0.45, 0.35], [0.45, 0.35]]) { ctx.beginPath(); ctx.arc(x * r, y * r, r * 0.08, 0, TAU); ctx.fill(); }
      if (look.spikes) { ctx.fillStyle = '#e8ecf0'; for (const [x, y, a] of [[0, -1.1, -Math.PI / 2], [0.95, -0.6, -0.4], [-0.95, -0.6, Math.PI + 0.4]]) { ctx.save(); ctx.translate(x * r, y * r); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, -r * 0.12); ctx.lineTo(r * 0.35, 0); ctx.lineTo(0, r * 0.12); ctx.fill(); ctx.restore(); } }
      break;
    }
    case 'shield': {
      const R = r * 1.1;
      const tierA = { common: 0.15, rare: 0.22, epic: 0.3, legendary: 0.4 }[part.rarity];
      ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); } ctx.closePath();
      ctx.fillStyle = `rgba(110,200,255,${tierA})`; ctx.fill(); ctx.strokeStyle = '#8fdcff'; ctx.lineWidth = r * 0.1; ctx.shadowColor = '#6ec8ff'; ctx.shadowBlur = r * 0.6; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(140,220,255,0.5)'; ctx.lineWidth = r * 0.05;
      ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; ctx.lineTo(Math.cos(a) * R * 0.55, Math.sin(a) * R * 0.55); } ctx.closePath(); ctx.stroke();
      break;
    }
    case 'util': {
      const c = RARITY[part.rarity].color;
      rrect(ctx, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.25); ctx.fillStyle = '#10151d'; ctx.fill();
      ctx.strokeStyle = c; ctx.lineWidth = r * 0.1; ctx.stroke();
      ctx.strokeStyle = '#5b6574'; ctx.lineWidth = r * 0.08;
      for (let i = -1; i <= 1; i++) for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(i * r * 0.45, s * r * 0.8); ctx.lineTo(i * r * 0.45, s * r * 1.05); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s * r * 0.8, i * r * 0.45); ctx.lineTo(s * r * 1.05, i * r * 0.45); ctx.stroke();
      }
      ctx.fillStyle = c; ctx.font = `800 ${Math.round(r * 0.95)}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(part.glyph || '?', 0, r * 0.05);
      break;
    }
  }
  ctx.restore();
}

// --------------------------------------------------------------------------
// Arena
// --------------------------------------------------------------------------
const floorCache = new Map();
function floorCanvas(arena, key) {
  if (floorCache.has(key)) return floorCache.get(key);
  const c = document.createElement('canvas');
  c.width = WORLD.w; c.height = WORLD.h;
  const g = c.getContext('2d');
  g.fillStyle = arena.floor; g.fillRect(0, 0, WORLD.w, WORLD.h);
  // steel plates
  const plate = 100;
  for (let x = 0; x < WORLD.w; x += plate) for (let y = 0; y < WORLD.h; y += plate) {
    const s = ((x * 7 + y * 13) % 17) / 17;
    g.fillStyle = `rgba(255,255,255,${0.012 + s * 0.02})`; g.fillRect(x + 1, y + 1, plate - 2, plate - 2);
    g.fillStyle = 'rgba(255,255,255,0.05)';
    for (const [px, py] of [[6, 6], [plate - 6, 6], [6, plate - 6], [plate - 6, plate - 6]]) { g.beginPath(); g.arc(x + px, y + py, 1.6, 0, TAU); g.fill(); }
  }
  g.strokeStyle = 'rgba(0,0,0,0.45)'; g.lineWidth = 2;
  for (let x = 0; x <= WORLD.w; x += plate) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, WORLD.h); g.stroke(); }
  for (let y = 0; y <= WORLD.h; y += plate) { g.beginPath(); g.moveTo(0, y); g.lineTo(WORLD.w, y); g.stroke(); }
  // center logo ring
  g.strokeStyle = arena.accent; g.globalAlpha = 0.12; g.lineWidth = 6;
  g.beginPath(); g.arc(WORLD.w / 2, WORLD.h / 2, 150, 0, TAU); g.stroke();
  g.lineWidth = 2; g.beginPath(); g.arc(WORLD.w / 2, WORLD.h / 2, 175, 0, TAU); g.stroke();
  g.globalAlpha = 1;
  // start squares
  g.strokeStyle = 'rgba(63,240,255,0.25)'; g.lineWidth = 3; g.strokeRect(190, 440, 120, 120);
  g.strokeStyle = 'rgba(255,77,122,0.25)'; g.strokeRect(1090, 440, 120, 120);
  floorCache.set(key, c);
  return c;
}

function stripes(ctx, x, y, w, h, a = 0.9) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = `rgba(255,210,63,${a})`; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(20,20,20,0.95)';
  for (let i = -h; i < w + h; i += 24) { ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i + 12, y); ctx.lineTo(x + i + 12 - h, y + h); ctx.lineTo(x + i - h, y + h); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

export function cyc(h, t) { // returns {on, phase(0..1 within on or off), next}
  const p = ((t + (h.offset || 0)) % h.period + h.period) % h.period;
  const on = p < h.on;
  return { on, f: on ? p / h.on : (p - h.on) / (h.period - h.on) };
}

export function drawArena(ctx, m) {
  const A = m.arena; const t = m.time;
  ctx.drawImage(floorCanvas(A, m.arenaId), 0, 0);

  // pits
  for (const p of A.pits) {
    const open = m.pitOpen;
    stripes(ctx, p.x - 12, p.y - 12, p.w + 24, 12); stripes(ctx, p.x - 12, p.y + p.h, p.w + 24, 12);
    stripes(ctx, p.x - 12, p.y, 12, p.h); stripes(ctx, p.x + p.w, p.y, 12, p.h);
    if (open) {
      const g = ctx.createRadialGradient(p.x + p.w / 2, p.y + p.h / 2, 0, p.x + p.w / 2, p.y + p.h / 2, p.w * 0.7);
      g.addColorStop(0, '#000'); g.addColorStop(1, '#0a0a10');
      ctx.fillStyle = g; ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = 'rgba(255,60,60,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(p.x + 4, p.y + 4, p.w - 8, p.h - 8);
    } else {
      ctx.fillStyle = '#20242c'; ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#363c48'; ctx.lineWidth = 3;
      for (let i = 10; i < p.w; i += 16) { ctx.beginPath(); ctx.moveTo(p.x + i, p.y); ctx.lineTo(p.x + i, p.y + p.h); ctx.stroke(); }
      if (m.arena.pitOpen && m.time > 0) {
        const left = Math.max(0, Math.ceil(m.arena.pitOpen - m.time));
        ctx.fillStyle = left <= 5 ? '#ff4d6d' : 'rgba(255,255,255,0.35)';
        ctx.font = '800 28px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(left <= 5 ? String(left) : 'PIT', p.x + p.w / 2, p.y + p.h / 2);
      }
    }
  }

  // spikes
  for (const s of A.spikes) {
    const c = cyc(s, t);
    const warn = !c.on && c.f > 0.75;
    ctx.fillStyle = '#1a1d24'; ctx.fillRect(s.x, s.y, s.w, s.h);
    ctx.strokeStyle = warn ? '#ffd23f' : c.on ? '#ff4d6d' : '#3a404c'; ctx.lineWidth = 3; ctx.strokeRect(s.x, s.y, s.w, s.h);
    const step = 20;
    for (let x = s.x + step / 2; x < s.x + s.w; x += step) for (let y = s.y + step / 2; y < s.y + s.h; y += step) {
      if (c.on) {
        ctx.beginPath(); ctx.moveTo(x - 7, y + 6); ctx.lineTo(x, y - 8); ctx.lineTo(x + 7, y + 6); ctx.closePath();
        ctx.fillStyle = '#dfe4ea'; ctx.fill(); ctx.fillStyle = 'rgba(255,77,109,0.5)'; ctx.fillRect(x - 1, y - 8, 2, 4);
      } else { ctx.beginPath(); ctx.arc(x, y, 2.5, 0, TAU); ctx.fillStyle = warn ? '#ffd23f' : '#4a505c'; ctx.fill(); }
    }
  }

  // flame vents
  for (const v of A.vents) {
    const c = cyc(v, t);
    ctx.beginPath(); ctx.arc(v.x, v.y, v.r, 0, TAU); ctx.fillStyle = '#1a1210'; ctx.fill();
    ctx.strokeStyle = c.on ? '#ff8a3c' : (!c.on && c.f > 0.7 ? '#ffd23f' : '#4a3a30'); ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = '#3a2a22'; ctx.lineWidth = 3;
    for (let i = -v.r + 10; i < v.r; i += 12) { const hh = Math.sqrt(v.r * v.r - i * i); ctx.beginPath(); ctx.moveTo(v.x + i, v.y - hh + 4); ctx.lineTo(v.x + i, v.y + hh - 4); ctx.stroke(); }
    if (c.on) {
      const g = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.r * 1.5);
      g.addColorStop(0, 'rgba(255,240,180,0.9)'); g.addColorStop(0.4, 'rgba(255,130,40,0.7)'); g.addColorStop(1, 'rgba(255,60,20,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(v.x, v.y, v.r * 1.5, 0, TAU); ctx.fill();
    }
  }

  // killsaws
  for (const s of A.saws) {
    const c = cyc(s, t);
    ctx.fillStyle = '#0a0b0f'; ctx.fillRect(s.x - s.r - 6, s.y - 6, s.r * 2 + 12, 12);
    const up = c.on ? Math.min(1, c.f * 6, (1 - c.f) * 6) : 0;
    if (!c.on && c.f > 0.75) { ctx.fillStyle = 'rgba(255,77,109,0.5)'; ctx.fillRect(s.x - s.r - 6, s.y - 6, s.r * 2 + 12, 12); }
    if (up > 0) {
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(t * 18);
      const R = s.r * (0.4 + 0.6 * up);
      ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; const rr = i % 2 ? R * 0.82 : R; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
      ctx.fillStyle = '#d7dde5'; ctx.shadowColor = '#ff4d6d'; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(0, 0, R * 0.3, 0, TAU); ctx.fillStyle = '#ff4d6d'; ctx.fill();
      ctx.restore();
    }
  }

  // arena hammers
  for (const h of A.hammers) {
    const st = m.hammerState(h);
    ctx.save();
    ctx.strokeStyle = st.warn ? `rgba(255,77,109,${0.5 + 0.5 * Math.sin(t * 30)})` : 'rgba(255,210,63,0.35)';
    ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.strokeRect(h.x, h.y, h.w, h.h); ctx.setLineDash([]);
    if (st.warn) { ctx.fillStyle = 'rgba(255,77,109,0.15)'; ctx.fillRect(h.x, h.y, h.w, h.h); }
    if (st.slam > 0) {
      ctx.fillStyle = `rgba(255,255,255,${st.slam})`; ctx.fillRect(h.x, h.y, h.w, h.h);
      rrect(ctx, h.x + 20, h.y + 20, h.w - 40, h.h - 40, 12); ctx.fillStyle = '#5b6574'; ctx.fill();
      ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.stroke();
    }
    ctx.restore();
  }

  // blocks & pillars
  for (const b of A.blocks) {
    rrect(ctx, b.x + 6, b.y + 8, b.w, b.h, 8); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill();
    rrect(ctx, b.x, b.y, b.w, b.h, 8); ctx.fillStyle = metal(ctx, b.x, b.y, b.x, b.y + b.h, '#4a5262', '#262b35'); ctx.fill();
    ctx.strokeStyle = A.accent; ctx.globalAlpha = 0.6; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
  }
  for (const p of A.pillars) {
    ctx.beginPath(); ctx.arc(p.x + 6, p.y + 8, p.r, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fill();
    const g = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 2, p.x, p.y, p.r);
    g.addColorStop(0, '#7a8494'); g.addColorStop(1, '#262b35');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = A.accent; ctx.globalAlpha = 0.7; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1;
  }

  // walls
  ctx.save();
  ctx.strokeStyle = A.accent; ctx.lineWidth = 6; ctx.shadowColor = A.accent; ctx.shadowBlur = 24;
  ctx.strokeRect(-3, -3, WORLD.w + 6, WORLD.h + 6);
  ctx.restore();
  ctx.fillStyle = '#05070b';
  ctx.fillRect(-400, -400, WORLD.w + 800, 397); ctx.fillRect(-400, WORLD.h + 3, WORLD.w + 800, 397);
  ctx.fillRect(-400, -3, 397, WORLD.h + 6); ctx.fillRect(WORLD.w + 3, -3, 397, WORLD.h + 6);
}
