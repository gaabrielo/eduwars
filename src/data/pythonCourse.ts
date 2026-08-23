export interface PythonQuestion {
  question: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
}

export interface PythonLesson {
  day: number;
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  questions: PythonQuestion[];
}

export const PYTHON_COURSE: PythonLesson[] = [
  {
    day: 1,
    id: 'python-introducao-programacao',
    title: 'Introdução ao mundo da programação',
    youtubeId: 'S9uPNppGsGo',
    youtubeUrl: 'https://www.youtube.com/watch?v=S9uPNppGsGo&list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6',
    questions: [
      { question: 'O que é programação?', options: ['A montagem de peças de um computador', 'A criação de instruções para um computador executar', 'A instalação de jogos', 'A troca de componentes de hardware'], answerIndex: 1 },
      { question: 'Qual é o objetivo principal de um programa?', options: ['Resolver um problema ou realizar uma tarefa', 'Aumentar o tamanho do monitor', 'Substituir o sistema operacional', 'Desligar o computador automaticamente'], answerIndex: 0 },
      { question: 'O que é um algoritmo?', options: ['Uma linguagem de marcação', 'Um componente físico do computador', 'Uma sequência de passos para resolver um problema', 'Um tipo de memória'], answerIndex: 2 },
      { question: 'Uma receita de bolo pode ser considerada um algoritmo porque:', options: ['Possui passos organizados para chegar a um resultado', 'Funciona apenas em computadores', 'É sempre escrita em inglês', 'Não precisa de uma ordem definida'], answerIndex: 0 },
      { question: 'O que é uma linguagem de programação?', options: ['Um idioma falado somente por programadores', 'Um conjunto de regras para escrever instruções para o computador', 'Um programa que protege o computador', 'Um formato de imagem'], answerIndex: 1 },
      { question: 'Quem executa as instruções de um programa?', options: ['Somente o teclado', 'O computador, por meio de seus componentes e programas', 'A impressora', 'O cabo de energia'], answerIndex: 1 },
      { question: 'Por que a ordem dos passos é importante em um algoritmo?', options: ['Porque o resultado pode depender da sequência correta', 'Porque algoritmos só podem ter três passos', 'Porque o computador não possui memória', 'Porque todo algoritmo precisa ser desenhado'], answerIndex: 0 },
      { question: 'O que faz um programador?', options: ['Apenas conserta monitores', 'Escreve e organiza instruções para criar soluções', 'Fabrica processadores manualmente', 'Opera somente impressoras'], answerIndex: 1 },
      { question: 'Qual destes é um exemplo de programa?', options: ['Um editor de texto', 'Uma cadeira', 'Um cabo USB', 'Uma tomada'], answerIndex: 0 },
      { question: 'A lógica de programação ajuda o estudante a:', options: ['Organizar o raciocínio para criar algoritmos e programas', 'Aumentar a velocidade da internet', 'Trocar a placa de vídeo', 'Evitar qualquer tipo de erro automaticamente'], answerIndex: 0 },
    ],
  },
  {
    day: 2,
    id: 'python-para-que-serve',
    title: 'Para que serve o Python',
    youtubeId: 'Mp0vhMDI7fA',
    youtubeUrl: 'https://www.youtube.com/watch?v=Mp0vhMDI7fA&list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6&index=2',
    questions: [
      { question: 'Python é:', options: ['Uma linguagem de programação', 'Um sistema operacional', 'Um componente de hardware', 'Um editor de imagens'], answerIndex: 0 },
      { question: 'Quem criou a linguagem Python?', options: ['Bill Gates', 'Guido van Rossum', 'Dennis Ritchie', 'Ada Lovelace'], answerIndex: 1 },
      { question: 'Python é uma linguagem de propósito geral. Isso significa que:', options: ['Ela só pode criar calculadoras', 'Ela pode ser usada em diferentes tipos de aplicação', 'Ela funciona apenas em computadores antigos', 'Ela não possui bibliotecas'], answerIndex: 1 },
      { question: 'Qual é uma característica marcante do Python?', options: ['Sintaxe relativamente simples e legível', 'Obrigação de escrever todo código em maiúsculas', 'Uso exclusivo para jogos', 'Impossibilidade de criar funções'], answerIndex: 0 },
      { question: 'Qual destas áreas pode utilizar Python?', options: ['Automação e análise de dados', 'Somente edição de áudio', 'Apenas desenho no papel', 'Nenhuma área profissional'], answerIndex: 0 },
      { question: 'Python é um software de código aberto. Isso quer dizer que:', options: ['Seu uso é permitido apenas ao criador', 'Seu código-fonte pode ser estudado e a linguagem pode ser distribuída conforme sua licença', 'Ele não pode ser instalado', 'Ele só funciona sem internet'], answerIndex: 1 },
      { question: 'Qual é a extensão normalmente usada em arquivos Python?', options: ['.html', '.py', '.css', '.jpg'], answerIndex: 1 },
      { question: 'Python pode ser usado para desenvolver:', options: ['Sites, scripts e programas', 'Somente planilhas', 'Apenas drivers de impressora', 'Somente arquivos de texto'], answerIndex: 0 },
      { question: 'O nome Python foi inspirado:', options: ['Em uma marca de computador', 'No grupo de humor Monty Python', 'Em um tipo de processador', 'Em um sistema de arquivos'], answerIndex: 1 },
      { question: 'Uma vantagem de aprender Python no início da programação é:', options: ['A linguagem tem sintaxe acessível para estudar conceitos de programação', 'Ela dispensa todo estudo de lógica', 'Ela impede o uso de outras linguagens', 'Ela corrige qualquer programa sem execução'], answerIndex: 0 },
    ],
  },
  {
    day: 3,
    id: 'python-instalacao',
    title: 'Instalando o Python 3 e o IDLE',
    youtubeId: 'VuKvR1J2LQE',
    youtubeUrl: 'https://www.youtube.com/watch?v=VuKvR1J2LQE&list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6&index=3',
    questions: [
      { question: 'Qual site é a principal referência para baixar o Python?', options: ['python.org', 'python-download.invalid', 'onlypython.games', 'editor.com'], answerIndex: 0 },
      { question: 'Qual versão deve ser priorizada para iniciar o curso?', options: ['Python 1', 'Python 2', 'Python 3', 'Nenhuma versão'], answerIndex: 2 },
      { question: 'No Windows, por que marcar a opção Add Python to PATH?', options: ['Para permitir chamar o Python pelo terminal', 'Para aumentar a memória RAM', 'Para instalar um antivírus', 'Para criar uma conta no YouTube'], answerIndex: 0 },
      { question: 'O que é o IDLE?', options: ['Um ambiente de desenvolvimento que acompanha o Python', 'Um tipo de cabo de rede', 'Um sistema operacional', 'Um programa exclusivo para editar vídeos'], answerIndex: 0 },
      { question: 'O que aparece no interpretador interativo do Python?', options: ['O prompt >>>', 'Somente uma tela preta sem texto', 'O símbolo @@@', 'Uma planilha automaticamente'], answerIndex: 0 },
      { question: 'Como verificar a versão do Python pelo terminal?', options: ['python --version', 'python --delete', 'version python remove', 'check-python-image'], answerIndex: 0 },
      { question: 'O instalador do Python deve ser obtido:', options: ['De uma fonte oficial e confiável', 'De qualquer pop-up', 'Somente por mensagem anônima', 'Apenas de arquivos compactados desconhecidos'], answerIndex: 0 },
      { question: 'Depois da instalação, o Python pode ser aberto:', options: ['Pelo IDLE ou pelo terminal', 'Somente pela BIOS', 'Apenas desligando o computador', 'Somente pelo navegador'], answerIndex: 0 },
      { question: 'O interpretador interativo permite:', options: ['Testar comandos e observar o resultado imediatamente', 'Trocar fisicamente o processador', 'Criar cabos automaticamente', 'Executar somente jogos 3D'], answerIndex: 0 },
      { question: 'O IDLE pode ser usado para:', options: ['Escrever e executar programas Python', 'Formatar o disco obrigatoriamente', 'Editar imagens', 'Configurar o roteador'], answerIndex: 0 },
    ],
  },
  {
    day: 4,
    id: 'python-primeiros-comandos',
    title: 'Primeiros comandos em Python 3',
    youtubeId: '31llNGKWDdo',
    youtubeUrl: 'https://www.youtube.com/watch?v=31llNGKWDdo&list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6&index=4',
    questions: [
      { question: 'Qual comando exibe uma mensagem na tela?', options: ["echo('Mensagem')", "print('Mensagem')", "show('Mensagem')", "write.screen('Mensagem')"], answerIndex: 1 },
      { question: 'Como escrever um comentário de uma linha em Python?', options: ['// comentário', '/* comentário */', '# comentário', '<!-- comentário -->'], answerIndex: 2 },
      { question: 'Como atribuir o valor 5 a uma variável chamada idade?', options: ['int idade = 5', 'idade = 5', 'var idade: 5', 'set idade to 5'], answerIndex: 1 },
      { question: 'Qual destes representa um texto em Python?', options: ['"Olá"', 'Olá sem aspas', '#Olá', 'texto: Olá'], answerIndex: 0 },
      { question: 'Qual é o resultado de 2 + 3 em Python?', options: ['23', '5', '6', 'Erro sempre'], answerIndex: 1 },
      { question: 'Qual função recebe um dado digitado pelo usuário?', options: ['input()', 'read.screen()', 'get.text()', 'scanf-only()'], answerIndex: 0 },
      { question: 'Por padrão, input() retorna:', options: ['Um texto (string)', 'Sempre um número inteiro', 'Um valor booleano', 'Uma lista'], answerIndex: 0 },
      { question: 'Qual função mostra o tipo de um valor?', options: ['kind()', 'type()', 'what()', 'classify()'], answerIndex: 1 },
      { question: 'Qual operador realiza uma divisão inteira?', options: ['/', '//', '**', '%%'], answerIndex: 1 },
      { question: 'O que acontece ao executar print("Olá", nome)?', options: ['Os valores são enviados para a saída, separados por espaço', 'A variável nome é apagada', 'O programa sempre fecha', 'Nada é exibido em nenhuma situação'], answerIndex: 0 },
    ],
  },
];

export function getLessonByDay(day: number): PythonLesson | undefined {
  return PYTHON_COURSE.find((lesson) => lesson.day === day);
}

export function getBattleQuestionsForDay(day: number): PythonQuestion[] {
  return getLessonByDay(day)?.questions ?? [];
}
