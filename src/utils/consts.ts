export const CELL_SIZE = 16;
export const Z_INDEX_LAYER_SIZE = 10;
export const SPRITE_SHEET_SRC = '/spritesheet.png';

export const PLACEMENT_TYPE_HERO = 'HERO';
export const PLACEMENT_TYPE_GOAL = 'GOAL';
export const PLACEMENT_TYPE_WALL = 'WALL';
export const PLACEMENT_TYPE_BATTLE_FRAME = 'BATTLE_FRAME';
export const PLACEMENT_TYPE_ENERGY_DRINK = 'ENERGY_DRINK';

export const DIRECTION_LEFT = 'LEFT';
export const DIRECTION_RIGHT = 'RIGHT';
export const DIRECTION_UP = 'UP';
export const DIRECTION_DOWN = 'DOWN';

export const directionUpdateMap = {
  [DIRECTION_DOWN]: { x: 0, y: 1 },
  [DIRECTION_UP]: { x: 0, y: -1 },
  [DIRECTION_LEFT]: { x: -1, y: 0 },
  [DIRECTION_RIGHT]: { x: 1, y: 0 },
};

// character states
export const BODY_SKINS = {
  WATER: 'WATER',
  ICE: 'ICE',
  CONVEYOR: 'CONVEYOR',
  FIRE: 'FIRE',
  TELEPORT: 'TELEPORT',
  SCARED: 'SCARED',
};

export const CHARACTERS = {
  HERO: 'HERO', // hero
  ROGUE: 'ROGUE', // will
  CLERIC: 'CLERIC', // boy
  ENGINEER: 'ENGINEER', // girl
};

export const HERO_RUN_1 = 'HERO_RUN_1';
export const HERO_RUN_2 = 'HERO_RUN_2';

export const LEVEL_THEMES = {
  YELLOW: 'YELLOW',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  PINK: 'PINK',
  GRAY: 'GRAY',
};

export const THEME_BACKGROUNDS = {
  [LEVEL_THEMES.YELLOW]: '#2f2808',
  [LEVEL_THEMES.BLUE]: '#3d4c67',
  [LEVEL_THEMES.GREEN]: '#2f2808',
  [LEVEL_THEMES.PINK]: '#673d5e',
  [LEVEL_THEMES.GRAY]: '#96a1c7',
};

export const THEME_TILES_MAP = {
  [LEVEL_THEMES.YELLOW]: {
    FLOOR: '1x1',
    TOP: '1x0',
    LEFT: '0x1',
    RIGHT: '2x1',
    BOTTOM: '1x2',
    WALL: '0x2',
  },
  [LEVEL_THEMES.BLUE]: {
    FLOOR: '4x1',
    TOP: '4x0',
    LEFT: '3x1',
    RIGHT: '5x1',
    BOTTOM: '4x2',
    WALL: '3x2',
  },
  [LEVEL_THEMES.GREEN]: {
    FLOOR: '7x1',
    TOP: '7x0',
    LEFT: '6x1',
    RIGHT: '8x1',
    BOTTOM: '7x2',
    WALL: '6x2',
  },
  [LEVEL_THEMES.PINK]: {
    FLOOR: '10x1',
    TOP: '10x0',
    LEFT: '9x1',
    RIGHT: '11x1',
    BOTTOM: '10x2',
    WALL: '9x2',
  },
  [LEVEL_THEMES.GRAY]: {
    FLOOR: '13x1',
    TOP: '13x0',
    LEFT: '12x1',
    RIGHT: '14x1',
    BOTTOM: '13x2',
    WALL: '12x2',
  },
};

// DASH
export const twStyles = {
  light: {
    text: {
      title: {
        primary: '',
        secondary: 'text-zinc-500 text-sm',
      },
    },
  },
};

export const dashTabs = {
  home: {
    label: 'Home',
    path: '/dash/home',
    id: 0,
  },
  search: {
    label: 'Buscar mapas',
    path: '/dash/search',
    id: 1,
  },
  journey: {
    label: 'Sequências didáticas',
    path: '/dash/journey',
    id: 2,
  },

  report: {
    label: 'Relatório',
    path: '/dash/report',
    id: 3,
  },
  maker: {
    label: 'Criar cenários',
    // url: '/maker',
    path: '/maker',
    id: 4,
  },
  futureLog: {
    label: 'Em breve',
    path: '/dash/futureLog',
    id: 5,
  },
  // profile: {
  //   label: 'Configurações',
  // },
};
