import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';
import { PLACEMENT_TYPE_ENERGY_DRINK } from '@/utils/consts';
import { TILES } from '@/utils/tiles';
import { BattleEnemyConfig } from '@/utils/types';

export class BattleFramePlacement extends Placement {
  battleId: string;
  battleDay: number | null;
  enemy: BattleEnemyConfig | null;
  hasBeenCompleted: boolean;

  constructor(properties: any, level: any) {
    super(properties, level);
    this.battleId = properties.battleId || `battle-${this.id}`;
    this.battleDay = properties.day ?? null;
    this.enemy = properties.enemy || null;
    this.hasBeenCompleted = false;
  }

  get isDisabled() {
    const nonCollectedEnergyDrink = this.level.placements.find((p) => {
      return p.type === PLACEMENT_TYPE_ENERGY_DRINK && !p.hasBeenCollected;
    });

    return Boolean(nonCollectedEnergyDrink);
  }

  renderBattleInCollide() {
    return this.isAvailable;
  }

  get isAvailable() {
    return (
      !this.isDisabled &&
      !this.hasBeenCompleted &&
      Boolean(this.enemy) &&
      (this.battleDay === null || this.level.currentDay === this.battleDay)
    );
  }

  completeBattle() {
    this.hasBeenCompleted = true;
  }

  renderComponent() {
    if (!this.isAvailable) return null;

    return (
      <Sprite
        frameCoordinate={
          this.isDisabled
            ? TILES.BATTLE_FRAME_TOP_LEFT_DISABLED
            : TILES.BATTLE_FRAME_TOP_LEFT
        }
        size={32}
      />
    );
  }
}
