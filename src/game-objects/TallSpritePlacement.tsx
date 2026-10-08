import { Placement, PlacementProperties } from '@/game-objects/Placement';
import { GameEventBus } from '@/classes/GameEventBus';
import type { GameEventListener } from '@/classes/GameEventBus';
import type { LevelState } from '@/classes/LevelState';
import TallSprite from '@/components/object-graphics/TallSprite';
import { CELL_SIZE, Z_INDEX_LAYER_SIZE } from '@/utils/consts';
import { LevelProps } from '@/utils/types';

interface GridCell {
  x: number;
  y: number;
}

interface TallSpriteProperties extends PlacementProperties {
  spriteImage: string;
  fadeCells: GridCell[];
  placementBase: GridCell[];
}

type RuntimeLevel = LevelProps['level'] & {
  heroRef?: {
    x: number;
    y: number;
  };
  events: GameEventBus;
};

export class TallSpritePlacement extends Placement {
  private readonly runtimeLevel: RuntimeLevel;
  readonly spriteImage: string;
  readonly spriteWidth: number;
  readonly spriteHeight: number;
  readonly placementBase: GridCell[];
  private readonly fadeCellKeys: ReadonlySet<string>;

  constructor(properties: TallSpriteProperties, level: RuntimeLevel) {
    super(properties, level as unknown as LevelState);
    this.runtimeLevel = level;
    this.spriteImage = properties.spriteImage;
    this.spriteWidth = level.tilesWidth * CELL_SIZE;
    this.spriteHeight = level.tilesHeight * CELL_SIZE;
    this.placementBase = properties.placementBase ?? [];
    this.fadeCellKeys = new Set(
      properties.fadeCells.map((cell) => this.getCellKey(cell.x, cell.y))
    );
  }

  override zIndex() {
    const hero = this.runtimeLevel.heroRef;
    if (
      hero &&
      this.placementBase.some(
        (cell) => cell.y === hero.y && hero.x >= cell.x
      )
    ) {
      // HeroPlacement adds one to its row layer, keeping the hero above this sprite.
      return hero.y * Z_INDEX_LAYER_SIZE;
    }

    return (this.runtimeLevel.tilesHeight + 1) * Z_INDEX_LAYER_SIZE;
  }

  private getCellKey(x: number, y: number): string {
    return `${x}:${y}`;
  }

  isFadeCell(x: number, y: number): boolean {
    return this.fadeCellKeys.has(this.getCellKey(x, y));
  }

  isHeroInsideFadeCell(): boolean {
    const hero = this.runtimeLevel.heroRef;
    return hero ? this.isFadeCell(hero.x, hero.y) : false;
  }

  subscribeToHeroCellChanged(
    listener: GameEventListener<'heroCellChanged'>
  ): () => void {
    return this.runtimeLevel.events.on('heroCellChanged', listener);
  }

  override renderComponent(): JSX.Element {
    return <TallSprite placement={this} />;
  }
}
