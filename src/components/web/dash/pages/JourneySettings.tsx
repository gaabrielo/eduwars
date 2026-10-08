import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/Select';
import { Separator } from '@/components/ui/primitives/Separator';
import { Switch } from '@/components/ui/switch';
import { YoutubeThumbnail } from '@/components/web/dash/components/YoutubeThumbnail';
import { updateLevel } from '@/services/dash/journey';
import { getYtbThumbnailUrl } from '@/utils/helpers';
import {
  CalendarIcon,
  Pencil2Icon,
  PlusCircledIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { isEqual } from 'lodash';
import { ImageUpIcon, MoveUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_COVER_PATH = '/logo512.png';
const UNSELECTED_COVER_OPACITY = 'opacity-50';

export function JourneySettings({ data: levelData }: any) {
  const [data, setData] = useState<any>();
  const [defaultObject, setDefaultObject] = useState<any>();
  const [isEdited, setIsEdited] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<null | string>();
  console.log('🚀 ~ JourneySettings ~ selectedCoverUrl:', selectedCoverUrl);

  useEffect(() => {
    const fData = {
      name: levelData.name,
      created_at: levelData.created_at,
      updated_at: levelData.updated_at,
      is_active: levelData.is_active,
      is_public: levelData.is_public,
    };

    setData(fData);
    setDefaultObject(fData);

    if (!levelData?.cover_id || levelData?.cover_id == 1) {
      setSelectedCoverUrl(DEFAULT_COVER_PATH);
    } else {
      setSelectedCoverUrl(levelData?.cover_url);
    }
  }, [levelData]);

  useEffect(() => {
    if (
      (!levelData?.cover_id || levelData?.cover_id == 1) &&
      selectedCoverUrl !== DEFAULT_COVER_PATH
    ) {
      setIsEdited(true);
    } else if (isEqual(data, defaultObject)) {
      setIsEdited(false);
    } else if (selectedCoverUrl == '__LOADED_IMAGE__') {
      setIsEdited(true);
    } else {
      setIsEdited(true);
    }
  }, [data, defaultObject, selectedCoverUrl, levelData]);

  async function handleSubmit() {
    const updatedData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const res = await updateLevel(updatedData, levelData.id);

    if (!res.error) {
      setData(res.data[0]);
      setDefaultObject(res.data[0]);
    }
  }

  function handleUploadCover() {
    if (!coverFileInputRef) return;

    coverFileInputRef.current?.click();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedCoverUrl('__LOADED_IMAGE__');
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  function handleSelectYtbCover(ytb_link: string) {
    // setSelectedCoverUrl(getYtbThumbnailUrl(ytb_link));
    setSelectedCoverUrl(ytb_link);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row">
        <div className="text-sm text-neutral-500 w-full flex-1">
          <CardTitle className="text-base text-slate-900">
            Configurações
          </CardTitle>
          <span className="inline-flex items-center gap-1 mr-4">
            <CalendarIcon className="w-4 h-4" />{' '}
            {levelData?.created_at &&
              format(new Date(levelData?.created_at), 'dd/MM/yyyy HH:mm')}
          </span>
          <span className="inline-flex items-center gap-1">
            <Pencil2Icon className="w-4 h-4" />{' '}
            {levelData?.updated_at &&
              format(new Date(levelData?.updated_at), 'dd/MM/yyyy HH:mm')}
          </span>
        </div>
        <CardDescription className="pt-1.5 text-sm flex">
          {isEdited && (
            <SubmitButtons handleSubmit={handleSubmit} onCancel={() => {}} />
          )}
        </CardDescription>
      </CardHeader>

      {!!data && (
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-4 items-center">
            <Label className="col-span-1">Nome</Label>
            <Input
              value={data.name}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, name: e.target.value }))
              }
              defaultValue={defaultObject.name}
              className="col-span-3 ml-4"
            />
          </div>

          {/* <div className="col-span-1 grid grid-cols-4 items-center">
              <Label className="col-span-1">Criado em</Label>
              <Input
                defaultValue={format(
                  new Date(defaultObject.created_at),
                  'dd/MM/yyyy HH:mm'
                )}
                disabled
                className="col-span-3"
              />
            </div>

            <div>
              <Label>Modificado em</Label>
              <Input
                defaultValue={format(
                  new Date(defaultObject.updated_at),
                  'dd/MM/yyyy HH:mm'
                )}
                disabled
              />
            </div> */}

          <div className="text-sm grid grid-cols-4 items-center">
            <Label className="col-span-1">Linguagem</Label>

            <div className="col-span-3 pl-4">
              <Select defaultValue="pt_BR">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma linguagem" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pt_BR">Português</SelectItem>
                    <SelectItem value="en_US">Inglês</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-4">
            <h3 className="leading-none font-medium col-span-1 pt-2">
              Imagem de capa
            </h3>
            {/* <div>
              <Button variant={'secondary'} size={'sm'} className="mt-1.5">
                Visualizar
                <MoveUpRightIcon className="w-4 h-4 ml-1 stroke-1.5" />
              </Button>
            </div> */}

            <div className="col-span-3 grid grid-cols-4 pl-4 gap-3 group">
              <button
                type="button"
                className={`w-full min-h-20 h-full text-sm flex flex-col aspect-video items-center bg-gray-100 hover:scale-2 text-neutral-500 hover:text-slate-900 justify-center gap-1 border border-zinc-300 rounded-lg hover:ring-2 ring-slate-800 ring-offset-2 transition-all`}
                onClick={handleUploadCover}
              >
                <ImageUpIcon className="h-5 w-5" />
                Carregar imagem
              </button>
              <input
                ref={coverFileInputRef}
                onChange={handleChange}
                type="file"
                name="input-cover"
                id="input-cover"
                accept="image/png, image/jpeg, image/jpg"
                className="sr-only"
              />

              {selectedFile && (
                <Image
                  src={selectedFile}
                  alt="Imagem carregada"
                  width={512}
                  height={512}
                  className={`aspect-video object-cover object-bottom rounded-lg ring-slate-800 ring-offset-2 hover:ring-2 cursor-pointer transition-all group-hover:opacity-100 ${
                    selectedCoverUrl == '__LOADED_IMAGE__'
                      ? 'ring-2 opacity-100'
                      : UNSELECTED_COVER_OPACITY
                  }`}
                  onClick={() => setSelectedCoverUrl('__LOADED_IMAGE__')}
                />
              )}

              <Image
                src={DEFAULT_COVER_PATH}
                alt="Imagem padrão"
                width={512}
                height={512}
                className={`aspect-video object-cover rounded-lg ring-slate-800 ring-offset-2 hover:ring-2 cursor-pointer transition-all group-hover:opacity-100 ${
                  selectedCoverUrl == DEFAULT_COVER_PATH
                    ? 'ring-2 opacity-100'
                    : UNSELECTED_COVER_OPACITY
                }`}
                onClick={() => setSelectedCoverUrl(DEFAULT_COVER_PATH)}
              />

              {levelData?.class.map(
                ({
                  ytb_link,
                  title,
                  id,
                }: {
                  ytb_link: string;
                  title: string;
                  id: string;
                }) => (
                  <YoutubeThumbnail
                    src={ytb_link}
                    alt={title}
                    key={id}
                    className={`rounded-lg w-full ring-slate-800 ring-offset-2 hover:ring-2 cursor-pointer transition-all group-hover:opacity-100 ${
                      selectedCoverUrl == ytb_link
                        ? 'ring-2 opacity-100'
                        : UNSELECTED_COVER_OPACITY
                    }`}
                    onClick={() => handleSelectYtbCover(ytb_link)}
                  />
                )
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-4">
            <div className="col-span-1 pt-2 flex flex-col gap-1.5">
              <h3 className="leading-none font-medium ">Acessibilidade</h3>
              <span className="text-sm text-neutral-500">
                Configure quem tem acesso à sua sequência didática
              </span>
            </div>

            <div className="flex flex-col gap-4 col-span-3 pl-4">
              <Card className={`flex items-center justify-between shadow-none`}>
                <CardHeader className="p-4">
                  <Label htmlFor="enable-hint">Não listado</Label>
                  <CardDescription>
                    Ao habilitar, somente você terá acesso a isso.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 pr-4">
                  <Switch
                    id="enable-hint"
                    checked={!data.is_active}
                    onCheckedChange={(val) =>
                      setData((prev: any) => ({ ...prev, is_active: !val }))
                    }
                  />
                </CardContent>
              </Card>

              <Card className={`flex items-center justify-between shadow-none`}>
                <CardHeader
                  className={`p-4 ${!data.is_active && 'opacity-50'}`}
                >
                  <Label htmlFor="turn_public">Tornar público</Label>
                  <CardDescription>
                    Acessível a qualquer pessoa com o link.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 pr-4">
                  <Switch
                    id="turn_public"
                    checked={data.is_public && data.is_active}
                    disabled={!data.is_active}
                    onCheckedChange={(val) =>
                      setData((prev: any) => ({ ...prev, is_public: val }))
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <footer className="flex">
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-400 hover:bg-red-50 gap-1 flex items-center mr-1 ml-auto px-2"
              size={'sm'}
            >
              <TrashIcon className="w-4 h-4" />
              <span>Excluir sequência</span>
            </Button>

            {isEdited && (
              <SubmitButtons handleSubmit={handleSubmit} onCancel={() => {}} />
            )}
          </footer>
        </CardContent>
      )}
    </Card>
  );
}

function SubmitButtons({ handleSubmit, onCancel }: any) {
  return (
    <>
      <Button variant={'ghost'} size={'sm'} className="mr-1" onClick={onCancel}>
        Cancelar
      </Button>
      <Button
        className="gap-1 flex items-center px-2"
        onClick={handleSubmit}
        size={'sm'}
      >
        <span>Salvar alterações</span>
      </Button>
    </>
  );
}
