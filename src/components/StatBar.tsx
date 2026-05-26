import React from 'react';

interface StatBarProps {
  label:  string;
  value:  number;   // 0–100
  icon:   React.ReactNode;
  isLow?: boolean;  // value ≤ 20
}

export function StatBar({ label, value, icon, isLow }: StatBarProps) {
  const pct  = Math.max(0, Math.min(100, value));
  const isHigh = pct > 60;
  const isMid  = pct > 30 && pct <= 60;

  const color = isHigh ? 'var(--stat-high)' : isMid ? 'var(--stat-mid)' : 'var(--stat-low)';

  // Glow shadow that matches the fill colour level
  const glowShadow = isHigh
    ? '0 0 7px 1px rgba(134,239,172,0.55)'
    : isMid
    ? '0 0 6px 1px rgba(253,230,138,0.6)'
    : isLow
    ? '0 0 6px 2px rgba(252,165,165,0.5)'
    : undefined;

  return (
    <div
      className={`stat-bar${isLow ? ' stat-bar--low' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
    >
      {/* Icon — color matches fill */}
      <div style={{ color, flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.4s ease' }}>
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
            // Spring bounce when value changes; smooth color transition
            transition: 'width 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.4s ease, box-shadow 0.4s ease',
            animation: isLow ? 'stat-pulse 1.5s ease-in-out infinite' : undefined,
            boxShadow: glowShadow,
          }}
        />
      </div>

      {/* Numeric value */}
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-bold)',
          color: isLow ? 'var(--color-danger)' : 'var(--color-text)',
          width: 28,
          textAlign: 'right',
          flexShrink: 0,
          fontFamily: 'var(--font-body)',
          transition: 'color 0.4s ease',
        }}
      >
        {Math.round(pct)}
      </span>
    </div>
  );
}
