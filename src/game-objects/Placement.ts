import {
  CELL_SIZE,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  Z_INDEX_LAYER_SIZE,
} from '@/utils/consts';
import { LevelProps } from '@/utils/types';

interface PlacementProperties {
  id: number;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  level: LevelProps;
}

export class Placement {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  level: LevelProps;
  travelPixelsPerFrame: number;
  movingPixelsRemaining: number;
  movingPixelsDirection: string;
  spriteFacingDirection: string;
  spriteWalkFrame: number;
  hasBeenCollected: boolean;

  constructor(properties: PlacementProperties, level: LevelProps) {
    this.id = properties.id;
    this.type = properties.type;
    this.x = properties.x;
    this.y = properties.y;
    this.width = properties.width || 1;
    this.height = properties.height || 1;
    this.level = level;

    this.travelPixelsPerFrame = 1.5;
    this.movingPixelsRemaining = 0;
    this.movingPixelsDirection = DIRECTION_RIGHT;
    this.spriteFacingDirection = DIRECTION_RIGHT;
    this.spriteWalkFrame = 0;

    this.hasBeenCollected = false;
  }

  tick() {}

  isSolidForBody(_body: any) {
    return false;
  }

  addsItemToInventoryOnCollide() {
    return null;
  }

  renderBattleInCollide() {
    return false;
  }

  displayXY() {
    if (this.movingPixelsRemaining > 0) {
      return this.displayMovingXY();
    }

    const x = this.x * CELL_SIZE;
    const y = this.y * CELL_SIZE;
    return [x, y];
  }

  displayMovingXY() {
    const x = this.x * CELL_SIZE;
    const y = this.y * CELL_SIZE;
    const progressPixels = CELL_SIZE - this.movingPixelsRemaining;
    switch (this.movingPixelsDirection) {
      case DIRECTION_LEFT:
        return [x - progressPixels, y];
      case DIRECTION_RIGHT:
        return [x + progressPixels, y];
      case DIRECTION_UP:
        return [x, y - progressPixels];
      default:
        return [x, y + progressPixels];
    }
  }

  collect() {
    this.hasBeenCollected = true;
  }

  zIndex() {
    // return 1;
    return this.y * Z_INDEX_LAYER_SIZE;
  }

  renderComponent(): React.ReactElement | null {
    return null;
  }
}
