interface IconProps { size?: number; color?: string; className?: string }
export function HungerIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Fork */}
      <rect x="4" y="2" width="2" height="10" rx="1" fill={color} />
      <rect x="3" y="2" width="1.5" height="5" rx="0.5" fill={color} />
      <rect x="5.5" y="2" width="1.5" height="5" rx="0.5" fill={color} />
      <rect x="4" y="8" width="2" height="14" rx="1" fill={color} />
      {/* Knife */}
      <rect x="15" y="2" width="2" height="20" rx="1" fill={color} />
      <rect x="15" y="2" width="5" height="8" rx="2" fill={color} opacity="0.7" />
    </svg>
  );
}
