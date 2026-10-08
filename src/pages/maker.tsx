'use client';

import { useEffect, useRef, useState } from 'react';

import { LayersAside } from '@/components/web/maker/LayersAside';
import {
  BoardMenu,
  mapPlacementButtons,
} from '@/components/web/maker/BoardMenu';
import { SpritesAside } from '@/components/web/maker/SpritesAside';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/primitives/Resizable';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { createSnapModifier, snapCenterToCursor } from '@dnd-kit/modifiers';
import { useRecoilState } from 'recoil';
import { SPRITE_SHEET_SRC } from '@/utils/consts';
import { spriteSheetImageAtom } from '@/atoms/spriteSheetImageAtom';
import SpriteAsideItem from '@/components/web/maker/SpriteAsideItem';
import { MAKER_SELECTABLE_TILES } from '@/utils/tiles';
import { ProfileMenu } from '@/components/web/maker/ProfileMenu';
import { Board } from '@/components/web/maker/Board';

const theme = {
  dark: {
    asideBg: 'bg-zinc-800',
    mainBg: 'bg-zinc-950',
    text: 'text-gray-50',
  },
  light: {
    asideBg: 'bg-white',
    mainBg: 'bg-zinc-100',
    text: 'text-zinc-950',
  },
};

export default function MapMakerPage() {
  const [darkMode, setDarkMode] = useState<'dark' | 'light'>('light');

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSpritesOpen, setIsSpritesOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [selectedPlacementOption, setSelectedPlacementOption] = useState<
    null | number
  >(null);

  const [draggingSpriteId, setDraggingSpriteId] = useState(null);

  const [isPanningDisable, setIsPanningDisable] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  // Shape of the react-zoom-pan-pinch TransformWrapper instance handled in
  // handleSpriteScaleTransform; only state.scale is consumed here.
  const [boardSpecs, setBoardSpecs] = useState<{
    state: { scale: number };
  } | null>(null);

  const currentBoardScale = boardSpecs?.state.scale ?? 1;
  const snapToGridModifier = createSnapModifier(16 * currentBoardScale);

  const placementBtnConfig = mapPlacementButtons.find(
    (btn) => btn.value === selectedPlacementOption
  );

  useEffect(() => {
    setIsPanningDisable(true);
    if (placementBtnConfig?.value === 1) {
      setIsSpritesOpen(true);
      setIsLayersOpen(true);
    } else if (placementBtnConfig?.value === 2) {
      setIsPanningDisable(false);
    }
  }, [placementBtnConfig]);

  const [isGridVisible, setIsGridVisible] = useState(true);

  const [boardSize, setBoardSize] = useState([10, 10]);

  const styles = theme[darkMode];

  function handleDragStart(e: any) {
    setDraggingSpriteId(e?.active.id);
    setIsDragging(true);
  }

  function handleDragEnd(e: any) {
    // console.log('🚀 ~ handleDragEnd ~ e DRAG END:', e);
    setIsDragging(false);
  }

  function handleSpriteScaleTransform(e: any) {
    setBoardSpecs(e);
  }

  // DON'T REMOVE THE FOLLOWING USE EFFECT
  const [spriteSheetImage, setSpriteSheetImage] =
    useRecoilState<any>(spriteSheetImageAtom);

  useEffect(() => {
    const image = new Image();
    image.src = SPRITE_SHEET_SRC;
    image.onload = () => {
      setSpriteSheetImage(image);
    };
  }, [setSpriteSheetImage]);

  function handleNewTiles(position: string) {
    if (['left', 'right'].includes(position)) {
      setBoardSize((prev) => [prev[0] + 1, prev[1]]);
    }

    if (['top', 'bottom'].includes(position)) {
      setBoardSize((prev) => [prev[0], prev[1] + 1]);
    }
  }

  return (
    <div
      className="w-full h-screen text-zinc-950 flex flex-col"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* <Header
        isSpritesOpen={isSpritesOpen}
        setIsSpritesOpen={setIsSpritesOpen}
        isLayersOpen={isLayersOpen}
        setIsLayersOpen={setIsLayersOpen}
      /> */}

      <DndContext
        // modifiers={[snapToGridModifier]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ResizablePanelGroup direction="horizontal" autoSaveId="conditional">
          {/* <DragOverlay modifiers={[snapToGridModifier]}> */}
          <ResizablePanel defaultSize={84} id="left" order={1}>
            <main
              className={`flex items-center flex-col justify-center h-full w-full relative ${styles.mainBg}`}
            >
              <ProfileMenu />

              <BoardMenu
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                isSpritesOpen={isSpritesOpen}
                setIsSpritesOpen={setIsSpritesOpen}
                isLayersOpen={isLayersOpen}
                setIsLayersOpen={setIsLayersOpen}
                setIsGridVisible={setIsGridVisible}
                isGridVisible={isGridVisible}
                setSelectedPlacementOption={setSelectedPlacementOption}
                selectedPlacementOption={selectedPlacementOption}
              />

              <div className="flex-1 flex items-center w-full">
                <TransformWrapper
                  panning={{ disabled: isPanningDisable }}
                  centerOnInit
                  // onZoomStop={console.log}
                  onTransformed={handleSpriteScaleTransform}
                >
                  <TransformComponent
                    contentClass="main"
                    wrapperStyle={{
                      width: '100%',
                      height: '100%',
                      zIndex: 1,
                      cursor: isPanningDisable ? 'inherit' : 'grab',
                    }}
                  >
                    <Board
                      dimensions={dimensions}
                      setDimensions={setDimensions}
                      selectedPlacement={selectedPlacementOption}
                      showGrid={isGridVisible}
                      boardSize={boardSize}
                      setNewTiles={handleNewTiles}
                      isPanningDisable={isPanningDisable}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </main>
          </ResizablePanel>

          {isLayersOpen && (
            <>
              <ResizableHandle withHandle className="z-20" />

              <ResizablePanel minSize={12} maxSize={18} id="center" order={2}>
                <LayersAside />
              </ResizablePanel>
            </>
          )}

          {isSpritesOpen && (
            <>
              <ResizableHandle withHandle={!isLayersOpen} className="z-20" />

              <ResizablePanel minSize={14} maxSize={28} id="right" order={3}>
                <SpritesAside
                  className={`${styles.asideBg}`}
                  handleSpriteSelected={() => setSelectedPlacementOption(1)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        <DragOverlay modifiers={[snapCenterToCursor]}>
          {isDragging && draggingSpriteId ? (
            <SpriteAsideItem
              spriteSettings={MAKER_SELECTABLE_TILES[draggingSpriteId]}
              id={draggingSpriteId}
              spriteScale={boardSpecs?.state.scale ?? 1}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
