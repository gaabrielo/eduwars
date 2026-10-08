import { currentDraggedSpriteAtom } from '@/atoms/web/currentDraggedSpriteAtom';
import { BoardDropzone } from '@/components/web/maker/BoardDropzone';
import { CELL_SIZE } from '@/utils/consts';
import { useDroppable } from '@dnd-kit/core';
import { PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

export function Board({
  setDimensions,
  dimensions,
  selectedPlacement,
  showGrid,
  boardSize,
  setNewTiles,
  isPanningDisable,
  ...rest
}: any) {
  const [placements, setPlacements] = useState<{ [key: string]: number }>({});
  const [isClicking, setIsClicking] = useState(false);
  const [collisionConfigureList, setCollisionConfigureList] = useState<
    { xy: string; remove: boolean }[]
  >([]);

  const currentDraggedSprite = useRecoilValue(currentDraggedSpriteAtom);
  console.log('🚀 ~ currentDraggedSprite:', currentDraggedSprite);

  // const levelImgRef = useRef(null);

  // useEffect(() => {
  //   if (levelImgRef.current) {
  //     const { naturalWidth, naturalHeight } = levelImgRef.current;
  //     setDimensions({ width: naturalWidth, height: naturalHeight });
  //   }
  // }, [levelImgRef]);

  const cellRef = useRef(null);

  function handleAddTiles(e: any) {
    const position = e.currentTarget.name;
    setNewTiles(position);
  }

  function getBoardXY(ls: any) {
    const w = ls[0] * CELL_SIZE;
    const h = ls[1] * CELL_SIZE;

    return { width: w, height: h };
  }

  function configureCollisionIdentifier(col: number, row: number) {
    // inclui as celulas que devem ser pintadas na lista
    // to do: verificar se xy já esta na lista, incluir flag para adicionar/remover item
    // o mesmo xy pode ser incluido na lista se possuir flags diferentes
    setCollisionConfigureList((prev) => {
      const prevCopy = [...prev];

      const isRemoving =
        Object.keys(placements).some((p) => p === `${row}x${col}`) ||
        prevCopy.some((p) => p.xy === `${row}x${col}`);

      if (
        prevCopy.some(
          (pCopy) => pCopy.xy === `${row}x${col}` && pCopy.remove === isRemoving
        )
      ) {
        return prev;
      }

      prevCopy.push({ xy: `${row}x${col}`, remove: isRemoving });
      return prevCopy;
    });
  }

  function handleClickCell(col: number, row: number) {
    if (selectedPlacement === 0) configureCollisionIdentifier(col, row);
  }

  function handleHoverCell(col: number, row: number) {
    if (isClicking) {
      handleClickCell(col, row);
    }
  }

  function hoverWhileDrag(e: any) {
    e.stopPropagation();
    console.log('🚀 ~ hoverWhileDrag ~ HANDLE WHILE DRAG:', e);
  }

  useEffect(() => {
    window.addEventListener('mousedown', () => setIsClicking(true));
    window.addEventListener('mouseup', () => setIsClicking(false));

    return () => {
      window.removeEventListener('mousedown', () => setIsClicking(false));
      window.addEventListener('mouseup', () => setIsClicking(false));
    };
  }, []); // NAO INCLUIR DEPENDENCIAS

  useEffect(() => {
    if (collisionConfigureList.length > 0) {
      collisionConfigureList.forEach((cll) => {
        console.log('🚀 ~ collisionConfigureList.forEach ~ cll:', cll);
        setPlacements((prev) => {
          console.log('🚀 ~ setPlacements ~ prev:', prev);
          if (!Object.keys(prev).some((p) => p === cll.xy)) {
            const prevCopy = Object.assign({}, prev);
            prevCopy[cll.xy] = cll.remove ? 1 : 0;

            return prevCopy;
          }

          // *** ACIMA ESTA O ""PROBLEMA"" DA COLISAO NAO SER APAGADA, COMPLEMENTAR CÓDIGO ABAIXO ***
          // Eu verifico se a posicao existe, se nao existe cria-se como colisao
          // Caso a posicao já exista: se remove for false, define posicao pra 0 (zero). Se remove for
          // true, define a posicao pra 1 (pincel)

          return prev;
        });

        // Remove collision from list
        setCollisionConfigureList((cllPrev) => {
          const newCollisionList = [...cllPrev].filter(
            (nCll) =>
              nCll.xy !== cll.xy ||
              (nCll.xy === cll.xy && nCll.remove !== cll.remove)
          );

          return newCollisionList;
        });
      });
    }
  }, [collisionConfigureList]);

  // Sprite hovering cell
  // useEffect(() => {
  //   if (!cellRef?.current) return;
  //   console.log('🚀 ~ useEffect ~ cellRef?.current:', cellRef?.current);
  //   // window.addEventListener('drag', () =>
  //   //   console.log('DRAG OVER DRAGOVER!!! DRAGOVER!!! DRAGOVER!!!')
  //   // );

  //   console.log('🚀 ~ useEffect ~ cellRef?.current:', cellRef?.current);
  //   cellRef?.current.addEventListener('dragover', (e: any) => {
  //     e.preventDefault();
  //     return console.log('DRAG OVER DRAGOVER!!! DRAGOVER!!! DRAGOVER!!!');
  //   });

  //   return () => cellRef?.current.removeEventListener('dragover', () => {});
  // }, [cellRef]);

  const { width, height } = useMemo(() => getBoardXY(boardSize), [boardSize]);

  return (
    <div className="flex flex-col text-center">
      <button
        className="flex-1 flex justify-center hover:bg-slate-200 transition-colors group py-[1px] mx-auto"
        style={{ width: width + 4 + 'px' }}
        name="top"
        onClick={handleAddTiles}
      >
        <PlusIcon className="w-[6px] h-[6px] group-hover:text-slate-500 text-slate-200 transition-colors mt-[2px]" />
      </button>

      <div className="flex">
        <button
          className="flex-1 flex items-center hover:bg-slate-200 transition-colors group px-[1px]"
          name="left"
          onClick={(e) => handleAddTiles(e)}
        >
          <PlusIcon className="w-[6px] h-[6px] group-hover:text-slate-500 text-slate-200 transition-colors ml-[2px]" />
        </button>

        <main className="bg-slate-200 p-0.5">
          <div
            style={{
              height: height + 'px',
              width: width + 'px',
            }}
            className="relative"
          >
            <div
              className="flex flex-col absolute"
              // onDragOver={hoverWhileDrag}
              // onDragOverCapture={hoverWhileDrag}
              // onDragEnterCapture={hoverWhileDrag}
              // onDragEnter={hoverWhileDrag}
            >
              {[...Array(boardSize[1])].map((_, row) => (
                <div className="flex relative" key={row}>
                  {[...Array(boardSize[0])].map((_, col) => {
                    let tileClassName = isPanningDisable
                      ? 'hover:border hover:border-red-500'
                      : 'cursor-grab';

                    // collision cell background style
                    if (placements[row + 'x' + col] == 0 && showGrid) {
                      tileClassName += ' bg-red-800/40';
                    }

                    return (
                      <BoardDropzone
                        showGrid={showGrid}
                        tileClassName={tileClassName}
                        row={row}
                        col={col}
                        handleHoverCell={handleHoverCell}
                        handleClickCell={handleClickCell}
                        id={`${row}x${col}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <img src="/levels/dorm.png" />
          </div>
        </main>

        <button
          className="flex-1 flex items-center hover:bg-slate-200 transition-colors group px-[1px]"
          name="right"
          onClick={(e) => handleAddTiles(e)}
        >
          <PlusIcon className="w-[6px] h-[6px] group-hover:text-slate-500 text-slate-200 transition-colors mr-[2px]" />
        </button>
      </div>

      <button
        className="flex justify-center hover:bg-slate-200 transition-colors group py-[1px] mx-auto"
        style={{ width: width + 4 + 'px' }}
        name="bottom"
        onClick={(e) => handleAddTiles(e)}
      >
        <PlusIcon className="w-[6px] h-[6px] group-hover:text-slate-500 text-slate-200 transition-colors mb-[2px]" />
      </button>
    </div>
  );
}
