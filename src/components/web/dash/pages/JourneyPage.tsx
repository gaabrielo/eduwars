import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { AddUserPopover } from '@/components/web/dash/components/AddUserPopover';
import { AlertCard } from '@/components/web/dash/components/AlertCard';
import NewClassSheet from '@/components/web/dash/components/NewClassSheet';
import { JourneySettings } from '@/components/web/dash/pages/JourneySettings';
import { Button } from '@/components/ui/primitives/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/primitives/Dropdown';
import { Input } from '@/components/ui/primitives/Input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/primitives/tabs';
import { getLevel } from '@/services/dash/journey';
import { format } from 'date-fns';
import { ArrowUpRightIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteUserFromLeveById } from '@/services/dash/level';
import { YoutubeThumbnail } from '@/components/web/dash/components/YoutubeThumbnail';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { LevelClassForm } from '@/components/web/dash/components/LevelClassForm';

const emptyClassFormFormat = {
  id: null,
  title: '',
  ytb_link: '',
  description: '',
  text: '',
  has_hint: false,
  hint_description: '',
  alternative_A: '',
  alternative_B: '',
  alternative_C: '',
  alternative_D: '',
  correct_answer: '',
};

const alternativeKeys = [
  'alternative_A',
  'alternative_B',
  'alternative_C',
  'alternative_D',
];

function formatClassChallenge(cl: any) {
  const res = cl.map(
    ({
      text,
      has_hint,
      hint_description,
      alternatives,
      correct_answer,
      class_id,
      id,
    }: any) => {
      const formattedAlternatives = JSON.parse(alternatives).reduce(
        (acc: Record<string, string>, altText: string, altId: number) => {
          acc[alternativeKeys[altId]] = altText;
          return acc;
        },
        {}
      );

      return {
        text,
        has_hint,
        hint_description,
        ...formattedAlternatives,
        correct_answer,
        class_id,
        id,
      };
    }
  );

  return res;
}

function formatClassFields({
  title,
  ytb_link,
  description,
  id,
  class_challenge,
}: any) {
  return {
    id,
    title,
    ytb_link,
    description,
    text: '',
    has_hint: false,
    hint_description: '',
    alternative_A: '',
    alternative_B: '',
    alternative_C: '',
    alternative_D: '',
    correct_answer: '',
    class_challenge,
    alternatives: formatClassChallenge(class_challenge),
  };
}

export function JourneyPage({ levelId }: any) {
  const router = useRouter();
  console.log('🚀 ~ JourneyPage ~ router:', router);

  const [selectedJourney, setSelectedJourney] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [selectedClass, setSelectedClass] = useState(emptyClassFormFormat);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);

  async function fetchLevel() {
    const jData = await getLevel(levelId);
    if (!jData.error && jData.data && jData.data.length) {
      setSelectedJourney(jData.data[0]);

      const firstLevelItem = jData.data[0];
      if (firstLevelItem.class.length) {
        setSelectedClass(formatClassFields(firstLevelItem.class[0]));
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (levelId) {
      fetchLevel();
    }
  }, [levelId]);

  function handleSelectClass(classDt: any) {
    if (classDt) {
      setSelectedClass(formatClassFields(classDt));
    }
  }

  function handleEditClass() {
    setIsNewClassModalOpen(true);
  }

  async function handleRemoveParticipantFromLevel(uid: string) {
    const res = await deleteUserFromLeveById(levelId, uid);
    router.reload();
  }

  function getCurrentSelectClassId() {
    if (selectedJourney && selectedClass) {
      const cid = selectedJourney.class.findIndex(
        (c: any) => c.id === selectedClass?.id
      );
      return cid + 1;
    }

    return 0;
  }

  if (isLoading) return <p>Carregando...</p>;

  if (!isLoading && !selectedJourney) {
    return (
      <AlertCard
        title={'Não encontramos o que você buscava'}
        subtitle={
          'O conteúdo foi removido ou pode não estar disponível no momento.'
        }
      />
    );
  }

  return (
    <Tabs defaultValue="videos">
      <TabsList className="flex">
        <TabsTrigger value="videos" className="flex-1">
          Material didático
        </TabsTrigger>
        <TabsTrigger value="students" className="flex-1">
          Alunos
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex-1">
          Configurações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="videos">
        <Card>
          <CardContent className="pt-6">
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-[90%] mx-auto"
            >
              <CarouselContent className="p-1">
                <CarouselItem
                  key="add_button"
                  className="basis-2/3 sm:basis-1/2 md:basis-[30%] lg:basis-[22%]"
                >
                  {/* <NewClassSheet
                      levelId={router.query.levelId}
                      isOpen={isNewClassModalOpen}
                      setIsOpen={setIsNewClassModalOpen}
                      defaultData={selectedClass}
                      setDefaultData={setSelectedClass}
                    /> */}
                  <button
                    onClick={() => setSelectedClass(emptyClassFormFormat)}
                    className={`w-full min-h-20 h-full text-sm flex flex-col items-center bg-gray-100 hover:scale-2 text-neutral-500 hover:text-slate-900 justify-center gap-1 border border-zinc-300 rounded-lg hover:ring-2 ring-slate-800 ring-offset-2 transition-all ${
                      selectedClass.id === null && 'ring-2'
                    }`}
                  >
                    <PlusCircledIcon className="h-5 w-5" />
                    Adicionar
                  </button>
                </CarouselItem>
                {selectedJourney?.class.map((cl: any, key: number) => {
                  return (
                    <CarouselItem
                      key={cl.id}
                      className="basis-2/3 sm:basis-1/2 md:basis-[30%] lg:basis-[22%]"
                    >
                      <YoutubeThumbnail
                        src={cl.ytb_link}
                        alt={cl.title}
                        className={`rounded-lg w-full ring-slate-800 ring-offset-2 hover:ring-2 cursor-pointer transition-all ${
                          selectedClass?.id === cl.id && 'ring-2'
                        }`}
                        onClick={() => handleSelectClass(cl)}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="pt-6">
              {!!router.query?.levelId && (
                <LevelClassForm
                  id={getCurrentSelectClassId}
                  levelId={router.query.levelId}
                  defaultData={selectedClass}
                  // setDefaultData={setSelectedClass}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="students">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="w-fit">
              <CardTitle>Alunos</CardTitle>
              <CardDescription className="mt-1.5">
                {selectedJourney.level_participants?.length ?? 0} alunos
                cadastrados
              </CardDescription>
            </div>

            <AddUserPopover levelId={levelId} />
          </CardHeader>
          <CardContent className="pl-6 mt-2">
            <Input placeholder="Buscar aluno..." className="mb-2 max-w-[50%]" />

            <Card className="overflow-hidden shadow-none">
              <table className="w-full table-auto">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-left font-medium text-sm">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-sm">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-sm">
                      Data de matrícula
                    </th>
                    <th className="px-4 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedJourney?.level_participants?.map((u: any) => (
                    <tr key={u.id}>
                      <td className="pl-4 py-3 w-fit">
                        <Avatar>
                          {u.users.avatar_url ? (
                            <AvatarImage
                              src={u.users.avatar_url}
                              alt={u.users.name}
                            />
                          ) : (
                            <AvatarFallback>{u.users.name[0]}</AvatarFallback>
                          )}
                        </Avatar>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {u.users.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {u.users.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(u.created_at), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="rounded-full"
                              size="icon"
                              variant="ghost"
                            >
                              <EllipsisIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRemoveParticipantFromLevel(u.user_id)
                              }
                            >
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <JourneySettings data={selectedJourney} />
      </TabsContent>
    </Tabs>
  );
}

function ClassRow({ id, data, handleEdit, ...props }: any) {
  return (
    <div className="text-sm relative pl-2" {...props}>
      <div className="aspect-square w-3 bg-green-500 rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50" />

      <button
        className="text-left grid gap-4 mb-4 group"
        onClick={() => handleEdit(data)}
      >
        <header className="flex flex-col">
          <p className="font-medium text-gray-900">Aula {id + 1}</p>
          <p className="text-base group-hover:underline transition-all text-gray-500 group-hover:text-gray-900">
            {data.title}
          </p>
        </header>

        <div className="text-gray-500 group-hover:text-gray-900 transition-all dark:text-gray-400">
          {data.description}
        </div>
      </button>

      <div className="flex gap-1 text-gray-500">
        <span className="px-3 py-0.5 rounded-full border border-gray-300 text-xs leading-0 bg-gray-100">
          {data.class_challenge.length} desafios
        </span>

        {/* <span className="px-3 py-0.5 rounded-full border border-gray-300 text-xs leading-0 flex items-center gap-1  bg-gray-100">
          <span>45 min</span>
          <ClockIcon className="w-3 h-3" />
        </span> */}

        {data?.ytb_link && (
          <a href={data.ytb_link} target="_blank" className="max-w-[60%]">
            <span className="px-3 py-0.5 rounded-full border border-gray-300 text-xs leading-0 flex items-center gap-1 hover:text-gray-900 transition-all hover:bg-gray-100 overflow-hidden overflow-ellipsis whitespace-nowrap">
              <span className="overflow-hidden overflow-ellipsis">
                {data.ytb_link}
              </span>
              <ArrowUpRightIcon className="w-4 h-4" />
            </span>
          </a>
        )}

        <button className="rounded-full" onClick={() => handleEdit(data)}>
          <span className="px-3 py-0.5 rounded-full border border-gray-300 text-xs leading-0 flex items-center gap-1 hover:text-gray-900 transition-all cursor-pointer hover:bg-gray-100">
            Editar <ArrowUpRightIcon className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

function EllipsisIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-ellipsis h-4 w-4"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
