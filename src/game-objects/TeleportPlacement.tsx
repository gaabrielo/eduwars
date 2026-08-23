import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';

export class TeleportPlacement extends Placement {
  spriteFrame: string;
  targetMapId: string;
  targetX: number;
  targetY: number;

  constructor(properties: any, level: any) {
    super(properties, level);
    // Might be an invisible trigger, or a stair sprite
    this.spriteFrame = properties.spriteFrame || '7x3';
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
    return <Sprite frameCoordinate={this.spriteFrame} size={16} />;
  }
}
