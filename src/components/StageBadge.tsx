import { STAGE_EMOJIS, STAGE_LABELS } from '@/utils/evolutionLogic';
import type { PetStage } from '@/types';

interface StageBadgeProps {
  stage: PetStage;
}

const STAGE_BG: Record<PetStage, string> = {
  egg:   'var(--stage-egg)',
  baby:  'var(--stage-baby)',
  child: 'var(--stage-child)',
  teen:  'var(--stage-teen)',
  adult: 'var(--stage-adult)',
  elder: 'var(--stage-elder)',
  dead:  'var(--stage-dead)',
};

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '4px',
        padding:       '2px 10px',
        background:    STAGE_BG[stage],
        borderRadius:  'var(--radius-full)',
        fontSize:      'var(--font-size-xs)',
        fontWeight:    'var(--font-weight-bold)',
        fontFamily:    'var(--font-body)',
        color:         'var(--color-text)',
        whiteSpace:    'nowrap',
      }}
      aria-label={`Stage: ${STAGE_LABELS[stage]}`}
    >
      <span aria-hidden="true">{STAGE_EMOJIS[stage]}</span>
      {STAGE_LABELS[stage]}
    </span>
  );
}
