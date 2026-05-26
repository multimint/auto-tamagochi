import type { PetMood } from '@/types';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function BabySprite({ mood = 'neutral', className, style }: SpriteProps) {
  const bodyFill = mood === 'sick' ? '#D4EDDA' : '#FFD6E7';
  const headFill = mood === 'sick' ? '#E8F5E9' : '#FFE4EF';
  const isDead   = mood === 'dead';
  const filter   = isDead ? 'grayscale(1) brightness(0.7)' : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter }}
      role="img"
      aria-label="Baby pet"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="115" rx="24" ry="5" fill="#FFB3C6" opacity="0.3" />

      {/* Body */}
      <ellipse cx="60" cy="82" rx="28" ry="26" fill={bodyFill} stroke="#FFB3C6" strokeWidth="2.5" />

      {/* Left arm */}
      <rect x="16" y="72" width="20" height="12" rx="6" fill={bodyFill} stroke="#FFB3C6" strokeWidth="2" transform="rotate(15 26 78)" />
      {/* Right arm */}
      <rect x="84" y="72" width="20" height="12" rx="6" fill={bodyFill} stroke="#FFB3C6" strokeWidth="2" transform="rotate(-15 94 78)" />

      {/* Left ear */}
      <circle cx="34" cy="36" r="13" fill={bodyFill} stroke="#FFB3C6" strokeWidth="2" />
      {/* Right ear */}
      <circle cx="86" cy="36" r="13" fill={bodyFill} stroke="#FFB3C6" strokeWidth="2" />

      {/* Head */}
      <circle cx="60" cy="42" r="30" fill={headFill} stroke="#FFB3C6" strokeWidth="2.5" />

      {/* Blush */}
      <circle cx="38" cy="50" r="9" fill="#FFB3C6" opacity="0.55" />
      <circle cx="82" cy="50" r="9" fill="#FFB3C6" opacity="0.55" />

      {/* Eyes */}
      {isDead ? (
        <>
          {/* X eyes for dead */}
          <rect x="44" y="35" width="10" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 49 37)" />
          <rect x="44" y="35" width="10" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 49 37)" />
          <rect x="66" y="35" width="10" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(45 71 37)" />
          <rect x="66" y="35" width="10" height="3" rx="1.5" fill="#3D2B3D" transform="rotate(-45 71 37)" />
        </>
      ) : mood === 'sleeping' ? (
        <>
          <rect x="43" y="38" width="14" height="4" rx="2" fill="#3D2B3D" />
          <rect x="63" y="38" width="14" height="4" rx="2" fill="#3D2B3D" />
        </>
      ) : (
        <>
          <circle cx="49" cy="40" r="6" fill="#3D2B3D" />
          <circle cx="71" cy="40" r="6" fill="#3D2B3D" />
          <circle cx="50.5" cy="38.5" r="2" fill="white" />
          <circle cx="72.5" cy="38.5" r="2" fill="white" />
        </>
      )}

      {/* Mouth */}
      {mood === 'happy' && (
        <>
          <rect x="51" y="52" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="56" y="55" width="8" height="4" rx="2" fill="#D4607A" />
          <rect x="64" y="52" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {(mood === 'neutral' || mood === 'sick') && (
        <rect x="52" y="53" width="16" height="4" rx="2" fill="#D4607A" />
      )}
      {(mood === 'sad' || mood === 'dead') && (
        <>
          <rect x="51" y="55" width="5" height="4" rx="2" fill="#D4607A" />
          <rect x="56" y="52" width="8" height="4" rx="2" fill="#D4607A" />
          <rect x="64" y="55" width="5" height="4" rx="2" fill="#D4607A" />
        </>
      )}
      {mood === 'sleeping' && (
        <>
          <rect x="52" y="53" width="16" height="4" rx="2" fill="#D4607A" />
          {/* ZZZ */}
          <text x="80" y="28" fontFamily="Nunito, sans-serif" fontSize="11" fill="#C084FC" fontWeight="bold">z</text>
          <text x="88" y="20" fontFamily="Nunito, sans-serif" fontSize="9"  fill="#C084FC" fontWeight="bold">z</text>
          <text x="94" y="13" fontFamily="Nunito, sans-serif" fontSize="7"  fill="#C084FC" fontWeight="bold">z</text>
        </>
      )}

      {/* Halo for dead */}
      {isDead && (
        <circle cx="60" cy="8" r="14" stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.8" />
      )}
    </svg>
  );
}
