import { useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { AchievementBadge }     from '@/components/AchievementBadge';
import { Modal }                from '@/components/Modal';

interface AchievementDef {
  id:              string;
  name:            string;
  emoji:           string;
  description:     string;
  unlockCondition: string;
}

const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_feed',    name: 'First Bite',    emoji: '🌟', description: 'Fed your pet for the first time.',       unlockCondition: 'Feed the pet once' },
  { id: 'first_play',    name: 'Playtime!',     emoji: '🎮', description: 'Played with your pet for the first time.', unlockCondition: 'Play with pet once' },
  { id: 'first_clean',   name: 'Squeaky Clean', emoji: '🧹', description: 'Cleaned your pet for the first time.',    unlockCondition: 'Clean the pet once' },
  { id: 'reach_child',   name: 'Growing Up',    emoji: '🌿', description: 'Your pet evolved to Child stage.',        unlockCondition: 'Evolve to Child' },
  { id: 'reach_teen',    name: 'Teenager',      emoji: '🧒', description: 'Your pet evolved to Teen stage.',         unlockCondition: 'Evolve to Teen' },
  { id: 'reach_adult',   name: 'Full Grown',    emoji: '🧑', description: 'Your pet evolved to Adult stage.',        unlockCondition: 'Evolve to Adult' },
  { id: 'reach_elder',   name: 'Elder Wisdom',  emoji: '👴', description: 'Your pet reached Elder stage!',           unlockCondition: 'Evolve to Elder' },
  { id: 'survive_1hr',   name: 'Survivor',      emoji: '⏱️', description: 'Kept your pet alive for 1 hour.',         unlockCondition: 'Pet alive ≥ 60 minutes' },
  { id: 'happy_pet',     name: 'Happy Pet',     emoji: '😊', description: 'Kept happiness above 90 for 5 minutes.',  unlockCondition: 'Happiness ≥ 90 for 5min' },
  { id: 'pet_recovered', name: 'Recovery',      emoji: '🩺', description: 'Cured your pet\'s sickness.',             unlockCondition: 'Use medicine when sick' },
  { id: 'generation_2',  name: 'New Beginning', emoji: '💫', description: 'Started a second generation!',            unlockCondition: 'Start generation 2+' },
  { id: 'underdog',      name: 'Underdog',      emoji: '🐾', description: 'Pet evolved with poor care.',             unlockCondition: 'Evolve with unhealthy variant' },
];

export function AchievementsScreen() {
  const { achievements } = useGame();
  const navigate         = useNavigate();
  const [selected, setSelected] = useState<AchievementDef | null>(null);
  const unlockedCount    = achievements.length;

  return (
    <div className="screen" style={{ background: 'var(--color-surface)' }}>
      {/* Top bar */}
      <header className="top-bar">
        <button
          onClick={() => navigate('pet')}
          aria-label="Back to pet"
          style={{ color: 'var(--color-text)', fontSize: 22, background: 'none', border: 'none', padding: 'var(--space-1)' }}
        >
          ←
        </button>
        <h1 className="top-bar__title">🏆 Achievements</h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Progress summary */}
      <div style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          <strong style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-sm)' }}>{unlockedCount}</strong>
          {' / '}{ALL_ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      {/* Badge grid */}
      <div className="achievement-grid" role="list" aria-label="Achievements">
        {ALL_ACHIEVEMENTS.map(ach => (
          <div key={ach.id} role="listitem">
            <AchievementBadge
              id={ach.id}
              name={ach.name}
              emoji={ach.emoji}
              description={ach.description}
              unlockCondition={ach.unlockCondition}
              unlocked={achievements.includes(ach.id)}
              onClick={() => setSelected(ach)}
            />
          </div>
        ))}
      </div>

      {/* Detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.emoji} ${selected.name}` : ''}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>
              {selected.description}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              <strong>How to unlock:</strong> {selected.unlockCondition}
            </p>
            {achievements.includes(selected.id) ? (
              <p style={{ color: 'var(--color-success)', fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)' }}>
                ✓ Unlocked!
              </p>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)' }}>
                🔒 Not yet unlocked
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
