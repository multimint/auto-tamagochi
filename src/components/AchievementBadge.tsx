import { formatDate } from '@/utils/timeUtils';

interface AchievementBadgeProps {
  id:               string;
  name:             string;
  emoji:            string;
  description:      string;
  unlockCondition:  string;
  unlocked:         boolean;
  unlockedAt?:      number;
  onClick?:         () => void;
}

export function AchievementBadge({
  name,
  emoji,
  description,
  unlockCondition,
  unlocked,
  unlockedAt,
  onClick,
}: AchievementBadgeProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`${name}: ${unlocked ? `Unlocked${unlockedAt ? ` on ${formatDate(unlockedAt)}` : ''}` : `Locked — ${unlockCondition}`}`}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            'var(--space-1)',
        padding:        'var(--space-3) var(--space-2)',
        background:     unlocked ? 'var(--color-surface-alt)' : 'var(--color-surface)',
        border:         `2px solid ${unlocked ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius:   'var(--radius-md)',
        cursor:         'pointer',
        filter:         unlocked ? 'none' : 'grayscale(1) opacity(0.5)',
        transition:     'border-color var(--transition-fast), filter var(--transition-normal)',
        minHeight:      80,
        width:          '100%',   /* fill the grid cell */
        height:         '100%',   /* match tallest sibling in the row */
        boxSizing:      'border-box',
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* Emoji */}
      <span style={{ fontSize: 28, lineHeight: 1 }}>{unlocked ? emoji : '🔒'}</span>

      {/* Name */}
      <span style={{
        fontSize:   'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-bold)',
        fontFamily: 'var(--font-body)',
        color:      'var(--color-text)',
        textAlign:  'center',
        lineHeight: 1.2,
      }}>
        {name}
      </span>

      {/* Unlocked indicator */}
      {unlocked && (
        <span style={{
          position: 'absolute',
          top: 4,
          right: 4,
          fontSize: 10,
          color: 'var(--color-primary)',
        }}>
          ✓
        </span>
      )}

      {/* Hidden description for screen readers */}
      <span className="sr-only">{description}</span>
    </button>
  );
}
