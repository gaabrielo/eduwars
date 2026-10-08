import Hero from '@/components/object-graphics/Hero';
import { Placement, PlacementProperties } from '@/game-objects/Placement';
import type { LevelState } from '@/classes/LevelState';
import { NPCPlacementConfig } from '@/utils/types';

export class NPCPlacement extends Placement {
  npcId: string;
  spriteFrame: string;
  isHeroNear: boolean;
  handleKeyDown: (event: KeyboardEvent) => void;

  constructor(properties: NPCPlacementConfig, level: LevelState) {
    super(properties as PlacementProperties, level);
    this.npcId = properties.npcId;
    this.spriteFrame = properties.spriteFrame;
    this.isHeroNear = false;

    this.handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'e' &&
        this.isHeroNear &&
        !this.level.isBattleMode &&
        !this.level.inputBlocked
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
    const hero = this.level.heroRef;
    if (!hero) return;

    const isNear =
      Math.abs(hero.x - this.x) <= 1 && Math.abs(hero.y - this.y) <= 1;
    if (this.isHeroNear !== isNear) this.isHeroNear = isNear;
  }

  interact(): void {
    window.dispatchEvent(
      new CustomEvent('NPC_INTERACTION', {
        detail: { npcId: this.npcId },
      })
    );
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  renderComponent(): JSX.Element {
    return (
      <Hero
        frameCoord={this.spriteFrame}
        yTranslate={0}
        showInteractionPrompt={this.isHeroNear}
      />
    );
  }
}
