import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';
import {
  CELL_SIZE,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
} from '@/utils/consts';

export class NPCBattlePlacement extends Placement {
  spriteFrame: string;
  name: string;
  targetX: number;
  targetY: number;
  isEntering: boolean;

  constructor(properties: any, level: any) {
    super(properties, level);
    this.spriteFrame = properties.spriteFrame || '0x0'; // Default NPC sprite
    this.name = properties.name || 'Inimigo';
    this.targetX = properties.targetX ?? this.x;
    this.targetY = properties.targetY ?? this.y;
    this.isEntering = this.x !== this.targetX || this.y !== this.targetY;
  }

  isSolidForBody(_body: any) {
    return true; // NPCs are solid
  }

  renderBattleInCollide() {
    return false;
  }

  tick() {
    if (!this.isEntering) return;

    if (this.movingPixelsRemaining === 0) {
      this.startNextMovement();
      if (!this.isEntering) return;
    }

    this.movingPixelsRemaining -= this.travelPixelsPerFrame;
    if (this.movingPixelsRemaining <= 0) {
      this.movingPixelsRemaining = 0;
      this.finishMovementStep();
    }
  }

  startNextMovement() {
    if (this.x !== this.targetX) {
      this.movingPixelsDirection =
        this.targetX > this.x ? DIRECTION_RIGHT : DIRECTION_LEFT;
      this.movingPixelsRemaining = CELL_SIZE;
      return;
    }

    if (this.y !== this.targetY) {
      this.movingPixelsDirection =
        this.targetY > this.y ? DIRECTION_DOWN : DIRECTION_UP;
      this.movingPixelsRemaining = CELL_SIZE;
      return;
    }

    this.isEntering = false;
  }

  finishMovementStep() {
    switch (this.movingPixelsDirection) {
      case DIRECTION_LEFT:
        this.x -= 1;
        break;
      case DIRECTION_RIGHT:
        this.x += 1;
        break;
      case DIRECTION_UP:
        this.y -= 1;
        break;
      case DIRECTION_DOWN:
        this.y += 1;
        break;
    }

    if (this.x === this.targetX && this.y === this.targetY) {
      this.isEntering = false;
    }
  }

  renderComponent() {
    return <Sprite frameCoordinate={this.spriteFrame} size={32} />;
  }
}
