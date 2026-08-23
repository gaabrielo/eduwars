import {
  LEVEL_THEMES,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_BATTLE_FRAME,
  PLACEMENT_TYPE_TELEPORT,
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_LOCKER,
} from "@/utils/consts";
import { TILES } from '@/utils/tiles';

const level = {
  theme: LEVEL_THEMES.BLUE,
  tilesWidth: 10,
  tilesHeight: 10,
  backgroundImage: "/levels/dorm.png", // We'll assume a placeholder for now
  collisionGrid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  placements: [
    {
      id: 0,
      x: 4,
      y: 5,
      type: PLACEMENT_TYPE_HERO,
    },
    {
      id: 1,
      x: 8,
      y: 6,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: "CourtyardLevel",
      targetX: 4,
      targetY: 5,
    },
    // We will add more placements later (e.g. Wardrobe, NPCs, Classrooms)
    // Add some boundary walls to test collision on the edges
    // { id: 1, x: 0, y: 0, type: PLACEMENT_TYPE_WALL },
    // { id: 2, x: 1, y: 0, type: PLACEMENT_TYPE_WALL },
    // Interactive Overworld Objects
    { id: 11, x: 15, y: 7, type: "CLASSROOM", spriteFrame: "0x0" }, // Trigger Classroom UI
    { id: 13, x: 12, y: 10, type: "WARDROBE", spriteFrame: "2x0" }, // Decorative/Solid
    { id: 14, x: 15, y: 12, type: "DECORATIVE", spriteFrame: "3x0" }, // Y-Sorted Tree/Prop

    {
      id: 16,
      x: 4,
      y: 4,
      type: PLACEMENT_TYPE_BATTLE_FRAME,
      width: 2,
      height: 2,
      day: 4,
      battleId: 'dorm-python-day-4',
      enemy: {
        name: 'Professor Python',
        spriteFrame: TILES.ROGUE_LEFT,
        entry: { x: 6, y: 4 },
        target: { x: 5, y: 4 },
      },
    },

    // Interactive Locker at 5x1 and 5x2 (Combined into a single 1x2 entity)
    { id: 15, x: 5, y: 1, type: PLACEMENT_TYPE_LOCKER, width: 1, height: 2 },
  ],
};

export default level;
