import type { PetMood } from '@/types';
import { P, OX, OY, PALETTES, C, px, row } from './catPixelUtils';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function EggSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const pal = PALETTES.egg;
  const isSick = mood === 'sick';
  const shell    = isSick ? '#C8EED8' : pal.shell;
  const shellDk  = isSick ? '#8EC8A8' : pal.shellDk;
  const earTip   = isSick ? '#8EC8A8' : pal.earTip;
  const earInner = isSick ? '#A8D8C0' : pal.earInner;
  const crack    = pal.crack;

  const isHappy    = mood === 'happy';
  const isSad      = mood === 'sad';
  const isSleeping = mood === 'sleeping';

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
      aria-label="Cat egg"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="113" rx="24" ry="5" fill={C.shadow} />

      {/* Floating sparkles around egg */}
      {px(1,  2, pal.spot)}
      {px(14, 3, shellDk)}
      {px(0,  7, pal.spot)}
      {px(15, 5, shellDk)}

      {/* ── Cat ears peeking out ── */}
      <g className="cat-ear-l">
        {px(3, 0, earTip)}
        {row(2, 1, 3, earTip)}
        {row(2, 2, 3, earTip)}
        {px(3, 1, earInner)}
        {px(3, 2, earInner)}
      </g>
      <g className="cat-ear-r">
        {px(12,0, earTip)}
        {row(11,1, 3, earTip)}
        {row(11,2, 3, earTip)}
        {px(12,1, earInner)}
        {px(12,2, earInner)}
      </g>

      {/* ── Egg body ── */}
      <g className="cat-body">
        {row(4, 2,  8, shell)}
        {row(3, 3,  10, shell)}
        {row(2, 4,  12, shell)}
        {row(1, 5,  14, shell)}
        {row(1, 6,  14, shell)}
        {row(1, 7,  14, shell)}
        {row(1, 8,  14, shell)}
        {row(1, 9,  14, shell)}
        {row(1, 10, 14, shell)}
        {row(2, 11, 12, shell)}
        {row(3, 12, 10, shell)}
        {row(4, 13, 8,  shell)}
        {row(5, 14, 6,  shell)}
        {row(6, 15, 4,  shell)}

        {/* Egg shine (top-right) */}
        {row(11, 3, 2, '#FFFFFF')}
        {px(12, 4, '#FFFFFF')}

        {/* Shell cracks / paw print */}
        {px(6,  8, crack)}
        {px(9,  8, crack)}
        {px(7,  9, crack)}
        {px(8,  9, crack)}
        {px(7, 10, crack)}
        {px(8, 10, crack)}
        {px(6, 11, crack)}
        {px(9, 11, crack)}
      </g>

      {/* ── Face ── */}
      <g className="cat-head">
        {/* Nose */}
        {row(7, 7, 2, C.nose)}

        {/* Eyes */}
        {isSleeping ? (
          <>
            {row(4, 6, 3, C.eye)}
            {row(9, 6, 3, C.eye)}
          </>
        ) : (
          <g className="cat-eye-group">
            {row(4, 5, 3, C.eye)}
            {row(4, 6, 3, C.eye)}
            {px(4, 5, C.pupilBlue)}
            {px(6, 5, C.eyeShine)}
            {row(9, 5, 3, C.eye)}
            {row(9, 6, 3, C.eye)}
            {px(9, 5, C.pupilBlue)}
            {px(11,5, C.eyeShine)}
            {isHappy && (
              <>
                {row(4, 6, 3, shell)}
                {row(9, 6, 3, shell)}
              </>
            )}
          </g>
        )}

        {/* Mouth */}
        {isHappy && (
          <>
            {px(5, 8, C.mouth)}
            {row(6, 9, 4, C.mouth)}
            {px(10,8, C.mouth)}
          </>
        )}
        {isSad && (
          <>
            {px(5, 9, C.mouth)}
            {row(6, 8, 4, C.mouth)}
            {px(10,9, C.mouth)}
          </>
        )}
        {!isHappy && !isSad && !isSleeping && (
          row(6, 8, 4, C.mouth)
        )}
        {isSleeping && (
          <>
            {row(6, 8, 4, C.mouth)}
            <text x={wx(14)} y={wy(4)} fontFamily="sans-serif" fontSize="9"  fill={C.zzz} fontWeight="bold" className="cat-zzz-1">z</text>
            <text x={wx(14)+4} y={wy(2)+2} fontFamily="sans-serif" fontSize="7" fill={C.zzz} fontWeight="bold" className="cat-zzz-2">z</text>
          </>
        )}
      </g>
    </svg>
  );
}
