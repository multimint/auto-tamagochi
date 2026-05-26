import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { generateId, nowMs } from '@/utils/timeUtils';
import type { ToastMessage, ToastType } from '@/types';

// Duration (ms) per toast type
const TOAST_DURATION: Record<ToastType, number> = {
  info:    3_000,
  success: 3_000,
  warning: 5_000,
  error:   6_000,
};

interface ToastContextValue {
  toasts: ToastMessage[];
  addToast(message: string, type?: ToastType, durationMs?: number): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Prune expired toasts every 500 ms
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setToasts(prev => prev.filter(t => t.expiresAt > nowMs()));
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', durationMs?: number) => {
      const duration = durationMs ?? TOAST_DURATION[type];
      const toast: ToastMessage = {
        id:        generateId(),
        message,
        type,
        expiresAt: nowMs() + duration,
      };
      setToasts(prev => {
        // Max 3 toasts at once — drop oldest if exceeded
        const next = [...prev, toast];
        return next.length > 3 ? next.slice(next.length - 3) : next;
      });
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
