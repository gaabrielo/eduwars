import SpriteAsideItem from '@/components/web/maker/SpriteAsideItem';
import { Input } from '@/components/ui/primitives/Input';
import { cn } from '@/utils/helpers';
import {
  MAKER_SELECTABLE_TILES,
  MakerSelectableTileKey,
} from '@/utils/tiles';
import { useEffect, useRef, useState } from 'react';

export function SpritesAside({
  className,
  handleSpriteSelected,
  ...rest
}: any) {
  const asideRef = useRef<any>(null);
  const [asideWidth, setAsideWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (asideRef.current) {
      // const wDiv = asideRef?.current.offsetWidth;
      // setAsideWidth(wDiv ?? 0);

      const resizeObserver = new ResizeObserver(() => {
        if (asideRef.current.offsetWidth !== asideWidth) {
          setAsideWidth(asideRef.current.offsetWidth);
        }
        // if (asideRef.current.offsetHeight !== height) {
        //   setHeight(asideRef.current.offsetHeight);
        // }
      });

      resizeObserver.observe(asideRef.current);

      return function cleanup() {
        resizeObserver.disconnect();
      };
    }
  }, [asideRef]);

  return (
    <aside
      {...rest}
      className={cn(
        'w-full h-full z-10 relative flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-neutral-200 hover:scrollbar-thumb-neutral-300 scrollbar-track-transparent',
        className
      )}
      ref={asideRef}
    >
      {/* <div>
        <ToggleGroup
          type="multiple"
          variant="outline"
          className="justify-start overflow-auto"
        >
          <ToggleGroupItem value="floor">Floor</ToggleGroupItem>
          <ToggleGroupItem value="wall">Wall</ToggleGroupItem>
          <ToggleGroupItem value="wall">Collectible</ToggleGroupItem>
          <ToggleGroupItem value="wall">Decoration</ToggleGroupItem>
        </ToggleGroup>
      </div> */}

      <div className="flex gap-2 items-center sticky z-20 pt-3 top-0 w-full px-3 bg-white">
        <Input
          placeholder={`Busque ${
            Object.keys(MAKER_SELECTABLE_TILES).length
          } sprites...`}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <Button className="flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add
        </Button> */}
      </div>

      <div
        className={cn(
          'grid grid-cols-2 gap-1 mt-3.5 mb-3 z-0 mx-3',
          asideWidth >= 240 && 'grid-cols-3',
          asideWidth >= 320 && 'grid-cols-4',
          asideWidth >= 440 && 'grid-cols-5',
          asideWidth >= 540 && 'grid-cols-6'
        )}
      >
        {/* <Sprite frameCoordinate={TILES.ROGUE_RUN_1_LEFT} /> */}
        {Object.keys(MAKER_SELECTABLE_TILES)
          .filter((spt: string) => {
            if (searchTerm.trim() === '') return true;

            const tile = MAKER_SELECTABLE_TILES[spt as MakerSelectableTileKey];
            if (
              ('keywords' in tile &&
                tile.keywords?.includes(
                  searchTerm.trim().toLowerCase()
                )) ||
              spt
                .replaceAll('_', ' ')
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
            ) {
              return true;
            }
          })
          .map((spt: string) => {
            return (
              <SpriteAsideItem
                spriteSettings={MAKER_SELECTABLE_TILES[spt as MakerSelectableTileKey]}
                spriteKey={spt}
                key={spt}
                spriteScale={3}
                defaultSize={16}
                id={spt}
                onMouseDown={handleSpriteSelected}
              />
            );
          })}
      </div>
    </aside>
  );
}
