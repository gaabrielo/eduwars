import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';

export class ClassroomPlacement extends Placement {
  spriteFrame: string;

  constructor(properties: any, level: any) {
    super(properties, level);
    this.spriteFrame = properties.spriteFrame || '0x0';
  }

  isSolidForBody(_body: any) {
    return true; // The door or trigger area is solid
  }

  interact() {
    console.log('Entering Classroom! Opening Video Lesson...');
    // Trigger classroom state by dispatching a custom event that the HUD listens to
    window.dispatchEvent(
      new CustomEvent('OVERWORLD_UI_TOGGLE', { detail: 'CLASSROOM' })
    );
  }

  renderComponent() {
    return <Sprite frameCoordinate={this.spriteFrame} size={32} />;
  }
}
