import React from 'react';
import { Placement } from '@/game-objects/Placement';

export class LockerPlacement extends Placement {
  isHeroNear: boolean;
  hasCollision: boolean;
  handleKeyDown: (e: KeyboardEvent) => void;

  constructor(properties: any, level: any) {
    super(properties, level);
    this.hasCollision = properties.hasCollision !== false; // true by default
    this.isHeroNear = false;

    this.handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'e' &&
        this.isHeroNear &&
        !(this.level as any).isBattleMode
      ) {
        this.interact();
      }
    };
    
    // Using document listener to match direction controls approach
    document.addEventListener('keydown', this.handleKeyDown);
  }

  isSolidForBody(_body: any) {
    return this.hasCollision;
  }

  tick() {
    const hero = (this.level as any).heroRef;
    if (hero) {
      const inXRange = hero.x >= this.x - 1 && hero.x <= this.x + this.width;
      const inYRange = hero.y >= this.y - 1 && hero.y <= this.y + this.height;
      
      const isInside =
        hero.x >= this.x &&
        hero.x < this.x + this.width &&
        hero.y >= this.y &&
        hero.y < this.y + this.height;

      // Hero is adjacent if they are within the extended bounding box but not inside the solid core
      const isNear = inXRange && inYRange && !isInside;
      
      if (this.isHeroNear !== isNear) {
        this.isHeroNear = isNear;
      }
    }
  }

  interact() {
    console.log('Interacting with Locker! Opening Skin Selection...');
    window.dispatchEvent(
      new CustomEvent('OVERWORLD_UI_TOGGLE', {
        detail: 'SKIN_SELECTION',
      })
    );
  }

  // Not strictly part of Placement base class but good for cleanup
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  renderComponent() {
    return (
      <div style={{ position: 'relative', width: this.width * 16, height: this.height * 16 }}>
        {this.isHeroNear && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              borderRadius: 2,
              padding: '4px 2px 3px 2px',
              lineHeight: 0,
              fontSize: 4,
              fontWeight: 'bold',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Pressione </span>
            <span style={{ color: 'red' }}>E</span>
          </div>
        )}
      </div>
    );
  }
}
