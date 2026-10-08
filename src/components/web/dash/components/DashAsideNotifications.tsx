import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/primitives/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { getLevelsThatUserIsSigned } from '@/services/dash/level';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { CalendarDaysIcon, EyeIcon, Gamepad2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UntypedRowList } from '@/types/dbRows';

const MAX_NOTIFICATIONS = 3;

export function DashAsideNotifications({ user, justTabs }: any) {
  const [levelInclusionLogList, setLevelInclusionLogList] = useState<
    UntypedRowList | null | undefined
  >();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    const fetchData = async () => {
      const res = await getLevelsThatUserIsSigned(user.id);
      if (!res.error) {
        setLevelInclusionLogList(res.data);
      }
    };

    fetchData();
    setIsLoading(false);
  }, [user]);

  return (
    <>
      <div className="flex items-center mt-8 mb-2 gap-1">
        <p className="text-sm text-neutral-500 leading-none">NOTIFICAÇÕES</p>
        {!isLoading && levelInclusionLogList && (
          <span className="text-xs bg-slate-700 rounded-md text-white px-2 leading-4 mb-0.5">
            {levelInclusionLogList?.length}
          </span>
        )}
      </div>
      {!justTabs && (
        <>
          {isLoading ? (
            <Card className="shadow-none">
              <CardContent className="py-3 px-3 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-3/4 h-3 rounded-sm" />
                    <Skeleton className="w-3/4 h-3 rounded-sm mt-1" />
                  </div>
                </div>

                <Skeleton className="w-1/4 h-5 mr-0 ml-auto" />
              </CardContent>
            </Card>
          ) : (
            <ul className="flex flex-col gap-2">
              {levelInclusionLogList &&
                levelInclusionLogList.length > 0 &&
                levelInclusionLogList
                  .slice(0, MAX_NOTIFICATIONS)
                  .map((lvl) => (
                    <li>
                      <Card className="shadow-none hover:border-zinc-500 hover:cursor-pointer transition-all">
                        <CardContent className="py-3 px-3 flex flex-col gap-1">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 flex-shrink rounded-full flex items-center justify-center bg-accent">
                              <Gamepad2Icon className="w-5 h-5" />
                            </div>

                            <div className="text-sm">
                              <p className="leading-4 text-neutral-500">
                                Você foi adicionado ao mapa:
                              </p>
                              <p className="text-slate-700">{lvl.level.name}</p>
                            </div>
                          </div>

                          <p className="text-sm text-neutral-500 flex gap-1 w-full justify-end items-center">
                            <CalendarIcon className="mb-0.5" />
                            {format(new Date(lvl.created_at), 'dd/MM/yy')}
                          </p>
                        </CardContent>
                        {/* <CardFooter className="p-3 pt-0 text-sm text-zinc-500"></CardFooter> */}
                      </Card>
                    </li>
                  ))}
            </ul>
          )}
        </>
      )}

      {((levelInclusionLogList &&
        levelInclusionLogList.length > MAX_NOTIFICATIONS) ||
        justTabs) && (
        <Button
          className={`w-fit mx-auto mt-2 font-normal ${justTabs && 'w-full'}`}
          variant={'secondary'}
        >
          <EyeIcon className="mr-1 w-4 h-4" />
          {justTabs ? 'Ver notificações' : 'Ver mais'}
        </Button>
      )}

      {!isLoading && levelInclusionLogList?.length === 0 && (
        <span className="text-sm text-neutral-500/60 w-full text-center">
          Nada para ver ainda
        </span>
      )}
    </>
  );
}
