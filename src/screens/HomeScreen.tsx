import { useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { loadSave } from '@/utils/localStorage';
import { nowMs } from '@/utils/timeUtils';
import { createFreshSave } from '@/reducer/initialState';
import { EggSprite } from '@/assets/sprites/EggSprite';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function HomeScreen() {
  const { dispatch, pet } = useGame();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const formMaxWidth = isDesktop ? 480 : 320;
  const [petName, setPetName] = useState('');
  const [nameError, setNameError] = useState('');
  const existingSave = loadSave();

  function validateName(value: string): string {
    if (!value.trim()) return 'Please enter a name';
    if (value.trim().length > 12) return 'Name must be 12 characters or less';
    if (!/^[a-zA-Z0-9 ]+$/.test(value.trim())) return 'Only letters, numbers, and spaces';
    return '';
  }

  function handleStart() {
    const error = validateName(petName);
    if (error) { setNameError(error); return; }
    const freshSave = createFreshSave(petName.trim(), pet.generation);
    dispatch({ type: 'LOAD', payload: { save: freshSave } });
    // Show tutorial on first time
    if (freshSave.settings.showTutorialOnStart) {
      navigate('tutorial');
    } else {
      navigate('pet');
    }
  }

  function handleContinue() {
    if (!existingSave) return;
    dispatch({ type: 'LOAD', payload: { save: existingSave } });
    dispatch({ type: 'RECONCILE_OFFLINE', payload: { nowMs: nowMs() } });
    if (existingSave.pet.stage === 'dead') {
      navigate('gameover');
    } else {
      navigate('pet');
    }
  }

  return (
    <main className="home-screen" style={{ background: 'var(--color-bg)', position: 'relative' }}>

      {/* Floating pixel sparkles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[
          { left: '10%',  top: '72%', size: 8,  delay: '0s',    dur: '3.5s', color: '#FF6B9D' },
          { left: '25%',  top: '80%', size: 6,  delay: '0.7s',  dur: '4s',   color: '#7EC8E3' },
          { left: '60%',  top: '75%', size: 10, delay: '1.2s',  dur: '3s',   color: '#FF6B9D' },
          { left: '75%',  top: '65%', size: 6,  delay: '0.3s',  dur: '4.5s', color: '#FFB3D0' },
          { left: '85%',  top: '85%', size: 8,  delay: '1.8s',  dur: '3.8s', color: '#7EC8E3' },
          { left: '45%',  top: '88%', size: 5,  delay: '0.9s',  dur: '3.2s', color: '#FF6B9D' },
          { left: '5%',   top: '55%', size: 7,  delay: '2.1s',  dur: '4.2s', color: '#FFB3D0' },
          { left: '90%',  top: '60%', size: 6,  delay: '1.5s',  dur: '3.6s', color: '#7EC8E3' },
        ].map((s, i) => (
          <div key={i} style={{
            position:       'absolute', left: s.left, top: s.top,
            width:          s.size, height: s.size, borderRadius: 2,
            background:     s.color, transform: 'rotate(45deg)',
            animation:      `sparkle-drift ${s.dur} ease-out infinite`,
            animationDelay: s.delay,
          }} />
        ))}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontFamily:          'var(--font-display)',
          fontSize:            'clamp(0.6rem, 4vw, 1rem)',
          lineHeight:          1.6,
          marginBottom:        'var(--space-2)',
          background:          'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip:      'text',
        }}>
          🥚 TAMAGOTCHI 🥚
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'var(--font-size-md)',
          color:      'var(--color-text-muted)',
        }}>
          Raise your virtual pet!
        </p>
      </div>

      {/* Egg animation with glow */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        {/* Pulsing radial glow ring */}
        <div style={{
          position:   'absolute',
          width:      isDesktop ? 190 : 145,
          height:     isDesktop ? 190 : 145,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,157,0.28) 0%, transparent 70%)',
          animation:  'pulse-soft 2.5s ease-in-out infinite',
        }} />
        <div style={{ width: isDesktop ? 160 : 120, height: isDesktop ? 160 : 120, position: 'relative', zIndex: 1 }}>
          <EggSprite mood="happy" className="anim-idle" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Name input card */}
      <div style={{
        width:         '100%',
        maxWidth:      formMaxWidth,
        background:    'var(--color-surface)',
        borderRadius:  'var(--radius-lg)',
        border:        '1.5px solid var(--color-border)',
        padding:       isDesktop ? 'var(--space-4)' : 'var(--space-3)',
        boxShadow:     'var(--shadow-sm)',
        display:       'flex',
        flexDirection: 'column',
        gap:           'var(--space-2)',
        position:      'relative',
        zIndex:        1,
      }}>
        <label
          htmlFor="pet-name-input"
          style={{
            display:    'block',
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color:      'var(--color-text)',
          }}
        >
          Name your pet:
        </label>
        <input
          id="pet-name-input"
          type="text"
          value={petName}
          onChange={e => { setPetName(e.target.value); setNameError(''); }}
          onKeyDown={e => { if (e.key === 'Enter') handleStart(); }}
          placeholder="e.g. Pochi"
          maxLength={12}
          autoComplete="off"
          autoFocus
          style={{ textAlign: 'center', fontSize: 'var(--font-size-lg)' }}
          aria-describedby={nameError ? 'name-error' : undefined}
          aria-invalid={!!nameError}
        />
        {nameError && (
          <p id="name-error" role="alert" style={{
            color:      'var(--color-danger)',
            fontSize:   'var(--font-size-sm)',
            marginTop:  'var(--space-1)',
            fontFamily: 'var(--font-body)',
          }}>
            {nameError}
          </p>
        )}
      </div>

      {/* Start button — gradient */}
      <button
        onClick={handleStart}
        disabled={!petName.trim()}
        className="btn-primary"
        style={{ maxWidth: formMaxWidth, position: 'relative', zIndex: 1 }}
      >
        🎮 Start New Game
      </button>

      {/* Continue existing save — ghost */}
      {existingSave && existingSave.pet.name && (
        <button
          onClick={handleContinue}
          className="btn-ghost"
          style={{ maxWidth: formMaxWidth, position: 'relative', zIndex: 1 }}
        >
          📂 Continue with {existingSave.pet.name} ({existingSave.pet.stage})
        </button>
      )}

      {/* Version */}
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', position: 'relative', zIndex: 1 }}>
        v1.0.0
      </p>
    </main>
  );
}
