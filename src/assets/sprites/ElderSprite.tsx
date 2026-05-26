import type { PetMood } from '@/types';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function ElderSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const skinFill   = mood === 'sick' ? '#E8F5E9' : '#F5F0E8';
  const outfitFill = mood === 'sick' ? '#B2DFDB' : '#D4EDDA';
  const isDead     = mood === 'dead';
  const filter     = isDead ? 'grayscale(1) brightness(0.7)' : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter }}
      role="img"
      aria-label="Elder pet"
    >
      {/* Shadow */}
      <ellipse cx="62" cy="117" rx="22" ry="4" fill="#86EFAC" opacity="0.25" />

      {/* Walking stick */}
      <rect x="94" y="60" width="5" height="55" rx="2.5" fill="#A0522D" />
      <circle cx="96" cy="59" r="6" fill="#8B4513" />

      {/* Shoes */}
      <rect x="28" y="108" width="24" height="9" rx="4" fill="#3D2B3D" />
      <rect x="64" y="108" width="24" height="9" rx="4" fill="#3D2B3D" />

      {/* Legs (shorter, slight hunch) */}
      <rect x="32" y="82" width="17" height="30" rx="6" fill={skinFill} stroke="#C8A87A" strokeWidth="1.5" />
      <rect x="67" y="82" width="17" height="30" rx="6" fill={skinFill} stroke="#C8A87A" strokeWidth="1.5" />

      {/* Body (hunched — shifted up/right slightly) */}
      <rect x="27" y="52" width="62" height="52" rx="14" fill={outfitFill} stroke="#86EFAC" strokeWidth="2.5" transform="rotate(3 58 78)" />

      {/* Arms */}
      <rect x="8"  y="62" width="22" height="13" rx="6" fill={skinFill} stroke="#C8A87A" strokeWidth="1.5" transform="rotate(20 19 68)" />
      <rect x="86" y="60" width="22" height="13" rx="6" fill={skinFill} stroke="#C8A87A" strokeWidth="1.5" transform="rotate(-20 97 66)" />

      {/* Head (slightly tilted) */}
      <circle cx="62" cy="30" r="26" fill={skinFill} stroke="#C8A87A" strokeWidth="2.5" />

      {/* Fluffy white hair */}
      <rect x="36" y="7"  width="10" height="10" rx="5" fill="#EEEEEE" />
      <rect x="44" y="4"  width="11" height="11" rx="5" fill="#EEEEEE" />
      <rect x="54" y="3"  width="11" height="11" rx="5" fill="#EEEEEE" />
      <rect x="64" y="4"  width="11" height="11" rx="5" fill="#EEEEEE" />
      <rect x="74" y="7"  width="10" height="10" rx="5" fill="#EEEEEE" />
      <rect x="36" y="15" width="48" height="10" rx="5" fill="#EEEEEE" />

      {/* Wrinkle lines */}
      <rect x="40" y="38" width="9" height="2"  rx="1" fill="#C8A87A" opacity="0.7" />
      <rect x="73" y="38" width="9" height="2"  rx="1" fill="#C8A87A" opacity="0.7" />
      <rect x="53" y="48" width="14" height="2" rx="1" fill="#C8A87A" opacity="0.5" />

      {/* Eyes */}
      {isDead ? (
        <>
          <rect x="44" y="28" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 50 29)" />
          <rect x="44" y="28" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 50 29)" />
          <rect x="66" y="28" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 72 29)" />
          <rect x="66" y="28" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 72 29)" />
        </>
      ) : mood === 'sleeping' ? (
        <>
          <rect x="44" y="31" width="14" height="4" rx="2" fill="#3D2B3D" />
          <rect x="64" y="31" width="14" height="4" rx="2" fill="#3D2B3D" />
        </>
      ) : (
        <>
          <circle cx="51" cy="33" r="6" fill="#3D2B3D" />
          <circle cx="73" cy="33" r="6" fill="#3D2B3D" />
          <circle cx="52.5" cy="31.5" r="2" fill="white" />
          <circle cx="74.5" cy="31.5" r="2" fill="white" />
        </>
      )}

      {/* Blush */}
      <circle cx="40" cy="40" r="6" fill="#FFB3C6" opacity="0.4" />
      <circle cx="82" cy="40" r="6" fill="#FFB3C6" opacity="0.4" />

      {/* Kind smile */}
      {(mood === 'happy' || mood === 'neutral') && (
        <>
          <rect x="51" y="45" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="56" y="48" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="66" y="45" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {(mood === 'sad' || mood === 'sick' || mood === 'dead') && (
        <>
          <rect x="51" y="48" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="56" y="45" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="66" y="48" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {mood === 'sleeping' && (
        <>
          <rect x="52" y="46" width="18" height="4" rx="2" fill="#D4607A" />
          <text x="84" y="20" fontFamily="Nunito, sans-serif" fontSize="11" fill="#C084FC" fontWeight="bold">z</text>
          <text x="92" y="12" fontFamily="Nunito, sans-serif" fontSize="9"  fill="#C084FC" fontWeight="bold">z</text>
        </>
      )}

      {isDead && (
        <circle cx="62" cy="5" r="12" stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.8" />
      )}
    </svg>
  );
}
