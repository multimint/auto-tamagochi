interface SpriteProps {
  className?: string;
  style?: React.CSSProperties;
}

export function DeadSprite({ className, style }: SpriteProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter: 'grayscale(1) brightness(0.65)', opacity: 0.75 }}
      role="img"
      aria-label="Deceased pet"
    >
      {/* Halo */}
      <circle cx="60" cy="8" r="15" stroke="#FFD700" strokeWidth="3" fill="none" opacity="0.85" />

      {/* Shadow */}
      <ellipse cx="63" cy="117" rx="22" ry="4" fill="#888" opacity="0.2" />

      {/* Shoes */}
      <rect x="28" y="107" width="24" height="9" rx="4" fill="#555" />
      <rect x="68" y="107" width="24" height="9" rx="4" fill="#555" />

      {/* Legs */}
      <rect x="32" y="80" width="18" height="32" rx="7" fill="#C8C8C8" stroke="#999" strokeWidth="1.5" />
      <rect x="70" y="80" width="18" height="32" rx="7" fill="#C8C8C8" stroke="#999" strokeWidth="1.5" />

      {/* Body (tilted) */}
      <rect x="28" y="50" width="64" height="52" rx="14" fill="#BBBBBB" stroke="#999" strokeWidth="2.5" transform="rotate(-6 60 76)" />

      {/* Arms */}
      <rect x="10" y="60" width="22" height="13" rx="6" fill="#C8C8C8" stroke="#999" strokeWidth="1.5" transform="rotate(8 21 66)" />
      <rect x="88" y="60" width="22" height="13" rx="6" fill="#C8C8C8" stroke="#999" strokeWidth="1.5" transform="rotate(-8 99 66)" />

      {/* Head (tilted) */}
      <circle cx="60" cy="30" r="27" fill="#D0D0D0" stroke="#999" strokeWidth="2.5" />

      {/* Hair */}
      <rect x="33" y="6" width="54" height="14" rx="10" fill="#AAAAAA" />

      {/* X eyes */}
      <rect x="42" y="26" width="14" height="3.5" rx="1.5" fill="#555" transform="rotate(45 49 27.75)" />
      <rect x="42" y="26" width="14" height="3.5" rx="1.5" fill="#555" transform="rotate(-45 49 27.75)" />
      <rect x="64" y="26" width="14" height="3.5" rx="1.5" fill="#555" transform="rotate(45 71 27.75)" />
      <rect x="64" y="26" width="14" height="3.5" rx="1.5" fill="#555" transform="rotate(-45 71 27.75)" />

      {/* Frown */}
      <rect x="50" y="46" width="5" height="4" rx="2" fill="#888" />
      <rect x="55" y="43" width="10" height="4" rx="2" fill="#888" />
      <rect x="65" y="46" width="5" height="4" rx="2" fill="#888" />

      {/* Floating ghost sparkles */}
      <rect x="18" y="30" width="6" height="6" rx="1" fill="#DDD" opacity="0.5" transform="rotate(45 21 33)" />
      <rect x="94" y="42" width="5" height="5" rx="1" fill="#DDD" opacity="0.5" transform="rotate(45 96 44)" />
      <rect x="82" y="18" width="5" height="5" rx="1" fill="#DDD" opacity="0.4" transform="rotate(45 84 20)" />
    </svg>
  );
}
