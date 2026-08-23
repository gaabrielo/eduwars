import { BattleFramePlacement } from '@/game-objects/BattleFramePlacement';
import { EnergyDrinkPlacement } from '@/game-objects/EnergyDrinkPlacement';
import { GoalPlacement } from '@/game-objects/GoalPlacement';
import { WallPlacement } from '@/game-objects/WallPlacement';
import { InvisibleWallPlacement } from '@/game-objects/InvisibleWallPlacement';
import { DecorativePlacement } from '@/game-objects/DecorativePlacement';
import { WardrobePlacement } from '@/game-objects/WardrobePlacement';
import { ClassroomPlacement } from '@/game-objects/ClassroomPlacement';
import { NPCBattlePlacement } from '@/game-objects/NPCBattlePlacement';
import { TeleportPlacement } from '@/game-objects/TeleportPlacement';
import { HeroPlacement } from '@/game-objects/HeroPlacement';
import { LockerPlacement } from '@/game-objects/LockerPlacement';
import {
  PLACEMENT_TYPE_BATTLE_FRAME,
  PLACEMENT_TYPE_ENERGY_DRINK,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_DECORATIVE,
  PLACEMENT_TYPE_WARDROBE,
  PLACEMENT_TYPE_CLASSROOM,
  PLACEMENT_TYPE_NPC_BATTLE,
  PLACEMENT_TYPE_TELEPORT,
  PLACEMENT_TYPE_INVISIBLE_WALL,
  PLACEMENT_TYPE_LOCKER,
} from '@/utils/consts';

class PlacementFactory {
  createPlacement(config: any, level: any) {
    const instance = this.getInstance(config, level);

    // generate ID here...
    return instance;
  }

  getInstance(config: any, level: any) {
    switch (config.type) {
      case PLACEMENT_TYPE_HERO:
        return new HeroPlacement(config, level);
      case PLACEMENT_TYPE_GOAL:
        return new GoalPlacement(config, level);
      case PLACEMENT_TYPE_WALL:
        return new WallPlacement(config, level);
      case PLACEMENT_TYPE_INVISIBLE_WALL:
        return new InvisibleWallPlacement(config, level);
      case PLACEMENT_TYPE_BATTLE_FRAME:
        return new BattleFramePlacement(config, level);
      case PLACEMENT_TYPE_ENERGY_DRINK:
        return new EnergyDrinkPlacement(config, level);
      case PLACEMENT_TYPE_DECORATIVE:
        return new DecorativePlacement(config, level);
      case PLACEMENT_TYPE_WARDROBE:
        return new WardrobePlacement(config, level);
      case PLACEMENT_TYPE_CLASSROOM:
        return new ClassroomPlacement(config, level);
      case PLACEMENT_TYPE_NPC_BATTLE:
        return new NPCBattlePlacement(config, level);
      case PLACEMENT_TYPE_TELEPORT:
        return new TeleportPlacement(config, level);
      case PLACEMENT_TYPE_LOCKER:
        return new LockerPlacement(config, level);

      default:
        console.warn('NO TYPE FOUND', config.type);
        return null;
    }
  }
}

export const placementFactory = new PlacementFactory();
