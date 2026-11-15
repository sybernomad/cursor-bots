// Cursor Bots — static game data: parts, rarities, leagues, arenas, bosses.

export const RARITY = {
  common:    { name: 'Common',    color: '#9fb0c3', price: 40 },
  rare:      { name: 'Rare',      color: '#38b6ff', price: 95 },
  epic:      { name: 'Epic',      color: '#b86bff', price: 190 },
  legendary: { name: 'Legendary', color: '#ffb23f', price: 380 },
};
export const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];
export const MAX_LEVEL = 10;
export const levelMult = (l) => 1 + 0.12 * ((l || 1) - 1);

export const CATS = {
  frame: 'Frame', wheel: 'Wheels', weapon: 'Weapon', armor: 'Armor', shield: 'Shield', util: 'Utility',
};

// ---------------------------------------------------------------------------
// FRAMES — slots decide what the bot can carry. Minimum of 2 wheels.
// shape: polygon key in render.js; size: radius multiplier; wy: wheel offset (side), nose: weapon mount x
// ---------------------------------------------------------------------------
const FRAMES = [
  { id: 'dart', name: 'Dart', rarity: 'common', hp: 80, wt: 10, cap: 34, size: 1.0, turn: 1.1, wy: 0.62, nose: 0.95,
    slots: { wheel: 2, weapon: 1, armor: 1, shield: 0, util: 0 }, shape: 'arrow',
    desc: 'The classic cursor. Light, twitchy and cheap.' },
  { id: 'brick', name: 'Brick', rarity: 'common', hp: 115, wt: 16, cap: 52, size: 1.12, turn: 0.95, wy: 0.78, nose: 0.9,
    slots: { wheel: 4, weapon: 1, armor: 1, shield: 0, util: 1 }, shape: 'box',
    desc: 'A sturdy box on four wheels with a utility bay.' },
  { id: 'wedge', name: 'Wedge', rarity: 'rare', hp: 105, wt: 14, cap: 54, size: 1.1, turn: 1.0, wy: 0.7, nose: 0.98, ram: 1.8,
    slots: { wheel: 2, weapon: 1, armor: 2, shield: 1, util: 0 }, shape: 'wedge',
    desc: 'Low ramp front. Ramming damage x1.8.' },
  { id: 'stinger', name: 'Stinger', rarity: 'rare', hp: 90, wt: 11, cap: 50, size: 1.05, turn: 1.2, wy: 0.58, nose: 1.3,
    slots: { wheel: 2, weapon: 2, armor: 1, shield: 1, util: 1 }, shape: 'stinger',
    desc: 'Needle-nosed duelist with twin hardpoints.' },
  { id: 'hexa', name: 'Hexa Tank', rarity: 'epic', hp: 155, wt: 24, cap: 82, size: 1.28, turn: 0.82, wy: 0.86, nose: 1.0,
    slots: { wheel: 6, weapon: 2, armor: 2, shield: 1, util: 1 }, shape: 'hex',
    desc: 'Six-wheeled fortress. Slow to turn, hard to stop.' },
  { id: 'talon', name: 'Talon', rarity: 'epic', hp: 125, wt: 16, cap: 74, size: 1.15, turn: 1.08, wy: 0.72, nose: 1.15,
    slots: { wheel: 4, weapon: 2, armor: 1, shield: 1, util: 2 }, shape: 'talon',
    desc: 'Predatory striker with a wide utility spine.' },
  { id: 'titan', name: 'Titan', rarity: 'legendary', hp: 200, wt: 28, cap: 112, size: 1.4, turn: 0.8, wy: 0.88, nose: 1.08,
    slots: { wheel: 6, weapon: 3, armor: 2, shield: 1, util: 2 }, shape: 'titan',
    desc: 'Championship-class heavyweight. Three hardpoints.' },
  { id: 'phantom', name: 'Phantom', rarity: 'legendary', hp: 145, wt: 15, cap: 92, size: 1.18, turn: 1.25, wy: 0.6, nose: 1.25,
    slots: { wheel: 4, weapon: 3, armor: 1, shield: 1, util: 2 }, shape: 'phantom',
    desc: 'Featherweight chassis with heavyweight firepower.' },
  { id: 'scuttler', name: 'Scuttler', rarity: 'common', hp: 92, wt: 11, cap: 42, size: 1.02, turn: 1.08, wy: 0.68, nose: 0.92,
    slots: { wheel: 2, weapon: 1, armor: 1, shield: 1, util: 0 }, shape: 'scuttle',
    desc: 'Budget brawler with a shield emitter.' },
  { id: 'rammer', name: 'Battering Ram', rarity: 'rare', hp: 130, wt: 18, cap: 62, size: 1.15, turn: 0.9, wy: 0.8, nose: 1.0, ram: 2.4,
    slots: { wheel: 4, weapon: 1, armor: 2, shield: 0, util: 1 }, shape: 'ram',
    desc: 'Flat steel face. Ramming damage x2.4.' },
  { id: 'viper', name: 'Viper', rarity: 'rare', hp: 100, wt: 12, cap: 58, size: 1.08, turn: 1.3, wy: 0.6, nose: 1.2,
    slots: { wheel: 2, weapon: 2, armor: 1, shield: 0, util: 1 }, shape: 'viper',
    desc: 'Agile twin-weapon striker.' },
  { id: 'bastion', name: 'Bastion', rarity: 'epic', hp: 170, wt: 26, cap: 92, size: 1.3, turn: 0.84, wy: 0.86, nose: 1.0,
    slots: { wheel: 4, weapon: 2, armor: 3, shield: 1, util: 1 }, shape: 'bastion',
    desc: 'Walking bunker with three armor bays.' },
  { id: 'manta', name: 'Manta', rarity: 'epic', hp: 132, wt: 17, cap: 82, size: 1.2, turn: 1.15, wy: 0.7, nose: 1.1,
    slots: { wheel: 4, weapon: 2, armor: 1, shield: 1, util: 3 }, shape: 'manta',
    desc: 'Gadget platform with three utility bays.' },
  { id: 'colossus', name: 'Colossus', rarity: 'legendary', hp: 240, wt: 34, cap: 132, size: 1.5, turn: 0.72, wy: 0.9, nose: 1.05,
    slots: { wheel: 6, weapon: 3, armor: 3, shield: 1, util: 2 }, shape: 'colossus',
    desc: 'The biggest chassis allowed in the arena.' },
].map((p) => ({ ...p, cat: 'frame' }));

// ---------------------------------------------------------------------------
// WHEELS — one wheel type fills every wheel slot. power is per wheel.
// ---------------------------------------------------------------------------
const WHEELS = [
  { id: 'rubber', name: 'Rubber Wheels', rarity: 'common', power: 10, grip: 1.0, top: 1.0, wt: 1.5, style: 'wheel',
    desc: 'Dependable all-rounders.' },
  { id: 'knobby', name: 'Knobby Wheels', rarity: 'common', power: 9, grip: 1.3, top: 0.95, wt: 2, style: 'knobby',
    desc: 'Extra grip, tighter turns, less sliding.' },
  { id: 'omni', name: 'Omni Wheels', rarity: 'rare', power: 11, grip: 0.85, top: 1.05, turn: 1.35, wt: 1.5, style: 'omni',
    desc: 'Rollers let you pivot extremely fast.' },
  { id: 'tread', name: 'Tank Treads', rarity: 'rare', power: 13, grip: 1.55, top: 0.86, kb: 0.15, wt: 3.5, style: 'tread',
    desc: 'Huge traction. Resists knockback.' },
  { id: 'spiked', name: 'Spiked Rims', rarity: 'epic', power: 12, grip: 1.4, top: 0.96, contact: 6, wt: 3, style: 'spiked',
    desc: 'Grippy and hurt anything they bump.' },
  { id: 'maglev', name: 'Mag-Lev Pods', rarity: 'epic', power: 14, grip: 0.75, top: 1.14, hover: true, wt: 2.5, style: 'mag',
    desc: 'Hover over floor spikes and flame vents. Slippery.' },
  { id: 'turbine', name: 'Turbine Wheels', rarity: 'legendary', power: 17, grip: 1.25, top: 1.2, boostCd: 0.75, wt: 2.5, style: 'turbine',
    desc: 'Fastest wheels made. Boost recharges 25% faster.' },
  { id: 'caster', name: 'Swivel Casters', rarity: 'common', power: 8, grip: 0.9, top: 1.04, turn: 1.2, wt: 1, style: 'omni',
    desc: 'Light and twitchy, low power.' },
  { id: 'monster', name: 'Monster Tires', rarity: 'rare', power: 12, grip: 1.45, top: 0.98, kb: 0.08, wt: 3, style: 'knobby',
    desc: 'Big, grippy and hard to shove.' },
  { id: 'slick', name: 'Racing Slicks', rarity: 'rare', power: 12, grip: 0.8, top: 1.12, wt: 1.5, style: 'wheel',
    desc: 'High top speed, drifts in corners.' },
  { id: 'razor', name: 'Razor Treads', rarity: 'legendary', power: 14, grip: 1.6, top: 0.92, kb: 0.2, contact: 8, wt: 3.5, style: 'tread',
    desc: 'Bladed treads: traction, knockback resist and contact damage.' },
  { id: 'quantum', name: 'Quantum Rollers', rarity: 'legendary', power: 15, grip: 1.1, top: 1.12, turn: 1.4, hover: true, wt: 2, style: 'mag',
    desc: 'Hovering omni-rollers. Fast, nimble, hazard-proof.' },
].map((p) => ({ ...p, cat: 'wheel' }));

// ---------------------------------------------------------------------------
// WEAPONS
// kind: spin (hold to spin up, release energy on contact), hammer (tap, wind-up strike),
// flipper (tap, launches target), saw (hold, grind), flame (hold, cone + burn, overheats),
// gun (hold, auto-fire), rocket (tap, homing + splash), emp (tap, stun), rail (tap, charge beam)
// ---------------------------------------------------------------------------
const WEAPONS = [
  { id: 'bar', name: 'Bar Spinner', rarity: 'common', kind: 'spin', style: 'bar', dmg: 15, kb: 300, spinup: 0.95, range: 22, arc: 90, wt: 7,
    desc: 'HOLD to spin up, then ram. Hits harder the faster it spins.' },
  { id: 'hammer', name: 'Hammer', rarity: 'common', kind: 'hammer', style: 'hammer', dmg: 22, cd: 1.25, range: 44, arc: 80, pierce: 0.5, wt: 7,
    desc: 'TAP to slam. Ignores half of enemy armor.' },
  { id: 'flipper', name: 'Wedge Flipper', rarity: 'common', kind: 'flipper', style: 'flipper', dmg: 6, kb: 560, air: 0.7, cd: 1.6, range: 18, arc: 80, wt: 6,
    desc: 'TAP to launch enemies. Toss them into pits and hazards!' },
  { id: 'nailgun', name: 'Nail Gun', rarity: 'common', kind: 'gun', style: 'gun', dmg: 4, rof: 6, speed: 560, range: 440, wt: 5,
    desc: 'HOLD to fire a stream of nails.' },
  { id: 'drum', name: 'Drum Spinner', rarity: 'rare', kind: 'spin', style: 'drum', dmg: 21, kb: 420, spinup: 1.15, range: 20, arc: 80, lift: 0.3, wt: 9,
    desc: 'Compact energy drum. Pops enemies into the air.' },
  { id: 'saw', name: 'Buzz Saw', rarity: 'rare', kind: 'saw', style: 'saw', dps: 30, range: 22, arc: 70, wt: 6,
    desc: 'HOLD to grind anything in front of you.' },
  { id: 'axe', name: 'Battle Axe', rarity: 'rare', kind: 'hammer', style: 'axe', dmg: 32, cd: 1.7, range: 54, arc: 70, pierce: 0.6, wt: 9,
    desc: 'TAP for a heavy overhead chop with long reach.' },
  { id: 'flame', name: 'Flamethrower', rarity: 'rare', kind: 'flame', style: 'flame', dps: 16, burn: 4, range: 115, arc: 40, fuel: 2.8, wt: 6,
    desc: 'HOLD to roast. Sets enemies on fire. Overheats.' },
  { id: 'pflipper', name: 'Pneumatic Flipper', rarity: 'epic', kind: 'flipper', style: 'flipper2', dmg: 12, kb: 820, air: 1.05, cd: 1.5, range: 22, arc: 90, wt: 8,
    desc: 'Arena-clearing launch power.' },
  { id: 'disc', name: 'Disc Spinner', rarity: 'epic', kind: 'spin', style: 'disc', dmg: 28, kb: 520, spinup: 1.4, range: 26, arc: 90, wt: 10,
    desc: 'Massive horizontal disc. Devastating at full speed.' },
  { id: 'rocket', name: 'Rocket Pod', rarity: 'epic', kind: 'rocket', style: 'rocket', dmg: 26, radius: 70, kb: 280, cd: 2.2, speed: 360, range: 600, wt: 7,
    desc: 'TAP to launch a homing rocket with splash damage.' },
  { id: 'emp', name: 'EMP Lance', rarity: 'epic', kind: 'emp', style: 'emp', dmg: 8, stun: 1.3, cd: 3.6, speed: 520, range: 520, wt: 5,
    desc: 'TAP to stun and drain shields.' },
  { id: 'thunder', name: 'Vertical Thunder', rarity: 'legendary', kind: 'spin', style: 'vertical', dmg: 38, kb: 700, spinup: 1.6, range: 24, arc: 70, lift: 0.6, wt: 12,
    desc: 'Vertical spinner. Sends bots flying end over end.' },
  { id: 'plasma', name: 'Plasma Saw', rarity: 'legendary', kind: 'saw', style: 'plasma', dps: 52, range: 26, arc: 80, pierce: 0.4, wt: 7,
    desc: 'Superheated blade that melts through armor.' },
  { id: 'rail', name: 'Railgun', rarity: 'legendary', kind: 'rail', style: 'rail', dmg: 50, cd: 2.8, charge: 0.45, range: 900, pierce: 0.5, kb: 240, wt: 9,
    desc: 'TAP to charge and fire a piercing beam.' },
  { id: 'shredder', name: 'Shredder', rarity: 'common', kind: 'saw', style: 'saw', dps: 22, range: 20, arc: 70, wt: 5,
    desc: 'HOLD to grind. A cheap, reliable blade.' },
  { id: 'prod', name: 'Shock Prod', rarity: 'common', kind: 'emp', style: 'emp', dmg: 6, stun: 0.7, cd: 2.6, speed: 480, range: 260, wt: 3,
    desc: 'TAP for a short-range stun bolt.' },
  { id: 'eggbeater', name: 'Eggbeater', rarity: 'rare', kind: 'spin', style: 'drum', dmg: 19, kb: 380, spinup: 0.9, range: 20, arc: 80, lift: 0.2, wt: 8,
    desc: 'Quick to spin up, punchy hits.' },
  { id: 'sledge', name: 'Sledgehammer', rarity: 'rare', kind: 'hammer', style: 'hammer', dmg: 28, cd: 1.45, range: 48, arc: 80, pierce: 0.55, wt: 8,
    desc: 'TAP to slam. Heavier head, longer reach.' },
  { id: 'minigun', name: 'Minigun', rarity: 'rare', kind: 'gun', style: 'gun', dmg: 3, rof: 11, speed: 620, range: 460, wt: 7,
    desc: 'HOLD to shred with a wall of rivets.' },
  { id: 'napalm', name: 'Napalm Cannon', rarity: 'epic', kind: 'flame', style: 'flame', dps: 22, burn: 7, range: 135, arc: 36, fuel: 2.4, wt: 7,
    desc: 'HOLD for sticky fire that burns longer.' },
  { id: 'crusher', name: 'Hydraulic Crusher', rarity: 'epic', kind: 'hammer', style: 'axe', dmg: 44, cd: 2.0, range: 40, arc: 60, pierce: 0.8, wt: 10,
    desc: 'TAP to crush. Almost ignores armor.' },
  { id: 'pulse', name: 'Pulse Rifle', rarity: 'epic', kind: 'rail', style: 'rail', dmg: 30, cd: 1.9, charge: 0.3, range: 700, pierce: 0.3, kb: 160, wt: 6,
    desc: 'TAP for a fast-charging energy beam.' },
  { id: 'catapult', name: 'Catapult', rarity: 'legendary', kind: 'flipper', style: 'flipper2', dmg: 16, kb: 1050, air: 1.3, cd: 1.7, range: 24, arc: 90, wt: 9,
    desc: 'The strongest flipper ever built.' },
  { id: 'swarm', name: 'Swarm Pod', rarity: 'legendary', kind: 'rocket', style: 'rocket', dmg: 18, radius: 60, kb: 200, cd: 1.3, speed: 400, range: 650, wt: 7,
    desc: 'TAP for rapid homing micro-rockets.' },
  { id: 'reaper', name: 'Reaper Disc', rarity: 'legendary', kind: 'spin', style: 'disc', dmg: 34, kb: 600, spinup: 1.25, range: 28, arc: 100, wt: 11,
    desc: 'Wide, heavy disc that spins up fast.' },
].map((p) => ({ ...p, cat: 'weapon' }));

// ---------------------------------------------------------------------------
// ARMOR
// ---------------------------------------------------------------------------
const ARMOR = [
  { id: 'steel', name: 'Steel Plate', rarity: 'common', hp: 30, dr: 0.05, wt: 6, look: 'steel', desc: 'Basic bolt-on plating.' },
  { id: 'bumpers', name: 'Rubber Bumpers', rarity: 'common', hp: 16, dr: 0.02, kb: 0.35, wt: 3, look: 'rubber', desc: 'Soaks up knockback.' },
  { id: 'titanium', name: 'Titanium Shell', rarity: 'rare', hp: 45, dr: 0.1, wt: 6, look: 'titanium', desc: 'Light and tough.' },
  { id: 'spikes', name: 'Spiked Shell', rarity: 'rare', hp: 32, dr: 0.06, thorns: 0.25, wt: 6, look: 'spiked', desc: 'Reflects 25% of melee damage.' },
  { id: 'ceramic', name: 'Ablative Ceramic', rarity: 'epic', hp: 40, dr: 0.17, wt: 6, look: 'ceramic', desc: 'High damage reduction.' },
  { id: 'composite', name: 'Composite Weave', rarity: 'epic', hp: 75, dr: 0.1, kb: 0.1, wt: 8, look: 'composite', desc: 'Huge health boost.' },
  { id: 'neutronium', name: 'Neutronium Plate', rarity: 'legendary', hp: 100, dr: 0.2, kb: 0.15, wt: 11, look: 'neutron', desc: 'The densest armor in the league.' },
  { id: 'reactive', name: 'Reactive Plating', rarity: 'legendary', hp: 60, dr: 0.14, reactive: 260, wt: 7, look: 'reactive', desc: 'Blasts melee attackers away.' },
  { id: 'scrap', name: 'Scrap Plating', rarity: 'common', hp: 22, dr: 0.04, wt: 4, look: 'scrap', desc: 'Welded junk. Better than nothing.' },
  { id: 'kevlar', name: 'Kevlar Mesh', rarity: 'rare', hp: 36, dr: 0.07, kb: 0.12, wt: 3, look: 'kevlar', desc: 'Light weave that absorbs impacts.' },
  { id: 'bulkhead', name: 'Bulkhead Slab', rarity: 'rare', hp: 70, dr: 0.06, kb: 0.2, wt: 12, look: 'bulk', desc: 'Massive health, massive weight.' },
  { id: 'mirror', name: 'Mirror Plate', rarity: 'epic', hp: 38, dr: 0.1, thorns: 0.4, wt: 6, look: 'mirror', desc: 'Reflects 40% of melee damage.' },
  { id: 'dragon', name: 'Dragonscale', rarity: 'legendary', hp: 85, dr: 0.18, thorns: 0.15, wt: 8, look: 'dragon', desc: 'Overlapping scales that bite back.' },
].map((p) => ({ ...p, cat: 'armor' }));

// ---------------------------------------------------------------------------
// SHIELDS — absorb damage first, regenerate after a delay
// ---------------------------------------------------------------------------
const SHIELDS = [
  { id: 'deflector', name: 'Deflector', rarity: 'common', cap: 25, regen: 6, delay: 3.0, wt: 3, desc: 'Small regenerating barrier.' },
  { id: 'ion', name: 'Ion Barrier', rarity: 'rare', cap: 40, regen: 9, delay: 2.6, wt: 3, desc: 'Solid all-round shield.' },
  { id: 'hexshield', name: 'Hex Shield', rarity: 'epic', cap: 62, regen: 13, delay: 2.2, wt: 4, desc: 'Honeycomb energy lattice.' },
  { id: 'aegis', name: 'Aegis Core', rarity: 'legendary', cap: 95, regen: 18, delay: 1.8, wt: 4, desc: 'Near-impenetrable bubble.' },
  { id: 'bubble', name: 'Bubble Field', rarity: 'common', cap: 18, regen: 10, delay: 2.0, wt: 2, desc: 'Weak but recovers quickly.' },
  { id: 'flux', name: 'Flux Barrier', rarity: 'rare', cap: 55, regen: 6, delay: 3.4, wt: 4, desc: 'Big buffer, slow to recover.' },
  { id: 'phase', name: 'Phase Veil', rarity: 'epic', cap: 48, regen: 24, delay: 1.4, wt: 3, desc: 'Flickers back almost instantly.' },
  { id: 'fortress', name: 'Fortress Dome', rarity: 'legendary', cap: 130, regen: 10, delay: 3.0, wt: 6, desc: 'Enormous capacity.' },
].map((p) => ({ ...p, cat: 'shield' }));

// ---------------------------------------------------------------------------
// UTILITY
// ---------------------------------------------------------------------------
const UTILS = [
  { id: 'nitro', name: 'Nitro Booster', rarity: 'common', boost: 1.8, boostCd: 0.6, wt: 2, glyph: 'N', desc: 'Stronger boost, faster recharge.' },
  { id: 'drone', name: 'Repair Drone', rarity: 'rare', regen: 1.6, wt: 2, glyph: '+', desc: 'Repairs 1.6 HP per second.' },
  { id: 'gyro', name: 'Gyro Stabilizer', rarity: 'rare', stunRes: 0.5, kb: 0.2, wt: 2, glyph: 'G', desc: 'Halves stun and airtime, resists knockback.' },
  { id: 'overclock', name: 'Overclock Chip', rarity: 'epic', cdMul: 0.8, dmgMul: 1.1, wt: 1, glyph: 'O', desc: 'Weapons recharge 20% faster, +10% damage.' },
  { id: 'anchor', name: 'Anchor Magnet', rarity: 'epic', anchor: true, wt: 3, glyph: 'A', desc: 'Saves you from one pit fall per match.' },
  { id: 'targeting', name: 'Targeting AI', rarity: 'legendary', crit: 0.18, homing: 1.6, wt: 1, glyph: 'T', desc: '18% crits (x1.6), better rocket tracking.' },
  { id: 'nanoforge', name: 'Nano Forge', rarity: 'legendary', regen: 4, shieldRegen: 1.3, wt: 2, glyph: 'F', desc: 'Repairs 4 HP/s, faster shield regen.' },
  { id: 'ballast', name: 'Ballast Weights', rarity: 'common', kb: 0.35, wt: 5, glyph: 'B', desc: 'Heavy weights: much harder to shove.' },
  { id: 'patch', name: 'Patch Kit', rarity: 'common', regen: 0.8, wt: 1, glyph: 'P', desc: 'Repairs 0.8 HP per second.' },
  { id: 'coolant', name: 'Coolant Loop', rarity: 'rare', cdMul: 0.88, wt: 2, glyph: 'C', desc: 'Weapons recharge 12% faster.' },
  { id: 'capacitor', name: 'Shield Capacitor', rarity: 'rare', shieldRegen: 1.45, wt: 1, glyph: 'Q', desc: 'Shields regenerate 45% faster.' },
  { id: 'scanner', name: 'Weak-Point Scanner', rarity: 'epic', crit: 0.12, wt: 1, glyph: 'S', desc: '12% chance to crit (x1.6).' },
  { id: 'lucky', name: 'Lucky Bolt', rarity: 'epic', luck: 0.2, wt: 0.5, glyph: '$', desc: '+20% credits from every fight (+2% per level).' },
  { id: 'afterburner', name: 'Afterburner', rarity: 'legendary', boost: 2.4, boostCd: 0.45, wt: 2, glyph: 'X', desc: 'Huge boost that recharges very fast.' },
  { id: 'berserk', name: 'Berserker Core', rarity: 'legendary', dmgMul: 1.22, cdMul: 0.92, wt: 2, glyph: 'R', desc: '+22% damage, weapons recharge 8% faster.' },
].map((p) => ({ ...p, cat: 'util' }));

export const PARTS = [...FRAMES, ...WHEELS, ...WEAPONS, ...ARMOR, ...SHIELDS, ...UTILS];
export const PART = Object.fromEntries(PARTS.map((p) => [p.id, p]));

// Short stat lines for cards / pickers
export function partStats(p, lvl = 1) {
  const m = levelMult(lvl);
  const r = (v) => Math.round(v * m);
  switch (p.cat) {
    case 'frame': {
      const s = p.slots;
      const sl = [`${s.wheel} wheels`, `${s.weapon} weapon${s.weapon > 1 ? 's' : ''}`, `${s.armor} armor`];
      if (s.shield) sl.push('shield');
      if (s.util) sl.push(`${s.util} utility`);
      return [`HP ${Math.round(p.hp * 1.7 * m)} · Cap ${p.cap}kg`, sl.join(' · ')];
    }
    case 'wheel': return [`Power ${r(p.power)} · Grip ${p.grip.toFixed(2)}`, `Top speed x${p.top.toFixed(2)}`];
    case 'weapon': {
      if (p.kind === 'spin') return [`Hit ${r(p.dmg)} at full spin`, `Spin-up ${p.spinup}s`];
      if (p.kind === 'hammer') return [`Strike ${r(p.dmg)} · ${p.cd}s`, `Reach ${p.range}`];
      if (p.kind === 'flipper') return [`Launch ${r(p.kb)} · ${p.cd}s`, `Air ${p.air}s · Dmg ${r(p.dmg)}`];
      if (p.kind === 'saw') return [`${r(p.dps)} DPS grind`, p.pierce ? 'Armor piercing' : 'Short range'];
      if (p.kind === 'flame') return [`${r(p.dps)} DPS + burn`, `Range ${p.range}`];
      if (p.kind === 'gun') return [`${r(p.dmg)} x ${p.rof}/s`, `Range ${p.range}`];
      if (p.kind === 'rocket') return [`Blast ${r(p.dmg)} · ${p.cd}s`, 'Homing, splash'];
      if (p.kind === 'emp') return [`Stun ${p.stun}s · ${p.cd}s`, 'Drains shields'];
      if (p.kind === 'rail') return [`Beam ${r(p.dmg)} · ${p.cd}s`, 'Piercing'];
      return [];
    }
    case 'armor': {
      const a = [`HP +${Math.round(p.hp * 1.7 * m)} · DR ${Math.round(p.dr * 100 * (1 + 0.06 * (lvl - 1)))}%`];
      if (p.kb) a.push(`Knockback -${Math.round(p.kb * 100)}%`);
      else if (p.thorns) a.push(`Thorns ${Math.round(p.thorns * 100)}%`);
      else if (p.reactive) a.push('Reactive blast');
      else a.push(`${p.wt}kg`);
      return a;
    }
    case 'shield': return [`Capacity ${r(p.cap)}`, `Regen ${r(p.regen)}/s after ${p.delay}s`];
    case 'util': return [p.desc];
  }
  return [];
}

// ---------------------------------------------------------------------------
// ARENAS — world is 1400 x 1000 units.
// Hazards: pillar(circle), block(rect), spikes(rect, cycles), pit(rect, opens at pitOpen s),
// saw(circle killsaw, cycles), vent(circle flame vent, cycles), hammer(rect arena hammer)
// ---------------------------------------------------------------------------
export const WORLD = { w: 1400, h: 1000 };

export const ARENAS = {
  yard: {
    name: 'Training Yard', floor: '#0d1422', accent: '#2fd8ff',
    pillars: [{ x: 470, y: 330, r: 38 }, { x: 930, y: 670, r: 38 }],
    blocks: [], spikes: [], pits: [], saws: [], vents: [], hammers: [],
  },
  tutorial: {
    name: 'Training Yard', floor: '#0d1422', accent: '#2fd8ff',
    pillars: [{ x: 700, y: 250, r: 40 }],
    blocks: [], spikes: [{ x: 560, y: 760, w: 280, h: 50, period: 3, on: 1.6, offset: 0 }], pits: [], saws: [], vents: [], hammers: [],
  },
  scrapyard: {
    name: 'Scrapyard', floor: '#14110d', accent: '#ff9a3c',
    pillars: [{ x: 360, y: 250, r: 34 }, { x: 1040, y: 750, r: 34 }],
    blocks: [{ x: 640, y: 120, w: 120, h: 60 }, { x: 640, y: 820, w: 120, h: 60 }],
    spikes: [{ x: 520, y: 470, w: 60, h: 220, period: 3.2, on: 1.4, offset: 0 }, { x: 820, y: 310, w: 60, h: 220, period: 3.2, on: 1.4, offset: 1.6 }],
    pits: [], saws: [{ x: 200, y: 860, r: 34, period: 4, on: 2, offset: 0 }, { x: 1200, y: 140, r: 34, period: 4, on: 2, offset: 2 }], vents: [], hammers: [],
  },
  killsaw: {
    name: 'Killsaw Pit', floor: '#0f1018', accent: '#ff4d6d', pitOpen: 30,
    pillars: [{ x: 420, y: 500, r: 30 }, { x: 980, y: 500, r: 30 }],
    blocks: [],
    spikes: [],
    pits: [{ x: 620, y: 420, w: 160, h: 160 }],
    saws: [
      { x: 300, y: 120, r: 36, period: 3.4, on: 1.6, offset: 0 }, { x: 700, y: 100, r: 36, period: 3.4, on: 1.6, offset: 1.1 },
      { x: 1100, y: 120, r: 36, period: 3.4, on: 1.6, offset: 2.2 }, { x: 300, y: 880, r: 36, period: 3.4, on: 1.6, offset: 1.7 },
      { x: 700, y: 900, r: 36, period: 3.4, on: 1.6, offset: 0.5 }, { x: 1100, y: 880, r: 36, period: 3.4, on: 1.6, offset: 2.8 },
    ],
    vents: [], hammers: [],
  },
  inferno: {
    name: 'Inferno Box', floor: '#170c0b', accent: '#ff6a2a', pitOpen: 25,
    pillars: [{ x: 700, y: 500, r: 46 }],
    blocks: [],
    spikes: [{ x: 600, y: 120, w: 200, h: 46, period: 3, on: 1.3, offset: 0.4 }, { x: 600, y: 834, w: 200, h: 46, period: 3, on: 1.3, offset: 1.9 }],
    pits: [{ x: 120, y: 120, w: 120, h: 120 }, { x: 1160, y: 760, w: 120, h: 120 }],
    saws: [],
    vents: [
      { x: 420, y: 260, r: 48, period: 4.2, on: 1.7, offset: 0 }, { x: 980, y: 260, r: 48, period: 4.2, on: 1.7, offset: 2.1 },
      { x: 420, y: 740, r: 48, period: 4.2, on: 1.7, offset: 1.05 }, { x: 980, y: 740, r: 48, period: 4.2, on: 1.7, offset: 3.15 },
      { x: 700, y: 210, r: 40, period: 3.6, on: 1.2, offset: 1.8 }, { x: 700, y: 790, r: 40, period: 3.6, on: 1.2, offset: 0 },
    ],
    hammers: [],
  },
  grid: {
    name: 'The Grid', floor: '#0b0f1a', accent: '#c56bff', pitOpen: 20,
    pillars: [{ x: 430, y: 220, r: 30 }, { x: 970, y: 780, r: 30 }],
    blocks: [],
    spikes: [{ x: 300, y: 470, w: 60, h: 60, period: 2.4, on: 1.1, offset: 0 }, { x: 1040, y: 470, w: 60, h: 60, period: 2.4, on: 1.1, offset: 1.2 }],
    pits: [{ x: 640, y: 440, w: 120, h: 120 }],
    saws: [{ x: 700, y: 110, r: 36, period: 3, on: 1.4, offset: 0 }, { x: 700, y: 890, r: 36, period: 3, on: 1.4, offset: 1.5 }],
    vents: [{ x: 1180, y: 200, r: 44, period: 4, on: 1.6, offset: 0.6 }, { x: 220, y: 800, r: 44, period: 4, on: 1.6, offset: 2.6 }],
    hammers: [{ x: 140, y: 90, w: 170, h: 170, period: 5.5, offset: 1 }, { x: 1090, y: 740, w: 170, h: 170, period: 5.5, offset: 3.75 }],
  },
};

export function hazardList(a) {
  const out = [];
  if (a.pillars.length || a.blocks.length) out.push('Obstacles');
  if (a.spikes.length) out.push('Spike strips');
  if (a.saws.length) out.push('Killsaws');
  if (a.vents.length) out.push('Flame vents');
  if (a.hammers.length) out.push('Arena hammers');
  if (a.pits.length) out.push(`Pit opens at ${a.pitOpen}s`);
  return out;
}

// ---------------------------------------------------------------------------
// LEAGUES (progression series). Last match of each league is a boss.
// rarity: deal weights [common, rare, epic, legendary]
// ---------------------------------------------------------------------------
export const LEAGUES = [
  { id: 'rookie', name: 'Rookie Cup', arena: 'yard', matches: 4, power: 0, reward: 70, rarity: [76, 21, 3, 0], color: '#2fd8ff' },
  { id: 'scrap', name: 'Scrapyard Circuit', arena: 'scrapyard', matches: 5, power: 1, reward: 100, rarity: [58, 32, 9, 1], color: '#ff9a3c' },
  { id: 'steel', name: 'Steel Coliseum', arena: 'killsaw', matches: 5, power: 2, reward: 140, rarity: [42, 36, 18, 4], color: '#ff4d6d' },
  { id: 'inferno', name: 'Inferno League', arena: 'inferno', matches: 5, power: 3, reward: 190, rarity: [30, 36, 24, 10], color: '#ff6a2a' },
  { id: 'titan', name: 'Titan Championship', arena: 'grid', matches: 6, power: 4, reward: 250, rarity: [20, 34, 31, 15], color: '#c56bff' },
];
export const PRO = { id: 'pro', name: 'Pro Circuit', arenas: ['scrapyard', 'killsaw', 'inferno', 'grid'], reward: 300, rarity: [12, 32, 36, 20], color: '#ffd23f' };

export const BOSSES = [
  { name: 'GRINDER', title: 'Rookie Cup Champion', diff: 0.35,
    build: { frame: 'brick', wheel: 'rubber', weapons: ['hammer'], armor: ['bumpers'], shield: null, util: ['nitro'] }, lvl: 1 },
  { name: 'JUNKYARD DOG', title: 'Scrapyard Champion', diff: 0.5,
    build: { frame: 'wedge', wheel: 'knobby', weapons: ['flipper'], armor: ['titanium', 'spikes'], shield: 'deflector', util: [] }, lvl: 2 },
  { name: 'BLADESTORM', title: 'Coliseum Champion', diff: 0.55,
    build: { frame: 'stinger', wheel: 'omni', weapons: ['disc', 'saw'], armor: ['titanium'], shield: 'ion', util: ['nitro'] }, lvl: 1 },
  { name: 'HELLMOUTH', title: 'Inferno Champion', diff: 0.58,
    build: { frame: 'talon', wheel: 'tread', weapons: ['flame', 'axe'], armor: ['composite'], shield: 'hexshield', util: ['drone', 'gyro'] }, lvl: 1 },
  { name: 'OMEGA', title: 'Titan Champion', diff: 0.82,
    build: { frame: 'titan', wheel: 'turbine', weapons: ['thunder', 'rocket', 'pflipper'], armor: ['neutronium', 'reactive'], shield: 'aegis', util: ['nanoforge', 'overclock'] }, lvl: 3 },
];

export const BOT_NAMES = [
  'Rust Bucket', 'Sprocket', 'Tin Terror', 'Bolt Thrower', 'Scrap Rat', 'Gearjammer', 'Torque', 'Lugnut', 'Chomp',
  'Wrecktangle', 'Nibbler', 'Short Circuit', 'Ratchet', 'Clank', 'Vortex', 'Shredda', 'Iron Maw', 'Kilowatt', 'Slab',
  'Overvolt', 'Crankshaft', 'Mauler', 'Pinwheel', 'Dynamo', 'Razorback', 'Static', 'Hexbolt', 'Brawlr', 'Nightshade', 'Piston',
];

export const STARTER_BUILD = { frame: 'dart', wheel: 'rubber', weapons: ['bar'], armor: ['steel'], shield: null, util: [] };

export const TIPS = [
  'Spinners must spin up first. Hold the button before you make contact.',
  'Hit enemies from the side or back to avoid their front weapon.',
  'Flippers can toss enemies into pits for an instant knockout.',
  'Going over your frame\'s weight capacity slows you down.',
  'Shields recharge if you avoid damage for a few seconds.',
  'Mag-Lev Pods float over spike strips and flame vents.',
  'Buy duplicate cards to level parts up in the Garage. Parts go all the way to Lv 10.',
  'Quick Brawl is a great way to farm credits between series matches.',
  'Tough brawl opponents pay out a lot more.',
  'The Lucky Bolt utility boosts every credit payout.',
  'Rerolling the shop costs more each time. Spend wisely.',
  'If time runs out, the judges award the win on damage dealt.',
  'Boost to dodge a big hit or to slam into an enemy.',
];
