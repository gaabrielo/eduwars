import { THEME_TILES_MAP } from '@/utils/consts';
import MapCell from './MapCell';
import { LevelProps } from '@/utils/types';
import { memo } from 'react';

function LevelBackgroundTilesLayer({ level }: LevelProps) {
  const widthWithWalls = level.tilesWidth + 1;
  const heightWithWalls = level.tilesHeight + 1;
  const tiles = THEME_TILES_MAP[level.theme];

  function getBackgroundTile(x: number, y: number) {
    if (x === 0) {
      return tiles.LEFT;
    } else if (x === widthWithWalls) {
      return tiles.RIGHT;
    } else if (y === 0) {
      return tiles.TOP;
    } else if (y === heightWithWalls) {
      return tiles.BOTTOM;
    }

    return tiles.FLOOR;
  }

  let canvases = [];
  for (let y = 0; y <= heightWithWalls; y++) {
    for (let x = 0; x <= widthWithWalls; x++) {
      // skip bottom left and right map tiles
      if (y === heightWithWalls) {
        if (x === 0 || x === widthWithWalls) {
          continue;
        }
      }

      // add a cell to the map background
      canvases.push(
        <MapCell
          key={`${x}_${y}`}
          x={x}
          y={y}
          frameCoordinate={getBackgroundTile(x, y)}
        />
      );
    }
  }

  return <div>{canvases}</div>;
}

function propsEqual(prev: LevelProps, next: LevelProps): boolean {
  return (
    prev.level.theme === next.level.theme &&
    prev.level.tilesWidth === next.level.tilesWidth &&
    prev.level.tilesHeight === next.level.tilesHeight &&
    prev.level.backgroundImage === next.level.backgroundImage
  );
}

export default memo(LevelBackgroundTilesLayer, propsEqual);
