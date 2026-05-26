import { useCallback, useEffect, useReducer, useRef } from 'react';

export type ActionName = 'FEED' | 'PLAY' | 'CLEAN' | 'MEDICINE' | 'PRAISE';

export const COOLDOWN_DURATIONS: Record<ActionName, number> = {
  FEED:      30_000,
  PLAY:      60_000,
  CLEAN:    120_000,
  MEDICINE:  60_000,
  PRAISE:    15_000,
};

const ACTION_NAMES = ['FEED', 'PLAY', 'CLEAN', 'MEDICINE', 'PRAISE'] as const;

interface CooldownState {
  remainingMs: Record<ActionName, number>;
}

type CooldownReducerAction =
  | { type: 'TRIGGER'; name: ActionName }
  | { type: 'TICK'; deltaMs: number };

function cooldownReducer(state: CooldownState, action: CooldownReducerAction): CooldownState {
  switch (action.type) {
    case 'TRIGGER':
      return {
        remainingMs: { ...state.remainingMs, [action.name]: COOLDOWN_DURATIONS[action.name] },
      };
    case 'TICK': {
      const updated = { ...state.remainingMs };
      ACTION_NAMES.forEach(k => {
        updated[k] = Math.max(0, updated[k] - action.deltaMs);
      });
      return { remainingMs: updated };
    }
  }
}

const INITIAL_STATE: CooldownState = {
  remainingMs: { FEED: 0, PLAY: 0, CLEAN: 0, MEDICINE: 0, PRAISE: 0 },
};

export interface CooldownEntry {
  isOnCooldown: boolean;
  remainingMs: number;
  totalMs: number;
  trigger(): void;
}

export type CooldownMap = Record<ActionName, CooldownEntry>;

export function useCooldowns(): CooldownMap {
  const [state, dispatch] = useReducer(cooldownReducer, INITIAL_STATE);
  const prevTimeRef = useRef<number>(Date.now());

  // Tick every 100ms to count down cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - prevTimeRef.current;
      prevTimeRef.current = now;
      dispatch({ type: 'TICK', deltaMs });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Stable trigger functions (one per action, declared unconditionally)
  const triggerFeed     = useCallback(() => dispatch({ type: 'TRIGGER', name: 'FEED'     }), []);
  const triggerPlay     = useCallback(() => dispatch({ type: 'TRIGGER', name: 'PLAY'     }), []);
  const triggerClean    = useCallback(() => dispatch({ type: 'TRIGGER', name: 'CLEAN'    }), []);
  const triggerMedicine = useCallback(() => dispatch({ type: 'TRIGGER', name: 'MEDICINE' }), []);
  const triggerPraise   = useCallback(() => dispatch({ type: 'TRIGGER', name: 'PRAISE'   }), []);

  return {
    FEED:     { isOnCooldown: state.remainingMs.FEED     > 0, remainingMs: state.remainingMs.FEED,     totalMs: COOLDOWN_DURATIONS.FEED,     trigger: triggerFeed },
    PLAY:     { isOnCooldown: state.remainingMs.PLAY     > 0, remainingMs: state.remainingMs.PLAY,     totalMs: COOLDOWN_DURATIONS.PLAY,     trigger: triggerPlay },
    CLEAN:    { isOnCooldown: state.remainingMs.CLEAN    > 0, remainingMs: state.remainingMs.CLEAN,    totalMs: COOLDOWN_DURATIONS.CLEAN,    trigger: triggerClean },
    MEDICINE: { isOnCooldown: state.remainingMs.MEDICINE > 0, remainingMs: state.remainingMs.MEDICINE, totalMs: COOLDOWN_DURATIONS.MEDICINE, trigger: triggerMedicine },
    PRAISE:   { isOnCooldown: state.remainingMs.PRAISE   > 0, remainingMs: state.remainingMs.PRAISE,   totalMs: COOLDOWN_DURATIONS.PRAISE,   trigger: triggerPraise },
  };
}
