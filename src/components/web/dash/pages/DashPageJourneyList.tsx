import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Separator } from '@/components/ui/primitives/Separator';
import { createLevel, getLevels } from '@/services/dash/journey';
import { format } from 'date-fns';
import { JourneyCreatorCard } from '@/components/web/dash/components/JourneyCreatorCard';
import { getLevelByAuthorId } from '@/services/dash/level';
import { useRecoilValue } from 'recoil';
import { userSessionAtom } from '@/atoms/web/userSessionAtom';
import type { UntypedRowList } from '@/types/dbRows';

export function DashPageJourneyList() {
  const router = useRouter();
  const userSession = useRecoilValue(userSessionAtom);

  const [journeyList, setJourneyList] = useState<
    UntypedRowList | null | undefined
  >([]);

  useEffect(() => {
    const session = userSession?.data.session;
    if (!session) return;

    async function fetchLevels(authorId: string) {
      const data = await getLevelByAuthorId(authorId);
      if (!data.error) setJourneyList(data.data);
    }

    fetchLevels(session.user.id);
  }, []);

  function handleSelectJourney(jl: any) {
    router.push('/dash/journey/' + jl.id);
  }

  // LISTAGEM DE SEQUENCIAS DIDATICAS
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl w-full mx-auto">
      <Card
        className="overflow-hidden cursor-pointer transition-all min-h-60"
        onClick={async () => {
          // setAwaitMessageCreatingLevel('Configurando...');
          const { error, data } = await createLevel();
          if (!error && !!data) {
            // setAwaitMessageCreatingLevel('Redirecionando...');
            handleSelectJourney(data[0]);
          }
        }}
      >
        <CardContent className="flex h-full flex-col items-center justify-center p-3 gap-2 text-gray-500 bg-zinc-100 hover:text-gray-700 transition-all">
          <PlusCircleIcon />
          <p className="w-full text-center text-sm font-medium">Criar novo</p>
        </CardContent>
      </Card>

      {journeyList &&
        journeyList.map((jl) => {
          return (
            <JourneyCreatorCard
              key={jl.id}
              data={jl}
              onClick={() => handleSelectJourney(jl)}
            />
          );
        })}
    </div>
  );
}
