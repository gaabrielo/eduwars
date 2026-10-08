import { userSessionAtom } from '@/atoms/web/userSessionAtom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/primitives/Button';
import { Separator } from '@/components/ui/primitives/Separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import DashLayout from '@/components/web/dash/DashLayout';
import { BreadcrumbControl } from '@/components/web/dash/components/BreadcrumbControl';
import { NothingToSeeLabel } from '@/components/web/dash/components/NothingToSeeLabel';
import ProfileEditSheet from '@/components/web/dash/components/ProfileEditSheet';
import { getUserById } from '@/services/dash/user';
import { ArrowTopRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import type { UntypedRow } from '@/types/dbRows';
import type { ReactElement, ReactNode } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const userSession = useRecoilValue(userSessionAtom);
  const [userData, setUserData] = useState<UntypedRow | null>();
  console.log('🚀 ~ ProfilePage ~ userData:', userData);
  const [isLoading, setIsLoading] = useState(false);

  const [isProfileEditorMdOpen, setIsProfileEditorMdOpen] = useState(false);

  useEffect(() => {
    if (!router.query.userId) return;
    setIsLoading(true);
    async function fetchUserData() {
      const res = await getUserById(router.query.userId);

      if (!res.error && res.data[0]) setUserData(res.data[0]);
      setIsLoading(false);
    }

    fetchUserData();
  }, [router]);

  return (
    <div className="p-3 flex-1 flex flex-col gap-4">
      {isLoading ? (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />

            <div>
              <Skeleton className="w-36 h-4 rounded-sm" />
              <Skeleton className="w-40 h-3 rounded-sm mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <Separator />

            <div className="flex gap-3 items-center mt-4">
              <Skeleton className="w-24 h-3 rounded-sm" />
              <div className="h-7 w-0.5 bg-slate-200" />
              <Skeleton className="w-24 h-3 rounded-sm" />
              <div className="h-7 w-0.5 bg-slate-200" />
              <Skeleton className="w-20 h-7 rounded-sm" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="flex gap-3">
              <BreadcrumbControl title="Perfil de aluno" />

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    {userData?.avatar_url ? (
                      <AvatarImage src={userData.avatar_url} alt="User" />
                    ) : (
                      <AvatarFallback>{userData?.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="bg-slate-950 text-gray-50 px-2 py-0.5 rounded-lg text-xs absolute -bottom-1.5 -right-3">
                    Aluno
                  </span>
                </div>
                <div className="space-y-1 pb-1">
                  <CardTitle>{userData?.name}</CardTitle>
                  <CardDescription className="leading-none">
                    {userData?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator />

              <div className="flex gap-3 items-center mt-4">
                <span className="text-slate-900">0 seguidores</span>
                <div className="h-7 w-0.5 bg-slate-200" />
                <span className="text-slate-900">
                  {/* <strong className="font-semibold">7</strong>  */}0
                  seguindo
                </span>
                <div className="h-7 w-0.5 bg-slate-200" />

                {userSession?.data.session?.user.id === userData?.id ? (
                  <>
                    <ProfileEditSheet
                      userData={userData}
                      isOpen={isProfileEditorMdOpen}
                      setIsOpen={setIsProfileEditorMdOpen}
                    />
                  </>
                ) : (
                  <Button size={'sm'}>
                    <PlusIcon className="mr-1" />
                    Seguir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 auto-rows-min">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                {userData?.about ? (
                  <span className="text-base">{userData.about}</span>
                ) : (
                  <NothingToSeeLabel />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent>
                {userData?.links && userData.links.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {userData.links.map((l: string) => (
                      <li className="group transition-all flex items-center text-base">
                        <a href={l} target="_blank">
                          {l}
                        </a>
                        <ArrowTopRightIcon className="ml-1 w-4 h-4 text-neutral-400 group-hover:text-gray-900 transition-all" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <NothingToSeeLabel />
                )}
              </CardContent>
            </Card>

            {/* <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Mapas criados</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6"></CardContent>
            </Card> */}
          </div>

          {/* <div>
            <Card className="col-span-1 shadow-none">
              <CardContent className="text-center py-4 px-0 flex flex-col gap-4">
                <h1 className="text-5xl text-slate-900">7</h1>

                <Separator />
                <span className="text-sm text-zinc-500">MAPAS JOGADOS</span>
              </CardContent>
            </Card>
            <Card className="col-span-1 shadow-none">
              <CardContent className="text-center py-4 px-0 flex flex-col gap-4">
                <h1 className="text-5xl text-slate-900">21</h1>

                <Separator />
                <span className="text-sm text-zinc-500">MAPAS JOGADOS</span>
              </CardContent>
            </Card>
            <Card className="col-span-1 shadow-none">
              <CardContent className="text-center py-4 px-0 flex flex-col gap-4">
                <h1 className="text-5xl text-slate-900">17</h1>

                <Separator />
                <span className="text-sm text-zinc-500">MAPAS JOGADOS</span>
              </CardContent>
            </Card>
          </div> */}
        </>
      )}
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement): ReactNode {
  return <DashLayout>{page}</DashLayout>;
};
