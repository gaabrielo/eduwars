import { Camera } from '@/classes/Camera';
import { DirectionControls } from '@/classes/DirectionControls';
import { GameLoop } from '@/classes/GameLoop';
import { placementFactory } from '@/classes/PlacementFactory';
import Levels from '@/levels/LevelsMap';
import {
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_INVISIBLE_WALL,
} from '@/utils/consts';
import { LevelProps } from '@/utils/types';
import { BattleFramePlacement } from '@/game-objects/BattleFramePlacement';
import { NPCBattlePlacement } from '@/game-objects/NPCBattlePlacement';
import { HeroPosition } from '@/utils/types';

interface BattleReadyPayload {
  fieldId: string;
  name: string;
  spriteFrame: string;
}

export interface LevelStateOptions {
  initialHeroPosition?: HeroPosition;
  collectedPlacementIds?: number[];
  onHeroPositionChange?: (position: HeroPosition) => void;
  onPlacementCollected?: (placementId: number) => void;
  onBattleStarted?: (origin: HeroPosition) => void;
  watchedLessonDays?: number[];
}

export class LevelState {
  id: string;
  onEmit: (props: LevelProps['level']) => void;
  theme: any;
  tilesWidth?: number;
  tilesHeight?: number;
  backgroundImage?: string;
  placements?: any;
  gameLoop: any;
  directionControls: any;
  // hero placement
  heroRef: any;
  isBattleMode: any;
  inputBlocked: boolean;
  camera: any;
  heroSkin: string;
  completedBattleIds: string[];
  activeBattleFrame: BattleFramePlacement | null;
  battleEnemy: NPCBattlePlacement | null;
  battleModalOpened: boolean;
  onBattleReady: (battle: BattleReadyPayload) => void;
  currentDay: number;
  watchedLessonDays: number[];
  battleOrigin: HeroPosition | null;
  onHeroPositionChange: (position: HeroPosition) => void;
  onPlacementCollected: (placementId: number) => void;
  onBattleStarted: (origin: HeroPosition) => void;
  lastReportedHeroPosition: string;
  collectedPlacementIds: Set<number>;
  initialHeroPosition?: HeroPosition;

  constructor(
    levelId: string,
    heroSkin: string,
    onEmit: (props: LevelProps['level']) => void,
    currentDay = 1,
    completedBattleIds: string[] = [],
    onBattleReady: (battle: BattleReadyPayload) => void = () => {},
    options: LevelStateOptions = {}
  ) {
    this.id = levelId;
    this.onEmit = onEmit;
    this.heroSkin = heroSkin;
    this.completedBattleIds = completedBattleIds;
    this.onBattleReady = onBattleReady;
    this.currentDay = currentDay;
    this.watchedLessonDays = options.watchedLessonDays ?? [];
    this.activeBattleFrame = null;
    this.battleEnemy = null;
    this.battleModalOpened = false;
    this.inputBlocked = false;
    this.battleOrigin = null;
    this.onHeroPositionChange = options.onHeroPositionChange ?? (() => {});
    this.onPlacementCollected = options.onPlacementCollected ?? (() => {});
    this.onBattleStarted = options.onBattleStarted ?? (() => {});
    this.collectedPlacementIds = new Set(options.collectedPlacementIds ?? []);
    this.initialHeroPosition = options.initialHeroPosition;
    this.lastReportedHeroPosition = '';

    this.directionControls = new DirectionControls();

    // start the level
    this.start();
  }

  start() {
    this.isBattleMode = false;
    this.inputBlocked = false;
    this.activeBattleFrame = null;
    this.battleEnemy = null;
    this.battleModalOpened = false;
    this.battleOrigin = null;
    const levelData = Levels[this.id as keyof typeof Levels];

    this.theme = levelData.theme;
    this.tilesWidth = levelData.tilesWidth;
    this.tilesHeight = levelData.tilesHeight;
    this.backgroundImage = (levelData as any).backgroundImage;
    this.placements = levelData.placements.map((config: any) => {
      const placement = placementFactory.createPlacement(config, this);
      if (
        placement instanceof BattleFramePlacement &&
        this.completedBattleIds.includes(placement.battleId)
      ) {
        placement.completeBattle();
      }
      return placement;
    });

    if (levelData.collisionGrid) {
      levelData.collisionGrid.forEach((row: number[], y: number) => {
        row.forEach((cell: number, x: number) => {
          if (cell === 1) {
             this.addPlacement({
               id: `grid-${x}-${y}`,
               x,
               y,
               type: PLACEMENT_TYPE_INVISIBLE_WALL
             });
          }
        });
      });
    }

    // cache a reference to the hero
    this.heroRef = this.placements.find((p: any) => p.type === PLACEMENT_TYPE_HERO);

    if (this.heroRef && this.initialHeroPosition) {
      this.heroRef.x = this.initialHeroPosition.x;
      this.heroRef.y = this.initialHeroPosition.y;
      this.heroRef.spriteFacingDirection =
        this.initialHeroPosition.facingDirection;
    }

    this.placements.forEach((placement: any) => {
      if (this.collectedPlacementIds.has(placement.id)) {
        placement.collect();
      }
    });
    this.lastReportedHeroPosition = this.getHeroPositionKey();

    // create a camera
    this.camera = new Camera(this);

    this.startGameLoop();
  }

  startGameLoop() {
    this.gameLoop?.stop();
    this.gameLoop = new GameLoop(() => {
      this.tick();
    });
  }

  addPlacement(config: any) {
    this.placements.push(placementFactory.createPlacement(config, this));
  }

  deletePlacement(placementToRemove: any) {
    this.placements = this.placements.filter((p: any) => {
      return p.id !== placementToRemove.id;
    });
  }

  tick() {
    // check for movement here
    if (!this.isBattleMode && !this.inputBlocked && this.directionControls.direction) {
      this.heroRef.controllerMoveRequested(this.directionControls.direction);
    }

    // call "tick" on any Placement that wants to update
    this.placements.forEach((placement: any) => {
      placement.tick();
    });

    this.placements.forEach((placement: any) => {
      if (
        placement.hasBeenCollected &&
        !this.collectedPlacementIds.has(placement.id)
      ) {
        this.collectedPlacementIds.add(placement.id);
        this.onPlacementCollected(placement.id);
      }
    });

    if (!this.isBattleMode && this.heroRef?.movingPixelsRemaining === 0) {
      const heroPositionKey = this.getHeroPositionKey();
      if (heroPositionKey !== this.lastReportedHeroPosition) {
        this.lastReportedHeroPosition = heroPositionKey;
        this.onHeroPositionChange(this.getHeroPosition());
      }
    }

    // update the camera
    this.camera.tick();

    if (
      this.isBattleMode &&
      this.battleEnemy &&
      !this.battleEnemy.isEntering &&
      !this.battleModalOpened
    ) {
      this.battleModalOpened = true;
      this.onBattleReady({
        fieldId: this.activeBattleFrame!.battleId,
        name: this.battleEnemy.name,
        spriteFrame: this.battleEnemy.spriteFrame,
      });
    }

    // emit changes to React
    this.onEmit(this.getState());
  }

  isPositionOutOfBounds(x: number, y: number) {
    return (
      x === 0 ||
      y === 0 ||
      x >= this.tilesWidth! + 1 ||
      y >= this.tilesHeight! + 1
    );
  }

  startBattle(battleFrame: BattleFramePlacement, battleOrigin?: HeroPosition) {
    if (this.isBattleMode || battleFrame.hasBeenCompleted || !battleFrame.enemy) {
      return;
    }

    this.battleOrigin =
      battleOrigin ?? this.getHeroPosition();
    this.onBattleStarted(this.battleOrigin);
    this.isBattleMode = true;
    this.directionControls.clear();
    this.activeBattleFrame = battleFrame;
    this.battleModalOpened = false;

    const enemy = battleFrame.enemy;
    this.battleEnemy = new NPCBattlePlacement(
      {
        id: `battle-enemy-${battleFrame.battleId}`,
        type: 'NPC_BATTLE',
        name: enemy.name,
        spriteFrame: enemy.spriteFrame,
        x: enemy.entry.x,
        y: enemy.entry.y,
        targetX: enemy.target.x,
        targetY: enemy.target.y,
      },
      this
    );
    this.placements.push(this.battleEnemy);
  }

  setCurrentDay(day: number) {
    this.currentDay = day;
  }

  setWatchedLessonDays(days: number[]) {
    this.watchedLessonDays = days;
  }

  setInputBlocked(blocked: boolean) {
    this.inputBlocked = blocked;
    if (blocked) this.directionControls.clear();
  }

  finishBattle(battleId: string, victory: boolean, playerDefeated = false) {
    if (!this.activeBattleFrame || this.activeBattleFrame.battleId !== battleId) {
      return;
    }

    if (victory) {
      this.activeBattleFrame.completeBattle();
    }

    if (this.battleEnemy) {
      this.deletePlacement(this.battleEnemy);
    }

    this.activeBattleFrame = null;
    this.battleEnemy = null;
    this.battleModalOpened = false;
    this.battleOrigin = null;
    this.directionControls.clear();

    if (!playerDefeated) {
      this.isBattleMode = false;
    }

    this.onEmit(this.getState());
  }

  resetBattle() {
    if (this.battleEnemy) {
      this.deletePlacement(this.battleEnemy);
    }

    this.activeBattleFrame = null;
    this.battleEnemy = null;
    this.battleModalOpened = false;
    this.battleOrigin = null;
    this.isBattleMode = false;
    this.directionControls.clear();
  }

  fleeBattle() {
    if (!this.activeBattleFrame) return;

    if (this.battleEnemy) {
      this.deletePlacement(this.battleEnemy);
    }

    if (this.battleOrigin && this.heroRef) {
      this.heroRef.x = this.battleOrigin.x;
      this.heroRef.y = this.battleOrigin.y;
      this.heroRef.spriteFacingDirection = this.battleOrigin.facingDirection;
      this.heroRef.movingPixelsRemaining = 0;
      this.lastReportedHeroPosition = this.getHeroPositionKey();
    }

    this.activeBattleFrame = null;
    this.battleEnemy = null;
    this.battleModalOpened = false;
    this.battleOrigin = null;
    this.isBattleMode = false;
    this.directionControls.clear();
    this.onEmit(this.getState());
  }

  restart(completedBattleIds: string[] = []) {
    this.destroy();
    this.completedBattleIds = completedBattleIds;
    this.collectedPlacementIds = new Set();
    this.initialHeroPosition = undefined;
    this.directionControls = new DirectionControls();
    this.start();
  }

  getState(): LevelProps['level'] {
    return {
      theme: this.theme,
      tilesWidth: this.tilesWidth!,
      tilesHeight: this.tilesHeight!,
      backgroundImage: this.backgroundImage,
      placements: this.placements!,
      isBattleMode: this.isBattleMode,
      cameraTransformX: this.camera.transformX,
      cameraTransformY: this.camera.transformY,
      isPositionOutOfBounds: this.isPositionOutOfBounds.bind(this),
    };
  }

  getHeroPosition(): HeroPosition {
    return {
      x: this.heroRef.x,
      y: this.heroRef.y,
      facingDirection: this.heroRef.spriteFacingDirection,
    };
  }

  getHeroPositionKey() {
    if (!this.heroRef) return '';
    return `${this.heroRef.x}:${this.heroRef.y}:${this.heroRef.spriteFacingDirection}`;
  }

  destroy() {
    // tear down the level
    this.gameLoop?.stop();
    this.directionControls.unbind();
    this.placements.forEach((p: any) => {
      if (typeof p.destroy === 'function') {
        p.destroy();
      }
    });
  }
}
