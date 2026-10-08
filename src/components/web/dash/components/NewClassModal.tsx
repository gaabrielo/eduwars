/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uMg2rOfurJN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from '@/components/ui/button';
// import {
//   DialogTrigger,
//   DialogTitle,
//   DialogDescription,
//   DialogHeader,
//   DialogFooter,
//   DialogContent,
//   Dialog,
// } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Switch } from '@/components/ui/switch';
import { CardContent, Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/primitives/Input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircleIcon, TrashIcon } from 'lucide-react';
import { ChallengeForm } from '@/components/web/dash/components/ChallengeForm';
import { useState } from 'react';
import { Separator } from '@/components/ui/primitives/Separator';

export default function NewClassModal() {
  const [newChallengeForm, setNewChallengeForm] = useState<boolean | null>(
    null
  );

  function handleNewChallenge() {
    setNewChallengeForm((prev) => !prev);
  }

  return (
    <Dialog key="1">
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 gap-1"
          // onClick={() => router.push(pathname + '/new-class')}
        >
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full
    scrollbar-thumb-neutral-200 hover:scrollbar-thumb-neutral-300 scrollbar-track-transparent"
      >
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Cadastro de video-aula</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar uma nova vídeo-aula.
            </DialogDescription>
          </DialogHeader>

          <Separator className="mt-6" />

          <div className="grid gap-6 py-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Aula</Label>
                <Input id="title" placeholder="Digite o título da aula" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-link">Link do Vídeo</Label>
                <Input id="video-link" placeholder="Cole o link do vídeo" />
              </div>
            </div>
            <div className="space-y-2 mb-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                className="min-h-[150px]"
                id="description"
                placeholder="Digite a descrição e instruções da aula"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Desafios</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Os desafios serão apresentados sequencialmente ao jogador
                </p>
              </div>

              <Button
                size="sm"
                className="h-7 gap-1"
                onClick={() => handleNewChallenge()}
                disabled={!!newChallengeForm}
              >
                <PlusCircleIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar desafio
                </span>
              </Button>
            </div>

            {!!newChallengeForm && (
              <div className="space-y-4">
                <ChallengeForm handleDelete={() => setNewChallengeForm(null)} />
              </div>
            )}

            <div className="space-y-4">
              {/* <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Desafios cadastrados</h3>
            </div> */}

              <Accordion collapsible type="single">
                <AccordionItem value="challenge-1">
                  <AccordionTrigger>
                    <div className="flex items-center justify-between">
                      <span>Qual é a capital do Brasil?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked />
                        <span>Brasília</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span>Rio de Janeiro</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span>São Paulo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span>Salvador</span>
                      </div>
                    </div>
                    <p>A capital do Brasil é uma cidade planejada.</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive">
                        Excluir
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="challenge-2">
                  <AccordionTrigger>
                    <div className="flex items-center justify-between">
                      <span>Qual é o maior oceano do mundo?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span>Atlântico</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked />
                        <span>Pacífico</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span>Índico</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span>Ártico</span>
                      </div>
                    </div>
                    <p>O Oceano Pacífico é o maior oceano do mundo.</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive">
                        Excluir
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-600 ml-0 mr-auto gap-1 flex items-center"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Excluir Aula</span>
            </Button>
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
