interface IconProps { size?: number; color?: string; className?: string }
export function CleanlinessIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Water drop: circle body + triangle top */}
      <circle cx="12" cy="15" r="7" fill={color} />
      <polygon points="12,2 6,13 18,13" fill={color} />
      {/* Shine */}
      <circle cx="9" cy="13" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}
