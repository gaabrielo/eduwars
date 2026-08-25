import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';
import { PLACEMENT_TYPE_ENERGY_DRINK } from '@/utils/consts';
import { TILES } from '@/utils/tiles';
import { BattleEnemyConfig } from '@/utils/types';
import { getLessonByDay } from '@/data/pythonCourse';

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
    return this.isAvailable && this.isLessonWatched;
  }

  get isAvailable() {
    return (
      !this.isDisabled &&
      !this.hasBeenCompleted &&
      Boolean(this.enemy) &&
      (this.battleDay === null || this.level.currentDay === this.battleDay)
    );
  }

  get isLessonWatched() {
    if (this.battleDay === null || !getLessonByDay(this.battleDay)) {
      return true;
    }

    return this.level.watchedLessonDays?.includes(this.battleDay) ?? false;
  }

  get isLocked() {
    return Boolean(
      this.battleDay !== null && this.isAvailable && !this.isLessonWatched
    );
  }

  renderLockedMessageInCollide() {
    return this.isLocked;
  }

  notifyLocked() {
    window.dispatchEvent(new CustomEvent('BATTLE_LOCKED'));
  }

  completeBattle() {
    this.hasBeenCompleted = true;
  }

  renderComponent() {
    if (this.isLocked) {
      return (
        <Sprite frameCoordinate={TILES.BATTLE_FRAME_TOP_LEFT_DISABLED} size={32} />
      );
    }

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
