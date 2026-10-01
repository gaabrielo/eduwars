// Static explanation catalog for the Knowledge Diary. Ids must stay in sync with
// the `concepts` arrays declared on each question in `pythonCourse.ts`.
// Explanations are short summaries derived from the existing lesson content.

export interface DiaryConcept {
  id: string;
  label: string;
  explanation: string;
}

export const DIARY_CONCEPTS: Record<string, DiaryConcept> = {
  programacao: {
    id: 'programacao',
    label: 'Programação',
    explanation:
      'Programação é a criação de instruções para um computador executar, com o objetivo de resolver problemas ou realizar tarefas.',
  },
  algoritmos: {
    id: 'algoritmos',
    label: 'Algoritmos',
    explanation:
      'Um algoritmo é uma sequência de passos organizados para resolver um problema; a ordem dos passos pode definir o resultado.',
  },
  'logica-programacao': {
    id: 'logica-programacao',
    label: 'Lógica de programação',
    explanation:
      'Lógica de programação ajuda a organizar o raciocínio para criar algoritmos e programas de forma estruturada.',
  },
  'linguagens-programacao': {
    id: 'linguagens-programacao',
    label: 'Linguagens de programação',
    explanation:
      'Uma linguagem de programação é um conjunto de regras para escrever instruções que o computador consegue executar.',
  },
  'ecossistema-python': {
    id: 'ecossistema-python',
    label: 'Python e seu ecossistema',
    explanation:
      'Python é uma linguagem de propósito geral, de código aberto e com sintaxe simples, criada por Guido van Rossum.',
  },
  'arquivos-python': {
    id: 'arquivos-python',
    label: 'Arquivos e extensões',
    explanation:
      'Arquivos Python normalmente usam a extensão .py e podem conter scripts, sites e programas completos.',
  },
  'instalacao-python': {
    id: 'instalacao-python',
    label: 'Instalação do Python',
    explanation:
      'O Python 3 deve ser baixado de uma fonte oficial, como python.org, e no Windows a opção Add Python to PATH permite chamá-lo pelo terminal.',
  },
  'interpretador-idle': {
    id: 'interpretador-idle',
    label: 'Interpretador e IDLE',
    explanation:
      'O interpretador interativo, com prompt >>>, permite testar comandos e ver resultados imediatamente; o IDLE é o ambiente que acompanha o Python.',
  },
  'comandos-basicos': {
    id: 'comandos-basicos',
    label: 'Primeiros comandos',
    explanation:
      'O print exibe mensagens na tela e o comentário de uma linha começa com #.',
  },
  'variaveis-tipos': {
    id: 'variaveis-tipos',
    label: 'Variáveis e tipos',
    explanation:
      'Variáveis guardam valores com atribuições como idade = 5; textos usam aspas e input() retorna um texto por padrão.',
  },
  'operadores-aritmeticos': {
    id: 'operadores-aritmeticos',
    label: 'Operadores aritméticos',
    explanation:
      'Operadores como + e // combinam ou dividem valores; // é a divisão inteira e 2 + 3 resulta em 5.',
  },
  'funcoes-print-input-type': {
    id: 'funcoes-print-input-type',
    label: 'Funções input, print e type',
    explanation:
      'input() recebe um dado digitado pelo usuário, print() exibe valores em sequência e type() revela o tipo de um valor.',
  },
};

export function getDiaryConcept(conceptId: string): DiaryConcept | undefined {
  return DIARY_CONCEPTS[conceptId];
}

export function getDiaryConceptLabel(conceptId: string): string {
  return DIARY_CONCEPTS[conceptId]?.label ?? conceptId;
}
