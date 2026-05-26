import type { PetMood } from '@/types';

interface SpriteProps {
  mood?: PetMood;
  className?: string;
  style?: React.CSSProperties;
}

export function EggSprite({ mood = 'neutral', className, style }: SpriteProps) {
  const crackColor = mood === 'happy' ? '#C084FC' : mood === 'sad' ? '#9CA3AF' : '#E8D5FF';
  const bodyFill   = mood === 'sick'  ? '#D4EDDA' : '#E8D5FF';

  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label="Egg"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="112" rx="28" ry="7" fill="#C084FC" opacity="0.25" />

      {/* Egg body */}
      <ellipse cx="60" cy="62" rx="36" ry="44" fill={bodyFill} stroke="#C084FC" strokeWidth="3" />

      {/* Shine dots */}
      <circle cx="76" cy="36" r="6" fill="white" opacity="0.7" />
      <circle cx="68" cy="30" r="3" fill="white" opacity="0.5" />

      {/* Crack lines (happy = more visible) */}
      <rect x="56" y="68" width="3" height="10" rx="1" fill={crackColor} opacity="0.6" transform="rotate(-10 56 68)" />
      <rect x="60" y="72" width="3" height="7"  rx="1" fill={crackColor} opacity="0.6" transform="rotate(8 60 72)" />

      {/* Floating sparkles */}
      <rect x="22" y="18" width="7" height="7" rx="1" fill="#F9A8D4" opacity="0.9" transform="rotate(45 25 21)" />
      <rect x="85" y="28" width="6" height="6" rx="1" fill="#C084FC" opacity="0.8" transform="rotate(45 88 31)" />
      <rect x="48" y="8"  width="5" height="5" rx="1" fill="#FDE68A" opacity="0.9" transform="rotate(45 50 10)" />

      {/* Face based on mood */}
      {mood === 'happy' && (
        <>
          <circle cx="50" cy="58" r="4" fill="#3D2B3D" />
          <circle cx="70" cy="58" r="4" fill="#3D2B3D" />
          <circle cx="51.5" cy="56.5" r="1.5" fill="white" />
          <circle cx="71.5" cy="56.5" r="1.5" fill="white" />
          {/* Smile */}
          <rect x="52" y="67" width="4" height="3" rx="1" fill="#D4607A" />
          <rect x="56" y="69" width="8" height="3" rx="1" fill="#D4607A" />
          <rect x="64" y="67" width="4" height="3" rx="1" fill="#D4607A" />
        </>
      )}
      {(mood === 'neutral' || mood === 'sick') && (
        <>
          <circle cx="50" cy="58" r="4" fill="#3D2B3D" />
          <circle cx="70" cy="58" r="4" fill="#3D2B3D" />
          <circle cx="51.5" cy="56.5" r="1.5" fill="white" />
          <circle cx="71.5" cy="56.5" r="1.5" fill="white" />
          <rect x="53" y="67" width="14" height="3" rx="1.5" fill="#D4607A" />
        </>
      )}
      {mood === 'sad' && (
        <>
          <circle cx="50" cy="58" r="4" fill="#3D2B3D" />
          <circle cx="70" cy="58" r="4" fill="#3D2B3D" />
          {/* Sad arc (inverted) */}
          <rect x="52" y="69" width="4" height="3" rx="1" fill="#D4607A" />
          <rect x="56" y="67" width="8" height="3" rx="1" fill="#D4607A" />
          <rect x="64" y="69" width="4" height="3" rx="1" fill="#D4607A" />
        </>
      )}
      {mood === 'sleeping' && (
        <>
          {/* Closed eyes */}
          <rect x="45" y="57" width="12" height="3" rx="1.5" fill="#3D2B3D" />
          <rect x="63" y="57" width="12" height="3" rx="1.5" fill="#3D2B3D" />
          <rect x="53" y="67" width="14" height="3" rx="1.5" fill="#D4607A" />
          {/* ZZZ */}
          <text x="76" y="42" fontFamily="Nunito, sans-serif" fontSize="10" fill="#C084FC" fontWeight="bold">z</text>
          <text x="82" y="34" fontFamily="Nunito, sans-serif" fontSize="8"  fill="#C084FC" fontWeight="bold">z</text>
          <text x="87" y="27" fontFamily="Nunito, sans-serif" fontSize="6"  fill="#C084FC" fontWeight="bold">z</text>
        </>
      )}
    </svg>
  );
}
