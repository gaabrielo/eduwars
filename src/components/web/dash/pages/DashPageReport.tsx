import { userSessionAtom } from '@/atoms/web/userSessionAtom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import { getRecentUsersSignedToAuthorLevels } from '@/services/dash/level';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import type { UntypedRowList } from '@/types/dbRows';

export function DashPageReport() {
  const router = useRouter();

  const userSession = useRecoilValue(userSessionAtom);
  const [recentSignedUsers, setRecentSignedUsers] = useState<
    UntypedRowList | null | undefined
  >();

  useEffect(() => {
    const session = userSession?.data.session;
    if (!session) return;

    async function fetchRecentSignerUsers(userId: string) {
      const data = await getRecentUsersSignedToAuthorLevels(userId);
      if (!data.error) setRecentSignedUsers(data.data);
    }

    fetchRecentSignerUsers(session.user.id);
  }, [userSession]);

  return (
    <div className="flex flex-col gap-4">
      {/* <Card className="h-fit">
        <CardHeader>
          <CardTitle>Últimos acessos</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card> */}

      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <Card className="col-span-1 row-span-2">
          <CardHeader>
            <CardTitle>Novos alunos</CardTitle>
            <CardDescription>
              Alunos que se cadastraram recentemente em alguma de suas
              sequências didáticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="overflow-hidden shadow-none">
              <table className="w-full table-fixed">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-center font-medium text-sm">
                      Aluno
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm">
                      Seq. didática
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm">
                      Data de matrícula
                    </th>
                    {/* <th className="px-4 py-3 text-left"></th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentSignedUsers?.map((u: any) => (
                    <tr key={u.id} className="w-full">
                      <td className="w-full px-4 py-3 col-span-1">
                        <Avatar
                          className="mx-auto cursor-pointer ring-slate-800 ring-offset-2 hover:ring-2"
                          onClick={() => {
                            router.push('/u/' + u.user_id);
                          }}
                        >
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

                      <td className="px-4 py-3 text-sm text-slate-950 dark:text-gray-400 col-span-2 text-center">
                        <p>{u.level.name}</p>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 col-span-2 text-center">
                        {format(new Date(u.created_at), 'dd/MM/yyyy')}
                      </td>
                      {/* <td className="px-4 py-3">
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
                          <DropdownMenuItem>Remover</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividade</CardTitle>
            <CardDescription>
              Visualize novos cadastros e o desempenho semanal dos alunos
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Solicitações de acesso</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
