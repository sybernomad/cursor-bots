// Cursor Bots — tiny WebAudio synth. All sounds are generated at runtime (no audio files).
let ac = null, master = null, noiseBuf = null, hum = null;
export const Sfx = { enabled: true };
const last = {};

export function initAudio() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 1, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { ac = null; }
}

function env(g, t, a, peak, dcy) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dcy); }
function tone(type, f0, f1, dur, vol, delay = 0) {
  const t = ac.currentTime + delay; const o = ac.createOscillator(); const g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, 0.005, vol, dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, vol, freq = 1200, q = 1, type = 'bandpass', delay = 0, f1) {
  const t = ac.currentTime + delay; const s = ac.createBufferSource(); s.buffer = noiseBuf;
  const f = ac.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q;
  const g = ac.createGain(); env(g, t, 0.003, vol, dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
}

export function play(name, o = {}) {
  if (!Sfx.enabled || !ac) return;
  const now = performance.now();
  const gap = { tick: 40, flame: 90, saw: 60, shoot: 45, clank: 50, hit: 40, spinhit: 50 }[name] || 0;
  if (gap && last[name] && now - last[name] < gap) return;
  last[name] = now;
  const v = (o.vol ?? 1) * (o.near === false ? 0.45 : 1);
  switch (name) {
    case 'hit': noise(0.12, 0.5 * v, 2400, 1.5); tone('square', 220, 80, 0.08, 0.12 * v); break;
    case 'spinhit': noise(0.18, 0.7 * v, 3200, 2); tone('sawtooth', 600, 90, 0.15, 0.18 * v); break;
    case 'slam': noise(0.25, 0.8 * v, 400, 0.8, 'lowpass'); tone('sine', 120, 40, 0.25, 0.5 * v); break;
    case 'clank': noise(0.08, 0.35 * v, 1800, 6); tone('triangle', 520 + Math.random() * 200, 300, 0.07, 0.08 * v); break;
    case 'flip': noise(0.12, 0.4 * v, 900, 1); tone('square', 160, 520, 0.12, 0.12 * v); break;
    case 'whoosh': noise(0.18, 0.2 * v, 500, 0.7, 'bandpass', 0, 2500); break;
    case 'saw': noise(0.08, 0.25 * v, 5200, 4); break;
    case 'flame': noise(0.14, 0.22 * v, 700, 0.5, 'lowpass'); break;
    case 'overheat': tone('square', 900, 300, 0.3, 0.1 * v); noise(0.4, 0.2 * v, 3000, 1, 'highpass'); break;
    case 'shoot': tone('square', 900, 400, 0.04, 0.06 * v); noise(0.03, 0.15 * v, 4000, 1); break;
    case 'tick': tone('triangle', 1400, 900, 0.03, 0.05 * v); break;
    case 'rocket': noise(0.4, 0.3 * v, 600, 0.6, 'bandpass', 0, 2000); break;
    case 'boom': noise(0.6, 0.9 * v, 300, 0.7, 'lowpass', 0, 60); tone('sine', 90, 30, 0.5, 0.5 * v); break;
    case 'zap': tone('sawtooth', 1800, 200, 0.2, 0.12 * v); tone('square', 60, 120, 0.2, 0.08 * v); break;
    case 'charge': tone('sine', 300, 1600, 0.42, 0.12 * v); break;
    case 'rail': tone('sawtooth', 2400, 80, 0.3, 0.2 * v); noise(0.3, 0.5 * v, 2000, 0.5); break;
    case 'boost': noise(0.35, 0.3 * v, 300, 0.5, 'bandpass', 0, 3000); tone('sawtooth', 120, 260, 0.3, 0.06 * v); break;
    case 'spike': noise(0.1, 0.4 * v, 3500, 3); break;
    case 'fall': tone('sine', 600, 60, 0.9, 0.3); break;
    case 'alarm': for (let i = 0; i < 3; i++) tone('square', 880, 660, 0.18, 0.1, i * 0.25); break;
    case 'ko': noise(0.9, 1, 500, 0.6, 'lowpass', 0, 50); tone('sine', 140, 30, 0.9, 0.6); break;
    case 'beacon': tone('sine', 880, 1320, 0.15, 0.15); break;
    case 'count': tone('square', 440, 0, 0.12, 0.12); break;
    case 'go': tone('square', 880, 0, 0.3, 0.15); tone('square', 1320, 0, 0.3, 0.1); break;
    case 'win': [523, 659, 784, 1046].forEach((f, i) => tone('square', f, 0, 0.18, 0.1, i * 0.11)); break;
    case 'lose': [392, 330, 262].forEach((f, i) => tone('triangle', f, 0, 0.28, 0.14, i * 0.18)); break;
    case 'ui': tone('sine', 1200, 900, 0.05, 0.08); break;
    case 'deal': noise(0.06, 0.25, 3000, 2); tone('triangle', 700 + Math.random() * 200, 0, 0.05, 0.05); break;
    case 'buy': tone('square', 988, 0, 0.08, 0.1); tone('square', 1318, 0, 0.16, 0.1, 0.08); break;
    case 'upgrade': [523, 784, 1046, 1568].forEach((f, i) => tone('triangle', f, 0, 0.15, 0.12, i * 0.07)); break;
    case 'error': tone('square', 180, 120, 0.15, 0.1); break;
  }
}

// continuous spinner hum for the player's bot
export function setHum(level) {
  if (!ac || !Sfx.enabled) { if (hum) { hum.g.gain.value = 0; } return; }
  if (!hum) {
    const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
    o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 900; g.gain.value = 0;
    o.connect(f); f.connect(g); g.connect(master); o.start(); hum = { o, g, f };
  }
  const t = ac.currentTime;
  hum.o.frequency.setTargetAtTime(40 + level * 260, t, 0.05);
  hum.f.frequency.setTargetAtTime(400 + level * 2400, t, 0.05);
  hum.g.gain.setTargetAtTime(level > 0.02 ? 0.04 + level * 0.07 : 0, t, 0.06);
}

export function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* ignore */ } }
