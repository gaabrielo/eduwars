import Sprite from '@/components/object-graphics/Sprite';
import { Placement, PlacementProperties } from '@/game-objects/Placement';
import { LevelProps, NPCPlacementConfig } from '@/utils/types';

type RuntimeLevel = LevelProps & {
  heroRef?: { x: number; y: number };
  isBattleMode?: boolean;
  inputBlocked?: boolean;
};

export class NPCPlacement extends Placement {
  npcId: string;
  dialogueId: string;
  spriteFrame: string;
  isHeroNear: boolean;
  handleKeyDown: (event: KeyboardEvent) => void;

  constructor(properties: NPCPlacementConfig, level: RuntimeLevel) {
    super(properties as PlacementProperties, level);
    this.npcId = properties.npcId;
    this.dialogueId = properties.dialogueId;
    this.spriteFrame = properties.spriteFrame;
    this.isHeroNear = false;

    this.handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'e' &&
        this.isHeroNear &&
        !(this.level as RuntimeLevel).isBattleMode &&
        !(this.level as RuntimeLevel).inputBlocked
      ) {
        this.interact();
      }
    };

    document.addEventListener('keydown', this.handleKeyDown);
  }

  isSolidForBody(): boolean {
    return true;
  }

  tick(): void {
    const hero = (this.level as RuntimeLevel).heroRef;
    if (!hero) return;

    const isNear =
      Math.abs(hero.x - this.x) <= 1 && Math.abs(hero.y - this.y) <= 1;
    if (this.isHeroNear !== isNear) this.isHeroNear = isNear;
  }

  interact(): void {
    window.dispatchEvent(
      new CustomEvent('NPC_INTERACTION', {
        detail: { npcId: this.npcId, dialogueId: this.dialogueId },
      })
    );
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  renderComponent(): JSX.Element {
    return (
      <Sprite frameCoordinate={this.spriteFrame} size={32} showInteractionPrompt={this.isHeroNear} />
    );
  }
}
