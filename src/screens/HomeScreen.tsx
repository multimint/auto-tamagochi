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
    <main className="home-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize:   'clamp(0.6rem, 4vw, 1rem)',
          color:      'var(--color-primary)',
          lineHeight: 1.6,
          marginBottom: 'var(--space-2)',
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

      {/* Egg animation */}
      <div style={{ width: 160, height: 160 }}>
        <EggSprite mood="happy" className="anim-idle" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Name input */}
      <div style={{ width: '100%', maxWidth: formMaxWidth }}>
        <label
          htmlFor="pet-name-input"
          style={{
            display:    'block',
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color:      'var(--color-text)',
            marginBottom: 'var(--space-2)',
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

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!petName.trim()}
        style={{
          width:        '100%',
          maxWidth:     formMaxWidth,
          padding:      'var(--space-4)',
          background:   petName.trim() ? 'var(--color-primary)' : 'var(--color-border)',
          color:        'var(--color-text-inverse)',
          borderRadius: 'var(--radius-lg)',
          fontSize:     'var(--font-size-base)',
          fontWeight:   'var(--font-weight-black)',
          fontFamily:   'var(--font-body)',
          boxShadow:    petName.trim() ? 'var(--shadow-md)' : 'none',
          transition:   'background var(--transition-fast), box-shadow var(--transition-fast)',
          border:       'none',
        }}
      >
        🎮 Start New Game
      </button>

      {/* Continue existing save */}
      {existingSave && existingSave.pet.name && (
        <button
          onClick={handleContinue}
          style={{
            width:        '100%',
            maxWidth:     formMaxWidth,
            padding:      'var(--space-3)',
            background:   'var(--color-surface)',
            color:        'var(--color-text)',
            borderRadius: 'var(--radius-lg)',
            fontSize:     'var(--font-size-sm)',
            fontWeight:   'var(--font-weight-bold)',
            fontFamily:   'var(--font-body)',
            border:       '2px solid var(--color-border)',
          }}
        >
          📂 Continue with {existingSave.pet.name} ({existingSave.pet.stage})
        </button>
      )}

      {/* Version */}
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        v1.0.0
      </p>
    </main>
  );
}
