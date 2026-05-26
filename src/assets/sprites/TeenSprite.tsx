import type { PetMood } from '@/types';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function TeenSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const skinFill   = mood === 'sick' ? '#E8F5E9' : '#FFE4EF';
  const outfitFill = mood === 'sick' ? '#B3D9F5' : '#A5D8FF';
  const isDead     = mood === 'dead';
  const filter     = isDead ? 'grayscale(1) brightness(0.7)' : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter }}
      role="img"
      aria-label="Teen pet"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="117" rx="22" ry="4" fill="#60B4E8" opacity="0.3" />

      {/* Shoes */}
      <rect x="30" y="107" width="22" height="10" rx="4" fill="#3D2B3D" />
      <rect x="68" y="107" width="22" height="10" rx="4" fill="#3D2B3D" />

      {/* Legs */}
      <rect x="34" y="82" width="16" height="32" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" />
      <rect x="70" y="82" width="16" height="32" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" />

      {/* Body */}
      <rect x="30" y="54" width="60" height="52" rx="12" fill={outfitFill} stroke="#60B4E8" strokeWidth="2.5" />

      {/* Left arm raised */}
      <rect x="10" y="40" width="23" height="13" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" transform="rotate(-45 21 46)" />
      {/* Right arm down */}
      <rect x="87" y="64" width="22" height="13" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" transform="rotate(10 98 70)" />

      {/* Head */}
      <circle cx="60" cy="30" r="26" fill={skinFill} stroke="#FFB3C6" strokeWidth="2.5" />

      {/* Headphone band */}
      <rect x="34" y="16" width="52" height="7" rx="7" fill="#3D2B3D" />
      {/* Left cup */}
      <rect x="28" y="22" width="12" height="18" rx="5" fill="#3D2B3D" />
      {/* Right cup */}
      <rect x="80" y="22" width="12" height="18" rx="5" fill="#3D2B3D" />

      {/* Spiky hair */}
      <rect x="38" y="4"  width="8"  height="16" rx="3" fill="#5C3317" transform="rotate(-15 42 12)" />
      <rect x="46" y="2"  width="9"  height="18" rx="3" fill="#5C3317" transform="rotate(-5 50 11)" />
      <rect x="56" y="1"  width="9"  height="18" rx="3" fill="#5C3317" />
      <rect x="66" y="2"  width="9"  height="18" rx="3" fill="#5C3317" transform="rotate(5 70 11)" />
      <rect x="74" y="4"  width="8"  height="16" rx="3" fill="#5C3317" transform="rotate(15 78 12)" />

      {/* Eyes — half-lidded */}
      {isDead ? (
        <>
          <rect x="44" y="26" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 50 27)" />
          <rect x="44" y="26" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 50 27)" />
          <rect x="64" y="26" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 70 27)" />
          <rect x="64" y="26" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 70 27)" />
        </>
      ) : mood === 'sleeping' ? (
        <>
          <rect x="43" y="30" width="14" height="4" rx="2" fill="#3D2B3D" />
          <rect x="63" y="30" width="14" height="4" rx="2" fill="#3D2B3D" />
        </>
      ) : (
        <>
          {/* Full eye with top half-lid */}
          <circle cx="50" cy="33" r="7" fill="#3D2B3D" />
          <circle cx="70" cy="33" r="7" fill="#3D2B3D" />
          <circle cx="52" cy="31" r="2.5" fill="white" />
          <circle cx="72" cy="31" r="2.5" fill="white" />
          {/* Lid overlay */}
          <rect x="43" y="26" width="14" height="7" rx="1" fill={skinFill} opacity="0.65" />
          <rect x="63" y="26" width="14" height="7" rx="1" fill={skinFill} opacity="0.65" />
        </>
      )}

      {/* Mouth */}
      {mood === 'happy' && (
        <>
          <rect x="50" y="43" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="55" y="46" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="65" y="43" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {(mood === 'neutral' || mood === 'sick') && (
        <rect x="51" y="43" width="18" height="3" rx="1.5" fill="#D4607A" />
      )}
      {(mood === 'sad' || mood === 'dead') && (
        <>
          <rect x="50" y="46" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="55" y="43" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="65" y="46" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {mood === 'sleeping' && (
        <>
          <rect x="51" y="43" width="18" height="3" rx="1.5" fill="#D4607A" />
          <text x="84" y="18" fontFamily="Nunito, sans-serif" fontSize="11" fill="#C084FC" fontWeight="bold">z</text>
          <text x="92" y="10" fontFamily="Nunito, sans-serif" fontSize="9"  fill="#C084FC" fontWeight="bold">z</text>
        </>
      )}

      {isDead && (
        <circle cx="60" cy="5" r="13" stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.8" />
      )}
    </svg>
  );
}
