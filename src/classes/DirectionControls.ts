import {
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
} from '@/utils/consts';

export class DirectionControls {
  directionKeys: { [key: string]: string };
  heldDirections: any;
  directionKeyUpHandler: (e: KeyboardEvent) => void;
  directionKeyDownHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.directionKeys = {
      ArrowDown: DIRECTION_DOWN,
      ArrowUp: DIRECTION_UP,
      ArrowRight: DIRECTION_RIGHT,
      ArrowLeft: DIRECTION_LEFT,
      s: DIRECTION_DOWN,
      w: DIRECTION_UP,
      d: DIRECTION_RIGHT,
      a: DIRECTION_LEFT,
    };
    this.heldDirections = [];

    this.directionKeyDownHandler = (e) => {
      const dir = this.directionKeys[e.key];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    };

    this.directionKeyUpHandler = (e) => {
      const dir = this.directionKeys[e.key];
      const idx = this.heldDirections.indexOf(dir);
      if (idx > -1) {
        this.heldDirections.splice(idx, 1);
      }
    };

    document.addEventListener('keydown', this.directionKeyDownHandler);
    document.addEventListener('keyup', this.directionKeyUpHandler);
  }

  get direction() {
    return this.heldDirections[0];
  }

  clear() {
    this.heldDirections = [];
  }

  unbind() {
    document.removeEventListener('keydown', this.directionKeyDownHandler);
    document.removeEventListener('keyup', this.directionKeyUpHandler);
  }
}
