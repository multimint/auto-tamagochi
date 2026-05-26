interface IconProps { size?: number; color?: string; className?: string }
export function HealthIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Heart */}
      <rect x="4"  y="5" width="7" height="7" rx="3.5" fill={color} />
      <rect x="13" y="5" width="7" height="7" rx="3.5" fill={color} />
      <rect x="2"  y="9" width="20" height="9"  rx="1"   fill={color} />
      <rect x="9"  y="15" width="6" height="7" rx="1" fill={color} transform="rotate(45 12 18.5)" />
      {/* Plus sign */}
      <rect x="10" y="8"  width="4" height="10" rx="1" fill="white" opacity="0.9" />
      <rect x="7"  y="11" width="10" height="4" rx="1" fill="white" opacity="0.9" />
    </svg>
  );
}
