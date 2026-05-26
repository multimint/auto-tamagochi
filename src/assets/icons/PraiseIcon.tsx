interface IconProps { size?: number; color?: string; className?: string }
export function PraiseIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* 4-pointed star: two crossing rects */}
      <rect x="10" y="2"  width="4" height="20" rx="2" fill={color} />
      <rect x="2"  y="10" width="20" height="4" rx="2" fill={color} />
      {/* Diagonal points */}
      <rect x="10" y="2"  width="4" height="20" rx="2" fill={color} transform="rotate(45 12 12)" />
      <rect x="2"  y="10" width="20" height="4" rx="2" fill={color} transform="rotate(45 12 12)" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="3" fill="white" opacity="0.6" />
    </svg>
  );
}
