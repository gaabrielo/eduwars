import { spriteSheetImageAtom } from '@/atoms/spriteSheetImageAtom';
import { CELL_SIZE } from '@/utils/consts';
import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

interface Props {
  frameCoordinate: string;
  size?: number;
  showInteractionPrompt?: boolean;
}

function Sprite({ frameCoordinate, size = 16, showInteractionPrompt }: Props) {
  const spriteSheetImage = useRecoilValue(spriteSheetImageAtom)!;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef) return;

    const canvasEl = canvasRef.current!;
    const ctx = canvasEl.getContext('2d')!;

    // Clear out anything in the canvas tag
    if (canvasEl) ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    const tileSheetX = Number(frameCoordinate.split('x')[0]);
    const tileSheetY = Number(frameCoordinate.split('x')[1]);

    ctx.drawImage(
      spriteSheetImage,
      tileSheetX * CELL_SIZE,
      tileSheetY * CELL_SIZE,
      size,
      size,
      0,
      0,
      size,
      size
    );
  }, [frameCoordinate]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <canvas width={size} height={size} ref={canvasRef} />
      {showInteractionPrompt && (
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
            borderRadius: 4,
            padding: '0 4px',
            fontSize: 10,
            fontWeight: 'bold',
            zIndex: 100,
            pointerEvents: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          E
        </div>
      )}
    </div>
  );
}

export default React.memo(Sprite);
