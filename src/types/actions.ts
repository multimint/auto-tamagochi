import type { PetStage } from './pet';
import type { AccessorySlot, GameSave, Screen, Settings } from './game';

export type GameAction =
  | { type: 'TICK'; payload: { deltaMs: number } }
  | { type: 'FEED' }
  | { type: 'PLAY' }
  | { type: 'CLEAN' }
  | { type: 'SLEEP' }
  | { type: 'WAKE' }
  | { type: 'MEDICINE' }
  | { type: 'PRAISE' }
  | { type: 'PET' }
  | { type: 'USE_ITEM'; payload: { itemId: string } }
  | { type: 'EVOLVE'; payload: { toStage: PetStage } }
  | { type: 'DIE' }
  | { type: 'RESET' }
  | { type: 'LOAD'; payload: { save: GameSave } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'RENAME_PET'; payload: { name: string } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { id: string } }
  | { type: 'NAVIGATE'; payload: { screen: Screen } }
  | { type: 'RECONCILE_OFFLINE'; payload: { nowMs: number } }
  | { type: 'CLEAR_PENDING_EVOLUTION' }
  | { type: 'BUY_ACCESSORY';   payload: { id: string } }
  | { type: 'EQUIP_ACCESSORY'; payload: { id: string; slot: AccessorySlot } }
  | { type: 'UNEQUIP_ACCESSORY'; payload: { slot: AccessorySlot } };
