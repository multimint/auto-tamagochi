interface IconProps { size?: number; color?: string; className?: string }
export function PlayIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Ball */}
      <circle cx="12" cy="12" r="10" fill={color} />
      {/* Stripes */}
      <rect x="2" y="10" width="20" height="4" rx="2" fill="white" opacity="0.35" />
      <rect x="8" y="2"  width="4" height="20" rx="2" fill="white" opacity="0.35" transform="rotate(-30 10 12)" />
    </svg>
  );
}
