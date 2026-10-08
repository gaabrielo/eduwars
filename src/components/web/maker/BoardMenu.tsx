import { Avatar, AvatarFallback } from '@/components/ui/primitives/avatar';
import { BoardOptions } from '@/components/web/maker/BoardOptions';
import { Button, ButtonProps } from '@/components/ui/primitives/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/primitives/Dropdown';
import { Separator } from '@/components/ui/primitives/Separator';
import { LabeledButton } from '@/components/ui/shared/LabeledButton';
import { PlacementButton } from '@/components/ui/shared/PlacementButton';
import { cn } from '@/utils/helpers';
import {
  BrushIcon,
  CircleUserIcon,
  CopyIcon,
  DownloadIcon,
  EraserIcon,
  EyeIcon,
  EyeOffIcon,
  ForwardIcon,
  GalleryVerticalEndIcon,
  HandIcon,
  ImagePlusIcon,
  LayersIcon,
  LayoutGridIcon,
  MenuIcon,
  MousePointerIcon,
  PlayIcon,
  SquareIcon,
  SquircleIcon,
  Trash2Icon,
} from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode, useRef, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/primitives/popover';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import {
  ChevronDownIcon,
  Pencil1Icon,
  Pencil2Icon,
  PinBottomIcon,
} from '@radix-ui/react-icons';
import { Input } from '@/components/ui/primitives/Input';

const ICON_STYLE = `w-4 h-4 subpixel-antialiased`;

export const mapPlacementButtons = [
  {
    label: 'Mover',
    icon: <HandIcon className={ICON_STYLE} />,
    value: 2,
  },
  {
    label: 'Cursor',
    icon: <MousePointerIcon className={ICON_STYLE} />,
    value: 1,
  },
  // {
  //   label: 'Pincel',
  //   icon: <BrushIcon className={ICON_STYLE} />,
  //   value: 1,
  // },
  // {
  //   label: 'Borracha',
  //   icon: <EraserIcon className={ICON_STYLE} />,
  //   value: -1,
  // },
  {
    label: 'Colisão',
    icon: (
      <SquircleIcon
        className={'w-[1.15rem] h-[1.15rem] subpixel-antialiased'}
      />
    ),
    value: 0,
  },
  // {
  //   label: 'Posição inicial do herói',
  //   icon: <LandPlotIcon className={ICON_STYLE} />,
  //   value: 3,
  // },
  // {
  //   label: 'Saída (conecta com outro mapa)',
  //   icon: <DoorOpenIcon className={ICON_STYLE} />,
  //   value: 4,
  // },
];

const playButtonOptions = [
  {
    label: 'Salvar alterações',
    icon: <ForwardIcon className="w-4 h-4" />,
  },
  {
    label: 'Duplicar',
    icon: <CopyIcon className="w-4 h-4" />,
    disabled: false,
  },
  {
    label: 'Excluir',
    icon: <Trash2Icon className="w-4 h-4" />,
    disabled: false,
    sectionStart: true,
    className: 'text-red-600 hover:text-red-600 hover:opacity-100 opacity-80',
  },
];

export function BoardMenu({
  boardSize,
  setBoardSize,
  isLayersOpen,
  setIsLayersOpen,
  isSpritesOpen,
  setIsSpritesOpen,
  selectedPlacementOption,
  setSelectedPlacementOption,
  setIsGridVisible,
  isGridVisible,
}: any) {
  const [image, setImage] = useState<any>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <>
      {/* <img
        src="/app-icon.svg"
        alt="Eduwars"
        className="absolute top-0.5 left-2 z-[9999]"
      /> */}

      <div className="absolute border border-slate-200 top-3 p-1 bg-white w-fit mx-auto rounded-full flex gap-2 items-center z-[9999]">
        {mapPlacementButtons.map((btn, btnIndex) => (
          <PlacementButton
            size="icon"
            variant="ghost"
            tooltipContent={btn.label}
            className={btnIndex === 0 && 'rounded-l-2xl rounded-r-md'}
            selected={selectedPlacementOption === btn.value}
            onClick={() => setSelectedPlacementOption(btn.value)}
          >
            {btn.icon}
          </PlacementButton>
        ))}
        <Divider />
        <PlacementButton
          selectable={false}
          tooltipContent={'Importar imagem'}
          onClick={() => imageInputRef.current?.click()}
        >
          <ImagePlusIcon className={ICON_STYLE} />
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="sr-only"
            ref={imageInputRef}
          />
        </PlacementButton>
        <PlacementButton
          selectable={false}
          tooltipContent={'Mostrar/esconder grid'}
          onClick={() => setIsGridVisible((prev: boolean) => !prev)}
        >
          {isGridVisible ? (
            <EyeOffIcon className={ICON_STYLE} />
          ) : (
            <EyeIcon className={ICON_STYLE} />
          )}
        </PlacementButton>
        <BoardOptions
          boardSize={boardSize}
          setBoardSize={setBoardSize}
          shadow={false}
        />
        <Divider />
        {/* <PlacementButton selectable={false} tooltipContent={'Salvar'}>
          <DownloadIcon className={ICON_STYLE} />
        </PlacementButton> */}
        <SaveButton />
        <PlacementButton
          className="rounded-r-2xl rounded-l-md"
          selected={true}
          tooltipContent={'Jogar'}
        >
          <PlayIcon className={ICON_STYLE} />
        </PlacementButton>
      </div>

      <div className="absolute border border-slate-200 top-3 right-3 overflow-hidden p-1 bg-white w-fit ml-auto mr-0 rounded-full flex items-center z-[9999]">
        <LabeledButton
          onClick={() => setIsLayersOpen((prev: boolean) => !prev)}
          selected={isLayersOpen}
          size="sm"
          className="px-2 rounded-l-2xl rounded-r-none"
          tooltipContent={'Camadas'}
          showTooltip
        >
          <GalleryVerticalEndIcon className={ICON_STYLE} />
          <span className="text-zinc-500 font-normal hidden">Camadas</span>
        </LabeledButton>

        <Divider />

        <LabeledButton
          onClick={() => setIsSpritesOpen((prev: boolean) => !prev)}
          selected={isSpritesOpen}
          size="sm"
          className="px-2 rounded-r-2xl rounded-l-none"
          showTooltip
          tooltipContent={'Sprites'}
        >
          <LayoutGridIcon className={ICON_STYLE} />
          {/* <span className="text-zinc-500 font-normal hidden">Sprites</span> */}
        </LabeledButton>
      </div>

      {/* Play button */}
      {/* <div className="absolute top-2 right-2 flex z-[9999]">
        <Button
          className="items-center font-normal rounded-r-none text-gray-50 px-3"
          variant="default"
          size="sm"
        >
          <PlayIcon className="w-4 h-4 mr-2" />
          Jogar
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-slate-900 rounded-r-md flex items-center">
            <div className="w-[1px] h-3/5 bg-slate-600" />
            <ChevronDownIcon className="w-4 h-4 text-gray-50 mx-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {playButtonOptions.map((btn) => (
              <>
                {!!btn.sectionStart && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  disabled={btn.disabled ?? false}
                  className={cn(
                    'w-52 flex items-center gap-3 cursor-pointer transition-all text-slate-700 hover:text-slate-950',
                    btn.className ?? ''
                  )}
                >
                  {btn.icon}
                  {btn.label}
                </DropdownMenuItem>
              </>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </>
  );
}

function SaveButton() {
  const [isEditingName, setIsEditingName] = useState(false);

  if (!!isEditingName) {
    return <Input autoFocus className="w-32 h-7" value="Quarto" />;
  }

  function handleEditName() {
    setIsEditingName(true);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-sm gap-1 py-1.5 text-slate-500 hover:text-slate-900 transition-all">
        Quarto
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-[0.315rem] min-w-40">
        {/* <DropdownMenuItem className="cursor-pointer" onClick={handleEditName}>
          Renomear <Pencil1Icon />
        </DropdownMenuItem> */}
        <DropdownMenuItem className="cursor-pointer">
          Salvar <PinBottomIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Divider() {
  return <div className="w-[2px] h-6 rounded-md bg-zinc-200"></div>;
}
