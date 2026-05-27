import type { PetMood } from '@/types';
import { P, OX, OY, PALETTES, C, px, row } from './catPixelUtils';

interface SpriteProps {
  className?: string;
  style?: React.CSSProperties;
  mood?: PetMood;
}

/**
 * Dead cat — grayscale, X eyes, golden halo, slightly slumped pose.
 */
export function DeadSprite({ className, style }: SpriteProps) {
  const { fur, furDk, belly, earInner, stripe } = PALETTES.dead;

  const wx = (col: number) => OX + col * P;
  const wy = (r: number, off = 0) => OY + r * P + off;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      style={{ ...style, filter: 'grayscale(1) brightness(0.75)' }}
      role="img"
      aria-label="Cat has passed away"
    >
      {/* Halo */}
      <circle cx="60" cy="5" r="13" stroke={C.halo} strokeWidth="3" fill="none"
        style={{ filter: 'none', animation: 'halo-glow 2s ease-in-out infinite' }} />

      {/* Shadow */}
      <ellipse cx="60" cy="113" rx="26" ry="5" fill={C.shadow} />

      {/* Tail — limp, drooping */}
      <g className="cat-tail">
        {row(12, 10, 2, fur)}
        {row(11, 11, 3, furDk)}
        {row(10, 12, 3, fur)}
        {row(9,  13, 3, furDk)}
        {row(8,  14, 3, fur)}
      </g>

      {/* Body */}
      <g className="cat-body">
        {row(3, 9,  10, fur)}
        {row(2,10,  12, fur)}
        {row(2,11,  12, fur)}
        {row(2,12,  12, fur)}
        {row(3,13,  10, fur)}

        {/* belly */}
        {row(5,10, 6, belly)}
        {row(5,11, 6, belly)}
        {row(5,12, 6, belly)}

        {/* stripes */}
        {row(3,10, 2, stripe)}
        {px(12,10, stripe)}
        {row(3,12, 2, stripe)}
        {px(12,12, stripe)}
      </g>

      {/* Paws — slightly splayed */}
      <g className="cat-paws">
        {row(2,14, 3, belly)}
        {row(9,14, 4, belly)}
        {px(3,14, furDk)}
        {px(10,14,furDk)}
      </g>

      {/* Head */}
      <g className="cat-head">

        {/* Ears — drooping */}
        <g className="cat-ear-l">
          {px(3, 0, fur)}
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

        {/* Head fill */}
        {row(3, 2, 10, fur)}
        {row(2, 3, 12, fur)}
        {row(1, 4, 14, fur)}
        {row(1, 5, 14, fur)}
        {row(1, 6, 14, fur)}
        {row(1, 7, 14, fur)}
        {row(2, 8, 12, fur)}

        {/* Whiskers */}
        <line x1={wx(1)} y1={wy(5,3)} x2={wx(-3)} y2={wy(5,1)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(1)} y1={wy(6,3)} x2={wx(-3)} y2={wy(6,3)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(1)} y1={wy(7,2)} x2={wx(-3)} y2={wy(7,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(5,3)} x2={wx(17)} y2={wy(5,1)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(6,3)} x2={wx(17)} y2={wy(6,3)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={wx(13)} y1={wy(7,2)} x2={wx(17)} y2={wy(7,5)} stroke={C.whisker} strokeWidth="1.5" strokeLinecap="round" />

        {/* Nose */}
        {row(7, 6, 2, C.nose)}

        {/* X Eyes */}
        {/* left X */}
        {px(4,4,C.eye)}{px(6,4,C.eye)}{px(5,5,C.eye)}{px(4,6,C.eye)}{px(6,6,C.eye)}
        {/* right X */}
        {px(9,4,C.eye)}{px(11,4,C.eye)}{px(10,5,C.eye)}{px(9,6,C.eye)}{px(11,6,C.eye)}

        {/* Sad mouth */}
        {px(5,8,C.mouth)}
        {row(6,7,4,C.mouth)}
        {px(10,8,C.mouth)}
      </g>
    </svg>
  );
}
