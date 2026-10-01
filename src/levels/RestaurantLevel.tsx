import {
  LEVEL_THEMES,
  PLACEMENT_TYPE_CLASSROOM,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_TALL_SPRITE,
  PLACEMENT_TYPE_TELEPORT,
} from "@/utils/consts";
import { TILES } from "@/utils/tiles";

const level = {
  theme: LEVEL_THEMES.BLUE,
  tilesWidth: 16,
  tilesHeight: 10,
  backgroundImage: "/levels/restaurant.png",
  collisionGrid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
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
      x: 7,
      y: 9,
      type: PLACEMENT_TYPE_TELEPORT,
      targetMapId: "RestaurantEntranceLevel",
      targetX: 5,
      targetY: 6,
      opacity: 0,
      width: 2,
      height: 1,
    },
    {
      id: 2,
      x: 0,
      y: 0,
      type: PLACEMENT_TYPE_TALL_SPRITE,
      spriteImage: "/levels/restaurant-desk-top.png",
      fadeCells: [],
      placementBase: [
        { x: 7, y: 4 },
        { x: 7, y: 5 },
      ],
    },
    {
      id: 3,
      x: 0,
      y: 0,
      type: PLACEMENT_TYPE_TALL_SPRITE,
      spriteImage: "/levels/restaurant-desk-bottom.png",
      fadeCells: [],
      placementBase: [
        { x: 7, y: 7 },
        { x: 7, y: 8 },
      ],
    },
    {
      id: 4,
      x: 0,
      y: 0,
      type: PLACEMENT_TYPE_TALL_SPRITE,
      spriteImage: "/levels/restaurant-chair-top.png",
      fadeCells: [],
      placementBase: [
        { x: 6, y: 4 },
        { x: 6, y: 5 },
      ],
    },
    {
      id: 5,
      x: 0,
      y: 0,
      type: PLACEMENT_TYPE_TALL_SPRITE,
      spriteImage: "/levels/restaurant-chair-bottom.png",
      fadeCells: [],
      placementBase: [
        { x: 6, y: 6 },
        { x: 6, y: 7 },
      ],
    },
  ],
};

export default level;
