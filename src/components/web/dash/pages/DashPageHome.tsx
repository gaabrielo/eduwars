import { Button } from '@/components/ui/button';
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
import { JourneyCreatorCard } from '@/components/web/dash/components/JourneyCreatorCard';
import { Separator } from '@/components/ui/primitives/Separator';
import { EllipsisIcon } from '@/components/ui/shared/EllipsisIcon';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getLevelByAuthorId,
  getLevelsThatUserIsSigned,
} from '@/services/dash/level';
import { supabase } from '@/services/supabase';
import { PlayIcon, TrashIcon } from '@radix-ui/react-icons';
import { BadgeInfoIcon, SettingsIcon, User2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/primitives/Dropdown';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LevelCardGame } from '@/components/web/dash/components/LevelCardGame';
import type { User } from '@supabase/supabase-js';
import type { UntypedRowList } from '@/types/dbRows';

export function DashPageHome() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  console.log('🚀 ~ DashPageHome ~ user:', user);
  const [authorLevels, setAuthorLevels] = useState<UntypedRowList | null>(null);
  const [myMaps, setMyMaps] = useState<UntypedRowList | null | undefined>();
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoadingLevels(true);
    fetchMyMaps();
    fetchAuthorLevels();
  }, [user]);

  const fetchMyMaps = async () => {
    if (!user) return;
    const res = await getLevelsThatUserIsSigned(user.id);
    setMyMaps(res.data);
  };

  const fetchAuthorLevels = async () => {
    if (!user) return;
    const res = await getLevelByAuthorId(user.id);
    setAuthorLevels(res.data);

    setIsLoadingLevels(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await supabase.auth.getSession();
    if (user?.data?.session) {
      setUser(user.data.session.user);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Jogar agora</CardTitle>
          <CardDescription>
            Sequências didáticas que você está cadastrado
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!isLoadingLevels && myMaps?.length === 0 ? (
            <div className="mx-auto flex flex-col text-center text-sm py-10 gap-0.5">
              <p className="text-center">
                Se cadastre em um mapa e comece a jogar.
              </p>
              <Link className="underline" href="/dash/search">
                Buscar mapas.
              </Link>
            </div>
          ) : (
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-[90%] mx-auto"
            >
              <CarouselContent>
                {isLoadingLevels
                  ? [...Array(2)].map((_, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <LevelCardGame isLoading={true} />
                      </CarouselItem>
                    ))
                  : myMaps?.map((m, idx) => (
                      <CarouselItem
                        key={m.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <LevelCardGame data={m.level} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}

          {/* {authorLevels?.length > 0 && (
            <>
              <Separator />

              <div className="flex flex-col gap-1.5">
                <CardTitle>Criado por mim</CardTitle>
                <CardDescription>
                  Sequências didáticas criadas por você
                </CardDescription>
              </div>

              <Carousel
                opts={{
                  align: 'start',
                }}
                className="w-[90%] mx-auto"
              >
                <CarouselContent>
                  {authorLevels.map((dt, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/4 pl-4 h-full"
                    >
                      <JourneyCreatorCard
                        onClick={() => {
                          router.push('/dash/journey/' + dt.id);
                        }}
                        data={dt}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </>
          )} */}
        </CardContent>
      </Card>

      {authorLevels && authorLevels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Criado por mim</CardTitle>
            <CardDescription>
              Sequências didáticas criadas por você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-[90%] mx-auto"
            >
              <CarouselContent>
                {authorLevels?.map((dt, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4 pl-4 h-full"
                  >
                    <JourneyCreatorCard
                      onClick={() => {
                        router.push('/dash/journey/' + dt.id);
                      }}
                      data={dt}
                      className="shadow-none"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Frequência</CardTitle>
            <CardDescription>
              Você completou _ aulas na última semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto my-12 bg-zinc-100 w-fit p-4 rounded-lg text-sm text-center">
              <h1 className="font-semibold">Em breve</h1>
              <p className="mt-1.5 max-w-60 leading-6">
                Este conteúdo será adicionado em breve. Têm recomendações ou
                precisa de ajuda?{' '}
                <Link href={'/dash/futureLog'} className="underline">
                  Envie um comentário.
                </Link>{' '}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Configure seu perfil público</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  {user?.user_metadata.avatar_url ? (
                    <AvatarImage
                      src={user.user_metadata.avatar_url}
                      alt="User"
                    />
                  ) : (
                    <AvatarFallback>
                      {user?.user_metadata.name
                        ? user?.user_metadata.name[0]
                        : ''}
                    </AvatarFallback>
                  )}
                </Avatar>
                {/* <span className="bg-slate-700 text-gray-50 px-3 py-0.5 rounded-full text-xs absolute -bottom-2 -right-3">
                  Aluno
                </span> */}
                <span className="bg-slate-950 text-gray-50 px-2 py-0.5 rounded-lg text-xs absolute -bottom-1.5 -right-3">
                  Aluno
                </span>
              </div>

              <div className="space-y-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
                <CardTitle className="w-full overflow-hidden overflow-ellipsis">
                  {user?.user_metadata.name}
                </CardTitle>
                <CardDescription className="leading-none overflow-hidden overflow-ellipsis">
                  {user?.user_metadata.email}
                </CardDescription>
              </div>
            </div>

            <div className="mt-5">
              <Progress value={28} className="h-3" />
              <div className="flex items-center justify-between mt-1.5 text-sm text-zinc-500">
                <p className="flex-1">Dados cadastrados</p>
                <p className="text-right">28%</p>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              variant={'default'}
              size={'sm'}
              onClick={() => {
                router.push('/u/' + user?.id);
              }}
            >
              Ver perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
