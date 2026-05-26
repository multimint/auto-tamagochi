interface IconProps { size?: number; color?: string; className?: string }
export function SleepIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Moon crescent: outer circle minus inner circle via opacity trick */}
      <circle cx="11" cy="13" r="9"  fill={color} />
      <circle cx="14" cy="9"  r="7"  fill="var(--color-bg, #FFF0F5)" />
      {/* Z letters */}
      <rect x="16" y="2"  width="6" height="2" rx="1" fill={color} />
      <rect x="19" y="4"  width="2" height="2" rx="0.5" fill={color} transform="rotate(45 20 5)" />
      <rect x="16" y="6"  width="6" height="2" rx="1" fill={color} />
    </svg>
  );
}
