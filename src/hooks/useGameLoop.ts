import { useEffect, useRef } from 'react';
import { nowMs } from '@/utils/timeUtils';
import type { GameAction } from '@/types';

export function useGameLoop(
  dispatch: React.Dispatch<GameAction>,
  isActive: boolean,
): void {
  const prevTimeRef = useRef<number>(nowMs());
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  useEffect(() => {
    if (!isActive) return;

    prevTimeRef.current = nowMs();

    const interval = setInterval(() => {
      const now = nowMs();
      const deltaMs = now - prevTimeRef.current;
      prevTimeRef.current = now;
      dispatchRef.current({ type: 'TICK', payload: { deltaMs } });
    }, 1_000);

    return () => clearInterval(interval);
  }, [isActive]);
}
