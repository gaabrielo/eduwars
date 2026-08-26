import Sprite from './Sprite';
import styles from './ElevatedSprite.module.css';
import { CELL_SIZE } from '@/utils/consts';
import { TILES } from '@/utils/tiles';
import { memo } from 'react';

interface ElevatedSpriteProps {
  frameCoordinate: string;
  size?: number;
  pxAboveGround?: number;
}

function ElevatedSprite({
  frameCoordinate,
  size = CELL_SIZE,
  pxAboveGround = 3,
}: ElevatedSpriteProps) {
  return (
    <div className={styles.elevatedSprite}>
      <Sprite frameCoordinate={TILES.SHADOW} />
      <div
        className={styles.bodyContainer}
        style={{
          transform: `translateY(${-pxAboveGround}px)`,
        }}
      >
        <Sprite frameCoordinate={frameCoordinate} size={size} />
      </div>
    </div>
  );
}

export default memo(ElevatedSprite);
