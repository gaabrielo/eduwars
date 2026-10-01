// Minimal ambient declaration for canvas-confetti, which ships no type
// definitions. Covers only the options used by this project; avoids adding
// the @types/canvas-confetti package.
declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    ticks?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  function confetti(options?: ConfettiOptions): Promise<null> | null;
  export default confetti;
}
