import type { PetMood } from '@/types';
import { P, OX, OY, PALETTES, C, px, row, getSickPalette } from './catPixelUtils';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Child cat — 50/50 head/body ratio, short tail, 1 whisker per side,
 * darker brown-orange tabby, beginning to look like a proper cat.
 */
export function ChildSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const isSick     = mood === 'sick';
  const isSleeping = mood === 'sleeping';
  const isDead     = mood === 'dead';
  const isHappy    = mood === 'happy';
  const isSad      = mood === 'sad';

  const base = PALETTES.child;
  const pal = isDead ? PALETTES.dead
    : isSick ? getSickPalette(base)
    : base;
  const { fur, furDk, belly, earInner, stripe } = pal;

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
      aria-label={`Child cat, ${mood}`}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="113" rx="22" ry="5" fill={C.shadow} />

      {/* Short tail */}
      <g className="cat-tail">
        {row(12, 9,  2, fur)}
        {row(13,10,  2, furDk)}
        {row(12,11,  2, fur)}
        {row(11,12,  3, furDk)}
        {row(10,13,  2, fur)}
      </g>

      {/* Body */}
      <g className="cat-body">
        {row(3, 8,  10, fur)}
        {row(2, 9,  11, fur)}
        {row(2,10,  11, fur)}
        {row(2,11,  11, fur)}
        {row(3,12,  9,  fur)}

        {/* belly */}
        {row(5, 9,  5, belly)}
        {row(5,10,  5, belly)}
        {row(5,11,  5, belly)}
        {row(5,12,  4, belly)}

        {/* stripes */}
        {row(3, 9, 1, stripe)}
        {row(3,11, 1, stripe)}
        {px(11, 9, stripe)}
        {px(11,11, stripe)}
      </g>

      {/* Paws */}
      <g className="cat-paws">
        {row(3,13, 3, belly)}
        {row(8,13, 3, belly)}
        {px(4, 13, furDk)}
        {px(9, 13, furDk)}
      </g>

      {/* Head */}
      <g className="cat-head">

        {/* Left ear */}
        <g className="cat-ear-l">
          {px(3, 0, fur)}
          {row(2, 1, 3, fur)}
          {row(2, 2, 4, fur)}
          {px(3, 1, earInner)}
          {row(3, 2, 2, earInner)}
        </g>

        {/* Right ear */}
        <g className="cat-ear-r">
          {px(12,0, fur)}
          {row(11,1, 3, fur)}
          {row(10,2, 4, fur)}
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

        {/* One whisker per side */}
        <line x1={wx(1)} y1={wy(6,3)} x2={wx(-3)} y2={wy(6,1)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(6,3)} x2={wx(17)} y2={wy(6,1)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />

        {/* Blush */}
        <circle cx={wx(2)+3} cy={wy(6)+3} r="6" fill={C.blush} opacity="0.45" />
        <circle cx={wx(13)+3} cy={wy(6)+3} r="6" fill={C.blush} opacity="0.45" />

        {/* Nose */}
        {row(7, 6, 2, C.nose)}

        {/* Eyes */}
        {isSleeping ? (
          <>
            {row(4, 5, 3, C.eye)}
            {row(9, 5, 3, C.eye)}
          </>
        ) : isDead ? (
          <>
            {px(4,4,C.eye)}{px(6,4,C.eye)}{px(5,5,C.eye)}
            {px(4,6,C.eye)}{px(6,6,C.eye)}
            {px(9,4,C.eye)}{px(11,4,C.eye)}{px(10,5,C.eye)}
            {px(9,6,C.eye)}{px(11,6,C.eye)}
          </>
        ) : (
          <g className="cat-eye-group">
            {row(4, 4, 3, C.eye)}
            {row(4, 5, 3, C.eye)}
            {px(4,4, C.pupilGreen)}
            {px(6,4, C.eyeShine)}
            {row(9, 4, 3, C.eye)}
            {row(9, 5, 3, C.eye)}
            {px(9,4, C.pupilGreen)}
            {px(11,4,C.eyeShine)}
            {isHappy && (
              <>
                {row(4, 5, 3, fur)}
                {row(9, 5, 3, fur)}
              </>
            )}
          </g>
        )}

        {/* Mouth */}
        {isHappy && (
          <>
            {px(5,7,C.mouth)}
            {row(6,8,4,C.mouth)}
            {px(10,7,C.mouth)}
          </>
        )}
        {isSad && (
          <>
            {px(5,8,C.mouth)}
            {row(6,7,4,C.mouth)}
            {px(10,8,C.mouth)}
            {px(5,6,C.tear)}
          </>
        )}
        {!isHappy && !isSad && !isSleeping && !isDead && row(6,7,4,C.mouth)}
        {isSleeping && (
          <>
            {row(6,7,4,C.mouth)}
            <text x={wx(14)} y={wy(3)} fontFamily="sans-serif" fontSize="10" fill={C.zzz} fontWeight="bold" className="cat-zzz-1">z</text>
            <text x={wx(14)+4} y={wy(1)+2} fontFamily="sans-serif" fontSize="8" fill={C.zzz} fontWeight="bold" className="cat-zzz-2">z</text>
            <text x={wx(15)} y={wy(0)} fontFamily="sans-serif" fontSize="6" fill={C.zzz} fontWeight="bold" className="cat-zzz-3">z</text>
          </>
        )}
        {isDead && (
          <>
            {px(5,8,C.mouth)}{row(6,7,4,C.mouth)}{px(10,8,C.mouth)}
            <circle cx="60" cy="4" r="11" stroke={C.halo} strokeWidth="3" fill="none" opacity="0.85" />
          </>
        )}
        {isSick && <>{px(13,3,C.tear)}{px(13,4,C.tear)}</>}
      </g>
    </svg>
  );
}
