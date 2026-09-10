import { Placement, PlacementProperties } from "@/game-objects/Placement";
import { CELL_SIZE, Z_INDEX_LAYER_SIZE } from "@/utils/consts";
import { LevelProps } from "@/utils/types";

interface GridCell {
  x: number;
  y: number;
}

interface TallSpriteProperties extends PlacementProperties {
  spriteImage: string;
  fadeCells: GridCell[];
}

type RuntimeLevel = LevelProps["level"] & {
  heroRef?: {
    x: number;
    y: number;
  };
};

export class TallSpritePlacement extends Placement {
  private readonly runtimeLevel: RuntimeLevel;
  private readonly spriteImage: string;
  private readonly fadeCells: GridCell[];

  constructor(properties: TallSpriteProperties, level: RuntimeLevel) {
    super(properties, level as unknown as LevelProps);
    this.runtimeLevel = level;
    this.spriteImage = properties.spriteImage;
    this.fadeCells = properties.fadeCells;
  }

  override zIndex() {
    return (this.runtimeLevel.tilesHeight + 1) * Z_INDEX_LAYER_SIZE;
  }

  private isHeroInsideFadeCell() {
    const hero = this.runtimeLevel.heroRef;
    if (!hero) return false;

    return this.fadeCells.some((cell) => cell.x === hero.x && cell.y === hero.y);
  }

  override renderComponent() {
    const width = this.runtimeLevel.tilesWidth * CELL_SIZE;
    const height = this.runtimeLevel.tilesHeight * CELL_SIZE;

    return (
      <img
        src={this.spriteImage}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pixelated block"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "none",
          maxHeight: "none",
          objectFit: "fill",
          opacity: this.isHeroInsideFadeCell() ? 0.6 : 1,
          pointerEvents: "none",
        }}
      />
    );
  }
}
