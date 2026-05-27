import { useCallback, useEffect, useRef, useState } from 'react';
import { EggSprite   } from '@/assets/sprites/EggSprite';
import { BabySprite  } from '@/assets/sprites/BabySprite';
import { ChildSprite } from '@/assets/sprites/ChildSprite';
import { TeenSprite  } from '@/assets/sprites/TeenSprite';
import { AdultSprite } from '@/assets/sprites/AdultSprite';
import { ElderSprite } from '@/assets/sprites/ElderSprite';
import { DeadSprite  } from '@/assets/sprites/DeadSprite';
import type { AvatarVariant, PetMood, PetStage } from '@/types';

interface PetAvatarProps {
  stage:             PetStage;
  variant:           AvatarVariant;
  mood:              PetMood;
  pendingEvolution:  boolean;
  onEvolutionEnd?:   () => void;
  petName:           string;
  activeAnimation?:  string | null;
}

interface WalkPos { x: number; y: number }

const SPRITE_MAP: Record<PetStage, React.ComponentType<{ mood?: PetMood; className?: string; style?: React.CSSProperties }>> = {
  egg:   EggSprite,
  baby:  BabySprite,
  child: ChildSprite,
  teen:  TeenSprite,
  adult: AdultSprite,
  elder: ElderSprite,
  dead:  DeadSprite,
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getAnimClass(mood: PetMood, pendingEvolution: boolean, activeAnimation?: string | null): string {
  if (pendingEvolution)     return 'anim-evolve';
  if (activeAnimation)      return `anim-${activeAnimation}`;
  if (mood === 'dead')      return 'anim-dead';
  if (mood === 'sleeping')  return 'anim-sleeping';
  if (mood === 'sick')      return 'anim-sick';
  if (mood === 'happy')     return 'anim-idle mood-happy';
  return 'anim-idle';
}

/* ── Action overlay components ── */

function EatingOverlay() {
  return (
    <div style={{
      position: 'absolute', bottom: '-8px', left: '50%',
      transform: 'translateX(-50%)',
      animation: 'bowl-bob 0.4s ease-in-out infinite',
      pointerEvents: 'none', zIndex: 2,
    }}>
      <svg width="36" height="28" viewBox="0 0 36 28" shapeRendering="crispEdges">
        <rect x="4"  y="16" width="28" height="4"  fill="#E8C090" />
        <rect x="2"  y="20" width="32" height="4"  fill="#C8A070" />
        <rect x="6"  y="24" width="24" height="4"  fill="#A07050" />
        <rect x="10" y="8"  width="6"  height="6"  fill="#FF6644" />
        <rect x="16" y="10" width="4"  height="4"  fill="#FF8866" />
        <rect x="8"  y="10" width="2"  height="4"  fill="#FF4422" />
        <rect x="20" y="9"  width="4"  height="2"  fill="#FF6644" />
        <rect x="20" y="13" width="4"  height="2"  fill="#FF6644" />
        <rect x="11" y="9"  width="2"  height="2"  fill="#FFFFFF" />
      </svg>
    </div>
  );
}

function PlayingOverlay() {
  const stars = [
    { x: '-20px', y: '-16px', delay: '0s',    size: 14 },
    { x: '100%',  y: '-20px', delay: '0.25s', size: 12 },
    { x: '110%',  y: '40%',   delay: '0.5s',  size: 10 },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.x, top: s.y,
          animation: `star-bounce 0.55s ease-in-out infinite`,
          animationDelay: s.delay, pointerEvents: 'none', zIndex: 2,
        }}>
          <svg width={s.size} height={s.size} viewBox="0 0 12 12" shapeRendering="crispEdges">
            <rect x="4" y="0" width="4" height="12" fill="#FFD700" />
            <rect x="0" y="4" width="12" height="4"  fill="#FFD700" />
            <rect x="2" y="2" width="2" height="2"  fill="#FFD700" />
            <rect x="8" y="2" width="2" height="2"  fill="#FFD700" />
            <rect x="2" y="8" width="2" height="2"  fill="#FFD700" />
            <rect x="8" y="8" width="2" height="2"  fill="#FFD700" />
          </svg>
        </div>
      ))}
    </>
  );
}

function GroomingOverlay() {
  const bubbles = [
    { x: '105%', y: '20%', delay: '0s',    size: 10, color: '#FF9ABF' },
    { x: '110%', y: '50%', delay: '0.35s', size: 8,  color: '#7EC8E3' },
    { x: '95%',  y: '5%',  delay: '0.7s',  size: 6,  color: '#FFD0E8' },
    { x: '115%', y: '35%', delay: '0.15s', size: 8,  color: '#FF9ABF' },
  ];
  return (
    <>
      {bubbles.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x, top: b.y,
          width: b.size, height: b.size, borderRadius: '50%',
          border: `2px solid ${b.color}`, background: `${b.color}44`,
          animation: `bubble-float 1.2s ease-out infinite`,
          animationDelay: b.delay, pointerEvents: 'none', zIndex: 2,
        }} />
      ))}
    </>
  );
}

function PraisingOverlay() {
  const hearts = [
    { x: '-22px', y: '10%',  delay: '0s',   size: 14 },
    { x: '102%',  y: '5%',   delay: '0.2s', size: 12 },
    { x: '-18px', y: '50%',  delay: '0.4s', size: 10 },
    { x: '106%',  y: '45%',  delay: '0.1s', size: 11 },
    { x: '40%',   y: '-18px',delay: '0.3s', size: 13 },
  ];
  return (
    <>
      {hearts.map((h, i) => (
        <div key={i} style={{
          position: 'absolute', left: h.x, top: h.y,
          animation: `heart-float 1.1s ease-out infinite`,
          animationDelay: h.delay, pointerEvents: 'none', zIndex: 2,
        }}>
          <svg width={h.size} height={h.size} viewBox="0 0 12 12" shapeRendering="crispEdges">
            <rect x="1" y="3" width="3" height="3" fill="#F9A8D4" />
            <rect x="8" y="3" width="3" height="3" fill="#F9A8D4" />
            <rect x="0" y="4" width="12" height="4" fill="#F9A8D4" />
            <rect x="1" y="8" width="10" height="2" fill="#F9A8D4" />
            <rect x="3" y="10" width="6" height="2" fill="#F9A8D4" />
            <rect x="2" y="4" width="2" height="2" fill="#FFD6E7" />
          </svg>
        </div>
      ))}
    </>
  );
}

function MedicineOverlay() {
  return (
    <div style={{
      position: 'absolute', top: '-18px', right: '-8px',
      animation: 'overlay-pop 1.6s ease-out forwards',
      pointerEvents: 'none', zIndex: 2,
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" shapeRendering="crispEdges">
        <rect x="6"  y="10" width="16" height="8" fill="#7EC8E3" />
        <rect x="14" y="10" width="8"  height="8" fill="#C8EAF8" />
        <rect x="4"  y="12" width="20" height="4" fill="#7EC8E3" />
        <rect x="14" y="12" width="10" height="4" fill="#C8EAF8" />
        <rect x="12" y="2"  width="4"  height="12" fill="#5AB4D4" />
        <rect x="8"  y="6"  width="12" height="4"  fill="#5AB4D4" />
      </svg>
    </div>
  );
}

/* ── Room background ── */

function RoomBackground() {
  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 600 220"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    >
      {/* ── WALL (full 600px width) — Sanrio sky blue, like Punirunes device screen ── */}
      <rect x="0" y="0" width="600" height="143" fill="#C8EAF8" />
      {/* subtle wall stripe pattern */}
      {[0,30,60,90,120,150,180,210,240,270,300,330,360,390,420,450,480,510,540,570].map(x => (
        <rect key={x} x={x} y="0" width="2" height="143" fill="#B4D8F0" opacity="0.5" />
      ))}

      {/* ── WINDOW LEFT ── */}
      <rect x="18"  y="20" width="54" height="42" fill="#A8DCFF" />
      <rect x="18"  y="20" width="54" height="42" fill="none" stroke="#B8D0DE" strokeWidth="3" />
      <rect x="44"  y="20" width="2"  height="42" fill="#B8D0DE" />
      <rect x="18"  y="40" width="54" height="2"  fill="#B8D0DE" />
      <rect x="20"  y="22" width="10" height="6"  fill="white" opacity="0.4" />
      <rect x="14"  y="16" width="10" height="52" fill="#FF9ABF" opacity="0.85" />
      <rect x="62"  y="16" width="10" height="52" fill="#FF9ABF" opacity="0.85" />

      {/* ── PICTURE FRAME (left-centre) ── */}
      <rect x="160" y="24" width="70" height="50" fill="#FFF0F5" stroke="#D4B0C0" strokeWidth="3" />
      <rect x="186" y="32" width="18" height="14" fill="#FF9ABF" />
      <rect x="184" y="28" width="4"  height="6"  fill="#FF9ABF" />
      <rect x="200" y="28" width="4"  height="6"  fill="#FF9ABF" />
      <rect x="188" y="37" width="3"  height="3"  fill="#3D1522" />
      <rect x="197" y="37" width="3"  height="3"  fill="#3D1522" />
      <rect x="192" y="42" width="2"  height="2"  fill="#FF6B9D" />
      <rect x="165" y="66" width="60" height="4"  fill="#FFD0E8" />

      {/* ── SHELF / DECORATION (right-centre) ── */}
      <rect x="330" y="68" width="90" height="6"  fill="#D4B0C0" />   {/* shelf board */}
      <rect x="328" y="74" width="2"  height="20" fill="#C0A0B0" />   {/* left bracket */}
      <rect x="418" y="74" width="2"  height="20" fill="#C0A0B0" />   {/* right bracket */}
      {/* pot / plant */}
      <rect x="342" y="48" width="16" height="20" fill="#A8D8C0" />   {/* leaves */}
      <rect x="344" y="46" width="12" height="6"  fill="#86C4A8" />
      <rect x="346" y="60" width="8"  height="12" fill="#E8C090" />   {/* pot */}
      <rect x="344" y="68" width="12" height="4"  fill="#C8A070" />   {/* pot rim */}
      {/* small round vase — Sanrio pink */}
      <rect x="376" y="54" width="14" height="18" fill="#FF6B9D" opacity="0.75" />
      <rect x="374" y="62" width="18" height="8"  fill="#FF6B9D" opacity="0.50" />
      <rect x="378" y="52" width="10" height="4"  fill="#FFD0E8" />

      {/* ── WINDOW RIGHT ── */}
      <rect x="528" y="20" width="54" height="42" fill="#A8DCFF" />
      <rect x="528" y="20" width="54" height="42" fill="none" stroke="#B8D0DE" strokeWidth="3" />
      <rect x="554" y="20" width="2"  height="42" fill="#B8D0DE" />
      <rect x="528" y="40" width="54" height="2"  fill="#B8D0DE" />
      <rect x="530" y="22" width="10" height="6"  fill="white" opacity="0.4" />
      <rect x="524" y="16" width="10" height="52" fill="#FF9ABF" opacity="0.85" />
      <rect x="572" y="16" width="10" height="52" fill="#FF9ABF" opacity="0.85" />

      {/* ── BASEBOARD ── */}
      <rect x="0" y="140" width="600" height="6"  fill="#D4B0C0" />
      <rect x="0" y="146" width="600" height="3"  fill="#C0A0B0" />

      {/* ── FLOOR — 3 plank rows — warm honey wood ── */}
      <rect x="0" y="149" width="600" height="24" fill="#F5EAD8" />
      <rect x="0" y="173" width="600" height="24" fill="#ECD8C0" />
      <rect x="0" y="197" width="600" height="23" fill="#E0CAB0" />
      {/* plank dividers */}
      {[0,60,130,200,270,340,410,480,550].map(x => (
        <rect key={x} x={x} y="149" width="1" height="71" fill="#C8B098" opacity="0.5" />
      ))}
      {/* plank row borders */}
      <rect x="0" y="172" width="600" height="1" fill="#C8B098" opacity="0.4" />
      <rect x="0" y="196" width="600" height="1" fill="#C8B098" opacity="0.4" />

      {/* ── RUG (centered at 300) — Sanrio pink ── */}
      <ellipse cx="300" cy="205" rx="130" ry="14" fill="#FF6B9D" opacity="0.22" />
      <ellipse cx="300" cy="205" rx="100" ry="10" fill="#FFB3D0" opacity="0.20" />
    </svg>
  );
}

/* ── Walking state helpers ── */

const SLEEP_POS: WalkPos  = { x: 50, y: 70 };
const DEAD_POS:  WalkPos  = { x: 50, y: 68 };
const WALK_MS               = 2200;   // transition duration while walking
const IDLE_MIN_MS           = 1500;
const IDLE_MAX_MS           = 3800;

/* ── Main component ── */

export function PetAvatar({
  stage,
  mood,
  pendingEvolution,
  onEvolutionEnd,
  petName,
  activeAnimation,
}: PetAvatarProps) {
  const Sprite     = SPRITE_MAP[stage] ?? BabySprite;
  const baseClass  = getAnimClass(mood, pendingEvolution, activeAnimation);
  const isDead     = mood === 'dead';
  const isSleeping = mood === 'sleeping';

  /* ── Walking state ── */
  const [walkPos,    setWalkPos]    = useState<WalkPos>({ x: 50, y: 70 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [isWalking,  setIsWalking]  = useState(false);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stopWalk = useCallback(() => {
    clearTimeout(walkTimer.current);
    setIsWalking(false);
  }, []);

  const scheduleWalk = useCallback(() => {
    clearTimeout(walkTimer.current);
    // idle pause before next move
    walkTimer.current = setTimeout(() => {
      // pick random target within floor bounds
      const tx = rand(10, 85);
      const ty = rand(58, 82);
      setWalkPos(prev => {
        setFacingLeft(tx < prev.x);
        return { x: tx, y: ty };
      });
      setIsWalking(true);
      // after walking duration, stop and schedule next
      walkTimer.current = setTimeout(() => {
        setIsWalking(false);
        scheduleWalk();
      }, WALK_MS + 100);
    }, rand(IDLE_MIN_MS, IDLE_MAX_MS));
  }, []);

  // Start / stop walking loop based on mood + activeAnimation
  useEffect(() => {
    if (isDead) {
      stopWalk();
      setWalkPos(DEAD_POS);
      return;
    }
    if (isSleeping) {
      stopWalk();
      setWalkPos(SLEEP_POS);
      return;
    }
    if (activeAnimation) {
      // pause movement during action (cat freezes in place)
      clearTimeout(walkTimer.current);
      setIsWalking(false);
      return;
    }
    // alive, awake, no action — start the walk loop
    scheduleWalk();
    return () => clearTimeout(walkTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDead, isSleeping, activeAnimation]);

  /* ── Depth scale from y position ── */
  // y=18 (back) → 0.68   y=80 (front) → 1.08
  const depthScale = 0.68 + (walkPos.y / 100) * 0.40;

  /* ── Sprite class: add anim-walking when moving ── */
  const spriteClass = (isWalking && !isDead && !isSleeping)
    ? `${baseClass} anim-walking`
    : baseClass;

  /* ── Evolution sparkles ── */
  const evoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (pendingEvolution) {
      setShowSparkles(true);
      evoTimer.current = setTimeout(() => {
        setShowSparkles(false);
        onEvolutionEnd?.();
      }, 1_200);
    }
    return () => { if (evoTimer.current) clearTimeout(evoTimer.current); };
  }, [pendingEvolution, onEvolutionEnd]);

  const ariaLabel = isDead
    ? `${petName} has passed away`
    : `${petName} the ${stage} cat, ${mood}`;

  return (
    /* Full-size stage that fills .avatar-section — CSS class handles position: absolute; inset: 0 */
    <div
      className="cat-walk-stage"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Room background — renders behind the cat */}
      <RoomBackground />

      {/* Cat walker — absolutely positioned, CSS transition does the movement */}
      <div
        className="pet-avatar-wrapper"
        style={{
          position:        'absolute',
          left:            `${walkPos.x}%`,
          top:             `${walkPos.y}%`,
          transform:       `translateX(-50%) translateY(-50%)
                            scale(${depthScale.toFixed(3)})
                            scaleX(${facingLeft ? -1 : 1})`,
          transformOrigin: 'center bottom',
          transition:      isWalking
            ? `left ${WALK_MS}ms linear, top ${WALK_MS}ms linear`
            : 'left 0.4s ease-out, top 0.4s ease-out',
          /* width / height come from .pet-avatar-wrapper in CSS */
        }}
      >
        {/* Mood glow aura */}
        <div
          className="avatar-mood-glow"
          data-mood={mood}
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Sprite
            mood={mood}
            className={spriteClass}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Action overlays — follow the cat */}
        {activeAnimation === 'eating'   && <EatingOverlay />}
        {activeAnimation === 'playing'  && <PlayingOverlay />}
        {activeAnimation === 'grooming' && <GroomingOverlay />}
        {activeAnimation === 'praising' && <PraisingOverlay />}
        {activeAnimation === 'medicine' && <MedicineOverlay />}

        {/* Evolution sparkles */}
        {showSparkles && (
          <>
            {[
              { x: 10,  y: 10,  delay: 0 },
              { x: 80,  y: 5,   delay: 0.1 },
              { x: -10, y: 60,  delay: 0.2 },
              { x: 90,  y: 70,  delay: 0.15 },
              { x: 40,  y: -10, delay: 0.05 },
              { x: 55,  y: 95,  delay: 0.08 },
              { x: -5,  y: 30,  delay: 0.18 },
            ].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${pos.x}%`, top: `${pos.y}%`,
                width: 12, height: 12,
                animation: `sparkle-pop 1s ease forwards`,
                animationDelay: `${pos.delay}s`,
                background: 'var(--color-primary)',
                borderRadius: 2, transform: 'rotate(45deg)',
                pointerEvents: 'none',
              }} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
