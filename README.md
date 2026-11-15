# Cursor Bots

A mobile-first HTML5 arena battler. Your robot is a glowing **cursor**: bolt on frames, wheels,
weapons, armor, shields and utility modules and it visibly changes shape. Fight AI bots across a
series of leagues in arenas full of spikes, killsaws, flame vents, arena hammers and pits.

Installable **Progressive Web App** with offline play and automatic updates. No build step,
no dependencies.

## Play locally

Any static server works (service workers need `http://localhost` or HTTPS, not `file://`):

```bash
npx serve .            # or: python3 -m http.server 8080
```

Controls: drag the left half of the screen to drive (the bot turns toward your thumb,
Asteroids-style), right-side buttons fire each weapon and boost. Keyboard: WASD/arrows,
Space/J, K, L for weapons, Shift to boost, Esc to pause.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (the files at the repo root).
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**, pick `main` and `/ (root)`.
3. Open `https://<you>.github.io/<repo>/`. All paths are relative, so a project sub-path works.

`.nojekyll` is included so Pages serves the files untouched.

## Shipping updates (auto-update)

1. Make your changes.
2. Run `node tools/bump-version.mjs` (or edit `VERSION` in `sw.js`). **The version must change**
   or installed apps won't notice the update.
3. If you added new files, add them to the `ASSETS` list in `sw.js`.
4. Push. Installed copies check for updates on launch, when brought to the foreground, and every
   20 minutes. The new version downloads in the background and is applied automatically the next
   time the player is on the title/hub/results screen (never mid-match). Settings has a manual
   "Check for updates" button.

## Game systems

- **Frames** (8): set HP, weight capacity and slot layout (2–6 wheels, 1–3 weapons, 1–2 armor,
  shield, 0–2 utility). Going over capacity slows the bot.
- **Wheels** (7): power, grip, top speed, plus perks (treads resist knockback, mag-lev floats over
  floor hazards, spiked rims hurt on contact).
- **Weapons** (15): spinners (bar, drum, disc, vertical) that must spin up, hammers/axes,
  flippers that launch bots (into pits!), saws, flamethrower with overheat, nail gun, homing
  rockets, EMP stun, railgun.
- **Armor** (8), **Shields** (4), **Utility** (7): damage reduction, thorns, reactive plating,
  regenerating shields, repair drones, overclock, anchor magnet (pit save), crits and more.
- **Rarity tiers**: Common, Rare, Epic, Legendary. **Levels 1–5**: buy duplicate cards for copies,
  then spend copies + credits in the Garage (+12% stats per level).
- **Workshop**: a hand of 5 cards is dealt from a rarity-weighted deck after every match;
  rerolls cost more each time.
- **Progression**: Rookie Cup → Scrapyard Circuit → Steel Coliseum → Inferno League → Titan
  Championship, each ending with a named boss, then the endless Pro Circuit. Pilot XP levels
  grant credit bonuses.
- **Tutorial**: the first match teaches driving, beacons, boost and spinner timing against a
  dummy; coach marks then walk through the Workshop and Garage.

Progress is saved in `localStorage`.

## Project layout

```
index.html              app shell
manifest.webmanifest    PWA manifest
sw.js                   service worker (offline cache + updates)
css/style.css           UI styles
js/data.js              parts, leagues, arenas, bosses (tune balance here)
js/engine.js            physics, weapons, hazards, AI, tutorial, camera
js/render.js            procedural drawing of bots, parts and arenas
js/save.js              save data, economy, shop, opponent generation
js/ui.js                screens, garage, shop, HUD, touch controls
js/audio.js             Web Audio synth effects
js/main.js              boot, game loop, install + update handling
icons/                  app icons (original SVG + PNG renders)
tools/                  version bump script, maskable icon source
```

## License

MIT, see `LICENSE`. Third-party notices: see `CREDITS.md` (there are none).
