interface IconProps { size?: number; color?: string; className?: string }
export function CleanIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Soap bar */}
      <rect x="5" y="12" width="14" height="9" rx="3" fill={color} />
      {/* Bubbles */}
      <circle cx="8"  cy="9"  r="3"   fill={color} opacity="0.7" />
      <circle cx="14" cy="7"  r="3.5" fill={color} opacity="0.6" />
      <circle cx="19" cy="10" r="2.5" fill={color} opacity="0.5" />
      <circle cx="5"  cy="12" r="2"   fill={color} opacity="0.4" />
    </svg>
  );
}
