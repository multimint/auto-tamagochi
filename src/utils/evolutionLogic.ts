import type { PetStage, PetState } from '@/types';

// Age thresholds in minutes for each stage transition
export const EVOLUTION_AGE: Partial<Record<PetStage, number>> = {
  egg:   2,    // egg → baby at 2 minutes (automatic, no condition)
  baby:  5,    // baby → child at 5 minutes
  child: 15,   // child → teen at 15 minutes
  teen:  30,   // teen → adult at 30 minutes
  adult: 60,   // adult → elder at 60 minutes
};

export const NEXT_STAGE: Partial<Record<PetStage, PetStage>> = {
  egg:   'baby',
  baby:  'child',
  child: 'teen',
  teen:  'adult',
  adult: 'elder',
};

// Stage display labels
export const STAGE_LABELS: Record<PetStage, string> = {
  egg:   'Egg',
  baby:  'Baby',
  child: 'Child',
  teen:  'Teen',
  adult: 'Adult',
  elder: 'Elder',
  dead:  'Dead',
};

// Stage emojis
export const STAGE_EMOJIS: Record<PetStage, string> = {
  egg:   '🥚',
  baby:  '🐣',
  child: '🧒',
  teen:  '🧑',
  adult: '👤',
  elder: '👴',
  dead:  '💀',
};

function isHealthyEvolution(pet: PetState): boolean {
  const { stage, hunger, happiness, cleanliness, health } = pet;
  if (stage === 'egg') return true; // hatching is always healthy
  if (stage === 'baby') {
    const avg = (hunger + happiness + cleanliness) / 3;
    return avg >= 70;
  }
  if (stage === 'child') return hunger >= 50 && happiness >= 50;
  if (stage === 'teen')  return hunger >= 50 && happiness >= 50 && cleanliness >= 50 && health >= 50;
  return true; // adult → elder: always succeeds
}

export function checkEvolution(
  pet: PetState,
): { toStage: PetStage; isHealthy: boolean } | null {
  if (pet.stage === 'dead' || pet.stage === 'elder') return null;
  const threshold = EVOLUTION_AGE[pet.stage];
  const next = NEXT_STAGE[pet.stage];
  if (threshold === undefined || next === undefined) return null;
  if (pet.ageMinutes >= threshold) {
    return { toStage: next, isHealthy: isHealthyEvolution(pet) };
  }
  return null;
}

export function getEvolutionBonus(
  isHealthy: boolean,
): Partial<Record<'health' | 'energy' | 'happiness', number>> {
  if (isHealthy) return { health: 10, energy: 10, happiness: 5 };
  return { health: -10 };
}

// Progress toward next evolution (0–1)
export function evolutionProgress(pet: PetState): number {
  if (pet.stage === 'dead' || pet.stage === 'elder') return 1;
  const threshold = EVOLUTION_AGE[pet.stage];
  if (threshold === undefined) return 1;
  const prevThreshold = getPrevThreshold(pet.stage);
  const range = threshold - prevThreshold;
  const progress = (pet.ageMinutes - prevThreshold) / range;
  return Math.min(1, Math.max(0, progress));
}

function getPrevThreshold(stage: PetStage): number {
  const map: Partial<Record<PetStage, number>> = {
    egg:   0,
    baby:  2,
    child: 5,
    teen:  15,
    adult: 30,
    elder: 60,
  };
  return map[stage] ?? 0;
}

export function nextEvolutionAge(pet: PetState): number | null {
  if (pet.stage === 'dead' || pet.stage === 'elder') return null;
  return EVOLUTION_AGE[pet.stage] ?? null;
}
