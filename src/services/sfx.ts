export const SFX_VOLUME = {
  master: 0.4,
  ambient: 0.1,
  win: 0.7,
  success: 0.8,
  fail: 0.6,
};

const SFX_SRC = {
  ambient: "/sfx/ambient.mp3",
  win: "/sfx/win.mp3",
  success: "/sfx/success.mp3",
  fail: "/sfx/fail.mp3",
} as const;

type OneShotId = "win" | "success" | "fail";

let muted = false;
let ambientWanted = false;
let classroomOpen = false;
let ambient: HTMLAudioElement | null = null;
const mutedListeners = new Set<(muted: boolean) => void>();

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function trackVolume(track: keyof typeof SFX_VOLUME): number {
  if (track === "master" || muted) return 0;
  return clampVolume(SFX_VOLUME.master * SFX_VOLUME[track]);
}

function ensureAmbient(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (ambient) return ambient;

  const audio = new Audio(SFX_SRC.ambient);
  // audio.currentTime = 20; // Skip the first 20 seconds of the ambient track, which is silence
  audio.loop = true;
  audio.preload = "auto";
  audio.addEventListener("ended", () => {
    // audio.currentTime = 20;
    audio.currentTime = 0;
    if (shouldPlayAmbient()) {
      audio.play().catch(() => {});
    }
  });
  ambient = audio;
  return audio;
}

function shouldPlayAmbient(): boolean {
  return ambientWanted && !classroomOpen && !muted;
}

function syncAmbient(): void {
  const audio = ensureAmbient();
  if (!audio) return;

  audio.volume = trackVolume("ambient");
  if (!shouldPlayAmbient()) {
    audio.pause();
    return;
  }

  audio.play().catch(() => {});
}

export function isSfxMuted(): boolean {
  return muted;
}

export function setSfxMuted(next: boolean): void {
  muted = next;
  syncAmbient();
  mutedListeners.forEach((listener) => listener(muted));
}

export function toggleSfxMuted(): void {
  setSfxMuted(!muted);
}

export function subscribeSfxMuted(listener: (muted: boolean) => void): () => void {
  mutedListeners.add(listener);
  return () => {
    mutedListeners.delete(listener);
  };
}

export function setSfxVolume(next: Partial<typeof SFX_VOLUME>): void {
  (Object.keys(next) as Array<keyof typeof SFX_VOLUME>).forEach((key) => {
    const value = next[key];
    if (value === undefined) return;
    SFX_VOLUME[key] = value;
  });
  syncAmbient();
}

export function startAmbient(): void {
  ambientWanted = true;
  syncAmbient();
}

export function stopAmbient(): void {
  ambientWanted = false;
  ambient?.pause();
}

export function setClassroomAudioOpen(open: boolean): void {
  classroomOpen = open;
  syncAmbient();
}

export function playSfx(id: OneShotId): void {
  if (muted || typeof window === "undefined") return;

  const audio = new Audio(SFX_SRC[id]);
  audio.volume = trackVolume(id);
  audio.play().catch(() => {});
}
