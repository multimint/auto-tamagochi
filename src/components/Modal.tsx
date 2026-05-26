import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  title:    string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef    = useRef<HTMLDivElement>(null);
  const titleId      = `modal-title-${title.replace(/\s/g, '-').toLowerCase()}`;

  // Focus trap + Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const el = dialogRef.current;
    if (!el) return;

    // Focus first focusable element
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(0,0,0,0.45)',
          zIndex:     'var(--z-modal)' as string,
          animation:  'fade-in 150ms ease',
        }}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="anim-modal-in"
        style={{
          position:       'fixed',
          top:            '50%',
          left:           '50%',
          transform:      'translate(-50%, -50%)',
          zIndex:         'calc(var(--z-modal) + 1)' as string,
          background:     'var(--color-surface)',
          borderRadius:   'var(--radius-lg)',
          boxShadow:      'var(--shadow-lg)',
          padding:        'var(--space-6)',
          width:          'min(90vw, 360px)',
          maxHeight:      '80vh',
          overflowY:      'auto',
          display:        'flex',
          flexDirection:  'column',
          gap:            'var(--space-4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2
            id={titleId}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'var(--font-size-sm)',
              color:      'var(--color-text)',
              lineHeight: 1.4,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              width:          32,
              height:         32,
              minWidth:       32,
              minHeight:      32,
              borderRadius:   'var(--radius-full)',
              background:     'var(--color-surface-alt)',
              color:          'var(--color-text-muted)',
              fontSize:       20,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </>
  );
}
