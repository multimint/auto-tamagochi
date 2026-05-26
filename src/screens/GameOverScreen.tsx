import { useGame, useNavigate } from '@/context/GameContext';
import { DeadSprite }           from '@/assets/sprites/DeadSprite';
import { getCauseOfDeath }      from '@/utils/gameLogic';
import { formatAge }            from '@/utils/timeUtils';

export function GameOverScreen() {
  const { dispatch, pet, achievements } = useGame();
  const navigate = useNavigate();

  const cause = getCauseOfDeath(pet);

  function handleRestart() {
    dispatch({ type: 'RESET' });
    navigate('home');
  }

  return (
    <main className="gameover-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize:   'clamp(0.65rem, 4vw, 1rem)',
        color:      'var(--color-danger)',
        lineHeight: 1.6,
        textAlign:  'center',
      }}>
        💀 GAME OVER 💀
      </h1>

      {/* Dead sprite */}
      <div style={{ width: 160, height: 160 }}>
        <DeadSprite className="anim-dead" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Message */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', textAlign: 'center' }}>
        Oh no! <strong>{pet.name}</strong> has died 😢
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Cause: {cause}
      </p>

      {/* Stats */}
      <div style={{
        background:   'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding:      'var(--space-4) var(--space-6)',
        border:       '1px solid var(--color-border)',
        display:      'flex',
        flexDirection:'column',
        gap:          'var(--space-2)',
        width:        '100%',
        maxWidth:     280,
      }}>
        {[
          ['Age reached',    formatAge(pet.ageMinutes)],
          ['Generation',     String(pet.generation)],
          ['Achievements',   `${achievements.length} / 12`],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Start again */}
      <button
        onClick={handleRestart}
        style={{
          width:        '100%',
          maxWidth:     280,
          padding:      'var(--space-4)',
          background:   'var(--color-primary)',
          color:        'white',
          borderRadius: 'var(--radius-lg)',
          fontSize:     'var(--font-size-base)',
          fontWeight:   'var(--font-weight-black)',
          fontFamily:   'var(--font-body)',
          boxShadow:    'var(--shadow-md)',
          border:       'none',
        }}
      >
        🐣 Start New Game
      </button>

      {/* View achievements */}
      <button
        onClick={() => navigate('achievements')}
        style={{
          fontFamily:     'var(--font-body)',
          fontSize:       'var(--font-size-sm)',
          color:          'var(--color-primary)',
          background:     'none',
          border:         'none',
          textDecoration: 'underline',
          cursor:         'pointer',
          minHeight:      44,
        }}
      >
        View Achievements
      </button>
    </main>
  );
}
