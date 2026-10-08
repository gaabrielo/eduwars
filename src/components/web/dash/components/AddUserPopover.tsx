'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Separator } from '@/components/ui/primitives/Separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/primitives/popover';
import { addUsersToLevel, getUsers } from '@/services/dash/journey';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { UntypedRowList } from '@/types/dbRows';

export function AddUserPopover({ levelId }: any) {
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState<UntypedRowList | null>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (searchText.trim() !== '') {
      fetchUsers();
    }
  }, [searchText]);

  async function fetchUsers() {
    const users = await getUsers(searchText);
    setUserList(users.data);

    // remove unlisted users from selected
    setSelectedUsers((prev) => {
      const filteredSelected = [...prev].filter((emailB) =>
        users.data!.some((itemA) => itemA.email === emailB)
      );

      return filteredSelected;
    });
  }

  async function handleAddUsers() {
    const usersToAddFormatted = selectedUsers.map((uEmail) => ({
      user_id: userList!.find((u) => u.email === uEmail).id,
      level_id: levelId,
    }));

    const res = await addUsersToLevel(usersToAddFormatted);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircledIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <div className="p-3">
          <h2 className="text-sm mb-1.5">Buscar alunos</h2>
          <Input
            placeholder="Email"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <ul>
          {userList!.length > 0 && <Separator />}
          {userList!
            // .filter((u) => !selectedUsers.includes(u.email))
            .map((u) => (
              <li className="w-full" key={u.id}>
                <button
                  className={clsx(
                    'py-2 px-3 hover:bg-gray-100 transition-all w-full text-left flex items-center',
                    selectedUsers.includes(u.email) ? 'bg-gray-100' : ''
                  )}
                  onClick={() =>
                    setSelectedUsers((prev) => {
                      const usrCopy = [...prev];

                      if (usrCopy.includes(u.email)) {
                        const copyFiltered = usrCopy.filter(
                          (usr) => usr !== u.email
                        );

                        return copyFiltered;
                      }

                      usrCopy.push(u.email);
                      return usrCopy;
                    })
                  }
                >
                  <Checkbox
                    className="mr-3"
                    checked={selectedUsers.includes(u.email)}
                  />
                  <span>{u.email}</span>
                </button>
                <Separator />
              </li>
            ))}
        </ul>

        {/* {userList.length == 0 && (
          <Separator />
        )}

        <h2 className="text-sm mb-1.5">Adicionados</h2>

        <ul>
          {selectedUsers.map((usrEmail, uKey) => (
            <li className="w-full" key={uKey}>
              <button
                className="py-2 px-2 hover:bg-gray-100 w-full text-left flex items-center"
                onClick={() =>
                  setSelectedUsers((prev) => {
                    const rmv = prev.findIndex(usrEmail);
                    prev.slice(rmv, 1);
                    return prev;
                  })
                }
              >
                <Checkbox className="mr-2" checked={true} />
                <span>{usrEmail}</span>
              </button>
              <Separator />
            </li>
          ))}
        </ul> */}

        {userList!.length == 0 && <Separator />}
        <footer className="p-3">
          <Button
            className="w-full"
            size={'sm'}
            disabled={selectedUsers.length === 0}
            onClick={handleAddUsers}
          >
            {selectedUsers.length > 0
              ? `Adicionar (${selectedUsers.length})`
              : 'Selecione para adicionar'}
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
