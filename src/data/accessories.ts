import type { AccessoryDefinition } from '@/types';

/**
 * Coins awarded when the pet evolves to a new stage.
 * Key = the stage the pet REACHES.
 */
export const EVOLUTION_COIN_REWARD: Partial<Record<string, number>> = {
  baby:  5,
  child: 10,
  teen:  20,
  adult: 30,
  elder: 50,
};

/** Full accessory catalog */
export const ACCESSORY_CATALOG: AccessoryDefinition[] = [
  // ── HATS ──────────────────────────────────────────────────────
  {
    id:               'flower_crown',
    name:             'Flower Crown',
    emoji:            '🌸',
    description:      'A pretty crown of pink blossoms.',
    category:         'hat',
    price:            8,
    overlayComponent: 'flower_crown',
  },
  {
    id:               'blue_cap',
    name:             'Blue Cap',
    emoji:            '🧢',
    description:      'A sporty cap to look cool.',
    category:         'hat',
    price:            10,
    overlayComponent: 'blue_cap',
  },
  {
    id:               'top_hat',
    name:             'Top Hat',
    emoji:            '🎩',
    description:      'Very elegant. Very distinguished.',
    category:         'hat',
    price:            15,
    overlayComponent: 'top_hat',
  },
  {
    id:               'witch_hat',
    name:             'Witch Hat',
    emoji:            '🧙',
    description:      'For the magical and mysterious.',
    category:         'hat',
    price:            25,
    overlayComponent: 'witch_hat',
  },
  {
    id:               'party_hat',
    name:             'Party Hat',
    emoji:            '🎉',
    description:      "It's always a party!",
    category:         'hat',
    price:            5,
    overlayComponent: 'party_hat',
  },

  // ── OUTFITS ────────────────────────────────────────────────────
  {
    id:               'red_bow',
    name:             'Red Bow',
    emoji:            '🎀',
    description:      'A cute bow ribbon on the chest.',
    category:         'outfit',
    price:            8,
    overlayComponent: 'red_bow',
  },
  {
    id:               'blue_scarf',
    name:             'Blue Scarf',
    emoji:            '🧣',
    description:      'A cozy scarf for chilly days.',
    category:         'outfit',
    price:            12,
    overlayComponent: 'blue_scarf',
  },
  {
    id:               'tiny_tie',
    name:             'Tiny Tie',
    emoji:            '👔',
    description:      'Business cat, very professional.',
    category:         'outfit',
    price:            15,
    overlayComponent: 'tiny_tie',
  },
  {
    id:               'rainbow_shirt',
    name:             'Rainbow Shirt',
    emoji:            '🌈',
    description:      'Bright and colourful as your smile!',
    category:         'outfit',
    price:            20,
    overlayComponent: 'rainbow_shirt',
  },

  // ── FACE ACCESSORIES ───────────────────────────────────────────
  {
    id:               'round_glasses',
    name:             'Round Glasses',
    emoji:            '👓',
    description:      'Cute round glasses for the studious.',
    category:         'face',
    price:            10,
    overlayComponent: 'round_glasses',
  },
  {
    id:               'heart_glasses',
    name:             'Heart Glasses',
    emoji:            '💕',
    description:      'See the world with love!',
    category:         'face',
    price:            12,
    overlayComponent: 'heart_glasses',
  },
  {
    id:               'star_badge',
    name:             'Star Badge',
    emoji:            '⭐',
    description:      'A shiny star pinned on the chest.',
    category:         'face',
    price:            5,
    overlayComponent: 'star_badge',
  },
  {
    id:               'gold_crown',
    name:             'Gold Crown',
    emoji:            '👑',
    description:      'For royalty only. Very rare!',
    category:         'hat',
    price:            50,
    overlayComponent: 'gold_crown',
  },
];

export const ACCESSORY_BY_ID = Object.fromEntries(
  ACCESSORY_CATALOG.map(a => [a.id, a]),
) as Record<string, AccessoryDefinition>;

export const CATEGORY_LABELS: Record<string, string> = {
  hat:    '🎩 Hats',
  outfit: '👗 Outfits',
  face:   '✨ Accessories',
};
