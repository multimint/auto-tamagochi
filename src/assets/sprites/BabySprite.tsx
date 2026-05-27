import type { PetMood } from '@/types';
import { P, PALETTES, C, getSickPalette } from './catPixelUtils';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Baby kitten — huge head, tiny body, stubby tail, no whiskers yet.
 * Uses a slightly tighter grid so the kitten looks small and cute.
 */
export function BabySprite({ mood = 'neutral', className, style }: SpriteProps) {
  const isSick     = mood === 'sick';
  const isSleeping = mood === 'sleeping';
  const isDead     = mood === 'dead';
  const isHappy    = mood === 'happy';
  const isSad      = mood === 'sad';

  const base = PALETTES.baby;
  const pal = isDead ? PALETTES.dead
    : isSick ? getSickPalette(base)
    : base;
  const { fur, furDk, belly, earInner } = pal;

  // Baby: smaller pixel grid — offset slightly for cuter, more centered look
  const bP = P;     // same pixel size
  const bOX = 18;   // shift inward (baby is smaller/rounder)
  const bOY = 12;

  function brow(c: number, r: number, len: number, fill: string) {
    return <rect x={bOX + c * bP} y={bOY + r * bP} width={bP * len} height={bP} fill={fill} />;
  }
  function bpx(c: number, r: number, fill: string) {
    return <rect x={bOX + c * bP} y={bOY + r * bP} width={bP} height={bP} fill={fill} />;
  }

  const wx = (col: number) => bOX + col * bP;
  const wy = (r: number, off = 0) => bOY + r * bP + off;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role="img"
      aria-label={`Baby kitten, ${mood}`}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="20" ry="4" fill={C.shadow} />

      {/* Stubby tail */}
      <g className="cat-tail">
        {brow(11, 10, 2, fur)}
        {brow(12, 11, 2, furDk)}
        {brow(11, 12, 2, fur)}
      </g>

      {/* Tiny body */}
      <g className="cat-body">
        {brow(2, 9,  9, fur)}
        {brow(1, 10, 11, fur)}
        {brow(1, 11, 11, fur)}
        {brow(2, 12, 9, fur)}
        {/* belly */}
        {brow(4, 10, 5, belly)}
        {brow(4, 11, 5, belly)}
        {brow(4, 12, 4, belly)}
      </g>

      {/* Little paws */}
      <g className="cat-paws">
        {brow(2, 13, 3, belly)}
        {brow(8, 13, 3, belly)}
      </g>

      {/* Big head (baby has huge head) */}
      <g className="cat-head">

        {/* Ears - small and round */}
        <g className="cat-ear-l">
          {bpx(2, 0, fur)}
          {brow(1, 1, 3, fur)}
          {brow(1, 2, 3, fur)}
          {bpx(2, 1, earInner)}
          {bpx(2, 2, earInner)}
        </g>
        <g className="cat-ear-r">
          {bpx(10,0, fur)}
          {brow(9, 1, 3, fur)}
          {brow(9, 2, 3, fur)}
          {bpx(10,1, earInner)}
          {bpx(10,2, earInner)}
        </g>

        {/* Big round head */}
        {brow(2, 2, 9,  fur)}
        {brow(1, 3, 11, fur)}
        {brow(0, 4, 13, fur)}
        {brow(0, 5, 13, fur)}
        {brow(0, 6, 13, fur)}
        {brow(0, 7, 13, fur)}
        {brow(1, 8, 11, fur)}
        {brow(2, 9, 9,  fur)}

        {/* Blush - very prominent on baby */}
        <circle cx={wx(1)+4} cy={wy(6)+2} r="8" fill={C.blush} opacity="0.55" />
        <circle cx={wx(11)+2} cy={wy(6)+2} r="8" fill={C.blush} opacity="0.55" />

        {/* Nose */}
        {brow(5, 6, 2, C.nose)}
        {bpx(6, 7, C.nose)}

        {/* Eyes — extra big for baby */}
        {isSleeping ? (
          <>
            {brow(2, 5, 3, C.eye)}
            {brow(8, 5, 3, C.eye)}
          </>
        ) : isDead ? (
          <>
            {bpx(2, 4, C.eye)} {bpx(4, 4, C.eye)} {bpx(3, 5, C.eye)}
            {bpx(2, 6, C.eye)} {bpx(4, 6, C.eye)}
            {bpx(8, 4, C.eye)} {bpx(10,4, C.eye)} {bpx(9, 5, C.eye)}
            {bpx(8, 6, C.eye)} {bpx(10,6, C.eye)}
          </>
        ) : (
          <g className="cat-eye-group">
            {brow(2, 4, 3, C.eye)}
            {brow(2, 5, 3, C.eye)}
            {brow(2, 6, 3, C.eye)}
            {bpx(2, 4, C.pupilGreen)}
            {bpx(4, 4, C.eyeShine)}
            {brow(8, 4, 3, C.eye)}
            {brow(8, 5, 3, C.eye)}
            {brow(8, 6, 3, C.eye)}
            {bpx(8, 4, C.pupilGreen)}
            {bpx(10,4, C.eyeShine)}
            {isHappy && (
              <>
                {brow(2, 5, 3, fur)}
                {brow(2, 6, 3, fur)}
                {brow(8, 5, 3, fur)}
                {brow(8, 6, 3, fur)}
              </>
            )}
          </g>
        )}

        {/* Mouth */}
        {isHappy && (
          <>
            {bpx(3, 8, C.mouth)}
            {brow(4, 9, 5, C.mouth)}
            {bpx(9, 8, C.mouth)}
          </>
        )}
        {isSad && (
          <>
            {bpx(3, 9, C.mouth)}
            {brow(4, 8, 5, C.mouth)}
            {bpx(9, 9, C.mouth)}
            {bpx(2, 7, C.tear)}
          </>
        )}
        {!isHappy && !isSad && !isSleeping && !isDead && (
          brow(4, 8, 5, C.mouth)
        )}
        {isSleeping && (
          <>
            {brow(4, 8, 5, C.mouth)}
            <text x={wx(12)} y={wy(3)} fontFamily="sans-serif" fontSize="9"  fill={C.zzz} fontWeight="bold" className="cat-zzz-1">z</text>
            <text x={wx(13)} y={wy(1)} fontFamily="sans-serif" fontSize="7"  fill={C.zzz} fontWeight="bold" className="cat-zzz-2">z</text>
          </>
        )}
        {isDead && (
          <>
            {bpx(4, 9, C.mouth)}
            {brow(5, 8, 3, C.mouth)}
            {bpx(8, 9, C.mouth)}
            <circle cx="60" cy="8" r="10" stroke={C.halo} strokeWidth="2.5" fill="none" opacity="0.85" />
          </>
        )}

        {isSick && (
          <>
            {bpx(11, 3, C.tear)}
            {bpx(11, 4, C.tear)}
          </>
        )}
      </g>
    </svg>
  );
}
