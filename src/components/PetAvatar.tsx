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
  /** Text the pet says — rendered as a speech cloud above the sprite */
  speechMessage?:    string | null;
  /** Increment to force the bubble animation to replay on new messages */
  speechMessageKey?: number;
  /** Called when player clicks / taps the pet sprite */
  onPetClick?:       () => void;
  /** Whether the player is in "cleaning mode" (blush cursor active) */
  isCleaningMode?:   boolean;
  /** Called when the pet is clicked in cleaning mode — executes the clean */
  onCleanClick?:     () => void;
  /** Called when the room background is clicked in cleaning mode — cancels mode */
  onCancelClean?:    () => void;
  /** Position of the food bowl placed in the room (null = no food) */
  foodPos?:          { x: number; y: number } | null;
  /** Fired when the pet walks to the food and starts eating */
  onFoodConsumed?:   () => void;
  /** Position of the toy placed in the room (null = no toy) */
  toyPos?:           { x: number; y: number } | null;
  /** Fired when the pet walks to the toy and starts playing */
  onToyConsumed?:    () => void;
}

/** A floating heart / sparkle that pops on click */
interface ClickParticle {
  id:    number;
  x:     number;   // % within wrapper
  y:     number;   // % within wrapper
  emoji: string;
  delay: number;   // animation-delay in seconds
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

/* ── Pet speech bubble ── */

function SpeechBubble({ text, facingLeft }: { text: string; facingLeft: boolean }) {
  return (
    <div
      style={{
        position:      'absolute',
        bottom:        '112%',
        left:          '50%',
        /* counter the parent scaleX(-1) so text stays readable */
        transform:     `translateX(-50%) scaleX(${facingLeft ? -1 : 1})`,
        pointerEvents: 'none',
        zIndex:        10,
      }}
    >
      {/* Bubble body */}
      <div style={{
        position:     'relative',
        background:   'rgba(255,255,255,0.97)',
        border:       '2px solid #FF6B9D',
        borderRadius: 10,
        padding:      '5px 10px',
        maxWidth:     160,
        minWidth:     60,
        textAlign:    'center',
        fontSize:     '0.65rem',
        fontFamily:   'var(--font-body)',
        fontWeight:   700,
        color:        '#3D1522',
        lineHeight:   1.4,
        whiteSpace:   'normal',
        wordBreak:    'break-word',
        boxShadow:    '0 3px 12px rgba(255,107,157,0.30)',
        animation:    'pet-speech-in 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>
        {text}
        {/* Triangle tail — outer border colour */}
        <div style={{
          position:    'absolute',
          bottom:      -10,
          left:        '50%',
          transform:   'translateX(-50%)',
          width:       0,
          height:      0,
          borderLeft:  '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop:   '10px solid #FF6B9D',
        }} />
        {/* Triangle tail — inner fill colour */}
        <div style={{
          position:    'absolute',
          bottom:      -7,
          left:        '50%',
          transform:   'translateX(-50%)',
          width:       0,
          height:      0,
          borderLeft:  '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop:   '7px solid rgba(255,255,255,0.97)',
        }} />
      </div>
    </div>
  );
}

/* ── Toy ball (pixel-art yarn ball — placed in room when player clicks Play) ── */

function ToyBall() {
  const [phase, setPhase] = useState<'in' | 'idle'>('in');
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Pulsing glow ring */}
      <div style={{
        position:      'absolute',
        inset:         -10,
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(120,216,152,0.50) 0%, transparent 70%)',
        animation:     'food-hunger-ring 1.2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div
        style={{
          animation:       phase === 'in'
            ? 'food-drop-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'food-idle-sway 2.5s ease-in-out infinite',
          transformOrigin: 'center bottom',
          filter:          'drop-shadow(0 0 7px rgba(120,216,152,0.70)) drop-shadow(0 2px 5px rgba(0,0,0,0.22))',
        }}
        onAnimationEnd={phase === 'in' ? () => setPhase('idle') : undefined}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
          {/* Ball outer */}
          <rect x="10" y="4"  width="16" height="28" fill="#78D898" />
          <rect x="4"  y="10" width="28" height="16" fill="#78D898" />
          <rect x="6"  y="6"  width="24" height="24" fill="#78D898" />
          {/* Yarn lines horizontal */}
          <rect x="6"  y="12" width="24" height="2" fill="#5AC07A" opacity="0.75" />
          <rect x="6"  y="22" width="24" height="2" fill="#5AC07A" opacity="0.75" />
          {/* Yarn lines vertical */}
          <rect x="12" y="6"  width="2"  height="24" fill="#5AC07A" opacity="0.75" />
          <rect x="22" y="6"  width="2"  height="24" fill="#5AC07A" opacity="0.75" />
          {/* Diagonal wrap lines */}
          <rect x="8"  y="8"  width="2"  height="2"  fill="#5AC07A" opacity="0.6" />
          <rect x="26" y="8"  width="2"  height="2"  fill="#5AC07A" opacity="0.6" />
          <rect x="8"  y="26" width="2"  height="2"  fill="#5AC07A" opacity="0.6" />
          <rect x="26" y="26" width="2"  height="2"  fill="#5AC07A" opacity="0.6" />
          {/* Highlight */}
          <rect x="8"  y="8"  width="6"  height="4"  fill="#A8ECC0" opacity="0.70" />
          <rect x="8"  y="8"  width="2"  height="2"  fill="#CCF4DA" opacity="0.80" />
          {/* Yarn tail curling out */}
          <rect x="26" y="4"  width="2"  height="2"  fill="#78D898" />
          <rect x="28" y="2"  width="2"  height="4"  fill="#78D898" />
          <rect x="30" y="4"  width="2"  height="2"  fill="#78D898" />
        </svg>
      </div>
    </div>
  );
}

/* ── Bed (pixel-art, placed in room when pet is sleeping) ── */

function Bed() {
  return (
    <div style={{
      animation:       'food-drop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
      transformOrigin: 'center bottom',
      filter:          'drop-shadow(0 3px 10px rgba(180,150,220,0.55)) drop-shadow(0 2px 5px rgba(0,0,0,0.18))',
    }}>
      <svg width="74" height="48" viewBox="0 0 74 48" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
        {/* Headboard */}
        <rect x="2"  y="6"  width="10" height="30" fill="#C0A0D8" />
        <rect x="4"  y="8"  width="6"  height="26" fill="#D4B8EC" />
        {/* Star on headboard */}
        <rect x="6"  y="12" width="2"  height="6"  fill="#FF6B9D" opacity="0.9" />
        <rect x="4"  y="14" width="6"  height="2"  fill="#FF6B9D" opacity="0.9" />
        {/* Footboard */}
        <rect x="62" y="14" width="10" height="22" fill="#C0A0D8" />
        <rect x="64" y="16" width="6"  height="18" fill="#D4B8EC" />
        {/* Bed frame sides */}
        <rect x="2"  y="34" width="70" height="8"  fill="#C0A0D8" />
        <rect x="2"  y="36" width="70" height="6"  fill="#D4B8EC" />
        {/* Mattress */}
        <rect x="12" y="18" width="50" height="18" fill="#FFF0F8" />
        <rect x="12" y="18" width="50" height="4"  fill="#FFE4F4" />
        {/* Blanket / duvet */}
        <rect x="28" y="18" width="34" height="18" fill="#FFB3D0" />
        <rect x="28" y="18" width="34" height="5"  fill="#FF9ABF" />
        {/* Blanket fold line */}
        <rect x="28" y="22" width="34" height="2"  fill="#FF79AE" opacity="0.5" />
        {/* Pillow */}
        <rect x="13" y="20" width="14" height="12" fill="#FFFFFF" />
        <rect x="14" y="21" width="12" height="10" fill="#FFF0F8" />
        {/* Pillow detail dots */}
        <rect x="16" y="23" width="2"  height="2"  fill="#FFB3D0" opacity="0.7" />
        <rect x="20" y="26" width="2"  height="2"  fill="#FFB3D0" opacity="0.7" />
        <rect x="17" y="28" width="2"  height="2"  fill="#FFB3D0" opacity="0.5" />
        {/* Bed legs */}
        <rect x="4"  y="40" width="4"  height="6"  fill="#A888C0" />
        <rect x="66" y="40" width="4"  height="6"  fill="#A888C0" />
      </svg>
    </div>
  );
}

/* ── Room bubbles (scattered soap bubbles during cleaning / grooming) ── */

function RoomBubbles() {
  const bubbles = [
    { left: '12%', top: '38%', size: 16, delay: '0s',    dur: '2.6s', color: '#7EC8E3' },
    { left: '28%', top: '52%', size: 11, delay: '0.55s', dur: '3.1s', color: '#FF9ABF' },
    { left: '20%', top: '65%', size: 9,  delay: '1.1s',  dur: '2.8s', color: '#7EC8E3' },
    { left: '52%', top: '32%', size: 14, delay: '0.3s',  dur: '2.4s', color: '#FFD0E8' },
    { left: '68%', top: '56%', size: 10, delay: '0.85s', dur: '3.0s', color: '#7EC8E3' },
    { left: '78%', top: '42%', size: 13, delay: '1.4s',  dur: '2.7s', color: '#FF9ABF' },
    { left: '85%', top: '68%', size: 8,  delay: '0.2s',  dur: '3.4s', color: '#FFD0E8' },
    { left: '40%', top: '70%', size: 12, delay: '1.0s',  dur: '2.9s', color: '#7EC8E3' },
    { left: '60%', top: '78%', size: 7,  delay: '0.65s', dur: '3.2s', color: '#FF9ABF' },
    { left: '8%',  top: '55%', size: 10, delay: '1.7s',  dur: '2.5s', color: '#FFD0E8' },
  ];
  return (
    <>
      {bubbles.map((b, i) => (
        <div key={i} style={{
          position:       'absolute',
          left:           b.left,
          top:            b.top,
          width:          b.size,
          height:         b.size,
          borderRadius:   '50%',
          border:         `2px solid ${b.color}`,
          background:     `${b.color}2A`,
          animation:      `bubble-float ${b.dur} ease-out infinite`,
          animationDelay: b.delay,
          pointerEvents:  'none',
          zIndex:         1,
        }} />
      ))}
    </>
  );
}

/* ── Food bowl (pixel-art, placed in room when player clicks Feed) ── */

function FoodBowl() {
  const [phase, setPhase] = useState<'in' | 'idle'>('in');
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Pulsing glow ring */}
      <div style={{
        position:      'absolute',
        inset:         -10,
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(255,200,50,0.45) 0%, transparent 70%)',
        animation:     'food-hunger-ring 1.4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      {/* Bowl body */}
      <div
        style={{
          animation:       phase === 'in'
            ? 'food-drop-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'food-idle-sway 2.0s ease-in-out infinite',
          transformOrigin: 'center bottom',
          filter:          'drop-shadow(0 0 7px rgba(255,200,50,0.65)) drop-shadow(0 2px 5px rgba(0,0,0,0.22))',
        }}
        onAnimationEnd={phase === 'in' ? () => setPhase('idle') : undefined}
      >
        <svg width="40" height="30" viewBox="0 0 40 30" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
          {/* Steam wisps */}
          <rect x="14" y="0"  width="2" height="3" fill="#EEE4D4" opacity="0.75" />
          <rect x="19" y="-1" width="2" height="4" fill="#EEE4D4" opacity="0.65" />
          <rect x="24" y="0"  width="2" height="3" fill="#EEE4D4" opacity="0.75" />
          {/* Colourful kibble / food bits */}
          <rect x="11" y="5"  width="4" height="4" fill="#FF6644" />
          <rect x="16" y="4"  width="5" height="4" fill="#FFAA22" />
          <rect x="22" y="5"  width="4" height="4" fill="#FF6644" />
          <rect x="14" y="9"  width="3" height="3" fill="#FFAA22" />
          <rect x="19" y="8"  width="4" height="3" fill="#FFCC44" />
          <rect x="24" y="9"  width="3" height="3" fill="#FF8833" />
          {/* Bowl rim */}
          <rect x="7"  y="12" width="26" height="4" fill="#E8C090" />
          {/* Bowl body */}
          <rect x="5"  y="16" width="30" height="6" fill="#C8A070" />
          {/* Bowl base */}
          <rect x="9"  y="22" width="22" height="4" fill="#A07050" />
          {/* Shine highlight */}
          <rect x="9"  y="13" width="5"  height="2" fill="white"  opacity="0.35" />
        </svg>
      </div>
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

const CLICK_EMOJIS  = ['♥', '⭐', '✨', '💕', '♥', '🌟', '💖'];
const CLEAN_EMOJIS  = ['🫧', '✨', '💦', '🫧', '✨', '🫧'];

export function PetAvatar({
  stage,
  mood,
  pendingEvolution,
  onEvolutionEnd,
  petName,
  activeAnimation,
  speechMessage,
  speechMessageKey,
  onPetClick,
  isCleaningMode,
  onCleanClick,
  onCancelClean,
  foodPos,
  onFoodConsumed,
  toyPos,
  onToyConsumed,
}: PetAvatarProps) {
  const Sprite     = SPRITE_MAP[stage] ?? BabySprite;
  const baseClass  = getAnimClass(mood, pendingEvolution, activeAnimation);
  const isDead     = mood === 'dead';
  const isSleeping = mood === 'sleeping';

  /* ── Click particle state ── */
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);
  const particleIdRef = useRef(0);

  /* ── Petting bounce state — adds .anim-petting to the wrapper briefly ── */
  const [isPetting, setIsPetting] = useState(false);
  const petBounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleWrapperClick = useCallback((e: React.MouseEvent) => {
    if (isDead) return;
    e.stopPropagation(); // prevent room-background cancel when clicking the pet

    const isCleaning = isCleaningMode && !!onCleanClick;
    const emojis     = isCleaning ? CLEAN_EMOJIS : CLICK_EMOJIS;

    // Fire the right callback
    if (isCleaning) {
      onCleanClick!();
    } else {
      onPetClick?.();
    }

    // Spawn 3–5 particles (bubbles when cleaning, hearts when petting)
    const count = 3 + Math.floor(Math.random() * 3);
    const newParticles: ClickParticle[] = Array.from({ length: count }, (_, i) => ({
      id:    ++particleIdRef.current,
      x:     15 + Math.random() * 70,
      y:     10 + Math.random() * 55,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: i * 0.07,
    }));
    setClickParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id));
      setClickParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 950);

    clearTimeout(petBounceTimer.current);
    setIsPetting(true);
    petBounceTimer.current = setTimeout(() => setIsPetting(false), 420);
  }, [isDead, isCleaningMode, onCleanClick, onPetClick]);

  useEffect(() => () => clearTimeout(petBounceTimer.current), []);

  /* ── Stable refs so walk timers can call the latest callbacks
        without being listed in the effect's dep arrays ── */
  const onFoodConsumedRef = useRef(onFoodConsumed);
  useEffect(() => { onFoodConsumedRef.current = onFoodConsumed; }, [onFoodConsumed]);

  const onToyConsumedRef = useRef(onToyConsumed);
  useEffect(() => { onToyConsumedRef.current = onToyConsumed; }, [onToyConsumed]);

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

  // Start / stop walking loop based on mood + activeAnimation + food target
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
    if (activeAnimation || isCleaningMode) {
      // pause movement during action or cleaning mode (cat stays put)
      clearTimeout(walkTimer.current);
      setIsWalking(false);
      return;
    }
    if (foodPos) {
      // Walk straight to the food bowl
      clearTimeout(walkTimer.current);
      setWalkPos(prev => {
        setFacingLeft(foodPos.x < prev.x);
        return { x: foodPos.x, y: foodPos.y };
      });
      setIsWalking(true);
      walkTimer.current = setTimeout(() => {
        setIsWalking(false);
        // Notify parent — it will apply stats + trigger eating animation
        onFoodConsumedRef.current?.();
        // Resume normal walking after eating animation (~1.8 s)
        walkTimer.current = setTimeout(scheduleWalk, 1_900);
      }, WALK_MS + 120);
      return () => clearTimeout(walkTimer.current);
    }
    if (toyPos) {
      // Walk straight to the toy
      clearTimeout(walkTimer.current);
      setWalkPos(prev => {
        setFacingLeft(toyPos.x < prev.x);
        return { x: toyPos.x, y: toyPos.y };
      });
      setIsWalking(true);
      walkTimer.current = setTimeout(() => {
        setIsWalking(false);
        // Notify parent — it will apply stats + trigger playing animation
        onToyConsumedRef.current?.();
        // Resume normal walking after playing animation (~2.1 s)
        walkTimer.current = setTimeout(scheduleWalk, 2_200);
      }, WALK_MS + 120);
      return () => clearTimeout(walkTimer.current);
    }
    // alive, awake, no action — start the walk loop
    scheduleWalk();
    return () => clearTimeout(walkTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDead, isSleeping, activeAnimation, isCleaningMode, foodPos, toyPos]);

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
      style={isCleaningMode ? { cursor: 'none' } : undefined}
      onClick={isCleaningMode ? onCancelClean : undefined}
    >
      {/* Room background — renders behind the cat */}
      <RoomBackground />

      {/* Room bubbles — float during cleaning mode or grooming animation */}
      {(isCleaningMode || activeAnimation === 'grooming') && <RoomBubbles />}

      {/* Bed — appears when pet is sleeping, at the sleep position */}
      {isSleeping && (
        <div
          key="sleep-bed"
          style={{
            position:        'absolute',
            left:            '50%',
            top:             '74%',
            transform:       `translate(-50%, -50%) scale(0.94)`,
            transformOrigin: 'center bottom',
            pointerEvents:   'none',
            zIndex:          1,
          }}
        >
          <Bed />
        </div>
      )}

      {/* Food bowl — placed on the floor when player clicks Feed.
          Key changes when a new bowl is placed, remounting the component
          so the drop-in animation replays. */}
      {foodPos && (
        <div
          key={`food-${Math.round(foodPos.x)}-${Math.round(foodPos.y)}`}
          style={{
            position:        'absolute',
            left:            `${foodPos.x}%`,
            top:             `${foodPos.y}%`,
            transform:       `translate(-50%, -50%) scale(${(0.68 + (foodPos.y / 100) * 0.40).toFixed(3)})`,
            transformOrigin: 'center bottom',
            pointerEvents:   'none',
            zIndex:          1,
          }}
        >
          <FoodBowl />
        </div>
      )}

      {/* Toy ball — placed on the floor when player clicks Play.
          Key changes when a new toy is placed so the drop-in animation replays. */}
      {toyPos && (
        <div
          key={`toy-${Math.round(toyPos.x)}-${Math.round(toyPos.y)}`}
          style={{
            position:        'absolute',
            left:            `${toyPos.x}%`,
            top:             `${toyPos.y}%`,
            transform:       `translate(-50%, -50%) scale(${(0.68 + (toyPos.y / 100) * 0.40).toFixed(3)})`,
            transformOrigin: 'center bottom',
            pointerEvents:   'none',
            zIndex:          1,
          }}
        >
          <ToyBall />
        </div>
      )}

      {/* Cat walker — absolutely positioned, CSS transition does the movement.
          ⚠️  ONLY handles left/top/scale/flip transforms — never apply a CSS
          animation that uses `transform` here, it would override all of these. */}
      <div
        className="pet-avatar-wrapper"
        onClick={handleWrapperClick}
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
          cursor:          isCleaningMode ? 'none' : (isDead ? 'default' : 'pointer'),
          filter:          isCleaningMode
            ? 'drop-shadow(0 0 10px rgba(126,200,227,0.85)) drop-shadow(0 0 4px rgba(255,255,255,0.5))'
            : undefined,
          /* width / height come from .pet-avatar-wrapper in CSS */
        }}
      >
        {/* Inner bounce shell — bounce animation lives here so it never touches
            the outer wrapper's positioning transforms. */}
        <div
          className={isPetting ? 'anim-petting' : undefined}
          style={{ position: 'relative', width: '100%', height: '100%' }}
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

        {/* Speech bubble — floats above the pet, key forces animation replay */}
        {speechMessage && (
          <SpeechBubble
            key={speechMessageKey}
            text={speechMessage}
            facingLeft={facingLeft}
          />
        )}

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

        {/* Click / petting heart particles — float up and fade on each tap */}
        {clickParticles.map(p => (
          <div
            key={p.id}
            style={{
              position:      'absolute',
              left:          `${p.x}%`,
              top:           `${p.y}%`,
              fontSize:      `${13 + Math.random() * 6}px`,
              lineHeight:    1,
              pointerEvents: 'none',
              userSelect:    'none',
              zIndex:        20,
              /* counter-mirror so hearts face the same way regardless of pet direction */
              transform:     `scaleX(${facingLeft ? -1 : 1})`,
              animation:     `heart-pop-up 0.85s ease-out forwards`,
              animationDelay:`${p.delay}s`,
              opacity:       0,
            }}
          >
            {p.emoji}
          </div>
        ))}

        </div>{/* end inner bounce shell */}
      </div>{/* end pet-avatar-wrapper */}
    </div>
  );
}
