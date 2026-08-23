import React from 'react';
import { Placement } from './Placement';
import Hero from '@/components/object-graphics/Hero';
import {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  directionUpdateMap,
  BODY_SKINS,
  HERO_RUN_1,
  HERO_RUN_2,
  Z_INDEX_LAYER_SIZE,
  CHARACTERS,
} from '@/utils/consts';
import { TILES } from '@/utils/tiles';
import { Collision } from '@/classes/Collision';

const heroRunMap = {
  [CHARACTERS.HERO]: [
    [TILES.HERO_RUN_1_LEFT, TILES.HERO_RUN_1_RIGHT],
    [TILES.HERO_RUN_2_LEFT, TILES.HERO_RUN_2_RIGHT],
  ],
  [CHARACTERS.ENGINEER]: [
    [TILES.ENGINEER_RUN_1_LEFT, TILES.ENGINEER_RUN_1_RIGHT],
    [TILES.ENGINEER_RUN_2_LEFT, TILES.ENGINEER_RUN_2_RIGHT],
  ],
  [CHARACTERS.CLERIC]: [
    [TILES.CLERIC_RUN_1_LEFT, TILES.CLERIC_RUN_1_RIGHT],
    [TILES.CLERIC_RUN_2_LEFT, TILES.CLERIC_RUN_2_RIGHT],
  ],
  [CHARACTERS.ROGUE]: [
    [TILES.ROGUE_RUN_1_LEFT, TILES.ROGUE_RUN_1_RIGHT],
    [TILES.ROGUE_RUN_2_LEFT, TILES.ROGUE_RUN_2_RIGHT],
  ],
};

const getHeroSkinMap = (skinType: string) => {
  return {
    [CHARACTERS.HERO]: [TILES.HERO_LEFT, TILES.HERO_RIGHT],
    [CHARACTERS.ENGINEER]: [TILES.ENGINEER_LEFT, TILES.ENGINEER_RIGHT],
    [CHARACTERS.CLERIC]: [TILES.CLERIC_LEFT, TILES.CLERIC_RIGHT],
    [CHARACTERS.ROGUE]: [TILES.ROGUE_LEFT, TILES.ROGUE_RIGHT],
    [HERO_RUN_1]: heroRunMap[skinType][0],
    [HERO_RUN_2]: heroRunMap[skinType][1],
  };
};

export class HeroPlacement extends Placement {
  controllerMoveRequested(direction: any) {
    // attempt to start movie
    if (this.movingPixelsRemaining > 0) {
      return;
    }

    // make sure the next space is available
    const canMove = this.canMoveToNextDestination(direction);
    if (!canMove) {
      return;
    }

    //start the move
    this.movingPixelsRemaining = 16;
    this.movingPixelsDirection = direction;
    this.updateFacingDirection();
    this.updateWalkFrame();
  }

  canMoveToNextDestination(direction: string) {
    //is the next space in bounds?
    const { x, y } = directionUpdateMap[direction];
    const nextX = this.x + x;
    const nextY = this.y + y;
    const isOutOfBounds = this.level.isPositionOutOfBounds(nextX, nextY);

    if (isOutOfBounds) {
      return false;
    }

    // is there something solid here?
    const collision = new Collision(this, this.level, {
      x: nextX,
      y: nextY,
    });
    if (collision.withSolidPlacement()) {
      return false;
    }

    return true;
  }

  updateFacingDirection() {
    if (
      this.movingPixelsDirection === DIRECTION_LEFT ||
      this.movingPixelsDirection === DIRECTION_RIGHT
    ) {
      this.spriteFacingDirection = this.movingPixelsDirection;
    }
  }

  updateWalkFrame() {
    this.spriteWalkFrame = this.spriteWalkFrame === 1 ? 0 : 1;
  }

  tick() {
    this.tickMovingPixelProgress();
  }

  tickMovingPixelProgress() {
    if (this.movingPixelsRemaining === 0) {
      return;
    }

    this.movingPixelsRemaining -= this.travelPixelsPerFrame;
    if (this.movingPixelsRemaining <= 0) {
      this.movingPixelsRemaining = 0;

      // done moving
      this.onDoneMoving();
    }
  }

  onDoneMoving() {
    const { x, y } = directionUpdateMap[this.movingPixelsDirection];
    this.x += x;
    this.y += y;

    this.handleCollisions();
  }

  handleCollisions() {
    // handle collisions
    const collision = new Collision(this, this.level);
    const collideThatAddsToInventory = collision.withPlacementAddsToInventory();

    if (collideThatAddsToInventory) {
      collideThatAddsToInventory.collect();
    }

    const battleLevel = collision.renderBattleLevel();
    if (battleLevel) {
      this.level.startBattle?.(battleLevel);
    }

    const interactable = collision.withInteractablePlacement();
    if (interactable) {
      interactable.interact();
    }

    const teleportTrigger = collision.withTeleportPlacement();
    if (teleportTrigger) {
      teleportTrigger.teleport();
    }
  }

  getFrame() {
    const index = this.spriteFacingDirection === DIRECTION_LEFT ? 0 : 1;

    // use correct walking frame per direction
    if (this.movingPixelsRemaining > 0) {
      const walkKey = this.spriteWalkFrame === 0 ? HERO_RUN_1 : HERO_RUN_2;
      return getHeroSkinMap(this.level.heroSkin)[walkKey][index];
    }

    return getHeroSkinMap(this.level.heroSkin)[this.level.heroSkin][index];
  }

  getYTranslate() {
    if (this.movingPixelsRemaining === 0) {
      return 0;
    }

    const PIXELS_FROM_END = 2;
    if (
      this.movingPixelsRemaining < PIXELS_FROM_END ||
      this.movingPixelsRemaining > 16 - PIXELS_FROM_END
    ) {
      return -1;
    }

    return -2;
  }

  zIndex() {
    return this.y * Z_INDEX_LAYER_SIZE + 1;
  }

  renderComponent() {
    return (
      <Hero frameCoord={this.getFrame()} yTranslate={this.getYTranslate()} />
    );
  }
}
