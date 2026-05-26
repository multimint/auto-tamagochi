interface IconProps { size?: number; color?: string; className?: string }
export function EnergyIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Lightning bolt */}
      <polygon points="14,2 6,14 11,14 10,22 18,10 13,10" fill={color} />
    </svg>
  );
}
