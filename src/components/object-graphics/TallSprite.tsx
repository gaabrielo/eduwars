import { memo, useEffect, useState } from 'react';
import type { TallSpritePlacement } from '@/game-objects/TallSpritePlacement';

interface TallSpriteProps {
  placement: TallSpritePlacement;
}

function TallSprite({ placement }: TallSpriteProps): JSX.Element {
  const [isFaded, setIsFaded] = useState(() =>
    placement.isHeroInsideFadeCell()
  );

  useEffect(() => {
    return placement.subscribeToHeroCellChanged(({ x, y }) => {
      const nextIsFaded = placement.isFadeCell(x, y);
      setIsFaded((previousIsFaded) =>
        previousIsFaded === nextIsFaded ? previousIsFaded : nextIsFaded
      );
    });
  }, [placement]);

  return (
    <img
      src={placement.spriteImage}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pixelated block"
      style={{
        width: `${placement.spriteWidth}px`,
        height: `${placement.spriteHeight}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        objectFit: 'fill',
        opacity: isFaded ? 0.6 : 1,
        pointerEvents: 'none',
      }}
    />
  );
}

export default memo(TallSprite);
