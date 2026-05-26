import { clamp, applyDecay, addStats } from '@/utils/gameLogic';
import { checkEvolution, getEvolutionBonus } from '@/utils/evolutionLogic';
import { applyOfflineDecay } from '@/utils/offlineLogic';
import { clearSave, writeSave } from '@/utils/localStorage';
import { nowMs } from '@/utils/timeUtils';
import { createFreshSave } from './initialState';
import type { FullState, GameAction } from '@/types';

export function gameReducer(state: FullState, action: GameAction): FullState {
  const { save, runtime } = state;
  const { pet, inventory, settings, achievements, gameState } = save;

  switch (action.type) {

    // ── TICK ──────────────────────────────────────────────────────────────────
    case 'TICK': {
      if (pet.stage === 'dead') return state;
      const { deltaMs } = action.payload;

      let newPet = applyDecay(pet, deltaMs, settings.difficulty);
      newPet = { ...newPet, ageMinutes: pet.ageMinutes + deltaMs / 60_000 };

      // Death check
      if (newPet.health <= 0) {
        newPet = { ...newPet, health: 0, stage: 'dead' };
        const newSave = {
          ...save,
          pet: newPet,
          gameState: { ...gameState, lastActiveAt: nowMs(), lastSavedAt: nowMs() },
        };
        writeSave(newSave);
        return { save: newSave, runtime: { ...runtime, currentScreen: 'gameover' } };
      }

      // Evolution check
      const evo = checkEvolution(newPet);
      let pendingEvolutionStage = runtime.pendingEvolutionStage;
      if (evo) {
        const bonus = getEvolutionBonus(evo.isHealthy);
        newPet = {
          ...newPet,
          stage:         evo.toStage,
          avatarVariant: evo.isHealthy ? 'healthy' : 'unhealthy',
          health:    clamp(newPet.health    + (bonus.health    ?? 0)),
          energy:    clamp(newPet.energy    + (bonus.energy    ?? 0)),
          happiness: clamp(newPet.happiness + (bonus.happiness ?? 0)),
        };
        pendingEvolutionStage = evo.toStage;
      }

      const newSave = {
        ...save,
        pet: newPet,
        gameState: { ...gameState, lastActiveAt: nowMs(), lastSavedAt: nowMs() },
      };
      writeSave(newSave);
      return { save: newSave, runtime: { ...runtime, pendingEvolutionStage } };
    }

    // ── FEED ──────────────────────────────────────────────────────────────────
    case 'FEED': {
      if (pet.stage === 'dead' || pet.isSleeping) return state;
      const appleCount = inventory['apple'] ?? 0;
      const newInventory = appleCount > 0
        ? { ...inventory, apple: appleCount - 1 }
        : { ...inventory };
      let newPet = addStats(pet, { hunger: 25, happiness: 5, cleanliness: -2, energy: -5 });
      newPet = { ...newPet, lastFed: nowMs(), updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet, inventory: newInventory };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── PLAY ──────────────────────────────────────────────────────────────────
    case 'PLAY': {
      if (pet.stage === 'dead' || pet.isSleeping || pet.energy < 15) return state;
      let newPet = addStats(pet, { happiness: 20, energy: -15, hunger: -5 });
      newPet = { ...newPet, lastPlayed: nowMs(), updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── CLEAN ─────────────────────────────────────────────────────────────────
    case 'CLEAN': {
      if (pet.stage === 'dead') return state;
      let newPet = { ...pet, cleanliness: 100 };
      newPet = addStats(newPet, { happiness: 10, hunger: -5 });
      // Cure sickness caused by poor cleanliness
      if (pet.isSick && pet.cleanliness <= 10) {
        newPet = { ...newPet, isSick: false, health: clamp(newPet.health + 10) };
      }
      newPet = { ...newPet, updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── SLEEP ─────────────────────────────────────────────────────────────────
    case 'SLEEP': {
      if (pet.stage === 'dead' || pet.isSleeping) return state;
      const newPet = { ...pet, isSleeping: true, updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── WAKE ──────────────────────────────────────────────────────────────────
    case 'WAKE': {
      if (!pet.isSleeping) return state;
      const newPet = { ...pet, isSleeping: false, updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── MEDICINE ──────────────────────────────────────────────────────────────
    case 'MEDICINE': {
      if (pet.stage === 'dead' || !pet.isSick) return state;
      const medCount = inventory['medicine'] ?? 0;
      if (medCount <= 0) return state;
      let newPet = {
        ...pet,
        isSick:      false,
        health:      clamp(pet.health + 50),
        cleanliness: clamp(pet.cleanliness - 5),
        updatedAt:   nowMs(),
      };
      newPet = { ...newPet, avatarVariant: 'healthy' };
      const newInventory = { ...inventory, medicine: medCount - 1 };
      const newSave = { ...save, pet: newPet, inventory: newInventory };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── PRAISE ────────────────────────────────────────────────────────────────
    case 'PRAISE': {
      if (pet.stage === 'dead' || pet.isSleeping) return state;
      const newPet = { ...addStats(pet, { happiness: 10 }), updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── USE_ITEM ──────────────────────────────────────────────────────────────
    case 'USE_ITEM': {
      const { itemId } = action.payload;
      const qty = inventory[itemId] ?? 0;
      if (qty <= 0 || pet.stage === 'dead') return state;

      type StatKey = 'hunger' | 'happiness' | 'energy' | 'cleanliness' | 'health';
      const ITEM_EFFECTS: Record<string, Partial<Record<StatKey, number>>> = {
        apple:    { hunger: 15 },
        cookie:   { hunger: 5, happiness: 15 },
        toy:      { happiness: 20, energy: -5 },
        medicine: { health: 50 },
        soap:     { cleanliness: 50 },
        vitamin:  { health: 10, energy: 20 },
      };

      const effects = ITEM_EFFECTS[itemId];
      if (!effects) return state;

      let newPet = addStats(pet, effects);
      if (itemId === 'medicine') {
        newPet = { ...newPet, isSick: false, avatarVariant: 'healthy' };
      }
      newPet = { ...newPet, updatedAt: nowMs() };

      const newInventory = { ...inventory, [itemId]: qty - 1 };
      const newSave = { ...save, pet: newPet, inventory: newInventory };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── EVOLVE ────────────────────────────────────────────────────────────────
    case 'EVOLVE': {
      const newPet = { ...pet, stage: action.payload.toStage, updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return {
        save: newSave,
        runtime: { ...runtime, pendingEvolutionStage: action.payload.toStage },
      };
    }

    // ── DIE ───────────────────────────────────────────────────────────────────
    case 'DIE': {
      const newPet = { ...pet, stage: 'dead' as const, health: 0, updatedAt: nowMs() };
      const newSave = { ...save, pet: newPet };
      writeSave(newSave);
      return { save: newSave, runtime: { ...runtime, currentScreen: 'gameover' } };
    }

    // ── RESET ─────────────────────────────────────────────────────────────────
    case 'RESET': {
      clearSave();
      const nextGen = pet.generation + 1;
      return {
        save:    createFreshSave('', nextGen),
        runtime: { currentScreen: 'home', isLoaded: false, pendingEvolutionStage: null },
      };
    }

    // ── LOAD ──────────────────────────────────────────────────────────────────
    case 'LOAD': {
      const loadedSave = action.payload.save;
      const screen = loadedSave.pet.stage === 'dead' ? 'gameover' : 'pet';
      return {
        save:    loadedSave,
        runtime: { currentScreen: screen, isLoaded: true, pendingEvolutionStage: null },
      };
    }

    // ── UPDATE_SETTINGS ───────────────────────────────────────────────────────
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...settings, ...action.payload };
      const newSave = { ...save, settings: newSettings };
      writeSave(newSave);
      // Apply theme to <html>
      document.documentElement.setAttribute('data-theme', newSettings.theme);
      // Apply animations
      if (!newSettings.animationsEnabled) {
        document.documentElement.classList.add('no-animations');
      } else {
        document.documentElement.classList.remove('no-animations');
      }
      return { ...state, save: newSave };
    }

    // ── RENAME_PET ────────────────────────────────────────────────────────────
    case 'RENAME_PET': {
      const name = action.payload.name.trim().slice(0, 12) || pet.name;
      const newSave = { ...save, pet: { ...pet, name, updatedAt: nowMs() } };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── UNLOCK_ACHIEVEMENT ────────────────────────────────────────────────────
    case 'UNLOCK_ACHIEVEMENT': {
      if (achievements.includes(action.payload.id)) return state;
      const newAchievements = [...achievements, action.payload.id];
      const newSave = { ...save, achievements: newAchievements };
      writeSave(newSave);
      return { ...state, save: newSave };
    }

    // ── NAVIGATE ──────────────────────────────────────────────────────────────
    case 'NAVIGATE': {
      return { ...state, runtime: { ...runtime, currentScreen: action.payload.screen } };
    }

    // ── RECONCILE_OFFLINE ─────────────────────────────────────────────────────
    case 'RECONCILE_OFFLINE': {
      const reconciledSave = applyOfflineDecay(save, action.payload.nowMs);
      return { save: reconciledSave, runtime };
    }

    // ── CLEAR_PENDING_EVOLUTION ───────────────────────────────────────────────
    case 'CLEAR_PENDING_EVOLUTION': {
      return { ...state, runtime: { ...runtime, pendingEvolutionStage: null } };
    }

    default:
      return state;
  }
}
