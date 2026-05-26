import type { PetMood, PetState } from '@/types';

// ── Decay rates per millisecond ──
export const BASE_DECAY = {
  hunger:      1   / 60_000,   // -1 per minute
  happiness:   0.5 / 60_000,   // -0.5 per minute
  energy:      2   / 60_000,   // -2 per minute
  cleanliness: 0.2 / 60_000,   // -0.2 per minute
} as const;

// Difficulty multipliers on decay
export const DIFFICULTY_MULTIPLIER: Record<'easy' | 'normal' | 'hard', number> = {
  easy:   0.5,
  normal: 1.0,
  hard:   1.5,
};

// Sleep-mode modifiers (multiplied against base decay)
export const SLEEP_MODIFIERS = {
  hunger:      0.5,   // decays at half rate while sleeping
  happiness:   0.0,   // paused while sleeping
  cleanliness: 1.0,   // normal while sleeping
} as const;

// Energy restored per ms during sleep (+1 per second)
export const SLEEP_ENERGY_RESTORE_PER_MS = 1 / 1_000;

// ── Thresholds ──
export const WARNING_THRESHOLD   = 20;    // warn when stat ≤ 20
export const SICKNESS_THRESHOLD  = 10;    // become sick when hunger OR cleanliness ≤ 10
export const SICK_HEALTH_DAMAGE_PER_MS    = 10 / 60_000;  // -10 health/min when sick
export const HUNGER_HEALTH_DAMAGE_PER_MS  =  5 / 60_000;  // -5 health/min when starving
export const HAPPY_HEALTH_DAMAGE_PER_MS   =  2 / 60_000;  // -2 health/min when depressed
export const HUNGER_DAMAGE_DELAY_MS       = 5  * 60_000;  // hunger=0 must last 5 min before health drops
export const HAPPY_DAMAGE_DELAY_MS        = 10 * 60_000;  // happiness=0 must last 10 min before health drops

export function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val));
}

export function applyDecay(
  pet: PetState,
  deltaMs: number,
  difficulty: 'easy' | 'normal' | 'hard' = 'normal',
): PetState {
  const mult = DIFFICULTY_MULTIPLIER[difficulty];
  let {
    hunger, happiness, energy, cleanliness, health,
    isSleeping, isSick,
    consecutiveHungerZeroMs, consecutiveHappyZeroMs,
  } = pet;

  if (isSleeping) {
    hunger      = clamp(hunger      - BASE_DECAY.hunger      * SLEEP_MODIFIERS.hunger      * mult * deltaMs);
    happiness   = clamp(happiness   - BASE_DECAY.happiness   * SLEEP_MODIFIERS.happiness   * mult * deltaMs);
    cleanliness = clamp(cleanliness - BASE_DECAY.cleanliness * SLEEP_MODIFIERS.cleanliness * mult * deltaMs);
    // Energy restores during sleep
    energy = clamp(energy + SLEEP_ENERGY_RESTORE_PER_MS * deltaMs);
  } else {
    hunger      = clamp(hunger      - BASE_DECAY.hunger      * mult * deltaMs);
    happiness   = clamp(happiness   - BASE_DECAY.happiness   * mult * deltaMs);
    energy      = clamp(energy      - BASE_DECAY.energy      * mult * deltaMs);
    cleanliness = clamp(cleanliness - BASE_DECAY.cleanliness * mult * deltaMs);
  }

  // Track how long each stat has been at zero
  consecutiveHungerZeroMs = hunger    === 0 ? consecutiveHungerZeroMs + deltaMs : 0;
  consecutiveHappyZeroMs  = happiness === 0 ? consecutiveHappyZeroMs  + deltaMs : 0;

  // Health damage from starvation (after 5 min at zero)
  if (hunger === 0 && consecutiveHungerZeroMs >= HUNGER_DAMAGE_DELAY_MS) {
    health = clamp(health - HUNGER_HEALTH_DAMAGE_PER_MS * deltaMs);
  }

  // Health damage from depression (after 10 min at zero)
  if (happiness === 0 && consecutiveHappyZeroMs >= HAPPY_DAMAGE_DELAY_MS) {
    health = clamp(health - HAPPY_HEALTH_DAMAGE_PER_MS * deltaMs);
  }

  // Sickness: deterministic trigger (no randomness)
  if (!isSick && (hunger <= SICKNESS_THRESHOLD || cleanliness <= SICKNESS_THRESHOLD)) {
    isSick = true;
  }

  // Health damage from sickness
  if (isSick) {
    health = clamp(health - SICK_HEALTH_DAMAGE_PER_MS * deltaMs);
  }

  const avatarVariant: PetState['avatarVariant'] =
    health < 40 || isSick ? 'unhealthy' : 'healthy';

  return {
    ...pet,
    hunger,
    happiness,
    energy,
    cleanliness,
    health,
    isSick,
    avatarVariant,
    consecutiveHungerZeroMs,
    consecutiveHappyZeroMs,
    updatedAt: Date.now(),
  };
}

export function computeMood(pet: PetState): PetMood {
  if (pet.stage === 'dead') return 'dead';
  if (pet.isSleeping) return 'sleeping';
  if (pet.isSick) return 'sick';
  const avg = (pet.hunger + pet.happiness + pet.energy) / 3;
  if (avg >= 70) return 'happy';
  if (avg >= 40) return 'neutral';
  return 'sad';
}

export function addStats(
  pet: PetState,
  delta: Partial<Record<'hunger' | 'happiness' | 'energy' | 'cleanliness' | 'health', number>>,
): PetState {
  return {
    ...pet,
    hunger:      'hunger'      in delta ? clamp(pet.hunger      + (delta.hunger      ?? 0)) : pet.hunger,
    happiness:   'happiness'   in delta ? clamp(pet.happiness   + (delta.happiness   ?? 0)) : pet.happiness,
    energy:      'energy'      in delta ? clamp(pet.energy      + (delta.energy      ?? 0)) : pet.energy,
    cleanliness: 'cleanliness' in delta ? clamp(pet.cleanliness + (delta.cleanliness ?? 0)) : pet.cleanliness,
    health:      'health'      in delta ? clamp(pet.health      + (delta.health      ?? 0)) : pet.health,
  };
}

// Returns which stat(s) caused death for the "cause of death" message
export function getCauseOfDeath(pet: PetState): string {
  if (pet.isSick)          return 'illness';
  if (pet.hunger <= 0)     return 'starvation';
  if (pet.cleanliness <= 0) return 'poor hygiene';
  if (pet.happiness <= 0)  return 'loneliness';
  return 'neglect';
}
