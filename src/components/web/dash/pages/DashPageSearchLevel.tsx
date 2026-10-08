import { userSessionAtom } from '@/atoms/web/userSessionAtom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Separator } from '@/components/ui/primitives/Separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import { Label } from '@/components/ui/primitives/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackCard } from '@/components/web/dash/components/FeedbackCard';
import { LevelCardGame } from '@/components/web/dash/components/LevelCardGame';
import { getAllLevels, getAllPublicLevels } from '@/services/dash/level';
import {
  LockClosedIcon,
  LockOpen1Icon,
  LockOpen2Icon,
  PlayIcon,
} from '@radix-ui/react-icons';
import { InfoIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import type { UntypedRowList } from '@/types/dbRows';

export function DashPageSearchLevel() {
  const [recentCreatedLevels, setRecentCreatedLevels] = useState<
    UntypedRowList | null | undefined
  >();
  const [searchedLevels, setSearchedLevels] = useState<
    UntypedRowList | null | undefined
  >();
  console.log('🚀 ~ DashPageSearchLevel ~ searchedLevels:', searchedLevels);

  const [isLoadingRCL, setIsLoadingRCL] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const userSession = useRecoilValue(userSessionAtom);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingRCL(true);
      const res = await getAllPublicLevels();

      if (!res.error) {
        setRecentCreatedLevels(res.data);
      }
    };

    fetchData();
    setIsLoadingRCL(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllLevels(searchTerm);

      if (!res.error) {
        setSearchedLevels(res.data);
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="py-6">
        {/* <CardHeader className="items-center pb-6 space-y-6">
          <CardTitle>Buscar mapas</CardTitle>
          <CardDescription className="max-w-[80%] text-center leading-6">
            Cada mapa consiste de uma sequência didática com um conjunto de
            aulas e desafios definidos por um professor, que guiam a experiência
            gamificada do aluno. Encontre um mapa público buscando seu nome ou
            código de acesso.
          </CardDescription>
        </CardHeader> */}
        <CardContent className="w-full pb-0">
          <div className="mx-auto w-full max-w-sm relative">
            <Label htmlFor="search-level-input">
              <SearchIcon className="stroke-[1.5] absolute left-2 top-2 bottom-0 text-muted-foreground" />
            </Label>

            <Input
              id="search-level-input"
              placeholder="Nome ou código de acesso..."
              className="pl-10"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchedLevels ? (
            <>
              {searchedLevels?.length > 0 ? (
                <Table className="w-full mt-12">
                  <TableHeader>
                    <TableRow className="text-center grid grid-cols-8">
                      <TableHead className="col-span-2 flex justify-center items-center">
                        Level
                      </TableHead>
                      <TableHead className="col-span-2 flex justify-center items-center">
                        Videos
                      </TableHead>
                      <TableHead className="col-span-2 flex justify-center items-center">
                        Autor
                      </TableHead>
                      <TableHead className="col-span-1 flex justify-center items-center">
                        Status
                      </TableHead>
                      <TableHead className="col-span-1 flex justify-center items-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchedLevels.map((lvl) => (
                      <LevelTableRow data={lvl} />
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="w-full text-center text-sm text-zinc-500 pt-12 pb-8">
                  Nenhum resultado encontrado
                </p>
              )}
            </>
          ) : (
            <Image
              src="/map-search-pt_BR.svg"
              alt="cadastre novas aulas"
              width={500}
              height={168}
              className="aspect-video w-96 mx-auto"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criado recentemente</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <CardTitle className="mb-6">Criado recentemente</CardTitle> */}

          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-[90%] mx-auto"
          >
            <CarouselContent>
              {isLoadingRCL ? (
                [...Array(2)].map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <LevelCardGame isLoading={true} />
                  </CarouselItem>
                ))
              ) : (
                <>
                  {recentCreatedLevels?.map((m) => (
                    <CarouselItem
                      key={m.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <LevelCardGame data={m} isLoading={false} />
                    </CarouselItem>
                  ))}
                </>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      <FeedbackCard />
    </div>
  );
}

function LevelTableRow({ data }: any) {
  const router = useRouter();

  return (
    <TableRow className="text-center grid grid-cols-8 items-center py-2">
      <TableCell className="col-span-2 flex flex-1 gap-2 items-center justify-center text-left">
        {/* <div className="aspect-square w-16 bg-gray-100 rounded-lg" /> */}
        <Image
          alt="game image"
          src="/logo512.png"
          width={512}
          height={512}
          className="w-16 aspect-square rounded-lg"
        />
        <p className="w-full font-semibold">{data.name}</p>
      </TableCell>
      <TableCell className="col-span-2">{data.class.length}</TableCell>
      <TableCell
        className="col-span-2 items-center justify-left text-left flex gap-2"
        onClick={() => {
          router.push(`/u/${data.user.id}`);
        }}
      >
        <Avatar className="w-8 h-8">
          {data.user.avatar_url ? (
            <AvatarImage alt={data.user.name} src={data.user.avatar_url} />
          ) : (
            <AvatarFallback>{data.user.name[0]}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="w-fit">{data.user.name}</span>
        </div>
      </TableCell>
      <TableCell className="col-span-1">
        {data.is_public ? (
          <LockOpen1Icon className="mx-auto" />
        ) : (
          <LockClosedIcon className="mx-auto" />
        )}
      </TableCell>
      <TableCell className="col-span-1 flex justify-end">
        <Button size={'sm'} variant={'outline'}>
          {data.is_public ? (
            <>
              <span>Jogar</span> <PlayIcon className="ml-1" />
            </>
          ) : (
            'Pedir acesso'
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
