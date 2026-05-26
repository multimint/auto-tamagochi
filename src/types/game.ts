import type { PetState, PetStage } from './pet';

export type Screen =
  | 'home'
  | 'pet'
  | 'inventory'
  | 'achievements'
  | 'settings'
  | 'tutorial'
  | 'gameover';

export type ToastType = 'info' | 'warning' | 'error' | 'success';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  expiresAt: number;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: 'pastel' | 'dark' | 'classic';
  animationsEnabled: boolean;
  showTutorialOnStart: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface GameMeta {
  lastSavedAt: number;
  lastActiveAt: number;
  version: number;
}

export interface GameSave {
  pet: PetState;
  inventory: Record<string, number>;
  settings: Settings;
  achievements: string[];
  gameState: GameMeta;
}

export interface RuntimeState {
  currentScreen: Screen;
  isLoaded: boolean;
  pendingEvolutionStage: PetStage | null;
}

export interface FullState {
  save: GameSave;
  runtime: RuntimeState;
}

// Item catalog types
export interface ItemDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effects: Partial<Record<string, number>>;
  usableWhen: 'always' | 'sick' | 'notSleeping';
}
