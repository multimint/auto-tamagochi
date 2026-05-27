import type { PetMood } from '@/types';
import { P, OX, OY, PALETTES, C, px, row, getSickPalette } from './catPixelUtils';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Elder cat — silver/white fur, hunched slightly (head shifted right),
 * droopy ears, white muzzle patch, low dragging tail.
 */
export function ElderSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const isSick     = mood === 'sick';
  const isSleeping = mood === 'sleeping';
  const isDead     = mood === 'dead';
  const isHappy    = mood === 'happy';
  const isSad      = mood === 'sad';

  const base = PALETTES.elder;
  const pal = isDead ? PALETTES.dead
    : isSick ? getSickPalette(base)
    : base;
  const { fur, furDk, belly, earInner, stripe } = pal;
  const muzzle = 'muzzle' in pal ? (pal as typeof PALETTES.elder).muzzle : '#EEEEEE';

  /* Hunched look: head shifted right by 1 col, body wider-left */
  const wx = (col: number) => OX + col * P;
  const wy = (r: number, off = 0) => OY + r * P + off;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role="img"
      aria-label={`Elder cat, ${mood}`}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="113" rx="26" ry="5" fill={C.shadow} />

      {/* Low drooping tail */}
      <g className="cat-tail">
        {row(12, 10, 2, fur)}
        {row(12, 11, 3, furDk)}
        {row(11, 12, 3, fur)}
        {row(10, 13, 3, furDk)}
        {row(9,  14, 3, fur)}
        {row(8,  15, 2, furDk)}
      </g>

      {/* Body — slightly hunched left */}
      <g className="cat-body">
        {row(2, 9,  11, fur)}
        {row(2,10,  11, fur)}
        {row(2,11,  11, fur)}
        {row(2,12,  11, fur)}
        {row(3,13,  9,  fur)}

        {/* belly */}
        {row(5,10, 5, belly)}
        {row(5,11, 5, belly)}
        {row(5,12, 5, belly)}

        {/* aging stripes - subtle */}
        {row(3, 9, 2, stripe)}
        {px(12, 9, stripe)}
        {row(3,12, 2, stripe)}
        {px(12,12, stripe)}
      </g>

      {/* Paws */}
      <g className="cat-paws">
        {row(3,14, 3, belly)}
        {row(9,14, 3, belly)}
        {px(4,14, furDk)}
        {px(10,14,furDk)}
      </g>

      {/* Head — shifted 1 col right for hunched look */}
      <g className="cat-head">

        {/* Drooping ears (slightly bent) */}
        <g className="cat-ear-l">
          {px(4, 0, fur)}
          {row(3, 1, 3, fur)}
          {row(3, 2, 4, fur)}
          {px(4, 1, earInner)}
          {row(4, 2, 2, earInner)}
          {/* droop pixel */}
          {px(2, 3, fur)}
        </g>
        <g className="cat-ear-r">
          {px(13,0, fur)}
          {row(12,1, 3, fur)}
          {row(12,2, 4, fur)}
          {px(13,1, earInner)}
          {row(12,2, 2, earInner)}
          {px(15,3, fur)}
        </g>

        {/* Head — slightly right of center */}
        {row(4, 2, 10, fur)}
        {row(3, 3, 12, fur)}
        {row(2, 4, 14, fur)}
        {row(2, 5, 14, fur)}
        {row(2, 6, 14, fur)}
        {row(2, 7, 14, fur)}
        {row(3, 8, 12, fur)}
        {row(4, 9, 10, fur)}

        {/* White muzzle patch */}
        {row(6, 5, 6, muzzle)}
        {row(5, 6, 7, muzzle)}
        {row(5, 7, 7, muzzle)}

        {/* 3 whiskers per side, slightly drooping */}
        <line x1={wx(2)} y1={wy(5,2)} x2={wx(-2)} y2={wy(5,-1)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(2)} y1={wy(6,3)} x2={wx(-2)} y2={wy(6,3)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(2)} y1={wy(7,2)} x2={wx(-2)} y2={wy(7,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(14)} y1={wy(5,2)} x2={wx(18)} y2={wy(5,-1)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(14)} y1={wy(6,3)} x2={wx(18)} y2={wy(6,3)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(14)} y1={wy(7,2)} x2={wx(18)} y2={wy(7,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />

        {/* Blush */}
        <circle cx={wx(3)+2} cy={wy(6)+2} r="6" fill={C.blush} opacity="0.3" />
        <circle cx={wx(14)+2} cy={wy(6)+2} r="6" fill={C.blush} opacity="0.3" />

        {/* Nose */}
        {row(7, 6, 2, C.nose)}

        {/* Eyes — slightly tired/squinting */}
        {isSleeping ? (
          <>
            {row(4, 5, 3, C.eye)}
            {row(10,5, 3, C.eye)}
          </>
        ) : isDead ? (
          <>
            {px(4,4,C.eye)}{px(6,4,C.eye)}{px(5,5,C.eye)}
            {px(4,6,C.eye)}{px(6,6,C.eye)}
            {px(10,4,C.eye)}{px(12,4,C.eye)}{px(11,5,C.eye)}
            {px(10,6,C.eye)}{px(12,6,C.eye)}
          </>
        ) : (
          <g className="cat-eye-group">
            {row(4, 4, 3, C.eye)}
            {row(4, 5, 3, C.eye)}
            {/* cover top row (elder squint) */}
            {row(4, 4, 3, furDk)}
            {px(4,5, C.pupilGreen)}
            {px(6,5, C.eyeShine)}
            {row(10,4, 3, C.eye)}
            {row(10,5, 3, C.eye)}
            {row(10,4, 3, furDk)}
            {px(10,5,C.pupilGreen)}
            {px(12,5,C.eyeShine)}
            {isHappy && (
              <>
                {row(4, 5, 3, fur)}
                {row(10,5, 3, fur)}
              </>
            )}
          </g>
        )}

        {/* Mouth */}
        {isHappy && (
          <>
            {px(6,8,C.mouth)}
            {row(7,9,3,C.mouth)}
            {px(10,8,C.mouth)}
          </>
        )}
        {isSad && (
          <>
            {px(6,9,C.mouth)}
            {row(7,8,3,C.mouth)}
            {px(10,9,C.mouth)}
            {px(4,7,C.tear)}
          </>
        )}
        {!isHappy && !isSad && !isSleeping && !isDead && row(6,8,5,C.mouth)}
        {isSleeping && (
          <>
            {row(6,8,5,C.mouth)}
            <text x={wx(15)} y={wy(3)} fontFamily="sans-serif" fontSize="10" fill={C.zzz} fontWeight="bold" className="cat-zzz-1">z</text>
            <text x={wx(15)+4} y={wy(1)+2} fontFamily="sans-serif" fontSize="8" fill={C.zzz} fontWeight="bold" className="cat-zzz-2">z</text>
            <text x={wx(16)} y={wy(0)} fontFamily="sans-serif" fontSize="6" fill={C.zzz} fontWeight="bold" className="cat-zzz-3">z</text>
          </>
        )}
        {isDead && (
          <>
            {px(6,9,C.mouth)}{row(7,8,3,C.mouth)}{px(10,9,C.mouth)}
            <circle cx="60" cy="4" r="12" stroke={C.halo} strokeWidth="3" fill="none" opacity="0.85" />
          </>
        )}
        {isSick && <>{px(14,3,C.tear)}{px(14,4,C.tear)}</>}
      </g>
    </svg>
  );
}
