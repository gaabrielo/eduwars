import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';

export class DecorativePlacement extends Placement {
  spriteFrame: string;

  constructor(properties: any, level: any) {
    super(properties, level);
    // Allow passing a specific sprite frame coordinate in the level config
    this.spriteFrame = properties.spriteFrame || '0x0';
  }

  // Decorative map items like trees might be solid or not based on config
  isSolidForBody(_body: any) {
    return this.level.placements.find(
      (p: any) => p.id === this.id
    )?.isSolid ?? false;
  }

  renderComponent() {
    return <Sprite frameCoordinate={this.spriteFrame} size={32} />; // Adjust size as needed if they use 32px sprites
  }
}
