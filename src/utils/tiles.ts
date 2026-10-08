export const TILES = {
  // Basics
  SHADOW: '1x3',
  FLOUR: '2x3',
  FIRE_PICKUP: '3x3',
  ICE_PICKUP: '4x3',
  WATER_PICKUP: '5x3',
  BULLET_PICKUP: '4x9',
  BULLET: '3x9',

  // Icons
  CONTINUE_BUTTON: '7x3',
  EDIT_BUTTON: '8x3',
  RESUME_BUTTON: '9x3',
  RESTART_BUTTON: '10x3',
  MAP_BUTTON: '11x3',
  CLOCK: '12x3',
  SETTINGS: '13x3',

  // Locks and Keys
  BLUE_LOCK: '0x4',
  BLUE_KEY: '1x4',
  GREEN_LOCK: '2x4',
  GREEN_KEY: '3x4',
  UNLOCKED_LOCK: '4x4',

  // Water
  WATER1: '0x5',
  WATER2: '1x5',

  // Ice
  ICE: '0x6',
  ICE_TOP_LEFT: '1x6',
  ICE_TOP_RIGHT: '2x6',
  ICE_BOTTOM_LEFT: '3x6',
  ICE_BOTTOM_RIGHT: '4x6',

  // Fire
  FIRE1: '0x7',
  FIRE2: '1x7',
  FIRE3: '2x7',

  // Conveyors
  CONVEYOR_DOWN: '0x8',
  CONVEYOR_UP: '1x8',
  CONVEYOR_RIGHT: '2x8',
  CONVEYOR_LEFT: '3x8',

  // Other Tiles
  BULLET_DROPBOX: '2x9',

  // Spawns
  ENEMY_LEFT_SPAWN: '4x8',
  ENEMY_RIGHT_SPAWN: '5x8',
  ENEMY_UP_SPAWN: '6x8',
  ENEMY_DOWN_SPAWN: '7x8',
  ENEMY_FLYING_LEFT_SPAWN: '8x8',
  ENEMY_FLYING_RIGHT_SPAWN: '9x8',
  ENEMY_FLYING_UP_SPAWN: '10x8',
  ENEMY_FLYING_DOWN_SPAWN: '11x8',
  ENEMY_ROAMING_SPAWN: '12x8',
  HERO_SPAWN: '13x8',
  CIABATTA_SPAWN: '14x8',

  //Goal
  GOAL_DISABLED: '0x9',
  GOAL_ENABLED: '1x9',

  //Switches, Other
  PURPLE_BUTTON: '0x10',
  PURPLE_DOOR_OUTLINE: '1x10',
  PURPLE_DOOR_SOLID: '2x10',
  TELEPORT1: '3x10',
  TELEPORT2: '4x10',
  TELEPORT3: '5x10',
  TELEPORT4: '6x10',

  THIEF: '7x10',
  WARNING: '8x10',

  //Particle Dusty explosion
  PARTICLE_1: '5x9',
  PARTICLE_2: '6x9',
  PARTICLE_3: '7x9',
  PARTICLE_4: '8x9',
  PARTICLE_5: '9x9',
  PARTICLE_6: '10x9',
  PARTICLE_7: '11x9',
  PARTICLE_8: '12x9',
  PARTICLE_9: '13x9',

  //Characters
  HERO_LEFT: '0x23',
  HERO_RIGHT: '2x23',
  HERO_HOP_LEFT: '14x11',
  HERO_HOP_RIGHT: '16x11',

  ENGINEER_LEFT: '0x25',
  ENGINEER_RIGHT: '2x25',

  CLERIC_LEFT: '0x21',
  CLERIC_RIGHT: '2x21',

  ROGUE_LEFT: '0x19',
  ROGUE_RIGHT: '2x19',

  //hero run
  HERO_RUN_1_LEFT: '4x23',
  HERO_RUN_1_RIGHT: '6x23',
  HERO_RUN_2_LEFT: '8x23',
  HERO_RUN_2_RIGHT: '10x23',

  ENGINEER_RUN_1_LEFT: '4x25',
  ENGINEER_RUN_1_RIGHT: '6x25',
  ENGINEER_RUN_2_LEFT: '8x25',
  ENGINEER_RUN_2_RIGHT: '10x25',

  CLERIC_RUN_1_LEFT: '4x21',
  CLERIC_RUN_1_RIGHT: '6x21',
  CLERIC_RUN_2_LEFT: '8x21',
  CLERIC_RUN_2_RIGHT: '10x21',

  ROGUE_RUN_1_LEFT: '4x19',
  ROGUE_RUN_1_RIGHT: '6x19',
  ROGUE_RUN_2_LEFT: '8x19',
  ROGUE_RUN_2_RIGHT: '10x19',

  //Characters Row 3
  HERO_WATER_LEFT: '0x13',
  HERO_WATER_RIGHT: '2x13',
  HERO_ICE_LEFT: '4x13',
  HERO_ICE_RIGHT: '6x13',
  HERO_CONVEYOR_LEFT: '8x13',
  HERO_CONVEYOR_RIGHT: '10x13',
  HERO_FIRE_LEFT: '12x13',
  HERO_FIRE_RIGHT: '14x13',

  //Characters Row 4
  HERO_DEATH_LEFT: '0x15',
  HERO_DEATH_RIGHT: '2x15',
  HERO_TELEPORT_LEFT: '4x15',
  HERO_TELEPORT_RIGHT: '6x15',
  HERO_EDITING_LEFT: '8x15',
  HERO_EDITING_RIGHT: '10x15',

  // Enemies overall
  ENEMY_LEFT: '4x11',
  ENEMY_RIGHT: '6x11',
  ENEMY_ROAMING: '8x11',
  ENEMY_FLYING_LEFT: '10x11',
  ENEMY_FLYING_RIGHT: '12x11',

  // Ciabatta
  CIABATTA1: '5x4',
  CIABATTA2: '8x4',
  CIABATTA_PAIN: '11x4',
  CIABATTA_DEAD: '14x4',
  CIABATTA_BLAST: '6x3',

  // Battle room
  BATTLE_FRAME_TOP_LEFT: '15x8',
  BATTLE_FRAME_TOP_RIGHT: '16x8',
  BATTLE_FRAME_BOTTOM_RIGHT: '16x9',
  BATTLE_FRAME_BOTTOM_LEFT: '15x9',

  BATTLE_FRAME_TOP_LEFT_DISABLED: '17x8',
};

export type MakerSelectableTileKey = keyof typeof MAKER_SELECTABLE_TILES;

// MAKER
export const MAKER_SELECTABLE_TILES = {
  // Basics
  SHADOW: { xy: '1x3' },
  FLOUR: {
    xy: '2x3',
    keywords: ['soda'],
    translation: { pt_BR: 'Refrigerante' },
  },
  FIRE_PICKUP: { xy: '3x3' },
  ICE_PICKUP: { xy: '4x3' },
  WATER_PICKUP: { xy: '5x3' },
  BULLET_PICKUP: { xy: '4x9' },
  BULLET: { xy: '3x9' },

  // Fire
  FIRE1: { xy: '0x7', keywords: ['floor', 'fire'] },
  FIRE2: { xy: '1x7', keywords: ['floor', 'fire'] },
  FIRE3: { xy: '2x7' },

  // Conveyors
  CONVEYOR_DOWN: { xy: '0x8' },
  CONVEYOR_UP: { xy: '1x8' },
  CONVEYOR_RIGHT: { xy: '2x8' },
  CONVEYOR_LEFT: { xy: '3x8' },

  // Other Tiles
  BULLET_DROPBOX: { xy: '2x9' },

  // Spawns
  ENEMY_LEFT_SPAWN: { xy: '4x8' },
  ENEMY_RIGHT_SPAWN: { xy: '5x8' },
  ENEMY_UP_SPAWN: { xy: '6x8' },
  ENEMY_DOWN_SPAWN: { xy: '7x8' },
  ENEMY_FLYING_LEFT_SPAWN: { xy: '8x8' },
  ENEMY_FLYING_RIGHT_SPAWN: { xy: '9x8' },
  ENEMY_FLYING_UP_SPAWN: { xy: '10x8' },
  ENEMY_FLYING_DOWN_SPAWN: { xy: '11x8' },
  ENEMY_ROAMING_SPAWN: { xy: '12x8' },
  HERO_SPAWN: { xy: '13x8' },
  CIABATTA_SPAWN: { xy: '14x8' },

  //Goal
  GOAL_DISABLED: { xy: '0x9' },
  GOAL_ENABLED: { xy: '1x9' },

  //Switches, Other
  PURPLE_BUTTON: { xy: '0x10' },
  PURPLE_DOOR_OUTLINE: { xy: '1x10' },
  PURPLE_DOOR_SOLID: { xy: '2x10' },
  TELEPORT1: { xy: '3x10' },
  TELEPORT2: { xy: '4x10' },
  TELEPORT3: { xy: '5x10' },
  TELEPORT4: { xy: '6x10' },

  THIEF: { xy: '7x10' },
  WARNING: { xy: '8x10' },

  // Ciabatta
  // area: [width, height]
  CIABATTA1: { xy: '5x4', area: [3, 3] },
  CIABATTA2: { xy: '8x4', area: [3, 3] },

  BATTLE_FRAME: { xy: '15x8', area: [2, 2] },
  BATTLE_FRAME_DISABLED: { xy: '17x8', area: [2, 2] },
  // BATTLE_FRAME_BOTTOM_RIGHT: { xy: '16x9' },
  // BATTLE_FRAME_BOTTOM_LEFT: { xy: '15x9' },

  // BATTLE_FRAME_TOP_LEFT_DISABLED: { xy: '17x8' },
};
