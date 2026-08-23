import {
  LEVEL_THEMES,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_BATTLE_FRAME,
  PLACEMENT_TYPE_TELEPORT,
} from '@/utils/consts';
import { TILES } from '@/utils/tiles';

const level = {
  theme: LEVEL_THEMES.BLUE,
  tilesWidth: 10,
  tilesHeight: 10,
  backgroundImage: '/dorm.png', // Temporary placeholder requested by user
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
      y: 5,
      type: PLACEMENT_TYPE_HERO,
    },
    {
      id: 1,
      x: 5,
      y: 8,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: 'CourtyardLevel',
      targetX: 8,
      targetY: 6,
    },
    {
      id: 2,
      x: 3,
      y: 3,
      type: PLACEMENT_TYPE_BATTLE_FRAME,
      width: 2,
      height: 2,
      day: 3,
      battleId: 'entrance-python-day-3',
      enemy: {
        name: 'Professor Python',
        spriteFrame: TILES.ROGUE_LEFT,
        entry: { x: 7, y: 3 },
        target: { x: 6, y: 3 },
      },
    },
  ],
};

export default level;
