/**
 * Pixel-art cat sprite utilities — pastel theme edition.
 * Grid: 16 cols × 17 rows, each pixel = P×P px, offset (OX, OY) inside a 120×120 viewBox.
 * Colours are drawn from the app's pastel design tokens.
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

// ── Pastel colour palettes (match app theme tokens) ────────────────────────

export const PALETTES = {
  egg: {
    shell:    '#EDD9FF',   // pale lavender
    shellDk:  '#C084FC',   // --color-primary
    crack:    '#A855F7',
    spot:     '#F9A8D4',   // --color-accent
    earTip:   '#C084FC',
    earInner: '#F9A8D4',
  },
  baby: {
    fur:      '#FFD6E7',   // baby pink
    furDk:    '#F9A8D4',   // rose
    belly:    '#FFF0F5',   // --color-bg
    earTip:   '#FFD6E7',
    earInner: '#C084FC',   // purple inner ears
    stripe:   '#F472B6',
  },
  child: {
    fur:      '#D4B8F0',   // soft lavender
    furDk:    '#9B72CF',   // medium purple
    belly:    '#EDE0FF',
    earTip:   '#D4B8F0',
    earInner: '#F9A8D4',
    stripe:   '#8B5CF6',
  },
  teen: {
    fur:      '#BAD9F7',   // pastel sky-blue
    furDk:    '#7EB5E8',
    belly:    '#E8F4FF',
    earTip:   '#BAD9F7',
    earInner: '#FFB3C6',
    stripe:   '#5B9BD5',
    tuxedo:   '#FFFFFF',
  },
  adult: {
    fur:      '#F9A8D4',   // --color-accent (rose pink)
    furDk:    '#F472B6',   // deeper rose
    belly:    '#FFF0F5',   // --color-bg
    earTip:   '#F9A8D4',
    earInner: '#C084FC',   // purple inner ears
    stripe:   '#E879A4',
  },
  elder: {
    fur:      '#E8E0F4',   // pale lilac
    furDk:    '#C0B4D8',
    belly:    '#F8F4FF',
    earTip:   '#E8E0F4',
    earInner: '#FFD6E7',
    muzzle:   '#FFEEF8',
    stripe:   '#B0A0CC',
  },
  dead: {
    fur:      '#C8C0D0',   // desaturated mauve
    furDk:    '#988898',
    belly:    '#E0D8E8',
    earTip:   '#C8C0D0',
    earInner: '#C8B8C8',
    stripe:   '#887880',
  },
} as const;

// ── Shared facial / detail colours (pastel theme) ─────────────────────────

export const C = {
  eye:        '#2D1B4E',   // deep purple
  pupilGreen: '#9B59B6',   // purple pupils (theme-matched)
  pupilBlue:  '#7C3AED',
  eyeShine:   '#FFFFFF',
  nose:       '#F472B6',   // rose
  mouth:      '#BE185D',   // deep rose
  whisker:    '#C4B5D8',   // lavender whiskers
  blush:      '#F9A8D4',   // --color-accent
  shadow:     'rgba(192,132,252,0.18)',  // purple-tinted
  halo:       '#FFD700',
  zzz:        '#C084FC',   // --color-primary
  sickGreen:  '#86EFAC',
  tear:       '#93C5FD',
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
