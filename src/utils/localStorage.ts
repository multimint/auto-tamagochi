import type { GameSave } from '@/types';

export const SAVE_KEY = 'tamagotchi_save_v1';
export const SCHEMA_VERSION = 1;

export function isStorageAvailable(): boolean {
  try {
    const key = '__tamagotchi_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function loadSave(): GameSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameSave;
    // Basic validation
    if (!parsed?.pet || !parsed?.gameState) return null;
    if (typeof parsed.pet.hunger !== 'number') return null;
    if (parsed.gameState.version !== SCHEMA_VERSION) {
      console.warn('tamagotchi: save schema version mismatch, starting fresh');
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSave(save: GameSave): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {
    console.warn('tamagotchi: could not write to localStorage', e);
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
