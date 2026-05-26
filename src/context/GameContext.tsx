import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { gameReducer } from '@/reducer/gameReducer';
import { INITIAL_FULL_STATE } from '@/reducer/initialState';
import { loadSave, isStorageAvailable } from '@/utils/localStorage';
import { nowMs } from '@/utils/timeUtils';
import { useGameLoop } from '@/hooks/useGameLoop';
import type {
  FullState,
  GameAction,
  GameSave,
  PetState,
  Screen,
  Settings,
} from '@/types';

interface GameContextValue {
  state:           FullState;
  dispatch:        React.Dispatch<GameAction>;
  pet:             PetState;
  settings:        Settings;
  achievements:    string[];
  inventory:       Record<string, number>;
  currentScreen:   Screen;
  storageAvailable:boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_FULL_STATE);
  const storageAvailable = isStorageAvailable();

  // ── On mount: load save, reconcile offline, apply settings ──────────────
  useEffect(() => {
    const saved = loadSave();

    if (saved) {
      dispatch({ type: 'LOAD', payload: { save: saved } });
      dispatch({ type: 'RECONCILE_OFFLINE', payload: { nowMs: nowMs() } });
    }
    // If no save, stay on HomeScreen (isLoaded remains false, screen = 'home')

    // Apply theme from saved settings (or default)
    const theme = saved?.settings.theme ?? 'pastel';
    document.documentElement.setAttribute('data-theme', theme);

    // Apply animations setting
    const animsEnabled = saved?.settings.animationsEnabled ?? true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animsEnabled || prefersReduced) {
      document.documentElement.classList.add('no-animations');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Page visibility: save on hide, reconcile on show ────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Save on hide handled automatically by reducer
      } else {
        dispatch({ type: 'RECONCILE_OFFLINE', payload: { nowMs: nowMs() } });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ── Multi-tab sync ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tamagotchi_save_v1' && e.newValue) {
        try {
          const external = JSON.parse(e.newValue) as GameSave;
          if (external?.pet && external?.gameState) {
            dispatch({ type: 'LOAD', payload: { save: external } });
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // ── Game loop: active when pet is alive and a save is loaded ─────────────
  const isGameActive =
    state.runtime.isLoaded &&
    state.save.pet.stage !== 'dead' &&
    state.runtime.currentScreen === 'pet';

  useGameLoop(dispatch, isGameActive);

  const value: GameContextValue = {
    state,
    dispatch,
    pet:             state.save.pet,
    settings:        state.save.settings,
    achievements:    state.save.achievements,
    inventory:       state.save.inventory,
    currentScreen:   state.runtime.currentScreen,
    storageAvailable,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

// Convenience: a stable dispatch wrapper that can be passed down
export function useGameDispatch(): React.Dispatch<GameAction> {
  return useGame().dispatch;
}

// Navigate helper
export function useNavigate() {
  const { dispatch } = useGame();
  return useCallback(
    (screen: Screen) => dispatch({ type: 'NAVIGATE', payload: { screen } }),
    [dispatch],
  );
}
