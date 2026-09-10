import { LevelProps } from '@/utils/types';
import { CSSProperties } from 'react';

export default function LevelPlacementsLayer({ level }: LevelProps) {
  return (level.placements as any[])
    .filter((placement: any) => {
      return placement && !placement.hasBeenCollected;
    })
    .map((placement: any) => {
      const [x, y] = placement.displayXY();

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
        zIndex: placement.zIndex(),
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
