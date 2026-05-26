import { useEffect, useRef, useState } from 'react';
import { EggSprite   } from '@/assets/sprites/EggSprite';
import { BabySprite  } from '@/assets/sprites/BabySprite';
import { ChildSprite } from '@/assets/sprites/ChildSprite';
import { TeenSprite  } from '@/assets/sprites/TeenSprite';
import { AdultSprite } from '@/assets/sprites/AdultSprite';
import { ElderSprite } from '@/assets/sprites/ElderSprite';
import { DeadSprite  } from '@/assets/sprites/DeadSprite';
import type { AvatarVariant, PetMood, PetStage } from '@/types';

interface PetAvatarProps {
  stage:            PetStage;
  variant:          AvatarVariant;
  mood:             PetMood;
  pendingEvolution: boolean;
  onEvolutionEnd?:  () => void;
  petName:          string;
}

const SPRITE_MAP: Record<PetStage, React.ComponentType<{ mood?: PetMood; className?: string; style?: React.CSSProperties }>> = {
  egg:   EggSprite,
  baby:  BabySprite,
  child: ChildSprite,
  teen:  TeenSprite,
  adult: AdultSprite,
  elder: ElderSprite,
  dead:  DeadSprite,
};

function getAnimClass(mood: PetMood, pendingEvolution: boolean): string {
  if (pendingEvolution)    return 'anim-evolve';
  if (mood === 'dead')     return 'anim-dead';
  if (mood === 'sleeping') return 'anim-sleeping';
  if (mood === 'sick')     return 'anim-sick';
  if (mood === 'happy')    return 'anim-idle';
  return 'anim-idle';
}

export function PetAvatar({
  stage,
  mood,
  pendingEvolution,
  onEvolutionEnd,
  petName,
}: PetAvatarProps) {
  const Sprite = SPRITE_MAP[stage] ?? BabySprite;
  const animClass = getAnimClass(mood, pendingEvolution);
  const evoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  // Trigger sparkles on evolution
  useEffect(() => {
    if (pendingEvolution) {
      setShowSparkles(true);
      evoTimerRef.current = setTimeout(() => {
        setShowSparkles(false);
        onEvolutionEnd?.();
      }, 1_200);
    }
    return () => {
      if (evoTimerRef.current) clearTimeout(evoTimerRef.current);
    };
  }, [pendingEvolution, onEvolutionEnd]);

  const ariaLabel = stage === 'dead'
    ? `${petName} has passed away`
    : `${petName} the ${stage}, currently ${mood}`;

  return (
    <div
      className="pet-avatar-wrapper"
      role="img"
      aria-label={ariaLabel}
      style={{
        position:       'relative',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      {/* Mood glow aura — wraps the sprite for filter: drop-shadow */}
      <div
        className="avatar-mood-glow"
        data-mood={mood}
        style={{
          width:    '100%',
          height:   '100%',
          display:  'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sprite
          mood={mood}
          className={animClass}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Sparkle particles on evolution */}
      {showSparkles && (
        <>
          {[
            { x: 10, y: 10,  delay: 0 },
            { x: 80, y: 5,   delay: 0.1 },
            { x: -10, y: 60, delay: 0.2 },
            { x: 90, y: 70,  delay: 0.15 },
            { x: 40, y: -10, delay: 0.05 },
            { x: 55, y: 95,  delay: 0.08 },
            { x: -5, y: 30,  delay: 0.18 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position:  'absolute',
                left:      `${pos.x}%`,
                top:       `${pos.y}%`,
                width:     12,
                height:    12,
                animation: `sparkle-pop 1s ease forwards`,
                animationDelay: `${pos.delay}s`,
                background: 'var(--color-primary)',
                borderRadius: 2,
                transform: 'rotate(45deg)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
