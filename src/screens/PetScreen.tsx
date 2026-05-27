import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';
import { useCooldowns } from '@/hooks/useCooldowns';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [statExpanded, setStatExpanded] = useState(true);

  // ── Sprite action animation ─────────────────────────────────
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const triggerSprite = useCallback((key: string, ms = 2000) => {
    clearTimeout(animTimerRef.current);
    setActiveAnimation(key);
    animTimerRef.current = setTimeout(() => setActiveAnimation(null), ms);
  }, []);

  // Clean up on unmount
  useEffect(() => () => clearTimeout(animTimerRef.current), []);
  // ────────────────────────────────────────────────────────────

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
      triggerSprite('eating', 1800);
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
      triggerSprite('playing', 2000);
      addToast("That was fun! ⭐", 'success');
      cooldowns.PLAY.trigger();
      if (settings.soundEnabled) playPlaySound();
      if (!achievements.includes('first_play')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_play' } });
        addToast('Achievement: First Play! 🎮', 'success');
      }
    } else if (actionType === 'CLEAN') {
      dispatch({ type: 'CLEAN' });
      triggerSprite('grooming', 2500);
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
      cooldowns.SLEEP.trigger();
      if (settings.soundEnabled) playSleepSound();
    } else if (actionType === 'WAKE') {
      dispatch({ type: 'WAKE' });
      triggerSprite('stretching', 1600);
      addToast("Good morning! ☀️", 'success');
      cooldowns.SLEEP.trigger();
      if (settings.soundEnabled) playWakeSound();
    } else if (actionType === 'MEDICINE') {
      if (!pet.isSick) {
        addToast("I'm not sick! 😊", 'info');
        return;
      }
      dispatch({ type: 'MEDICINE' });
      triggerSprite('medicine', 1700);
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
      triggerSprite('praising', 1800);
      addToast("Thanks! I feel special! ⭐", 'success');
      cooldowns.PRAISE.trigger();
      if (settings.soundEnabled) playPraiseSound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, achievements, settings.soundEnabled, cooldowns, dispatch, addToast, triggerSprite]);

  const evoProgress = evolutionProgress(pet);
  const nextAge     = nextEvolutionAge(pet);

  return (
    <div className="screen" style={{ background: 'var(--color-surface)' }}>
      {/* Top bar */}
      <header className="top-bar">
        <StageBadge stage={pet.stage} />

        <div className="top-bar__title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', lineHeight: 1.2 }}>
            {pet.name}
          </span>
          <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>
            {formatAge(pet.ageMinutes)}
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
            style={{ color: 'var(--color-text)', background: 'none', border: 'none', fontSize: 22 }}
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

        {/* Avatar section — cat roams freely inside */}
        <section className="avatar-section">

          {/* Status banners float above the walking cat */}
          {pet.isSleeping && <div className="status-banner">💤 Sleeping…</div>}
          {pet.isSick     && <div className="status-banner status-banner--sick">🤒 Sick! Use medicine!</div>}

          <PetAvatar
            stage={pet.stage}
            variant={pet.avatarVariant}
            mood={mood}
            pendingEvolution={!!state.runtime.pendingEvolutionStage}
            onEvolutionEnd={() => dispatch({ type: 'CLEAR_PENDING_EVOLUTION' })}
            petName={pet.name}
            activeAnimation={activeAnimation}
          />
        </section>

        {/* Stat bars — inside a collapsible tinted card */}
        <div className="stat-card">
          {/* Header — tap to collapse on mobile */}
          <button
            className="stat-card__header stat-card__toggle"
            onClick={() => !isDesktop && setStatExpanded(v => !v)}
            aria-expanded={statExpanded}
            aria-controls="stat-grid-body"
            style={{ cursor: isDesktop ? 'default' : 'pointer' }}
          >
            <span>STATS</span>
            {/* Chevron — only visible on mobile */}
            <span className={`stat-card__chevron${statExpanded ? ' stat-card__chevron--open' : ''}`} aria-hidden="true">
              ▾
            </span>
          </button>

          {/* Collapsible body */}
          <div
            id="stat-grid-body"
            className={`stat-card__body${statExpanded ? ' stat-card__body--open' : ''}`}
          >
            <section className="stat-grid" aria-label="Pet statistics">
              <StatBar label="Hunger"  value={pet.hunger}      icon={<HungerIcon size={16} />}      isLow={pet.hunger      <= WARNING} />
              <StatBar label="Happy"   value={pet.happiness}   icon={<HappinessIcon size={16} />}   isLow={pet.happiness   <= WARNING} />
              <StatBar label="Energy"  value={pet.energy}      icon={<EnergyIcon size={16} />}      isLow={pet.energy      <= WARNING} />
              <StatBar label="Clean"   value={pet.cleanliness} icon={<CleanlinessIcon size={16} />} isLow={pet.cleanliness <= WARNING} />
              <StatBar label="Health"  value={pet.health}      icon={<HealthIcon size={16} />}      isLow={pet.health      <= WARNING} />
            </section>
          </div>
        </div>

        {/* Action buttons */}
        <section className="action-grid" aria-label="Pet actions">
          <ActionButton
            label="Feed"
            icon={<FeedIcon size={24} />}
            onClick={() => handleAction('FEED')}
            isOnCooldown={cooldowns.FEED.isOnCooldown}
            cooldownMs={cooldowns.FEED.remainingMs}
            cooldownTotalMs={cooldowns.FEED.totalMs}
            disabled={pet.stage === 'dead' || pet.isSleeping}
            accent="rgba(255,204,92,0.28)"
          />
          <ActionButton
            label="Play"
            icon={<PlayIcon size={24} />}
            onClick={() => handleAction('PLAY')}
            isOnCooldown={cooldowns.PLAY.isOnCooldown}
            cooldownMs={cooldowns.PLAY.remainingMs}
            cooldownTotalMs={cooldowns.PLAY.totalMs}
            disabled={pet.stage === 'dead' || pet.isSleeping || pet.energy < 15}
            ariaLabel={pet.energy < 15 ? 'Play (too tired)' : 'Play'}
            accent="rgba(120,216,152,0.28)"
          />
          <ActionButton
            label="Clean"
            icon={<CleanIcon size={24} />}
            onClick={() => handleAction('CLEAN')}
            isOnCooldown={cooldowns.CLEAN.isOnCooldown}
            cooldownMs={cooldowns.CLEAN.remainingMs}
            cooldownTotalMs={cooldowns.CLEAN.totalMs}
            disabled={pet.stage === 'dead' || pet.isSleeping}
            accent="rgba(126,200,227,0.28)"
          />
          {/* Sleep / Wake Up — swaps based on isSleeping, shares a 10 s cooldown */}
          {pet.isSleeping ? (
            <ActionButton
              label="Wake Up ☀️"
              icon={<SleepIcon size={24} />}
              onClick={() => handleAction('WAKE')}
              isOnCooldown={cooldowns.SLEEP.isOnCooldown}
              cooldownMs={cooldowns.SLEEP.remainingMs}
              cooldownTotalMs={cooldowns.SLEEP.totalMs}
              disabled={pet.stage === 'dead'}
              ariaLabel="Wake up your pet"
              accent="rgba(255,204,92,0.28)"
            />
          ) : (
            <ActionButton
              label="Sleep"
              icon={<SleepIcon size={24} />}
              onClick={() => handleAction('SLEEP')}
              isOnCooldown={cooldowns.SLEEP.isOnCooldown}
              cooldownMs={cooldowns.SLEEP.remainingMs}
              cooldownTotalMs={cooldowns.SLEEP.totalMs}
              disabled={pet.stage === 'dead'}
              accent="rgba(180,150,220,0.24)"
            />
          )}
          <ActionButton
            label="Medicine"
            icon={<MedicineIcon size={24} />}
            onClick={() => handleAction('MEDICINE')}
            isOnCooldown={cooldowns.MEDICINE.isOnCooldown}
            cooldownMs={cooldowns.MEDICINE.remainingMs}
            cooldownTotalMs={cooldowns.MEDICINE.totalMs}
            disabled={pet.stage === 'dead' || pet.isSleeping || !pet.isSick}
            ariaLabel={!pet.isSick ? 'Medicine (not sick)' : 'Give medicine'}
            accent="rgba(255,126,144,0.28)"
          />
          <ActionButton
            label="Praise"
            icon={<PraiseIcon size={24} />}
            onClick={() => handleAction('PRAISE')}
            isOnCooldown={cooldowns.PRAISE.isOnCooldown}
            cooldownMs={cooldowns.PRAISE.remainingMs}
            cooldownTotalMs={cooldowns.PRAISE.totalMs}
            disabled={pet.stage === 'dead' || pet.isSleeping}
            accent="rgba(255,107,157,0.28)"
          />
        </section>
      </div>

      {/* Toast overlay */}
      <ToastContainer />
    </div>
  );
}
