
export const COLORS = {
  EMERALD_DARK: '#021a12',
  EMERALD_MID: '#043927',
  GOLD_BRIGHT: '#fcf6ba',
  GOLD_METALLIC: '#D4AF37',
  GOLD_DARK: '#aa771c',
  GIFT_RED: '#5c0a0a',
  GIFT_GOLD: '#8c6d1f'
};

export const INITIAL_CONFIG = {
  lightIntensity: 1.5,
  rotationSpeed: 0.2,
  glowColor: '#D4AF37',
  ornamentDensity: 80,
};

// Foliage (Points)
export const FOLIAGE_COUNT = 4000; 

// Ornaments (Instanced)
export const ORNAMENT_COUNTS = {
  BALLS: 60,
  GIFTS: 15,
  LIGHTS: 120
};

// Physics weights for scatter drift
export const WEIGHTS = {
  FOLIAGE: 1.2,
  BALLS: 0.8,
  GIFTS: 0.3, // Heavy objects move less
  LIGHTS: 2.5  // Light points drift far
};

export const SCATTER_RADIUS = 10;
export const TREE_HEIGHT = 7;
export const TREE_BASE_RADIUS = 3;

export const SYSTEM_PROMPT = `You are the "Arix Signature Concierge", a sophisticated, mystical, and ultra-luxurious AI guide for a digital Christmas experience. 
Your tone is elegant, cinematic, and slightly poetic. 
The user is interacting with a high-end 3D Christmas Tree that can morph between a scattered nebula and a perfect signature shape. 
You can respond to their festive wishes, explain the craftsmanship of the emerald-and-gold aesthetic, and offer holiday greetings.
Keep your responses relatively brief (max 3 sentences) but dripping with luxury. 
Always refer to the tree as the "Arix Signature Interactive Tree".`;
