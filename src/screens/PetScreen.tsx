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

/* ── Dialog pools ──────────────────────────────────────────────────────────── */

/** Random things the pet says when tapped (no happiness boost). */
const CLICK_DIALOGS: Record<string, string[]> = {
  happy:    [
    "Purr~ ♥", "I love you! ♥", "Yay! ✨", "Wheee! ⭐",
    "Nyaa~! 🐱", "Teehee! ✨", "I'm so happy! 💕", "Best day ever! 🌟",
    "Chirp chirp! 🎵", "So much energy! 🌈",
  ],
  neutral:  [
    "Hmm? 👀", "*blinks*", "Mrrp~", "What's up? 😸",
    "...", "Oh! 😮", "*flicks tail*", "Nyaa?", "Sniff sniff~ 👃",
    "Just chilling 😌",
  ],
  sad:      [
    "*sniff*... 😢", "I'm lonely...", "Mew... 😿",
    "Please cheer me up! 💔", "I need love... 🥺",
    "Nobody plays with me... 😔",
  ],
  sick:     [
    "I don't feel well... 🤒", "*cough* 😷",
    "I need medicine... 💊", "Ugh... 🥴",
  ],
  sleeping: [
    "Zzz... 💤", "*doesn't wake up*", "Mmm... 😴",
    "*shifts position*", "Shhh... 🌙",
  ],
};

/** Special dialogs used when petting actually gives a happiness boost. */
const PET_BOOST_DIALOGS = [
  "Purrrr... ♥♥♥", "That feels nice! 💕", "More please! 🥰",
  "You're the best! ♥", "*happy kneading* ♥", "Ehehe~ 💖",
  "I love pets! ✨", "Nuzzle nuzzle~ ♥", "Don't stop! 🥰",
  "*purrs loudly* 💗",
];

/** Dialogs for each player action and each blocked/guard state. */
const ACTION_DIALOGS = {
  /* ── Feed ─────────────────────── */
  feed: [
    "Yum! 🍎", "Nom nom nom! 😋", "More please! 🥺",
    "So delicious! 🍕", "*munch munch* 😋", "Yummy in my tummy! 🍔",
    "This is amazing! ✨", "I was SO hungry! 🍽️", "Best meal ever! 🌟",
    "Can I have seconds? 🥣",
  ],
  feedFull: [
    "I'm not hungry yet! 😌", "Maybe later... 🙄",
    "I'm still full~ 🤭", "No thanks! 😊", "Ask me again later 🍃",
  ],
  /* ── Play ─────────────────────── */
  play: [
    "That was fun! ⭐", "Again! Again! 🎮", "Wheee! 🌟",
    "I love playing! 💫", "Let's do that again! ⭐", "So fun! 🎉",
    "*bounces excitedly* 🎊", "Yay! More games! 🕹️",
    "I'm the champion! 🏆", "Catch me if you can! 🐾",
  ],
  playTired: [
    "Too tired to play! 😴", "Let me rest first... 💤",
    "I need a nap first... 😮‍💨", "No energy... 😓", "Zzzz... later? 💤",
  ],
  /* ── Clean ────────────────────── */
  clean: [
    "All clean! 🫧", "Squeaky clean! ✨", "I feel so fresh! 🛁",
    "Mmm, I smell nice now! 🌸", "*shakes water off* 🚿",
    "Spick and span! 🧼", "So sparkly! ✨", "Ahh, much better! 🌼",
    "I love bath time! 🛁", "Fresh as a daisy! 🌷",
  ],
  /* ── Sleep ────────────────────── */
  sleep: [
    "Sweet dreams… 💤", "Nighty night~ 🌙", "Zzz... 😴",
    "Time to rest... 💤", "*yawns* 🌙", "Good night! 🌠",
    "Don't wake me up! 😴", "Counting sheep... 🐑",
  ],
  /* ── Wake ─────────────────────── */
  wake: [
    "Good morning! ☀️", "Rise and shine! 🌅", "Ready for the day! 🌞",
    "*stretches* ☀️", "Time to have fun! ✨", "Feeling refreshed! 💪",
    "I'm wide awake! 👀", "What are we doing today? 🌈",
  ],
  /* ── Medicine ─────────────────── */
  medicine: [
    "Feeling better! 💊", "That really helped! 🩺", "I feel much better! ✨",
    "*cough* ...thanks 😮‍💨", "The medicine worked! 💊",
    "All better now! 🌟", "Back to full health! 💪",
  ],
  medicineHealthy: [
    "I'm not sick! 😊", "I feel totally fine! 💪",
    "Save it for later~ 😊", "No medicine needed! ✨",
  ],
  /* ── Praise ───────────────────── */
  praise: [
    "Thanks! I feel special! ⭐", "You're so nice! 💕",
    "*blushes* 😊", "I'm the best! 🌟", "Aww, thank you! 💖",
    "More praise please! 😊", "*happy spin* ⭐",
    "I feel so loved! 💕", "You always know what to say! 🌸",
    "I'll never forget this! 🌟",
  ],
  /* ── Shared blocker ───────────── */
  sleeping: [
    "Zzz… Let me sleep! 😴", "Shh... I'm sleeping! 🌙",
    "Not now... 💤", "*doesn't stir* 😴", "Talk to me later~ 🌙",
  ],
};

/** Pools for the low-stat alert speech bubble. */
const ALERT_DIALOGS = {
  hunger:      ["I'm hungry! 🍔", "Feed me please! 🥺", "My tummy is growling! 🍽️", "I need food! 🍎"],
  happiness:   ["I want to play! ⭐", "I'm bored... 😑", "Entertain me! 🎮", "I need fun! 🎉"],
  energy:      ["I'm so sleepy… 😴", "I need a nap... 💤", "So tired... 😮‍💨", "Can I sleep? 🌙"],
  cleanliness: ["I'm dirty! 🫧", "I smell bad... 😅", "Gimme a bath! 🛁", "I'm so grimy! 😖"],
  health:      ["I don't feel well! ❤️", "I feel weak... 😔", "Something's wrong... 💔", "Help me! ❤️"],
  sick:        ["I'm sick! 🤒", "I need medicine! 💊", "I feel awful... 🤢", "Cough cough... 😷"],
  hunger0:     ["I'm starving! 😭", "Please feed me!! 😭", "I'm so hungry... 💔", "I might faint! 😵"],
};

const PET_COOLDOWN_MS = 8_000;   // 8 s between happiness boosts from petting

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Blush-puff cursor SVG (shown in cleaning mode) ── */
function BlushPuffCursor() {
  return (
    <svg width="44" height="50" viewBox="0 0 44 50" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
      {/* Outer soft glow ring */}
      <circle cx="22" cy="19" r="16" fill="#FFD6EC" opacity="0.45"/>
      {/* Main puff body */}
      <circle cx="22" cy="19" r="13" fill="#FFB3D0"/>
      <circle cx="22" cy="19" r="10" fill="#FF9ABF"/>
      {/* Fluffy highlight blobs */}
      <circle cx="15" cy="13" r="5"   fill="#FFE8F4" opacity="0.75"/>
      <circle cx="26" cy="12" r="4"   fill="#FFE8F4" opacity="0.60"/>
      <circle cx="18" cy="24" r="3.5" fill="#FFE8F4" opacity="0.45"/>
      {/* Handle */}
      <rect x="19" y="31" width="7" height="15" rx="3.5" fill="#D4A0B8"/>
      <rect x="20" y="31" width="5" height="5"  rx="1"   fill="#E8C0D4" opacity="0.6"/>
      {/* Cross sparkle — top right */}
      <rect x="33" y="5"  width="2" height="8"  rx="1" fill="#FF6B9D" opacity="0.85"/>
      <rect x="30" y="8"  width="8" height="2"  rx="1" fill="#FF6B9D" opacity="0.85"/>
      {/* Cross sparkle — top left */}
      <rect x="5"  y="10" width="1.5" height="6" rx="0.75" fill="#FFB3D0" opacity="0.7"/>
      <rect x="2.5" y="12.5" width="6" height="1.5" rx="0.75" fill="#FFB3D0" opacity="0.7"/>
      {/* Dot accent */}
      <circle cx="36" cy="14" r="2" fill="#FF9ABF" opacity="0.6"/>
    </svg>
  );
}

export function PetScreen() {
  const { state, dispatch, pet, settings, achievements } = useGame();
  const coins               = state.save.coins               ?? 0;
  const equippedAccessories = state.save.equippedAccessories ?? {};
  const equippedAccessoryIds = Object.values(equippedAccessories).filter(Boolean) as string[];
  const navigate    = useNavigate();
  const { addToast } = useToast();
  const cooldowns   = useCooldowns();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [statExpanded,   setStatExpanded]   = useState(true);
  const [isCleaningMode, setIsCleaningMode] = useState(false);
  const blushCursorRef = useRef<HTMLDivElement>(null);

  // ── Food in room ─────────────────────────────────────────────
  /** Position of the food bowl on the floor (null = no food visible). */
  const [foodPos, setFoodPos] = useState<{ x: number; y: number } | null>(null);

  // ── Toy in room ──────────────────────────────────────────────
  /** Position of the yarn-ball toy on the floor (null = no toy visible). */
  const [toyPos, setToyPos] = useState<{ x: number; y: number } | null>(null);

  // Clear room props when the pet falls asleep
  useEffect(() => {
    if (pet.isSleeping) {
      setFoodPos(null);
      setToyPos(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet.isSleeping]);

  // ── Pet speech bubble ────────────────────────────────────────
  const [petSpeech,    setPetSpeech]    = useState<string | null>(null);
  const [petSpeechKey, setPetSpeechKey] = useState(0);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** Show a message in the pet's speech bubble (auto-dismisses). */
  const petSay = useCallback((msg: string, durationMs = 3000) => {
    clearTimeout(speechTimerRef.current);
    setPetSpeech(msg);
    setPetSpeechKey(k => k + 1);
    speechTimerRef.current = setTimeout(() => setPetSpeech(null), durationMs);
  }, []);

  useEffect(() => () => clearTimeout(speechTimerRef.current), []);

  // ── Pet-click / petting cooldown ────────────────────────────
  /** Timestamp (ms) when the next happiness-boost pet is allowed. */
  const petCooldownEndRef = useRef<number>(0);

  const handlePetClick = useCallback(() => {
    const now  = Date.now();
    const mood = computeMood(pet);
    if (mood === 'dead') return;

    const canBoost = now >= petCooldownEndRef.current && !pet.isSleeping;

    if (canBoost) {
      // Give a small happiness nudge and show affectionate dialog
      dispatch({ type: 'PET' });
      petCooldownEndRef.current = now + PET_COOLDOWN_MS;
      petSay(pickRandom(PET_BOOST_DIALOGS), 3_000);
    } else {
      // On cooldown or sleeping — just react verbally, no stat boost
      const pool = CLICK_DIALOGS[mood] ?? CLICK_DIALOGS.neutral;
      if (pool.length > 0) petSay(pickRandom(pool), 2_500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, dispatch, petSay]);
  // ────────────────────────────────────────────────────────────

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

  // ── Cleaning-mode helpers ────────────────────────────────────
  /** Track mouse position and move the floating blush cursor. */
  useEffect(() => {
    if (!isCleaningMode) return;
    const onMove = (e: MouseEvent) => {
      if (blushCursorRef.current) {
        blushCursorRef.current.style.left = `${e.clientX}px`;
        blushCursorRef.current.style.top  = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [isCleaningMode]);

  /** Escape key cancels cleaning mode. */
  useEffect(() => {
    if (!isCleaningMode) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsCleaningMode(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isCleaningMode]);

  /** Auto-cancel if the pet falls asleep or dies while blush is active. */
  useEffect(() => {
    if (isCleaningMode && (pet.isSleeping || pet.stage === 'dead')) {
      setIsCleaningMode(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet.isSleeping, pet.stage]);
  // ────────────────────────────────────────────────────────────

  const mood = computeMood(pet);

  // Track alerted thresholds to avoid repeating every render
  const alertedRef = useRef<Set<string>>(new Set());

  // Alert on low stats — shown in the pet's speech bubble
  useEffect(() => {
    const checks: Array<[boolean, string, string]> = [
      [pet.hunger      <= WARNING && pet.hunger      > 0, 'hunger',      pickRandom(ALERT_DIALOGS.hunger)],
      [pet.happiness   <= WARNING && pet.happiness   > 0, 'happiness',   pickRandom(ALERT_DIALOGS.happiness)],
      [pet.energy      <= WARNING && pet.energy      > 0, 'energy',      pickRandom(ALERT_DIALOGS.energy)],
      [pet.cleanliness <= WARNING && pet.cleanliness > 0, 'cleanliness', pickRandom(ALERT_DIALOGS.cleanliness)],
      [pet.health      <= WARNING && pet.health      > 0, 'health',      pickRandom(ALERT_DIALOGS.health)],
      [pet.isSick,                                         'sick',        pickRandom(ALERT_DIALOGS.sick)],
      [pet.hunger      === 0,                              'hunger0',     pickRandom(ALERT_DIALOGS.hunger0)],
    ];
    checks.forEach(([cond, key, msg]) => {
      if (cond && !alertedRef.current.has(key)) {
        alertedRef.current.add(key);
        petSay(msg, 5_000);
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
      if (pet.isSleeping)   { petSay(pickRandom(ACTION_DIALOGS.sleeping));  return; }
      if (pet.hunger >= 90) { petSay(pickRandom(ACTION_DIALOGS.feedFull));  return; }
      // Place the food bowl on the floor — the pet will walk to it and eat it.
      // Stats + sound fire via handleFoodConsumed when the pet arrives.
      const fx = 18 + Math.random() * 57;   // x: 18–75 %
      const fy = 68 + Math.random() * 10;   // y: 68–78 % (floor band)
      setFoodPos({ x: fx, y: fy });
      cooldowns.FEED.trigger();
    } else if (actionType === 'PLAY') {
      if (pet.isSleeping)  { petSay(pickRandom(ACTION_DIALOGS.sleeping));  return; }
      if (pet.energy < 15) { petSay(pickRandom(ACTION_DIALOGS.playTired)); return; }
      // Place the yarn-ball toy on the floor — the pet walks to it.
      // Stats + sound fire via handleToyConsumed when the pet arrives.
      const tx = 18 + Math.random() * 57;   // x: 18–75 %
      const ty = 68 + Math.random() * 10;   // y: 68–78 % (floor band)
      setToyPos({ x: tx, y: ty });
      cooldowns.PLAY.trigger();
    } else if (actionType === 'CLEAN') {
      if (pet.isSleeping) { petSay(pickRandom(ACTION_DIALOGS.sleeping)); return; }
      dispatch({ type: 'CLEAN' });
      triggerSprite('grooming', 2500);
      petSay(pickRandom(ACTION_DIALOGS.clean));
      cooldowns.CLEAN.trigger();
      if (settings.soundEnabled) playCleanSound();
      if (!achievements.includes('first_clean')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_clean' } });
        addToast('Achievement: First Clean! 🧹', 'success');
      }
    } else if (actionType === 'SLEEP') {
      dispatch({ type: 'SLEEP' });
      petSay(pickRandom(ACTION_DIALOGS.sleep));
      cooldowns.SLEEP.trigger();
      if (settings.soundEnabled) playSleepSound();
    } else if (actionType === 'WAKE') {
      dispatch({ type: 'WAKE' });
      triggerSprite('stretching', 1600);
      petSay(pickRandom(ACTION_DIALOGS.wake));
      cooldowns.SLEEP.trigger();
      if (settings.soundEnabled) playWakeSound();
    } else if (actionType === 'MEDICINE') {
      if (!pet.isSick) {
        petSay(pickRandom(ACTION_DIALOGS.medicineHealthy));
        return;
      }
      dispatch({ type: 'MEDICINE' });
      triggerSprite('medicine', 1700);
      petSay(pickRandom(ACTION_DIALOGS.medicine));
      cooldowns.MEDICINE.trigger();
      if (settings.soundEnabled) playMedicineSound();
      if (!achievements.includes('pet_recovered')) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'pet_recovered' } });
        addToast('Achievement: Recovery! 🩺', 'success');
      }
    } else if (actionType === 'PRAISE') {
      if (pet.isSleeping) { petSay(pickRandom(ACTION_DIALOGS.sleeping)); return; }
      dispatch({ type: 'PRAISE' });
      triggerSprite('praising', 1800);
      petSay(pickRandom(ACTION_DIALOGS.praise));
      cooldowns.PRAISE.trigger();
      if (settings.soundEnabled) playPraiseSound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, achievements, settings.soundEnabled, cooldowns, dispatch, addToast, petSay, triggerSprite]);

  /** Executes the clean action after the player clicks the pet in cleaning mode. */
  const handleCleanPet = useCallback(() => {
    setIsCleaningMode(false);
    dispatch({ type: 'CLEAN' });
    triggerSprite('grooming', 2500);
    petSay(pickRandom(ACTION_DIALOGS.clean));
    cooldowns.CLEAN.trigger();
    if (settings.soundEnabled) playCleanSound();
    if (!achievements.includes('first_clean')) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_clean' } });
      addToast('Achievement: First Clean! 🧹', 'success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, triggerSprite, petSay, cooldowns, settings.soundEnabled, achievements, addToast]);

  /** Called by PetAvatar when the pet walks to the food bowl and eats it. */
  const handleFoodConsumed = useCallback(() => {
    setFoodPos(null);
    dispatch({ type: 'FEED' });
    triggerSprite('eating', 1800);
    petSay(pickRandom(ACTION_DIALOGS.feed));
    if (settings.soundEnabled) playEatSound();
    if (!achievements.includes('first_feed')) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_feed' } });
      addToast('Achievement: First Feed! 🌟', 'success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, triggerSprite, petSay, settings.soundEnabled, achievements, addToast]);

  /** Called by PetAvatar when the pet walks to the yarn ball and plays with it. */
  const handleToyConsumed = useCallback(() => {
    setToyPos(null);
    dispatch({ type: 'PLAY' });
    triggerSprite('playing', 2000);
    petSay(pickRandom(ACTION_DIALOGS.play));
    if (settings.soundEnabled) playPlaySound();
    if (!achievements.includes('first_play')) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first_play' } });
      addToast('Achievement: First Play! 🎮', 'success');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, triggerSprite, petSay, settings.soundEnabled, achievements, addToast]);

  const evoProgress = evolutionProgress(pet);
  const nextAge     = nextEvolutionAge(pet);

  return (
    <div className="screen" style={{ background: 'var(--color-surface)', cursor: isCleaningMode ? 'none' : undefined }}>
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
          {/* Coin balance chip */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          3,
            background:   'rgba(255,215,0,0.18)',
            border:       '1.5px solid #E6A800',
            borderRadius: 'var(--radius-full)',
            padding:      '2px 7px',
            fontFamily:   'var(--font-display)',
            fontSize:     '0.45rem',
            color:        '#7A5C00',
            lineHeight:   1,
          }}>
            🪙{coins}
          </div>
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
                ['accessory',    '👗', 'Accessory Shop'],
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
                  <span aria-hidden="true" style={{ flexShrink: 0 }}>{emoji}</span>
                  <span style={{ flexShrink: 0 }}>{label}</span>
                  {screen === 'accessory' && (
                    <span style={{
                      marginLeft:   'auto',
                      flexShrink:   0,
                      display:      'inline-flex',
                      alignItems:   'center',
                      gap:          3,
                      fontFamily:   'var(--font-display)',
                      fontSize:     '0.45rem',
                      color:        '#7A5C00',
                      background:   'rgba(255,215,0,0.2)',
                      border:       '1.5px solid #E6A800',
                      borderRadius: 'var(--radius-full)',
                      padding:      '2px 6px',
                    }}>
                      🪙{coins}
                    </span>
                  )}
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

          {/* Cleaning-mode hint */}
          {isCleaningMode && (
            <div style={{
              position:      'absolute',
              top:           8,
              left:          '50%',
              transform:     'translateX(-50%)',
              background:    'rgba(126,200,227,0.93)',
              color:         '#0d2d3a',
              padding:       '4px 14px',
              borderRadius:  20,
              fontSize:      '0.68rem',
              fontWeight:    700,
              zIndex:        20,
              pointerEvents: 'none',
              whiteSpace:    'nowrap',
              boxShadow:     '0 2px 8px rgba(126,200,227,0.4)',
              fontFamily:    'var(--font-body)',
              animation:     'fade-in 0.2s ease-out',
            }}>
              🫧 Click your pet to clean!
            </div>
          )}

          <PetAvatar
            stage={pet.stage}
            variant={pet.avatarVariant}
            mood={mood}
            pendingEvolution={!!state.runtime.pendingEvolutionStage}
            onEvolutionEnd={() => dispatch({ type: 'CLEAR_PENDING_EVOLUTION' })}
            petName={pet.name}
            activeAnimation={activeAnimation}
            speechMessage={petSpeech}
            speechMessageKey={petSpeechKey}
            onPetClick={handlePetClick}
            isCleaningMode={isCleaningMode}
            onCleanClick={handleCleanPet}
            onCancelClean={() => setIsCleaningMode(false)}
            foodPos={foodPos}
            onFoodConsumed={handleFoodConsumed}
            toyPos={toyPos}
            onToyConsumed={handleToyConsumed}
            equippedAccessoryIds={equippedAccessoryIds}
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
            label={isCleaningMode ? 'Cancel ✕' : 'Clean'}
            icon={<CleanIcon size={24} />}
            onClick={() => {
              if (isCleaningMode) { setIsCleaningMode(false); return; }
              resumeAudio();
              if (pet.isSleeping) { petSay(pickRandom(ACTION_DIALOGS.sleeping)); return; }
              if (pet.stage === 'dead') return;
              setIsCleaningMode(true);
              petSay('Ready for a bath! 🛁', 2_000);
            }}
            isOnCooldown={cooldowns.CLEAN.isOnCooldown}
            cooldownMs={cooldowns.CLEAN.remainingMs}
            cooldownTotalMs={cooldowns.CLEAN.totalMs}
            disabled={pet.stage === 'dead' || pet.isSleeping}
            accent={isCleaningMode ? 'rgba(126,200,227,0.60)' : 'rgba(126,200,227,0.28)'}
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

      {/* Floating blush-puff cursor — follows mouse during cleaning mode */}
      <div
        ref={blushCursorRef}
        style={{
          position:      'fixed',
          pointerEvents: 'none',
          zIndex:        9999,
          left:          '-100px',
          top:           '-100px',
          transform:     'translate(-50%, -50%)',
          display:       isCleaningMode ? 'block' : 'none',
        }}
      >
        <div style={{
          animation: 'blush-cursor-bob 0.7s ease-in-out infinite',
          filter:    'drop-shadow(0 2px 8px rgba(255,107,157,0.45))',
        }}>
          <BlushPuffCursor />
        </div>
      </div>
    </div>
  );
}
