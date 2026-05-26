interface IconProps { size?: number; color?: string; className?: string }
export function MedicineIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      {/* Pill body */}
      <rect x="4" y="8" width="16" height="8" rx="4" fill={color} />
      {/* Divider line */}
      <rect x="12" y="8" width="1.5" height="8" fill="white" opacity="0.7" />
      {/* Right half lighter */}
      <rect x="12" y="8" width="8" height="8" rx="4" fill={color} opacity="0.5" />
      {/* Plus on left half */}
      <rect x="6.5" y="11" width="4"  height="2" rx="0.5" fill="white" opacity="0.9" />
      <rect x="8"   y="9.5" width="1" height="5" rx="0.5" fill="white" opacity="0.9" />
    </svg>
  );
}
