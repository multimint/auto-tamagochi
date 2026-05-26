import { useRef, useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { EggSprite }  from '@/assets/sprites/EggSprite';
import { BabySprite } from '@/assets/sprites/BabySprite';
import { StatBar }    from '@/components/StatBar';
import { HungerIcon }      from '@/assets/icons/HungerIcon';
import { HappinessIcon }   from '@/assets/icons/HappinessIcon';
import { EnergyIcon }      from '@/assets/icons/EnergyIcon';
import { CleanlinessIcon } from '@/assets/icons/CleanlinessIcon';
import { HealthIcon }      from '@/assets/icons/HealthIcon';

interface TutorialStep {
  title:         string;
  body:          string;
  illustration:  React.ReactNode;
}

const STEPS: TutorialStep[] = [
  {
    title: 'Welcome!',
    body:  'This is your new pet. Give it a name and take good care of it to help it grow and thrive!',
    illustration: <div style={{ width: 140, height: 140 }}><EggSprite mood="happy" className="anim-idle" style={{ width: '100%', height: '100%' }} /></div>,
  },
  {
    title: 'Stats',
    body:  'These bars show your pet\'s needs. Keep them all above 20! If any reaches 0, your pet\'s health will start to drop.',
    illustration: (
      <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <StatBar label="Hunger"  value={72} icon={<HungerIcon size={14} />} />
        <StatBar label="Happy"   value={60} icon={<HappinessIcon size={14} />} />
        <StatBar label="Energy"  value={45} icon={<EnergyIcon size={14} />} />
        <StatBar label="Clean"   value={80} icon={<CleanlinessIcon size={14} />} />
        <StatBar label="Health"  value={95} icon={<HealthIcon size={14} />} />
      </div>
    ),
  },
  {
    title: '🍎 Feeding',
    body:  'Click "Feed" to give your pet food. It restores hunger (+25) and a little happiness (+5). Don\'t overfeed — the button has a 30-second cooldown.',
    illustration: <div style={{ width: 120, height: 120 }}><BabySprite mood="happy" className="anim-eating" style={{ width: '100%', height: '100%' }} /></div>,
  },
  {
    title: '⚽ Playing',
    body:  'Click "Play" to boost happiness (+20). But it costs energy (–15) and makes your pet hungry (–5). If energy is below 15, playing is disabled.',
    illustration: <div style={{ width: 120, height: 120 }}><BabySprite mood="happy" className="anim-happy" style={{ width: '100%', height: '100%' }} /></div>,
  },
  {
    title: '💤 Sleep & Clean',
    body:  'Put your pet to sleep to restore energy. While sleeping, hunger decays at half rate. Use "Clean" to restore cleanliness to 100 — dirt causes sickness!',
    illustration: <div style={{ width: 120, height: 120 }}><BabySprite mood="sleeping" className="anim-sleeping" style={{ width: '100%', height: '100%' }} /></div>,
  },
  {
    title: '📴 Offline Progress',
    body:  'Your pet keeps aging even when the app is closed! Stats decay while you\'re away (up to 8 hours). Come back regularly to keep your pet healthy.',
    illustration: (
      <div style={{ textAlign: 'center', fontSize: 64 }}>⏱️</div>
    ),
  },
  {
    title: '🎉 Have Fun!',
    body:  'Take good care of your pet and watch it grow from Egg → Baby → Child → Teen → Adult → Elder. Earn achievements along the way!',
    illustration: <div style={{ width: 120, height: 120 }}><BabySprite mood="happy" className="anim-idle" style={{ width: '100%', height: '100%' }} /></div>,
  },
];

export function TutorialScreen() {
  const { dispatch } = useGame();
  const navigate     = useNavigate();
  const [step, setStep] = useState(0);
  const nextBtnRef   = useRef<HTMLButtonElement>(null);

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  function finish() {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { showTutorialOnStart: false } });
    navigate('pet');
  }

  function goNext() {
    if (isLast) { finish(); return; }
    setStep(s => s + 1);
    nextBtnRef.current?.focus();
  }

  return (
    <div className="tutorial-screen">
      {/* Skip button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-3) var(--space-4)' }}>
        <button
          onClick={finish}
          aria-label="Skip tutorial"
          style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--font-size-sm)',
            fontWeight:   'var(--font-weight-semi)',
            color:        'var(--color-text-muted)',
            background:   'transparent',
            border:       '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding:      'var(--space-1) var(--space-4)',
            cursor:       'pointer',
            lineHeight:   1.4,
            letterSpacing: '0.01em',
          }}
        >
          Skip tutorial
        </button>
      </div>

      {/* Step content */}
      <div className="tutorial-content" role="dialog" aria-modal="true" aria-label={`Tutorial step ${step + 1} of ${STEPS.length}: ${current.title}`}>
        {/* Illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: 160 }}>
          {current.illustration}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.55rem, 3.5vw, 0.875rem)', color: 'var(--color-primary)', lineHeight: 1.6, textAlign: 'center' }}>
          {current.title}
        </h1>

        {/* Body */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', color: 'var(--color-text)', lineHeight: 1.7, textAlign: 'center', maxWidth: 320 }}>
          {current.body}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }} role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width:        i === step ? 16 : 8,
                height:       8,
                borderRadius: 'var(--radius-full)',
                background:   i === step ? 'var(--color-primary)' : 'var(--color-border)',
                transition:   'width var(--transition-normal), background var(--transition-normal)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation footer */}
      <footer className="tutorial-footer">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-base)', color: step === 0 ? 'var(--color-border)' : 'var(--color-text)', background: 'none', border: 'none', cursor: step === 0 ? 'default' : 'pointer', minHeight: 44 }}
        >
          ← Back
        </button>

        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          {step + 1} / {STEPS.length}
        </span>

        <button
          ref={nextBtnRef}
          onClick={goNext}
          style={{
            padding:      'var(--space-2) var(--space-5)',
            background:   'var(--color-primary)',
            color:        'white',
            borderRadius: 'var(--radius-lg)',
            fontFamily:   'var(--font-body)',
            fontWeight:   'var(--font-weight-bold)',
            fontSize:     'var(--font-size-base)',
            border:       'none',
            minHeight:    44,
          }}
        >
          {isLast ? "Let's Play! 🎉" : "Next →"}
        </button>
      </footer>
    </div>
  );
}
