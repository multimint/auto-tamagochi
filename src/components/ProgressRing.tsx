interface ProgressRingProps {
  progress:  number;  // 0–1
  label?:    string;
  size?:     number;
  strokeWidth?: number;
}

export function ProgressRing({ progress, label, size = 44, strokeWidth = 4 }: ProgressRingProps) {
  const r           = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset      = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={label ? `${label}: ${Math.round(progress * 100)}%` : undefined}
      role={label ? 'progressbar' : undefined}
      aria-valuenow={label ? Math.round(progress * 100) : undefined}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
    >
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
      />
      {/* Fill */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}
