import type { PetMood } from '@/types';
import { P, OX, OY, PALETTES, C, px, row, getSickPalette } from './catPixelUtils';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Teen cat — gray tuxedo, longer/leaner proportions,
 * medium curved tail, 2 whiskers/side, slight attitude lean.
 */
export function TeenSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const isSick     = mood === 'sick';
  const isSleeping = mood === 'sleeping';
  const isDead     = mood === 'dead';
  const isHappy    = mood === 'happy';
  const isSad      = mood === 'sad';

  const base = PALETTES.teen;
  const pal = isDead ? PALETTES.dead
    : isSick ? getSickPalette(base)
    : base;
  const { fur, furDk, belly, earInner, stripe } = pal;
  const tuxedo = 'tuxedo' in pal ? (pal as typeof PALETTES.teen).tuxedo : '#FFFFFF';

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
      aria-label={`Teen cat, ${mood}`}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="113" rx="24" ry="5" fill={C.shadow} />

      {/* Medium curved tail */}
      <g className="cat-tail">
        {row(13, 8,  2, fur)}
        {row(14, 9,  2, furDk)}
        {row(14,10,  2, fur)}
        {row(13,11,  2, furDk)}
        {row(12,12,  3, fur)}
        {row(11,13,  3, furDk)}
        {row(10,14,  3, fur)}
        {row(9, 15,  2, furDk)}
      </g>

      {/* Taller/leaner body */}
      <g className="cat-body">
        {row(4,  7, 8,  fur)}
        {row(3,  8, 10, fur)}
        {row(3,  9, 10, fur)}
        {row(3, 10, 10, fur)}
        {row(3, 11, 10, fur)}
        {row(4, 12, 8,  fur)}

        {/* tuxedo belly — white patch */}
        {row(5,  8, 6, tuxedo)}
        {row(5,  9, 6, tuxedo)}
        {row(5, 10, 6, tuxedo)}
        {row(5, 11, 5, tuxedo)}

        {/* stripes on sides */}
        {row(3, 8, 1, stripe)}
        {px(12, 8, stripe)}
        {row(3,10, 1, stripe)}
        {px(12,10, stripe)}
      </g>

      {/* Paws */}
      <g className="cat-paws">
        {row(3,13, 3, tuxedo)}
        {row(8,13, 3, tuxedo)}
        {px(4,13, furDk)}
        {px(9,13, furDk)}
      </g>

      {/* Head */}
      <g className="cat-head">

        {/* Ears — slightly taller for teen */}
        <g className="cat-ear-l">
          {px(3, 0, fur)}
          {px(2, 1, fur)}
          {row(2, 1, 3, fur)}
          {row(1, 2, 4, fur)}
          {px(3, 1, earInner)}
          {row(3, 2, 2, earInner)}
        </g>
        <g className="cat-ear-r">
          {px(12,0, fur)}
          {row(11,1, 3, fur)}
          {row(11,2, 4, fur)}
          {px(12,1, earInner)}
          {row(11,2, 2, earInner)}
        </g>

        {/* Head — slightly narrower/taller */}
        {row(3, 2, 10, fur)}
        {row(2, 3, 12, fur)}
        {row(1, 4, 14, fur)}
        {row(1, 5, 14, fur)}
        {row(1, 6, 14, fur)}
        {row(2, 7, 12, fur)}
        {row(3, 8, 10, fur)}  {/* overlaps body top */}

        {/* White muzzle patch */}
        {row(5, 5, 6, belly)}
        {row(5, 6, 6, belly)}
        {row(5, 7, 5, belly)}

        {/* 2 whiskers per side */}
        <line x1={wx(1)} y1={wy(5,2)} x2={wx(-3)} y2={wy(5,0)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(1)} y1={wy(6,3)} x2={wx(-3)} y2={wy(6,4)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(5,2)} x2={wx(17)} y2={wy(5,0)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(6,3)} x2={wx(17)} y2={wy(6,4)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />

        {/* Blush */}
        <circle cx={wx(2)+2} cy={wy(6)+2} r="5" fill={C.blush} opacity="0.35" />
        <circle cx={wx(13)+4} cy={wy(6)+2} r="5" fill={C.blush} opacity="0.35" />

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
            {px(4,4, C.pupilBlue)}
            {px(6,4, C.eyeShine)}
            {row(9, 4, 3, C.eye)}
            {row(9, 5, 3, C.eye)}
            {px(9,4, C.pupilBlue)}
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
            {px(5,7,C.tear)}
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
            <circle cx="60" cy="4" r="12" stroke={C.halo} strokeWidth="3" fill="none" opacity="0.85" />
          </>
        )}
        {isSick && <>{px(13,3,C.tear)}{px(13,4,C.tear)}</>}
      </g>
    </svg>
  );
}
