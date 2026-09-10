import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';
import {
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
} from '@/utils/consts';

const TELEPORT_ROTATION_CLASSES: Record<string, string> = {
  [DIRECTION_RIGHT]: 'rotate-0',
  [DIRECTION_DOWN]: 'rotate-90',
  [DIRECTION_LEFT]: 'rotate-180',
  [DIRECTION_UP]: '-rotate-90',
};

export class TeleportPlacement extends Placement {
  spriteFrame: string;
  direction: string;
  targetMapId: string;
  targetX: number;
  targetY: number;

  constructor(properties: any, level: any) {
    super(properties, level);
    // Might be an invisible trigger, or a stair sprite
    this.spriteFrame = properties.spriteFrame || '7x3';
    this.direction = properties.direction || DIRECTION_RIGHT;
    this.targetMapId = properties.targetMapId; // Which map to load
    this.targetX = properties.targetX; // Where to spawn the hero
    this.targetY = properties.targetY;
  }

  isSolidForBody(_body: any) {
    return false; // Player can step on it
  }

  addsItemToInventoryOnCollide() {
    return null;
  }

  renderBattleInCollide() {
    return false;
  }

  // We add a specific teleport hook
  teleport() {
    window.dispatchEvent(
      new CustomEvent('OVERWORLD_TELEPORT', { 
        detail: {
          mapId: this.targetMapId,
          x: this.targetX,
          y: this.targetY,
        }
      })
    );
  }

  renderComponent() {
    // We only render it if there is a sprite frame provided, otherwise it's invisible
    return (
      <div
        className={
          TELEPORT_ROTATION_CLASSES[this.direction] ||
          TELEPORT_ROTATION_CLASSES[DIRECTION_RIGHT]
        }
      >
        <Sprite frameCoordinate={this.spriteFrame} size={16} />
      </div>
    );
  }
}
