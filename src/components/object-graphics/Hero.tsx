import { TILES } from '@/utils/tiles';
import Sprite from './Sprite';
import styles from './Hero.module.css';
import { memo } from 'react';

interface HeroProps {
  frameCoord: string;
  yTranslate: number;
  showInteractionPrompt?: boolean;
}

function Hero({
  frameCoord,
  yTranslate,
  showInteractionPrompt = false,
}: HeroProps) {
  return (
    <div className={styles.hero}>
      <div>
        <Sprite frameCoordinate={TILES.SHADOW} />
      </div>
      <div
        className={styles.heroBody}
        style={{
          transform: `translateY(${yTranslate}px)`,
        }}
      >
        <Sprite
          frameCoordinate={frameCoord}
          size={32}
          showInteractionPrompt={showInteractionPrompt}
        />
      </div>
    </div>
  );
}

export default memo(Hero);
