import React from 'react';

interface StatBarProps {
  label:  string;
  value:  number;   // 0–100
  icon:   React.ReactNode;
  isLow?: boolean;  // value ≤ 20
}

export function StatBar({ label, value, icon, isLow }: StatBarProps) {
  const pct  = Math.max(0, Math.min(100, value));
  const color = pct > 60 ? 'var(--stat-high)' : pct > 30 ? 'var(--stat-mid)' : 'var(--stat-low)';

  return (
    <div
      className={`stat-bar${isLow ? ' stat-bar--low' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
    >
      {/* Icon */}
      <div style={{ color, flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-muted)',
          width: 56,
          flexShrink: 0,
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </span>

      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: 12,
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          border: `1px solid var(--color-border)`,
          position: 'relative',
        }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${Math.round(pct)} out of 100`}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease, background-color 0.4s ease',
            animation: isLow ? 'stat-pulse 1.5s ease-in-out infinite' : undefined,
          }}
        />
      </div>

      {/* Value */}
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-bold)',
          color: isLow ? 'var(--color-danger)' : 'var(--color-text)',
          width: 28,
          textAlign: 'right',
          flexShrink: 0,
          fontFamily: 'var(--font-body)',
        }}
      >
        {Math.round(pct)}
      </span>
    </div>
  );
}
