import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';

export class WardrobePlacement extends Placement {
  spriteFrame: string;

  constructor(properties: any, level: any) {
    super(properties, level);
    // Wardrobe sprite or a default bounding box if it's invisible on the map image
    this.spriteFrame = properties.spriteFrame || '0x0';
  }

  isSolidForBody(_body: any) {
    return true; // Wardrobes are solid
  }

  // Intercept the interaction loop to trigger the skin selection
  interact() {
    // We will trigger a UI state to open the Skin Selection component
    console.log('Interacting with Wardrobe! Opening Skin Selection...');
    // We will mock this action or dispatch an event that the HUD listens to
  }

  renderComponent() {
    // If the wardrobe is part of the background image, we can just return an invisible bounded box or a generic sprite
    return <Sprite frameCoordinate={this.spriteFrame} size={32} />; 
  }
}
