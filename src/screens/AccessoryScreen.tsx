import { useState } from 'react';
import { useGame, useNavigate } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';
import {
  ACCESSORY_CATALOG,
  ACCESSORY_BY_ID,
  CATEGORY_LABELS,
} from '@/data/accessories';
import type { AccessoryCategory, AccessoryDefinition, AccessorySlot } from '@/types';

/* ── Pixel-art coin icon ─────────────────────────────────────────────────── */
function CoinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="5"  y="1"  width="8" height="16" fill="#FFD700" />
      <rect x="1"  y="5"  width="16" height="8" fill="#FFD700" />
      <rect x="3"  y="2"  width="12" height="14" fill="#FFD700" />
      <rect x="3"  y="2"  width="12" height="3"  fill="#FFE84D" />
      <rect x="3"  y="2"  width="3"  height="12" fill="#FFE84D" />
      <rect x="6"  y="5"  width="6"  height="8"  fill="#E6A800" />
      <rect x="7"  y="6"  width="2"  height="6"  fill="#FFD700" />
      <rect x="6"  y="7"  width="6"  height="2"  fill="#FFD700" />
    </svg>
  );
}

/* ── Pixel-art accessory preview overlays ───────────────────────────────── */

/** Renders a small pixel-art preview of the accessory. */
function AccessoryPreview({ overlayId }: { overlayId: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52 }}>
      {overlayId === 'flower_crown' && (
        <svg width="44" height="22" viewBox="0 0 44 22" shapeRendering="crispEdges">
          {/* stem */}
          <rect x="20" y="12" width="4" height="6" fill="#78D898" />
          {/* petals */}
          {[2,10,18,26,34].map((x, i) => (
            <rect key={i} x={x} y="2" width="8" height="8" rx="0" fill={i % 2 === 0 ? '#FFB3D0' : '#FF9ABF'} />
          ))}
          {/* centres */}
          {[4,12,20,28,36].map((x, i) => (
            <rect key={i} x={x+1} y="3" width="4" height="4" fill="#FFE8F4" />
          ))}
        </svg>
      )}
      {overlayId === 'blue_cap' && (
        <svg width="44" height="24" viewBox="0 0 44 24" shapeRendering="crispEdges">
          <rect x="4"  y="8"  width="36" height="14" fill="#4A90D9" />
          <rect x="8"  y="4"  width="28" height="10" fill="#5BA0E9" />
          <rect x="0"  y="16" width="44" height="4"  fill="#3A7CC9" />
          <rect x="10" y="6"  width="8"  height="4"  fill="#7EC8E3" opacity="0.5" />
        </svg>
      )}
      {overlayId === 'top_hat' && (
        <svg width="36" height="36" viewBox="0 0 36 36" shapeRendering="crispEdges">
          <rect x="4"  y="28" width="28" height="6"  fill="#2D2D2D" />
          <rect x="8"  y="6"  width="20" height="24" fill="#1A1A1A" />
          <rect x="8"  y="6"  width="20" height="4"  fill="#3A3A3A" />
          <rect x="10" y="8"  width="6"  height="6"  fill="#3A3A3A" opacity="0.5" />
        </svg>
      )}
      {overlayId === 'witch_hat' && (
        <svg width="40" height="44" viewBox="0 0 40 44" shapeRendering="crispEdges">
          <rect x="0"  y="36" width="40" height="8"  fill="#6B35A8" />
          <rect x="8"  y="22" width="24" height="18" fill="#8B45C8" />
          <rect x="14" y="10" width="12" height="16" fill="#7B3DB8" />
          <rect x="18" y="2"  width="4"  height="12" fill="#6B35A8" />
          <rect x="10" y="28" width="20" height="4"  fill="#FFD700" />
          <rect x="12" y="26" width="4"  height="4"  fill="#FFD700" />
          <rect x="16" y="24" width="4"  height="2"  fill="#FFE84D" />
        </svg>
      )}
      {overlayId === 'party_hat' && (
        <svg width="36" height="44" viewBox="0 0 36 44" shapeRendering="crispEdges">
          <rect x="6"  y="34" width="24" height="8"  fill="#FF9ABF" />
          <rect x="10" y="22" width="16" height="16" fill="#FF6B9D" />
          <rect x="14" y="10" width="8"  height="16" fill="#FF9ABF" />
          <rect x="16" y="2"  width="4"  height="12" fill="#FFD700" />
          <rect x="8"  y="26" width="2"  height="2"  fill="#FFD700" />
          <rect x="20" y="30" width="2"  height="2"  fill="#7EC8E3" />
          <rect x="12" y="16" width="2"  height="2"  fill="#FFD700" />
          <rect x="22" y="20" width="2"  height="2"  fill="#FF9ABF" />
        </svg>
      )}
      {overlayId === 'red_bow' && (
        <svg width="44" height="28" viewBox="0 0 44 28" shapeRendering="crispEdges">
          {/* left wing */}
          <rect x="2"  y="6"  width="16" height="16" fill="#FF2244" />
          <rect x="4"  y="8"  width="12" height="12" fill="#FF4466" />
          <rect x="6"  y="10" width="6"  height="6"  fill="#FF6688" opacity="0.6" />
          {/* right wing */}
          <rect x="26" y="6"  width="16" height="16" fill="#FF2244" />
          <rect x="28" y="8"  width="12" height="12" fill="#FF4466" />
          <rect x="32" y="10" width="6"  height="6"  fill="#FF6688" opacity="0.6" />
          {/* centre knot */}
          <rect x="18" y="10" width="8"  height="8"  fill="#CC1133" />
          <rect x="20" y="12" width="4"  height="4"  fill="#FF2244" />
        </svg>
      )}
      {overlayId === 'blue_scarf' && (
        <svg width="48" height="24" viewBox="0 0 48 24" shapeRendering="crispEdges">
          <rect x="4"  y="4"  width="40" height="10" fill="#4A90D9" />
          <rect x="4"  y="4"  width="40" height="3"  fill="#5BA0E9" />
          <rect x="28" y="12" width="12" height="10" fill="#4A90D9" />
          <rect x="30" y="14" width="8"  height="6"  fill="#5BA0E9" />
          {/* stripe */}
          {[4,12,20,28,36].map((x, i) => (
            <rect key={i} x={x} y="6" width="6" height="2" fill="#7EC8E3" opacity="0.6" />
          ))}
        </svg>
      )}
      {overlayId === 'tiny_tie' && (
        <svg width="24" height="44" viewBox="0 0 24 44" shapeRendering="crispEdges">
          <rect x="8"  y="2"  width="8"  height="10" fill="#CC1133" />
          <rect x="6"  y="10" width="12" height="6"  fill="#AA0022" />
          <rect x="8"  y="14" width="8"  height="28" fill="#FF2244" />
          <rect x="10" y="14" width="4"  height="28" fill="#FF4466" />
          <rect x="8"  y="38" width="8"  height="4"  fill="#CC1133" />
          <rect x="6"  y="38" width="12" height="2"  fill="#AA0022" />
          {/* diagonal stripe */}
          <rect x="8"  y="20" width="8"  height="2"  fill="#FFD700" opacity="0.7" />
          <rect x="8"  y="28" width="8"  height="2"  fill="#FFD700" opacity="0.7" />
        </svg>
      )}
      {overlayId === 'rainbow_shirt' && (
        <svg width="44" height="32" viewBox="0 0 44 32" shapeRendering="crispEdges">
          <rect x="6"  y="4"  width="32" height="28" fill="#FF6B9D" />
          <rect x="0"  y="4"  width="8"  height="20" fill="#FF9ABF" />
          <rect x="36" y="4"  width="8"  height="20" fill="#FF9ABF" />
          {/* rainbow stripes */}
          <rect x="6"  y="8"  width="32" height="4"  fill="#FF6644" opacity="0.8" />
          <rect x="6"  y="12" width="32" height="4"  fill="#FFD700" opacity="0.8" />
          <rect x="6"  y="16" width="32" height="4"  fill="#78D898" opacity="0.8" />
          <rect x="6"  y="20" width="32" height="4"  fill="#7EC8E3" opacity="0.8" />
          <rect x="6"  y="24" width="32" height="4"  fill="#C8A0E8" opacity="0.8" />
        </svg>
      )}
      {overlayId === 'round_glasses' && (
        <svg width="44" height="20" viewBox="0 0 44 20" shapeRendering="crispEdges">
          {/* left lens */}
          <rect x="2"  y="4"  width="16" height="12" fill="none" stroke="#2D2D2D" strokeWidth="3" />
          <rect x="4"  y="5"  width="6"  height="4"  fill="#C8EAF8" opacity="0.45" />
          {/* bridge */}
          <rect x="18" y="8"  width="8"  height="3"  fill="#2D2D2D" />
          {/* right lens */}
          <rect x="26" y="4"  width="16" height="12" fill="none" stroke="#2D2D2D" strokeWidth="3" />
          <rect x="28" y="5"  width="6"  height="4"  fill="#C8EAF8" opacity="0.45" />
          {/* temple arms */}
          <rect x="0"  y="9"  width="4"  height="2"  fill="#2D2D2D" />
          <rect x="40" y="9"  width="4"  height="2"  fill="#2D2D2D" />
        </svg>
      )}
      {overlayId === 'heart_glasses' && (
        <svg width="48" height="24" viewBox="0 0 48 24" shapeRendering="crispEdges">
          {/* left heart */}
          <rect x="2"  y="6"  width="4"  height="4"  fill="#FF6B9D" />
          <rect x="8"  y="6"  width="4"  height="4"  fill="#FF6B9D" />
          <rect x="0"  y="8"  width="16" height="8"  fill="#FF6B9D" />
          <rect x="2"  y="16" width="12" height="4"  fill="#FF6B9D" />
          <rect x="4"  y="20" width="8"  height="2"  fill="#FF6B9D" />
          <rect x="3"  y="8"  width="4"  height="4"  fill="#FFB3D0" opacity="0.5" />
          {/* bridge */}
          <rect x="16" y="10" width="16" height="3"  fill="#CC3377" />
          {/* right heart */}
          <rect x="30" y="6"  width="4"  height="4"  fill="#FF6B9D" />
          <rect x="36" y="6"  width="4"  height="4"  fill="#FF6B9D" />
          <rect x="28" y="8"  width="16" height="8"  fill="#FF6B9D" />
          <rect x="30" y="16" width="12" height="4"  fill="#FF6B9D" />
          <rect x="32" y="20" width="8"  height="2"  fill="#FF6B9D" />
          <rect x="31" y="8"  width="4"  height="4"  fill="#FFB3D0" opacity="0.5" />
          {/* arms */}
          <rect x="0"  y="11" width="2"  height="2"  fill="#CC3377" />
          <rect x="44" y="11" width="4"  height="2"  fill="#CC3377" />
        </svg>
      )}
      {overlayId === 'star_badge' && (
        <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
          <rect x="12" y="0"  width="8"  height="32" fill="#FFD700" />
          <rect x="0"  y="12" width="32" height="8"  fill="#FFD700" />
          <rect x="4"  y="4"  width="6"  height="6"  fill="#FFD700" />
          <rect x="22" y="4"  width="6"  height="6"  fill="#FFD700" />
          <rect x="4"  y="22" width="6"  height="6"  fill="#FFD700" />
          <rect x="22" y="22" width="6"  height="6"  fill="#FFD700" />
          <rect x="8"  y="8"  width="16" height="16" fill="#FFE84D" />
          <rect x="10" y="10" width="6"  height="4"  fill="#FFF08A" opacity="0.7" />
        </svg>
      )}
      {overlayId === 'gold_crown' && (
        <svg width="44" height="32" viewBox="0 0 44 32" shapeRendering="crispEdges">
          <rect x="4"  y="20" width="36" height="10" fill="#E6A800" />
          <rect x="4"  y="20" width="36" height="4"  fill="#FFD700" />
          {/* teeth */}
          <rect x="4"  y="6"  width="8"  height="16" fill="#FFD700" />
          <rect x="18" y="2"  width="8"  height="20" fill="#FFD700" />
          <rect x="32" y="6"  width="8"  height="16" fill="#FFD700" />
          {/* gem top */}
          <rect x="20" y="4"  width="4"  height="4"  fill="#FF6B9D" />
          <rect x="7"  y="8"  width="2"  height="2"  fill="#FF6B9D" />
          <rect x="35" y="8"  width="2"  height="2"  fill="#FF6B9D" />
          {/* highlight */}
          <rect x="6"  y="22" width="6"  height="2"  fill="#FFE84D" opacity="0.7" />
          <rect x="20" y="22" width="6"  height="2"  fill="#FFE84D" opacity="0.7" />
          <rect x="34" y="22" width="6"  height="2"  fill="#FFE84D" opacity="0.7" />
        </svg>
      )}
    </div>
  );
}

/* ── Tiny pet silhouette for the wardrobe preview ─────────────────────────── */
function PetSilhouette({ equippedIds }: { equippedIds: string[] }) {
  return (
    <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto' }}>
      {/* Simple pixel cat body */}
      <svg width="80" height="80" viewBox="0 0 80 80" shapeRendering="crispEdges" style={{ position: 'absolute', inset: 0 }}>
        {/* body */}
        <rect x="20" y="36" width="40" height="32" fill="#FF9ABF" />
        {/* head */}
        <rect x="22" y="16" width="36" height="28" fill="#FFB3D0" />
        {/* ears */}
        <rect x="22" y="8"  width="10" height="12" fill="#FFB3D0" />
        <rect x="48" y="8"  width="10" height="12" fill="#FFB3D0" />
        <rect x="24" y="10" width="6"  height="8"  fill="#FF9ABF" />
        <rect x="50" y="10" width="6"  height="8"  fill="#FF9ABF" />
        {/* eyes */}
        <rect x="28" y="26" width="6"  height="6"  fill="#3D1522" />
        <rect x="46" y="26" width="6"  height="6"  fill="#3D1522" />
        <rect x="30" y="27" width="2"  height="2"  fill="#FFFFFF" />
        <rect x="48" y="27" width="2"  height="2"  fill="#FFFFFF" />
        {/* nose & mouth */}
        <rect x="38" y="32" width="4"  height="2"  fill="#FF6B9D" />
        <rect x="34" y="34" width="4"  height="2"  fill="#FF6B9D" />
        <rect x="42" y="34" width="4"  height="2"  fill="#FF6B9D" />
        {/* belly */}
        <rect x="28" y="44" width="24" height="20" fill="#FFD0E8" />
        {/* tail */}
        <rect x="56" y="48" width="8"  height="6"  fill="#FF9ABF" />
        <rect x="60" y="42" width="6"  height="8"  fill="#FF9ABF" />
        {/* legs */}
        <rect x="22" y="64" width="10" height="8"  fill="#FF9ABF" />
        <rect x="48" y="64" width="10" height="8"  fill="#FF9ABF" />
      </svg>

      {/* Accessory overlays on preview */}
      {equippedIds.includes('flower_crown') && (
        <div style={{ position: 'absolute', top: -4, left: 12, pointerEvents: 'none' }}>
          <svg width="56" height="16" viewBox="0 0 56 16" shapeRendering="crispEdges">
            {[2,12,22,32,42].map((x,i) => (
              <rect key={i} x={x} y="0" width="10" height="10" fill={i%2===0?'#FFB3D0':'#FF9ABF'} />
            ))}
            {[4,14,24,34,44].map((x,i) => (
              <rect key={i} x={x+1} y="1" width="6" height="6" fill="#FFE8F4" />
            ))}
            <rect x="24" y="10" width="6" height="6" fill="#78D898" />
          </svg>
        </div>
      )}
      {equippedIds.includes('blue_cap') && (
        <div style={{ position: 'absolute', top: 0, left: 10, pointerEvents: 'none' }}>
          <svg width="60" height="24" viewBox="0 0 60 24" shapeRendering="crispEdges">
            <rect x="6"  y="10" width="48" height="12" fill="#4A90D9" />
            <rect x="10" y="4"  width="40" height="10" fill="#5BA0E9" />
            <rect x="0"  y="18" width="60" height="4"  fill="#3A7CC9" />
            <rect x="12" y="6"  width="10" height="5"  fill="#7EC8E3" opacity="0.5" />
          </svg>
        </div>
      )}
      {equippedIds.includes('top_hat') && (
        <div style={{ position: 'absolute', top: -12, left: 18, pointerEvents: 'none' }}>
          <svg width="44" height="32" viewBox="0 0 44 32" shapeRendering="crispEdges">
            <rect x="4"  y="24" width="36" height="6"  fill="#2D2D2D" />
            <rect x="10" y="4"  width="24" height="22" fill="#1A1A1A" />
            <rect x="10" y="4"  width="24" height="4"  fill="#3A3A3A" />
            <rect x="12" y="6"  width="8"  height="6"  fill="#3A3A3A" opacity="0.4" />
          </svg>
        </div>
      )}
      {equippedIds.includes('witch_hat') && (
        <div style={{ position: 'absolute', top: -16, left: 14, pointerEvents: 'none' }}>
          <svg width="52" height="36" viewBox="0 0 52 36" shapeRendering="crispEdges">
            <rect x="0"  y="28" width="52" height="8"  fill="#6B35A8" />
            <rect x="10" y="16" width="32" height="16" fill="#8B45C8" />
            <rect x="18" y="6"  width="16" height="14" fill="#7B3DB8" />
            <rect x="22" y="0"  width="8"  height="10" fill="#6B35A8" />
            <rect x="12" y="22" width="28" height="4"  fill="#FFD700" />
          </svg>
        </div>
      )}
      {equippedIds.includes('party_hat') && (
        <div style={{ position: 'absolute', top: -10, left: 20, pointerEvents: 'none' }}>
          <svg width="40" height="32" viewBox="0 0 40 32" shapeRendering="crispEdges">
            <rect x="6"  y="24" width="28" height="8"  fill="#FF9ABF" />
            <rect x="10" y="14" width="20" height="14" fill="#FF6B9D" />
            <rect x="14" y="6"  width="12" height="12" fill="#FF9ABF" />
            <rect x="18" y="0"  width="4"  height="8"  fill="#FFD700" />
            <rect x="8"  y="18" width="2"  height="2"  fill="#FFD700" />
            <rect x="24" y="20" width="2"  height="2"  fill="#7EC8E3" />
          </svg>
        </div>
      )}
      {equippedIds.includes('gold_crown') && (
        <div style={{ position: 'absolute', top: -6, left: 14, pointerEvents: 'none' }}>
          <svg width="52" height="22" viewBox="0 0 52 22" shapeRendering="crispEdges">
            <rect x="4"  y="12" width="44" height="8"  fill="#E6A800" />
            <rect x="4"  y="12" width="44" height="3"  fill="#FFD700" />
            <rect x="4"  y="4"  width="8"  height="10" fill="#FFD700" />
            <rect x="22" y="0"  width="8"  height="14" fill="#FFD700" />
            <rect x="40" y="4"  width="8"  height="10" fill="#FFD700" />
            <rect x="24" y="2"  width="4"  height="4"  fill="#FF6B9D" />
          </svg>
        </div>
      )}
      {equippedIds.includes('red_bow') && (
        <div style={{ position: 'absolute', top: 40, left: 16, pointerEvents: 'none' }}>
          <svg width="48" height="24" viewBox="0 0 48 24" shapeRendering="crispEdges">
            <rect x="0"  y="4"  width="20" height="16" fill="#FF2244" />
            <rect x="2"  y="6"  width="16" height="12" fill="#FF4466" />
            <rect x="28" y="4"  width="20" height="16" fill="#FF2244" />
            <rect x="30" y="6"  width="16" height="12" fill="#FF4466" />
            <rect x="20" y="8"  width="8"  height="8"  fill="#CC1133" />
            <rect x="22" y="10" width="4"  height="4"  fill="#FF2244" />
          </svg>
        </div>
      )}
      {equippedIds.includes('blue_scarf') && (
        <div style={{ position: 'absolute', top: 36, left: 6, pointerEvents: 'none' }}>
          <svg width="68" height="14" viewBox="0 0 68 14" shapeRendering="crispEdges">
            <rect x="0"  y="0" width="68" height="10" fill="#4A90D9" />
            <rect x="0"  y="0" width="68" height="3"  fill="#5BA0E9" />
            {[0,10,20,30,40,50,60].map((x,i) => (
              <rect key={i} x={x} y="2" width="8" height="2" fill="#7EC8E3" opacity="0.6" />
            ))}
          </svg>
        </div>
      )}
      {equippedIds.includes('tiny_tie') && (
        <div style={{ position: 'absolute', top: 38, left: 34, pointerEvents: 'none' }}>
          <svg width="14" height="34" viewBox="0 0 14 34" shapeRendering="crispEdges">
            <rect x="4" y="0"  width="6"  height="8"  fill="#CC1133" />
            <rect x="2" y="6"  width="10" height="5"  fill="#AA0022" />
            <rect x="4" y="10" width="6"  height="22" fill="#FF2244" />
            <rect x="5" y="10" width="4"  height="22" fill="#FF4466" />
            <rect x="4" y="30" width="6"  height="4"  fill="#CC1133" />
            <rect x="4" y="16" width="6"  height="2"  fill="#FFD700" opacity="0.7" />
            <rect x="4" y="24" width="6"  height="2"  fill="#FFD700" opacity="0.7" />
          </svg>
        </div>
      )}
      {equippedIds.includes('rainbow_shirt') && (
        <div style={{ position: 'absolute', top: 40, left: 12, pointerEvents: 'none' }}>
          <svg width="56" height="30" viewBox="0 0 56 30" shapeRendering="crispEdges">
            <rect x="8"  y="0"  width="40" height="30" fill="#FF6B9D" />
            <rect x="0"  y="0"  width="10" height="20" fill="#FF9ABF" />
            <rect x="46" y="0"  width="10" height="20" fill="#FF9ABF" />
            <rect x="8"  y="4"  width="40" height="4"  fill="#FF6644" opacity="0.8" />
            <rect x="8"  y="10" width="40" height="4"  fill="#FFD700" opacity="0.8" />
            <rect x="8"  y="16" width="40" height="4"  fill="#78D898" opacity="0.8" />
            <rect x="8"  y="22" width="40" height="4"  fill="#7EC8E3" opacity="0.8" />
          </svg>
        </div>
      )}
      {equippedIds.includes('round_glasses') && (
        <div style={{ position: 'absolute', top: 30, left: 12, pointerEvents: 'none' }}>
          <svg width="56" height="16" viewBox="0 0 56 16" shapeRendering="crispEdges">
            <rect x="2"  y="2"  width="20" height="12" fill="none" stroke="#2D2D2D" strokeWidth="3" />
            <rect x="4"  y="3"  width="8"  height="5"  fill="#C8EAF8" opacity="0.45" />
            <rect x="22" y="6"  width="12" height="3"  fill="#2D2D2D" />
            <rect x="34" y="2"  width="20" height="12" fill="none" stroke="#2D2D2D" strokeWidth="3" />
            <rect x="36" y="3"  width="8"  height="5"  fill="#C8EAF8" opacity="0.45" />
            <rect x="0"  y="7"  width="4"  height="2"  fill="#2D2D2D" />
            <rect x="52" y="7"  width="4"  height="2"  fill="#2D2D2D" />
          </svg>
        </div>
      )}
      {equippedIds.includes('heart_glasses') && (
        <div style={{ position: 'absolute', top: 28, left: 10, pointerEvents: 'none' }}>
          <svg width="60" height="20" viewBox="0 0 60 20" shapeRendering="crispEdges">
            <rect x="2"  y="4"  width="5"  height="5"  fill="#FF6B9D" />
            <rect x="9"  y="4"  width="5"  height="5"  fill="#FF6B9D" />
            <rect x="0"  y="7"  width="18" height="8"  fill="#FF6B9D" />
            <rect x="2"  y="15" width="14" height="4"  fill="#FF6B9D" />
            <rect x="4"  y="19" width="10" height="2"  fill="#FF6B9D" />
            <rect x="3"  y="7"  width="5"  height="4"  fill="#FFB3D0" opacity="0.5" />
            <rect x="18" y="9"  width="24" height="3"  fill="#CC3377" />
            <rect x="42" y="4"  width="5"  height="5"  fill="#FF6B9D" />
            <rect x="49" y="4"  width="5"  height="5"  fill="#FF6B9D" />
            <rect x="40" y="7"  width="20" height="8"  fill="#FF6B9D" />
            <rect x="42" y="15" width="16" height="4"  fill="#FF6B9D" />
            <rect x="44" y="19" width="12" height="2"  fill="#FF6B9D" />
            <rect x="43" y="7"  width="5"  height="4"  fill="#FFB3D0" opacity="0.5" />
            <rect x="0"  y="11" width="2"  height="2"  fill="#CC3377" />
            <rect x="58" y="11" width="2"  height="2"  fill="#CC3377" />
          </svg>
        </div>
      )}
      {equippedIds.includes('star_badge') && (
        <div style={{ position: 'absolute', top: 44, left: 14, pointerEvents: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" shapeRendering="crispEdges">
            <rect x="6"  y="0"  width="8"  height="20" fill="#FFD700" />
            <rect x="0"  y="6"  width="20" height="8"  fill="#FFD700" />
            <rect x="2"  y="2"  width="4"  height="4"  fill="#FFD700" />
            <rect x="14" y="2"  width="4"  height="4"  fill="#FFD700" />
            <rect x="2"  y="14" width="4"  height="4"  fill="#FFD700" />
            <rect x="14" y="14" width="4"  height="4"  fill="#FFD700" />
            <rect x="4"  y="4"  width="12" height="12" fill="#FFE84D" />
            <rect x="6"  y="6"  width="4"  height="3"  fill="#FFF08A" opacity="0.7" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── Category filter pills ───────────────────────────────────────────────── */
type Filter = 'all' | AccessoryCategory;

function FilterPill({
  label,
  active,
  onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '4px 12px',
        borderRadius: 'var(--radius-full)',
        border:       `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background:   active ? 'var(--color-primary)' : 'var(--color-surface)',
        color:        active ? 'var(--color-text-inverse)' : 'var(--color-text)',
        fontSize:     'var(--font-size-xs)',
        fontFamily:   'var(--font-body)',
        fontWeight:   700,
        cursor:       'pointer',
        transition:   'var(--transition-fast)',
        minHeight:    32,
        whiteSpace:   'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Item card ───────────────────────────────────────────────────────────── */
function ItemCard({
  item,
  owned,
  equipped,
  coins,
  onBuy,
  onEquip,
  onUnequip,
}: {
  item: AccessoryDefinition;
  owned: boolean;
  equipped: boolean;
  coins: number;
  onBuy: () => void;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  const canAfford = coins >= item.price;

  return (
    <div style={{
      background:   'var(--color-surface)',
      border:       `2px solid ${equipped ? 'var(--color-primary)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      padding:      'var(--space-3)',
      display:      'flex',
      flexDirection:'column',
      alignItems:   'center',
      gap:          'var(--space-2)',
      boxShadow:    equipped ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      transition:   'var(--transition-normal)',
      position:     'relative',
    }}>
      {/* Equipped badge */}
      {equipped && (
        <div style={{
          position:     'absolute',
          top:          -6,
          right:        -6,
          background:   'var(--color-primary)',
          color:        '#fff',
          borderRadius: 'var(--radius-full)',
          fontSize:     '0.55rem',
          fontFamily:   'var(--font-display)',
          padding:      '2px 6px',
          zIndex:       1,
        }}>ON</div>
      )}

      {/* Preview */}
      <AccessoryPreview overlayId={item.overlayComponent} />

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize:   '0.5rem',
        color:      'var(--color-text)',
        textAlign:  'center',
        lineHeight: 1.4,
      }}>{item.name}</div>

      {/* Description */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize:   'var(--font-size-xs)',
        color:      'var(--color-text-muted)',
        textAlign:  'center',
        lineHeight: 1.3,
      }}>{item.description}</div>

      {/* Price / action */}
      {!owned ? (
        <button
          onClick={onBuy}
          disabled={!canAfford}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          4,
            padding:      '5px 12px',
            borderRadius: 'var(--radius-full)',
            background:   canAfford ? 'var(--color-primary)' : 'var(--color-border)',
            color:        canAfford ? '#fff' : 'var(--color-text-muted)',
            border:       'none',
            fontFamily:   'var(--font-display)',
            fontSize:     '0.5rem',
            cursor:       canAfford ? 'pointer' : 'not-allowed',
            transition:   'var(--transition-fast)',
            minHeight:    32,
          }}
        >
          <CoinIcon size={13} />
          {item.price}
        </button>
      ) : equipped ? (
        <button
          onClick={onUnequip}
          style={{
            padding:      '5px 12px',
            borderRadius: 'var(--radius-full)',
            background:   'var(--color-surface-hover)',
            color:        'var(--color-text-muted)',
            border:       '2px solid var(--color-border)',
            fontFamily:   'var(--font-display)',
            fontSize:     '0.5rem',
            cursor:       'pointer',
            transition:   'var(--transition-fast)',
            minHeight:    32,
          }}
        >
          Take Off
        </button>
      ) : (
        <button
          onClick={onEquip}
          style={{
            padding:      '5px 12px',
            borderRadius: 'var(--radius-full)',
            background:   'var(--color-accent)',
            color:        '#0d2d3a',
            border:       'none',
            fontFamily:   'var(--font-display)',
            fontSize:     '0.5rem',
            cursor:       'pointer',
            transition:   'var(--transition-fast)',
            minHeight:    32,
          }}
        >
          Equip
        </button>
      )}
    </div>
  );
}

/* ── Main screen ─────────────────────────────────────────────────────────── */

export function AccessoryScreen() {
  const { state, dispatch } = useGame();
  const navigate             = useNavigate();
  const { addToast }         = useToast();

  const coins               = state.save.coins               ?? 0;
  const ownedAccessories    = state.save.ownedAccessories    ?? [];
  const equippedAccessories = state.save.equippedAccessories ?? {};

  const [tab,    setTab]    = useState<'shop' | 'wardrobe'>('shop');
  const [filter, setFilter] = useState<Filter>('all');

  const equippedIds = Object.values(equippedAccessories).filter(Boolean) as string[];

  const visibleItems = ACCESSORY_CATALOG.filter(item => {
    if (tab === 'wardrobe' && !ownedAccessories.includes(item.id)) return false;
    if (filter !== 'all' && item.category !== filter) return false;
    return true;
  });

  function handleBuy(id: string) {
    const item = ACCESSORY_BY_ID[id];
    if (!item) return;
    if (coins < item.price) { addToast('Not enough coins! 🪙', 'warning'); return; }
    dispatch({ type: 'BUY_ACCESSORY', payload: { id } });
    addToast(`Bought ${item.emoji} ${item.name}!`, 'success');
  }

  function handleEquip(id: string) {
    const item = ACCESSORY_BY_ID[id];
    if (!item) return;
    dispatch({ type: 'EQUIP_ACCESSORY', payload: { id, slot: item.category as AccessorySlot } });
    addToast(`${item.emoji} ${item.name} equipped!`, 'success');
  }

  function handleUnequip(slot: AccessorySlot) {
    dispatch({ type: 'UNEQUIP_ACCESSORY', payload: { slot } });
    addToast('Accessory removed!', 'info');
  }

  return (
    <div className="screen" style={{ background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        'var(--space-3) var(--space-4)',
        background:     'var(--color-surface)',
        borderBottom:   '2px solid var(--color-border)',
        flexShrink:     0,
      }}>
        <button
          onClick={() => navigate('pet')}
          style={{
            background:   'none',
            border:       'none',
            fontSize:     20,
            cursor:       'pointer',
            color:        'var(--color-text)',
            minHeight:    44,
            minWidth:     44,
          }}
          aria-label="Back to pet"
        >←</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)' }}>
            👗 Accessory Shop
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Coins from evolving!
          </div>
        </div>

        {/* Coin display */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          4,
          background:   'var(--color-warning-bg)',
          border:       '2px solid var(--color-warning)',
          borderRadius: 'var(--radius-full)',
          padding:      '4px 10px',
          fontFamily:   'var(--font-display)',
          fontSize:     'var(--font-size-xs)',
          color:        '#7A5C00',
        }}>
          <CoinIcon size={16} />
          {coins}
        </div>
      </header>

      {/* ── Pet wardrobe preview ── */}
      <div style={{
        background:     'linear-gradient(135deg, var(--color-bg-alt), var(--color-surface-alt))',
        padding:        'var(--space-3) var(--space-4)',
        display:        'flex',
        alignItems:     'center',
        gap:            'var(--space-4)',
        borderBottom:   '2px solid var(--color-border)',
        flexShrink:     0,
      }}>
        <PetSilhouette equippedIds={equippedIds} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
            Currently wearing:
          </div>
          {equippedIds.length === 0 ? (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Nothing yet — visit the shop! 🛍️
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {equippedIds.map(id => {
                const item = ACCESSORY_BY_ID[id];
                if (!item) return null;
                const slot = item.category as AccessorySlot;
                return (
                  <div key={id} style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          4,
                    background:   'var(--color-surface)',
                    border:       '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-full)',
                    padding:      '2px 8px',
                    fontSize:     'var(--font-size-xs)',
                    fontFamily:   'var(--font-body)',
                    fontWeight:   700,
                  }}>
                    <span>{item.emoji}</span>
                    <span style={{ color: 'var(--color-text)' }}>{item.name}</span>
                    <button
                      onClick={() => handleUnequip(slot)}
                      style={{
                        background:   'none',
                        border:       'none',
                        color:        'var(--color-text-muted)',
                        cursor:       'pointer',
                        padding:      0,
                        fontSize:     14,
                        lineHeight:   1,
                        minHeight:    'unset',
                        minWidth:     'unset',
                      }}
                      aria-label={`Remove ${item.name}`}
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div style={{
        display:     'flex',
        gap:         0,
        borderBottom:'2px solid var(--color-border)',
        flexShrink:  0,
        background:  'var(--color-surface)',
      }}>
        {(['shop', 'wardrobe'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex:         1,
              padding:      'var(--space-3)',
              border:       'none',
              borderBottom: tab === t ? '3px solid var(--color-primary)' : '3px solid transparent',
              background:   'none',
              color:        tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontFamily:   'var(--font-display)',
              fontSize:     '0.5rem',
              cursor:       'pointer',
              transition:   'var(--transition-fast)',
              minHeight:    44,
            }}
          >
            {t === 'shop' ? '🛒 Shop' : '👔 Wardrobe'}
            {t === 'wardrobe' && ownedAccessories.length > 0 && (
              <span style={{
                marginLeft:   4,
                background:   'var(--color-primary)',
                color:        '#fff',
                borderRadius: 'var(--radius-full)',
                fontSize:     '0.5rem',
                padding:      '1px 5px',
              }}>{ownedAccessories.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Category filter ── */}
      <div style={{
        display:    'flex',
        gap:        'var(--space-2)',
        padding:    'var(--space-3) var(--space-4)',
        overflowX:  'auto',
        flexShrink: 0,
        background: 'var(--color-bg)',
      }}>
        <FilterPill label="All"         active={filter === 'all'}    onClick={() => setFilter('all')} />
        {(Object.entries(CATEGORY_LABELS) as [AccessoryCategory, string][]).map(([cat, label]) => (
          <FilterPill key={cat} label={label} active={filter === cat} onClick={() => setFilter(cat)} />
        ))}
      </div>

      {/* ── Item grid ── */}
      <div style={{
        flex:       1,
        overflowY:  'auto',
        padding:    'var(--space-2) var(--space-4) var(--space-8)',
      }}>
        {visibleItems.length === 0 ? (
          <div style={{
            textAlign:  'center',
            padding:    'var(--space-12)',
            color:      'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--font-size-sm)',
          }}>
            {tab === 'wardrobe'
              ? "You don't own any accessories yet.\nVisit the shop! 🛍️"
              : 'No items in this category.'}
          </div>
        ) : (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap:                 'var(--space-3)',
            paddingBottom:       'var(--space-6)',
          }}>
            {visibleItems.map(item => {
              const isOwned    = ownedAccessories.includes(item.id);
              const isEquipped = equippedIds.includes(item.id);
              return (
                <ItemCard
                  key={item.id}
                  item={item as any}
                  owned={isOwned}
                  equipped={isEquipped}
                  coins={coins}
                  onBuy={()     => handleBuy(item.id)}
                  onEquip={()   => handleEquip(item.id)}
                  onUnequip={()  => handleUnequip(item.category as AccessorySlot)}
                />
              );
            })}
          </div>
        )}

        {/* Earn coins hint */}
        {tab === 'shop' && (
          <div style={{
            marginTop:    'var(--space-4)',
            background:   'var(--color-info-bg)',
            border:       '2px solid var(--color-info)',
            borderRadius: 'var(--radius-md)',
            padding:      'var(--space-3) var(--space-4)',
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--font-size-xs)',
            color:        'var(--color-text)',
            lineHeight:   1.6,
          }}>
            <strong>💡 How to earn coins:</strong>
            <br />
            Your pet earns 🪙 coins every time it evolves to a new stage!
            <br />
            <span style={{ color: 'var(--color-text-muted)' }}>
              Baby: +5 · Child: +10 · Teen: +20 · Adult: +30 · Elder: +50
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
