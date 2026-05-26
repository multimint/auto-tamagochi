import type { PetMood } from '@/types';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function AdultSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const skinFill   = mood === 'sick' ? '#E8F5E9' : '#FFE4EF';
  const outfitFill = mood === 'sick' ? '#C5B5D9' : '#C3B1E1';
  const isDead     = mood === 'dead';
  const filter     = isDead ? 'grayscale(1) brightness(0.7)' : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter }}
      role="img"
      aria-label="Adult pet"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="117" rx="22" ry="4" fill="#A78FCC" opacity="0.3" />

      {/* Shoes */}
      <rect x="29" y="107" width="24" height="10" rx="4" fill="#3D2B3D" />
      <rect x="67" y="107" width="24" height="10" rx="4" fill="#3D2B3D" />

      {/* Legs */}
      <rect x="33" y="80" width="18" height="34" rx="7" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" />
      <rect x="69" y="80" width="18" height="34" rx="7" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" />

      {/* Body */}
      <rect x="28" y="50" width="64" height="54" rx="14" fill={outfitFill} stroke="#A78FCC" strokeWidth="2.5" />

      {/* Badge on chest */}
      <rect x="52" y="68" width="16" height="16" rx="5" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5" />
      <rect x="58" y="70" width="4" height="12" rx="1" fill="#B8860B" />
      <rect x="54" y="74" width="12" height="4" rx="1" fill="#B8860B" />

      {/* Arms at sides */}
      <rect x="10" y="58" width="21" height="14" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" transform="rotate(5 20 65)" />
      <rect x="89" y="58" width="21" height="14" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" transform="rotate(-5 100 65)" />

      {/* Head */}
      <circle cx="60" cy="30" r="27" fill={skinFill} stroke="#FFB3C6" strokeWidth="2.5" />

      {/* Hair (short) */}
      <rect x="33" y="6"  width="54" height="14" rx="10" fill="#C8A87A" />
      <rect x="35" y="14" width="50" height="10" rx="5"  fill="#C8A87A" />

      {/* Eyebrows */}
      <rect x="43" y="26" width="13" height="3" rx="1.5" fill="#9B7653" />
      <rect x="64" y="26" width="13" height="3" rx="1.5" fill="#9B7653" />

      {/* Eyes */}
      {isDead ? (
        <>
          <rect x="43" y="28" width="13" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 49 29)" />
          <rect x="43" y="28" width="13" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 49 29)" />
          <rect x="64" y="28" width="13" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 70 29)" />
          <rect x="64" y="28" width="13" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 70 29)" />
        </>
      ) : mood === 'sleeping' ? (
        <>
          <rect x="43" y="32" width="14" height="4" rx="2" fill="#3D2B3D" />
          <rect x="63" y="32" width="14" height="4" rx="2" fill="#3D2B3D" />
        </>
      ) : (
        <>
          <circle cx="50" cy="35" r="7" fill="#3D2B3D" />
          <circle cx="70" cy="35" r="7" fill="#3D2B3D" />
          <circle cx="52" cy="33" r="2.5" fill="white" />
          <circle cx="72" cy="33" r="2.5" fill="white" />
        </>
      )}

      {/* Blush */}
      <circle cx="39" cy="42" r="6" fill="#FFB3C6" opacity="0.4" />
      <circle cx="81" cy="42" r="6" fill="#FFB3C6" opacity="0.4" />

      {/* Mouth */}
      {mood === 'happy' && (
        <>
          <rect x="50" y="46" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="55" y="49" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="65" y="46" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {(mood === 'neutral' || mood === 'sick') && (
        <rect x="51" y="46" width="18" height="4" rx="2" fill="#D4607A" />
      )}
      {(mood === 'sad' || mood === 'dead') && (
        <>
          <rect x="50" y="49" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="55" y="46" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="65" y="49" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {mood === 'sleeping' && (
        <>
          <rect x="51" y="46" width="18" height="4" rx="2" fill="#D4607A" />
          <text x="84" y="20" fontFamily="Nunito, sans-serif" fontSize="11" fill="#C084FC" fontWeight="bold">z</text>
          <text x="92" y="12" fontFamily="Nunito, sans-serif" fontSize="9"  fill="#C084FC" fontWeight="bold">z</text>
        </>
      )}

      {isDead && (
        <circle cx="60" cy="4" r="12" stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.8" />
      )}
    </svg>
  );
}
