import { useToast } from '@/context/ToastContext';
import { Toast } from './Toast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      role="status"
      aria-live="polite"
      aria-atomic="false"
      style={{
        position:      'fixed',
        top:           'var(--space-4)',
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:        'var(--z-toast)',
        display:       'flex',
        flexDirection: 'column',
        gap:           'var(--space-2)',
        alignItems:    'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            toast={t}
            onDismiss={removeToast}
          />
        </div>
      ))}
    </div>
  );
}
