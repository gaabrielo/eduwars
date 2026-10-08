import Sprite from '@/components/object-graphics/Sprite';
import { Placement } from '@/game-objects/Placement';
import { THEME_TILES_MAP } from '@/utils/consts';

export class WallPlacement extends Placement {
  isSolidForBody(_body: unknown) {
    return true;
  }

  renderComponent() {
    const wallTileCord = THEME_TILES_MAP[this.level.theme].WALL;
    return <Sprite frameCoordinate={wallTileCord} />;
  }
}
