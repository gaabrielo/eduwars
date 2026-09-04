import {
  LEVEL_THEMES,
  PLACEMENT_TYPE_CLASSROOM,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_TELEPORT,
} from '@/utils/consts';
import { TILES } from '@/utils/tiles';

const level = {
  theme: LEVEL_THEMES.BLUE,
  tilesWidth: 10,
  tilesHeight: 10,
  collisionGrid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  placements: [
    {
      id: 0,
      x: 5,
      y: 7,
      type: PLACEMENT_TYPE_HERO,
    },
    {
      id: 1,
      x: 5,
      y: 8,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: 'CourtyardLevel',
      targetX: 11,
      targetY: 7,
    },
    {
      id: 2,
      x: 5,
      y: 2,
      type: PLACEMENT_TYPE_CLASSROOM,
      npcId: 'professor-python',
      spriteFrame: TILES.ROGUE_RIGHT,
    },
  ],
};

export default level;
