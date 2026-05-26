import React from 'react';

interface ActionButtonProps {
  label:             string;
  icon:              React.ReactNode;
  onClick:           () => void;
  disabled?:         boolean;
  isOnCooldown?:     boolean;
  cooldownMs?:       number;
  cooldownTotalMs?:  number;
  variant?:          'primary' | 'secondary' | 'danger';
  ariaLabel?:        string;
}

export function ActionButton({
  label,
  icon,
  onClick,
  disabled = false,
  isOnCooldown = false,
  cooldownMs = 0,
  cooldownTotalMs = 1,
  variant = 'primary',
  ariaLabel,
}: ActionButtonProps) {
  const isBlocked = disabled || isOnCooldown;
  const cooldownPct = isOnCooldown ? (cooldownMs / cooldownTotalMs) * 100 : 0;

  const bgMap = {
    primary:   'var(--color-surface-alt)',
    secondary: 'var(--color-surface)',
    danger:    'var(--color-danger-bg)',
  };
  const borderMap = {
    primary:   'var(--color-border)',
    secondary: 'var(--color-border)',
    danger:    'var(--color-danger)',
  };

  return (
    <button
      onClick={isBlocked ? undefined : onClick}
      disabled={isBlocked}
      aria-label={ariaLabel ?? label}
      aria-disabled={isBlocked}
      style={{
        position:      'relative',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent:'center',
        gap:           'var(--space-1)',
        padding:       'var(--space-3) var(--space-2)',
        background:    bgMap[variant],
        border:        `2px solid ${borderMap[variant]}`,
        borderRadius:  'var(--radius-md)',
        cursor:        isBlocked ? 'not-allowed' : 'pointer',
        opacity:       isBlocked ? 0.5 : 1,
        transition:    'transform var(--transition-fast), box-shadow var(--transition-fast)',
        minHeight:     72,
        overflow:      'hidden',
      }}
      onMouseDown={e => {
        if (!isBlocked) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)';
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {/* Cooldown overlay */}
      {isOnCooldown && (
        <div
          style={{
            position:  'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            width: `${cooldownPct}%`,
            background: 'var(--color-primary)',
            transition: 'width 0.1s linear',
            borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          }}
        />
      )}

      {/* Icon */}
      <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
        {icon}
      </div>

      {/* Label */}
      <span style={{
        fontSize:    'var(--font-size-xs)',
        fontWeight:  'var(--font-weight-bold)',
        color:       'var(--color-text)',
        fontFamily:  'var(--font-body)',
        lineHeight:  1.2,
        textAlign:   'center',
      }}>
        {label}
      </span>

      {/* Cooldown timer text */}
      {isOnCooldown && cooldownMs > 0 && (
        <span style={{
          position:   'absolute',
          top:        4,
          right:      6,
          fontSize:   9,
          color:      'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
          fontWeight: 'var(--font-weight-bold)',
        }}>
          {Math.ceil(cooldownMs / 1000)}s
        </span>
      )}
    </button>
  );
}
