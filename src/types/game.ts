import type { PetState, PetStage } from './pet';

export type Screen =
  | 'home'
  | 'pet'
  | 'inventory'
  | 'achievements'
  | 'settings'
  | 'tutorial'
  | 'gameover'
  | 'accessory';

export type AccessorySlot = 'hat' | 'outfit' | 'face';

export type AccessoryCategory = 'hat' | 'outfit' | 'face';

export interface AccessoryDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: AccessoryCategory;
  price: number;
  /** Pixel-art SVG overlay rendered on top of the sprite */
  overlayComponent: string;   // identifier — resolved in PetAvatar
}

/** equippedAccessories maps slot → accessory id (undefined = nothing equipped) */
export type EquippedAccessories = Partial<Record<AccessorySlot, string>>;

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
  coins: number;
  ownedAccessories: string[];           // list of accessory ids
  equippedAccessories: EquippedAccessories;
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
