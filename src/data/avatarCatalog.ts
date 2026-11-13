export interface Avatar2DPreset {
  id: number;
  code: string;
  name: string;
  archetype: string;
  gender: 'female' | 'male';
  skinTone: string;
  skinShadow: string;
  eyeColor: string;
  eyeShape: 'almond' | 'cyber' | 'wide' | 'sharp' | 'cat';
  faceShape: 'oval' | 'heart' | 'diamond' | 'square';
  cheekMark: 'none' | 'blush' | 'cyber_lines' | 'star' | 'freckles' | 'hud_dot';
  lipColor: string;
  defaultHairIndex: number;
  defaultOutfitIndex: number;
  defaultHairColor: string;
  auraColor: string;
}

export interface OutfitItem {
  id: number;
  name: string;
  category: 'Cyberpunk' | 'Evening & Glam' | 'Streetwear' | 'Desi & Royal' | 'Tactical Armor' | 'Executive' | 'Cozy & Casual';
  primaryColor: string;
  secondaryColor: string;
  trimColor: string;
  silhouette: 'jacket' | 'dress' | 'hoodie' | 'armor' | 'kurta' | 'blazer' | 'bodysuit' | 'trench';
}

export interface HairstyleItem {
  id: number;
  name: string;
  category: 'Long & Flowing' | 'Short & Chic' | 'Ponytail & Updo' | 'Cyber & Anime' | 'Curly & Braided';
  backShape: 'long_wave' | 'long_straight' | 'bob' | 'pixie' | 'twintails' | 'high_ponytail' | 'afro_puff' | 'braids' | 'buns' | 'spiky';
  bangsShape: 'curtain' | 'side_sweep' | 'blunt' | 'wispy' | 'cyber_lock' | 'parted' | 'mohawk';
  accentStreak?: boolean;
}

export interface AccessoryItem {
  id: string;
  name: string;
  slot: 'eyewear' | 'headwear' | 'neck' | 'back' | 'ear' | 'aura';
  color: string;
}

const SKIN_TONES = [
  { base: '#fce0d0', shadow: '#e4b8a0' },
  { base: '#f5cfa8', shadow: '#d6a478' },
  { base: '#e5b58a', shadow: '#c28a5c' },
  { base: '#d1986a', shadow: '#a96f43' },
  { base: '#b5784d', shadow: '#8a5430' },
  { base: '#8d5534', shadow: '#663a20' },
  { base: '#e8e8f5', shadow: '#b8bdd6' }, // Android porcelain
  { base: '#d9f2f7', shadow: '#9bcdd9' }, // Hologram ice
];

const EYE_COLORS = ['#00f5ff', '#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#6366f1', '#22d3ee', '#7c3aed', '#fbbf24'];
const LIP_COLORS = ['#e07a8d', '#c9566c', '#f43f5e', '#d97777', '#a855f7', '#c0846c', '#fb7185', '#9d4d5c'];
const HAIR_COLORS = ['#0f172a', '#2e1a12', '#5c2d16', '#f43f5e', '#00f5ff', '#a855f7', '#fbbf24', '#e2e8f0', '#ec4899', '#10b981'];
const AURA_COLORS = ['#00f5ff', '#a855f7', '#f43f5e', '#10b981', '#f59e0b', '#38bdf8', '#ec4899', '#84cc16'];

const AVATAR_FIRST_NAMES_F = [
  'Zoya', 'Aria', 'Hira', 'Nova', 'Mehak', 'Lyra', 'Amina', 'Kira', 'Sana', 'Vega',
  'Noor', 'Freya', 'Mahnoor', 'Sora', 'Alizeh', 'Nyx', 'Ayesha', 'Luna', 'Rania', 'Iris',
  'Misha', 'Elena', 'Tara', 'Yuki', 'Zara', 'Hania', 'Seraph', 'Kinza', 'Mina', 'Aura',
  'Laiba', 'Chloe', 'Eshal', 'Kaito-F', 'Rumi', 'Inaya', 'Talia', 'Meera', 'Jiya', 'Ayla',
];

const AVATAR_FIRST_NAMES_M = [
  'Zain', 'Kael', 'Hamza', 'Orion', 'Bilal', 'Dante', 'Usman', 'Cipher', 'Rayan', 'Jax',
  'Farhan', 'Vex', 'Saad', 'Raiden', 'Taimoor', 'Axel', 'Arslan', 'Draco', 'Daniyal', 'Nero',
];

const ARCHETYPES = [
  'Cyber Muse', 'Quantum Oracle', 'Tactical Pilot', 'Neon Idol', 'Arc Engineer',
  'Holo Guardian', 'Shadow Weaver', 'Royal Sovereign', 'Starlight Medic', 'Code Valkyrie',
];

const EYE_SHAPES: Avatar2DPreset['eyeShape'][] = ['almond', 'cyber', 'wide', 'sharp', 'cat'];
const FACE_SHAPES: Avatar2DPreset['faceShape'][] = ['oval', 'heart', 'diamond', 'square'];
const CHEEK_MARKS: Avatar2DPreset['cheekMark'][] = ['none', 'blush', 'cyber_lines', 'star', 'freckles', 'hud_dot'];

// EXACTLY 100 CURATED 2D AVATARS
export const AVATAR_PRESETS_100: Avatar2DPreset[] = Array.from({ length: 100 }, (_, i) => {
  const isFemale = i < 75; // 75 expressive female + 25 male/commander variants = 100 avatars
  const namePool = isFemale ? AVATAR_FIRST_NAMES_F : AVATAR_FIRST_NAMES_M;
  const baseName = namePool[i % namePool.length];
  const suffix = Math.floor(i / namePool.length) > 0 ? ` Mk-${Math.floor(i / namePool.length) + 1}` : '';
  const skin = SKIN_TONES[i % SKIN_TONES.length];

  return {
    id: i,
    code: `QN-${String(i + 1).padStart(3, '0')}`,
    name: `${baseName}${suffix}`,
    archetype: ARCHETYPES[i % ARCHETYPES.length],
    gender: isFemale ? 'female' : 'male',
    skinTone: skin.base,
    skinShadow: skin.shadow,
    eyeColor: EYE_COLORS[i % EYE_COLORS.length],
    eyeShape: EYE_SHAPES[i % EYE_SHAPES.length],
    faceShape: FACE_SHAPES[i % FACE_SHAPES.length],
    cheekMark: CHEEK_MARKS[i % CHEEK_MARKS.length],
    lipColor: isFemale ? LIP_COLORS[i % LIP_COLORS.length] : '#b57c70',
    defaultHairIndex: i % 54,
    defaultOutfitIndex: i % 105,
    defaultHairColor: HAIR_COLORS[(i * 3) % HAIR_COLORS.length],
    auraColor: AURA_COLORS[i % AURA_COLORS.length],
  };
});

// 105+ OUTFITS (Exact 108 rich distinct outfits)
const OUTFIT_PREFIXES = [
  'Quantum', 'Cyber', 'Velvet', 'Obsidian', 'Stark', 'Lahori', 'Neon', 'Crimson', 'Solar',
  'Astral', 'Emerald', 'Midnight', 'Crystal', 'Royal', 'Titanium', 'Holo', 'Valkyrie', 'Phantom',
];
const OUTFIT_BASES: {
  suffix: string;
  cat: OutfitItem['category'];
  sil: OutfitItem['silhouette'];
}[] = [
  { suffix: 'Tech Jacket', cat: 'Cyberpunk', sil: 'jacket' },
  { suffix: 'Evening Gown', cat: 'Evening & Glam', sil: 'dress' },
  { suffix: 'Oversized Hoodie', cat: 'Streetwear', sil: 'hoodie' },
  { suffix: 'Mark Suit Armor', cat: 'Tactical Armor', sil: 'armor' },
  { suffix: 'Embroidered Kurta', cat: 'Desi & Royal', sil: 'kurta' },
  { suffix: 'Executive Blazer', cat: 'Executive', sil: 'blazer' },
];

const COLOR_SETS = [
  ['#0f172a', '#06b6d4', '#22d3ee'],
  ['#1e1b4b', '#a855f7', '#e879f9'],
  ['#3b0764', '#ec4899', '#f472b6'],
  ['#450a0a', '#dc2626', '#fbbf24'],
  ['#064e3b', '#10b981', '#6ee7b7'],
  ['#172554', '#3b82f6', '#93c5fd'],
  ['#18181b', '#f59e0b', '#fde047'],
  ['#312e81', '#6366f1', '#38bdf8'],
  ['#4c0519', '#f43f5e', '#fda4af'],
  ['#042f2e', '#14b8a6', '#5eead4'],
  ['#27272a', '#e2e8f0', '#00f5ff'],
  ['#422006', '#eab308', '#fef08a'],
];

export const OUTFIT_CATALOG: OutfitItem[] = Array.from({ length: 108 }, (_, i) => {
  const prefix = OUTFIT_PREFIXES[Math.floor(i / OUTFIT_BASES.length) % OUTFIT_PREFIXES.length];
  const base = OUTFIT_BASES[i % OUTFIT_BASES.length];
  const palette = COLOR_SETS[(i * 5) % COLOR_SETS.length];
  const extraTrenchOrBodysuit: OutfitItem['silhouette'] =
    i % 9 === 0 ? 'bodysuit' : i % 11 === 0 ? 'trench' : base.sil;

  return {
    id: i,
    name: `${prefix} ${base.suffix}`,
    category: base.cat,
    primaryColor: palette[0],
    secondaryColor: palette[1],
    trimColor: palette[2],
    silhouette: extraTrenchOrBodysuit,
  };
});

// 54+ HAIRSTYLES (Exact 56 distinct hairstyles)
const HAIR_NAMES = [
  'Cascade Waves', 'Cyber Twin-Tails', 'Sleek Glass Bob', 'High Tachyon Ponytail', 'Braided Crown',
  'Neon Pixie Cut', 'Velvet Curtain Bangs', 'Astral Space Buns', 'Soft Wavy Lob', 'Spike Commander',
  'Holo Side-Swept', 'Desi Long Silk', 'Curly Cloud Afro', 'Samurai Topknot', 'Prism Layered Cut',
  'Hime Princess Cut', 'Shag Rocker Waves', 'Undercut Edge', 'Halo French Braid', 'Bubble Ponytail',
  'Moonlight Curls', 'Feather Pixie', 'Double Dutch Braids', 'Galaxy Flow', 'Valkyrie Swept',
  'Starlight Bangs', 'Retro Voluminous Flip', 'Quantum Dreadlocks',
];

const BACK_SHAPES: HairstyleItem['backShape'][] = [
  'long_wave', 'twintails', 'bob', 'high_ponytail', 'braids',
  'pixie', 'long_straight', 'buns', 'afro_puff', 'spiky',
];
const BANGS_SHAPES: HairstyleItem['bangsShape'][] = [
  'curtain', 'side_sweep', 'blunt', 'wispy', 'cyber_lock', 'parted', 'mohawk',
];
const HAIR_CATEGORIES: HairstyleItem['category'][] = [
  'Long & Flowing', 'Cyber & Anime', 'Short & Chic', 'Ponytail & Updo', 'Curly & Braided',
];

export const HAIRSTYLE_CATALOG: HairstyleItem[] = Array.from({ length: 56 }, (_, i) => {
  const baseTitle = HAIR_NAMES[i % HAIR_NAMES.length];
  const variant = i >= HAIR_NAMES.length ? ' (Holo Edition)' : '';
  return {
    id: i,
    name: `${baseTitle}${variant}`,
    category: HAIR_CATEGORIES[i % HAIR_CATEGORIES.length],
    backShape: BACK_SHAPES[i % BACK_SHAPES.length],
    bangsShape: BANGS_SHAPES[i % BANGS_SHAPES.length],
    accentStreak: i % 3 === 0,
  };
});

// 28+ AVATAR ACCESSORIES
export const ACCESSORY_CATALOG: AccessoryItem[] = [
  { id: 'ar_visor', name: 'Cyber AR Visor', slot: 'eyewear', color: '#00f5ff' },
  { id: 'round_glasses', name: 'Scholar Glasses', slot: 'eyewear', color: '#fbbf24' },
  { id: 'sunglasses', name: 'Stealth Shades', slot: 'eyewear', color: '#0f172a' },
  { id: 'monocle_hud', name: 'Tactical HUD Lens', slot: 'eyewear', color: '#22d3ee' },
  { id: 'cat_headset', name: 'Neon Cat Headset', slot: 'headwear', color: '#ec4899' },
  { id: 'queen_tiara', name: 'Quantum Tiara Crown', slot: 'headwear', color: '#fbbf24' },
  { id: 'quantum_halo', name: 'Radiant Holo Halo', slot: 'headwear', color: '#00f5ff' },
  { id: 'bunny_ears', name: 'Holo Bunny Ears', slot: 'headwear', color: '#f472b6' },
  { id: 'cyber_horns', name: 'Mecha Horn Crest', slot: 'headwear', color: '#f43f5e' },
  { id: 'flower_crown', name: 'Lotus Flower Crown', slot: 'headwear', color: '#34d399' },
  { id: 'beret', name: 'Commander Beret', slot: 'headwear', color: '#dc2626' },
  { id: 'fox_mask', name: 'Side Kitsune Mask', slot: 'headwear', color: '#f8fafc' },
  { id: 'arc_pendant', name: 'Arc Reactor Necklace', slot: 'neck', color: '#38bdf8' },
  { id: 'velvet_choker', name: 'Starlight Choker', slot: 'neck', color: '#a855f7' },
  { id: 'gold_jhumka', name: 'Desi Gold Jhumkas', slot: 'ear', color: '#fbbf24' },
  { id: 'neon_drops', name: 'Cyan Drop Earrings', slot: 'ear', color: '#00f5ff' },
  { id: 'tactical_mic', name: 'Comms Boom Mic', slot: 'ear', color: '#10b981' },
  { id: 'angel_wings', name: 'Holo Seraph Wings', slot: 'back', color: '#e0f2fe' },
  { id: 'cyber_wings', name: 'Mecha Thruster Wings', slot: 'back', color: '#06b6d4' },
  { id: 'demon_wings', name: 'Crimson Night Wings', slot: 'back', color: '#f43f5e' },
  { id: 'shoulder_drones', name: 'Twin Orbit Drones', slot: 'back', color: '#a855f7' },
  { id: 'quantum_aura', name: 'Tachyon Energy Aura', slot: 'aura', color: '#00f5ff' },
  { id: 'rose_petals', name: 'Floating Rose Sparks', slot: 'aura', color: '#fb7185' },
  { id: 'star_orbit', name: 'Orbiting Qubit Stars', slot: 'aura', color: '#fde047' },
];
