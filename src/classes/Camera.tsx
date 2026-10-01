import {
  CELL_SIZE,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
} from '@/utils/consts';

const CAMERA_SPEED = 0.04;
const CAMERA_LOOKAHEAD = 6;
const CAMERA_EPSILON = 0.01;
const USE_SMOOTH_CAMERA = true;

export class Camera {
  level: any;
  cameraX: number;
  cameraY: number;
  transformOffset: number;

  constructor(level: any) {
    this.level = level;
    const [heroX, heroY] = this.level.heroRef.displayXY();
    this.cameraX = heroX;
    this.cameraY = heroY;

    this.transformOffset = -5.5 * CELL_SIZE;
  }
  get transformX() {
    return -this.cameraX - this.transformOffset + 'px';
  }

  get transformY() {
    return -this.cameraY - this.transformOffset + 'px';
  }

  static lerp(currentValue: number, destinationValue: number, time: any) {
    return currentValue * (1 - time) + destinationValue * time;
  }

  tick(): boolean {
    const previousCameraX = this.cameraX;
    const previousCameraY = this.cameraY;

    // start where the hero is now
    const hero = this.level.heroRef;
    const [heroX, heroY] = hero.displayXY();
    let cameraDestinationX = heroX;
    let cameraDestinationY = heroY;

    //If moving, put the camera slightly ahead of where Hero is going
    if (hero.movingPixelsRemaining > 0) {
      if (hero.movingPixelDirection === DIRECTION_DOWN) {
        cameraDestinationY += CAMERA_LOOKAHEAD * CELL_SIZE;
      } else if (hero.movingPixelDirection === DIRECTION_UP) {
        cameraDestinationY -= CAMERA_LOOKAHEAD * CELL_SIZE;
      } else if (hero.movingPixelDirection === DIRECTION_LEFT) {
        cameraDestinationX -= CAMERA_LOOKAHEAD * CELL_SIZE;
      } else if (hero.movingPixelDirection === DIRECTION_RIGHT) {
        cameraDestinationX += CAMERA_LOOKAHEAD * CELL_SIZE;
      }
    }

    if (USE_SMOOTH_CAMERA) {
      this.cameraX = Camera.lerp(
        this.cameraX,
        cameraDestinationX,
        CAMERA_SPEED
      );
      this.cameraY = Camera.lerp(
        this.cameraY,
        cameraDestinationY,
        CAMERA_SPEED
      );

      if (Math.abs(this.cameraX - cameraDestinationX) <= CAMERA_EPSILON) {
        this.cameraX = cameraDestinationX;
      }
      if (Math.abs(this.cameraY - cameraDestinationY) <= CAMERA_EPSILON) {
        this.cameraY = cameraDestinationY;
      }
    } else {
      this.cameraX = cameraDestinationX;
      this.cameraY = cameraDestinationY;
    }

    return (
      previousCameraX !== this.cameraX || previousCameraY !== this.cameraY
    );
  }
}
