'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/primitives/Input';
import { Separator } from '@/components/ui/primitives/Separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import { SmoothTabs } from '@/components/ui/shared/SmoothTabs';
import { dashTabs, DashTabKey } from '@/utils/consts';
import {
  ArrowLeftFromLineIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CircleEllipsisIcon,
  CircleUserRoundIcon,
  EyeIcon,
  Settings,
  User2Icon,
  UserIcon,
  UserRoundCogIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/primitives/Dropdown';
import {
  DropdownMenuIcon,
  EyeOpenIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { supabase } from '@/services/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { EllipsisIcon } from '@/components/ui/shared/EllipsisIcon';
import { useSetRecoilState } from 'recoil';
import { userSessionAtom } from '@/atoms/web/userSessionAtom';
import { DashAsideNotifications } from '@/components/web/dash/components/DashAsideNotifications';

export function DashAside({
  onSelectTab = () => {},
  justTabs = false,
  defaultSelected = null,
}: any) {
  console.log('🚀 ~ defaultSelected:', defaultSelected);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number | undefined>(
    typeof defaultSelected === 'number' ? defaultSelected : 0
  );
  const [user, setUser] = useState<any>(null);
  const setCurrentUserSession = useSetRecoilState(userSessionAtom);

  const router = useRouter();

  const tabs = dashTabs;

  useEffect(() => {
    if (router?.query.tab) {
      console.log('🚀 ~ useEffect ~ router:', router);
      const ntab = tabs[router?.query.tab as DashTabKey]?.id;
      setSelectedTabIndex(ntab);
    }
  }, [router]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await supabase.auth.getSession();
    setCurrentUserSession(user);
    if (user?.data.session) {
      setUser(user.data.session.user);
    }
  };

  return (
    <aside
      className={
        justTabs
          ? 'flex flex-col w-full max-w-60 h-fit'
          : 'flex flex-col w-full max-w-[25%] h-screen p-3 sticky top-0 overflow-y-auto'
      }
    >
      <ProfileHeader data={user} />

      <SmoothTabs
        orientation="vertical"
        selected={selectedTabIndex}
        tabs={Object.keys(tabs)
          .sort(
            (a, b) => tabs[a as DashTabKey].id - tabs[b as DashTabKey].id
          )
          .map((k: string, tKey: number) => {
            // `name` is used by SmoothTabs to track the active tab through
            // cloneElement; it is no longer declared on anchor attributes in
            // newer @types/react, so it is spread through a typed variable.
            const linkProps = { name: k };
            return (
              <Link
                href={tabs[k as DashTabKey]?.path}
                key={k}
                id={tabs[k as DashTabKey].id as unknown as string}
                {...linkProps}
                onClick={(e) => {
                  setSelectedTabIndex(tabs[k as DashTabKey].id);
                  onSelectTab({ ...tabs[k as DashTabKey], id: k });
                }}
                className="text-left flex items-center gap-1"
              >
                {tabs[k as DashTabKey].label
                  .split(`\n`)
                  .map((tabLabel, tabLabelIdx) => (
                    <React.Fragment key={tabLabelIdx}>
                      {tabLabel}
                      {tabs[k as DashTabKey].label.split(`\n`).length > 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}

                {/* {(k === 'journey' || k === 'maker' || k === 'report') && (
                  <span className="text-xs bg-slate-700 rounded-lg text-white px-2 py-0.5 leading-4 mb-0.5">
                    Maker
                  </span>
                )} */}
              </Link>
            );
          })}
      />

      {!justTabs && (
        <>
          <p className="mt-8 mb-2 text-sm text-neutral-500 leading-none">
            ACESSAR MAPA
          </p>
          <div className="flex gap-1 w-full">
            <Input
              type="text"
              placeholder="Código de acesso"
              className="focus:ring-0 ring-0 ring-offset-0 focus:ring-offset-0"
            />
            <Button className="w-1/6 h-10" size="icon" variant="secondary">
              <ArrowRightIcon className="w-4 h-4 text-neutral-800" />
            </Button>
          </div>
        </>
      )}

      <DashAsideNotifications user={user} justTabs={justTabs} />
    </aside>
  );
}

export function ProfileHeader({ data }: any) {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center">
        {!!data ? (
          <Avatar>
            {data?.user_metadata.avatar_url ? (
              <AvatarImage src={data?.user_metadata.avatar_url} alt="User" />
            ) : (
              <AvatarFallback>{data?.user_metadata.name[0]}</AvatarFallback>
            )}
          </Avatar>
        ) : (
          <div className="w-10 h-10">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        )}

        <div className="flex flex-col mx-2 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap w-full">
          {data?.user_metadata.full_name ? (
            <p className="text-slate-900 overflow-ellipsis overflow-hidden">
              {data?.user_metadata.full_name}
            </p>
          ) : (
            <Skeleton className="w-36 h-4 rounded-sm" />
          )}
          {data?.email ? (
            <p className="text-neutral-500 overflow-ellipsis overflow-hidden text-xs">
              {data?.email}
            </p>
          ) : (
            <Skeleton className="w-36 h-3 mt-1 rounded-sm" />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="p-1 h-6 w-6 rounded-full"
            >
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-40">
            <DropdownMenuItem
              onClick={() => {
                router.push('/u/' + data.id);
              }}
            >
              Ver perfil
              <UserIcon className="w-5 h-5 ml-4 stroke-[1.75]" />
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              Editar
              <Settings className="w-5 h-5 ml-2 stroke-[1.75]" />
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Sair
              <ArrowLeftFromLineIcon className="w-5 h-5 ml-2 stroke-[1.75]" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="mt-3 mb-8" />
    </>
  );
}
