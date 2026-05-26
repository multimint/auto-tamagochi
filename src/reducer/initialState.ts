import { generateId, nowMs } from '@/utils/timeUtils';
import { SCHEMA_VERSION } from '@/utils/localStorage';
import type { FullState, GameSave, PetState, Settings } from '@/types';

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled:        true,
  musicEnabled:        false,
  theme:               'pastel',
  animationsEnabled:   true,
  showTutorialOnStart: true,
  difficulty:          'normal',
};

export const DEFAULT_INVENTORY: Record<string, number> = {
  apple:    3,
  cookie:   2,
  toy:      1,
  medicine: 1,
  soap:     2,
  vitamin:  0,
};

export function createFreshPet(name: string, generation = 1): PetState {
  const now = nowMs();
  return {
    id:         generateId(),
    name:       name.trim() || 'Pochi',
    species:    'Cutepet',
    generation,
    stage:      'egg',
    ageMinutes: 0,
    hunger:     100,
    happiness:  100,
    energy:     100,
    cleanliness:100,
    health:     100,
    isSleeping: false,
    isSick:     false,
    lastFed:    now,
    lastPlayed: now,
    createdAt:  now,
    updatedAt:  now,
    avatarVariant: 'healthy',
    consecutiveHungerZeroMs: 0,
    consecutiveHappyZeroMs:  0,
  };
}

export function createFreshSave(name: string, generation = 1): GameSave {
  const now = nowMs();
  return {
    pet:          createFreshPet(name, generation),
    inventory:    { ...DEFAULT_INVENTORY },
    settings:     { ...DEFAULT_SETTINGS },
    achievements: [],
    gameState: {
      lastSavedAt:  now,
      lastActiveAt: now,
      version:      SCHEMA_VERSION,
    },
  };
}

export const INITIAL_FULL_STATE: FullState = {
  save:    createFreshSave(''),
  runtime: {
    currentScreen:         'home',
    isLoaded:              false,
    pendingEvolutionStage: null,
  },
};
