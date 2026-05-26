import { useGame, useNavigate } from '@/context/GameContext';
import { evolutionProgress, nextEvolutionAge } from '@/utils/evolutionLogic';
import { formatAge } from '@/utils/timeUtils';
import { StageBadge }   from '@/components/StageBadge';
import { ProgressRing } from '@/components/ProgressRing';
import type { Screen } from '@/types';

const NAV_ITEMS: { screen: Screen; emoji: string; label: string }[] = [
  { screen: 'pet',          emoji: '🐾', label: 'Your Pet' },
  { screen: 'inventory',    emoji: '📦', label: 'Inventory' },
  { screen: 'achievements', emoji: '🏆', label: 'Achievements' },
  { screen: 'settings',     emoji: '⚙️',  label: 'Settings' },
  { screen: 'tutorial',     emoji: '❓', label: 'Help' },
];

export function DesktopSidebar() {
  const { pet, currentScreen } = useGame();
  const navigate = useNavigate();

  const evoProgress = evolutionProgress(pet);
  const nextAge     = nextEvolutionAge(pet);

  return (
    <aside className="desktop-sidebar" aria-label="Main navigation">

      {/* ── Pet info header ── */}
      <div className="desktop-sidebar__header">
        <div className="desktop-sidebar__evo-ring">
          <ProgressRing
            progress={evoProgress}
            label={nextAge !== null ? `Next evolution at ${nextAge}m` : 'Max stage'}
            size={48}
            strokeWidth={4}
          />
        </div>
        <StageBadge stage={pet.stage} />
        <span
          className="desktop-sidebar__pet-name"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize:   'var(--font-size-xs)',
            color:      'var(--color-text)',
            fontWeight: 'var(--font-weight-bold)',
            textAlign:  'center',
            overflow:   'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth:   '100%',
          }}
        >
          {pet.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--font-size-xs)',
            color:      'var(--color-text-muted)',
          }}
        >
          {formatAge(pet.ageMinutes)}
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav className="desktop-sidebar__nav">
        {NAV_ITEMS.map(({ screen, emoji, label }, i) => (
          <button
            key={screen}
            className={`desktop-sidebar__item${currentScreen === screen ? ' active' : ''}`}
            onClick={() => navigate(screen)}
            aria-current={currentScreen === screen ? 'page' : undefined}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="desktop-sidebar__item-emoji" aria-hidden="true">
              {emoji}
            </span>
            <span className="desktop-sidebar__item-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Footer ── */}
      <footer className="desktop-sidebar__footer">
        <span>Gen {pet.generation}</span>
        <span className="desktop-sidebar__version">v1.0.0</span>
      </footer>
    </aside>
  );
}
