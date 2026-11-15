// Cursor Bots — tiny WebAudio synth. All sounds are generated at runtime (no audio files).
let ac = null, master = null, sfxBus = null, musicBus = null, noiseBuf = null, hum = null;
export const Sfx = { enabled: true, vol: 0.8, music: true, musicVol: 0.5 };
const last = {};

export function initAudio() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const out = ac.createGain(); out.gain.value = 0.9; out.connect(ac.destination);
    sfxBus = ac.createGain(); sfxBus.connect(out);
    musicBus = ac.createGain(); musicBus.connect(out);
    master = sfxBus;
    applyVolumes();
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 1, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { ac = null; }
}

export function applyVolumes() {
  if (!ac) return;
  const t = ac.currentTime;
  sfxBus.gain.setTargetAtTime(Sfx.enabled ? 0.55 * Sfx.vol : 0, t, 0.05);
  musicBus.gain.setTargetAtTime(Sfx.music ? 0.32 * Sfx.musicVol : 0, t, 0.3);
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

// ---------------------------------------------------------------------------
// Generative music: soft pad chords + a gentle arpeggio, all synthesized.
// mode 'menu' = slow and relaxed, 'battle' = adds a pulsing bass and hats.
// ---------------------------------------------------------------------------
const CHORDS = [ // semitones from A2 (110 Hz)
  [0, 7, 12, 15, 19],  // Am9-ish
  [-4, 3, 8, 12, 15],  // Fmaj7
  [3, 10, 15, 19, 22], // Cmaj7
  [-2, 5, 10, 14, 17], // G6
];
const hz = (st) => 110 * Math.pow(2, st / 12);
const Music = { mode: null, timer: null, step: 0, next: 0, verb: null };
function musicVerb() {
  if (Music.verb) return Music.verb;
  const len = ac.sampleRate * 2.6; const ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4); }
  const cv = ac.createConvolver(); cv.buffer = ir;
  const wet = ac.createGain(); wet.gain.value = 0.55; cv.connect(wet); wet.connect(musicBus);
  Music.verb = cv; return cv;
}
function mNote(type, f, t, dur, vol, cutoff = 1800, verb = true) {
  const o = ac.createOscillator(), g = ac.createGain(), fl = ac.createBiquadFilter();
  o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = cutoff;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.6, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(fl); fl.connect(g); g.connect(musicBus); if (verb) g.connect(musicVerb());
  o.start(t); o.stop(t + dur + 0.1);
}
function mHat(t, vol) {
  const s = ac.createBufferSource(); s.buffer = noiseBuf; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
  const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  s.connect(f); f.connect(g); g.connect(musicBus); s.start(t, Math.random() * 0.5); s.stop(t + 0.08);
}
function schedule() {
  if (!ac || !Music.mode) return;
  const battle = Music.mode === 'battle';
  const beat = battle ? 0.25 : 0.42; // seconds per eighth
  while (Music.next < ac.currentTime + 0.4) {
    const t = Music.next, st = Music.step;
    const chord = CHORDS[Math.floor(st / 16) % CHORDS.length];
    if (st % 16 === 0) for (const n of chord.slice(0, 4)) { mNote('sine', hz(n), t, beat * 17, 0.05); mNote('triangle', hz(n) * 1.003, t, beat * 17, 0.025, 900); }
    const arp = [0, 2, 1, 3, 4, 2, 3, 1];
    if (battle || st % 2 === 0) mNote('triangle', hz(chord[arp[st % 8]] + 12), t, beat * 2.2, battle ? 0.035 : 0.045, 2600);
    if (battle) {
      if (st % 2 === 0) mNote('sawtooth', hz(chord[0] - 12), t, beat * 0.9, 0.05, 420, false);
      if (st % 2 === 1) mHat(t, 0.025);
      if (st % 8 === 4) mHat(t, 0.045);
    }
    Music.step++; Music.next += beat;
  }
}
export function setMusic(mode) {
  if (!ac) return;
  if (mode === Music.mode) return;
  Music.mode = mode;
  clearInterval(Music.timer); Music.timer = null;
  if (!mode) return;
  Music.next = Math.max(Music.next, ac.currentTime + 0.1);
  Music.step = Math.floor(Music.step / 16) * 16;
  Music.timer = setInterval(schedule, 120); schedule();
}
