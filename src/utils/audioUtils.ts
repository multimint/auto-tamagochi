// Web Audio API synthesized sound effects — no external audio files needed

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'square',
  volume = 0.15,
  startDelay = 0,
): void {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration);
  } catch {
    // Audio failed silently
  }
}

// Resume context on first user interaction (browser autoplay policy)
export function resumeAudio(): void {
  const ctx = getAudioCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

export function playEatSound(): void {
  playTone(800, 0.08, 'square', 0.12);
  playTone(1000, 0.08, 'square', 0.12, 0.1);
  playTone(1200, 0.1, 'square', 0.10, 0.2);
}

export function playPlaySound(): void {
  playTone(400, 0.1, 'sine', 0.15);
  playTone(600, 0.1, 'sine', 0.15, 0.12);
  playTone(800, 0.15, 'sine', 0.15, 0.24);
}

export function playCleanSound(): void {
  // Descending bubble sound
  for (let i = 0; i < 4; i++) {
    playTone(1000 - i * 150, 0.08, 'sine', 0.1, i * 0.07);
  }
}

export function playSleepSound(): void {
  playTone(200, 0.4, 'sine', 0.08);
  playTone(180, 0.5, 'sine', 0.06, 0.5);
}

export function playWakeSound(): void {
  playTone(400, 0.1, 'sine', 0.15);
  playTone(600, 0.1, 'sine', 0.15, 0.12);
  playTone(900, 0.15, 'sine', 0.15, 0.24);
  playTone(1200, 0.2, 'sine', 0.12, 0.38);
}

export function playMedicineSound(): void {
  // Magic sparkle
  const notes = [800, 1000, 1200, 900, 1100];
  notes.forEach((f, i) => playTone(f, 0.1, 'sine', 0.12, i * 0.08));
}

export function playPraiseSound(): void {
  playTone(600, 0.15, 'sine', 0.15);
  playTone(900, 0.2, 'sine', 0.15, 0.18);
}

export function playEvolveSound(): void {
  // Ascending arpeggio over 1 second
  const notes = [262, 330, 392, 523, 659, 784];
  notes.forEach((f, i) => playTone(f, 0.15, 'triangle', 0.2, i * 0.15));
}

export function playDeathSound(): void {
  playTone(400, 0.4, 'sine', 0.15);
  playTone(300, 0.5, 'sine', 0.12, 0.4);
  playTone(200, 0.8, 'sine', 0.10, 0.9);
}

export function playAlertSound(): void {
  playTone(300, 0.15, 'square', 0.1);
  playTone(300, 0.15, 'square', 0.1, 0.2);
}

export function playAchievementSound(): void {
  playTone(523, 0.1, 'sine', 0.18);
  playTone(659, 0.1, 'sine', 0.18, 0.12);
  playTone(784, 0.2, 'sine', 0.18, 0.24);
  playTone(1046, 0.3, 'sine', 0.15, 0.44);
}
