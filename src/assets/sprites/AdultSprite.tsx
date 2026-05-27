import type { PetMood } from '@/types';
import { P, OX, OY, PALETTES, C, px, row, getSickPalette } from './catPixelUtils';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function AdultSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const isSick     = mood === 'sick';
  const isSleeping = mood === 'sleeping';
  const isDead     = mood === 'dead';
  const isHappy    = mood === 'happy';
  const isSad      = mood === 'sad';

  const base = PALETTES.adult;
  const pal = isDead ? PALETTES.dead
    : isSick ? getSickPalette(base)
    : base;
  const { fur, furDk, belly, earInner, stripe } = pal;

  /* ── whisker endpoint helpers ── */
  const wx = (col: number) => OX + col * P;
  const wy = (row: number, off = 0) => OY + row * P + off;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role="img"
      aria-label={`Adult cat, ${mood}`}
    >
      {/* ── Shadow ── */}
      <ellipse cx="60" cy="113" rx="26" ry="5" fill={C.shadow} />

      {/* ── Tail (animated: sway) ── */}
      <g className="cat-tail">
        {row(13, 9,  2, fur)}
        {row(14, 10, 1, furDk)}
        {row(14, 11, 2, fur)}
        {row(13, 12, 2, furDk)}
        {row(12, 13, 3, fur)}
        {row(11, 14, 3, furDk)}
        {row(10, 15, 2, fur)}
      </g>

      {/* ── Body (animated: breathe) ── */}
      <g className="cat-body">
        {row(4, 9,  8, fur)}
        {row(3, 10, 10, fur)}
        {row(2, 11, 11, fur)}
        {row(2, 12, 11, fur)}
        {row(3, 13, 9,  fur)}

        {/* belly */}
        {row(6, 10, 4, belly)}
        {row(5, 11, 6, belly)}
        {row(5, 12, 6, belly)}
        {row(5, 13, 5, belly)}

        {/* stripes */}
        {row(3, 10, 2, stripe)}
        {row(11,10, 2, stripe)}
        {row(4, 11, 1, stripe)}
        {row(11,11, 1, stripe)}
        {row(3, 12, 2, stripe)}
        {row(11,12, 2, stripe)}
      </g>

      {/* ── Paws ── */}
      <g className="cat-paws">
        {row(3, 14, 3, belly)}
        {row(9, 14, 3, belly)}
        {/* toe dividers */}
        {px(4, 14, furDk)}
        {px(10,14, furDk)}
      </g>

      {/* ── Head (animated: action anim targets .cat-head) ── */}
      <g className="cat-head">

        {/* Left ear */}
        <g className="cat-ear-l">
          {px(3, 0, fur)}
          {row(2, 1, 3, fur)}
          {row(1, 2, 4, fur)}
          {px(3, 1, earInner)}
          {row(3, 2, 2, earInner)}
        </g>

        {/* Right ear */}
        <g className="cat-ear-r">
          {px(12,0, fur)}
          {row(11,1, 3, fur)}
          {row(11,2, 4, fur)}
          {px(12,1, earInner)}
          {row(11,2, 2, earInner)}
        </g>

        {/* Head fill */}
        {row(3, 2, 10, fur)}
        {row(2, 3, 12, fur)}
        {row(1, 4, 14, fur)}
        {row(1, 5, 14, fur)}
        {row(1, 6, 14, fur)}
        {row(1, 7, 14, fur)}
        {row(2, 8, 12, fur)}

        {/* Whiskers */}
        <line x1={wx(1)} y1={wy(5,1)} x2={wx(-3)} y2={wy(4,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(1)} y1={wy(6,3)} x2={wx(-3)} y2={wy(6,3)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(1)} y1={wy(7,1)} x2={wx(-3)} y2={wy(7,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(5,1)} x2={wx(17)} y2={wy(4,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(6,3)} x2={wx(17)} y2={wy(6,3)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(7,1)} x2={wx(17)} y2={wy(7,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />

        {/* Blush */}
        <circle cx={wx(2)+3} cy={wy(6)+3} r="7" fill={C.blush} opacity="0.45" />
        <circle cx={wx(13)+3} cy={wy(6)+3} r="7" fill={C.blush} opacity="0.45" />

        {/* Nose */}
        {row(7, 6, 2, C.nose)}

        {/* ── Eyes ── */}
        {isSleeping ? (
          <>
            {row(4, 5, 3, C.eye)}
            {row(9, 5, 3, C.eye)}
          </>
        ) : isDead ? (
          <>
            {/* X eyes */}
            {px(4, 4, C.eye)} {px(6, 4, C.eye)} {px(5, 5, C.eye)}
            {px(4, 6, C.eye)} {px(6, 6, C.eye)}
            {px(9, 4, C.eye)} {px(11,4, C.eye)} {px(10,5, C.eye)}
            {px(9, 6, C.eye)} {px(11,6, C.eye)}
          </>
        ) : (
          <g className="cat-eye-group">
            {/* Left eye */}
            {row(4, 4, 3, C.eye)}
            {row(4, 5, 3, C.eye)}
            {px(4, 4, C.pupilGreen)}
            {px(6, 4, C.eyeShine)}
            {/* Right eye */}
            {row(9, 4, 3, C.eye)}
            {row(9, 5, 3, C.eye)}
            {px(9, 4, C.pupilGreen)}
            {px(11,4, C.eyeShine)}
            {/* Happy squint covers bottom row of eyes */}
            {isHappy && (
              <>
                {row(4, 5, 3, fur)}
                {row(9, 5, 3, fur)}
              </>
            )}
          </g>
        )}

        {/* ── Mouth ── */}
        {isHappy && (
          <>
            {px(5, 7, C.mouth)}
            {row(6, 8, 4, C.mouth)}
            {px(10,7, C.mouth)}
          </>
        )}
        {isSad && (
          <>
            {px(5, 8, C.mouth)}
            {row(6, 7, 4, C.mouth)}
            {px(10,8, C.mouth)}
            {/* tear */}
            {px(5, 7, C.tear)}
          </>
        )}
        {!isHappy && !isSad && !isSleeping && !isDead && (
          row(6, 7, 4, C.mouth)
        )}
        {isSleeping && (
          <>
            {row(6, 7, 4, C.mouth)}
            <text x={wx(14)} y={wy(3)} fontFamily="sans-serif" fontSize="10" fill={C.zzz} fontWeight="bold" className="cat-zzz-1">z</text>
            <text x={wx(14)+4} y={wy(1)+2} fontFamily="sans-serif" fontSize="8"  fill={C.zzz} fontWeight="bold" className="cat-zzz-2">z</text>
            <text x={wx(15)} y={wy(0)-2} fontFamily="sans-serif" fontSize="6"  fill={C.zzz} fontWeight="bold" className="cat-zzz-3">z</text>
          </>
        )}
        {isDead && (
          <>
            {px(5, 8, C.mouth)}
            {row(6, 7, 4, C.mouth)}
            {px(10,8, C.mouth)}
            <circle cx="60" cy="4" r="12" stroke={C.halo} strokeWidth="3" fill="none" opacity="0.85" />
          </>
        )}

        {/* Sick sweat drop */}
        {isSick && (
          <>
            {px(13, 3, C.tear)}
            {px(13, 4, C.tear)}
            {px(12, 5, C.tear)}
          </>
        )}
      </g>
    </svg>
  );
}
