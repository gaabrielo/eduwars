import { LevelProps } from '@/utils/types';
import { CSSProperties, memo } from 'react';
import { Placement } from '@/game-objects/Placement';
import { PLACEMENT_TYPE_TALL_SPRITE } from '@/utils/consts';

interface TallSpriteLayerItemProps {
  placement: Placement;
  x: number;
  y: number;
  zIndex: number;
}

const TallSpriteLayerItem = memo(
  function TallSpriteLayerItem({
    placement,
    x,
    y,
    zIndex,
  }: TallSpriteLayerItemProps) {
    const component = placement.renderComponent();
    if (!component) return null;

    const style: CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translate3d(${x}px, ${y}px, 0)`,
      WebkitTransform: `translate3d(${x}px, ${y}px, 0)`,
      msTransform: `translate3d(${x}px, ${y}px, 0)`,
      MozTransform: `translate3d(${x}px, ${y}px, 0)`,
      transformStyle: 'preserve-3d',
      WebkitTransformStyle: 'preserve-3d',
      zIndex,
    };

    return <div style={style}>{component}</div>;
  },
  (previous, next) =>
    previous.placement === next.placement &&
    previous.x === next.x &&
    previous.y === next.y &&
    previous.zIndex === next.zIndex
);

export default function LevelPlacementsLayer({ level }: LevelProps) {
  return (level.placements as any[])
    .filter((placement: any) => {
      return placement && !placement.hasBeenCollected;
    })
    .map((placement: any) => {
      const [x, y] = placement.displayXY();
      const zIndex = placement.zIndex();

      if (placement.type === PLACEMENT_TYPE_TALL_SPRITE) {
        return (
          <TallSpriteLayerItem
            key={placement.id}
            placement={placement}
            x={x}
            y={y}
            zIndex={zIndex}
          />
        );
      }

      const style: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        WebkitTransform: `translate3d(${x}px, ${y}px, 0)`,
        msTransform: `translate3d(${x}px, ${y}px, 0)`,
        MozTransform: `translate3d(${x}px, ${y}px, 0)`,
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d',
        zIndex,
      };

      const component = placement.renderComponent();
      if (!component) return null;

      return (
        <div key={placement.id} style={style}>
          {component}
        </div>
      );
    });
}
