interface IconProps { size?: number; color?: string; className?: string }
export function HappinessIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Heart using two rects at angle */}
      <rect x="5"  y="5"  width="7" height="7" rx="3.5" fill={color} />
      <rect x="12" y="5"  width="7" height="7" rx="3.5" fill={color} />
      <rect x="3"  y="9"  width="18" height="10" rx="1" fill={color} transform="rotate(0 12 14)" />
      {/* Bottom point */}
      <rect x="10" y="16" width="4"  height="6"  rx="1" fill={color} transform="rotate(45 12 19)" />
    </svg>
  );
}
