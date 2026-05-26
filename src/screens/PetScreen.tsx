import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';
import { useCooldowns } from '@/hooks/useCooldowns';
import { computeMood } from '@/utils/gameLogic';
import { evolutionProgress, nextEvolutionAge, STAGE_LABELS } from '@/utils/evolutionLogic';
import { formatAge } from '@/utils/timeUtils';
import {
  playEatSound, playPlaySound, playCleanSound, playSleepSound,
  playWakeSound, playMedicineSound, playPraiseSound,
  playEvolveSound, resumeAudio,
} from '@/utils/audioUtils';

import { PetAvatar }      from '@/components/PetAvatar';
import { StatBar }        from '@/components/StatBar';
import { ActionButton }   from '@/components/ActionButton';
import { ProgressRing }   from '@/components/ProgressRing';
import { StageBadge }     from '@/components/StageBadge';
import { ToastContainer } from '@/components/ToastContainer';

import { HungerIcon }      from '@/assets/icons/HungerIcon';
import { HappinessIcon }   from '@/assets/icons/HappinessIcon';
import { EnergyIcon }      from '@/assets/icons/EnergyIcon';
import { CleanlinessIcon } from '@/assets/icons/CleanlinessIcon';
import { HealthIcon }      from '@/assets/icons/HealthIcon';
import { FeedIcon }        from '@/assets/icons/FeedIcon';
import { PlayIcon }        from '@/assets/icons/PlayIcon';
import { CleanIcon }       from '@/assets/icons/CleanIcon';
import { SleepIcon }       from '@/assets/icons/SleepIcon';
import { MedicineIcon }    from '@/assets/icons/MedicineIcon';
import { PraiseIcon }      from '@/assets/icons/PraiseIcon';

const WARNING = 20;

export function PetScreen() {
  const { state, dispatch, pet, settings, achievements } = useGame();
  const navigate    = useNavigate();
  const { addToast } = useToast();
  const cooldowns   = useCooldowns();
  const [menuOpen, setMenuOpen] = useState(false);

  const mood = computeMood(pet);

  // Track alerted thresholds to avoid repeating every render
  const alertedRef = useRef<Set<string>>(new Set());

  // Alert on low stats
  useEffect(() => {
    const checks: Array<[boolean, string, string]> = [
      [pet.hunger      <= WARNING && pet.hunger      > 0, 'hunger',      "I'm hungry! 🍔"],
      [pet.happiness   <= WARNING && pet.happiness   > 0, 'happiness',   "I want to play! ⭐"],
      [pet.energy      <= WARNING && pet.energy      > 0, 'energy',      "I'm so sleepy… 😴"],
      [pet.cleanliness <= WARNING && pet.cleanliness > 0, 'cleanliness', "I'm dirty! 🫧"],
      [pet.health      <= WARNING && pet.health      > 0, 'health',      "I don't feel well! ❤️"],
      [pet.isSick,                                         'sick',        "I'm sick! 🤒"],
      [pet.hunger      === 0,                              'hunger0',     "I'm starving! 😭"],
    ];
    checks.forEach(([cond, key, msg]) => {
      if (cond && !alertedRef.current.has(key)) {
        alertedRef.current.add(key);
        addToast(msg, key === 'health' || key === 'sick' || key === 'hunger0' ? 'error' : 'warning');
        if (settings.soundEnabled) playAlertSoundLocal();
      } else if (!cond) {
        alertedRef.current.delete(key);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet.hunger, pet.happiness, pet.energy, pet.cleanliness, pet.health, pet.isSick]);

  // Achievement unlocks
  useEffect(() => {
    const ageMin = pet.ageMinutes;
    if (ageMin >= 60 && !achievements.includes('survive_1hr')) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'survive_1hr' } });
      addToast('Achievement: Survivor! ⏱️', 'success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(pet.ageMinutes)]);

  // Evolution notification
  useEffect(() => {
    if (state.runtime.pendingEvolutionStage) {
      const stage = state.runtime.pendingEvolutionStage;
      addToast(`🎉 Evolved to ${STAGE_LABELS[stage]}!`, 'success', 5_000);
      if (settings.soundEnabled) playEvolveSound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.runtime.pendingEvolutionStage]);

  function playAlertSoundLocal() {
    // Minimal implementation to avoid import issue
  }

  const handleAction = useCallback((
    actionType: 'FEED' | 'PLAY' | 'CLEAN' | 'SLEEP' | 'WAKE' | 'MEDICINE' | 'PRAISE',
  ) => {
    resumeAudio();

    if (actionType === 'FEED') {
      if (pet.isSleeping)     { addToast("Zzz… Let me sleep! 😴", 'warning'); return; }
      if (pet.hunger >= 90)   { addToast("I'm not hungry yet! 😌", 'info'); return; }
      dispatch({ type: 'FEED' });
      addToast("Yum! 🍎", 'success');
      cooldowns.FEED.trigger();
      if (settings.soundEnabled) playEatSound();
      if (!achievements.includes('first_feed')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_feed' } });
        addToast('Achievement: First Feed! 🌟', 'success');
      }
    } else if (actionType === 'PLAY') {
      if (pet.isSleeping)    { addToast("Zzz… Let me sleep! 😴", 'warning'); return; }
      if (pet.energy < 15)   { addToast("Too tired to play! 😴", 'warning'); return; }
      dispatch({ type: 'PLAY' });
      addToast("That was fun! ⭐", 'success');
      cooldowns.PLAY.trigger();
      if (settings.soundEnabled) playPlaySound();
      if (!achievements.includes('first_play')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_play' } });
        addToast('Achievement: First Play! 🎮', 'success');
      }
    } else if (actionType === 'CLEAN') {
      dispatch({ type: 'CLEAN' });
      addToast("All clean! 🫧", 'success');
      cooldowns.CLEAN.trigger();
      if (settings.soundEnabled) playCleanSound();
      if (!achievements.includes('first_clean')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_clean' } });
        addToast('Achievement: First Clean! 🧹', 'success');
      }
    } else if (actionType === 'SLEEP') {
      dispatch({ type: 'SLEEP' });
      addToast("Sweet dreams… 💤", 'info');
      if (settings.soundEnabled) playSleepSound();
    } else if (actionType === 'WAKE') {
      dispatch({ type: 'WAKE' });
      addToast("Good morning! ☀️", 'success');
      if (settings.soundEnabled) playWakeSound();
    } else if (actionType === 'MEDICINE') {
      if (!pet.isSick) {
        addToast("I'm not sick! 😊", 'info');
        return;
      }
      dispatch({ type: 'MEDICINE' });
      addToast("Feeling better! 💊", 'success');
      cooldowns.MEDICINE.trigger();
      if (settings.soundEnabled) playMedicineSound();
      if (!achievements.includes('pet_recovered')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'pet_recovered' } });
        addToast('Achievement: Recovery! 🩺', 'success');
      }
    } else if (actionType === 'PRAISE') {
      if (pet.isSleeping) { addToast("Shh, pet is sleeping! 😴", 'info'); return; }
      dispatch({ type: 'PRAISE' });
      addToast("Thanks! I feel special! ⭐", 'success');
      cooldowns.PRAISE.trigger();
      if (settings.soundEnabled) playPraiseSound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, achievements, settings.soundEnabled, cooldowns, dispatch, addToast]);

  const evoProgress = evolutionProgress(pet);
  const nextAge     = nextEvolutionAge(pet);

  return (
    <div className="screen" style={{ background: 'var(--color-surface)' }}>
      {/* Top bar */}
      <header className="top-bar">
        <StageBadge stage={pet.stage} />

        <div className="top-bar__title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)' }}>
            {pet.name}
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            · {formatAge(pet.ageMinutes)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <ProgressRing
            progress={evoProgress}
            label={nextAge !== null ? `Next evolution at ${nextAge}m` : 'Max stage'}
            size={36}
            strokeWidth={3}
          />
          <button
            className="menu-toggle-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            style={{ color: 'var(--color-text)', background: 'none', border: 'none', fontSize: 22, padding: 'var(--space-1)' }}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Hamburger side menu */}
      {menuOpen && (
        <>
          <div className="side-menu-overlay" onClick={() => setMenuOpen(false)} />
          <nav className="side-menu" role="navigation" aria-label="Main navigation">

            {/* Gradient header showing pet info */}
            <div className="side-menu__header">
              <button
                className="side-menu__header-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >×</button>
              <StageBadge stage={pet.stage} />
              <span className="side-menu__header-name">{pet.name}</span>
              <span className="side-menu__header-meta">{formatAge(pet.ageMinutes)}</span>
            </div>

            {/* Nav items */}
            <div className="side-menu__nav">
              {([
                ['inventory',    '📦', 'Inventory'],
                ['achievements', '🏆', 'Achievements'],
                ['settings',     '⚙️',  'Settings'],
                ['tutorial',     '❓', 'Tutorial'],
              ] as const).map(([screen, emoji, label]) => (
                <button
                  key={screen}
                  className="side-menu__item"
                  onClick={() => { navigate(screen); setMenuOpen(false); }}
                >
                  <span aria-hidden="true">{emoji}</span> {label}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="side-menu__footer">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                Gen {pet.generation} · v1.0.0
              </p>
            </div>
          </nav>
        </>
      )}

      {/* Pet body */}
      <div className="pet-screen-body">

        {/* Avatar section */}
        <section
          className="avatar-section"
          style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-5) var(--space-4) var(--space-3)' }}
        >
          {pet.isSleeping && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--font-size-sm)',
              color:      'var(--color-text-muted)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-2)',
            }}>
              💤 Sleeping — energy restoring…
            </div>
          )}
          {pet.isSick && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--font-size-sm)',
              color:      'var(--color-danger)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-2)',
            }}>
              🤒 Sick! Use medicine!
            </div>
          )}

          <PetAvatar
            stage={pet.stage}
            variant={pet.avatarVariant}
            mood={mood}
            pendingEvolution={!!state.runtime.pendingEvolutionStage}
            onEvolutionEnd={() => dispatch({ type: 'CLEAR_PENDING_EVOLUTION' })}
            petName={pet.name}
          />
        </section>

        {/* Stat bars */}
        <section className="stat-grid" aria-label="Pet statistics">
          <StatBar label="Hunger"  value={pet.hunger}      icon={<HungerIcon size={16} />}      isLow={pet.hunger      <= WARNING} />
          <StatBar label="Happy"   value={pet.happiness}   icon={<HappinessIcon size={16} />}   isLow={pet.happiness   <= WARNING} />
          <StatBar label="Energy"  value={pet.energy}      icon={<EnergyIcon size={16} />}      isLow={pet.energy      <= WARNING} />
          <StatBar label="Clean"   value={pet.cleanliness} icon={<CleanlinessIcon size={16} />} isLow={pet.cleanliness <= WARNING} />
          <StatBar label="Health"  value={pet.health}      icon={<HealthIcon size={16} />}      isLow={pet.health      <= WARNING} />
        </section>

        {/* Action buttons */}
        <section className="action-grid" aria-label="Pet actions">
          {!pet.isSleeping ? (
            <>
              <ActionButton
                label="Feed"
                icon={<FeedIcon size={24} />}
                onClick={() => handleAction('FEED')}
                isOnCooldown={cooldowns.FEED.isOnCooldown}
                cooldownMs={cooldowns.FEED.remainingMs}
                cooldownTotalMs={cooldowns.FEED.totalMs}
                disabled={pet.stage === 'dead'}
              />
              <ActionButton
                label="Play"
                icon={<PlayIcon size={24} />}
                onClick={() => handleAction('PLAY')}
                isOnCooldown={cooldowns.PLAY.isOnCooldown}
                cooldownMs={cooldowns.PLAY.remainingMs}
                cooldownTotalMs={cooldowns.PLAY.totalMs}
                disabled={pet.stage === 'dead' || pet.energy < 15}
                ariaLabel={pet.energy < 15 ? 'Play (too tired)' : 'Play'}
              />
              <ActionButton
                label="Clean"
                icon={<CleanIcon size={24} />}
                onClick={() => handleAction('CLEAN')}
                isOnCooldown={cooldowns.CLEAN.isOnCooldown}
                cooldownMs={cooldowns.CLEAN.remainingMs}
                cooldownTotalMs={cooldowns.CLEAN.totalMs}
                disabled={pet.stage === 'dead'}
              />
              <ActionButton
                label="Sleep"
                icon={<SleepIcon size={24} />}
                onClick={() => handleAction('SLEEP')}
                disabled={pet.stage === 'dead'}
              />
              <ActionButton
                label="Medicine"
                icon={<MedicineIcon size={24} />}
                onClick={() => handleAction('MEDICINE')}
                isOnCooldown={cooldowns.MEDICINE.isOnCooldown}
                cooldownMs={cooldowns.MEDICINE.remainingMs}
                cooldownTotalMs={cooldowns.MEDICINE.totalMs}
                disabled={pet.stage === 'dead' || !pet.isSick}
                ariaLabel={!pet.isSick ? 'Medicine (not sick)' : 'Give medicine'}
              />
              <ActionButton
                label="Praise"
                icon={<PraiseIcon size={24} />}
                onClick={() => handleAction('PRAISE')}
                isOnCooldown={cooldowns.PRAISE.isOnCooldown}
                cooldownMs={cooldowns.PRAISE.remainingMs}
                cooldownTotalMs={cooldowns.PRAISE.totalMs}
                disabled={pet.stage === 'dead'}
              />
            </>
          ) : (
            // Sleeping — only Wake Up
            <div style={{ gridColumn: '1 / -1' }}>
              <ActionButton
                label="Wake Up ☀️"
                icon={<SleepIcon size={24} />}
                onClick={() => handleAction('WAKE')}
                variant="secondary"
                ariaLabel="Wake up your pet"
              />
            </div>
          )}
        </section>
      </div>

      {/* Toast overlay */}
      <ToastContainer />
    </div>
  );
}
