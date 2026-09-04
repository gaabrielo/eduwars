import {
  LEVEL_THEMES,
  PLACEMENT_TYPE_BATTLE_FRAME,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_TELEPORT,
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_NPC,
} from '@/utils/consts';
import { TILES } from '@/utils/tiles';

const level = {
  theme: LEVEL_THEMES.BLUE,
  tilesWidth: 32,
  tilesHeight: 16,
  backgroundImage: '/levels/courtyard.png',
  collisionGrid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  placements: [
    {
      id: 0,
      x: 9,
      y: 6,
      type: PLACEMENT_TYPE_HERO,
    },
    {
      id: 1,
      x: 31,
      y: 6,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: 'DormRoomLevel',
      targetX: 4,
      targetY: 5,
    },
    {
      id: 2,
      x: 1,
      y: 14,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: 'EntranceLevel',
      targetX: 5,
      targetY: 5,
    },
    {
      id: 6,
      x: 11,
      y: 6,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: 'ClassroomLevel',
      targetX: 5,
      targetY: 7,
    },

    {
      id: 3,
      x: 10,
      y: 8,
      type: PLACEMENT_TYPE_BATTLE_FRAME,
      width: 2,
      height: 2,
      battleId: 'courtyard-python-day-1',
      enemy: {
        name: 'Professor Python',
        spriteFrame: TILES.ROGUE_LEFT,
        entry: { x: 13, y: 8 },
        target: { x: 12, y: 8 },
      },
    },
    {
      id: 4,
      x: 24,
      y: 7,
      type: PLACEMENT_TYPE_BATTLE_FRAME,
      width: 2,
      height: 2,
      day: 2,
      battleId: 'courtyard-python-day-2',
      enemy: {
        name: 'Professor Python',
        spriteFrame: TILES.ROGUE_LEFT,
        entry: { x: 27, y: 7 },
        target: { x: 26, y: 7 },
      },
    },
    {
      id: 5,
      x: 16,
      y: 8,
      type: PLACEMENT_TYPE_NPC,
      npcId: 'professor-python',
      spriteFrame: TILES.ROGUE_LEFT,
    },
    // We will add more placements later (e.g. Wardrobe, NPCs, Classrooms)
    // Add some boundary walls to test collision on the edges
    // { id: 1, x: 0, y: 0, type: PLACEMENT_TYPE_WALL },
    // { id: 2, x: 1, y: 0, type: PLACEMENT_TYPE_WALL },
    
    // Interactive Overworld Objects
    // { id: 11, x: 15, y: 7, type: 'CLASSROOM', spriteFrame: '0x0' }, // Trigger Classroom UI
    // { id: 12, x: 18, y: 10, type: 'NPC_BATTLE', spriteFrame: '1x0' }, // Trigger Quiz Battle
    // { id: 13, x: 12, y: 10, type: 'WARDROBE', spriteFrame: '2x0' }, // Decorative/Solid
    // { id: 14, x: 15, y: 12, type: 'DECORATIVE', spriteFrame: '3x0' }, // Y-Sorted Tree/Prop
  ],
};

export default level;
