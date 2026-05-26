import { applyDecay } from './gameLogic';
import type { GameSave } from '@/types';

// Cap offline time at 8 hours to prevent catastrophic decay
export const MAX_OFFLINE_MS = 8 * 60 * 60_000;

export function applyOfflineDecay(save: GameSave, nowMs: number): GameSave {
  const { lastActiveAt } = save.gameState;
  let deltaMs = nowMs - lastActiveAt;

  // Clock went backwards → skip
  if (deltaMs <= 0) return save;

  // Cap at 8 hours
  if (deltaMs > MAX_OFFLINE_MS) deltaMs = MAX_OFFLINE_MS;

  const difficulty = save.settings.difficulty;
  const reconciledPet = applyDecay(save.pet, deltaMs, difficulty);
  const ageAdded = deltaMs / 60_000;

  return {
    ...save,
    pet: {
      ...reconciledPet,
      ageMinutes: save.pet.ageMinutes + ageAdded,
    },
    gameState: {
      ...save.gameState,
      lastActiveAt: nowMs,
    },
  };
}
