export interface LevelProps {
  level: {
    theme: string;
    tilesWidth: number;
    tilesHeight: number;
    backgroundImage?: string;
    collisionGrid?: number[][];
    placements: LevelPlacementsProps[];
    isPositionOutOfBounds: (x: number, y: number) => boolean;
    isBattleMode: boolean;
    cameraTransformX?: number;
    cameraTransformY?: number;
  };
  startBattle?: (battleFrame: unknown) => void;
  currentDay?: number;
}

export interface LevelPlacementsProps {
  id: number;
  x: number;
  y: number;
  frameCoordinate: string;
}

export interface PlacementProps {
  id: number;
  type: string;
  x: number;
  y: number;
  // level:
}

export interface PlacementConfigProps {
  id: number;
  x: number;
  y: number;
  type: string;
  battleId?: string;
  day?: number;
  enemy?: BattleEnemyConfig;
}

export interface BattleEnemyConfig {
  name: string;
  spriteFrame: string;
  entry: {
    x: number;
    y: number;
  };
  target: {
    x: number;
    y: number;
  };
}
