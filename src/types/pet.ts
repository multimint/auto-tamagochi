export type PetStage =
  | 'egg'
  | 'baby'
  | 'child'
  | 'teen'
  | 'adult'
  | 'elder'
  | 'dead';

export type AvatarVariant = 'healthy' | 'unhealthy';

export type PetMood = 'happy' | 'neutral' | 'sad' | 'sick' | 'sleeping' | 'dead';

export interface PetState {
  id: string;
  name: string;
  species: string;
  generation: number;
  stage: PetStage;
  ageMinutes: number;
  hunger: number;        // 0–100
  happiness: number;     // 0–100
  energy: number;        // 0–100
  cleanliness: number;   // 0–100
  health: number;        // 0–100
  isSleeping: boolean;
  isSick: boolean;
  lastFed: number;       // unix ms
  lastPlayed: number;    // unix ms
  createdAt: number;     // unix ms
  updatedAt: number;     // unix ms
  avatarVariant: AvatarVariant;
  consecutiveHungerZeroMs: number;
  consecutiveHappyZeroMs: number;
}
