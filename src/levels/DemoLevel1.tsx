import { LEVEL_THEMES, PLACEMENT_TYPE_HERO, PLACEMENT_TYPE_WALL, PLACEMENT_TYPE_ENERGY_DRINK } from "@/utils/consts";

const level = {
  theme: LEVEL_THEMES.GRAY,
  tilesWidth: 27,
  tilesHeight: 9,
  placements: [
    {
      id: 0,
      x: 25,
      y: 8,
      type: PLACEMENT_TYPE_HERO,
    },

    // { id: 1, x: 6, y: 4, type: PLACEMENT_TYPE_GOAL },
    { id: 2, x: 4, y: 2, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 4, y: 5, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 4, y: 4, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 4, y: 3, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 4, y: 2, type: PLACEMENT_TYPE_WALL },
    { id: 3, x: 4, y: 1, type: PLACEMENT_TYPE_WALL },

    { id: 5, x: 4, y: 8, type: PLACEMENT_TYPE_ENERGY_DRINK },
    { id: 5, x: 8, y: 2, type: PLACEMENT_TYPE_ENERGY_DRINK },

    { id: 5, x: 24, y: 3, type: PLACEMENT_TYPE_ENERGY_DRINK },
    { id: 5, x: 24, y: 4, type: PLACEMENT_TYPE_ENERGY_DRINK },
    { id: 5, x: 22, y: 2, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 23, y: 2, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 24, y: 2, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 25, y: 2, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 25, y: 3, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 25, y: 4, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 25, y: 5, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 24, y: 5, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 23, y: 5, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 22, y: 5, type: PLACEMENT_TYPE_WALL },
    { id: 5, x: 22, y: 3, type: PLACEMENT_TYPE_WALL },

    { id: 2, x: 8, y: 8, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 8, y: 7, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 8, y: 6, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 8, y: 5, type: PLACEMENT_TYPE_WALL },
    { id: 2, x: 8, y: 4, type: PLACEMENT_TYPE_WALL },
    { id: 3, x: 8, y: 9, type: PLACEMENT_TYPE_WALL },
  ],
};

export default level;
