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
import { PencilIcon, PlusCircleIcon } from 'lucide-react';
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
import { PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Deve possuir 2 caracteres no mínimo.',
  }),
  ytb_link: z.string(),
  description: z.string(),

  text: z.string(),
  has_hint: z.boolean(),
  hint_description: z.string(),
  alternative_A: z.string(),
  alternative_B: z.string(),
  alternative_C: z.string(),
  alternative_D: z.string(),
  correct_answer: z.string().min(1),
});

const emptyFormat = {
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

interface ChallengeFields {
  id: string;
  text: string;
  has_hint: boolean;
  hint_description: string;
  alternative_A: string;
  alternative_B: string;
  alternative_C: string;
  alternative_D: string;
  correct_answer: string;
}

export default function NewClassSheet({
  levelId,
  isOpen,
  setIsOpen,
  defaultData,
  setDefaultData,
}: any) {
  const [isChallengeFormActive, setIsChallengeFormActive] = useState<
    null | boolean
  >(null);
  const [alternatives, setAlternatives] = useState<ChallengeFields[]>([]);

  // const [defaultValues, setDefaultValues] = useState({
  //   title: '',
  //   ytb_link: '',
  //   description: '',
  //   text: '',
  //   has_hint: false,
  //   hint_description: '',
  //   alternative_A: '',
  //   alternative_B: '',
  //   alternative_C: '',
  //   alternative_D: '',
  //   correct_answer: '',
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      if (!defaultData) {
        console.log('🚀 ~ defaultValues:useMemo ~ emptyFormat:', emptyFormat);
        return emptyFormat;
      } else {
        return defaultData;
      }
    }, [defaultData]),
  });

  function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();

    const {
      text,
      has_hint,
      hint_description,
      alternative_A,
      alternative_B,
      alternative_C,
      alternative_D,
      correct_answer,
      title,
      ytb_link,
      description,
    } = values;

    const cId = uuidv4();

    const challengeFields = {
      id: cId,
      text,
      has_hint,
      hint_description,
      alternative_A,
      alternative_B,
      alternative_C,
      alternative_D,
      correct_answer,
    };

    // Default values
    const challengeFieldsDefault: any = { ...emptyFormat };
    challengeFieldsDefault.id = cId;

    if (!_.isEqual(challengeFields, challengeFieldsDefault)) {
      console.log(
        '🚀 ~ onSubmit ~ challengeFieldsDefault:',
        challengeFieldsDefault
      );
      console.log('🚀 ~ onSubmit ~ challengeFields:', challengeFields);
      setAlternatives((prev) => {
        const aux = [...prev];
        aux.push(challengeFields);
        return aux;
      });

      form.resetField('text');
      form.resetField('has_hint');
      form.resetField('hint_description');
      form.resetField('alternative_A');
      form.resetField('alternative_B');
      form.resetField('alternative_C');
      form.resetField('alternative_D');
      form.resetField('correct_answer');
    }
  }

  function handleNewChallenge() {
    setIsChallengeFormActive((prev: boolean | null) => !prev);
  }

  async function handleSaveClass() {
    const { ytb_link, description, title } = form.getValues();

    if (!levelId) return;

    const crtRes = await createClass({
      ytb_link,
      description,
      title,
      level_id: levelId,
    });

    if (!crtRes.error) {
      const formattedAlternatives = alternatives.map(
        ({
          text,
          has_hint,
          hint_description,
          alternative_A,
          alternative_B,
          alternative_C,
          alternative_D,
          correct_answer,
        }) => ({
          text,
          has_hint,
          hint_description,
          correct_answer,
          alternatives: [
            alternative_A,
            alternative_B,
            alternative_C,
            alternative_D,
          ],
          class_id: crtRes.data[0].id,
        })
      );

      await createClassChallenges(formattedAlternatives);
    }
  }

  return (
    <Sheet
      key="new-class-sheet"
      open={isOpen}
      onOpenChange={(val) => {
        if (!val) {
          setDefaultData(null);
          form.reset();
        }
        setIsOpen(val);
      }}
    >
      <SheetTrigger asChild>
        {/* <Button size="sm" className="h-7 gap-1 z-20">
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar
          </span>
        </Button> */}
        <button className="w-full h-full text-sm flex flex-col items-center bg-gray-100 hover:scale-2 text-neutral-500 hover:text-slate-900 justify-center gap-1 border border-zinc-300 rounded-lg hover:ring-2 ring-slate-800 ring-offset-2 transition-all">
          <PlusCircledIcon className="h-5 w-5" />
          Adicionar
        </button>
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
                  Cadastro de video-aula
                </SheetTitle>
                <SheetDescription className="leading-1">
                  Preencha os campos abaixo para adicionar uma nova vídeo-aula.
                </SheetDescription>
              </SheetHeader>
              <Separator />

              <div className="grid gap-6 py-4 px-6 pr-3.5">
                <div className="grid grid-cols-2 gap-6">
                  {/* <div className="space-y-2"> */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Aula</FormLabel>
                        <FormControl defaultValue={defaultData?.title}>
                          <Input
                            placeholder="Digite o título da aula"
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription>Este será seu nome de usuário</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ytb_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link do Vídeo</FormLabel>
                        <FormControl defaultValue={defaultData?.ytb_link}>
                          <Input
                            placeholder="Cole o link do vídeo"
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription>Este será seu nome de usuário</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2 mb-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl defaultValue={defaultData?.description}>
                          <Textarea
                            {...field}
                            className="min-h-[100px]"
                            placeholder="Digite uma breve descrição, dê instruções e forneça informações sobre o conteúdo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-slate-700">
                      Desafios
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Os desafios serão apresentados sequencialmente ao jogador
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="h-7 gap-1"
                    onClick={() => handleNewChallenge()}
                    disabled={!!isChallengeFormActive}
                  >
                    <PlusCircleIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Adicionar desafio
                    </span>
                  </Button>
                </div>

                {!!isChallengeFormActive && (
                  <div className="space-y-4">
                    <ChallengeForm
                      handleDelete={() => setIsChallengeFormActive(null)}
                      form={form}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <Accordion collapsible type="single">
                    {alternatives.map((c) => (
                      <ChallengeRow data={c} key={c.id} />
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
            <SheetFooter className="rounded-b-lg w-full sticky bottom-0 right-0 bg-transparent z-10 shadow-lg bg-white">
              <div className="w-full">
                <Separator />
                <div className="w-full flex items-center px-6 py-3 gap-1">
                  {defaultData && (
                    <Button
                      variant="ghost"
                      className="text-red-400 hover:text-red-500 hover:bg-red-50 transition-all ml-0 mr-auto gap-1 flex items-center px-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Excluir aula</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="px-2 mr-0 ml-auto"
                    onClick={() => {
                      setDefaultData(null);
                      form.reset();
                      setIsOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleSaveClass}>
                    Salvar
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function ChallengeRow({ data, ...props }: any) {
  return (
    <AccordionItem {...props} value={data.id}>
      <AccordionTrigger className="gap-1">
        <span className="text-left font-normal">{data.text}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {['A', 'B', 'C', 'D'].map((alt) => {
            return (
              <div className="flex items-center gap-2">
                <Checkbox disabled checked={alt === data.correct_answer} />
                <span>{data[`alternative_${alt}`]}</span>
              </div>
            );
          })}
        </div>

        {data.has_hint && <p className="mt-4">Dica: {data.hint_description}</p>}

        <div className="flex items-center gap-1 justify-end mt-3">
          <Button
            size="sm"
            variant="outline"
            className="text-slate-700"
            type="button"
          >
            <PencilIcon className="w-4 h-4 mr-1 text-slate-500" />
            Editar
          </Button>
          <Button size="sm" variant="destructive" type="button">
            Excluir
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
