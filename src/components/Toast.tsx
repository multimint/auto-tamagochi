import { nowMs } from '@/utils/timeUtils';
import type { ToastMessage } from '@/types';

interface ToastProps {
  toast:      ToastMessage;
  onDismiss:  (id: string) => void;
}

const TYPE_CONFIG = {
  success: { bg: 'var(--color-success-bg)',  border: 'var(--color-success)', icon: '✓', barColor: 'var(--color-success)' },
  info:    { bg: 'var(--color-info-bg)',     border: 'var(--color-info)',    icon: 'ℹ', barColor: 'var(--color-info)' },
  warning: { bg: 'var(--color-warning-bg)',  border: 'var(--color-warning)', icon: '⚠', barColor: 'var(--color-warning)' },
  error:   { bg: 'var(--color-danger-bg)',   border: 'var(--color-danger)',  icon: '✗', barColor: 'var(--color-danger)' },
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const cfg = TYPE_CONFIG[toast.type];
  const remainingMs = Math.max(0, toast.expiresAt - nowMs());

  return (
    <div
      className="anim-slide-in"
      style={{
        background:    cfg.bg,
        border:        `1.5px solid ${cfg.border}`,
        borderRadius:  'var(--radius-md)',
        padding:       'var(--space-3) var(--space-4)',
        display:       'flex',
        alignItems:    'center',
        gap:           'var(--space-2)',
        boxShadow:     'var(--shadow-sm)',
        position:      'relative',
        overflow:      'hidden',
        minWidth:      240,
        maxWidth:      320,
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          height:     3,
          background: cfg.barColor,
          borderRadius: 'var(--radius-full)',
          animation:  `toast-progress ${remainingMs}ms linear forwards`,
          width:      '100%',
        }}
      />

      {/* Icon */}
      <span style={{ fontSize: 'var(--font-size-base)', flexShrink: 0 }}>{cfg.icon}</span>

      {/* Message */}
      <span style={{
        flex:       1,
        fontSize:   'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-semi)',
        color:      'var(--color-text)',
        fontFamily: 'var(--font-body)',
        lineHeight: 1.4,
      }}>
        {toast.message}
      </span>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          flexShrink:     0,
          width:          24,
          height:         24,
          minWidth:       24,
          minHeight:      24,
          borderRadius:   'var(--radius-full)',
          background:     'transparent',
          color:          'var(--color-text-muted)',
          fontSize:       16,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        0,
        }}
      >
        ×
      </button>
    </div>
  );
}
