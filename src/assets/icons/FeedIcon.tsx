interface IconProps { size?: number; color?: string; className?: string }
export function FeedIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Apple body */}
      <circle cx="12" cy="14" r="8" fill={color} />
      {/* Stem */}
      <rect x="11" y="4" width="3" height="5" rx="1.5" fill={color} />
      {/* Leaf */}
      <ellipse cx="15" cy="5.5" rx="4" ry="2.5" fill={color} opacity="0.75" transform="rotate(-30 15 5.5)" />
      {/* Shine */}
      <circle cx="9" cy="11" r="2" fill="white" opacity="0.5" />
    </svg>
  );
}
