(() => {
  // js/data.js
  var RARITY = {
    common: { name: "Common", color: "#9fb0c3", price: 40 },
    rare: { name: "Rare", color: "#38b6ff", price: 95 },
    epic: { name: "Epic", color: "#b86bff", price: 190 },
    legendary: { name: "Legendary", color: "#ffb23f", price: 380 }
  };
  var RARITY_ORDER = ["common", "rare", "epic", "legendary"];
  var MAX_LEVEL = 10;
  var levelMult = (l) => 1 + 0.12 * ((l || 1) - 1);
  var CATS = {
    frame: "Frame",
    wheel: "Wheels",
    weapon: "Weapon",
    armor: "Armor",
    shield: "Shield",
    util: "Utility"
  };
  var FRAMES = [
    {
      id: "dart",
      name: "Dart",
      rarity: "common",
      hp: 80,
      wt: 10,
      cap: 34,
      size: 1,
      turn: 1.1,
      wy: 0.62,
      nose: 0.95,
      slots: { wheel: 2, weapon: 1, armor: 1, shield: 0, util: 0 },
      shape: "arrow",
      desc: "The classic cursor. Light, twitchy and cheap."
    },
    {
      id: "brick",
      name: "Brick",
      rarity: "common",
      hp: 115,
      wt: 16,
      cap: 52,
      size: 1.12,
      turn: 0.95,
      wy: 0.78,
      nose: 0.9,
      slots: { wheel: 4, weapon: 1, armor: 1, shield: 0, util: 1 },
      shape: "box",
      desc: "A sturdy box on four wheels with a utility bay."
    },
    {
      id: "wedge",
      name: "Wedge",
      rarity: "rare",
      hp: 105,
      wt: 14,
      cap: 54,
      size: 1.1,
      turn: 1,
      wy: 0.7,
      nose: 0.98,
      ram: 1.8,
      slots: { wheel: 2, weapon: 1, armor: 2, shield: 1, util: 0 },
      shape: "wedge",
      desc: "Low ramp front. Ramming damage x1.8."
    },
    {
      id: "stinger",
      name: "Stinger",
      rarity: "rare",
      hp: 90,
      wt: 11,
      cap: 50,
      size: 1.05,
      turn: 1.2,
      wy: 0.58,
      nose: 1.3,
      slots: { wheel: 2, weapon: 2, armor: 1, shield: 1, util: 1 },
      shape: "stinger",
      desc: "Needle-nosed duelist with twin hardpoints."
    },
    {
      id: "hexa",
      name: "Hexa Tank",
      rarity: "epic",
      hp: 155,
      wt: 24,
      cap: 82,
      size: 1.28,
      turn: 0.82,
      wy: 0.86,
      nose: 1,
      slots: { wheel: 6, weapon: 2, armor: 2, shield: 1, util: 1 },
      shape: "hex",
      desc: "Six-wheeled fortress. Slow to turn, hard to stop."
    },
    {
      id: "talon",
      name: "Talon",
      rarity: "epic",
      hp: 125,
      wt: 16,
      cap: 74,
      size: 1.15,
      turn: 1.08,
      wy: 0.72,
      nose: 1.15,
      slots: { wheel: 4, weapon: 2, armor: 1, shield: 1, util: 2 },
      shape: "talon",
      desc: "Predatory striker with a wide utility spine."
    },
    {
      id: "titan",
      name: "Titan",
      rarity: "legendary",
      hp: 200,
      wt: 28,
      cap: 112,
      size: 1.4,
      turn: 0.8,
      wy: 0.88,
      nose: 1.08,
      slots: { wheel: 6, weapon: 3, armor: 2, shield: 1, util: 2 },
      shape: "titan",
      desc: "Championship-class heavyweight. Three hardpoints."
    },
    {
      id: "phantom",
      name: "Phantom",
      rarity: "legendary",
      hp: 145,
      wt: 15,
      cap: 92,
      size: 1.18,
      turn: 1.25,
      wy: 0.6,
      nose: 1.25,
      slots: { wheel: 4, weapon: 3, armor: 1, shield: 1, util: 2 },
      shape: "phantom",
      desc: "Featherweight chassis with heavyweight firepower."
    },
    {
      id: "scuttler",
      name: "Scuttler",
      rarity: "common",
      hp: 92,
      wt: 11,
      cap: 42,
      size: 1.02,
      turn: 1.08,
      wy: 0.68,
      nose: 0.92,
      slots: { wheel: 2, weapon: 1, armor: 1, shield: 1, util: 0 },
      shape: "scuttle",
      desc: "Budget brawler with a shield emitter."
    },
    {
      id: "rammer",
      name: "Battering Ram",
      rarity: "rare",
      hp: 130,
      wt: 18,
      cap: 62,
      size: 1.15,
      turn: 0.9,
      wy: 0.8,
      nose: 1,
      ram: 2.4,
      slots: { wheel: 4, weapon: 1, armor: 2, shield: 0, util: 1 },
      shape: "ram",
      desc: "Flat steel face. Ramming damage x2.4."
    },
    {
      id: "viper",
      name: "Viper",
      rarity: "rare",
      hp: 100,
      wt: 12,
      cap: 58,
      size: 1.08,
      turn: 1.3,
      wy: 0.6,
      nose: 1.2,
      slots: { wheel: 2, weapon: 2, armor: 1, shield: 0, util: 1 },
      shape: "viper",
      desc: "Agile twin-weapon striker."
    },
    {
      id: "bastion",
      name: "Bastion",
      rarity: "epic",
      hp: 170,
      wt: 26,
      cap: 92,
      size: 1.3,
      turn: 0.84,
      wy: 0.86,
      nose: 1,
      slots: { wheel: 4, weapon: 2, armor: 3, shield: 1, util: 1 },
      shape: "bastion",
      desc: "Walking bunker with three armor bays."
    },
    {
      id: "manta",
      name: "Manta",
      rarity: "epic",
      hp: 132,
      wt: 17,
      cap: 82,
      size: 1.2,
      turn: 1.15,
      wy: 0.7,
      nose: 1.1,
      slots: { wheel: 4, weapon: 2, armor: 1, shield: 1, util: 3 },
      shape: "manta",
      desc: "Gadget platform with three utility bays."
    },
    {
      id: "colossus",
      name: "Colossus",
      rarity: "legendary",
      hp: 240,
      wt: 34,
      cap: 132,
      size: 1.5,
      turn: 0.72,
      wy: 0.9,
      nose: 1.05,
      slots: { wheel: 6, weapon: 3, armor: 3, shield: 1, util: 2 },
      shape: "colossus",
      desc: "The biggest chassis allowed in the arena."
    }
  ].map((p) => ({ ...p, cat: "frame" }));
  var WHEELS = [
    {
      id: "rubber",
      name: "Rubber Wheels",
      rarity: "common",
      power: 10,
      grip: 1,
      top: 1,
      wt: 1.5,
      style: "wheel",
      desc: "Dependable all-rounders."
    },
    {
      id: "knobby",
      name: "Knobby Wheels",
      rarity: "common",
      power: 9,
      grip: 1.3,
      top: 0.95,
      wt: 2,
      style: "knobby",
      desc: "Extra grip, tighter turns, less sliding."
    },
    {
      id: "omni",
      name: "Omni Wheels",
      rarity: "rare",
      power: 11,
      grip: 0.85,
      top: 1.05,
      turn: 1.35,
      wt: 1.5,
      style: "omni",
      desc: "Rollers let you pivot extremely fast."
    },
    {
      id: "tread",
      name: "Tank Treads",
      rarity: "rare",
      power: 13,
      grip: 1.55,
      top: 0.86,
      kb: 0.15,
      wt: 3.5,
      style: "tread",
      desc: "Huge traction. Resists knockback."
    },
    {
      id: "spiked",
      name: "Spiked Rims",
      rarity: "epic",
      power: 12,
      grip: 1.4,
      top: 0.96,
      contact: 6,
      wt: 3,
      style: "spiked",
      desc: "Grippy and hurt anything they bump."
    },
    {
      id: "maglev",
      name: "Mag-Lev Pods",
      rarity: "epic",
      power: 14,
      grip: 0.75,
      top: 1.14,
      hover: true,
      wt: 2.5,
      style: "mag",
      desc: "Hover over floor spikes and flame vents. Slippery."
    },
    {
      id: "turbine",
      name: "Turbine Wheels",
      rarity: "legendary",
      power: 17,
      grip: 1.25,
      top: 1.2,
      boostCd: 0.75,
      wt: 2.5,
      style: "turbine",
      desc: "Fastest wheels made. Boost recharges 25% faster."
    },
    {
      id: "caster",
      name: "Swivel Casters",
      rarity: "common",
      power: 8,
      grip: 0.9,
      top: 1.04,
      turn: 1.2,
      wt: 1,
      style: "omni",
      desc: "Light and twitchy, low power."
    },
    {
      id: "monster",
      name: "Monster Tires",
      rarity: "rare",
      power: 12,
      grip: 1.45,
      top: 0.98,
      kb: 0.08,
      wt: 3,
      style: "knobby",
      desc: "Big, grippy and hard to shove."
    },
    {
      id: "slick",
      name: "Racing Slicks",
      rarity: "rare",
      power: 12,
      grip: 0.8,
      top: 1.12,
      wt: 1.5,
      style: "wheel",
      desc: "High top speed, drifts in corners."
    },
    {
      id: "razor",
      name: "Razor Treads",
      rarity: "legendary",
      power: 14,
      grip: 1.6,
      top: 0.92,
      kb: 0.2,
      contact: 8,
      wt: 3.5,
      style: "tread",
      desc: "Bladed treads: traction, knockback resist and contact damage."
    },
    {
      id: "quantum",
      name: "Quantum Rollers",
      rarity: "legendary",
      power: 15,
      grip: 1.1,
      top: 1.12,
      turn: 1.4,
      hover: true,
      wt: 2,
      style: "mag",
      desc: "Hovering omni-rollers. Fast, nimble, hazard-proof."
    }
  ].map((p) => ({ ...p, cat: "wheel" }));
  var WEAPONS = [
    {
      id: "bar",
      name: "Bar Spinner",
      rarity: "common",
      kind: "spin",
      style: "bar",
      dmg: 15,
      kb: 300,
      spinup: 0.95,
      range: 22,
      arc: 90,
      wt: 7,
      desc: "HOLD to spin up, then ram. Hits harder the faster it spins."
    },
    {
      id: "hammer",
      name: "Hammer",
      rarity: "common",
      kind: "hammer",
      style: "hammer",
      dmg: 22,
      cd: 1.25,
      range: 44,
      arc: 80,
      pierce: 0.5,
      wt: 7,
      desc: "TAP to slam. Ignores half of enemy armor."
    },
    {
      id: "flipper",
      name: "Wedge Flipper",
      rarity: "common",
      kind: "flipper",
      style: "flipper",
      dmg: 6,
      kb: 560,
      air: 0.7,
      cd: 1.6,
      range: 18,
      arc: 80,
      wt: 6,
      desc: "TAP to launch enemies. Toss them into pits and hazards!"
    },
    {
      id: "nailgun",
      name: "Nail Gun",
      rarity: "common",
      kind: "gun",
      style: "gun",
      dmg: 4,
      rof: 6,
      speed: 560,
      range: 440,
      wt: 5,
      desc: "HOLD to fire a stream of nails."
    },
    {
      id: "drum",
      name: "Drum Spinner",
      rarity: "rare",
      kind: "spin",
      style: "drum",
      dmg: 21,
      kb: 420,
      spinup: 1.15,
      range: 20,
      arc: 80,
      lift: 0.3,
      wt: 9,
      desc: "Compact energy drum. Pops enemies into the air."
    },
    {
      id: "saw",
      name: "Buzz Saw",
      rarity: "rare",
      kind: "saw",
      style: "saw",
      dps: 30,
      range: 22,
      arc: 70,
      wt: 6,
      desc: "HOLD to grind anything in front of you."
    },
    {
      id: "axe",
      name: "Battle Axe",
      rarity: "rare",
      kind: "hammer",
      style: "axe",
      dmg: 32,
      cd: 1.7,
      range: 54,
      arc: 70,
      pierce: 0.6,
      wt: 9,
      desc: "TAP for a heavy overhead chop with long reach."
    },
    {
      id: "flame",
      name: "Flamethrower",
      rarity: "rare",
      kind: "flame",
      style: "flame",
      dps: 16,
      burn: 4,
      range: 115,
      arc: 40,
      fuel: 2.8,
      wt: 6,
      desc: "HOLD to roast. Sets enemies on fire. Overheats."
    },
    {
      id: "pflipper",
      name: "Pneumatic Flipper",
      rarity: "epic",
      kind: "flipper",
      style: "flipper2",
      dmg: 12,
      kb: 820,
      air: 1.05,
      cd: 1.5,
      range: 22,
      arc: 90,
      wt: 8,
      desc: "Arena-clearing launch power."
    },
    {
      id: "disc",
      name: "Disc Spinner",
      rarity: "epic",
      kind: "spin",
      style: "disc",
      dmg: 28,
      kb: 520,
      spinup: 1.4,
      range: 26,
      arc: 90,
      wt: 10,
      desc: "Massive horizontal disc. Devastating at full speed."
    },
    {
      id: "rocket",
      name: "Rocket Pod",
      rarity: "epic",
      kind: "rocket",
      style: "rocket",
      dmg: 26,
      radius: 70,
      kb: 280,
      cd: 2.2,
      speed: 360,
      range: 600,
      wt: 7,
      desc: "TAP to launch a homing rocket with splash damage."
    },
    {
      id: "emp",
      name: "EMP Lance",
      rarity: "epic",
      kind: "emp",
      style: "emp",
      dmg: 8,
      stun: 1.3,
      cd: 3.6,
      speed: 520,
      range: 520,
      wt: 5,
      desc: "TAP to stun and drain shields."
    },
    {
      id: "thunder",
      name: "Vertical Thunder",
      rarity: "legendary",
      kind: "spin",
      style: "vertical",
      dmg: 38,
      kb: 700,
      spinup: 1.6,
      range: 24,
      arc: 70,
      lift: 0.6,
      wt: 12,
      desc: "Vertical spinner. Sends bots flying end over end."
    },
    {
      id: "plasma",
      name: "Plasma Saw",
      rarity: "legendary",
      kind: "saw",
      style: "plasma",
      dps: 52,
      range: 26,
      arc: 80,
      pierce: 0.4,
      wt: 7,
      desc: "Superheated blade that melts through armor."
    },
    {
      id: "rail",
      name: "Railgun",
      rarity: "legendary",
      kind: "rail",
      style: "rail",
      dmg: 50,
      cd: 2.8,
      charge: 0.45,
      range: 900,
      pierce: 0.5,
      kb: 240,
      wt: 9,
      desc: "TAP to charge and fire a piercing beam."
    },
    {
      id: "shredder",
      name: "Shredder",
      rarity: "common",
      kind: "saw",
      style: "saw",
      dps: 22,
      range: 20,
      arc: 70,
      wt: 5,
      desc: "HOLD to grind. A cheap, reliable blade."
    },
    {
      id: "prod",
      name: "Shock Prod",
      rarity: "common",
      kind: "emp",
      style: "emp",
      dmg: 6,
      stun: 0.7,
      cd: 2.6,
      speed: 480,
      range: 260,
      wt: 3,
      desc: "TAP for a short-range stun bolt."
    },
    {
      id: "eggbeater",
      name: "Eggbeater",
      rarity: "rare",
      kind: "spin",
      style: "drum",
      dmg: 19,
      kb: 380,
      spinup: 0.9,
      range: 20,
      arc: 80,
      lift: 0.2,
      wt: 8,
      desc: "Quick to spin up, punchy hits."
    },
    {
      id: "sledge",
      name: "Sledgehammer",
      rarity: "rare",
      kind: "hammer",
      style: "hammer",
      dmg: 28,
      cd: 1.45,
      range: 48,
      arc: 80,
      pierce: 0.55,
      wt: 8,
      desc: "TAP to slam. Heavier head, longer reach."
    },
    {
      id: "minigun",
      name: "Minigun",
      rarity: "rare",
      kind: "gun",
      style: "gun",
      dmg: 3,
      rof: 11,
      speed: 620,
      range: 460,
      wt: 7,
      desc: "HOLD to shred with a wall of rivets."
    },
    {
      id: "napalm",
      name: "Napalm Cannon",
      rarity: "epic",
      kind: "flame",
      style: "flame",
      dps: 22,
      burn: 7,
      range: 135,
      arc: 36,
      fuel: 2.4,
      wt: 7,
      desc: "HOLD for sticky fire that burns longer."
    },
    {
      id: "crusher",
      name: "Hydraulic Crusher",
      rarity: "epic",
      kind: "hammer",
      style: "axe",
      dmg: 44,
      cd: 2,
      range: 40,
      arc: 60,
      pierce: 0.8,
      wt: 10,
      desc: "TAP to crush. Almost ignores armor."
    },
    {
      id: "pulse",
      name: "Pulse Rifle",
      rarity: "epic",
      kind: "rail",
      style: "rail",
      dmg: 30,
      cd: 1.9,
      charge: 0.3,
      range: 700,
      pierce: 0.3,
      kb: 160,
      wt: 6,
      desc: "TAP for a fast-charging energy beam."
    },
    {
      id: "catapult",
      name: "Catapult",
      rarity: "legendary",
      kind: "flipper",
      style: "flipper2",
      dmg: 16,
      kb: 1050,
      air: 1.3,
      cd: 1.7,
      range: 24,
      arc: 90,
      wt: 9,
      desc: "The strongest flipper ever built."
    },
    {
      id: "swarm",
      name: "Swarm Pod",
      rarity: "legendary",
      kind: "rocket",
      style: "rocket",
      dmg: 18,
      radius: 60,
      kb: 200,
      cd: 1.3,
      speed: 400,
      range: 650,
      wt: 7,
      desc: "TAP for rapid homing micro-rockets."
    },
    {
      id: "reaper",
      name: "Reaper Disc",
      rarity: "legendary",
      kind: "spin",
      style: "disc",
      dmg: 34,
      kb: 600,
      spinup: 1.25,
      range: 28,
      arc: 100,
      wt: 11,
      desc: "Wide, heavy disc that spins up fast."
    }
  ].map((p) => ({ ...p, cat: "weapon" }));
  var ARMOR = [
    { id: "steel", name: "Steel Plate", rarity: "common", hp: 30, dr: 0.05, wt: 6, look: "steel", desc: "Basic bolt-on plating." },
    { id: "bumpers", name: "Rubber Bumpers", rarity: "common", hp: 16, dr: 0.02, kb: 0.35, wt: 3, look: "rubber", desc: "Soaks up knockback." },
    { id: "titanium", name: "Titanium Shell", rarity: "rare", hp: 45, dr: 0.1, wt: 6, look: "titanium", desc: "Light and tough." },
    { id: "spikes", name: "Spiked Shell", rarity: "rare", hp: 32, dr: 0.06, thorns: 0.25, wt: 6, look: "spiked", desc: "Reflects 25% of melee damage." },
    { id: "ceramic", name: "Ablative Ceramic", rarity: "epic", hp: 40, dr: 0.17, wt: 6, look: "ceramic", desc: "High damage reduction." },
    { id: "composite", name: "Composite Weave", rarity: "epic", hp: 75, dr: 0.1, kb: 0.1, wt: 8, look: "composite", desc: "Huge health boost." },
    { id: "neutronium", name: "Neutronium Plate", rarity: "legendary", hp: 100, dr: 0.2, kb: 0.15, wt: 11, look: "neutron", desc: "The densest armor in the league." },
    { id: "reactive", name: "Reactive Plating", rarity: "legendary", hp: 60, dr: 0.14, reactive: 260, wt: 7, look: "reactive", desc: "Blasts melee attackers away." },
    { id: "scrap", name: "Scrap Plating", rarity: "common", hp: 22, dr: 0.04, wt: 4, look: "scrap", desc: "Welded junk. Better than nothing." },
    { id: "kevlar", name: "Kevlar Mesh", rarity: "rare", hp: 36, dr: 0.07, kb: 0.12, wt: 3, look: "kevlar", desc: "Light weave that absorbs impacts." },
    { id: "bulkhead", name: "Bulkhead Slab", rarity: "rare", hp: 70, dr: 0.06, kb: 0.2, wt: 12, look: "bulk", desc: "Massive health, massive weight." },
    { id: "mirror", name: "Mirror Plate", rarity: "epic", hp: 38, dr: 0.1, thorns: 0.4, wt: 6, look: "mirror", desc: "Reflects 40% of melee damage." },
    { id: "dragon", name: "Dragonscale", rarity: "legendary", hp: 85, dr: 0.18, thorns: 0.15, wt: 8, look: "dragon", desc: "Overlapping scales that bite back." }
  ].map((p) => ({ ...p, cat: "armor" }));
  var SHIELDS = [
    { id: "deflector", name: "Deflector", rarity: "common", cap: 25, regen: 6, delay: 3, wt: 3, desc: "Small regenerating barrier." },
    { id: "ion", name: "Ion Barrier", rarity: "rare", cap: 40, regen: 9, delay: 2.6, wt: 3, desc: "Solid all-round shield." },
    { id: "hexshield", name: "Hex Shield", rarity: "epic", cap: 62, regen: 13, delay: 2.2, wt: 4, desc: "Honeycomb energy lattice." },
    { id: "aegis", name: "Aegis Core", rarity: "legendary", cap: 95, regen: 18, delay: 1.8, wt: 4, desc: "Near-impenetrable bubble." },
    { id: "bubble", name: "Bubble Field", rarity: "common", cap: 18, regen: 10, delay: 2, wt: 2, desc: "Weak but recovers quickly." },
    { id: "flux", name: "Flux Barrier", rarity: "rare", cap: 55, regen: 6, delay: 3.4, wt: 4, desc: "Big buffer, slow to recover." },
    { id: "phase", name: "Phase Veil", rarity: "epic", cap: 48, regen: 24, delay: 1.4, wt: 3, desc: "Flickers back almost instantly." },
    { id: "fortress", name: "Fortress Dome", rarity: "legendary", cap: 130, regen: 10, delay: 3, wt: 6, desc: "Enormous capacity." }
  ].map((p) => ({ ...p, cat: "shield" }));
  var UTILS = [
    { id: "nitro", name: "Nitro Booster", rarity: "common", boost: 1.8, boostCd: 0.6, wt: 2, glyph: "N", desc: "Stronger boost, faster recharge." },
    { id: "drone", name: "Repair Drone", rarity: "rare", regen: 1.6, wt: 2, glyph: "+", desc: "Repairs 1.6 HP per second." },
    { id: "gyro", name: "Gyro Stabilizer", rarity: "rare", stunRes: 0.5, kb: 0.2, wt: 2, glyph: "G", desc: "Halves stun and airtime, resists knockback." },
    { id: "overclock", name: "Overclock Chip", rarity: "epic", cdMul: 0.8, dmgMul: 1.1, wt: 1, glyph: "O", desc: "Weapons recharge 20% faster, +10% damage." },
    { id: "anchor", name: "Anchor Magnet", rarity: "epic", anchor: true, wt: 3, glyph: "A", desc: "Saves you from one pit fall per match." },
    { id: "targeting", name: "Targeting AI", rarity: "legendary", crit: 0.18, homing: 1.6, wt: 1, glyph: "T", desc: "18% crits (x1.6), better rocket tracking." },
    { id: "nanoforge", name: "Nano Forge", rarity: "legendary", regen: 4, shieldRegen: 1.3, wt: 2, glyph: "F", desc: "Repairs 4 HP/s, faster shield regen." },
    { id: "ballast", name: "Ballast Weights", rarity: "common", kb: 0.35, wt: 5, glyph: "B", desc: "Heavy weights: much harder to shove." },
    { id: "patch", name: "Patch Kit", rarity: "common", regen: 0.8, wt: 1, glyph: "P", desc: "Repairs 0.8 HP per second." },
    { id: "coolant", name: "Coolant Loop", rarity: "rare", cdMul: 0.88, wt: 2, glyph: "C", desc: "Weapons recharge 12% faster." },
    { id: "capacitor", name: "Shield Capacitor", rarity: "rare", shieldRegen: 1.45, wt: 1, glyph: "Q", desc: "Shields regenerate 45% faster." },
    { id: "scanner", name: "Weak-Point Scanner", rarity: "epic", crit: 0.12, wt: 1, glyph: "S", desc: "12% chance to crit (x1.6)." },
    { id: "lucky", name: "Lucky Bolt", rarity: "epic", luck: 0.2, wt: 0.5, glyph: "$", desc: "+20% credits from every fight (+2% per level)." },
    { id: "afterburner", name: "Afterburner", rarity: "legendary", boost: 2.4, boostCd: 0.45, wt: 2, glyph: "X", desc: "Huge boost that recharges very fast." },
    { id: "berserk", name: "Berserker Core", rarity: "legendary", dmgMul: 1.22, cdMul: 0.92, wt: 2, glyph: "R", desc: "+22% damage, weapons recharge 8% faster." }
  ].map((p) => ({ ...p, cat: "util" }));
  var PARTS = [...FRAMES, ...WHEELS, ...WEAPONS, ...ARMOR, ...SHIELDS, ...UTILS];
  var PART = Object.fromEntries(PARTS.map((p) => [p.id, p]));
  function partStats(p, lvl2 = 1) {
    const m = levelMult(lvl2);
    const r = (v) => Math.round(v * m);
    switch (p.cat) {
      case "frame": {
        const s = p.slots;
        const sl = [`${s.wheel} wheels`, `${s.weapon} weapon${s.weapon > 1 ? "s" : ""}`, `${s.armor} armor`];
        if (s.shield) sl.push("shield");
        if (s.util) sl.push(`${s.util} utility`);
        return [`HP ${Math.round(p.hp * 1.7 * m)} \xB7 Cap ${p.cap}kg`, sl.join(" \xB7 ")];
      }
      case "wheel":
        return [`Power ${r(p.power)} \xB7 Grip ${p.grip.toFixed(2)}`, `Top speed x${p.top.toFixed(2)}`];
      case "weapon": {
        if (p.kind === "spin") return [`Hit ${r(p.dmg)} at full spin`, `Spin-up ${p.spinup}s`];
        if (p.kind === "hammer") return [`Strike ${r(p.dmg)} \xB7 ${p.cd}s`, `Reach ${p.range}`];
        if (p.kind === "flipper") return [`Launch ${r(p.kb)} \xB7 ${p.cd}s`, `Air ${p.air}s \xB7 Dmg ${r(p.dmg)}`];
        if (p.kind === "saw") return [`${r(p.dps)} DPS grind`, p.pierce ? "Armor piercing" : "Short range"];
        if (p.kind === "flame") return [`${r(p.dps)} DPS + burn`, `Range ${p.range}`];
        if (p.kind === "gun") return [`${r(p.dmg)} x ${p.rof}/s`, `Range ${p.range}`];
        if (p.kind === "rocket") return [`Blast ${r(p.dmg)} \xB7 ${p.cd}s`, "Homing, splash"];
        if (p.kind === "emp") return [`Stun ${p.stun}s \xB7 ${p.cd}s`, "Drains shields"];
        if (p.kind === "rail") return [`Beam ${r(p.dmg)} \xB7 ${p.cd}s`, "Piercing"];
        return [];
      }
      case "armor": {
        const a = [`HP +${Math.round(p.hp * 1.7 * m)} \xB7 DR ${Math.round(p.dr * 100 * (1 + 0.06 * (lvl2 - 1)))}%`];
        if (p.kb) a.push(`Knockback -${Math.round(p.kb * 100)}%`);
        else if (p.thorns) a.push(`Thorns ${Math.round(p.thorns * 100)}%`);
        else if (p.reactive) a.push("Reactive blast");
        else a.push(`${p.wt}kg`);
        return a;
      }
      case "shield":
        return [`Capacity ${r(p.cap)}`, `Regen ${r(p.regen)}/s after ${p.delay}s`];
      case "util":
        return [p.desc];
    }
    return [];
  }
  var WORLD = { w: 1400, h: 1e3 };
  var ARENAS = {
    yard: {
      name: "Training Yard",
      floor: "#0d1422",
      accent: "#2fd8ff",
      pillars: [{ x: 470, y: 330, r: 38 }, { x: 930, y: 670, r: 38 }],
      blocks: [],
      spikes: [],
      pits: [],
      saws: [],
      vents: [],
      hammers: []
    },
    tutorial: {
      name: "Training Yard",
      floor: "#0d1422",
      accent: "#2fd8ff",
      pillars: [{ x: 700, y: 250, r: 40 }],
      blocks: [],
      spikes: [{ x: 560, y: 760, w: 280, h: 50, period: 3, on: 1.6, offset: 0 }],
      pits: [],
      saws: [],
      vents: [],
      hammers: []
    },
    scrapyard: {
      name: "Scrapyard",
      floor: "#14110d",
      accent: "#ff9a3c",
      pillars: [{ x: 360, y: 250, r: 34 }, { x: 1040, y: 750, r: 34 }],
      blocks: [{ x: 640, y: 120, w: 120, h: 60 }, { x: 640, y: 820, w: 120, h: 60 }],
      spikes: [{ x: 520, y: 470, w: 60, h: 220, period: 3.2, on: 1.4, offset: 0 }, { x: 820, y: 310, w: 60, h: 220, period: 3.2, on: 1.4, offset: 1.6 }],
      pits: [],
      saws: [{ x: 200, y: 860, r: 34, period: 4, on: 2, offset: 0 }, { x: 1200, y: 140, r: 34, period: 4, on: 2, offset: 2 }],
      vents: [],
      hammers: []
    },
    killsaw: {
      name: "Killsaw Pit",
      floor: "#0f1018",
      accent: "#ff4d6d",
      pitOpen: 30,
      pillars: [{ x: 420, y: 500, r: 30 }, { x: 980, y: 500, r: 30 }],
      blocks: [],
      spikes: [],
      pits: [{ x: 620, y: 420, w: 160, h: 160 }],
      saws: [
        { x: 300, y: 120, r: 36, period: 3.4, on: 1.6, offset: 0 },
        { x: 700, y: 100, r: 36, period: 3.4, on: 1.6, offset: 1.1 },
        { x: 1100, y: 120, r: 36, period: 3.4, on: 1.6, offset: 2.2 },
        { x: 300, y: 880, r: 36, period: 3.4, on: 1.6, offset: 1.7 },
        { x: 700, y: 900, r: 36, period: 3.4, on: 1.6, offset: 0.5 },
        { x: 1100, y: 880, r: 36, period: 3.4, on: 1.6, offset: 2.8 }
      ],
      vents: [],
      hammers: []
    },
    inferno: {
      name: "Inferno Box",
      floor: "#170c0b",
      accent: "#ff6a2a",
      pitOpen: 25,
      pillars: [{ x: 700, y: 500, r: 46 }],
      blocks: [],
      spikes: [{ x: 600, y: 120, w: 200, h: 46, period: 3, on: 1.3, offset: 0.4 }, { x: 600, y: 834, w: 200, h: 46, period: 3, on: 1.3, offset: 1.9 }],
      pits: [{ x: 120, y: 120, w: 120, h: 120 }, { x: 1160, y: 760, w: 120, h: 120 }],
      saws: [],
      vents: [
        { x: 420, y: 260, r: 48, period: 4.2, on: 1.7, offset: 0 },
        { x: 980, y: 260, r: 48, period: 4.2, on: 1.7, offset: 2.1 },
        { x: 420, y: 740, r: 48, period: 4.2, on: 1.7, offset: 1.05 },
        { x: 980, y: 740, r: 48, period: 4.2, on: 1.7, offset: 3.15 },
        { x: 700, y: 210, r: 40, period: 3.6, on: 1.2, offset: 1.8 },
        { x: 700, y: 790, r: 40, period: 3.6, on: 1.2, offset: 0 }
      ],
      hammers: []
    },
    grid: {
      name: "The Grid",
      floor: "#0b0f1a",
      accent: "#c56bff",
      pitOpen: 20,
      pillars: [{ x: 430, y: 220, r: 30 }, { x: 970, y: 780, r: 30 }],
      blocks: [],
      spikes: [{ x: 300, y: 470, w: 60, h: 60, period: 2.4, on: 1.1, offset: 0 }, { x: 1040, y: 470, w: 60, h: 60, period: 2.4, on: 1.1, offset: 1.2 }],
      pits: [{ x: 640, y: 440, w: 120, h: 120 }],
      saws: [{ x: 700, y: 110, r: 36, period: 3, on: 1.4, offset: 0 }, { x: 700, y: 890, r: 36, period: 3, on: 1.4, offset: 1.5 }],
      vents: [{ x: 1180, y: 200, r: 44, period: 4, on: 1.6, offset: 0.6 }, { x: 220, y: 800, r: 44, period: 4, on: 1.6, offset: 2.6 }],
      hammers: [{ x: 140, y: 90, w: 170, h: 170, period: 5.5, offset: 1 }, { x: 1090, y: 740, w: 170, h: 170, period: 5.5, offset: 3.75 }]
    }
  };
  function hazardList(a) {
    const out = [];
    if (a.pillars.length || a.blocks.length) out.push("Obstacles");
    if (a.spikes.length) out.push("Spike strips");
    if (a.saws.length) out.push("Killsaws");
    if (a.vents.length) out.push("Flame vents");
    if (a.hammers.length) out.push("Arena hammers");
    if (a.pits.length) out.push(`Pit opens at ${a.pitOpen}s`);
    return out;
  }
  var LEAGUES = [
    { id: "rookie", name: "Rookie Cup", arena: "yard", matches: 4, power: 0, reward: 70, rarity: [76, 21, 3, 0], color: "#2fd8ff" },
    { id: "scrap", name: "Scrapyard Circuit", arena: "scrapyard", matches: 5, power: 1, reward: 100, rarity: [58, 32, 9, 1], color: "#ff9a3c" },
    { id: "steel", name: "Steel Coliseum", arena: "killsaw", matches: 5, power: 2, reward: 140, rarity: [42, 36, 18, 4], color: "#ff4d6d" },
    { id: "inferno", name: "Inferno League", arena: "inferno", matches: 5, power: 3, reward: 190, rarity: [30, 36, 24, 10], color: "#ff6a2a" },
    { id: "titan", name: "Titan Championship", arena: "grid", matches: 6, power: 4, reward: 250, rarity: [20, 34, 31, 15], color: "#c56bff" }
  ];
  var PRO = { id: "pro", name: "Pro Circuit", arenas: ["scrapyard", "killsaw", "inferno", "grid"], reward: 300, rarity: [12, 32, 36, 20], color: "#ffd23f" };
  var BOSSES = [
    {
      name: "GRINDER",
      title: "Rookie Cup Champion",
      diff: 0.35,
      build: { frame: "brick", wheel: "rubber", weapons: ["hammer"], armor: ["bumpers"], shield: null, util: ["nitro"] },
      lvl: 1
    },
    {
      name: "JUNKYARD DOG",
      title: "Scrapyard Champion",
      diff: 0.5,
      build: { frame: "wedge", wheel: "knobby", weapons: ["flipper"], armor: ["titanium", "spikes"], shield: "deflector", util: [] },
      lvl: 2
    },
    {
      name: "BLADESTORM",
      title: "Coliseum Champion",
      diff: 0.55,
      build: { frame: "stinger", wheel: "omni", weapons: ["disc", "saw"], armor: ["titanium"], shield: "ion", util: ["nitro"] },
      lvl: 1
    },
    {
      name: "HELLMOUTH",
      title: "Inferno Champion",
      diff: 0.58,
      build: { frame: "talon", wheel: "tread", weapons: ["flame", "axe"], armor: ["composite"], shield: "hexshield", util: ["drone", "gyro"] },
      lvl: 1
    },
    {
      name: "OMEGA",
      title: "Titan Champion",
      diff: 0.82,
      build: { frame: "titan", wheel: "turbine", weapons: ["thunder", "rocket", "pflipper"], armor: ["neutronium", "reactive"], shield: "aegis", util: ["nanoforge", "overclock"] },
      lvl: 3
    }
  ];
  var BOT_NAMES = [
    "Rust Bucket",
    "Sprocket",
    "Tin Terror",
    "Bolt Thrower",
    "Scrap Rat",
    "Gearjammer",
    "Torque",
    "Lugnut",
    "Chomp",
    "Wrecktangle",
    "Nibbler",
    "Short Circuit",
    "Ratchet",
    "Clank",
    "Vortex",
    "Shredda",
    "Iron Maw",
    "Kilowatt",
    "Slab",
    "Overvolt",
    "Crankshaft",
    "Mauler",
    "Pinwheel",
    "Dynamo",
    "Razorback",
    "Static",
    "Hexbolt",
    "Brawlr",
    "Nightshade",
    "Piston"
  ];
  var STARTER_BUILD = { frame: "dart", wheel: "rubber", weapons: ["bar"], armor: ["steel"], shield: null, util: [] };
  var TIPS = [
    "Spinners must spin up first. Hold the button before you make contact.",
    "Hit enemies from the side or back to avoid their front weapon.",
    "Flippers can toss enemies into pits for an instant knockout.",
    "Going over your frame's weight capacity slows you down.",
    "Shields recharge if you avoid damage for a few seconds.",
    "Mag-Lev Pods float over spike strips and flame vents.",
    "Buy duplicate cards to level parts up in the Garage. Parts go all the way to Lv 10.",
    "Quick Brawl is a great way to farm credits between series matches.",
    "Tough brawl opponents pay out a lot more.",
    "The Lucky Bolt utility boosts every credit payout.",
    "Rerolling the shop costs more each time. Spend wisely.",
    "If time runs out, the judges award the win on damage dealt.",
    "Boost to dodge a big hit or to slam into an enemy."
  ];

  // js/render.js
  var TAU = Math.PI * 2;
  var SHAPES = {
    arrow: [[1.1, 0], [-0.8, -0.78], [-0.42, 0], [-0.8, 0.78]],
    box: [[0.95, 0], [0.62, -0.72], [-0.82, -0.72], [-0.6, 0], [-0.82, 0.72], [0.62, 0.72]],
    wedge: [[1.05, 0], [-0.78, -0.98], [-0.62, 0], [-0.78, 0.98]],
    stinger: [[1.4, 0], [-0.25, -0.46], [-0.9, -0.74], [-0.58, 0], [-0.9, 0.74], [-0.25, 0.46]],
    hex: [[1.05, 0], [0.52, -0.88], [-0.52, -0.88], [-1, 0], [-0.52, 0.88], [0.52, 0.88]],
    talon: [[1.25, 0], [0.22, -0.42], [-0.2, -1], [-0.72, -0.62], [-0.48, 0], [-0.72, 0.62], [-0.2, 1], [0.22, 0.42]],
    titan: [[1.12, 0], [0.72, -0.62], [0.1, -0.96], [-0.92, -0.86], [-0.68, 0], [-0.92, 0.86], [0.1, 0.96], [0.72, 0.62]],
    scuttle: [[1, 0], [0.4, -0.62], [-0.7, -0.82], [-0.92, -0.3], [-0.92, 0.3], [-0.7, 0.82], [0.4, 0.62]],
    ram: [[1, -0.4], [1, 0.4], [0.5, 0.88], [-0.85, 0.88], [-0.6, 0], [-0.85, -0.88], [0.5, -0.88]],
    viper: [[1.3, 0], [0.5, -0.3], [-0.3, -0.75], [-1, -0.55], [-0.7, 0], [-1, 0.55], [-0.3, 0.75], [0.5, 0.3]],
    bastion: [[1, 0.42], [1, -0.42], [0.45, -0.96], [-0.45, -0.96], [-1, -0.45], [-1, 0.45], [-0.45, 0.96], [0.45, 0.96]],
    manta: [[1.15, 0], [0.3, -0.5], [-0.1, -1.1], [-0.55, -0.95], [-0.85, -0.2], [-0.85, 0.2], [-0.55, 0.95], [-0.1, 1.1], [0.3, 0.5]],
    colossus: [[1.1, 0], [0.8, -0.5], [0.5, -0.96], [-0.3, -1], [-0.95, -0.72], [-0.75, 0], [-0.95, 0.72], [-0.3, 1], [0.5, 0.96], [0.8, 0.5]],
    phantom: [[1.35, 0], [0, -0.34], [-0.4, -1.05], [-0.56, -0.3], [-0.92, 0], [-0.56, 0.3], [-0.4, 1.05], [0, 0.34]]
  };
  var TEAM = {
    player: { accent: "#3ff0ff", glow: "rgba(63,240,255,0.55)", body: "#16202e", body2: "#233246" },
    enemy: { accent: "#ff4d7a", glow: "rgba(255,77,122,0.55)", body: "#24141c", body2: "#3a1e2a" },
    boss: { accent: "#ffb23f", glow: "rgba(255,178,63,0.6)", body: "#261c10", body2: "#3d2c15" },
    dummy: { accent: "#ffd23f", glow: "rgba(255,210,63,0.4)", body: "#2a2a2a", body2: "#3a3a3a" }
  };
  var ARMOR_LOOK = {
    steel: { fill: "#5b6574", edge: "#8e99a8" },
    rubber: { fill: "#2a2a2e", edge: "#55555c" },
    titanium: { fill: "#6d7f95", edge: "#b4c6dc" },
    spiked: { fill: "#4a4f58", edge: "#c9ced6", spikes: true },
    ceramic: { fill: "#c9c2b3", edge: "#efe9dc" },
    composite: { fill: "#2f3b2f", edge: "#7fa07f" },
    neutron: { fill: "#2a2140", edge: "#a98bff", glow: "#8a6bff" },
    reactive: { fill: "#4a2a1a", edge: "#ff9a3c", glow: "#ff7a1a" },
    scrap: { fill: "#4a3f33", edge: "#8a7a62" },
    kevlar: { fill: "#3a3a22", edge: "#c8c27a" },
    bulk: { fill: "#3c4450", edge: "#6f7b8c" },
    mirror: { fill: "#9fb6c8", edge: "#f2fbff", glow: "#cfefff", spikes: true },
    dragon: { fill: "#3a1220", edge: "#ff5a7a", glow: "#ff2a5a", spikes: true }
  };
  function poly(ctx2, pts, sx, sy = sx) {
    ctx2.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      if (i === 0) ctx2.moveTo(x * sx, y * sy);
      else ctx2.lineTo(x * sx, y * sy);
    }
    ctx2.closePath();
  }
  function rrect(ctx2, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx2.beginPath();
    ctx2.moveTo(x + r, y);
    ctx2.arcTo(x + w, y, x + w, y + h, r);
    ctx2.arcTo(x + w, y + h, x, y + h, r);
    ctx2.arcTo(x, y + h, x, y, r);
    ctx2.arcTo(x, y, x + w, y, r);
    ctx2.closePath();
  }
  function wheelPositions(frame) {
    const n = frame.slots.wheel;
    const per = Math.max(1, Math.round(n / 2));
    const xs = per === 1 ? [-0.18] : per === 2 ? [-0.52, 0.34] : [-0.62, -0.12, 0.38];
    const out = [];
    for (const x of xs) {
      out.push([x, -frame.wy]);
      out.push([x, frame.wy]);
    }
    return out.slice(0, n);
  }
  function weaponMount(frame, slot) {
    if (slot === 0) return { x: frame.nose, y: 0, s: 1 };
    const side = slot === 1 ? -1 : 1;
    return { x: 0.12, y: side * (frame.wy + 0.08), s: 0.72 };
  }
  function drawWheel(ctx2, style, r, phase) {
    ctx2.save();
    switch (style) {
      case "tread": {
        const L = r * 0.95, W = r * 0.3;
        rrect(ctx2, -L / 2, -W / 2, L, W, W * 0.35);
        ctx2.fillStyle = "#15171c";
        ctx2.fill();
        ctx2.strokeStyle = "#3a3f4a";
        ctx2.lineWidth = Math.max(1, r * 0.04);
        ctx2.stroke();
        ctx2.save();
        ctx2.clip();
        ctx2.strokeStyle = "#4a505c";
        ctx2.lineWidth = Math.max(1, r * 0.05);
        const step = r * 0.14, off = (phase * r * 0.5 % step + step) % step;
        for (let x = -L / 2 - step + off; x < L / 2 + step; x += step) {
          ctx2.beginPath();
          ctx2.moveTo(x, -W / 2);
          ctx2.lineTo(x, W / 2);
          ctx2.stroke();
        }
        ctx2.restore();
        break;
      }
      case "omni": {
        const R = r * 0.22;
        ctx2.beginPath();
        ctx2.arc(0, 0, R, 0, TAU);
        ctx2.fillStyle = "#1a1d24";
        ctx2.fill();
        ctx2.strokeStyle = "#7f8aa0";
        ctx2.lineWidth = Math.max(1, r * 0.035);
        ctx2.stroke();
        for (let i = 0; i < 6; i++) {
          const a = phase * 0.6 + i / 6 * TAU;
          ctx2.beginPath();
          ctx2.arc(Math.cos(a) * R * 0.68, Math.sin(a) * R * 0.68, R * 0.22, 0, TAU);
          ctx2.fillStyle = "#9fb0c3";
          ctx2.fill();
        }
        break;
      }
      case "mag": {
        const g = ctx2.createRadialGradient(0, 0, 0, 0, 0, r * 0.32);
        g.addColorStop(0, "rgba(120,240,255,0.9)");
        g.addColorStop(1, "rgba(120,240,255,0)");
        ctx2.fillStyle = g;
        ctx2.beginPath();
        ctx2.ellipse(0, 0, r * 0.38, r * 0.24, 0, 0, TAU);
        ctx2.fill();
        ctx2.beginPath();
        ctx2.ellipse(0, 0, r * 0.24, r * 0.13, 0, 0, TAU);
        ctx2.fillStyle = "#1b2a33";
        ctx2.fill();
        ctx2.strokeStyle = "#7ff3ff";
        ctx2.lineWidth = Math.max(1, r * 0.04);
        ctx2.stroke();
        break;
      }
      case "turbine": {
        const R = r * 0.25;
        ctx2.beginPath();
        ctx2.arc(0, 0, R, 0, TAU);
        ctx2.fillStyle = "#1d1a12";
        ctx2.fill();
        ctx2.strokeStyle = "#ffb23f";
        ctx2.lineWidth = Math.max(1, r * 0.04);
        ctx2.stroke();
        ctx2.save();
        ctx2.rotate(phase * 1.4);
        ctx2.fillStyle = "#d9a64a";
        for (let i = 0; i < 5; i++) {
          ctx2.rotate(TAU / 5);
          ctx2.beginPath();
          ctx2.moveTo(0, 0);
          ctx2.quadraticCurveTo(R * 0.5, -R * 0.5, R * 0.85, -R * 0.1);
          ctx2.lineTo(R * 0.4, R * 0.1);
          ctx2.closePath();
          ctx2.fill();
        }
        ctx2.restore();
        break;
      }
      default: {
        const L = r * 0.56, W = r * 0.26;
        rrect(ctx2, -L / 2, -W / 2, L, W, W * 0.4);
        ctx2.fillStyle = "#16181d";
        ctx2.fill();
        ctx2.strokeStyle = "#3d424d";
        ctx2.lineWidth = Math.max(1, r * 0.04);
        ctx2.stroke();
        ctx2.save();
        ctx2.clip();
        const step = r * (style === "knobby" ? 0.11 : 0.16);
        const off = (phase * r * 0.5 % step + step) % step;
        ctx2.strokeStyle = style === "knobby" ? "#5b6170" : "#353a44";
        ctx2.lineWidth = Math.max(1, r * (style === "knobby" ? 0.06 : 0.03));
        for (let x = -L / 2 - step + off; x < L / 2 + step; x += step) {
          ctx2.beginPath();
          ctx2.moveTo(x, -W / 2);
          ctx2.lineTo(x, W / 2);
          ctx2.stroke();
        }
        ctx2.restore();
        if (style === "spiked") {
          ctx2.fillStyle = "#d0d6df";
          for (let i = -1; i <= 1; i++) {
            for (const s of [-1, 1]) {
              ctx2.beginPath();
              ctx2.moveTo(i * L * 0.3 - r * 0.05, s * W / 2);
              ctx2.lineTo(i * L * 0.3, s * (W / 2 + r * 0.13));
              ctx2.lineTo(i * L * 0.3 + r * 0.05, s * W / 2);
              ctx2.fill();
            }
          }
        }
        ctx2.beginPath();
        ctx2.arc(0, 0, W * 0.22, 0, TAU);
        ctx2.fillStyle = "#7d8696";
        ctx2.fill();
      }
    }
    ctx2.restore();
  }
  function metal(ctx2, x0, y0, x1, y1, a = "#c8d2de", b = "#6b7686") {
    const g = ctx2.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    return g;
  }
  function drawWeapon(ctx2, def, ws, r, accent) {
    const rpm = ws ? ws.rpm || 0 : 0;
    const spin = ws ? ws.spin || 0 : 0;
    const swing = ws ? ws.swing || 0 : 0;
    const wind = ws ? ws.wind || 0 : 0;
    const active = ws ? ws.active : false;
    ctx2.save();
    switch (def.style) {
      case "bar": {
        ctx2.translate(r * 0.22, 0);
        if (rpm > 0.15) {
          ctx2.beginPath();
          ctx2.arc(0, 0, r * 0.86, 0, TAU);
          ctx2.fillStyle = `rgba(200,220,255,${0.12 + rpm * 0.22})`;
          ctx2.fill();
          ctx2.strokeStyle = `rgba(255,255,255,${rpm * 0.5})`;
          ctx2.lineWidth = r * 0.05;
          ctx2.stroke();
        }
        ctx2.rotate(spin);
        rrect(ctx2, -r * 0.86, -r * 0.1, r * 1.72, r * 0.2, r * 0.06);
        ctx2.fillStyle = metal(ctx2, 0, -r * 0.1, 0, r * 0.1);
        ctx2.fill();
        ctx2.fillStyle = accent;
        ctx2.fillRect(r * 0.62, -r * 0.1, r * 0.24, r * 0.2);
        ctx2.fillRect(-r * 0.86, -r * 0.1, r * 0.24, r * 0.2);
        ctx2.beginPath();
        ctx2.arc(0, 0, r * 0.12, 0, TAU);
        ctx2.fillStyle = "#222";
        ctx2.fill();
        break;
      }
      case "drum": {
        const w = r * 0.42, h = r * 1.08;
        rrect(ctx2, 0, -h / 2, w, h, r * 0.12);
        ctx2.fillStyle = metal(ctx2, 0, 0, w, 0, "#d6dde6", "#596474");
        ctx2.fill();
        ctx2.save();
        ctx2.clip();
        ctx2.strokeStyle = rpm > 0.4 ? `rgba(255,255,255,${0.3 + rpm * 0.4})` : "#2f3540";
        ctx2.lineWidth = r * 0.07;
        const st = r * 0.22, off = spin * r * 0.3 % st;
        for (let y = -h / 2 - st + off; y < h / 2 + st; y += st) {
          ctx2.beginPath();
          ctx2.moveTo(0, y);
          ctx2.lineTo(w, y);
          ctx2.stroke();
        }
        ctx2.restore();
        ctx2.fillStyle = accent;
        ctx2.fillRect(-r * 0.06, -h / 2, r * 0.06, h);
        break;
      }
      case "disc": {
        ctx2.translate(r * 0.42, 0);
        const R = r * 0.62;
        if (rpm > 0.15) {
          ctx2.beginPath();
          ctx2.arc(0, 0, R * 1.08, 0, TAU);
          ctx2.fillStyle = `rgba(255,255,255,${rpm * 0.18})`;
          ctx2.fill();
        }
        ctx2.rotate(spin);
        ctx2.beginPath();
        for (let i = 0; i < 16; i++) {
          const a = i / 16 * TAU, a2 = a + TAU / 32;
          ctx2.lineTo(Math.cos(a) * R, Math.sin(a) * R);
          ctx2.lineTo(Math.cos(a2) * R * 0.86, Math.sin(a2) * R * 0.86);
        }
        ctx2.closePath();
        ctx2.fillStyle = metal(ctx2, -R, -R, R, R, "#e5ebf2", "#6a7584");
        ctx2.fill();
        ctx2.beginPath();
        ctx2.arc(0, 0, R * 0.36, 0, TAU);
        ctx2.fillStyle = "#1a1e26";
        ctx2.fill();
        ctx2.beginPath();
        ctx2.arc(0, 0, R * 0.18, 0, TAU);
        ctx2.fillStyle = accent;
        ctx2.fill();
        break;
      }
      case "vertical": {
        const L = r * 0.75;
        ctx2.fillStyle = "#2a2f38";
        ctx2.fillRect(-r * 0.1, -r * 0.34, r * 0.14, r * 0.68);
        const ext = Math.abs(Math.cos(spin));
        if (rpm > 0.2) {
          ctx2.fillStyle = `rgba(255,220,150,${0.15 + rpm * 0.3})`;
          rrect(ctx2, 0, -r * 0.16, L, r * 0.32, r * 0.1);
          ctx2.fill();
        }
        rrect(ctx2, 0, -r * 0.1, L * (0.35 + 0.65 * ext), r * 0.2, r * 0.05);
        ctx2.fillStyle = metal(ctx2, 0, 0, L, 0, "#fff1d0", "#9c7b3c");
        ctx2.fill();
        ctx2.fillStyle = accent;
        ctx2.fillRect(L * (0.35 + 0.65 * ext) - r * 0.12, -r * 0.1, r * 0.12, r * 0.2);
        break;
      }
      case "hammer":
      case "axe": {
        let reach = r * 0.55, raise = 0;
        if (wind > 0) {
          reach = r * 0.25;
          raise = 1;
        } else if (swing > 0) {
          reach = r * 0.95;
        }
        ctx2.strokeStyle = "#8a95a5";
        ctx2.lineWidth = r * 0.12;
        ctx2.lineCap = "round";
        ctx2.beginPath();
        ctx2.moveTo(-r * 0.75, 0);
        ctx2.lineTo(reach, 0);
        ctx2.stroke();
        const hs = 1 + raise * 0.35;
        ctx2.translate(reach, 0);
        ctx2.scale(hs, hs);
        if (def.style === "axe") {
          ctx2.beginPath();
          ctx2.moveTo(-r * 0.05, -r * 0.08);
          ctx2.quadraticCurveTo(r * 0.38, -r * 0.42, r * 0.28, -r * 0.05);
          ctx2.lineTo(r * 0.28, r * 0.05);
          ctx2.quadraticCurveTo(r * 0.38, r * 0.42, -r * 0.05, r * 0.08);
          ctx2.closePath();
          ctx2.fillStyle = metal(ctx2, 0, -r * 0.4, 0, r * 0.4, "#eef3f8", "#7b8696");
          ctx2.fill();
          ctx2.strokeStyle = accent;
          ctx2.lineWidth = r * 0.04;
          ctx2.stroke();
        } else {
          rrect(ctx2, -r * 0.14, -r * 0.27, r * 0.3, r * 0.54, r * 0.06);
          ctx2.fillStyle = metal(ctx2, 0, -r * 0.27, 0, r * 0.27, "#cfd7e2", "#596474");
          ctx2.fill();
          ctx2.fillStyle = accent;
          ctx2.fillRect(r * 0.12, -r * 0.27, r * 0.04, r * 0.54);
        }
        if (swing > 0.12) {
          ctx2.beginPath();
          ctx2.arc(r * 0.15, 0, r * (0.9 - swing * 1.8), 0, TAU);
          ctx2.strokeStyle = `rgba(255,255,255,${swing * 2})`;
          ctx2.lineWidth = r * 0.06;
          ctx2.stroke();
        }
        break;
      }
      case "flipper":
      case "flipper2": {
        const up = swing > 0 ? Math.min(1, swing * 4) : 0;
        const L = r * (0.38 + up * 0.22), H = r * (def.style === "flipper2" ? 0.7 : 0.6);
        ctx2.beginPath();
        ctx2.moveTo(-r * 0.05, -H);
        ctx2.lineTo(L, -H * 0.82);
        ctx2.lineTo(L, H * 0.82);
        ctx2.lineTo(-r * 0.05, H);
        ctx2.closePath();
        ctx2.fillStyle = up > 0 ? metal(ctx2, 0, 0, L, 0, "#ffffff", "#9aa6b6") : metal(ctx2, 0, 0, L, 0, "#a7b2c2", "#4e5866");
        ctx2.fill();
        ctx2.strokeStyle = accent;
        ctx2.lineWidth = r * 0.05;
        ctx2.stroke();
        ctx2.strokeStyle = "rgba(0,0,0,0.35)";
        ctx2.lineWidth = r * 0.03;
        for (let i = 1; i < 4; i++) {
          ctx2.beginPath();
          ctx2.moveTo(L * i / 4, -H * 0.8);
          ctx2.lineTo(L * i / 4, H * 0.8);
          ctx2.stroke();
        }
        if (def.style === "flipper2") {
          ctx2.fillStyle = "#5a6a80";
          ctx2.fillRect(-r * 0.35, -r * 0.12, r * 0.3, r * 0.24);
        }
        break;
      }
      case "saw":
      case "plasma": {
        ctx2.translate(r * 0.38, 0);
        const R = r * 0.4;
        ctx2.fillStyle = "#2a2f38";
        ctx2.fillRect(-R * 1.1, -r * 0.08, R * 1.1, r * 0.16);
        ctx2.rotate(spin);
        ctx2.beginPath();
        for (let i = 0; i < 20; i++) {
          const a = i / 20 * TAU;
          const rr = i % 2 ? R * 0.8 : R;
          ctx2.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx2.closePath();
        if (def.style === "plasma") {
          ctx2.fillStyle = active ? "#ff5cf0" : "#a84aa0";
          ctx2.shadowColor = "#ff5cf0";
          ctx2.shadowBlur = active ? r * 0.6 : 0;
        } else ctx2.fillStyle = metal(ctx2, -R, -R, R, R, "#e9eef4", "#6d7888");
        ctx2.fill();
        ctx2.shadowBlur = 0;
        ctx2.beginPath();
        ctx2.arc(0, 0, R * 0.25, 0, TAU);
        ctx2.fillStyle = "#1a1e26";
        ctx2.fill();
        break;
      }
      case "flame": {
        ctx2.beginPath();
        ctx2.arc(-r * 0.2, 0, r * 0.2, 0, TAU);
        ctx2.fillStyle = "#7a2a1a";
        ctx2.fill();
        ctx2.strokeStyle = "#ff8a3c";
        ctx2.lineWidth = r * 0.04;
        ctx2.stroke();
        rrect(ctx2, -r * 0.05, -r * 0.08, r * 0.42, r * 0.16, r * 0.04);
        ctx2.fillStyle = "#5a5f68";
        ctx2.fill();
        ctx2.beginPath();
        ctx2.arc(r * 0.4, 0, r * 0.06, 0, TAU);
        ctx2.fillStyle = active ? "#ffd23f" : "#ff6a2a";
        ctx2.fill();
        break;
      }
      case "gun": {
        rrect(ctx2, -r * 0.2, -r * 0.17, r * 0.36, r * 0.34, r * 0.06);
        ctx2.fillStyle = "#3a4250";
        ctx2.fill();
        ctx2.fillStyle = "#9aa6b6";
        ctx2.fillRect(r * 0.1, -r * 0.1, r * 0.48, r * 0.07);
        ctx2.fillRect(r * 0.1, r * 0.03, r * 0.48, r * 0.07);
        ctx2.fillStyle = accent;
        ctx2.fillRect(-r * 0.2, -r * 0.03, r * 0.1, r * 0.06);
        if (swing > 0) {
          ctx2.beginPath();
          ctx2.arc(r * 0.66, 0, r * 0.14, 0, TAU);
          ctx2.fillStyle = "rgba(255,230,120,0.9)";
          ctx2.fill();
        }
        break;
      }
      case "rocket": {
        rrect(ctx2, -r * 0.2, -r * 0.27, r * 0.56, r * 0.54, r * 0.08);
        ctx2.fillStyle = "#3c4656";
        ctx2.fill();
        ctx2.strokeStyle = accent;
        ctx2.lineWidth = r * 0.04;
        ctx2.stroke();
        const ready = ws ? ws.cd <= 0 : true;
        for (const [x, y] of [[0.22, -0.12], [0.22, 0.12], [0.02, -0.12], [0.02, 0.12]]) {
          ctx2.beginPath();
          ctx2.arc(x * r, y * r, r * 0.07, 0, TAU);
          ctx2.fillStyle = ready ? "#ff5a3c" : "#151820";
          ctx2.fill();
        }
        break;
      }
      case "emp": {
        ctx2.strokeStyle = "#7d8aa0";
        ctx2.lineWidth = r * 0.08;
        ctx2.beginPath();
        ctx2.moveTo(-r * 0.2, 0);
        ctx2.lineTo(r * 0.62, 0);
        ctx2.stroke();
        const ready = ws ? ws.cd <= 0 : true;
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 150);
        ctx2.beginPath();
        ctx2.arc(r * 0.68, 0, r * 0.13, 0, TAU);
        ctx2.fillStyle = ready ? `rgba(110,200,255,${pulse})` : "#24405a";
        ctx2.shadowColor = "#6ec8ff";
        ctx2.shadowBlur = ready ? r * 0.5 : 0;
        ctx2.fill();
        ctx2.shadowBlur = 0;
        for (const s of [-1, 1]) {
          ctx2.beginPath();
          ctx2.moveTo(r * 0.3, 0);
          ctx2.lineTo(r * 0.45, s * r * 0.16);
          ctx2.strokeStyle = "#7d8aa0";
          ctx2.lineWidth = r * 0.04;
          ctx2.stroke();
        }
        break;
      }
      case "rail": {
        ctx2.fillStyle = "#2b313c";
        ctx2.fillRect(-r * 0.25, -r * 0.2, r * 0.3, r * 0.4);
        ctx2.fillStyle = "#a7b3c4";
        ctx2.fillRect(0, -r * 0.17, r * 0.85, r * 0.07);
        ctx2.fillRect(0, r * 0.1, r * 0.85, r * 0.07);
        const ch = wind > 0 ? 1 - wind / (def.charge || 0.45) : 0;
        if (ch > 0) {
          ctx2.fillStyle = `rgba(140,255,240,${0.3 + ch * 0.7})`;
          ctx2.fillRect(0, -r * 0.06, r * 0.85 * ch, r * 0.12);
        }
        ctx2.fillStyle = accent;
        ctx2.fillRect(-r * 0.25, -r * 0.03, r * 0.1, r * 0.06);
        break;
      }
    }
    ctx2.restore();
  }
  function drawBot(ctx2, v, opts = {}) {
    const b = v.build;
    const frame = PART[b.frame];
    const wheel = PART[b.wheel];
    const col = TEAM[v.team] || TEAM.player;
    const r = v.r;
    const shape = SHAPES[frame.shape];
    const airLift = v.air > 0 ? Math.sin(Math.min(1, v.air / (v.airMax || 1)) * Math.PI) : 0;
    const scale = (1 + airLift * 0.35) * (v.fall != null ? Math.max(0, 1 - v.fall) : 1);
    ctx2.save();
    ctx2.translate(v.x, v.y);
    if (!opts.noShadow) {
      ctx2.save();
      ctx2.translate(r * 0.12 + airLift * r * 0.5, r * 0.18 + airLift * r * 0.6);
      ctx2.rotate(v.a);
      poly(ctx2, shape, r * 1.05 * (1 - airLift * 0.2));
      ctx2.fillStyle = `rgba(0,0,0,${0.35 - airLift * 0.15})`;
      ctx2.fill();
      ctx2.restore();
    }
    ctx2.rotate(v.a + (v.air > 0 ? airLift * 0.6 * (v.spinDir || 1) : 0));
    ctx2.scale(scale, scale);
    if (v.boosting) {
      const L = r * (0.8 + Math.random() * 0.5);
      const g = ctx2.createLinearGradient(-r * 0.6, 0, -r * 0.6 - L, 0);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.3, col.accent);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx2.fillStyle = g;
      ctx2.beginPath();
      ctx2.moveTo(-r * 0.55, -r * 0.22);
      ctx2.lineTo(-r * 0.6 - L, 0);
      ctx2.lineTo(-r * 0.55, r * 0.22);
      ctx2.closePath();
      ctx2.fill();
    }
    const wp = wheelPositions(frame);
    for (const [x, y] of wp) {
      ctx2.save();
      ctx2.translate(x * r, y * r);
      drawWheel(ctx2, wheel ? wheel.style : "wheel", r, v.phase || 0);
      ctx2.restore();
    }
    const armors = (b.armor || []).filter(Boolean);
    armors.forEach((id, i) => {
      const a = PART[id];
      const look = ARMOR_LOOK[a.look] || ARMOR_LOOK.steel;
      const s = r * (1.12 + (armors.length - 1 - i) * 0.1);
      poly(ctx2, shape, s);
      ctx2.fillStyle = look.fill;
      if (look.glow) {
        ctx2.shadowColor = look.glow;
        ctx2.shadowBlur = r * 0.4;
      }
      ctx2.fill();
      ctx2.shadowBlur = 0;
      ctx2.strokeStyle = look.edge;
      ctx2.lineWidth = Math.max(1, r * 0.05);
      ctx2.stroke();
      ctx2.fillStyle = look.edge;
      for (const [px, py] of shape) {
        ctx2.beginPath();
        ctx2.arc(px * s * 0.9, py * s * 0.9, r * 0.035, 0, TAU);
        ctx2.fill();
      }
      if (look.spikes) {
        ctx2.fillStyle = "#dfe4ea";
        for (let k = 0; k < shape.length; k++) {
          const [x1, y1] = shape[k], [x2, y2] = shape[(k + 1) % shape.length];
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          const nx = my, ny = -mx;
          const len = Math.hypot(nx, ny) || 1;
          const ox = mx / (Math.hypot(mx, my) || 1), oy = my / (Math.hypot(mx, my) || 1);
          ctx2.beginPath();
          ctx2.moveTo((mx - ny / len * 0.06) * s, (my + nx / len * 0.06) * s);
          ctx2.lineTo((mx + ox * 0.22) * s, (my + oy * 0.22) * s);
          ctx2.lineTo((mx + ny / len * 0.06) * s, (my - nx / len * 0.06) * s);
          ctx2.fill();
        }
      }
    });
    poly(ctx2, shape, r);
    const bg = ctx2.createLinearGradient(-r, -r, r, r);
    bg.addColorStop(0, col.body2);
    bg.addColorStop(1, col.body);
    ctx2.fillStyle = bg;
    ctx2.fill();
    ctx2.shadowColor = col.glow;
    ctx2.shadowBlur = opts.glow === false ? 0 : r * 0.5;
    ctx2.strokeStyle = col.accent;
    ctx2.lineWidth = Math.max(1.5, r * 0.08);
    ctx2.lineJoin = "round";
    ctx2.stroke();
    ctx2.shadowBlur = 0;
    poly(ctx2, shape, r * 0.55);
    ctx2.strokeStyle = "rgba(255,255,255,0.12)";
    ctx2.lineWidth = Math.max(1, r * 0.04);
    ctx2.stroke();
    const utils = (b.util || []).filter(Boolean);
    utils.forEach((id, i) => {
      const u = PART[id];
      const x = -r * (0.15 + i * 0.28), y = 0;
      rrect(ctx2, x - r * 0.11, y - r * 0.11, r * 0.22, r * 0.22, r * 0.05);
      ctx2.fillStyle = "#10151d";
      ctx2.fill();
      ctx2.strokeStyle = RARITY[u.rarity].color;
      ctx2.lineWidth = Math.max(1, r * 0.03);
      ctx2.stroke();
      ctx2.beginPath();
      ctx2.arc(x, y, r * 0.045, 0, TAU);
      ctx2.fillStyle = RARITY[u.rarity].color;
      ctx2.fill();
      if (id === "nitro") {
        ctx2.fillStyle = "#555c68";
        ctx2.fillRect(-r * 0.75, -r * 0.2, r * 0.18, r * 0.12);
        ctx2.fillRect(-r * 0.75, r * 0.08, r * 0.18, r * 0.12);
      }
    });
    ctx2.beginPath();
    ctx2.moveTo(r * 0.42, 0);
    ctx2.lineTo(r * 0.12, -r * 0.13);
    ctx2.lineTo(r * 0.12, r * 0.13);
    ctx2.closePath();
    ctx2.fillStyle = col.accent;
    ctx2.shadowColor = col.accent;
    ctx2.shadowBlur = r * 0.4;
    ctx2.fill();
    ctx2.shadowBlur = 0;
    (b.weapons || []).forEach((id, i) => {
      if (!id) return;
      const def = PART[id];
      const m = weaponMount(frame, i);
      ctx2.save();
      ctx2.translate(m.x * r, m.y * r);
      ctx2.scale(m.s, m.s);
      drawWeapon(ctx2, def, v.ws ? v.ws[i] : null, r, col.accent);
      ctx2.restore();
    });
    if (v.flash > 0) {
      poly(ctx2, shape, r * 1.05);
      ctx2.fillStyle = `rgba(255,255,255,${Math.min(0.7, v.flash * 5)})`;
      ctx2.fill();
    }
    if (v.burn > 0) {
      poly(ctx2, shape, r);
      ctx2.fillStyle = `rgba(255,110,30,${0.15 + 0.1 * Math.sin(performance.now() / 60)})`;
      ctx2.fill();
    }
    ctx2.restore();
    if (v.shieldFrac > 0.01) {
      ctx2.save();
      ctx2.translate(v.x, v.y);
      const R = r * 1.55 * scale;
      const hit = v.shieldHit || 0;
      ctx2.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * TAU + Math.PI / 6;
        ctx2.lineTo(Math.cos(a) * R, Math.sin(a) * R);
      }
      ctx2.closePath();
      ctx2.fillStyle = `rgba(110,200,255,${0.05 + v.shieldFrac * 0.06 + hit * 0.4})`;
      ctx2.fill();
      ctx2.strokeStyle = `rgba(140,220,255,${0.2 + v.shieldFrac * 0.4 + hit})`;
      ctx2.lineWidth = Math.max(1, r * 0.05);
      ctx2.stroke();
      ctx2.restore();
    }
    if (v.stun > 0 && !(v.air > 0)) {
      ctx2.save();
      ctx2.translate(v.x, v.y);
      const t = performance.now() / 300;
      for (let i = 0; i < 3; i++) {
        const a = t + i / 3 * TAU;
        ctx2.beginPath();
        ctx2.arc(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.5 - r * 0.9, r * 0.1, 0, TAU);
        ctx2.fillStyle = "#9fe8ff";
        ctx2.fill();
      }
      ctx2.restore();
    }
  }
  function drawPartIcon(ctx2, part, size, team = "player") {
    const col = TEAM[team];
    const r = size * 0.3;
    ctx2.save();
    ctx2.translate(size / 2, size / 2);
    switch (part.cat) {
      case "frame": {
        const shape = SHAPES[part.shape];
        for (const [x, y] of wheelPositions(part)) {
          ctx2.save();
          ctx2.translate(x * r, y * r);
          drawWheel(ctx2, "wheel", r, 0);
          ctx2.restore();
        }
        poly(ctx2, shape, r);
        const bg = ctx2.createLinearGradient(-r, -r, r, r);
        bg.addColorStop(0, col.body2);
        bg.addColorStop(1, col.body);
        ctx2.fillStyle = bg;
        ctx2.fill();
        ctx2.strokeStyle = col.accent;
        ctx2.lineWidth = Math.max(1.5, r * 0.08);
        ctx2.lineJoin = "round";
        ctx2.stroke();
        for (let i = 0; i < part.slots.weapon; i++) {
          const m = weaponMount(part, i);
          ctx2.beginPath();
          ctx2.arc(m.x * r, m.y * r, r * 0.09, 0, TAU);
          ctx2.fillStyle = "#ffb23f";
          ctx2.fill();
        }
        break;
      }
      case "wheel":
        ctx2.scale(2.4, 2.4);
        drawWheel(ctx2, part.style, r, 0.8);
        break;
      case "weapon": {
        const off = { bar: -0.2, drum: -0.2, disc: -0.4, vertical: -0.35, hammer: -0.2, axe: -0.2, flipper: -0.2, flipper2: -0.15, saw: -0.4, plasma: -0.4, flame: -0.1, gun: -0.2, rocket: -0.08, emp: -0.25, rail: -0.3 }[part.style] || 0;
        ctx2.scale(1.5, 1.5);
        ctx2.translate(off * r, 0);
        drawWeapon(ctx2, part, { rpm: 0, spin: 0.5, swing: 0, wind: 0, active: true, cd: 0 }, r, col.accent);
        break;
      }
      case "armor": {
        const look = ARMOR_LOOK[part.look] || ARMOR_LOOK.steel;
        ctx2.beginPath();
        ctx2.moveTo(0, -r * 1.1);
        ctx2.lineTo(r * 0.95, -r * 0.6);
        ctx2.lineTo(r * 0.8, r * 0.5);
        ctx2.lineTo(0, r * 1.15);
        ctx2.lineTo(-r * 0.8, r * 0.5);
        ctx2.lineTo(-r * 0.95, -r * 0.6);
        ctx2.closePath();
        ctx2.fillStyle = look.fill;
        if (look.glow) {
          ctx2.shadowColor = look.glow;
          ctx2.shadowBlur = r * 0.6;
        }
        ctx2.fill();
        ctx2.shadowBlur = 0;
        ctx2.strokeStyle = look.edge;
        ctx2.lineWidth = r * 0.1;
        ctx2.stroke();
        ctx2.fillStyle = look.edge;
        for (const [x, y] of [[-0.5, -0.5], [0.5, -0.5], [-0.45, 0.35], [0.45, 0.35]]) {
          ctx2.beginPath();
          ctx2.arc(x * r, y * r, r * 0.08, 0, TAU);
          ctx2.fill();
        }
        if (look.spikes) {
          ctx2.fillStyle = "#e8ecf0";
          for (const [x, y, a] of [[0, -1.1, -Math.PI / 2], [0.95, -0.6, -0.4], [-0.95, -0.6, Math.PI + 0.4]]) {
            ctx2.save();
            ctx2.translate(x * r, y * r);
            ctx2.rotate(a);
            ctx2.beginPath();
            ctx2.moveTo(0, -r * 0.12);
            ctx2.lineTo(r * 0.35, 0);
            ctx2.lineTo(0, r * 0.12);
            ctx2.fill();
            ctx2.restore();
          }
        }
        break;
      }
      case "shield": {
        const R = r * 1.1;
        const tierA = { common: 0.15, rare: 0.22, epic: 0.3, legendary: 0.4 }[part.rarity];
        ctx2.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = i / 6 * TAU + Math.PI / 6;
          ctx2.lineTo(Math.cos(a) * R, Math.sin(a) * R);
        }
        ctx2.closePath();
        ctx2.fillStyle = `rgba(110,200,255,${tierA})`;
        ctx2.fill();
        ctx2.strokeStyle = "#8fdcff";
        ctx2.lineWidth = r * 0.1;
        ctx2.shadowColor = "#6ec8ff";
        ctx2.shadowBlur = r * 0.6;
        ctx2.stroke();
        ctx2.shadowBlur = 0;
        ctx2.strokeStyle = "rgba(140,220,255,0.5)";
        ctx2.lineWidth = r * 0.05;
        ctx2.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = i / 6 * TAU + Math.PI / 6;
          ctx2.lineTo(Math.cos(a) * R * 0.55, Math.sin(a) * R * 0.55);
        }
        ctx2.closePath();
        ctx2.stroke();
        break;
      }
      case "util": {
        const c = RARITY[part.rarity].color;
        rrect(ctx2, -r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.25);
        ctx2.fillStyle = "#10151d";
        ctx2.fill();
        ctx2.strokeStyle = c;
        ctx2.lineWidth = r * 0.1;
        ctx2.stroke();
        ctx2.strokeStyle = "#5b6574";
        ctx2.lineWidth = r * 0.08;
        for (let i = -1; i <= 1; i++) for (const s of [-1, 1]) {
          ctx2.beginPath();
          ctx2.moveTo(i * r * 0.45, s * r * 0.8);
          ctx2.lineTo(i * r * 0.45, s * r * 1.05);
          ctx2.stroke();
          ctx2.beginPath();
          ctx2.moveTo(s * r * 0.8, i * r * 0.45);
          ctx2.lineTo(s * r * 1.05, i * r * 0.45);
          ctx2.stroke();
        }
        ctx2.fillStyle = c;
        ctx2.font = `800 ${Math.round(r * 0.95)}px system-ui, sans-serif`;
        ctx2.textAlign = "center";
        ctx2.textBaseline = "middle";
        ctx2.fillText(part.glyph || "?", 0, r * 0.05);
        break;
      }
    }
    ctx2.restore();
  }
  var floorCache = /* @__PURE__ */ new Map();
  function floorCanvas(arena, key) {
    if (floorCache.has(key)) return floorCache.get(key);
    const c = document.createElement("canvas");
    c.width = WORLD.w;
    c.height = WORLD.h;
    const g = c.getContext("2d");
    g.fillStyle = arena.floor;
    g.fillRect(0, 0, WORLD.w, WORLD.h);
    const plate = 100;
    for (let x = 0; x < WORLD.w; x += plate) for (let y = 0; y < WORLD.h; y += plate) {
      const s = (x * 7 + y * 13) % 17 / 17;
      g.fillStyle = `rgba(255,255,255,${0.012 + s * 0.02})`;
      g.fillRect(x + 1, y + 1, plate - 2, plate - 2);
      g.fillStyle = "rgba(255,255,255,0.05)";
      for (const [px, py] of [[6, 6], [plate - 6, 6], [6, plate - 6], [plate - 6, plate - 6]]) {
        g.beginPath();
        g.arc(x + px, y + py, 1.6, 0, TAU);
        g.fill();
      }
    }
    g.strokeStyle = "rgba(0,0,0,0.45)";
    g.lineWidth = 2;
    for (let x = 0; x <= WORLD.w; x += plate) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, WORLD.h);
      g.stroke();
    }
    for (let y = 0; y <= WORLD.h; y += plate) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(WORLD.w, y);
      g.stroke();
    }
    g.strokeStyle = arena.accent;
    g.globalAlpha = 0.12;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(WORLD.w / 2, WORLD.h / 2, 150, 0, TAU);
    g.stroke();
    g.lineWidth = 2;
    g.beginPath();
    g.arc(WORLD.w / 2, WORLD.h / 2, 175, 0, TAU);
    g.stroke();
    g.globalAlpha = 1;
    g.strokeStyle = "rgba(63,240,255,0.25)";
    g.lineWidth = 3;
    g.strokeRect(190, 440, 120, 120);
    g.strokeStyle = "rgba(255,77,122,0.25)";
    g.strokeRect(1090, 440, 120, 120);
    floorCache.set(key, c);
    return c;
  }
  function stripes(ctx2, x, y, w, h, a = 0.9) {
    ctx2.save();
    ctx2.beginPath();
    ctx2.rect(x, y, w, h);
    ctx2.clip();
    ctx2.fillStyle = `rgba(255,210,63,${a})`;
    ctx2.fillRect(x, y, w, h);
    ctx2.fillStyle = "rgba(20,20,20,0.95)";
    for (let i = -h; i < w + h; i += 24) {
      ctx2.beginPath();
      ctx2.moveTo(x + i, y);
      ctx2.lineTo(x + i + 12, y);
      ctx2.lineTo(x + i + 12 - h, y + h);
      ctx2.lineTo(x + i - h, y + h);
      ctx2.closePath();
      ctx2.fill();
    }
    ctx2.restore();
  }
  function cyc(h, t) {
    const p = ((t + (h.offset || 0)) % h.period + h.period) % h.period;
    const on = p < h.on;
    return { on, f: on ? p / h.on : (p - h.on) / (h.period - h.on) };
  }
  function drawArena(ctx2, m) {
    const A = m.arena;
    const t = m.time;
    ctx2.drawImage(floorCanvas(A, m.arenaId), 0, 0);
    for (const p of A.pits) {
      const open = m.pitOpen;
      stripes(ctx2, p.x - 12, p.y - 12, p.w + 24, 12);
      stripes(ctx2, p.x - 12, p.y + p.h, p.w + 24, 12);
      stripes(ctx2, p.x - 12, p.y, 12, p.h);
      stripes(ctx2, p.x + p.w, p.y, 12, p.h);
      if (open) {
        const g = ctx2.createRadialGradient(p.x + p.w / 2, p.y + p.h / 2, 0, p.x + p.w / 2, p.y + p.h / 2, p.w * 0.7);
        g.addColorStop(0, "#000");
        g.addColorStop(1, "#0a0a10");
        ctx2.fillStyle = g;
        ctx2.fillRect(p.x, p.y, p.w, p.h);
        ctx2.strokeStyle = "rgba(255,60,60,0.6)";
        ctx2.lineWidth = 2;
        ctx2.strokeRect(p.x + 4, p.y + 4, p.w - 8, p.h - 8);
      } else {
        ctx2.fillStyle = "#20242c";
        ctx2.fillRect(p.x, p.y, p.w, p.h);
        ctx2.strokeStyle = "#363c48";
        ctx2.lineWidth = 3;
        for (let i = 10; i < p.w; i += 16) {
          ctx2.beginPath();
          ctx2.moveTo(p.x + i, p.y);
          ctx2.lineTo(p.x + i, p.y + p.h);
          ctx2.stroke();
        }
        if (m.arena.pitOpen && m.time > 0) {
          const left = Math.max(0, Math.ceil(m.arena.pitOpen - m.time));
          ctx2.fillStyle = left <= 5 ? "#ff4d6d" : "rgba(255,255,255,0.35)";
          ctx2.font = "800 28px system-ui, sans-serif";
          ctx2.textAlign = "center";
          ctx2.textBaseline = "middle";
          ctx2.fillText(left <= 5 ? String(left) : "PIT", p.x + p.w / 2, p.y + p.h / 2);
        }
      }
    }
    for (const s of A.spikes) {
      const c = cyc(s, t);
      const warn = !c.on && c.f > 0.75;
      ctx2.fillStyle = "#1a1d24";
      ctx2.fillRect(s.x, s.y, s.w, s.h);
      ctx2.strokeStyle = warn ? "#ffd23f" : c.on ? "#ff4d6d" : "#3a404c";
      ctx2.lineWidth = 3;
      ctx2.strokeRect(s.x, s.y, s.w, s.h);
      const step = 20;
      for (let x = s.x + step / 2; x < s.x + s.w; x += step) for (let y = s.y + step / 2; y < s.y + s.h; y += step) {
        if (c.on) {
          ctx2.beginPath();
          ctx2.moveTo(x - 7, y + 6);
          ctx2.lineTo(x, y - 8);
          ctx2.lineTo(x + 7, y + 6);
          ctx2.closePath();
          ctx2.fillStyle = "#dfe4ea";
          ctx2.fill();
          ctx2.fillStyle = "rgba(255,77,109,0.5)";
          ctx2.fillRect(x - 1, y - 8, 2, 4);
        } else {
          ctx2.beginPath();
          ctx2.arc(x, y, 2.5, 0, TAU);
          ctx2.fillStyle = warn ? "#ffd23f" : "#4a505c";
          ctx2.fill();
        }
      }
    }
    for (const v of A.vents) {
      const c = cyc(v, t);
      ctx2.beginPath();
      ctx2.arc(v.x, v.y, v.r, 0, TAU);
      ctx2.fillStyle = "#1a1210";
      ctx2.fill();
      ctx2.strokeStyle = c.on ? "#ff8a3c" : !c.on && c.f > 0.7 ? "#ffd23f" : "#4a3a30";
      ctx2.lineWidth = 4;
      ctx2.stroke();
      ctx2.strokeStyle = "#3a2a22";
      ctx2.lineWidth = 3;
      for (let i = -v.r + 10; i < v.r; i += 12) {
        const hh = Math.sqrt(v.r * v.r - i * i);
        ctx2.beginPath();
        ctx2.moveTo(v.x + i, v.y - hh + 4);
        ctx2.lineTo(v.x + i, v.y + hh - 4);
        ctx2.stroke();
      }
      if (c.on) {
        const g = ctx2.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.r * 1.5);
        g.addColorStop(0, "rgba(255,240,180,0.9)");
        g.addColorStop(0.4, "rgba(255,130,40,0.7)");
        g.addColorStop(1, "rgba(255,60,20,0)");
        ctx2.fillStyle = g;
        ctx2.beginPath();
        ctx2.arc(v.x, v.y, v.r * 1.5, 0, TAU);
        ctx2.fill();
      }
    }
    for (const s of A.saws) {
      const c = cyc(s, t);
      ctx2.fillStyle = "#0a0b0f";
      ctx2.fillRect(s.x - s.r - 6, s.y - 6, s.r * 2 + 12, 12);
      const up = c.on ? Math.min(1, c.f * 6, (1 - c.f) * 6) : 0;
      if (!c.on && c.f > 0.75) {
        ctx2.fillStyle = "rgba(255,77,109,0.5)";
        ctx2.fillRect(s.x - s.r - 6, s.y - 6, s.r * 2 + 12, 12);
      }
      if (up > 0) {
        ctx2.save();
        ctx2.translate(s.x, s.y);
        ctx2.rotate(t * 18);
        const R = s.r * (0.4 + 0.6 * up);
        ctx2.beginPath();
        for (let i = 0; i < 24; i++) {
          const a = i / 24 * TAU;
          const rr = i % 2 ? R * 0.82 : R;
          ctx2.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx2.closePath();
        ctx2.fillStyle = "#d7dde5";
        ctx2.shadowColor = "#ff4d6d";
        ctx2.shadowBlur = 16;
        ctx2.fill();
        ctx2.shadowBlur = 0;
        ctx2.beginPath();
        ctx2.arc(0, 0, R * 0.3, 0, TAU);
        ctx2.fillStyle = "#ff4d6d";
        ctx2.fill();
        ctx2.restore();
      }
    }
    for (const h of A.hammers) {
      const st = m.hammerState(h);
      ctx2.save();
      ctx2.strokeStyle = st.warn ? `rgba(255,77,109,${0.5 + 0.5 * Math.sin(t * 30)})` : "rgba(255,210,63,0.35)";
      ctx2.setLineDash([10, 8]);
      ctx2.lineWidth = 3;
      ctx2.strokeRect(h.x, h.y, h.w, h.h);
      ctx2.setLineDash([]);
      if (st.warn) {
        ctx2.fillStyle = "rgba(255,77,109,0.15)";
        ctx2.fillRect(h.x, h.y, h.w, h.h);
      }
      if (st.slam > 0) {
        ctx2.fillStyle = `rgba(255,255,255,${st.slam})`;
        ctx2.fillRect(h.x, h.y, h.w, h.h);
        rrect(ctx2, h.x + 20, h.y + 20, h.w - 40, h.h - 40, 12);
        ctx2.fillStyle = "#5b6574";
        ctx2.fill();
        ctx2.strokeStyle = "#ffd23f";
        ctx2.lineWidth = 6;
        ctx2.stroke();
      }
      ctx2.restore();
    }
    for (const b of A.blocks) {
      rrect(ctx2, b.x + 6, b.y + 8, b.w, b.h, 8);
      ctx2.fillStyle = "rgba(0,0,0,0.4)";
      ctx2.fill();
      rrect(ctx2, b.x, b.y, b.w, b.h, 8);
      ctx2.fillStyle = metal(ctx2, b.x, b.y, b.x, b.y + b.h, "#4a5262", "#262b35");
      ctx2.fill();
      ctx2.strokeStyle = A.accent;
      ctx2.globalAlpha = 0.6;
      ctx2.lineWidth = 2;
      ctx2.stroke();
      ctx2.globalAlpha = 1;
    }
    for (const p of A.pillars) {
      ctx2.beginPath();
      ctx2.arc(p.x + 6, p.y + 8, p.r, 0, TAU);
      ctx2.fillStyle = "rgba(0,0,0,0.45)";
      ctx2.fill();
      const g = ctx2.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 2, p.x, p.y, p.r);
      g.addColorStop(0, "#7a8494");
      g.addColorStop(1, "#262b35");
      ctx2.beginPath();
      ctx2.arc(p.x, p.y, p.r, 0, TAU);
      ctx2.fillStyle = g;
      ctx2.fill();
      ctx2.strokeStyle = A.accent;
      ctx2.globalAlpha = 0.7;
      ctx2.lineWidth = 3;
      ctx2.stroke();
      ctx2.globalAlpha = 1;
    }
    ctx2.save();
    ctx2.strokeStyle = A.accent;
    ctx2.lineWidth = 6;
    ctx2.shadowColor = A.accent;
    ctx2.shadowBlur = 24;
    ctx2.strokeRect(-3, -3, WORLD.w + 6, WORLD.h + 6);
    ctx2.restore();
    ctx2.fillStyle = "#05070b";
    ctx2.fillRect(-400, -400, WORLD.w + 800, 397);
    ctx2.fillRect(-400, WORLD.h + 3, WORLD.w + 800, 397);
    ctx2.fillRect(-400, -3, 397, WORLD.h + 6);
    ctx2.fillRect(WORLD.w + 3, -3, 397, WORLD.h + 6);
  }

  // js/engine.js
  var TAU2 = Math.PI * 2;
  var clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  var hyp = Math.hypot;
  var angDiff = (a, b) => {
    let d = (b - a) % TAU2;
    if (d > Math.PI) d -= TAU2;
    if (d < -Math.PI) d += TAU2;
    return d;
  };
  var RANGED = /* @__PURE__ */ new Set(["gun", "rocket", "emp", "rail"]);
  var HP_MULT = 1.7;
  function computeStats(build, lvlOf = () => 1) {
    const F = PART[build.frame];
    const W = PART[build.wheel] || PART.rubber;
    const L = (id) => lvlOf(id) || 1;
    const n = F.slots.wheel;
    const weapons = (build.weapons || []).slice(0, F.slots.weapon).map((id, slot) => id ? { def: PART[id], lvl: L(id), slot } : null).filter(Boolean);
    const armors = (build.armor || []).slice(0, F.slots.armor).filter(Boolean).map((id) => ({ def: PART[id], lvl: L(id) }));
    const shield = F.slots.shield && build.shield ? { def: PART[build.shield], lvl: L(build.shield) } : null;
    const utils = (build.util || []).slice(0, F.slots.util).filter(Boolean).map((id) => ({ def: PART[id], lvl: L(id) }));
    let hp = F.hp * levelMult(L(F.id));
    let keep = 1, kbRes = W.kb || 0, thorns = 0, reactive = 0;
    for (const a of armors) {
      hp += a.def.hp * levelMult(a.lvl);
      keep *= 1 - a.def.dr * (1 + 0.06 * (a.lvl - 1));
      kbRes += a.def.kb || 0;
      thorns += a.def.thorns || 0;
      reactive = Math.max(reactive, a.def.reactive || 0);
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
      if (d.boost) {
        boost = Math.max(boost, d.boost);
        boostCd *= d.boostCd;
      }
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
    let dps = 0;
    for (const w of weapons) {
      const d = w.def, m = levelMult(w.lvl) * dmgMul;
      if (d.kind === "spin") dps += d.dmg * m * 0.9;
      else if (d.kind === "saw" || d.kind === "flame") dps += d.dps * m * 0.8;
      else if (d.kind === "gun") dps += d.dmg * d.rof * m * 0.5;
      else dps += d.dmg * m / ((d.cd || 1) * cdMul) * 1.1;
    }
    return {
      hp: Math.round(hp),
      dr,
      weight: Math.round(weight * 10) / 10,
      cap: F.cap,
      over,
      maxSpeed,
      accel,
      turn,
      grip,
      r: 17 * F.size,
      kbRes,
      thorns,
      reactive,
      regen,
      cdMul,
      dmgMul,
      stunRes,
      anchor,
      crit,
      homing,
      boost,
      boostCd,
      shieldCap: shield ? shield.def.cap * levelMult(shield.lvl) : 0,
      shieldRegen: shield ? shield.def.regen * levelMult(shield.lvl) * shieldRegenMul : 0,
      shieldDelay: shield ? shield.def.delay : 99,
      hover: !!W.hover,
      contact: (W.contact || 0) * levelMult(L(W.id)),
      ram: F.ram || 1,
      weapons,
      dps,
      power,
      speedRating: maxSpeed
    };
  }
  function powerRating(st) {
    const ehp = (st.hp + st.shieldCap * 1.5) / (1 - st.dr);
    return Math.round(ehp * 0.35 + st.dps * 3 + st.maxSpeed * 0.15);
  }
  var Bot = class {
    constructor(build, levels, team, x, y, a, name) {
      this.build = build;
      this.levels = levels || {};
      this.team = team;
      this.name = name;
      this.st = computeStats(build, (id) => this.levels[id] || 1);
      this.x = x;
      this.y = y;
      this.a = a;
      this.vx = 0;
      this.vy = 0;
      this.r = this.st.r;
      this.hp = this.st.hp;
      this.maxHp = this.st.hp;
      this.shield = this.st.shieldCap;
      this.shieldT = 0;
      this.shieldHit = 0;
      this.weapons = this.st.weapons.map((w) => ({ def: w.def, lvl: w.lvl, slot: w.slot, cd: 0, rpm: 0, spin: Math.random() * 6, swing: 0, wind: 0, active: false, heat: 0, over: false, hitCd: 0, tick: 0 }));
      this.stun = 0;
      this.air = 0;
      this.airMax = 0;
      this.spinDir = 1;
      this.boostCd = 0;
      this.boostT = 0;
      this.kbT = 0;
      this.burn = 0;
      this.burnDps = 0;
      this.burnTick = 0;
      this.alive = true;
      this.fall = null;
      this.anchorUsed = false;
      this.input = { x: 0, y: 0, mag: 0, fire: [false, false, false], boost: false };
      this.flash = 0;
      this.dmgDealt = 0;
      this.hazCd = 0;
      this.ramCd = 0;
      this.phase = 0;
      this.invuln = false;
      this.minHp = 0;
      this.ai = null;
    }
    mountPos(slot) {
      const F = PART[this.build.frame];
      const m = weaponMount(F, slot);
      const c = Math.cos(this.a), s = Math.sin(this.a);
      return { x: this.x + (m.x * c - m.y * s) * this.r, y: this.y + (m.x * s + m.y * c) * this.r };
    }
  };
  var AI = class {
    constructor(diff) {
      this.d = clamp(diff, 0, 1);
      this.think = 0;
      this.goal = null;
      this.flank = Math.random() < 0.5 ? 1 : -1;
      this.backoff = 0;
      this.aimJit = 0;
      this.react = 0;
    }
    update(b, t, m, dt) {
      const inp = b.input;
      inp.fire = [false, false, false];
      inp.boost = false;
      if (!t || !t.alive || m.state !== "fight") {
        inp.mag = 0;
        return;
      }
      const d = this.d;
      const dx = t.x - b.x, dy = t.y - b.y, dist = hyp(dx, dy) || 1;
      const angTo = Math.atan2(dy, dx);
      const ferr = Math.abs(angDiff(b.a, angTo));
      const ranged = b.weapons.length > 0 && b.weapons.every((w) => RANGED.has(w.def.kind));
      const hasFlip = b.weapons.some((w) => w.def.kind === "flipper") || b.st.ram > 1;
      const spinW = b.weapons.find((w) => w.def.kind === "spin");
      this.think -= dt;
      this.backoff -= dt;
      if (this.think <= 0 || !this.goal) {
        this.think = 0.34 - 0.22 * d + Math.random() * 0.12;
        this.aimJit = (Math.random() - 0.5) * (1 - d) * 0.5;
        const lead = 0.2 + 0.3 * d;
        let gx = t.x + t.vx * lead, gy = t.y + t.vy * lead;
        if (ranged) {
          const pref = 270;
          if (dist < pref - 70) {
            gx = b.x - dx;
            gy = b.y - dy;
          } else if (dist < pref + 90) {
            gx = b.x - dy * this.flank + dx * 0.2;
            gy = b.y + dx * this.flank + dy * 0.2;
          }
        } else {
          const tFace = Math.abs(angDiff(t.a, Math.atan2(-dy, -dx)));
          const tHasFront = t.weapons.some((w) => !RANGED.has(w.def.kind));
          if (tHasFront && d > 0.3 && tFace < 0.7 && dist > 80 && dist < 340 && Math.random() < d * 0.9) {
            const px = -dy / dist, py = dx / dist;
            gx = t.x + px * 130 * this.flank;
            gy = t.y + py * 130 * this.flank;
          }
          if (hasFlip && m.pitOpen && d > 0.45) {
            const P = m.nearestPit(t.x, t.y);
            if (P) {
              const ux = t.x - P.x, uy = t.y - P.y, ul = hyp(ux, uy) || 1;
              const bx = t.x + ux / ul * (t.r + b.r + 20), by = t.y + uy / ul * (t.r + b.r + 20);
              if (hyp(bx - b.x, by - b.y) > 50 && ul < 420) {
                gx = bx;
                gy = by;
              }
            }
          }
          if (spinW && spinW.rpm < 0.3 && dist < 100 && d > 0.35) this.backoff = 0.35 + Math.random() * 0.3;
        }
        if (this.backoff > 0) {
          gx = b.x - dx;
          gy = b.y - dy;
        }
        if (Math.random() < 0.12) this.flank *= -1;
        this.goal = { x: gx, y: gy };
      }
      let vx = this.goal.x - b.x, vy = this.goal.y - b.y;
      const vl = hyp(vx, vy) || 1;
      vx /= vl;
      vy /= vl;
      if (Math.random() < 0.35 + 0.65 * d) {
        const look = 45 + hyp(b.vx, b.vy) * 0.5;
        if (m.danger(b.x + vx * look, b.y + vy * look, b)) {
          const base = Math.atan2(vy, vx);
          for (const off of [0.7, -0.7, 1.4, -1.4, 2.2, -2.2, Math.PI]) {
            const a = base + off * this.flank;
            if (!m.danger(b.x + Math.cos(a) * look, b.y + Math.sin(a) * look, b)) {
              vx = Math.cos(a);
              vy = Math.sin(a);
              break;
            }
          }
        }
      }
      if (this.aimJit) {
        const a = Math.atan2(vy, vx) + this.aimJit;
        vx = Math.cos(a);
        vy = Math.sin(a);
      }
      inp.x = vx;
      inp.y = vy;
      inp.mag = 0.72 + 0.28 * d;
      this.react -= dt;
      b.weapons.forEach((w, i) => {
        const k = w.def.kind;
        if (k === "spin") inp.fire[i] = dist < 320;
        else if (k === "hammer" || k === "flipper") {
          const inRange = m.meleeCheck(b, i, w.def.range * 1.1, w.def.arc, t);
          if (inRange && this.react <= 0) {
            this.react = 0.45 * (1 - d) + 0.04;
            inp.fire[i] = Math.random() < 0.35 + 0.65 * d;
          }
        } else if (k === "saw" || k === "flame") inp.fire[i] = dist < w.def.range + t.r + b.r + 12 && ferr < 0.7;
        else if (k === "rocket") inp.fire[i] = dist < w.def.range && ferr < 0.6;
        else inp.fire[i] = dist < w.def.range && ferr < 0.1 + (1 - d) * 0.2;
      });
      if (b.boostCd <= 0) {
        if (!ranged && dist > 110 && dist < 330 && ferr < 0.3 && Math.random() < dt * (0.4 + d * 1.6)) inp.boost = true;
        if (d > 0.4 && m.danger(b.x, b.y, b)) inp.boost = true;
      }
    }
  };
  var TUT_STEPS = [
    "Drag anywhere on the LEFT side of the screen to drive. Your bot turns toward your thumb.",
    "Nice! Now drive through the 3 glowing beacons.",
    "Tap the BOOST button for a burst of speed.",
    "Spinners need to spin up first! HOLD the weapon button, then ram the target dummy."
  ];
  var Match = class {
    constructor(o) {
      this.o = o;
      this.arenaId = o.arena;
      this.arena = ARENAS[o.arena];
      this.events = o.onEvent || (() => {
      });
      this.time = 0;
      this.state = "countdown";
      this.countdown = o.tutorial ? 0.6 : 3.2;
      this.lastCount = 4;
      this.duration = o.tutorial ? Infinity : o.duration || 120;
      this.player = new Bot(o.player.build, o.player.levels, "player", 250, 500, 0, "YOU");
      this.enemy = new Bot(o.enemy.build, o.enemy.levels, o.enemy.team || "enemy", 1150, 500, Math.PI, o.enemy.name);
      if (!o.enemy.dummy) this.enemy.ai = new AI(o.enemy.diff ?? 0.3);
      if (o.player.ai) this.player.ai = new AI(o.player.ai);
      this.bots = [this.player, this.enemy];
      this.projectiles = [];
      this.particles = [];
      this.cam = { x: 700, y: 500, shake: 0 };
      this.pitOpen = false;
      this.result = null;
      this.endT = 0;
      this.slowmo = 0;
      this.hammerIdx = /* @__PURE__ */ new Map();
      this.headless = !!o.headless;
      if (o.tutorial) {
        this.tut = { step: 0, dist: 0, beacons: [{ x: 520, y: 330 }, { x: 960, y: 300 }, { x: 1080, y: 720 }].map((b) => ({ ...b, got: false })), boosted: false, spikeTip: false };
        this.enemy.x = 1060;
        this.enemy.y = 480;
        this.enemy.invuln = true;
        this.enemy.team = "dummy";
        this.player.minHp = 1;
        this.enemy.hidden = true;
      }
    }
    emit(type, data) {
      this.events(type, data);
    }
    other(b) {
      return b === this.player ? this.enemy : this.player;
    }
    start() {
      if (this.tut) this.emit("tut", { text: TUT_STEPS[0], step: 0 });
    }
    hammerState(h) {
      const p = ((this.time + h.offset) % h.period + h.period) % h.period;
      return { warn: this.time > 1 && p > h.period - 0.9, slam: p < 0.3 && this.time > 1 ? 1 - p / 0.3 : 0, idx: Math.floor((this.time + h.offset) / h.period) };
    }
    nearestPit(x, y) {
      let best = null, bd = Infinity;
      for (const p of this.arena.pits) {
        const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
        const d = hyp(cx - x, cy - y);
        if (d < bd) {
          bd = d;
          best = { x: cx, y: cy };
        }
      }
      return best;
    }
    danger(x, y, b) {
      const A = this.arena, m = 26;
      if (x < m || y < m || x > WORLD.w - m || y > WORLD.h - m) return true;
      for (const p of A.pillars) if (hyp(x - p.x, y - p.y) < p.r + b.r) return true;
      for (const k of A.blocks) if (x > k.x - b.r && x < k.x + k.w + b.r && y > k.y - b.r && y < k.y + k.h + b.r) return true;
      const pitSoon = this.pitOpen || A.pitOpen && this.time > A.pitOpen - 2;
      if (pitSoon) {
        for (const p of A.pits) if (x > p.x - 20 && x < p.x + p.w + 20 && y > p.y - 20 && y < p.y + p.h + 20) return true;
      }
      if (!b.st.hover) {
        for (const s of A.spikes) {
          const c = cyc(s, this.time);
          if ((c.on || c.f > 0.6) && x > s.x - 10 && x < s.x + s.w + 10 && y > s.y - 10 && y < s.y + s.h + 10) return true;
        }
        for (const v of A.vents) {
          const c = cyc(v, this.time);
          if ((c.on || c.f > 0.6) && hyp(x - v.x, y - v.y) < v.r + 14) return true;
        }
      }
      for (const s of A.saws) {
        const c = cyc(s, this.time);
        if ((c.on || c.f > 0.6) && hyp(x - s.x, y - s.y) < s.r + b.r + 16) return true;
      }
      for (const h of A.hammers) {
        const st = this.hammerState(h);
        if (st.warn && x > h.x && x < h.x + h.w && y > h.y && y < h.y + h.h) return true;
      }
      return false;
    }
    meleeCheck(b, slot, range, arc, t) {
      if (!t || !t.alive || t.hidden || t.air > 0.15) return false;
      const mp = b.mountPos(slot);
      const d = hyp(t.x - mp.x, t.y - mp.y);
      if (d - t.r > range + b.r * 0.25) return false;
      const ang = Math.abs(angDiff(b.a, Math.atan2(t.y - b.y, t.x - b.x)));
      return ang <= arc / 2 * Math.PI / 180 + 0.18;
    }
    // ---------------- damage & effects
    damage(t, amt, src, o = {}) {
      if (!t.alive || amt <= 0 || t.hidden) return 0;
      if (t.invuln) {
        this.spark(t.x, t.y, 4, "#ffd23f");
        return 0;
      }
      let crit = false;
      if (src && src.st.crit && o.kind !== "hazard" && o.kind !== "thorns" && Math.random() < src.st.crit) {
        amt *= 1.6;
        crit = true;
      }
      let a = amt, absorbed = 0;
      if (t.shield > 0 && o.kind !== "burn") {
        absorbed = Math.min(t.shield, a);
        t.shield -= absorbed;
        a -= absorbed;
        t.shieldHit = 0.35;
      }
      t.shieldT = t.st.shieldDelay;
      a *= 1 - t.st.dr * (1 - (o.pierce || 0));
      t.hp -= a;
      if (t.minHp && t.hp < t.minHp) t.hp = t.minHp;
      t.flash = 0.12;
      const total = a + absorbed;
      if (src && src !== t) src.dmgDealt += total;
      if (!this.headless && total >= 0.5) this.text(t.x + (Math.random() - 0.5) * 20, t.y - t.r - 6, Math.round(total) + (crit ? "!" : ""), crit ? "#ffd23f" : absorbed > a ? "#8fdcff" : t === this.player ? "#ff6b8a" : "#ffffff", crit ? 1.3 : 1);
      if (o.kind === "melee" && src && src !== t) {
        if (t.st.thorns) this.damage(src, total * t.st.thorns, t, { kind: "thorns" });
        if (t.st.reactive) {
          const dx = src.x - t.x, dy = src.y - t.y, l = hyp(dx, dy) || 1;
          this.knock(src, dx / l, dy / l, t.st.reactive);
          this.ring(t.x, t.y, t.r * 2, "#ff9a3c");
        }
      }
      const big = total > 14;
      if (t === this.player || src === this.player) {
        this.cam.shake = Math.max(this.cam.shake, Math.min(14, 2 + total * 0.35));
        this.emit("hit", { player: t === this.player, amount: total, big });
      }
      if (t.hp <= 0) this.kill(t, src);
      return total;
    }
    knock(t, nx, ny, force) {
      if (!t.alive) return;
      const f = force * (1 - t.st.kbRes) * Math.sqrt(40 / Math.max(20, t.st.weight));
      t.vx += nx * f;
      t.vy += ny * f;
      t.kbT = 0.35;
    }
    launch(t, nx, ny, force, air) {
      this.knock(t, nx, ny, force);
      const a = air * (1 - t.st.stunRes);
      if (a > 0.05) {
        t.air = Math.max(t.air, a);
        t.airMax = t.air;
        t.stun = Math.max(t.stun, t.air + 0.15);
        t.spinDir = Math.random() < 0.5 ? -1 : 1;
      }
    }
    kill(t, src) {
      if (!t.alive) return;
      t.alive = false;
      t.hp = 0;
      this.explode(t.x, t.y, 1.6);
      this.emit("sfx", { name: "ko" });
      this.slowmo = 1;
      this.cam.shake = 18;
    }
    explode(x, y, s = 1) {
      if (this.headless) return;
      this.ring(x, y, 60 * s, "#ffd23f");
      for (let i = 0; i < 26 * s; i++) {
        const a = Math.random() * TAU2, v = 80 + Math.random() * 320 * s;
        this.particles.push({ t: "fire", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.5, max: 1, size: 6 + Math.random() * 10 * s });
      }
      for (let i = 0; i < 12 * s; i++) {
        const a = Math.random() * TAU2, v = 60 + Math.random() * 260;
        this.particles.push({ t: "debris", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1 + Math.random(), max: 2, size: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 20 });
      }
      for (let i = 0; i < 10 * s; i++) this.particles.push({ t: "smoke", x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40, life: 1.4, max: 1.4, size: 16 + Math.random() * 20 });
    }
    spark(x, y, n = 8, color = "#ffe27a", speed = 1) {
      if (this.headless) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU2, v = (120 + Math.random() * 380) * speed;
        this.particles.push({ t: "spark", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.2 + Math.random() * 0.3, max: 0.5, color });
      }
    }
    ring(x, y, R, color) {
      if (!this.headless) this.particles.push({ t: "ring", x, y, R, life: 0.35, max: 0.35, color });
    }
    text(x, y, s, color, scale = 1) {
      this.particles.push({ t: "text", x, y, s, color, life: 0.9, max: 0.9, vy: -60, scale });
    }
    // ---------------- weapons
    hitMelee(b, w, t, dmg, kb, o = {}) {
      const dx = t.x - b.x, dy = t.y - b.y, l = hyp(dx, dy) || 1;
      const fx = Math.cos(b.a), fy = Math.sin(b.a);
      let nx = dx / l * 0.6 + fx * 0.4, ny = dy / l * 0.6 + fy * 0.4;
      const nl = hyp(nx, ny) || 1;
      nx /= nl;
      ny /= nl;
      const m = levelMult(w.lvl) * b.st.dmgMul;
      const dealt = this.damage(t, dmg * m, b, { kind: "melee", pierce: o.pierce || w.def.pierce || 0 });
      if (o.air) this.launch(t, nx, ny, kb, o.air);
      else if (kb) this.knock(t, nx, ny, kb);
      const cx = (b.x + t.x) / 2, cy = (b.y + t.y) / 2;
      this.spark(cx, cy, Math.min(26, 6 + Math.round(dealt / 2)), o.color || "#ffe27a", 1 + Math.min(1, dealt / 30));
      if (dealt > 12) this.ring(cx, cy, 30 + dealt, "rgba(255,255,255,0.8)");
      this.emit("sfx", { name: o.sfx || "hit", vol: Math.min(1, 0.3 + dealt / 40), near: b === this.player || t === this.player });
      return dealt;
    }
    updateWeapons(b, dt, ctrl) {
      const t = this.other(b);
      const inp = b.input;
      for (const w of b.weapons) {
        const d = w.def;
        const held = ctrl && !!inp.fire[w.slot];
        w.cd = Math.max(0, w.cd - dt);
        w.hitCd -= dt;
        w.swing = Math.max(0, w.swing - dt);
        w.active = false;
        switch (d.kind) {
          case "spin": {
            if (held) w.rpm = Math.min(1, w.rpm + dt / (d.spinup * b.st.cdMul));
            else w.rpm = Math.max(0, w.rpm - dt * 0.3);
            w.spin += (2 + w.rpm * 38) * dt;
            if (w.rpm > 0.22 && w.hitCd <= 0 && this.meleeCheck(b, w.slot, d.range, d.arc, t)) {
              const e = w.rpm * w.rpm * 0.7 + w.rpm * 0.3;
              this.hitMelee(b, w, t, d.dmg * e, d.kb * e, { air: d.lift ? d.lift * w.rpm : 0, sfx: "spinhit" });
              const rx = b.x - t.x, ry = b.y - t.y, rl = hyp(rx, ry) || 1;
              this.knock(b, rx / rl, ry / rl, d.kb * e * 0.35);
              w.rpm *= 0.45;
              w.hitCd = 0.25;
            }
            break;
          }
          case "hammer": {
            if (held && w.cd <= 0 && w.wind <= 0) {
              w.wind = 0.2;
              this.emit("sfx", { name: "whoosh", near: b === this.player });
            }
            if (w.wind > 0) {
              w.wind -= dt;
              if (w.wind <= 0) {
                w.wind = 0;
                w.swing = 0.25;
                w.cd = d.cd * b.st.cdMul;
                const mp = b.mountPos(w.slot);
                const fx = Math.cos(b.a), fy = Math.sin(b.a);
                const hx = mp.x + fx * d.range * 0.7, hy = mp.y + fy * d.range * 0.7;
                if (this.meleeCheck(b, w.slot, d.range, d.arc, t)) this.hitMelee(b, w, t, d.dmg, 120, { sfx: "slam", stun: 0.2 });
                else {
                  this.spark(hx, hy, 5, "#aab4c3", 0.6);
                  this.emit("sfx", { name: "clank", vol: 0.4, near: b === this.player });
                }
                if (b === this.player || t === this.player) this.cam.shake = Math.max(this.cam.shake, 5);
              }
            }
            break;
          }
          case "flipper": {
            if (held && w.cd <= 0) {
              w.cd = d.cd * b.st.cdMul;
              w.swing = 0.3;
              this.emit("sfx", { name: "flip", near: b === this.player });
              if (this.meleeCheck(b, w.slot, d.range, d.arc, t)) this.hitMelee(b, w, t, d.dmg, d.kb, { air: d.air, sfx: "flip" });
            }
            break;
          }
          case "saw": {
            if (held) {
              w.active = true;
              w.spin += dt * 30;
              if (w.hitCd <= 0 && this.meleeCheck(b, w.slot, d.range, d.arc, t)) {
                w.hitCd = 0.12;
                this.hitMelee(b, w, t, d.dps * 0.12, 30, { sfx: "saw", color: d.style === "plasma" ? "#ff5cf0" : "#ffe27a" });
              }
            } else w.spin += dt * 2;
            break;
          }
          case "flame": {
            if (held && !w.over) {
              w.active = true;
              w.heat += dt / d.fuel;
              if (w.heat >= 1) {
                w.over = true;
                this.emit("sfx", { name: "overheat", near: b === this.player });
              }
              const mp = b.mountPos(w.slot);
              const a = b.a;
              if (!this.headless) for (let i = 0; i < 3; i++) {
                const sp = a + (Math.random() - 0.5) * (d.arc * Math.PI / 180), v = 260 + Math.random() * 160;
                this.particles.push({ t: "fire", x: mp.x, y: mp.y, vx: Math.cos(sp) * v + b.vx, vy: Math.sin(sp) * v + b.vy, life: d.range / v, max: d.range / v, size: 5 + Math.random() * 6, grow: 3 });
              }
              w.tick -= dt;
              if (w.tick <= 0) {
                w.tick = 0.12;
                const dx = t.x - mp.x, dy = t.y - mp.y, dist = hyp(dx, dy);
                const ang = Math.abs(angDiff(a, Math.atan2(dy, dx)));
                if (t.alive && !t.hidden && dist < d.range + t.r && ang < d.arc / 2 * Math.PI / 180 + 0.12) {
                  this.damage(t, d.dps * 0.12 * levelMult(w.lvl) * b.st.dmgMul, b, { kind: "flame" });
                  t.burn = 2.2;
                  t.burnDps = d.burn * levelMult(w.lvl);
                  t.burnSrc = b;
                }
                this.emit("sfx", { name: "flame", vol: 0.25, near: b === this.player });
              }
            } else {
              w.heat = Math.max(0, w.heat - dt * 0.35);
              if (w.over && w.heat < 0.35) w.over = false;
            }
            break;
          }
          case "gun": {
            if (held && w.cd <= 0) {
              w.cd = 1 / d.rof * b.st.cdMul;
              w.swing = 0.05;
              const mp = b.mountPos(w.slot);
              const a = b.a + (Math.random() - 0.5) * 0.08;
              this.projectiles.push({ k: "nail", x: mp.x, y: mp.y, vx: Math.cos(a) * d.speed, vy: Math.sin(a) * d.speed, life: d.range / d.speed, owner: b, dmg: d.dmg * levelMult(w.lvl) * b.st.dmgMul, r: 3 });
              this.emit("sfx", { name: "shoot", vol: 0.25, near: b === this.player });
            }
            break;
          }
          case "rocket": {
            if (held && w.cd <= 0) {
              w.cd = d.cd * b.st.cdMul;
              const mp = b.mountPos(w.slot);
              this.projectiles.push({ k: "rocket", x: mp.x, y: mp.y, a: b.a, v: d.speed * 0.5, vmax: d.speed, life: d.range / d.speed + 0.6, owner: b, dmg: d.dmg * levelMult(w.lvl) * b.st.dmgMul, radius: d.radius, kb: d.kb, r: 6, turn: 2.3 * b.st.homing, smoke: 0 });
              this.emit("sfx", { name: "rocket", near: b === this.player });
            }
            break;
          }
          case "emp": {
            if (held && w.cd <= 0) {
              w.cd = d.cd * b.st.cdMul;
              const mp = b.mountPos(w.slot);
              this.projectiles.push({ k: "emp", x: mp.x, y: mp.y, vx: Math.cos(b.a) * d.speed, vy: Math.sin(b.a) * d.speed, life: d.range / d.speed, owner: b, dmg: d.dmg * levelMult(w.lvl) * b.st.dmgMul, stun: d.stun, r: 9 });
              this.emit("sfx", { name: "zap", near: b === this.player });
            }
            break;
          }
          case "rail": {
            if (held && w.cd <= 0 && w.wind <= 0) {
              w.wind = d.charge;
              this.emit("sfx", { name: "charge", near: b === this.player });
            }
            if (w.wind > 0) {
              w.wind -= dt;
              if (w.wind <= 0) {
                w.wind = 0;
                w.cd = d.cd * b.st.cdMul;
                w.swing = 0.1;
                const mp = b.mountPos(w.slot);
                const fx = Math.cos(b.a), fy = Math.sin(b.a);
                let len = d.range;
                if (t.alive && !t.hidden) {
                  const rx = t.x - mp.x, ry = t.y - mp.y;
                  const proj = rx * fx + ry * fy;
                  const perp = Math.abs(rx * fy - ry * fx);
                  if (proj > 0 && proj < d.range && perp < t.r + 10) {
                    this.damage(t, d.dmg * levelMult(w.lvl) * b.st.dmgMul, b, { kind: "beam", pierce: d.pierce });
                    this.knock(t, fx, fy, d.kb);
                    this.spark(t.x, t.y, 16, "#8cfff0", 1.4);
                  }
                }
                this.particles.push({ t: "beam", x: mp.x, y: mp.y, x2: mp.x + fx * len, y2: mp.y + fy * len, life: 0.3, max: 0.3, color: "#8cfff0" });
                this.knock(b, -fx, -fy, 160);
                this.emit("sfx", { name: "rail", near: b === this.player });
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
        b.vx *= Math.exp(-3 * dt);
        b.vy *= Math.exp(-3 * dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (!this.headless && Math.random() < dt * 12 && b.fall == null) this.particles.push({ t: "smoke", x: b.x, y: b.y, vx: 0, vy: -20, life: 1.2, max: 1.2, size: 14 });
        return;
      }
      const st = b.st;
      b.flash = Math.max(0, b.flash - dt);
      b.shieldHit = Math.max(0, b.shieldHit - dt);
      b.stun = Math.max(0, b.stun - dt);
      b.kbT = Math.max(0, b.kbT - dt);
      b.hazCd -= dt;
      b.ramCd -= dt;
      if (b.air > 0) {
        b.air -= dt;
        if (b.air <= 0) {
          b.air = 0;
          this.spark(b.x, b.y, 8, "#aab4c3", 0.6);
          this.emit("sfx", { name: "clank", vol: 0.5, near: b === this.player });
        }
      }
      const ctrl = this.state === "fight" && b.stun <= 0 && b.air <= 0 && !b.hidden;
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
        b.boostT = 0.4;
        b.boostCd = st.boostCd;
        this.emit("sfx", { name: "boost", near: b === this.player });
        if (b === this.player && this.tut) this.tut.boosted = true;
      }
      b.boostCd -= dt;
      const boosting = b.boostT > 0;
      b.boostT -= dt;
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
      b.vx = fwd * fx - lat * fy;
      b.vy = fwd * fy + lat * fx;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.phase += fwd * dt / Math.max(8, b.r * 0.5);
      if (st.regen && b.hp < b.maxHp) b.hp = Math.min(b.maxHp, b.hp + st.regen * dt);
      if (st.shieldCap) {
        b.shieldT -= dt;
        if (b.shieldT <= 0) b.shield = Math.min(st.shieldCap, b.shield + st.shieldRegen * dt);
      }
      if (b.burn > 0) {
        b.burn -= dt;
        b.burnTick -= dt;
        if (b.burnTick <= 0) {
          b.burnTick = 0.33;
          this.damage(b, b.burnDps * 0.33, b.burnSrc || null, { kind: "burn" });
        }
        if (!this.headless && Math.random() < dt * 20) this.particles.push({ t: "fire", x: b.x + (Math.random() - 0.5) * b.r, y: b.y + (Math.random() - 0.5) * b.r, vx: 0, vy: -40, life: 0.4, max: 0.4, size: 5 });
      }
      this.updateWeapons(b, dt, ctrl);
      if (!this.headless && b.hp < b.maxHp * 0.3 && Math.random() < dt * 6) this.particles.push({ t: "smoke", x: b.x, y: b.y, vx: (Math.random() - 0.5) * 20, vy: -30, life: 1, max: 1, size: 8 + Math.random() * 8 });
    }
    // ---------------- collisions
    collideWorld(b) {
      const A = this.arena;
      const bounce = (nx, ny) => {
        const vn = b.vx * nx + b.vy * ny;
        if (vn < 0) {
          b.vx -= 1.45 * vn * nx;
          b.vy -= 1.45 * vn * ny;
          if (-vn > 170) {
            this.spark(b.x - nx * b.r, b.y - ny * b.r, 6, "#9fb0c3", 0.7);
            this.emit("sfx", { name: "clank", vol: Math.min(1, -vn / 500), near: b === this.player });
            if (-vn > 380 && b.kbT > 0) this.damage(b, (-vn - 380) * 0.04, this.other(b), { kind: "wall" });
          }
        }
      };
      const r = b.r;
      if (b.x < r) {
        b.x = r;
        bounce(1, 0);
      }
      if (b.x > WORLD.w - r) {
        b.x = WORLD.w - r;
        bounce(-1, 0);
      }
      if (b.y < r) {
        b.y = r;
        bounce(0, 1);
      }
      if (b.y > WORLD.h - r) {
        b.y = WORLD.h - r;
        bounce(0, -1);
      }
      for (const p of A.pillars) {
        const dx = b.x - p.x, dy = b.y - p.y, d = hyp(dx, dy);
        if (d < p.r + r && d > 0) {
          const nx = dx / d, ny = dy / d;
          b.x = p.x + nx * (p.r + r);
          b.y = p.y + ny * (p.r + r);
          bounce(nx, ny);
        }
      }
      for (const k of A.blocks) {
        const cx = clamp(b.x, k.x, k.x + k.w), cy = clamp(b.y, k.y, k.y + k.h);
        const dx = b.x - cx, dy = b.y - cy, d = hyp(dx, dy);
        if (d < r) {
          let nx, ny;
          if (d > 0) {
            nx = dx / d;
            ny = dy / d;
          } else {
            nx = 0;
            ny = b.y < k.y + k.h / 2 ? -1 : 1;
          }
          b.x = cx + nx * r;
          b.y = cy + ny * r;
          bounce(nx, ny);
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
      a.x -= nx * pen * (mb / (ma + mb));
      a.y -= ny * pen * (mb / (ma + mb));
      b.x += nx * pen * (ma / (ma + mb));
      b.y += ny * pen * (ma / (ma + mb));
      const sa = a.vx * nx + a.vy * ny, sb = -(b.vx * nx + b.vy * ny);
      const rel = sa + sb;
      if (rel > 0) {
        const j = 1.35 * rel / (1 / ma + 1 / mb);
        a.vx -= j / ma * nx;
        a.vy -= j / ma * ny;
        b.vx += j / mb * nx;
        b.vy += j / mb * ny;
        if (a.ramCd <= 0 && b.ramCd <= 0 && rel > 110) {
          a.ramCd = b.ramCd = 0.4;
          const dmgToB = Math.max(0, sa - 110) * 0.05 * a.st.ram + a.st.contact;
          const dmgToA = Math.max(0, sb - 110) * 0.05 * b.st.ram + b.st.contact;
          if (dmgToB > 0.5) this.damage(b, dmgToB, a, { kind: "ram" });
          if (dmgToA > 0.5) this.damage(a, dmgToA, b, { kind: "ram" });
          this.spark(a.x + nx * a.r, a.y + ny * a.r, 6 + Math.round(rel / 60), "#cfd7e2", 0.8);
          this.emit("sfx", { name: "clank", vol: Math.min(1, rel / 400), near: true });
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
            b.hazCd = 0.35;
            this.damage(b, 9, null, { kind: "hazard" });
            const a = Math.random() * TAU2;
            this.knock(b, Math.cos(a), Math.sin(a), 120);
            this.spark(b.x, b.y, 6, "#ff4d6d");
            this.emit("sfx", { name: "spike", near: b === this.player });
            if (this.tut && b === this.player && !this.tut.spikeTip) {
              this.tut.spikeTip = true;
              this.emit("toast", "Ouch! Spike strips hurt. Steer clear of hazards.");
            }
          }
        }
        for (const v of A.vents) {
          if (!cyc(v, t).on) continue;
          if (hyp(b.x - v.x, b.y - v.y) < v.r + b.r * 0.3 && b.hazCd <= 0) {
            b.hazCd = 0.3;
            this.damage(b, 6, null, { kind: "hazard" });
            b.burn = 1.5;
            b.burnDps = 8;
            b.burnSrc = null;
          }
        }
      }
      if (grounded || b.air < 0.2) {
        for (const s of A.saws) {
          const c = cyc(s, t);
          if (!c.on) continue;
          const up = Math.min(1, c.f * 6, (1 - c.f) * 6);
          if (up < 0.3) continue;
          const dx = b.x - s.x, dy = b.y - s.y, d = hyp(dx, dy) || 1;
          if (d < s.r * up + b.r && b.hazCd <= 0) {
            b.hazCd = 0.3;
            this.damage(b, 15, null, { kind: "hazard" });
            this.knock(b, dx / d, dy / d, 380);
            this.spark(s.x + dx / d * s.r, s.y + dy / d * s.r, 14, "#ffe27a", 1.2);
            this.emit("sfx", { name: "saw", vol: 0.9, near: b === this.player });
          }
        }
      }
      for (const h of A.hammers) {
        const st = this.hammerState(h);
        const last3 = this.hammerIdx.get(h);
        if (st.slam > 0.9 && last3 !== st.idx) {
          this.hammerIdx.set(h, st.idx);
          this.emit("sfx", { name: "slam", vol: 1, near: true });
          this.cam.shake = Math.max(this.cam.shake, 8);
          for (const bb of this.bots) if (bb.alive && !bb.hidden && bb.x > h.x && bb.x < h.x + h.w && bb.y > h.y && bb.y < h.y + h.h) {
            this.damage(bb, 32, null, { kind: "hazard" });
            bb.stun = Math.max(bb.stun, 0.6 * (1 - bb.st.stunRes));
            this.spark(bb.x, bb.y, 20, "#ffffff", 1.3);
          }
        }
      }
      if (this.pitOpen && grounded) {
        for (const p of A.pits) {
          if (b.x > p.x && b.x < p.x + p.w && b.y > p.y && b.y < p.y + p.h) {
            if (b.st.anchor && !b.anchorUsed) {
              b.anchorUsed = true;
              const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
              let dx = b.x - cx, dy = b.y - cy;
              const l = hyp(dx, dy) || 1;
              dx /= l;
              dy /= l;
              b.x = cx + dx * (p.w * 0.75 + b.r);
              b.y = cy + dy * (p.h * 0.75 + b.r);
              b.vx = dx * 300;
              b.vy = dy * 300;
              b.kbT = 0.4;
              this.damage(b, 20, null, { kind: "hazard" });
              this.ring(b.x, b.y, 50, "#b86bff");
              this.emit("toast", b === this.player ? "Anchor Magnet saved you!" : "Enemy Anchor Magnet activated!");
            } else {
              b.alive = false;
              b.fall = 0;
              b.hp = 0;
              b.pitted = true;
              b.vx *= 0.3;
              b.vy *= 0.3;
              const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
              b.vx += (cx - b.x) * 2;
              b.vy += (cy - b.y) * 2;
              this.emit("sfx", { name: "fall", near: true });
              this.slowmo = 1;
              this.text(b.x, b.y - 30, "PITTED!", "#ffd23f", 1.5);
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
        if (p.k === "rocket") {
          if (t.alive && !t.hidden) {
            const da = angDiff(p.a, Math.atan2(t.y - p.y, t.x - p.x));
            p.a += clamp(da, -p.turn * dt, p.turn * dt);
          }
          p.v = Math.min(p.vmax, p.v + p.vmax * 1.5 * dt);
          p.vx = Math.cos(p.a) * p.v;
          p.vy = Math.sin(p.a) * p.v;
          p.smoke -= dt;
          if (p.smoke <= 0 && !this.headless) {
            p.smoke = 0.03;
            this.particles.push({ t: "smoke", x: p.x, y: p.y, vx: 0, vy: 0, life: 0.5, max: 0.5, size: 5 });
          }
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        let dead = p.life <= 0;
        if (p.x < 0 || p.y < 0 || p.x > WORLD.w || p.y > WORLD.h) dead = true;
        for (const q of A.pillars) if (hyp(p.x - q.x, p.y - q.y) < q.r) dead = true;
        for (const k of A.blocks) if (p.x > k.x && p.x < k.x + k.w && p.y > k.y && p.y < k.y + k.h) dead = true;
        let hit = false;
        if (!dead && t.alive && !t.hidden && t.air < 0.3 && hyp(p.x - t.x, p.y - t.y) < t.r + p.r) {
          hit = true;
          dead = true;
        }
        if (dead) {
          p.dead = true;
          if (p.k === "rocket") {
            this.explode(p.x, p.y, 0.7);
            this.emit("sfx", { name: "boom", near: true });
            for (const b of this.bots) {
              if (!b.alive || b.hidden) continue;
              const d = hyp(b.x - p.x, b.y - p.y);
              if (d < p.radius + b.r) {
                const f = 1 - Math.max(0, d - b.r) / p.radius;
                this.damage(b, p.dmg * (b === p.owner ? 0.3 : 1) * (0.4 + 0.6 * f), p.owner, { kind: "blast" });
                const l = d || 1;
                this.knock(b, (b.x - p.x) / l, (b.y - p.y) / l, p.kb * f);
              }
            }
            if (p.owner === this.player || t === this.player) this.cam.shake = Math.max(this.cam.shake, 9);
          } else if (hit && p.k === "nail") {
            this.damage(t, p.dmg, p.owner, { kind: "proj" });
            this.spark(p.x, p.y, 3, "#ffe27a", 0.6);
            this.knock(t, p.vx / 600, p.vy / 600, 30);
            this.emit("sfx", { name: "tick", vol: 0.3, near: true });
          } else if (hit && p.k === "emp") {
            t.shield = 0;
            t.shieldT = t.st.shieldDelay + 1;
            this.damage(t, p.dmg, p.owner, { kind: "proj" });
            t.stun = Math.max(t.stun, p.stun * (1 - t.st.stunRes));
            this.ring(p.x, p.y, 50, "#6ec8ff");
            this.spark(p.x, p.y, 14, "#6ec8ff");
            this.emit("sfx", { name: "zap", near: true });
          } else if (p.k === "emp") this.ring(p.x, p.y, 24, "#6ec8ff");
        }
      }
      this.projectiles = this.projectiles.filter((p) => !p.dead);
    }
    updateParticles(dt) {
      for (const p of this.particles) {
        p.life -= dt;
        if (p.vx != null) {
          p.x += p.vx * dt;
          p.y += (p.vy || 0) * dt;
        }
        if (p.t === "spark" || p.t === "debris") {
          p.vx *= Math.exp(-4 * dt);
          p.vy *= Math.exp(-4 * dt);
        }
        if (p.t === "fire") {
          p.vx *= Math.exp(-2 * dt);
          p.vy *= Math.exp(-2 * dt);
          if (p.grow) p.size += p.grow * dt * 10;
        }
        if (p.t === "debris") p.rot += p.vr * dt;
        if (p.t === "text") p.vy *= Math.exp(-3 * dt);
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
        for (const b of T.beacons) if (!b.got && hyp(b.x - p.x, b.y - p.y) < 40 + p.r) {
          b.got = true;
          this.ring(b.x, b.y, 60, "#3ff0ff");
          this.emit("sfx", { name: "beacon" });
        }
        if (T.beacons.every((b) => b.got)) this.tutNext();
      } else if (T.step === 2) {
        if (T.boosted) this.tutNext();
      } else if (T.step === 3) {
        if (!this.enemy.alive) T.step = 4;
      }
    }
    tutNext() {
      const T = this.tut;
      T.step++;
      if (T.step === 3) {
        this.enemy.hidden = false;
        this.enemy.invuln = false;
        this.ring(this.enemy.x, this.enemy.y, 80, "#ffd23f");
      }
      this.emit("sfx", { name: "beacon" });
      this.emit("tut", { text: TUT_STEPS[T.step], step: T.step });
    }
    // ---------------- main loop
    update(dt) {
      if (this.state === "over") {
        this.updateParticles(dt);
        return;
      }
      if (this.slowmo > 0) {
        this.slowmo -= dt;
        dt *= 0.3;
      }
      if (this.state === "countdown") {
        this.countdown -= dt;
        const c = Math.ceil(this.countdown);
        if (c !== this.lastCount && c > 0 && !this.tut) {
          this.lastCount = c;
          this.emit("count", c);
        }
        if (this.countdown <= 0) {
          this.state = "fight";
          if (!this.tut) this.emit("count", 0);
        }
        for (const b of this.bots) {
          b.input.mag = 0;
          this.updateBot(b, dt);
        }
        this.updateParticles(dt);
        this.updateCamera(dt, true);
        return;
      }
      if (this.state === "fight") this.time += dt;
      if (this.arena.pitOpen && !this.pitOpen && this.time >= this.arena.pitOpen) {
        this.pitOpen = true;
        this.emit("toast", "THE PIT IS OPEN!");
        this.emit("sfx", { name: "alarm" });
        this.cam.shake = 6;
      }
      for (const b of this.bots) if (b.ai) b.ai.update(b, this.other(b), this, dt);
      if (this.state === "ending") for (const b of this.bots) {
        b.input.mag = 0;
        b.input.fire = [false, false, false];
      }
      for (const b of this.bots) this.updateBot(b, dt);
      this.collideBots(this.player, this.enemy);
      for (const b of this.bots) {
        if (b.alive || b.fall == null) this.collideWorld(b);
        this.hazards(b, dt);
      }
      this.updateProjectiles(dt);
      this.updateParticles(dt);
      this.updateTutorial(dt);
      this.updateCamera(dt);
      this.checkEnd(dt);
    }
    checkEnd(dt) {
      if (this.state === "fight") {
        let res = null;
        if (!this.player.alive) res = { win: false, how: this.player.pitted ? "pit" : "ko" };
        else if (!this.enemy.alive) res = { win: true, how: this.enemy.pitted ? "pit" : "ko" };
        else if (this.time >= this.duration) {
          const pd = this.player.dmgDealt, ed = this.enemy.dmgDealt;
          res = { win: pd >= ed, how: "decision" };
          this.emit("toast", "TIME! Judges' decision...");
        }
        if (this.tut && this.tut.step >= 4) res = { win: true, how: "ko", tutorial: true };
        if (res) {
          res.time = this.time;
          res.dmgDealt = Math.round(this.player.dmgDealt);
          res.dmgTaken = Math.round(this.enemy.dmgDealt);
          res.hpLeft = Math.max(0, this.player.hp / this.player.maxHp);
          this.result = res;
          this.state = "ending";
          this.endT = 2;
          this.emit("sfx", { name: res.win ? "win" : "lose" });
        }
      } else if (this.state === "ending") {
        this.endT -= dt;
        if (this.endT <= 0) {
          this.state = "over";
          this.emit("end", this.result);
        }
      }
    }
    // ---------------- camera & drawing
    zoomFor(w, h) {
      return Math.max(0.5, Math.min(w, h) / 420, Math.max(w, h) / 1150);
    }
    updateCamera(dt, snap = false) {
      const p = this.player, e = this.enemy;
      let tx = p.x, ty = p.y;
      if (e.alive && !e.hidden) {
        tx += (e.x - p.x) * 0.35;
        ty += (e.y - p.y) * 0.35;
      }
      const k = snap ? 1 : 1 - Math.exp(-5 * dt);
      this.cam.x += (tx - this.cam.x) * k;
      this.cam.y += (ty - this.cam.y) * k;
      this.cam.shake = Math.max(0, this.cam.shake - dt * 30);
    }
    view(b) {
      return {
        build: b.build,
        x: b.x,
        y: b.y,
        a: b.a,
        r: b.r,
        team: b.team,
        ws: b.weapons,
        shieldFrac: b.st.shieldCap ? b.shield / b.st.shieldCap : 0,
        shieldHit: b.shieldHit,
        flash: b.flash,
        boosting: b.boostT > 0,
        air: b.air,
        airMax: b.airMax,
        stun: b.stun,
        phase: b.phase,
        burn: b.burn,
        fall: b.fall,
        spinDir: b.spinDir
      };
    }
    draw(ctx2, w, h) {
      const z = this.zoomFor(w, h);
      const hw = w / 2 / z, hh = h / 2 / z;
      let cx = this.cam.x, cy = this.cam.y;
      cx = hw * 2 >= WORLD.w + 80 ? WORLD.w / 2 : clamp(cx, hw - 40, WORLD.w - hw + 40);
      cy = hh * 2 >= WORLD.h + 80 ? WORLD.h / 2 : clamp(cy, hh - 40, WORLD.h - hh + 40);
      const sh = this.cam.shake * (this.o.shake ?? 1);
      const sx = (Math.random() - 0.5) * sh, sy = (Math.random() - 0.5) * sh;
      ctx2.fillStyle = "#05070b";
      ctx2.fillRect(0, 0, w, h);
      ctx2.save();
      ctx2.translate(w / 2, h / 2);
      ctx2.scale(z, z);
      ctx2.translate(-cx + sx, -cy + sy);
      drawArena(ctx2, this);
      if (this.tut && this.tut.step === 1) {
        const t = performance.now() / 1e3;
        for (const b of this.tut.beacons) {
          if (b.got) continue;
          ctx2.beginPath();
          ctx2.arc(b.x, b.y, 30 + Math.sin(t * 4) * 5, 0, TAU2);
          ctx2.strokeStyle = "#3ff0ff";
          ctx2.lineWidth = 4;
          ctx2.shadowColor = "#3ff0ff";
          ctx2.shadowBlur = 20;
          ctx2.stroke();
          ctx2.shadowBlur = 0;
          ctx2.beginPath();
          ctx2.arc(b.x, b.y, 10, 0, TAU2);
          ctx2.fillStyle = "rgba(63,240,255,0.6)";
          ctx2.fill();
        }
      }
      for (const p of this.particles) if (p.t === "smoke") {
        const f = p.life / p.max;
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.size * (1.6 - f * 0.6), 0, TAU2);
        ctx2.fillStyle = `rgba(60,64,72,${f * 0.35})`;
        ctx2.fill();
      }
      const order = [...this.bots].sort((a, b) => (a.fall != null ? -1 : 0) - (b.fall != null ? -1 : 0) || a.air - b.air);
      for (const b of order) {
        if (b.hidden) continue;
        if (!b.alive && b.fall == null) {
          drawBot(ctx2, { ...this.view(b), team: b.team }, { glow: false });
          ctx2.save();
          ctx2.translate(b.x, b.y);
          ctx2.beginPath();
          ctx2.arc(0, 0, b.r * 1.3, 0, TAU2);
          ctx2.fillStyle = "rgba(0,0,0,0.45)";
          ctx2.fill();
          ctx2.restore();
        } else drawBot(ctx2, this.view(b));
      }
      for (const p of this.projectiles) {
        if (p.k === "nail") {
          ctx2.strokeStyle = "#ffe27a";
          ctx2.lineWidth = 2.5;
          ctx2.beginPath();
          ctx2.moveTo(p.x, p.y);
          ctx2.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
          ctx2.stroke();
        } else if (p.k === "rocket") {
          ctx2.save();
          ctx2.translate(p.x, p.y);
          ctx2.rotate(p.a);
          ctx2.fillStyle = "#dfe4ea";
          ctx2.fillRect(-8, -3, 14, 6);
          ctx2.fillStyle = "#ff4d4d";
          ctx2.beginPath();
          ctx2.moveTo(6, -3);
          ctx2.lineTo(11, 0);
          ctx2.lineTo(6, 3);
          ctx2.fill();
          ctx2.fillStyle = `rgba(255,200,80,${0.6 + Math.random() * 0.4})`;
          ctx2.beginPath();
          ctx2.moveTo(-8, -3);
          ctx2.lineTo(-16 - Math.random() * 6, 0);
          ctx2.lineTo(-8, 3);
          ctx2.fill();
          ctx2.restore();
        } else if (p.k === "emp") {
          const g = ctx2.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16);
          g.addColorStop(0, "rgba(220,245,255,1)");
          g.addColorStop(1, "rgba(110,200,255,0)");
          ctx2.fillStyle = g;
          ctx2.beginPath();
          ctx2.arc(p.x, p.y, 16, 0, TAU2);
          ctx2.fill();
        }
      }
      for (const p of this.particles) {
        const f = Math.max(0, p.life / p.max);
        switch (p.t) {
          case "spark":
            ctx2.strokeStyle = p.color;
            ctx2.globalAlpha = f * 1.5;
            ctx2.lineWidth = 2;
            ctx2.beginPath();
            ctx2.moveTo(p.x, p.y);
            ctx2.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03);
            ctx2.stroke();
            ctx2.globalAlpha = 1;
            break;
          case "fire": {
            const c = f > 0.6 ? "255,240,180" : f > 0.3 ? "255,140,40" : "200,50,20";
            ctx2.fillStyle = `rgba(${c},${Math.min(1, f * 1.4)})`;
            ctx2.beginPath();
            ctx2.arc(p.x, p.y, p.size * (0.6 + (1 - f) * 0.8), 0, TAU2);
            ctx2.fill();
            break;
          }
          case "debris":
            ctx2.save();
            ctx2.translate(p.x, p.y);
            ctx2.rotate(p.rot);
            ctx2.fillStyle = `rgba(150,160,175,${f})`;
            ctx2.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
            ctx2.restore();
            break;
          case "ring":
            ctx2.strokeStyle = p.color;
            ctx2.globalAlpha = f;
            ctx2.lineWidth = 3;
            ctx2.beginPath();
            ctx2.arc(p.x, p.y, p.R * (1.2 - f), 0, TAU2);
            ctx2.stroke();
            ctx2.globalAlpha = 1;
            break;
          case "beam":
            ctx2.strokeStyle = p.color;
            ctx2.globalAlpha = f;
            ctx2.lineWidth = 8 * f + 2;
            ctx2.shadowColor = p.color;
            ctx2.shadowBlur = 20;
            ctx2.beginPath();
            ctx2.moveTo(p.x, p.y);
            ctx2.lineTo(p.x2, p.y2);
            ctx2.stroke();
            ctx2.shadowBlur = 0;
            ctx2.globalAlpha = 1;
            break;
          case "text":
            ctx2.globalAlpha = Math.min(1, f * 2);
            ctx2.fillStyle = p.color;
            ctx2.font = `800 ${Math.round(18 * p.scale)}px system-ui, sans-serif`;
            ctx2.textAlign = "center";
            ctx2.lineWidth = 4;
            ctx2.strokeStyle = "rgba(0,0,0,0.7)";
            ctx2.strokeText(p.s, p.x, p.y);
            ctx2.fillText(p.s, p.x, p.y);
            ctx2.globalAlpha = 1;
            break;
        }
      }
      ctx2.restore();
      const e = this.enemy;
      if (e.alive && !e.hidden) {
        const ex = (e.x - cx) * z + w / 2, ey = (e.y - cy) * z + h / 2;
        const m = 30;
        if (ex < 0 || ey < 0 || ex > w || ey > h) {
          const ix = clamp(ex, m, w - m), iy = clamp(ey, m + 60, h - m);
          const a = Math.atan2(ey - h / 2, ex - w / 2);
          ctx2.save();
          ctx2.translate(ix, iy);
          ctx2.rotate(a);
          ctx2.fillStyle = TEAM[e.team].accent;
          ctx2.beginPath();
          ctx2.moveTo(14, 0);
          ctx2.lineTo(-8, -9);
          ctx2.lineTo(-3, 0);
          ctx2.lineTo(-8, 9);
          ctx2.closePath();
          ctx2.fill();
          ctx2.restore();
        }
      }
    }
  };
  function weaponStatus(w) {
    const d = w.def;
    switch (d.kind) {
      case "spin":
        return { frac: w.rpm, ready: w.rpm > 0.9, label: `${Math.round(w.rpm * 100)}%` };
      case "flame":
        return { frac: 1 - w.heat, ready: !w.over, label: w.over ? "HOT" : "" };
      case "saw":
        return { frac: 1, ready: true, label: "" };
      default: {
        const max = (d.kind === "gun" ? 1 / d.rof : d.cd) || 1;
        return { frac: 1 - Math.min(1, w.cd / max), ready: w.cd <= 0, label: "" };
      }
    }
  }

  // js/save.js
  var KEY = "cursorbots.save.v1";
  function defaultSave() {
    return {
      v: 1,
      credits: 60,
      xp: 0,
      league: 0,
      match: 0,
      proWins: 0,
      inv: { dart: { lvl: 1, copies: 0 }, rubber: { lvl: 1, copies: 0 }, bar: { lvl: 1, copies: 0 }, steel: { lvl: 1, copies: 0 } },
      build: JSON.parse(JSON.stringify(STARTER_BUILD)),
      shop: null,
      nextEnemy: null,
      tut: { match: false, shop: false, garage: false },
      settings: { sound: true, haptics: true, music: true, sfxVol: 0.8, musicVol: 0.5, shake: true, difficulty: "normal" },
      brawl: { offers: null, streak: 0, best: 0, wins: 0, played: 0 },
      stats: { wins: 0, losses: 0, kos: 0, pits: 0, matches: 0 },
      seed: Math.floor(Math.random() * 1e9)
    };
  }
  var S = { data: null };
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        S.data = { ...defaultSave(), ...d, settings: { ...defaultSave().settings, ...d.settings || {} }, tut: { ...defaultSave().tut, ...d.tut || {} }, brawl: { ...defaultSave().brawl, ...d.brawl || {} }, stats: { ...defaultSave().stats, ...d.stats || {} } };
        sanitize();
        return S.data;
      }
    } catch (e) {
      console.warn("save load failed", e);
    }
    S.data = defaultSave();
    return S.data;
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S.data));
    } catch (e) {
    }
  }
  function reset() {
    S.data = defaultSave();
    save();
  }
  function sanitize() {
    const d = S.data;
    for (const id of Object.keys(d.inv)) if (!PART[id]) delete d.inv[id];
    if (!d.inv[d.build.frame]) d.build = JSON.parse(JSON.stringify(STARTER_BUILD));
    fitBuild(d.build);
  }
  var lvl = (id) => S.data.inv[id] ? S.data.inv[id].lvl : 1;
  var levelsMap = () => Object.fromEntries(Object.entries(S.data.inv).map(([k, v]) => [k, v.lvl]));
  function playerStats() {
    return computeStats(S.data.build, lvl);
  }
  function fitBuild(b) {
    const F = PART[b.frame];
    const fit2 = (arr, n) => {
      const a = (arr || []).slice(0, n);
      while (a.length < n) a.push(null);
      return a;
    };
    b.weapons = fit2(b.weapons, F.slots.weapon);
    b.armor = fit2(b.armor, F.slots.armor);
    b.util = fit2(b.util, F.slots.util);
    if (!F.slots.shield) b.shield = null;
    return b;
  }
  function equip(cat, slot, id) {
    const b = S.data.build;
    if (cat === "frame") {
      b.frame = id;
      fitBuild(b);
    } else if (cat === "wheel") b.wheel = id;
    else if (cat === "shield") b.shield = id;
    else {
      const key = cat === "weapon" ? "weapons" : cat;
      const arr = b[key];
      if (id) {
        const other = arr.indexOf(id);
        if (other >= 0 && other !== slot) arr[other] = arr[slot];
      }
      arr[slot] = id;
    }
    save();
  }
  function upgradeInfo(id) {
    const it = S.data.inv[id];
    if (!it) return null;
    const p = PART[id];
    if (it.lvl >= MAX_LEVEL) return { max: true, lvl: it.lvl };
    const need = Math.ceil(it.lvl / 2);
    const cost = Math.round(RARITY[p.rarity].price * 0.5 * it.lvl);
    return { max: false, lvl: it.lvl, copies: it.copies, need, cost, can: it.copies >= need && S.data.credits >= cost };
  }
  function upgrade(id) {
    const u = upgradeInfo(id);
    if (!u || !u.can) return false;
    const it = S.data.inv[id];
    it.copies -= u.need;
    it.lvl++;
    S.data.credits -= u.cost;
    save();
    return true;
  }
  var DIFFICULTY = {
    easy: { name: "Easy", desc: "Slower, sloppier bots with weaker parts. Rewards x0.8.", mul: 0.55, add: -0.04, lvl: -1, reward: 0.8 },
    normal: { name: "Normal", desc: "The intended challenge. Rewards x1.", mul: 1, add: 0, lvl: 0, reward: 1 },
    hard: { name: "Hard", desc: "Sharper AI and upgraded enemy parts. Rewards x1.25.", mul: 1.12, add: 0.12, lvl: 1, reward: 1.25 },
    brutal: { name: "Brutal", desc: "Ruthless AI, heavily upgraded parts. Rewards x1.5.", mul: 1.2, add: 0.25, lvl: 2, reward: 1.5 }
  };
  var difficulty = () => DIFFICULTY[S.data.settings.difficulty] || DIFFICULTY.normal;
  function adjustEnemy(e) {
    if (e.tutorial || e.dummy) return { levels: e.levels, diff: e.diff };
    const D2 = difficulty();
    const levels = {};
    for (const [id, l] of Object.entries(e.levels || {})) levels[id] = Math.max(1, Math.min(MAX_LEVEL, l + D2.lvl));
    for (const id of [e.build.frame, e.build.wheel, ...e.build.weapons, ...e.build.armor, e.build.shield, ...e.build.util]) if (id && !levels[id]) levels[id] = Math.max(1, 1 + D2.lvl);
    return { levels, diff: Math.max(0.02, Math.min(1, (e.diff || 0) * D2.mul + D2.add)) };
  }
  function luckBonus() {
    let l = 0;
    for (const id of S.data.build.util || []) if (id && PART[id].luck) l += PART[id].luck + 0.02 * (lvl(id) - 1);
    return l;
  }
  function devGiveAll() {
    for (const p of PARTS) if (!S.data.inv[p.id]) S.data.inv[p.id] = { lvl: 1, copies: 0 };
    save();
  }
  function devCredits(n) {
    S.data.credits += n;
    save();
  }
  function devMaxAll() {
    for (const it of Object.values(S.data.inv)) {
      it.lvl = MAX_LEVEL;
      it.copies = 0;
    }
    save();
  }
  function devNextLeague() {
    S.data.tut = { match: true, shop: true, garage: true };
    if (S.data.league < LEAGUES.length) S.data.league++;
    S.data.match = 0;
    S.data.nextEnemy = null;
    S.data.brawl.offers = null;
    save();
  }
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s ^= s << 13;
      s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
  }
  var pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function rollRarity(r, weights) {
    const tot = weights.reduce((a, b) => a + b, 0);
    let x = r() * tot;
    for (let i = 0; i < 4; i++) {
      x -= weights[i];
      if (x <= 0) return RARITY_ORDER[i];
    }
    return "common";
  }
  function currentLeague() {
    const d = S.data;
    if (d.league >= LEAGUES.length) {
      const arena = PRO.arenas[d.proWins % PRO.arenas.length];
      return { ...PRO, arena, matches: 5, index: LEAGUES.length, power: 5 + d.proWins * 0.12, pro: true };
    }
    return { ...LEAGUES[d.league], index: d.league };
  }
  function isBossMatch() {
    const L = currentLeague();
    if (L.pro) return S.data.match === 4;
    return S.data.match === L.matches - 1;
  }
  function isTutorialMatch() {
    return !S.data.tut.match;
  }
  function priceOf(id) {
    return RARITY[PART[id].rarity].price;
  }
  function dealShop(forced) {
    const d = S.data, L = currentLeague();
    const r = rng(d.seed + d.stats.matches * 7919 + (d.shop ? d.shop.rerolls * 104729 : 0) + Date.now() % 1e3);
    let cards = [];
    if (forced) cards = forced.slice();
    else {
      const used = /* @__PURE__ */ new Set();
      const bias = { frame: 0.7, wheel: 0.9, weapon: 1.4, armor: 1.1, shield: 0.9, util: 0.9 };
      while (cards.length < 5) {
        const rar = rollRarity(r, L.rarity);
        const pool = PARTS.filter((p) => p.rarity === rar && !used.has(p.id));
        if (!pool.length) continue;
        const tot = pool.reduce((a, p) => a + bias[p.cat], 0);
        let x = r() * tot;
        let chosen = pool[0];
        for (const p of pool) {
          x -= bias[p.cat];
          if (x <= 0) {
            chosen = p;
            break;
          }
        }
        used.add(chosen.id);
        cards.push(chosen.id);
      }
    }
    d.shop = { cards: cards.map((id) => ({ id, sold: false })), rerolls: d.shop && !forced ? d.shop.rerolls : 0, fresh: true };
    save();
  }
  function rerollCost() {
    return 15 + (S.data.shop ? S.data.shop.rerolls : 0) * 15;
  }
  function reroll() {
    const c = rerollCost();
    if (S.data.credits < c) return false;
    S.data.credits -= c;
    S.data.shop.rerolls++;
    dealShop();
    S.data.shop.fresh = false;
    save();
    return true;
  }
  function buy(i) {
    const card = S.data.shop.cards[i];
    if (!card || card.sold) return null;
    const price = priceOf(card.id);
    if (S.data.credits < price) return null;
    S.data.credits -= price;
    card.sold = true;
    const inv = S.data.inv;
    let dup = false;
    if (inv[card.id]) {
      inv[card.id].copies++;
      dup = true;
    } else inv[card.id] = { lvl: 1, copies: 0 };
    save();
    return { dup };
  }
  function nextEnemy() {
    const d = S.data;
    if (d.nextEnemy) return d.nextEnemy;
    const L = currentLeague();
    const r = rng(d.seed + L.index * 1e3 + d.match * 31 + d.stats.matches * 17);
    let e;
    if (isTutorialMatch()) {
      e = { name: "TARGET DUMMY", title: "Training", build: JSON.parse(JSON.stringify(STARTER_BUILD)), levels: {}, diff: 0, dummy: true, team: "dummy", tutorial: true };
      e.build.weapons = [null];
    } else if (isBossMatch() && !L.pro) {
      const B = BOSSES[L.index];
      const levels = {};
      for (const id of [B.build.frame, B.build.wheel, ...B.build.weapons, ...B.build.armor, B.build.shield, ...B.build.util]) if (id) levels[id] = B.lvl;
      e = { name: B.name, title: B.title, build: JSON.parse(JSON.stringify(B.build)), levels, diff: B.diff, boss: true, team: "boss" };
    } else {
      const boss = isBossMatch();
      const p = L.power + d.match / Math.max(1, L.matches) + (boss ? 1 : 0);
      const first = L.index === 0 && d.match === 1;
      e = genBot(r, p, { boss, first, rarity: L.rarity, title: boss ? "Circuit Boss" : L.name });
    }
    fitBuild(e.build);
    d.nextEnemy = e;
    save();
    return e;
  }
  function genBot(r, p, o = {}) {
    const { boss = false, first = false } = o;
    const w = (o.rarity || [60, 30, 9, 1]).slice();
    if (boss) {
      w[2] += 15;
      w[3] += 10;
    }
    const roll = (cat, extra) => {
      for (let k = 0; k < 20; k++) {
        const rar = first ? "common" : rollRarity(r, w);
        const pool = PARTS.filter((q) => q.cat === cat && q.rarity === rar && (!extra || extra(q)));
        if (pool.length) return pick(r, pool).id;
      }
      return PARTS.find((q) => q.cat === cat && (!extra || extra(q))).id;
    };
    const build = { frame: first ? "dart" : roll("frame"), wheel: roll("wheel"), weapons: [], armor: [], shield: null, util: [] };
    const F = PART[build.frame];
    for (let i = 0; i < F.slots.weapon; i++) if (i === 0 || r() < 0.45 + 0.1 * p) build.weapons.push(roll("weapon", (q) => !build.weapons.includes(q.id)));
    if (first) {
      build.wheel = "rubber";
      build.weapons = ["flipper"];
      build.armor = ["bumpers"];
    }
    for (let i = 0; i < F.slots.armor; i++) if (i === 0 || r() < 0.5 + 0.1 * p) build.armor.push(roll("armor", (q) => !build.armor.includes(q.id)));
    if (F.slots.shield && r() < 0.25 + 0.15 * p) build.shield = roll("shield");
    for (let i = 0; i < F.slots.util; i++) if (r() < 0.2 + 0.15 * p) build.util.push(roll("util", (q) => !build.util.includes(q.id) && !q.luck));
    const st = () => computeStats(build);
    while (st().over > 0.12 && (build.util.length || build.armor.length > 1 || build.weapons.length > 1)) {
      if (build.util.length) build.util.pop();
      else if (build.armor.length > 1) build.armor.pop();
      else build.weapons.pop();
    }
    const levels = {};
    const maxL = Math.max(1, Math.min(MAX_LEVEL, 1 + Math.floor(p * 0.8)));
    for (const id of [build.frame, build.wheel, ...build.weapons, ...build.armor, build.shield, ...build.util]) if (id) levels[id] = Math.max(1, Math.min(maxL, 1 + Math.floor(r() * (maxL + 0.5))));
    const diff = Math.min(0.95, (first ? 0.08 : 0.16 + p * 0.15) + (boss ? 0.1 : 0));
    const e = { name: boss ? pick(r, BOT_NAMES).toUpperCase() : pick(r, BOT_NAMES), title: o.title || "", build, levels, diff, boss, team: boss ? "boss" : "enemy" };
    fitBuild(e.build);
    return e;
  }
  var BRAWL_TIERS = [
    { key: "easy", name: "Warm-up", dp: -0.7, mult: 0.55, drop: 0.12, color: "#5be38a" },
    { key: "even", name: "Even Match", dp: 0, mult: 1, drop: 0.22, color: "#3ff0ff" },
    { key: "tough", name: "Tough", dp: 0.9, mult: 1.75, drop: 0.4, color: "#ff4d7a" }
  ];
  function unlockedArenas() {
    const ids = ["yard"];
    for (let i = 0; i <= Math.min(S.data.league, LEAGUES.length - 1); i++) if (!ids.includes(LEAGUES[i].arena)) ids.push(LEAGUES[i].arena);
    if (S.data.league >= LEAGUES.length) {
      for (const a of PRO.arenas) if (!ids.includes(a)) ids.push(a);
    }
    return ids.filter((a) => ARENAS[a]);
  }
  function brawlOffers() {
    const d = S.data;
    if (d.brawl.offers) return d.brawl.offers;
    const L = currentLeague();
    const r = rng(d.seed ^ d.brawl.played * 2654435761 ^ Date.now() & 65535);
    const arenas = unlockedArenas();
    const baseP = L.power + (L.pro ? 0 : d.match / Math.max(1, L.matches)) + 0.2;
    d.brawl.offers = BRAWL_TIERS.map((t) => {
      const p = Math.max(0, baseP + t.dp);
      const e = genBot(r, p, { rarity: L.rarity, title: `${t.name} brawl`, first: L.index === 0 && t.key === "easy" && p < 0.3 });
      if (t.key === "tough") {
        e.team = "boss";
        e.diff = Math.min(0.95, e.diff + 0.06);
      }
      return { tier: t.key, enemy: e, arena: pick(r, arenas), reward: Math.round(L.reward * 0.6 * t.mult / 5) * 5 };
    });
    save();
    return d.brawl.offers;
  }
  function rerollBrawl() {
    S.data.brawl.offers = null;
    S.data.brawl.played++;
    return brawlOffers();
  }
  function dropPart(rarityWeights, r) {
    const rar = rollRarity(r, rarityWeights);
    const pool = PARTS.filter((p2) => p2.rarity === rar);
    const p = pick(r, pool);
    const inv = S.data.inv;
    if (inv[p.id]) inv[p.id].copies++;
    else inv[p.id] = { lvl: 1, copies: 0 };
    return p.id;
  }
  function applyBrawl(res, offer) {
    const d = S.data, L = currentLeague(), Dm = difficulty();
    const T = BRAWL_TIERS.find((t) => t.key === offer.tier) || BRAWL_TIERS[1];
    const out = { credits: 0, xp: 0, lines: [], leagueUp: null, levelUp: null, drop: null, brawl: true };
    const before = pilotLevel();
    d.stats.matches++;
    d.brawl.played++;
    if (res.win) {
      d.stats.wins++;
      d.brawl.wins++;
      if (res.how === "ko") d.stats.kos++;
      if (res.how === "pit") d.stats.pits++;
      d.brawl.streak++;
      d.brawl.best = Math.max(d.brawl.best, d.brawl.streak);
      out.lines.push([`${T.name} win`, offer.reward]);
      out.credits += offer.reward;
      if (res.how === "ko" || res.how === "pit") {
        const b = Math.round(offer.reward * 0.25);
        out.lines.push([res.how === "pit" ? "Pit bonus" : "Knockout bonus", b]);
        out.credits += b;
      }
      if (d.brawl.streak > 1) {
        const b = Math.round(offer.reward * Math.min(0.5, 0.1 * (d.brawl.streak - 1)));
        out.lines.push([`Win streak x${d.brawl.streak}`, b]);
        out.credits += b;
      }
      const r = rng(d.seed + d.stats.matches * 131);
      if (r() < T.drop) {
        out.drop = dropPart(L.rarity, r);
      }
      out.xp = 20 + L.index * 6 + (T.key === "tough" ? 15 : 0);
    } else {
      d.stats.losses++;
      d.brawl.streak = 0;
      const c = Math.round(offer.reward * 0.25);
      out.lines.push(["Appearance fee", c]);
      out.credits += c;
      out.xp = 8;
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
    if (Dm.reward !== 1 && base) {
      const b = Math.round(base * (Dm.reward - 1));
      out.lines.push([`${Dm.name} difficulty`, b]);
      out.credits += b;
    }
    const lk = luckBonus();
    if (lk > 0 && base) {
      const b = Math.round(base * lk);
      out.lines.push(["Lucky Bolt", b]);
      out.credits += b;
    }
    d.credits += out.credits;
    d.xp += out.xp;
    const after = pilotLevel();
    if (after > before) {
      const b = 40 * after;
      d.credits += b;
      out.levelUp = { level: after, bonus: b };
    }
  }
  var pilotLevel = (xp = S.data.xp) => Math.floor(Math.sqrt(xp / 60)) + 1;
  function applyResult(res, mode, offer) {
    if (mode === "brawl") return applyBrawl(res, offer);
    const d = S.data, L = currentLeague();
    const boss = isBossMatch();
    const out = { credits: 0, xp: 0, lines: [], leagueUp: null, levelUp: null };
    const before = pilotLevel();
    d.stats.matches++;
    if (res.tutorial) {
      d.tut.match = true;
      out.credits = 130;
      out.xp = 30;
      out.lines.push(["Tutorial complete", 130]);
      d.match = 1;
    } else if (res.win) {
      d.stats.wins++;
      if (res.how === "ko") d.stats.kos++;
      if (res.how === "pit") d.stats.pits++;
      const base = L.reward + d.match * 6;
      out.lines.push(["Victory", base]);
      out.credits += base;
      if (res.how === "ko" || res.how === "pit") {
        const b = Math.round(L.reward * 0.25);
        out.lines.push([res.how === "pit" ? "Pit bonus" : "Knockout bonus", b]);
        out.credits += b;
      }
      if (res.hpLeft > 0.7) {
        const b = Math.round(L.reward * 0.15);
        out.lines.push(["Flawless-ish", b]);
        out.credits += b;
      }
      if (boss) {
        const b = L.reward * 2;
        out.lines.push(["Champion purse", b]);
        out.credits += b;
      }
      out.xp = 40 + L.index * 10 + (boss ? 60 : 0);
      d.match++;
      if (L.pro) {
        d.proWins++;
        if (d.match >= 5) d.match = 0;
      } else if (d.match >= L.matches) {
        d.league++;
        d.match = 0;
        out.leagueUp = d.league < LEAGUES.length ? LEAGUES[d.league].name : PRO.name;
      }
    } else {
      d.stats.losses++;
      const c = Math.round(L.reward * 0.35);
      out.lines.push(["Repair stipend", c]);
      out.credits += c;
      out.xp = 15;
    }
    if (res.tutorial) {
      d.credits += out.credits;
      d.xp += out.xp;
    } else finishRewards(out, before, difficulty());
    d.nextEnemy = null;
    d.brawl.offers = null;
    if (res.tutorial) dealShop(["brick", "knobby", "hammer", "bumpers", "nitro"]);
    else dealShop();
    save();
    return out;
  }

  // js/audio.js
  var ac = null;
  var master = null;
  var sfxBus = null;
  var musicBus = null;
  var noiseBuf = null;
  var hum = null;
  var Sfx = { enabled: true, vol: 0.8, music: true, musicVol: 0.5 };
  var last = {};
  function initAudio() {
    if (ac) {
      if (ac.state === "suspended") ac.resume();
      return;
    }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      const out = ac.createGain();
      out.gain.value = 0.9;
      out.connect(ac.destination);
      sfxBus = ac.createGain();
      sfxBus.connect(out);
      musicBus = ac.createGain();
      musicBus.connect(out);
      master = sfxBus;
      applyVolumes();
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 1, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) {
      ac = null;
    }
  }
  function applyVolumes() {
    if (!ac) return;
    const t = ac.currentTime;
    sfxBus.gain.setTargetAtTime(Sfx.enabled ? 0.55 * Sfx.vol : 0, t, 0.05);
    musicBus.gain.setTargetAtTime(Sfx.music ? 0.32 * Sfx.musicVol : 0, t, 0.3);
  }
  function env(g, t, a, peak, dcy) {
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(1e-4, t + a + dcy);
  }
  function tone(type, f0, f1, dur, vol, delay = 0) {
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, 5e-3, vol, dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function noise(dur, vol, freq = 1200, q = 1, type = "bandpass", delay = 0, f1) {
    const t = ac.currentTime + delay;
    const s = ac.createBufferSource();
    s.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    f.Q.value = q;
    const g = ac.createGain();
    env(g, t, 3e-3, vol, dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  }
  function play(name, o = {}) {
    if (!Sfx.enabled || !ac) return;
    const now = performance.now();
    const gap = { tick: 40, flame: 90, saw: 60, shoot: 45, clank: 50, hit: 40, spinhit: 50 }[name] || 0;
    if (gap && last[name] && now - last[name] < gap) return;
    last[name] = now;
    const v = (o.vol ?? 1) * (o.near === false ? 0.45 : 1);
    switch (name) {
      case "hit":
        noise(0.12, 0.5 * v, 2400, 1.5);
        tone("square", 220, 80, 0.08, 0.12 * v);
        break;
      case "spinhit":
        noise(0.18, 0.7 * v, 3200, 2);
        tone("sawtooth", 600, 90, 0.15, 0.18 * v);
        break;
      case "slam":
        noise(0.25, 0.8 * v, 400, 0.8, "lowpass");
        tone("sine", 120, 40, 0.25, 0.5 * v);
        break;
      case "clank":
        noise(0.08, 0.35 * v, 1800, 6);
        tone("triangle", 520 + Math.random() * 200, 300, 0.07, 0.08 * v);
        break;
      case "flip":
        noise(0.12, 0.4 * v, 900, 1);
        tone("square", 160, 520, 0.12, 0.12 * v);
        break;
      case "whoosh":
        noise(0.18, 0.2 * v, 500, 0.7, "bandpass", 0, 2500);
        break;
      case "saw":
        noise(0.08, 0.25 * v, 5200, 4);
        break;
      case "flame":
        noise(0.14, 0.22 * v, 700, 0.5, "lowpass");
        break;
      case "overheat":
        tone("square", 900, 300, 0.3, 0.1 * v);
        noise(0.4, 0.2 * v, 3e3, 1, "highpass");
        break;
      case "shoot":
        tone("square", 900, 400, 0.04, 0.06 * v);
        noise(0.03, 0.15 * v, 4e3, 1);
        break;
      case "tick":
        tone("triangle", 1400, 900, 0.03, 0.05 * v);
        break;
      case "rocket":
        noise(0.4, 0.3 * v, 600, 0.6, "bandpass", 0, 2e3);
        break;
      case "boom":
        noise(0.6, 0.9 * v, 300, 0.7, "lowpass", 0, 60);
        tone("sine", 90, 30, 0.5, 0.5 * v);
        break;
      case "zap":
        tone("sawtooth", 1800, 200, 0.2, 0.12 * v);
        tone("square", 60, 120, 0.2, 0.08 * v);
        break;
      case "charge":
        tone("sine", 300, 1600, 0.42, 0.12 * v);
        break;
      case "rail":
        tone("sawtooth", 2400, 80, 0.3, 0.2 * v);
        noise(0.3, 0.5 * v, 2e3, 0.5);
        break;
      case "boost":
        noise(0.35, 0.3 * v, 300, 0.5, "bandpass", 0, 3e3);
        tone("sawtooth", 120, 260, 0.3, 0.06 * v);
        break;
      case "spike":
        noise(0.1, 0.4 * v, 3500, 3);
        break;
      case "fall":
        tone("sine", 600, 60, 0.9, 0.3);
        break;
      case "alarm":
        for (let i = 0; i < 3; i++) tone("square", 880, 660, 0.18, 0.1, i * 0.25);
        break;
      case "ko":
        noise(0.9, 1, 500, 0.6, "lowpass", 0, 50);
        tone("sine", 140, 30, 0.9, 0.6);
        break;
      case "beacon":
        tone("sine", 880, 1320, 0.15, 0.15);
        break;
      case "count":
        tone("square", 440, 0, 0.12, 0.12);
        break;
      case "go":
        tone("square", 880, 0, 0.3, 0.15);
        tone("square", 1320, 0, 0.3, 0.1);
        break;
      case "win":
        [523, 659, 784, 1046].forEach((f, i) => tone("square", f, 0, 0.18, 0.1, i * 0.11));
        break;
      case "lose":
        [392, 330, 262].forEach((f, i) => tone("triangle", f, 0, 0.28, 0.14, i * 0.18));
        break;
      case "ui":
        tone("sine", 1200, 900, 0.05, 0.08);
        break;
      case "deal":
        noise(0.06, 0.25, 3e3, 2);
        tone("triangle", 700 + Math.random() * 200, 0, 0.05, 0.05);
        break;
      case "buy":
        tone("square", 988, 0, 0.08, 0.1);
        tone("square", 1318, 0, 0.16, 0.1, 0.08);
        break;
      case "upgrade":
        [523, 784, 1046, 1568].forEach((f, i) => tone("triangle", f, 0, 0.15, 0.12, i * 0.07));
        break;
      case "error":
        tone("square", 180, 120, 0.15, 0.1);
        break;
    }
  }
  function setHum(level) {
    if (!ac || !Sfx.enabled) {
      if (hum) {
        hum.g.gain.value = 0;
      }
      return;
    }
    if (!hum) {
      const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o.type = "sawtooth";
      f.type = "lowpass";
      f.frequency.value = 900;
      g.gain.value = 0;
      o.connect(f);
      f.connect(g);
      g.connect(master);
      o.start();
      hum = { o, g, f };
    }
    const t = ac.currentTime;
    hum.o.frequency.setTargetAtTime(40 + level * 260, t, 0.05);
    hum.f.frequency.setTargetAtTime(400 + level * 2400, t, 0.05);
    hum.g.gain.setTargetAtTime(level > 0.02 ? 0.04 + level * 0.07 : 0, t, 0.06);
  }
  function vibrate(ms) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {
    }
  }
  var CHORDS = [
    // semitones from A2 (110 Hz)
    [0, 7, 12, 15, 19],
    // Am9-ish
    [-4, 3, 8, 12, 15],
    // Fmaj7
    [3, 10, 15, 19, 22],
    // Cmaj7
    [-2, 5, 10, 14, 17]
    // G6
  ];
  var hz = (st) => 110 * Math.pow(2, st / 12);
  var Music = { mode: null, timer: null, step: 0, next: 0, verb: null };
  function musicVerb() {
    if (Music.verb) return Music.verb;
    const len = ac.sampleRate * 2.6;
    const ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    }
    const cv2 = ac.createConvolver();
    cv2.buffer = ir;
    const wet = ac.createGain();
    wet.gain.value = 0.55;
    cv2.connect(wet);
    wet.connect(musicBus);
    Music.verb = cv2;
    return cv2;
  }
  function mNote(type, f, t, dur, vol, cutoff = 1800, verb = true) {
    const o = ac.createOscillator(), g = ac.createGain(), fl = ac.createBiquadFilter();
    o.type = type;
    o.frequency.value = f;
    fl.type = "lowpass";
    fl.frequency.value = cutoff;
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.6, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(fl);
    fl.connect(g);
    g.connect(musicBus);
    if (verb) g.connect(musicVerb());
    o.start(t);
    o.stop(t + dur + 0.1);
  }
  function mHat(t, vol) {
    const s = ac.createBufferSource();
    s.buffer = noiseBuf;
    const f = ac.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7e3;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.05);
    s.connect(f);
    f.connect(g);
    g.connect(musicBus);
    s.start(t, Math.random() * 0.5);
    s.stop(t + 0.08);
  }
  function schedule() {
    if (!ac || !Music.mode) return;
    const battle = Music.mode === "battle";
    const beat = battle ? 0.25 : 0.42;
    while (Music.next < ac.currentTime + 0.4) {
      const t = Music.next, st = Music.step;
      const chord = CHORDS[Math.floor(st / 16) % CHORDS.length];
      if (st % 16 === 0) for (const n of chord.slice(0, 4)) {
        mNote("sine", hz(n), t, beat * 17, 0.05);
        mNote("triangle", hz(n) * 1.003, t, beat * 17, 0.025, 900);
      }
      const arp = [0, 2, 1, 3, 4, 2, 3, 1];
      if (battle || st % 2 === 0) mNote("triangle", hz(chord[arp[st % 8]] + 12), t, beat * 2.2, battle ? 0.035 : 0.045, 2600);
      if (battle) {
        if (st % 2 === 0) mNote("sawtooth", hz(chord[0] - 12), t, beat * 0.9, 0.05, 420, false);
        if (st % 2 === 1) mHat(t, 0.025);
        if (st % 8 === 4) mHat(t, 0.045);
      }
      Music.step++;
      Music.next += beat;
    }
  }
  function setMusic(mode) {
    if (!ac) return;
    if (mode === Music.mode) return;
    Music.mode = mode;
    clearInterval(Music.timer);
    Music.timer = null;
    if (!mode) return;
    Music.next = Math.max(Music.next, ac.currentTime + 0.1);
    Music.step = Math.floor(Music.step / 16) * 16;
    Music.timer = setInterval(schedule, 120);
    schedule();
  }

  // js/ui.js
  var $ = (s, r = document) => r.querySelector(s);
  var $$ = (s, r = document) => [...r.querySelectorAll(s)];
  var esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var D = () => S.data;
  var coin = '<i class="coin"></i>';
  var UI = {
    screen: null,
    match: null,
    previews: [],
    input: { x: 0, y: 0, mag: 0, fire: [false, false, false], boost: false },
    keys: /* @__PURE__ */ new Set(),
    touchStick: false,
    installPrompt: null,
    version: "",
    paused: false,
    fight: null,
    attract: null,
    audioOn: false
  };
  var ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
    brawl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 4l11 11M15 15l2.5-1M15 15l-1 2.5M20 4L9 15M9 15l-2.5-1M9 15l1 2.5M5 19l2.5-2.5M19 19l-2.5-2.5"/></svg>',
    garage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="6" width="10" height="14" rx="2" transform="rotate(-10 8 13)"/><rect x="10" y="4" width="10" height="14" rx="2" transform="rotate(8 15 11)" fill="rgba(0,0,0,.35)"/></svg>'
  };
  function applyAudioSettings() {
    const s = D().settings;
    Sfx.enabled = s.sound;
    Sfx.vol = s.sfxVol ?? 0.8;
    Sfx.music = s.music;
    Sfx.musicVol = s.musicVol ?? 0.5;
    applyVolumes();
  }
  function syncMusic() {
    if (UI.audioOn) setMusic(UI.screen === "hud" ? "battle" : "menu");
  }
  function show(name) {
    for (const s of $$(".screen")) s.classList.toggle("active", s.id === "scr-" + name);
    UI.screen = name;
    UI.previews = UI.previews.filter((p) => document.body.contains(p.canvas) && p.canvas.closest(".screen.active, .sheet, .modal"));
    document.body.classList.toggle("in-match", name === "hud");
    if (name === "title") startAttract();
    else stopAttract();
    hideCoach();
    syncMusic();
  }
  var toastT = 0;
  function toast(msg, ms = 2200) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), ms);
  }
  function modal(html, onBind) {
    const m = $("#modal");
    m.innerHTML = `<div class="inner">${html}</div>`;
    m.classList.remove("hidden");
    m.onclick = (e) => {
      if (e.target === m) closeModal();
    };
    if (onBind) onBind(m);
    drawIcons(m);
    registerPreviews(m);
  }
  function closeModal() {
    $("#modal").classList.add("hidden");
    $("#modal").innerHTML = "";
  }
  function sheet(html, onBind) {
    const s = $("#sheet");
    s.innerHTML = `<div class="inner">${html}</div>`;
    s.classList.remove("hidden");
    s.onclick = (e) => {
      if (e.target === s) closeSheet();
    };
    if (onBind) onBind(s);
    drawIcons(s);
  }
  function closeSheet() {
    $("#sheet").classList.add("hidden");
    $("#sheet").innerHTML = "";
  }
  var coachCb = null;
  function coach(html, target, cb) {
    const c = $("#coach");
    c.innerHTML = `<div>${html}</div><div class="row"><button class="btn primary small" data-ok>Got it</button></div>`;
    c.classList.remove("hidden");
    $$(".pulse-hl").forEach((e) => e.classList.remove("pulse-hl"));
    if (target) {
      const t = typeof target === "string" ? $(target) : target;
      if (t) t.classList.add("pulse-hl");
    }
    coachCb = cb;
    $("[data-ok]", c).onclick = () => {
      click();
      hideCoach();
    };
  }
  function hideCoach() {
    $("#coach").classList.add("hidden");
    $$(".pulse-hl").forEach((e) => e.classList.remove("pulse-hl"));
    if (coachCb) {
      const f = coachCb;
      coachCb = null;
      f();
    }
  }
  function click() {
    play("ui");
  }
  function bind(root, handlers) {
    for (const el of $$("[data-act]", root)) {
      el.addEventListener("click", (e) => {
        const act = el.dataset.act;
        const fn = handlers[act];
        if (fn) {
          initAudio();
          click();
          fn(el.dataset.arg, el, e);
        }
      });
    }
  }
  function fit(c) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth || +c.getAttribute("width") || 100, h = c.clientHeight || +c.getAttribute("height") || 100;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    const g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g, w, h };
  }
  function drawIcons(root) {
    for (const c of $$("canvas[data-icon]", root)) {
      const p = PART[c.dataset.icon];
      if (!p) continue;
      const { g, w, h } = fit(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h);
      g.save();
      g.translate((w - s) / 2, (h - s) / 2);
      drawPartIcon(g, p, s, c.dataset.team || "player");
      g.restore();
    }
  }
  function registerPreviews(root) {
    for (const c of $$("canvas[data-preview]", root)) {
      UI.previews.push({ canvas: c, kind: c.dataset.preview, spin: c.dataset.spin !== "0", mirror: c.dataset.mirror === "1" });
    }
  }
  function botView(build, team, cx, cy, r, a, t, extra = {}) {
    const ws = (build.weapons || []).map((id) => {
      if (!id) return null;
      const d = PART[id];
      const rpm = d.kind === "spin" ? 0.75 : 0;
      return { rpm, spin: t * (d.kind === "spin" ? 22 : d.kind === "saw" ? 18 : 0), swing: 0, wind: 0, active: d.kind === "saw", cd: 0 };
    });
    const st = computeStats(build);
    return { build, x: cx, y: cy, r, a, team, ws, shieldFrac: st.shieldCap ? 0.8 : 0, phase: t * 3, ...extra };
  }
  function drawPreview(p, t) {
    const { g, w, h } = fit(p.canvas);
    g.clearRect(0, 0, w, h);
    let build, team = "player";
    if (p.kind === "player") build = D().build;
    else if (p.kind === "enemy") {
      const e = UI.fight ? UI.fight.enemy : nextEnemy();
      build = e.build;
      team = e.team || "enemy";
    } else if (p.kind.startsWith("offer:")) {
      const o = (D().brawl.offers || [])[+p.kind.slice(6)];
      if (!o) return;
      build = o.enemy.build;
      team = o.enemy.team || "enemy";
    } else return;
    const F = PART[build.frame];
    const r = Math.min(w, h) * 0.21 * (0.85 + 0.15 * F.size);
    const gr = g.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.min(w, h) * 0.5);
    gr.addColorStop(0, team === "player" ? "rgba(63,240,255,0.16)" : team === "boss" ? "rgba(255,178,63,0.18)" : "rgba(255,77,122,0.16)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    const a = p.spin ? -Math.PI / 2 + Math.sin(t * 0.6) * 0.9 + t * 0.25 : p.mirror ? Math.PI : 0;
    drawBot(g, botView(build, team, w / 2, h / 2, r, a, t));
  }
  function menuFrame(t) {
    if (UI.attract && UI.screen === "title") {
      const a = UI.attract;
      const dt = a.t == null ? 1 / 60 : Math.min(0.05, Math.max(0, t - a.t));
      a.t = t;
      a.m.update(dt);
      if (a.m.state === "over") {
        a.endT += dt;
        if (a.endT > 2.2) {
          UI.attract = null;
          startAttract();
          return;
        }
      }
      const c = $("#cv"), g = c.getContext("2d"), dpr = UI.dpr || 1;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      a.m.draw(g, window.innerWidth, window.innerHeight);
    }
    for (const p of UI.previews) if (p.canvas.isConnected && p.canvas.offsetParent !== null) drawPreview(p, t);
  }
  function startAttract() {
    document.body.classList.add("attract");
    if (UI.attract) return;
    try {
      const d = D();
      const L = currentLeague();
      const r = rng((Date.now() & 16777215) + 11);
      const arenas = unlockedArenas().filter((a) => ARENAS[a]);
      const arena = arenas[Math.floor(r() * arenas.length)] || "yard";
      const p = Math.max(0.6, L.power + 0.6);
      const foe = genBot(r, p, { rarity: L.rarity });
      const mine = d.tut.match ? { build: JSON.parse(JSON.stringify(d.build)), levels: levelsMap() } : (() => {
        const b = genBot(r, p, { rarity: L.rarity });
        return { build: b.build, levels: b.levels };
      })();
      if (!mine.build.weapons.some(Boolean)) {
        const b = genBot(r, p, { rarity: L.rarity });
        mine.build = b.build;
        mine.levels = b.levels;
      }
      const m = new Match({
        arena,
        duration: 50,
        shake: 0.2,
        player: { ...mine, ai: 0.72 },
        enemy: { build: foe.build, levels: foe.levels, diff: 0.68, name: foe.name, team: foe.team },
        onEvent: () => {
        }
      });
      m.start();
      UI.attract = { m, t: null, endT: 0 };
    } catch (e) {
      console.warn("attract failed", e);
      UI.attract = null;
    }
  }
  function stopAttract() {
    document.body.classList.remove("attract");
    if (!UI.attract) return;
    UI.attract = null;
    if (!UI.match) {
      const g = $("#cv").getContext("2d");
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, 99999, 99999);
    }
  }
  function renderTitle() {
    const el = $("#scr-title");
    const d = D();
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const canInstall = !standalone && (UI.installPrompt || ios);
    const started = d.tut.match;
    const L = currentLeague();
    const prog = started ? `${L.name} \xB7 ${L.pro ? `Pro wins ${d.proWins}` : `Match ${Math.min(d.match + 1, L.matches)} of ${L.matches}`}` : "Learn to drive and fight in about a minute";
    const brawlSub = !started ? "Unlocks after training" : d.brawl.streak > 1 ? `Win streak x${d.brawl.streak}, keep it going!` : "Random fights for credits and part drops";
    el.innerHTML = `
    <div class="title-wrap">
      <div class="title-hero">
        <div class="logo">Cursor<span>Bots</span></div>
        <div class="tagline">Build. Upgrade. Destroy.</div>
      </div>
      ${started ? `<div class="title-stats">
        <div><b>${pilotLevel()}</b><span>Pilot Lv</span></div>
        <div><b>${coin}${d.credits}</b><span>Credits</span></div>
        <div><b>${Object.keys(d.inv).length}<small>/${PARTS.length}</small></b><span>Parts</span></div>
        <div><b>${d.stats.wins}</b><span>Wins</span></div>
      </div>` : ""}
      <div class="menu">
        <button class="mbtn primary" data-act="play"><span class="mi">${ICON.play}</span><span class="mt"><b>${started ? "Continue Series" : "Start Training"}</b><small>${esc(prog)}</small></span></button>
        <button class="mbtn" data-act="brawl" ${started ? "" : "disabled"}><span class="mi">${ICON.brawl}</span><span class="mt"><b>Quick Brawl</b><small>${esc(brawlSub)}</small></span></button>
        <div class="grid2">
          <button class="mbtn sm" data-act="garage" ${started ? "" : "disabled"}><span class="mi">${ICON.garage}</span><b>Garage</b></button>
          <button class="mbtn sm" data-act="shop" ${started ? "" : "disabled"}><span class="mi">${ICON.shop}</span><b>Workshop</b>${d.shop && d.shop.fresh ? '<span class="badge">NEW</span>' : ""}</button>
        </div>
        <div class="menu-foot">
          <button class="btn ghost small" data-act="settings">Settings</button>
          ${canInstall ? '<button class="btn ghost small" data-act="install">Install app</button>' : ""}
          <button class="btn ghost small" data-act="credits">Credits</button>
        </div>
      </div>
    </div>
    <div class="ver">v${esc(UI.version || "")} \xB7 ${esc(difficulty().name)} AI</div>`;
    bind(el, {
      play: () => renderHub(),
      brawl: () => renderBrawl(),
      garage: () => renderGarage(),
      shop: () => renderShop(),
      install: () => doInstall(),
      settings: () => openSettings(),
      credits: () => openCredits()
    });
    show("title");
    registerPreviews(el);
  }
  function setInstallPrompt(p) {
    UI.installPrompt = p;
    if (UI.screen === "title") renderTitle();
  }
  async function doInstall() {
    if (UI.installPrompt) {
      UI.installPrompt.prompt();
      try {
        await UI.installPrompt.userChoice;
      } catch (e) {
      }
      UI.installPrompt = null;
      renderTitle();
    } else {
      modal(`<h3>Install on iPhone / iPad</h3><p>Tap the <b>Share</b> button in Safari, then choose <b>Add to Home Screen</b>. Cursor Bots will launch full-screen and update itself automatically.</p><div class="acts"><button class="btn primary" data-act="x">OK</button></div>`, (m) => bind(m, { x: closeModal }));
    }
  }
  function topbar(title, back) {
    return `<div class="topbar">
    ${back ? `<button class="icon-btn" data-act="${back}" aria-label="Back">&#8249;</button>` : ""}
    <div class="title">${title}</div><div class="spacer"></div>
    <div class="pill">${coin}<span data-credits>${D().credits}</span></div>
    <button class="icon-btn" data-act="settings" aria-label="Settings">&#9881;</button>
  </div>`;
  }
  function refreshCredits() {
    for (const e of $$("[data-credits]")) e.textContent = D().credits;
  }
  function renderHub() {
    const d = D();
    const L = currentLeague();
    const st = playerStats();
    const pp = powerRating(st);
    const tutorial = isTutorialMatch();
    const enemy = nextEnemy();
    const boss = isBossMatch();
    const adj = adjustEnemy(enemy);
    const ep = powerRating(computeStats(enemy.build, (id) => adj.levels[id] || 1));
    const rel = ep / Math.max(1, pp);
    const relTxt = tutorial ? "Practice target" : rel > 1.15 ? '<span style="color:var(--hot)">Stronger than you</span>' : rel < 0.88 ? '<span style="color:var(--ok)">Weaker than you</span>' : "Evenly matched";
    const nodes = [];
    for (let i = 0; i < L.matches; i++) {
      const isBoss = L.pro ? i === 4 : i === L.matches - 1;
      const cls = i < d.match ? "done" : i === d.match ? "cur" : "";
      const label = L.index === 0 && i === 0 ? "T" : isBoss ? "BOSS" : String(i + (L.index === 0 ? 0 : 1));
      nodes.push(`<div class="node ${cls} ${isBoss ? "boss" : ""}">${i < d.match ? "&#10003;" : label}</div>`);
    }
    const all = [...LEAGUES, PRO];
    const road = all.map((lg, i) => {
      const cls = i < d.league ? "done" : i === Math.min(d.league, LEAGUES.length) ? "cur" : "locked";
      return `<i class="${cls}" style="--lc:${lg.color}" title="${esc(lg.name)}"></i>`;
    }).join("");
    const lv = pilotLevel();
    const curXp = 60 * (lv - 1) ** 2, nextXp = 60 * lv ** 2;
    const xpPct = Math.round((d.xp - curXp) / (nextXp - curXp) * 100);
    const ups = Object.keys(d.inv).filter((id) => {
      const u = upgradeInfo(id);
      return u && u.can;
    }).length;
    const left = d.shop ? d.shop.cards.filter((c) => !c.sold).length : 5;
    const shopFresh = d.shop && d.shop.fresh;
    const haz = hazardList(ARENAS[tutorial ? "tutorial" : L.arena]);
    const el = $("#scr-hub");
    el.innerHTML = `<div class="wrap">
    ${topbar("Hub", "title")}
    <div class="hub2">
      <section class="panel series" style="--lc:${L.color}">
        <div class="glowbar"></div>
        <div class="shead2">
          <div><h2>${L.pro ? "Endless series" : `Series ${L.index + 1} of ${LEAGUES.length}`}</h2><div class="lname">${esc(L.name)}</div>
            <div class="small muted">${esc(ARENAS[L.arena].name)}${haz.length ? " \xB7 " + esc(haz.join(", ")) : ""}</div></div>
        </div>
        <div class="road">${road}</div>
        <div class="track">${nodes.join("")}</div>
        <div class="nextup ${boss ? "boss" : ""}">
          <canvas data-preview="enemy" data-spin="0" data-mirror="1"></canvas>
          <div class="nx">
            <div class="tiny">${tutorial ? "Training" : boss ? "Boss fight" : "Next opponent"}</div>
            <div class="ename" style="color:${boss ? "var(--gold)" : tutorial ? "var(--gold)" : "var(--hot)"}">${esc(enemy.name)}</div>
            <div class="small muted">${tutorial ? "Learn the controls" : `Power ${ep} \xB7 ${relTxt}`}</div>
          </div>
        </div>
        <button class="btn ${boss ? "gold" : "primary"} big block" data-act="fight">${tutorial ? "Start Tutorial" : boss ? "Boss Fight" : "Series Fight"}</button>
      </section>
      <section class="panel mybot">
        <div class="row"><h2>Your bot</h2><span class="spacer"></span><span class="pill sm">Power ${pp}</span></div>
        <div class="mybot-body">
          <canvas class="botview" data-preview="player"></canvas>
          <div class="statgrid two">
            <div class="stat"><b>${st.hp}</b><span>Health</span></div>
            <div class="stat"><b>${Math.round(st.dps)}</b><span>Damage</span></div>
            <div class="stat"><b>${Math.round(st.maxSpeed)}</b><span>Speed</span></div>
            <div class="stat"><b style="color:${st.over > 0 ? "var(--hot)" : "inherit"}">${st.weight}<small>/${st.cap}</small></b><span>Weight kg</span></div>
          </div>
        </div>
        <div class="row small" style="margin-top:10px"><b>Pilot Lv ${lv}</b><span class="spacer"></span><span class="muted">${d.stats.wins}W ${d.stats.losses}L \xB7 ${d.xp - curXp}/${nextXp - curXp} XP</span></div>
        <div class="xpbar"><i style="width:${xpPct}%"></i></div>
        <button class="btn block" style="margin-top:12px" data-act="garage" ${tutorial ? "disabled" : ""}>Garage${ups ? `<span class="badge ok">${ups} UP</span>` : ""}</button>
      </section>
      <div class="quick">
        <button class="qcard" data-act="brawl" ${tutorial ? "disabled" : ""} style="--qc:#ff4d7a"><span class="mi">${ICON.brawl}</span><span class="mt"><b>Quick Brawl</b><small>${tutorial ? "After training" : d.brawl.streak > 1 ? `Streak x${d.brawl.streak}` : "Fight for credits"}</small></span></button>
        <button class="qcard" data-act="shop" ${tutorial ? "disabled" : ""} style="--qc:#ffd23f"><span class="mi">${ICON.shop}</span><span class="mt"><b>Workshop</b><small>${tutorial ? "After training" : left ? `${left} card${left > 1 ? "s" : ""} for sale` : "Sold out \xB7 reroll"}</small></span>${shopFresh ? '<span class="badge">NEW</span>' : ""}</button>
      </div>
    </div>
  </div>`;
    bind(el, {
      title: () => renderTitle(),
      settings: () => openSettings(),
      fight: () => renderVS(),
      garage: () => renderGarage(),
      shop: () => renderShop(),
      brawl: () => renderBrawl()
    });
    show("hub");
    registerPreviews(el);
  }
  function pips(lvl2) {
    let h = '<span class="pips">';
    for (let i = 1; i <= MAX_LEVEL; i++) h += `<i class="${i <= lvl2 ? "on" : ""}"></i>`;
    return h + "</span>";
  }
  function statBars(st) {
    const bar = (lbl, v, max, txt) => `<div class="sbar"><span class="lbl">${lbl}</span><span class="track2"><i style="width:${Math.max(3, Math.min(100, v / max * 100))}%"></i></span><span class="val">${txt}</span></div>`;
    return `<div class="bars">
    ${bar("Health", st.hp, 900, st.hp)}
    ${bar("Armor", st.dr, 0.55, Math.round(st.dr * 100) + "%")}
    ${bar("Shield", st.shieldCap, 260, Math.round(st.shieldCap))}
    ${bar("Damage", st.dps, 220, Math.round(st.dps))}
    ${bar("Speed", st.maxSpeed, 420, Math.round(st.maxSpeed))}
    ${bar("Handling", st.turn, 8, st.turn.toFixed(1))}
  </div>`;
  }
  function weightMeter(st) {
    const pct = Math.min(130, st.weight / st.cap * 100);
    return `<div class="wmeter ${st.over > 0 ? "over" : pct > 90 ? "near" : ""}">
    <div class="row small"><b>Weight</b><span class="spacer"></span><span><b>${st.weight}</b> / ${st.cap} kg</span></div>
    <div class="wbar"><i style="width:${Math.min(100, pct)}%"></i>${st.over > 0 ? "" : ""}</div>
    <div class="tiny muted">${st.over > 0 ? `Overweight by ${(st.weight - st.cap).toFixed(1)} kg: slower and less nimble` : `${(st.cap - st.weight).toFixed(1)} kg spare capacity`}</div>
  </div>`;
  }
  function slotRow(cat, slot, id, label) {
    if (!id) return `<div class="slot empty" data-act="pick" data-arg="${cat}:${slot}"><span class="plus">+</span><div><div class="nm">Empty ${label}</div><div class="sub">Tap to equip</div></div></div>`;
    const p = PART[id];
    const u = upgradeInfo(id);
    const l = lvl(id);
    return `<div class="slot r-${p.rarity}" data-act="pick" data-arg="${cat}:${slot}">
    <canvas data-icon="${id}"></canvas>
    <div class="si"><div class="nm">${esc(p.name)}</div><div class="sub">${esc(partStats(p, l)[0])}</div>${pips(l)}</div>
    <span class="lv">Lv ${l}</span>${u && u.can ? '<span class="up">UP</span>' : ""}
  </div>`;
  }
  function renderGarage() {
    const d = D();
    const b = d.build;
    const F = PART[b.frame];
    const st = playerStats();
    const W = PART[b.wheel];
    const n = (arr) => arr.filter(Boolean).length;
    const group = (title, count, rows, wide) => `<div class="slotgroup ${wide ? "wide" : ""}"><h3>${title}${count ? `<span>${count}</span>` : ""}</h3><div class="slotgrid">${rows}</div></div>`;
    const groups = [];
    groups.push(group("Frame", "", slotRow("frame", 0, b.frame, "frame")));
    groups.push(group("Wheels", `x${F.slots.wheel}`, slotRow("wheel", 0, b.wheel, "wheels")));
    groups.push(group("Weapons", `${n(b.weapons)}/${F.slots.weapon}`, b.weapons.map((id, i) => slotRow("weapon", i, id, i === 0 ? "front weapon" : "side weapon")).join(""), true));
    groups.push(group("Armor", `${n(b.armor)}/${F.slots.armor}`, b.armor.map((id, i) => slotRow("armor", i, id, "armor")).join(""), true));
    if (F.slots.shield) groups.push(group("Shield", "", slotRow("shield", 0, b.shield, "shield")));
    if (F.slots.util) groups.push(group("Utility", `${n(b.util)}/${F.slots.util}`, b.util.map((id, i) => slotRow("util", i, id, "utility")).join(""), true));
    const warns = [];
    if (!b.weapons.some(Boolean)) warns.push("No weapon equipped! You can only ram.");
    const el = $("#scr-garage");
    el.innerHTML = `<div class="wrap">
    ${topbar("Garage", "back")}
    <div class="garage2">
      <section class="panel gpreview">
        <div class="gtop"><div><div class="gname">${esc(F.name)}</div><div class="small muted">${esc(W.name)} \xB7 <span class="rtag r-${F.rarity}">${RARITY[F.rarity].name} frame</span></div></div><span class="spacer"></span><div class="power"><b>${powerRating(st)}</b><span>Power</span></div></div>
        <canvas data-preview="player"></canvas>
        ${weightMeter(st)}
        ${statBars(st)}
        ${warns.map((w) => `<div class="warnbox">${w}</div>`).join("")}
      </section>
      <section class="gslots" id="slotlist">${groups.join("")}</section>
    </div>
    <div class="hub-actions"><button class="btn primary" data-act="fight">Done</button><button class="btn" data-act="shop">Workshop</button></div>
  </div>`;
    bind(el, {
      back: () => renderHub(),
      settings: () => openSettings(),
      fight: () => renderHub(),
      shop: () => renderShop(),
      pick: (arg) => {
        const [cat, slot] = arg.split(":");
        openPicker(cat, +slot);
      }
    });
    show("garage");
    drawIcons(el);
    registerPreviews(el);
    if (!d.tut.garage) {
      d.tut.garage = true;
      save();
      setTimeout(() => coach("<b>Garage:</b> tap any slot to swap parts. Bigger frames carry more wheels, weapons and armor, and every part changes how your bot looks. Watch your <b>weight</b> against the frame's capacity!", "#slotlist"), 350);
    }
  }
  function previewEquip(cat, slot, id) {
    const nb = JSON.parse(JSON.stringify(D().build));
    if (cat === "frame") {
      nb.frame = id;
      fitBuild(nb);
    } else if (cat === "wheel") nb.wheel = id;
    else if (cat === "shield") nb.shield = id;
    else {
      const key = cat === "weapon" ? "weapons" : cat;
      const arr = nb[key];
      const o = arr.indexOf(id);
      if (id && o >= 0 && o !== slot) arr[o] = arr[slot];
      arr[slot] = id;
    }
    return computeStats(nb, lvl);
  }
  function openPicker(cat, slot, keepScroll) {
    const d = D();
    const b = d.build;
    const ownedIds = Object.keys(d.inv).filter((id) => PART[id].cat === cat);
    const rOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    const current = cat === "frame" ? b.frame : cat === "wheel" ? b.wheel : cat === "shield" ? b.shield : (cat === "weapon" ? b.weapons : b[cat])[slot];
    ownedIds.sort((a, c) => (c === current) - (a === current) || rOrder[PART[c].rarity] - rOrder[PART[a].rarity] || lvl(c) - lvl(a) || PART[a].name.localeCompare(PART[c].name));
    const canEmpty = !["frame", "wheel"].includes(cat);
    const base = playerStats();
    const basePow = powerRating(base);
    const items = ownedIds.map((id) => {
      const p = PART[id];
      const u = upgradeInfo(id);
      const on = id === current;
      const elsewhere = !on && ["weapon", "armor", "util"].includes(cat) && (cat === "weapon" ? b.weapons : b[cat]).includes(id);
      let delta = "";
      if (!on) {
        const ns = previewEquip(cat, slot, id);
        const dp = powerRating(ns) - basePow, dw = Math.round((ns.weight - base.weight) * 10) / 10;
        delta = `<div class="deltas"><span class="dc ${dp > 0 ? "good" : dp < 0 ? "bad" : ""}">${dp > 0 ? "+" : ""}${dp} power</span><span class="dc ${ns.over > 0 && dw > 0 ? "bad" : ""}">${dw > 0 ? "+" : ""}${dw} kg</span>${ns.over > 0 && base.over <= 0 ? '<span class="dc bad">overweight</span>' : ""}</div>`;
      }
      const upTxt = u.max ? '<span class="maxed">MAX LEVEL</span>' : `<button class="btn small ${u.can ? "gold" : "ghost"} upbtn" data-act="up" data-arg="${id}" ${u.can ? "" : "disabled"}><span>Upgrade to Lv ${u.lvl + 1}</span><small>${u.copies}/${u.need} copies \xB7 ${coin}${u.cost}</small></button>`;
      return `<div class="pick r-${p.rarity} ${on ? "on" : ""}">
      <canvas data-icon="${id}"></canvas>
      <div class="pinfo">
        <div class="nm">${esc(p.name)}</div>
        <div class="meta"><span class="rtag">${RARITY[p.rarity].name}</span><span>Lv ${u.lvl}</span><span>${p.wt} kg</span></div>
        ${pips(u.lvl)}
        <div class="st">${partStats(p, u.lvl).map(esc).join(" \xB7 ")}</div>
        <div class="st muted">${esc(p.desc)}</div>
        ${delta}
      </div>
      <div class="pacts">
        ${on ? '<span class="eq">Equipped</span>' : `<button class="btn small primary" data-act="equip" data-arg="${id}">${elsewhere ? "Move here" : "Equip"}</button>`}
        ${upTxt}
      </div></div>`;
    }).join("");
    const prevScroll = keepScroll ? ($("#sheet .inner") || {}).scrollTop : 0;
    sheet(`<div class="sheethead"><div><h2>${CATS[cat]}</h2><div class="tiny muted">${cat === "wheel" ? "Fills every wheel slot" : cat === "frame" ? "Sets slots, health and weight capacity" : "Tap Equip to swap"} \xB7 ${ownedIds.length} owned</div></div><span class="spacer"></span><div class="pill">${coin}<span data-credits>${d.credits}</span></div><button class="icon-btn" data-act="close" aria-label="Close">&times;</button></div>
    ${canEmpty && current ? `<button class="btn small block ghost" style="margin-bottom:8px" data-act="empty">Unequip this slot</button>` : ""}
    ${items || `<p class="muted">You don't own any parts of this type yet. Buy them in the Workshop.</p>`}
    <p class="tiny muted">Buy duplicate cards in the Workshop to collect copies. Each level adds +12% stats, up to Lv ${MAX_LEVEL}; higher levels need more copies and credits.</p>`, (s) => bind(s, {
      close: closeSheet,
      equip: (id) => {
        equip(cat, slot, id);
        play("upgrade");
        closeSheet();
        renderGarage();
      },
      empty: () => {
        equip(cat, slot, null);
        closeSheet();
        renderGarage();
      },
      up: (id) => {
        if (upgrade(id)) {
          play("upgrade");
          vibrateIf(30);
          toast(`${PART[id].name} upgraded to Lv ${lvl(id)}!`);
          renderGarage();
          openPicker(cat, slot, true);
        } else play("error");
      }
    }));
    if (prevScroll) $("#sheet .inner").scrollTop = prevScroll;
  }
  function cardHtml(c, i) {
    const p = PART[c.id];
    const d = D();
    const own = d.inv[c.id];
    const price = priceOf(c.id);
    let ownTxt = '<div class="own new">&#9733; New part</div>';
    if (own) {
      const u = upgradeInfo(c.id);
      ownTxt = u.max ? '<div class="own">Owned \xB7 max level</div>' : `<div class="own">${own.copies + 1 >= u.need && !c.sold ? "&#9650; Unlocks Lv " + (own.lvl + 1) : `Owned Lv ${own.lvl}`}<span class="spacer"></span>${own.copies}/${u.need}</div><div class="prog"><i style="width:${Math.min(100, own.copies / u.need * 100)}%"></i></div>`;
    }
    return `<div class="card r-${p.rarity} ${c.sold ? "sold" : ""} ${p.rarity === "legendary" ? "legendary-glow" : ""}" style="animation-delay:${i * 0.08}s">
    <div class="ctop"><span class="rtag">${RARITY[p.rarity].name}</span><span class="spacer"></span><span class="cat">${CATS[p.cat]}</span></div>
    <canvas data-icon="${c.id}"></canvas>
    <div class="nm">${esc(p.name)}</div>
    <div class="st">${partStats(p).map(esc).join("<br>")}</div>
    ${ownTxt}
    <button class="btn small ${c.sold ? "" : d.credits >= price ? "primary" : ""}" data-act="buy" data-arg="${i}" ${!c.sold && d.credits < price ? "disabled" : ""}>${c.sold ? "Purchased" : `${coin} ${price}`}</button>
    ${c.sold ? '<div class="stamp">Sold</div>' : ""}
  </div>`;
  }
  var COLL_CATS = ["all", "frame", "wheel", "weapon", "armor", "shield", "util"];
  function collectionHtml() {
    const d = D();
    const f = UI.collFilter || "all";
    const rOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    const list = PARTS.filter((p) => f === "all" || p.cat === f).slice().sort((a, b) => COLL_CATS.indexOf(a.cat) - COLL_CATS.indexOf(b.cat) || rOrder[a.rarity] - rOrder[b.rarity]);
    const ownedN = (c) => PARTS.filter((p) => (c === "all" || p.cat === c) && d.inv[p.id]).length;
    const totalN = (c) => PARTS.filter((p) => c === "all" || p.cat === c).length;
    const chips = COLL_CATS.map((c) => `<button class="fchip ${c === f ? "on" : ""}" data-act="filter" data-arg="${c}">${c === "all" ? "All" : CATS[c]} <small>${ownedN(c)}/${totalN(c)}</small></button>`).join("");
    const tiles = list.map((p) => {
      const own = d.inv[p.id];
      return `<div class="ctile r-${p.rarity} ${own ? "" : "locked"}" data-act="part" data-arg="${p.id}">
      <canvas data-icon="${p.id}"></canvas>
      <div class="nm">${esc(p.name)}</div>
      ${own ? `<div class="tiny">Lv ${own.lvl}${own.copies ? ` \xB7 +${own.copies}` : ""}</div>` : `<div class="tiny muted">${RARITY[p.rarity].name}</div>`}
    </div>`;
    }).join("");
    const pct = Math.round(ownedN("all") / PARTS.length * 100);
    return `<div class="collhead"><div class="row small"><b>Collection</b><span class="spacer"></span><span class="muted">${ownedN("all")} of ${PARTS.length} parts \xB7 ${pct}%</span></div><div class="xpbar"><i style="width:${pct}%"></i></div></div>
    <div class="fchips">${chips}</div><div class="ctiles">${tiles}</div>`;
  }
  function openPartInfo(id) {
    const p = PART[id];
    const own = D().inv[id];
    const u = own ? upgradeInfo(id) : null;
    modal(`<div class="partinfo r-${p.rarity}">
    <canvas data-icon="${id}"></canvas>
    <div class="rtag">${RARITY[p.rarity].name} ${CATS[p.cat]}</div>
    <h3>${esc(p.name)}</h3>
    <p>${esc(p.desc)}</p>
    <div class="st">${partStats(p, own ? own.lvl : 1).map(esc).join("<br>")}<br>${p.wt} kg</div>
    ${own ? `<div class="own-line">Owned \xB7 Lv ${own.lvl}${u.max ? " (max)" : ` \xB7 ${own.copies}/${u.need} copies to Lv ${own.lvl + 1}`}</div>${pips(own.lvl)}` : `<div class="own-line muted">Not owned yet. Look for it in the Workshop deal or win it in Quick Brawl.</div>`}
  </div><div class="acts">${own ? '<button class="btn primary" data-act="garage">Open Garage</button>' : ""}<button class="btn" data-act="x">Close</button></div>`, (m) => bind(m, { x: closeModal, garage: () => {
      closeModal();
      renderGarage();
    } }));
  }
  function renderShop(animate = true) {
    const d = D();
    if (!d.shop) dealShop();
    const tab = UI.shopTab || "deal";
    const el = $("#scr-shop");
    const rc = rerollCost();
    const left = d.shop.cards.filter((c) => !c.sold).length;
    const owned = Object.keys(d.inv).length;
    el.innerHTML = `<div class="wrap">
    ${topbar("Workshop", "back")}
    <div class="tabs"><button class="tab ${tab === "deal" ? "on" : ""}" data-act="tab" data-arg="deal">Today's deal${left ? ` <small>${left}</small>` : ""}</button><button class="tab ${tab === "coll" ? "on" : ""}" data-act="tab" data-arg="coll">Collection <small>${owned}/${PARTS.length}</small></button></div>
    ${tab === "deal" ? `
    <div class="dealhead"><div><b>A fresh hand after every fight</b><div class="tiny muted">Rarer cards show up in higher leagues. Duplicates level your parts up.</div></div>
      <span class="spacer"></span><button class="btn small" data-act="reroll" ${d.credits < rc ? "disabled" : ""}>Reroll &middot; ${coin} ${rc}</button></div>
    <div class="cards" id="cards">${d.shop.cards.map(cardHtml).join("")}</div>` : `<div id="coll">${collectionHtml()}</div>`}
    <div class="hub-actions"><button class="btn primary" data-act="garage">Garage</button><button class="btn" data-act="back">Done</button></div>
  </div>`;
    if (!animate || tab !== "deal") $$(".card", el).forEach((c) => c.style.animation = "none");
    bind(el, {
      back: () => {
        d.shop.fresh = false;
        save();
        renderHub();
      },
      settings: () => openSettings(),
      garage: () => {
        d.shop.fresh = false;
        save();
        renderGarage();
      },
      tab: (t) => {
        UI.shopTab = t;
        renderShop(false);
      },
      filter: (c) => {
        UI.collFilter = c;
        const y = el.scrollTop;
        renderShop(false);
        el.scrollTop = y;
      },
      part: (id) => openPartInfo(id),
      reroll: () => {
        if (reroll()) {
          play("deal");
          renderShop();
        } else play("error");
      },
      buy: (i) => {
        const id = d.shop.cards[+i].id;
        const res = buy(+i);
        if (!res) {
          play("error");
          return;
        }
        play("buy");
        vibrateIf(20);
        const u = upgradeInfo(id);
        toast(res.dup ? u.can ? `+1 ${PART[id].name}: ready to upgrade in the Garage!` : `+1 copy of ${PART[id].name}` : `${PART[id].name} added to your Garage!`);
        const y = el.scrollTop;
        renderShop(false);
        el.scrollTop = y;
      }
    });
    show("shop");
    drawIcons(el);
    if (animate && tab === "deal") d.shop.cards.forEach((_, i) => setTimeout(() => play("deal"), i * 80));
    if (!d.tut.shop) {
      d.tut.shop = true;
      save();
      UI.shopTab = "deal";
      setTimeout(() => coach("<b>The Workshop:</b> after every match you're dealt 5 part cards from the deck. Rarer cards appear in higher leagues. Try the <b>Brick</b> frame (4 wheels + a utility slot) and the <b>Hammer</b>, then equip them in the Garage.", "#cards"), 700);
    }
  }
  function vibrateIf(ms) {
    if (D().settings.haptics) vibrate(ms);
  }
  function seriesFight() {
    const e = nextEnemy();
    const L = currentLeague();
    return { mode: "series", enemy: e, arena: e.tutorial ? "tutorial" : L.arena };
  }
  function renderVS(fight) {
    if (!fight || !fight.enemy) fight = seriesFight();
    UI.fight = fight;
    const e = fight.enemy;
    const Dm = difficulty();
    const adj = adjustEnemy(e);
    const ps = playerStats();
    const es = computeStats(e.build, (id) => adj.levels[id] || 1);
    const arenaId = fight.arena;
    const haz = hazardList(ARENAS[arenaId]);
    const tip = e.tutorial ? "This is a training match. Nothing can go wrong!" : TIPS[(D().stats.matches * 3 + 1) % TIPS.length];
    const brawl = fight.mode === "brawl";
    const el = $("#scr-vs");
    el.innerHTML = `<div style="width:100%"><div class="vs" style="margin:0 auto">
      <div class="side"><canvas data-preview="player" data-spin="0"></canvas><div class="bname" style="color:var(--accent)">You</div><div class="small muted">Power ${powerRating(ps)} \xB7 HP ${ps.hp}</div></div>
      <div class="vsx">VS</div>
      <div class="side"><canvas data-preview="enemy" data-spin="0" data-mirror="1"></canvas><div class="bname" style="color:${e.team === "boss" ? "var(--gold)" : "var(--hot)"}">${esc(e.name)}</div><div class="small muted">${esc(e.title || "")} \xB7 Power ${powerRating(es)} \xB7 HP ${es.hp}</div></div>
    </div>
    <div class="chips">${brawl ? `<span class="chip gold">${coin} ${Math.round(fight.offer.reward * Dm.reward)} purse</span>` : ""}<span class="chip">${ARENAS[arenaId].name}</span>${!e.tutorial && Dm !== DIFFICULTY.normal ? `<span class="chip">${Dm.name} AI</span>` : ""}${haz.map((h) => `<span class="chip danger">${h}</span>`).join("")}</div>
    <div class="tip">${esc(tip)}</div>
    <div class="row" style="justify-content:center;margin-top:16px;gap:12px"><button class="btn ghost" data-act="back">Back</button><button class="btn ${e.team === "boss" ? "gold" : "hot"} big" data-act="go">${e.tutorial ? "Begin" : "Fight!"}</button></div>
  </div>`;
    bind(el, { back: () => {
      UI.fight = null;
      if (brawl) renderBrawl();
      else renderHub();
    }, go: () => startMatch() });
    show("vs");
    registerPreviews(el);
  }
  var BRAWL_REROLL = 10;
  function renderBrawl() {
    const d = D();
    const offers = brawlOffers();
    const Dm = difficulty();
    const pp = powerRating(playerStats());
    const cards = offers.map((o, i) => {
      const T = BRAWL_TIERS.find((t) => t.key === o.tier);
      const adj = adjustEnemy(o.enemy);
      const es = computeStats(o.enemy.build, (id) => adj.levels[id] || 1);
      const ep = powerRating(es);
      const rel = ep / Math.max(1, pp);
      const relTxt = rel > 1.15 ? ["stronger", "var(--hot)"] : rel < 0.88 ? ["weaker", "var(--ok)"] : ["evenly matched", "var(--muted)"];
      return `<div class="bcard" style="--tc:${T.color}">
      <div class="bhead"><span class="btier">${T.name}</span><span class="spacer"></span><span class="pill">${coin}${Math.round(o.reward * Dm.reward)}</span></div>
      <canvas data-preview="offer:${i}" data-spin="0" data-mirror="1"></canvas>
      <div class="bname">${esc(o.enemy.name)}</div>
      <div class="small muted">Power ${ep} <span style="color:${relTxt[1]}">(${relTxt[0]})</span> \xB7 HP ${es.hp}</div>
      <div class="chips left"><span class="chip">${ARENAS[o.arena].name}</span><span class="chip">${Math.round(T.drop * 100)}% part drop</span></div>
      <button class="btn block ${o.tier === "tough" ? "hot" : o.tier === "even" ? "primary" : ""}" data-act="go" data-arg="${i}">Fight</button>
    </div>`;
    }).join("");
    const el = $("#scr-brawl");
    el.innerHTML = `<div class="wrap">
    ${topbar("Quick Brawl", "back")}
    <div class="panel brawl-intro">
      <div><b>Side fights for credits and parts.</b><div class="small muted">Brawls never affect your series. Win in a row for a streak bonus (up to +50%), and winners sometimes salvage a free part.</div></div>
      <div class="streaks"><div class="streak"><b>${d.brawl.streak}</b><span>Streak</span></div><div class="streak"><b>${d.brawl.best}</b><span>Best</span></div><div class="streak"><b>${d.brawl.wins}</b><span>Won</span></div></div>
    </div>
    <div class="bcards">${cards}</div>
    <div class="hub-actions"><button class="btn" data-act="reroll" ${d.credits < BRAWL_REROLL ? "disabled" : ""}>New rivals &middot; ${coin} ${BRAWL_REROLL}</button><button class="btn" data-act="garage">Garage</button></div>
  </div>`;
    bind(el, {
      back: () => renderHub(),
      settings: () => openSettings(),
      garage: () => renderGarage(),
      reroll: () => {
        if (d.credits < BRAWL_REROLL) {
          play("error");
          return;
        }
        d.credits -= BRAWL_REROLL;
        rerollBrawl();
        play("deal");
        renderBrawl();
      },
      go: (i) => {
        const o = offers[+i];
        renderVS({ mode: "brawl", enemy: o.enemy, arena: o.arena, offer: o });
      }
    });
    show("brawl");
    registerPreviews(el);
  }
  function startMatch() {
    initAudio();
    const d = D();
    if (!UI.fight) UI.fight = seriesFight();
    const e = UI.fight.enemy;
    const arena = UI.fight.arena;
    const adj = adjustEnemy(e);
    UI.input = { x: 0, y: 0, mag: 0, fire: [false, false, false], boost: false };
    const m = new Match({
      arena,
      tutorial: !!e.tutorial,
      player: { build: JSON.parse(JSON.stringify(d.build)), levels: levelsMap() },
      enemy: { build: e.build, levels: adj.levels, diff: adj.diff, name: e.name, dummy: e.dummy, team: e.team },
      onEvent: onMatchEvent,
      shake: d.settings.shake === false ? 0 : 1
    });
    UI.match = m;
    UI.paused = false;
    buildHud(m);
    show("hud");
    resizeCanvas();
    m.start();
    if (window.innerHeight > window.innerWidth && !sessionStorage.getItem("cb-rot")) {
      sessionStorage.setItem("cb-rot", "1");
      setTimeout(() => toast("Tip: landscape gives you a wider view of the arena", 2600), 1200);
    }
  }
  function buildHud(m) {
    const el = $("#scr-hud");
    const ws = m.player.weapons;
    el.innerHTML = `
    <div class="hud-top">
      <div class="hpbox player"><div class="nm" style="color:var(--accent)">You</div><div class="hpbar"><i class="lag" data-plag></i><i class="hp" data-php></i></div>${m.player.st.shieldCap ? '<div class="shbar"><i data-psh></i></div>' : ""}</div>
      <div class="timer" data-timer>${m.tut ? "TRAIN" : "2:00"}</div>
      <div class="hpbox enemy"><div class="nm" style="color:${m.enemy.team === "boss" ? "var(--gold)" : "var(--hot)"}">${esc(m.enemy.name)}</div><div class="hpbar"><i class="lag" data-elag></i><i class="hp" data-ehp></i></div>${m.enemy.st.shieldCap ? '<div class="shbar"><i data-esh></i></div>' : ""}</div>
    </div>
    <button class="icon-btn pause" data-act="pause" aria-label="Pause">II</button>
    <div class="stick-zone" data-zone><div class="stick idle" data-stick><div class="knob" data-knob></div></div></div>
    <div class="abtns" data-btns>
      <div class="abtn boost" data-boost><div class="ring" style="--rcol:var(--gold)"></div><span class="bolt">&#9889;</span><span class="lab">Boost</span></div>
      ${ws.map((w, i) => `<div class="abtn" data-w="${i}"><div class="ring"></div><span class="mode">${["spin", "saw", "flame", "gun"].includes(w.def.kind) ? "HOLD" : "TAP"}</span><canvas data-icon="${w.def.id}"></canvas><span class="lab">${esc(ws.length > 1 ? w.def.name.split(" ").slice(-1)[0] : w.def.name)}</span></div>`).join("")}
    </div>
    <div data-tut></div>
    <div data-banner></div>`;
    drawIcons(el);
    $('[data-act="pause"]', el).onclick = () => {
      click();
      pauseMatch();
    };
    const stick = $("[data-stick]", el), knob = $("[data-knob]", el), zone = $("[data-zone]", el);
    const placeIdle = () => {
      const r = zone.getBoundingClientRect();
      stick.style.left = Math.min(130, r.width * 0.35) + "px";
      stick.style.top = r.height - 110 + "px";
      stick.classList.add("idle");
      stick.classList.remove("on");
      knob.style.transform = "";
    };
    requestAnimationFrame(placeIdle);
    let sp = null, ox = 0, oy = 0;
    const R = 60;
    zone.addEventListener("pointerdown", (e) => {
      if (sp !== null) return;
      e.preventDefault();
      initAudio();
      sp = e.pointerId;
      const r = zone.getBoundingClientRect();
      ox = e.clientX;
      oy = e.clientY;
      stick.style.left = ox - r.left + "px";
      stick.style.top = oy - r.top + "px";
      stick.classList.add("on");
      stick.classList.remove("idle");
      try {
        zone.setPointerCapture(e.pointerId);
      } catch (er) {
      }
      UI.touchStick = true;
    });
    zone.addEventListener("pointermove", (e) => {
      if (e.pointerId !== sp) return;
      let dx = e.clientX - ox, dy = e.clientY - oy;
      const l = Math.hypot(dx, dy);
      if (l > R) {
        dx = dx / l * R;
        dy = dy / l * R;
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      if (l < 6) {
        UI.input.mag = 0;
        return;
      }
      UI.input.x = dx;
      UI.input.y = dy;
      UI.input.mag = Math.min(1, l / R);
    });
    const end = (e) => {
      if (e.pointerId !== sp) return;
      sp = null;
      UI.input.mag = 0;
      UI.touchStick = false;
      placeIdle();
    };
    zone.addEventListener("pointerup", end);
    zone.addEventListener("pointercancel", end);
    const hold = (btn, on, off) => {
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        initAudio();
        btn.classList.add("down");
        on();
        try {
          btn.setPointerCapture(e.pointerId);
        } catch (er) {
        }
        vibrateIf(8);
      });
      const up = () => {
        btn.classList.remove("down");
        off();
      };
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
      btn.addEventListener("lostpointercapture", up);
    };
    hold($("[data-boost]", el), () => UI.input.boost = true, () => UI.input.boost = false);
    for (const b of $$("[data-w]", el)) {
      const i = +b.dataset.w;
      hold(b, () => UI.input.fire[i] = true, () => UI.input.fire[i] = false);
    }
    UI.hud = {
      php: $("[data-php]", el),
      plag: $("[data-plag]", el),
      psh: $("[data-psh]", el),
      ehp: $("[data-ehp]", el),
      elag: $("[data-elag]", el),
      esh: $("[data-esh]", el),
      timer: $("[data-timer]", el),
      boost: $("[data-boost]", el),
      wbtns: $$("[data-w]", el),
      tut: $("[data-tut]", el),
      banner: $("[data-banner]", el)
    };
  }
  function banner(text, color) {
    const b = UI.hud.banner;
    b.innerHTML = `<div class="banner pop" style="color:${color || "#fff"}">${text}</div>`;
  }
  function onMatchEvent(type, data) {
    const s = D().settings;
    switch (type) {
      case "sfx":
        play(data.name, data);
        break;
      case "hit":
        if (data.player && s.haptics) vibrate(data.big ? 40 : 15);
        break;
      case "toast":
        toast(data);
        break;
      case "count":
        if (data > 0) {
          banner(String(data));
          play("count");
        } else {
          banner("FIGHT!", "var(--accent)");
          play("go");
        }
        break;
      case "tut": {
        const total = 4;
        UI.hud.tut.innerHTML = `<div class="tutbox"><span class="stepn">TRAINING ${data.step + 1}/${total}</span>${esc(data.text)}</div>`;
        $$(".pulse-hl").forEach((e) => e.classList.remove("pulse-hl"));
        if (data.step === 2) UI.hud.boost.classList.add("pulse-hl");
        if (data.step === 3 && UI.hud.wbtns[0]) UI.hud.wbtns[0].classList.add("pulse-hl");
        if (data.step === 0) $("[data-stick]").classList.add("pulse-hl");
        break;
      }
      case "end":
        endMatch(data);
        break;
    }
  }
  function pauseMatch() {
    if (!UI.match || UI.match.state === "over") return;
    UI.paused = true;
    setHum(0);
    const tut = !!UI.match.tut;
    modal(`<h3>Paused</h3>
    ${toggles()}
    <div class="acts"><button class="btn primary" data-act="resume">Resume</button>${tut ? "" : '<button class="btn hot" data-act="forfeit">Forfeit match</button>'}</div>`, (m) => {
      bindToggles(m);
      bind(m, {
        resume: () => {
          closeModal();
          UI.paused = false;
        },
        forfeit: () => {
          closeModal();
          UI.paused = false;
          const r = { win: false, how: "forfeit", time: UI.match.time, dmgDealt: Math.round(UI.match.player.dmgDealt), hpLeft: 0 };
          UI.match.state = "over";
          endMatch(r);
        }
      });
    });
  }
  function onHidden() {
    if (UI.match && !UI.paused && UI.screen === "hud") pauseMatch();
  }
  function matchFrame(dt, ctx2, w, h) {
    const m = UI.match;
    if (!m) return;
    if (!UI.paused) {
      const k = UI.keys;
      if (!UI.touchStick) {
        let x = 0, y = 0;
        if (k.has("arrowleft") || k.has("a")) x -= 1;
        if (k.has("arrowright") || k.has("d")) x += 1;
        if (k.has("arrowup") || k.has("w")) y -= 1;
        if (k.has("arrowdown") || k.has("s")) y += 1;
        if (x || y) {
          UI.input.x = x;
          UI.input.y = y;
          UI.input.mag = 1;
          UI.kbDrive = true;
        } else if (UI.kbDrive) {
          UI.input.mag = 0;
          UI.kbDrive = false;
        }
      }
      const kf = [k.has(" ") || k.has("j"), k.has("k"), k.has("l")];
      const pin = m.player.input;
      pin.x = UI.input.x;
      pin.y = UI.input.y;
      pin.mag = UI.input.mag;
      pin.fire = [0, 1, 2].map((i) => UI.input.fire[i] || kf[i]);
      pin.boost = UI.input.boost || k.has("shift");
      const steps = dt > 1 / 45 ? 2 : 1;
      for (let i = 0; i < steps; i++) m.update(dt / steps);
    }
    m.draw(ctx2, w, h);
    const H = UI.hud;
    if (!H) return;
    const pf = Math.max(0, m.player.hp / m.player.maxHp), ef = Math.max(0, m.enemy.hp / m.enemy.maxHp);
    H.php.style.width = pf * 100 + "%";
    H.plag.style.width = pf * 100 + "%";
    H.ehp.style.width = ef * 100 + "%";
    H.elag.style.width = ef * 100 + "%";
    if (H.psh) H.psh.style.width = m.player.shield / m.player.st.shieldCap * 100 + "%";
    if (H.esh) H.esh.style.width = m.enemy.shield / m.enemy.st.shieldCap * 100 + "%";
    if (!m.tut) {
      const left = Math.max(0, Math.ceil(m.duration - m.time));
      const txt = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      if (H.timer.textContent !== txt) H.timer.textContent = txt;
      H.timer.classList.toggle("low", left <= 10);
    }
    const bf = m.player.boostCd <= 0 ? 1 : 1 - m.player.boostCd / m.player.st.boostCd;
    H.boost.firstElementChild.style.setProperty("--p", bf.toFixed(3));
    H.boost.classList.toggle("ready", bf >= 1);
    let hum2 = 0;
    m.player.weapons.forEach((w2, i) => {
      const b = H.wbtns[i];
      if (!b) return;
      const s = weaponStatus(w2);
      b.firstElementChild.style.setProperty("--p", s.frac.toFixed(3));
      b.classList.toggle("ready", s.ready);
      if (w2.def.kind === "spin") hum2 = Math.max(hum2, w2.rpm);
    });
    setHum(UI.paused || m.state === "over" ? 0 : hum2);
  }
  function endMatch(res) {
    setHum(0);
    const m = UI.match;
    UI.match = null;
    UI.hud = null;
    const f = UI.fight || seriesFight();
    UI.fight = null;
    const enemy = f.enemy;
    const L = currentLeague();
    const out = applyResult(res, f.mode, f.offer);
    renderResult(res, out, enemy, L);
    const g = $("#cv").getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, 99999, 99999);
    if (UI.onMatchEnd) UI.onMatchEnd();
  }
  function renderResult(res, out, enemy, L) {
    const how = { ko: "Knockout", pit: "Into the pit!", decision: "Judges' decision", forfeit: "Forfeit" }[res.how] || "";
    const total = out.lines.reduce((a, l) => a + l[1], 0) + (out.levelUp ? out.levelUp.bonus : 0);
    const el = $("#scr-result");
    el.innerHTML = `<div class="result panel">
    <div class="big ${res.win ? "win" : "lose"}">${res.tutorial ? "Trained!" : res.win ? "Victory" : "Defeat"}</div>
    <div class="muted">${res.tutorial ? "You're ready for the arena." : `${how} vs <b>${esc(enemy.name)}</b>`}</div>
    ${out.leagueUp ? `<div class="announce">&#127942; ${esc(L.name)} cleared! Unlocked: ${esc(out.leagueUp)}</div>` : ""}
    ${out.drop ? `<div class="announce drop r-${PART[out.drop].rarity}"><canvas data-icon="${out.drop}"></canvas><span>Salvaged a part!<br><b>${esc(PART[out.drop].name)}</b> <span class="rtag">${RARITY[PART[out.drop].rarity].name}</span></span></div>` : ""}
    ${out.levelUp ? `<div class="announce" style="border-color:var(--accent);color:var(--accent);background:rgba(63,240,255,.08)">Pilot level ${out.levelUp.level}!</div>` : ""}
    <div class="rlines">
      ${res.tutorial ? "" : `<div class="rline"><span class="muted">Damage dealt / taken</span><span>${res.dmgDealt} / ${res.dmgTaken ?? "-"}</span></div>`}
      ${out.lines.map((l, i) => `<div class="rline" style="animation-delay:${0.15 + i * 0.12}s"><span>${esc(l[0])}</span><span>${coin} ${l[1] < 0 ? "&minus;" : "+"}${Math.abs(l[1])}</span></div>`).join("")}
      ${out.levelUp ? `<div class="rline"><span>Level-up bonus</span><span>${coin} +${out.levelUp.bonus}</span></div>` : ""}
      <div class="rline total" style="animation-delay:${0.2 + out.lines.length * 0.12}s"><span>Total</span><span>${coin} +${total}</span></div>
      <div class="rline"><span class="muted">Pilot XP</span><span>+${out.xp}</span></div>
    </div>
    ${out.brawl ? `<div class="grid3"><button class="btn primary" data-act="brawl">Brawl again</button><button class="btn" data-act="shop">Workshop<span class="badge">NEW</span></button><button class="btn" data-act="hub">Hub</button></div>` : `<div class="grid2"><button class="btn" data-act="hub">Hub</button><button class="btn primary" data-act="shop">Workshop<span class="badge">NEW</span></button></div>`}
  </div>`;
    bind(el, { hub: () => renderHub(), shop: () => renderShop(), brawl: () => renderBrawl() });
    show("result");
    drawIcons(el);
  }
  function swRow(k, label, sub) {
    const s = D().settings;
    return `<div class="toggle" data-tog="${k}"><span class="tl"><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="switch ${s[k] ? "on" : ""}"></span></div>`;
  }
  function toggles() {
    return swRow("sound", "Sound effects") + swRow("music", "Music") + swRow("haptics", "Vibration");
  }
  function bindToggles(root) {
    for (const t of $$("[data-tog]", root)) t.onclick = () => {
      const k = t.dataset.tog;
      const s = D().settings;
      s[k] = !s[k];
      save();
      applyAudioSettings();
      syncMusic();
      t.lastElementChild.classList.toggle("on", !!s[k]);
      click();
      const r = $(`[data-range="${k === "sound" ? "sfxVol" : k === "music" ? "musicVol" : ""}"]`, root);
      if (r) r.disabled = !s[k];
    };
    for (const r of $$("[data-range]", root)) {
      r.oninput = () => {
        D().settings[r.dataset.range] = r.value / 100;
        applyAudioSettings();
        r.style.setProperty("--v", r.value + "%");
      };
      r.onchange = () => {
        save();
        click();
      };
    }
  }
  function openSettings() {
    const d = D(), s = d.settings, st = d.stats;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const diffs = Object.entries(DIFFICULTY).map(([k, v]) => `<button class="seg ${s.difficulty === k ? "on" : ""}" data-act="diff" data-arg="${k}">${v.name}</button>`).join("");
    const range = (k, on) => `<input class="range" type="range" min="0" max="100" value="${Math.round((s[k] ?? 0.5) * 100)}" style="--v:${Math.round((s[k] ?? 0.5) * 100)}%" data-range="${k}" aria-label="${k}" ${on ? "" : "disabled"}>`;
    const stat = (v, l) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`;
    modal(`<div class="settings">
    <div class="row shead"><h3>Settings</h3><span class="spacer"></span><button class="icon-btn" data-act="close" aria-label="Close">&times;</button></div>
    <section><h4>Gameplay</h4>
      <div class="tl" style="margin-bottom:8px"><b>AI difficulty</b><small data-diffdesc>${esc(difficulty().desc)}</small></div>
      <div class="segs">${diffs}</div>
      ${swRow("shake", "Screen shake", "Camera kick on big hits")}
      ${swRow("haptics", "Vibration", "Buzz when you take hits (supported phones)")}
    </section>
    <section><h4>Audio</h4>
      <div class="audiorow">${swRow("sound", "Sound effects")}${range("sfxVol", s.sound)}</div>
      <div class="audiorow">${swRow("music", "Music", "Relaxed synth soundtrack")}${range("musicVol", s.music)}</div>
    </section>
    <section><h4>Career</h4>
      <div class="statgrid">${stat(`${st.wins}-${st.losses}`, "Record")}${stat(st.kos, "Knockouts")}${stat(st.pits, "Pit KOs")}${stat(d.brawl.best, "Best streak")}${stat(`${Object.keys(d.inv).length}/${PARTS.length}`, "Parts")}${stat(pilotLevel(), "Pilot Lv")}</div>
    </section>
    <section><h4>App</h4>
      <div class="small muted" style="margin-bottom:8px">Version ${esc(UI.version)}. Updates download in the background and apply between matches.</div>
      <div class="btnrow"><button class="btn small" data-act="upd">Check for updates</button>${!standalone && (UI.installPrompt || ios) ? '<button class="btn small" data-act="install">Install app</button>' : ""}<button class="btn small" data-act="credits">Credits &amp; licenses</button></div>
    </section>
    <details class="dev"><summary>Developer options</summary>
      <div class="small muted" style="margin:6px 0 8px">Testing tools. These change your save file.</div>
      <div class="btnrow"><button class="btn small" data-act="dev" data-arg="parts">Unlock all parts</button><button class="btn small" data-act="dev" data-arg="credits">+5,000 credits</button><button class="btn small" data-act="dev" data-arg="max">Max all levels</button><button class="btn small" data-act="dev" data-arg="league">Skip to next league</button></div>
    </details>
    <section class="danger"><button class="btn hot block" data-act="reset">Reset progress</button></section>
  </div>`, (m) => {
      m.firstElementChild.classList.add("wide");
      bindToggles(m);
      bind(m, {
        close: closeModal,
        credits: openCredits,
        install: () => {
          closeModal();
          doInstall();
        },
        upd: () => {
          if (UI.checkUpdate) UI.checkUpdate(true);
        },
        diff: (k) => {
          s.difficulty = k;
          save();
          for (const b of $$(".seg", m)) b.classList.toggle("on", b.dataset.arg === k);
          $("[data-diffdesc]", m).textContent = difficulty().desc;
          refreshScreen();
        },
        dev: (k) => {
          if (k === "parts") {
            devGiveAll();
            toast("All parts unlocked");
          }
          if (k === "credits") {
            devCredits(5e3);
            toast("+5,000 credits");
          }
          if (k === "max") {
            devMaxAll();
            toast(`Every owned part is now Lv ${MAX_LEVEL}`);
          }
          if (k === "league") {
            devNextLeague();
            toast(`Now in ${currentLeague().name}`);
          }
          play("upgrade");
          refreshCredits();
          refreshScreen();
        },
        reset: () => modal(`<h3>Reset progress?</h3><p>This erases your parts, credits and league progress. It can't be undone.</p><div class="acts"><button class="btn hot" data-act="yes">Erase everything</button><button class="btn" data-act="no">Cancel</button></div>`, (m2) => bind(m2, {
          yes: () => {
            reset();
            applyAudioSettings();
            closeModal();
            UI.attract = null;
            renderTitle();
            toast("Progress reset");
          },
          no: openSettings
        }))
      });
    });
  }
  function refreshScreen() {
    const r = { title: renderTitle, hub: renderHub, brawl: renderBrawl, garage: renderGarage, shop: () => renderShop(false) }[UI.screen];
    if (r) r();
  }
  function openCredits() {
    modal(`<h3>Credits</h3><div class="credits-list">
    <h4>Cursor Bots</h4>Game design, code, art and sound are original to this project. Licensed under the MIT License (see LICENSE).
    <h4>Third-party code &amp; assets</h4>None. No libraries, frameworks, fonts, images or audio files are bundled. Graphics are drawn procedurally on HTML canvas, sound is synthesized live with the Web Audio API, and text uses your device's system font.
    <h4>Inspiration</h4>Inspired by classic arcade vector shooters, televised robot combat, and card-based upgrade games. Not affiliated with or endorsed by any of them; all trademarks belong to their owners.
    <h4>Controls</h4>Touch: drag the left half to drive, buttons on the right to attack and boost. Keyboard: WASD/arrows to drive, Space/J, K, L for weapons, Shift to boost.
  </div><div class="acts"><button class="btn primary" data-act="close">Close</button></div>`, (m) => bind(m, { close: closeModal }));
  }
  function resizeCanvas() {
    const c = $("#cv");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(window.innerWidth * dpr);
    c.height = Math.round(window.innerHeight * dpr);
    UI.dpr = dpr;
  }
  function initUI() {
    applyAudioSettings();
    const wake = () => {
      initAudio();
      applyAudioSettings();
      UI.audioOn = true;
      syncMusic();
    };
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("keydown", wake);
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      UI.keys.add(k);
      if (UI.screen === "hud" && [" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
      if (k === "escape" && UI.screen === "hud") {
        if (UI.paused) {
          closeModal();
          UI.paused = false;
        } else pauseMatch();
      }
    });
    window.addEventListener("keyup", (e) => UI.keys.delete(e.key.toLowerCase()));
    window.addEventListener("blur", () => UI.keys.clear());
    document.addEventListener("contextmenu", (e) => {
      if (UI.screen === "hud") e.preventDefault();
    });
  }

  // js/main.js
  load();
  initUI();
  renderTitle();
  var cv = document.getElementById("cv");
  var ctx = cv.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", () => setTimeout(resizeCanvas, 200));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) onHidden();
  });
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("dblclick", (e) => e.preventDefault());
  var last2 = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last2) / 1e3);
    last2 = now;
    if (UI.match) {
      const dpr = UI.dpr || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      matchFrame(dt, ctx, window.innerWidth, window.innerHeight);
    } else menuFrame(now / 1e3);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    setInstallPrompt(e);
  });
  window.addEventListener("appinstalled", () => {
    setInstallPrompt(null);
    toast("Installed! Launch Cursor Bots from your home screen.");
  });
  UI.version = "dev";
  if (sessionStorage.getItem("cb-updated")) {
    sessionStorage.removeItem("cb-updated");
    setTimeout(() => toast(`Updated to the latest version${UI.version !== "dev" ? " (v" + UI.version + ")" : ""}`), 600);
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    let pending = null, reloading = false;
    const askVersion = (sw) => new Promise((res) => {
      if (!sw) return res(null);
      const ch = new MessageChannel();
      ch.port1.onmessage = (e) => res(e.data && e.data.version);
      sw.postMessage({ type: "VERSION" }, [ch.port2]);
      setTimeout(() => res(null), 1500);
    });
    const safeScreen = () => !UI.match && ["title", "hub", "result"].includes(UI.screen);
    const banner2 = document.getElementById("update");
    const tryApply = () => {
      if (!pending) return;
      if (safeScreen()) {
        banner2.classList.add("hidden");
        pending.postMessage({ type: "SKIP_WAITING" });
        pending = null;
      } else {
        banner2.innerHTML = `<span>Update downloaded</span><button class="btn small primary" id="upd-now">${UI.match ? "After match" : "Restart"}</button>`;
        banner2.classList.remove("hidden");
        const b = document.getElementById("upd-now");
        b.onclick = () => {
          if (!UI.match && pending) {
            pending.postMessage({ type: "SKIP_WAITING" });
            pending = null;
            banner2.classList.add("hidden");
          }
        };
      }
    };
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading || !hadController) return;
      reloading = true;
      sessionStorage.setItem("cb-updated", "1");
      location.reload();
    });
    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
        const v = await askVersion(reg.active || navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active);
        if (v) {
          UI.version = v;
          const el = document.querySelector(".ver");
          if (el) el.textContent = "v" + v;
        }
        const watch = (w) => {
          w.addEventListener("statechange", () => {
            if (w.state === "installed" && navigator.serviceWorker.controller) {
              pending = w;
              tryApply();
            }
          });
        };
        if (reg.waiting && navigator.serviceWorker.controller) {
          pending = reg.waiting;
          tryApply();
        }
        if (reg.installing) watch(reg.installing);
        reg.addEventListener("updatefound", () => watch(reg.installing));
        const check = () => reg.update().catch(() => {
        });
        setInterval(check, 20 * 60 * 1e3);
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden) check();
        });
        setInterval(tryApply, 1500);
        UI.checkUpdate = async (manual) => {
          await check();
          setTimeout(() => {
            if (reg.installing || reg.waiting || pending) toast("Downloading update...");
            else if (manual) toast(`You're on the latest version (v${UI.version})`);
          }, 800);
        };
      } catch (e) {
        console.warn("SW registration failed", e);
      }
    });
  }
  window.CursorBots = { UI, renderHub };
})();
