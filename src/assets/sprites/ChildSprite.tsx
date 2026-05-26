import type { PetMood } from '@/types';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function ChildSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const skinFill  = mood === 'sick' ? '#E8F5E9' : '#FFE4EF';
  const shirtFill = mood === 'sick' ? '#B2DFDB' : '#C8F7C5';
  const isDead    = mood === 'dead';
  const filter    = isDead ? 'grayscale(1) brightness(0.7)' : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter }}
      role="img"
      aria-label="Child pet"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="116" rx="22" ry="5" fill="#86EFAC" opacity="0.3" />

      {/* Left shoe */}
      <rect x="32" y="105" width="20" height="10" rx="4" fill="#5C3317" />
      {/* Right shoe */}
      <rect x="68" y="105" width="20" height="10" rx="4" fill="#5C3317" />

      {/* Left leg */}
      <rect x="36" y="84" width="16" height="28" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" />
      {/* Right leg */}
      <rect x="68" y="84" width="16" height="28" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" />

      {/* Body (shirt) */}
      <rect x="32" y="58" width="56" height="52" rx="14" fill={shirtFill} stroke="#86EFAC" strokeWidth="2.5" />

      {/* Collar */}
      <rect x="46" y="57" width="28" height="8" rx="4" fill="#86EFAC" />

      {/* Left arm */}
      <rect x="14" y="62" width="22" height="13" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" transform="rotate(10 25 68)" />
      {/* Right arm */}
      <rect x="84" y="62" width="22" height="13" rx="6" fill={skinFill} stroke="#FFB3C6" strokeWidth="1.5" transform="rotate(-10 95 68)" />

      {/* Head */}
      <circle cx="60" cy="34" r="28" fill={skinFill} stroke="#FFB3C6" strokeWidth="2.5" />

      {/* Hair tufts */}
      <rect x="44" y="6"  width="9" height="14" rx="4" fill="#C8A87A" />
      <rect x="55" y="4"  width="10" height="16" rx="5" fill="#C8A87A" />
      <rect x="67" y="6"  width="9" height="14" rx="4" fill="#C8A87A" />

      {/* Eyebrows */}
      <rect x="44" y="27" width="12" height="3"  rx="1.5" fill="#9B7653" transform="rotate(-8 50 28)" />
      <rect x="64" y="27" width="12" height="3"  rx="1.5" fill="#9B7653" transform="rotate(8 70 28)" />

      {/* Blush */}
      <circle cx="40" cy="40" r="7" fill="#FFB3C6" opacity="0.5" />
      <circle cx="80" cy="40" r="7" fill="#FFB3C6" opacity="0.5" />

      {/* Eyes */}
      {isDead ? (
        <>
          <rect x="44" y="30" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 50 31)" />
          <rect x="44" y="30" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 50 31)" />
          <rect x="64" y="30" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 70 31)" />
          <rect x="64" y="30" width="12" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 70 31)" />
        </>
      ) : mood === 'sleeping' ? (
        <>
          <rect x="43" y="33" width="14" height="4" rx="2" fill="#3D2B3D" />
          <rect x="63" y="33" width="14" height="4" rx="2" fill="#3D2B3D" />
        </>
      ) : (
        <>
          <circle cx="50" cy="36" r="7" fill="#3D2B3D" />
          <circle cx="70" cy="36" r="7" fill="#3D2B3D" />
          <circle cx="52" cy="34" r="2.5" fill="white" />
          <circle cx="72" cy="34" r="2.5" fill="white" />
        </>
      )}

      {/* Mouth */}
      {mood === 'happy' && (
        <>
          <rect x="50" y="47" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="55" y="50" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="65" y="47" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {(mood === 'neutral' || mood === 'sick') && (
        <rect x="51" y="48" width="18" height="4" rx="2" fill="#D4607A" />
      )}
      {(mood === 'sad' || mood === 'dead') && (
        <>
          <rect x="50" y="50" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="55" y="47" width="10" height="4" rx="2" fill="#D4607A" />
          <rect x="65" y="50" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {mood === 'sleeping' && (
        <>
          <rect x="51" y="48" width="18" height="4" rx="2" fill="#D4607A" />
          <text x="82" y="22" fontFamily="Nunito, sans-serif" fontSize="11" fill="#C084FC" fontWeight="bold">z</text>
          <text x="90" y="14" fontFamily="Nunito, sans-serif" fontSize="9"  fill="#C084FC" fontWeight="bold">z</text>
          <text x="96" y="7"  fontFamily="Nunito, sans-serif" fontSize="7"  fill="#C084FC" fontWeight="bold">z</text>
        </>
      )}

      {isDead && (
        <circle cx="60" cy="5" r="13" stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.8" />
      )}
    </svg>
  );
}
