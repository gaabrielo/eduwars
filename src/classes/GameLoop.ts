interface GameLoopCallbacks {
  onStep: () => void;
  onRender?: () => void;
}

export class GameLoop {
  refCallback: number;
  onStep: () => void;
  onRender: () => void;

  constructor(callbacks: GameLoopCallbacks | (() => void)) {
    if (typeof callbacks === 'function') {
      this.onStep = callbacks;
      this.onRender = () => {};
    } else {
      this.onStep = callbacks.onStep;
      this.onRender = callbacks.onRender ?? (() => {});
    }
    this.refCallback = 0;
    this.start();
  }

  start() {
    let previousMs: number | undefined;
    const step = 1 / 60;
    const tick = (timestampMs: number) => {
      if (previousMs === undefined) {
        previousMs = timestampMs;
      }
      let delta = (timestampMs - previousMs!) / 1000;
      while (delta >= step) {
        this.onStep();
        delta -= step;
      }
      previousMs = timestampMs - delta * 1000;
      this.onRender();
      // recapture the callback to be able to shut it off
      this.refCallback = requestAnimationFrame(tick);
    };

    // initial kickoff
    this.refCallback = requestAnimationFrame(tick);
  }

  stop() {
    cancelAnimationFrame(this.refCallback);
  }
}
