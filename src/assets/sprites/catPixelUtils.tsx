/**
 * Pixel-art cat sprite utilities — Sanrio / Punirunes theme edition.
 * Grid: 16 cols × 17 rows, each pixel = P×P px, offset (OX, OY) inside a 120×120 viewBox.
 * Colours align with the Sanrio Punirunes device palette:
 *   primary  #FF6B9D  Sanrio hot pink
 *   accent   #7EC8E3  Punirunes sky blue
 *   text     #3D1522  deep wine
 */

export const P  = 6;   // pixel size in SVG units
export const OX = 12;  // x origin offset
export const OY = 6;   // y origin offset

/** Render one pixel-art square at grid position (c, r). w/h are in grid units. */
export function px(c: number, r: number, fill: string, w = 1, h = 1) {
  return (
    <rect
      x={OX + c * P}
      y={OY + r * P}
      width={P * w}
      height={P * h}
      fill={fill}
    />
  );
}

/** Render a horizontal run of same-colour pixels starting at (c, r) for `len` pixels. */
export function row(c: number, r: number, len: number, fill: string) {
  return <rect x={OX + c * P} y={OY + r * P} width={P * len} height={P} fill={fill} />;
}

// ── Sanrio / Punirunes colour palettes ────────────────────────────────────

export const PALETTES = {
  egg: {
    shell:    '#FFE0F0',   // light pink shell — Hello Kitty pink egg
    shellDk:  '#FF9ABF',   // medium pink — --color-primary range
    crack:    '#FF6B9D',   // Sanrio hot pink cracks
    spot:     '#FFB3D0',   // soft pink spots
    earTip:   '#FF9ABF',
    earInner: '#FFB3D0',
  },
  baby: {
    fur:      '#FFD6E7',   // baby pink
    furDk:    '#F9A8D4',   // rose
    belly:    '#FFF5F8',   // --color-bg
    earTip:   '#FFD6E7',
    earInner: '#FF9ABF',   // Sanrio pink inner ears
    stripe:   '#F472B6',
  },
  child: {
    fur:      '#D4B8E8',   // Kuromi soft lilac — Sanrio character stage
    furDk:    '#9478C8',   // medium Kuromi lilac
    belly:    '#EAE0F8',
    earTip:   '#D4B8E8',
    earInner: '#FFB3D0',
    stripe:   '#8870C8',
  },
  teen: {
    fur:      '#BAD9F7',   // Cinnamoroll sky-blue
    furDk:    '#7EB5E8',
    belly:    '#E8F4FF',
    earTip:   '#BAD9F7',
    earInner: '#FFB3C6',
    stripe:   '#5B9BD5',
    tuxedo:   '#FFFFFF',
  },
  adult: {
    fur:      '#FF9ABF',   // Sanrio pink — --color-primary range
    furDk:    '#F472B6',   // deeper rose
    belly:    '#FFF5F8',   // --color-bg
    earTip:   '#FF9ABF',
    earInner: '#FFD0E8',   // light pink inner ears
    stripe:   '#E8527A',
  },
  elder: {
    fur:      '#E8E0F4',   // pale silver-lilac
    furDk:    '#C0B4D8',
    belly:    '#F8F5FF',
    earTip:   '#E8E0F4',
    earInner: '#FFD6E7',
    muzzle:   '#FFEEF8',
    stripe:   '#C0A8BC',
  },
  dead: {
    fur:      '#C8C0D0',   // desaturated
    furDk:    '#988898',
    belly:    '#E0D8E8',
    earTip:   '#C8C0D0',
    earInner: '#C8B8C8',
    stripe:   '#887880',
  },
} as const;

// ── Shared facial / detail colours (Sanrio theme) ─────────────────────────

export const C = {
  eye:        '#3D1522',   // deep wine (matches --color-text)
  pupilGreen: '#5B9BD5',   // sky-blue pupils (Cinnamoroll-inspired)
  pupilBlue:  '#3D6FB5',   // medium blue
  eyeShine:   '#FFFFFF',
  nose:       '#FF6B9D',   // Sanrio pink nose
  mouth:      '#C0304A',   // deep rose mouth
  whisker:    '#D4B0C0',   // soft rose whiskers (matches room frames)
  blush:      '#FF9ABF',   // Sanrio pink blush
  shadow:     'rgba(255,107,157,0.18)',  // pink-tinted shadow
  halo:       '#FFD700',
  zzz:        '#7EC8E3',   // sky blue dream z's — Punirunes accent
  sickGreen:  '#78D898',
  tear:       '#7EC8E3',   // sky blue tear
} as const;

// ── Sick palette helper ────────────────────────────────────────────────────
// Call in each sprite instead of inline colour override objects.

export function getSickPalette<T extends Record<string, string>>(base: T): T {
  return {
    ...base,
    fur:      '#C8EED8',
    furDk:    '#8EC8A8',
    belly:    '#E0F4EC',
    earInner: '#A8D8C0',
  } as T;
}
