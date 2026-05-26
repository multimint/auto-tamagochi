import { useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { Modal } from '@/components/Modal';
import { clearSave } from '@/utils/localStorage';

export function SettingsScreen() {
  const { dispatch, settings, pet } = useGame();
  const navigate = useNavigate();
  const [renameValue, setRenameValue]       = useState(pet.name);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearStep, setClearStep]           = useState(0);

  function updateSetting<K extends keyof typeof settings>(key: K, value: typeof settings[K]) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  }

  function handleRename() {
    if (!renameValue.trim()) return;
    dispatch({ type: 'RENAME_PET', payload: { name: renameValue.trim() } });
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
    setShowResetModal(false);
  }

  function handleClearAll() {
    if (clearStep === 0) { setClearStep(1); return; }
    clearSave();
    dispatch({ type: 'RESET' });
    setShowClearModal(false);
    setClearStep(0);
  }

  const toggle = (
    id: string,
    label: string,
    checked: boolean,
    onChange: (v: boolean) => void,
  ) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semi)', color: 'var(--color-text)', cursor: 'pointer' }}>
        {label}
      </label>
      <div style={{ position: 'relative', width: 52, height: 28, flexShrink: 0 }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1, margin: 0 }}
        />
        <div style={{
          position:      'absolute',
          inset:         0,
          borderRadius:  'var(--radius-full)',
          background:    checked ? 'var(--color-primary)' : 'var(--color-border)',
          transition:    'background var(--transition-fast)',
        }} />
        <div style={{
          position:     'absolute',
          top:          3,
          left:         checked ? 27 : 3,
          width:        22,
          height:       22,
          borderRadius: 'var(--radius-full)',
          background:   'white',
          boxShadow:    'var(--shadow-sm)',
          transition:   'left var(--transition-fast)',
        }} />
      </div>
    </div>
  );

  return (
    <div className="screen" style={{ background: 'var(--color-surface)' }}>
      {/* Top bar */}
      <header className="top-bar">
        <button onClick={() => navigate('pet')} aria-label="Back to pet" style={{ color: 'var(--color-text)', fontSize: 22, background: 'none', border: 'none', padding: 'var(--space-1)' }}>
          ←
        </button>
        <h1 className="top-bar__title">⚙️ Settings</h1>
        <div style={{ width: 40 }} />
      </header>

      {/* ── Settings body: single column on mobile, two-column grid on desktop ── */}
      <div className="settings-section">

        {/* ── LEFT COLUMN: Audio · Theme · Gameplay ── */}
        <div className="settings-col">

          {/* Sound & Music */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
              🔊 Audio
            </h2>
            {toggle('sound-toggle', 'Sound Effects', settings.soundEnabled, v => updateSetting('soundEnabled', v))}
            {toggle('music-toggle', 'Background Music', settings.musicEnabled, v => updateSetting('musicEnabled', v))}
          </section>

          <div className="settings-divider" />

          {/* Theme */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
              🎨 Theme
            </h2>
            <div role="radiogroup" aria-label="Theme" style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['pastel', 'dark', 'classic'] as const).map(t => (
                <button
                  key={t}
                  role="radio"
                  aria-checked={settings.theme === t}
                  onClick={() => updateSetting('theme', t)}
                  style={{
                    flex:         1,
                    padding:      'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    background:   settings.theme === t ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                    color:        settings.theme === t ? 'white' : 'var(--color-text)',
                    border:       `2px solid ${settings.theme === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    fontFamily:   'var(--font-body)',
                    fontWeight:   'var(--font-weight-bold)',
                    fontSize:     'var(--font-size-sm)',
                    textTransform:'capitalize',
                    minHeight:    44,
                    cursor:       'pointer',
                    transition:   'background var(--transition-fast), color var(--transition-fast)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <div className="settings-divider" />

          {/* Animations + Difficulty */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
              🎮 Gameplay
            </h2>
            {toggle('anim-toggle', '✨ Animations', settings.animationsEnabled, v => updateSetting('animationsEnabled', v))}

            <div style={{ marginTop: 'var(--space-3)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-semi)', fontSize: 'var(--font-size-base)', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
                🎯 Difficulty
              </p>
              <div role="radiogroup" aria-label="Difficulty" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {(['easy', 'normal', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    role="radio"
                    aria-checked={settings.difficulty === d}
                    onClick={() => updateSetting('difficulty', d)}
                    style={{
                      flex:         1,
                      padding:      'var(--space-2)',
                      borderRadius: 'var(--radius-md)',
                      background:   settings.difficulty === d ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                      color:        settings.difficulty === d ? 'white' : 'var(--color-text)',
                      border:       `2px solid ${settings.difficulty === d ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      fontFamily:   'var(--font-body)',
                      fontWeight:   'var(--font-weight-bold)',
                      fontSize:     'var(--font-size-sm)',
                      textTransform:'capitalize',
                      minHeight:    44,
                      cursor:       'pointer',
                      transition:   'background var(--transition-fast), color var(--transition-fast)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                Easy: 0.5× decay · Normal: 1× · Hard: 1.5×
              </p>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN: Rename · Tutorial · Danger Zone ── */}
        <div className="settings-col">

          <div className="settings-divider" />

          {/* Rename pet */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
              🐾 Rename Pet
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                maxLength={12}
                aria-label="New pet name"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleRename}
                disabled={!renameValue.trim() || renameValue.trim() === pet.name}
                style={{
                  padding:      'var(--space-2) var(--space-4)',
                  background:   'var(--color-primary)',
                  color:        'white',
                  borderRadius: 'var(--radius-md)',
                  fontFamily:   'var(--font-body)',
                  fontWeight:   'var(--font-weight-bold)',
                  fontSize:     'var(--font-size-sm)',
                  border:       'none',
                  minHeight:    44,
                  cursor:       'pointer',
                }}
              >
                Save
              </button>
            </div>
          </section>

          <div className="settings-divider" />

          {/* Tutorial */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
              📖 Help
            </h2>
            <button
              onClick={() => navigate('tutorial')}
              style={{
                width:        '100%',
                padding:      'var(--space-3)',
                background:   'var(--color-surface-alt)',
                border:       '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontFamily:   'var(--font-body)',
                fontWeight:   'var(--font-weight-bold)',
                fontSize:     'var(--font-size-base)',
                color:        'var(--color-text)',
                textAlign:    'left',
                cursor:       'pointer',
                transition:   'background var(--transition-fast)',
              }}
            >
              📖 View Tutorial
            </button>
          </section>

          <div className="settings-divider" />

          {/* Danger zone */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-3)', color: 'var(--color-danger)' }}>
              ⚠️ Danger Zone
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <button
                onClick={() => setShowResetModal(true)}
                style={{
                  padding:      'var(--space-3)',
                  background:   'var(--color-danger-bg)',
                  border:       '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  color:        'var(--color-danger)',
                  fontFamily:   'var(--font-body)',
                  fontWeight:   'var(--font-weight-bold)',
                  fontSize:     'var(--font-size-sm)',
                  width:        '100%',
                  cursor:       'pointer',
                }}
              >
                🔄 Reset Game
              </button>
              <button
                onClick={() => setShowClearModal(true)}
                style={{
                  padding:      'var(--space-3)',
                  background:   'var(--color-danger-bg)',
                  border:       '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  color:        'var(--color-danger)',
                  fontFamily:   'var(--font-body)',
                  fontWeight:   'var(--font-weight-bold)',
                  fontSize:     'var(--font-size-sm)',
                  width:        '100%',
                  cursor:       'pointer',
                }}
              >
                🗑️ Clear All Data
              </button>
            </div>
          </section>

          {/* Version */}
          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 'var(--space-2)' }}>
            App Version: 1.0.0
          </p>
        </div>

      </div>

      {/* Reset confirmation */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="⚠️ Reset Game?">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>
            {pet.name} will be gone forever. This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button onClick={() => setShowResetModal(false)} style={{ flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
              Cancel
            </button>
            <button onClick={handleReset} style={{ flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-danger)', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', color: 'white' }}>
              Reset ✗
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear all data confirmation */}
      <Modal isOpen={showClearModal} onClose={() => { setShowClearModal(false); setClearStep(0); }} title="🗑️ Clear All Data?">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>
            {clearStep === 0
              ? 'All game data will be permanently deleted.'
              : '⚠️ This is your FINAL warning. Are you absolutely sure?'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button onClick={() => { setShowClearModal(false); setClearStep(0); }} style={{ flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
              Cancel
            </button>
            <button onClick={handleClearAll} style={{ flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-danger)', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', color: 'white' }}>
              {clearStep === 0 ? 'Delete' : 'Yes, delete all ✗'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
