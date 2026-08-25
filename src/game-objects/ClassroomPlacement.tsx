import { NPCPlacement } from '@/game-objects/NPCPlacement';

export class ClassroomPlacement extends NPCPlacement {
  override interact(): void {
    window.dispatchEvent(
      new CustomEvent('OVERWORLD_UI_TOGGLE', {
        detail: 'CLASSROOM',
      })
    );
  }
}
