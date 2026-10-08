import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Input } from '@/components/ui/primitives/Input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  BriefcaseIcon,
  GraduationCapIcon,
  PencilIcon,
  PlusCircleIcon,
  Settings2Icon,
  SettingsIcon,
  XIcon,
} from 'lucide-react';
import { ChallengeForm } from '@/components/web/dash/components/ChallengeForm';
import { useEffect, useMemo, useState } from 'react';
import { Separator } from '@/components/ui/primitives/Separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { createClass, createClassChallenges } from '@/services/dash/class';
import { TrashIcon } from '@radix-ui/react-icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/primitives/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import clsx from 'clsx';
import { editUser } from '@/services/dash/user';
import { useRouter } from 'next/router';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Deve possuir 2 caracteres no mínimo.',
  }),
  email: z.string().email(),
  about: z.string(),
});

const emptyFormat = {
  name: '',
  email: '',
  about: '',
};

export default function ProfileEditSheet({ userData, isOpen, setIsOpen }: any) {
  const router = useRouter();
  const [links, setLinks] = useState<string[]>([]);
  const [linkInputValue, setLinkInputValue] = useState('');

  useEffect(() => {
    if (userData?.links) {
      setLinks(userData.links);
    }
  }, [userData]);

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      if (!userData) {
        return emptyFormat;
      } else {
        return {
          name: userData.name,
          email: userData.email,
          about: userData?.about ?? '',
        };
      }
    }, [userData]),
  });

  function handleAddLink() {
    if (linkInputValue.trim() === '') return;

    setLinks((prev) => {
      const aux = [...prev];
      aux.push(linkInputValue);
      return aux;
    });

    setLinkInputValue('');
  }

  function removeLinkByIndex(idx: number) {
    setLinks((prev) => {
      const aux = [...prev];
      aux.splice(idx, 1);
      return aux;
    });
  }

  // function onSubmit(values: z.infer<typeof formSchema>, e: any) {
  //   e.preventDefault();

  //   const {
  //     text,
  //     has_hint,
  //     hint_description,
  //     alternative_A,
  //     alternative_B,
  //     alternative_C,
  //     alternative_D,
  //     correct_answer,
  //     title,
  //     ytb_link,
  //     description,
  //   } = values;

  //   const cId = uuidv4();

  //   const challengeFields = {
  //     id: cId,
  //     text,
  //     has_hint,
  //     hint_description,
  //     alternative_A,
  //     alternative_B,
  //     alternative_C,
  //     alternative_D,
  //     correct_answer,
  //   };

  //   // Default values
  //   const challengeFieldsDefault: any = { ...emptyFormat };
  //   challengeFieldsDefault.id = cId;

  //   if (!_.isEqual(challengeFields, challengeFieldsDefault)) {
  //     console.log(
  //       '🚀 ~ onSubmit ~ challengeFieldsDefault:',
  //       challengeFieldsDefault
  //     );
  //     console.log('🚀 ~ onSubmit ~ challengeFields:', challengeFields);
  //     setAlternatives((prev) => {
  //       const aux = [...prev];
  //       aux.push(challengeFields);
  //       return aux;
  //     });

  //     form.resetField('text');
  //     form.resetField('has_hint');
  //     form.resetField('hint_description');
  //     form.resetField('alternative_A');
  //     form.resetField('alternative_B');
  //     form.resetField('alternative_C');
  //     form.resetField('alternative_D');
  //     form.resetField('correct_answer');
  //   }
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (userData?.id) {
      const fData = {
        ...values,
        links: links,
      };

      const res = await editUser(userData.id, fData);

      if (!res.error) {
        router.reload();
      }
    }
  }

  return (
    <Sheet
      key="edit-profile-sheet"
      open={isOpen}
      onOpenChange={(val) => {
        if (!val) {
          // setDefaultData(emptyFormat);
          form.reset();
        }
        setIsOpen(val);
      }}
    >
      <SheetTrigger asChild>
        <Button size="sm" className="h-7 gap-1 z-20" variant={'secondary'}>
          <SettingsIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Editar
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-lg w-full overflow-y-scroll bg-transparent p-3 pl-0 overflow-hidden gap-0 flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="sm:max-w-lg w-full bg-transparent overflow-hidden gap-0 flex flex-col shrink h-full"
          >
            <div className="bg-white shrink rounded-t-lg shadow-lg overflow-y-scroll overflow-hidden flex-1 scrollbar">
              <SheetHeader className="p-6 pr-5 items-start">
                <SheetTitle className="leading-none text-slate-700">
                  Editar perfil
                </SheetTitle>
                <SheetDescription className="leading-1">
                  Preencha os campos abaixo para adicionar uma nova vídeo-aula.
                </SheetDescription>
              </SheetHeader>
              <Separator />

              <div className="grid gap-6 py-4 px-6 pr-3.5">
                <div className="relative w-full mb-3">
                  <Avatar className="w-16 h-16">
                    {userData?.avatar_url ? (
                      <AvatarImage src={userData.avatar_url} alt="User" />
                    ) : (
                      <AvatarFallback>
                        {userData?.name ? userData?.name[0] : ''}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-slate-950 flex items-center gap-1 bg-white border border-accent shadow-md px-2 py-1 rounded-full text-xs absolute -bottom-3.5 left-6">
                    <Image
                      src={'/google-icon.svg'}
                      alt="Google"
                      width={16}
                      height={16}
                    />
                    Conta Google
                  </span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl defaultValue={userData?.name}>
                          <Input {...field} />
                        </FormControl>
                        {/* <FormDescription>Este será seu nome de usuário</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl defaultValue={userData?.email}>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobre mim</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Digite algo sobre você..."
                            className="min-h-24"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-1">
                    <Label>Links</Label>
                    <div className="items-center gap-2 grid grid-cols-3">
                      {links?.map((link, linkIdx) => (
                        <>
                          <Input
                            value={link}
                            key={link}
                            className="col-span-2"
                            disabled
                          />
                          <Button
                            type="button"
                            className="text-neutral-500"
                            size={'icon'}
                            variant={'ghost'}
                            onClick={() => removeLinkByIndex(linkIdx)}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </>
                      ))}
                    </div>
                    <div className="items-center gap-2 grid grid-cols-3 pt-1">
                      <Input
                        placeholder={'https://'}
                        className="col-span-2"
                        onChange={(e) => setLinkInputValue(e.target.value)}
                        value={linkInputValue}
                      />
                      <Button
                        type="button"
                        className="h-10"
                        variant={'secondary'}
                        onClick={handleAddLink}
                      >
                        Adicionar link
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />

                <h1 className="font-semibold">Tipo da conta</h1>
                <div className="flex flex-col gap-3">
                  <RoleCheckbox
                    title="Perfil de aluno"
                    subtitle="Participe de experiências gamificadas e avalie seu desempenho enquanto
          aprende"
                    icon={
                      <GraduationCapIcon className="w-10 h-10 stroke-[1.5] text-zinc-500" />
                    }
                    checked
                  />

                  <RoleCheckbox
                    title="Perfil de professor"
                    subtitle=" Disponibilize sequências didáticas personalizadas,
                        avalie o desempenho de alunos cadastrados e analise
                        resultados estatísticos"
                    icon={
                      <BriefcaseIcon className="w-9 h-9 stroke-[1.5] text-zinc-500" />
                    }
                  />
                </div>

                {/* <Separator /> */}

                {/* <h1 className="font-semibold">Senha</h1>
                <div className="space-y-3">
                  <Input
                    placeholder="Senha"
                    type="password"
                    value="aicaliknha"
                    disabled
                  />
                  <Button variant={'secondary'}>Alterar senha</Button>
                </div> */}
              </div>
            </div>
            <SheetFooter className="rounded-b-lg w-full sticky bottom-0 right-0 bg-transparent z-10 shadow-lg bg-white">
              <div className="w-full">
                <Separator />
                <div className="w-full flex items-center px-6 py-3 gap-1">
                  <Button
                    variant="ghost"
                    className="px-2 mr-0 ml-auto"
                    onClick={() => {
                      // setDefaultData(emptyFormat);
                      form.reset();
                      setIsOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function RoleCheckbox({ title, subtitle, icon, checked = false }: any) {
  return (
    <Card
      className={`col-span-1 shadow-none transition-all cursor-pointer overflow-hidden group ${
        checked ? 'border-zinc-500' : 'hover:border-zinc-500'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pt-4">
        {icon}

        <div className="w-3/4">
          <h1 className="font-semibold text-zinc-900">{title}</h1>
          <p className="text-zinc-500 mt-0.5 leading-5 w-full">{subtitle}</p>
        </div>

        <Checkbox
          checked={checked}
          className={
            checked
              ? ''
              : 'border-zinc-300 group-hover:border-zinc-500 transition-all'
          }
        />
      </CardHeader>
    </Card>
  );
}
