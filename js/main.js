// Cursor Bots — boot, main loop, PWA install + auto-update.
import { load } from './save.js';
import { UI, initUI, renderTitle, renderHub, menuFrame, matchFrame, resizeCanvas, onHidden, setInstallPrompt, toast } from './ui.js';

load();
initUI();
renderTitle();

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 200));
document.addEventListener('visibilitychange', () => { if (document.hidden) onHidden(); });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (UI.match) {
    const dpr = UI.dpr || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    matchFrame(dt, ctx, window.innerWidth, window.innerHeight);
  } else menuFrame(now / 1000);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------------------------------------------------------------------------
// Install prompt (Android / desktop Chromium). iOS shows manual instructions.
// ---------------------------------------------------------------------------
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); setInstallPrompt(e); });
window.addEventListener('appinstalled', () => { setInstallPrompt(null); toast('Installed! Launch Cursor Bots from your home screen.'); });

// ---------------------------------------------------------------------------
// Service worker: offline cache + automatic updates.
// A new version (bumped VERSION in sw.js) downloads in the background and is
// applied automatically the next time you're on a menu screen, never mid-match.
// ---------------------------------------------------------------------------
UI.version = 'dev';
if (sessionStorage.getItem('cb-updated')) {
  sessionStorage.removeItem('cb-updated');
  setTimeout(() => toast(`Updated to the latest version${UI.version !== 'dev' ? ' (v' + UI.version + ')' : ''}`), 600);
}

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  let pending = null, reloading = false;
  const askVersion = (sw) => new Promise((res) => {
    if (!sw) return res(null);
    const ch = new MessageChannel(); ch.port1.onmessage = (e) => res(e.data && e.data.version);
    sw.postMessage({ type: 'VERSION' }, [ch.port2]); setTimeout(() => res(null), 1500);
  });
  const safeScreen = () => !UI.match && ['title', 'hub', 'result'].includes(UI.screen);
  const banner = document.getElementById('update');
  const tryApply = () => {
    if (!pending) return;
    if (safeScreen()) { banner.classList.add('hidden'); pending.postMessage({ type: 'SKIP_WAITING' }); pending = null; }
    else {
      banner.innerHTML = `<span>Update downloaded</span><button class="btn small primary" id="upd-now">${UI.match ? 'After match' : 'Restart'}</button>`;
      banner.classList.remove('hidden');
      const b = document.getElementById('upd-now');
      b.onclick = () => { if (!UI.match && pending) { pending.postMessage({ type: 'SKIP_WAITING' }); pending = null; banner.classList.add('hidden'); } };
    }
  };
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return; reloading = true;
    sessionStorage.setItem('cb-updated', '1');
    location.reload();
  });
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      const v = await askVersion(reg.active || navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active);
      if (v) { UI.version = v; const el = document.querySelector('.ver'); if (el) el.textContent = 'v' + v; }
      const watch = (w) => {
        w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) { pending = w; tryApply(); }
        });
      };
      if (reg.waiting && navigator.serviceWorker.controller) { pending = reg.waiting; tryApply(); }
      if (reg.installing) watch(reg.installing);
      reg.addEventListener('updatefound', () => watch(reg.installing));
      const check = () => reg.update().catch(() => {});
      setInterval(check, 20 * 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
      setInterval(tryApply, 1500);
      UI.checkUpdate = async (manual) => {
        await check();
        setTimeout(() => {
          if (reg.installing || reg.waiting || pending) toast('Downloading update...');
          else if (manual) toast(`You're on the latest version (v${UI.version})`);
        }, 800);
      };
    } catch (e) { console.warn('SW registration failed', e); }
  });
}

// expose for debugging
window.CursorBots = { UI, renderHub };
