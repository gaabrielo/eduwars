import Sprite from '@/components/object-graphics/Sprite';
import { CELL_SIZE } from '@/utils/consts';
import { memo } from 'react';

interface Props {
  frameCoordinate: string;
  x: number;
  y: number;
}

function MapCell({ x, y, frameCoordinate }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
      }}
    >
      <Sprite frameCoordinate={frameCoordinate} />
    </div>
  );
}

export default memo(MapCell);
