import { spriteSheetImageAtom } from '@/atoms/spriteSheetImageAtom';
import RenderLevel from '@/components/level-layout/RenderLevel';
import { SPRITE_SHEET_SRC } from '@/utils/consts';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { GameProgressProvider } from '@/contexts/GameProgressContext';

export default function App() {
  const [spriteSheetImage, setSpriteSheetImage] =
    useRecoilState<any>(spriteSheetImageAtom);

  useEffect(() => {
    const image = new Image();
    image.src = SPRITE_SHEET_SRC;
    image.onload = () => {
      setSpriteSheetImage(image);
    };
  }, [setSpriteSheetImage]);

  if (!spriteSheetImage) return null;

  return (
    <GameProgressProvider>
      <RenderLevel />
    </GameProgressProvider>
  );
}
