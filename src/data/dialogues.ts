import { NPCDialogueDefinition } from '@/utils/types';

export const NPC_DIALOGUES: NPCDialogueDefinition[] = [
  {
    id: 'mentor-python-main',
    variants: [
      {
        id: 'mentor-python-day-1',
        priority: 1,
        maxDay: 1,
        lines: [
          {
            speaker: 'Professor Python',
            text: 'Comece observando os problemas ao seu redor. Todo programa nasce de uma pergunta.',
          },
        ],
        setFlags: ['met-mentor-python'],
      },
      {
        id: 'mentor-python-progress',
        priority: 2,
        minDay: 2,
        requiredFlags: ['met-mentor-python'],
        lines: [
          {
            speaker: 'Professor Python',
            text: 'Você está avançando. Continue usando a lógica antes de tentar responder rapidamente.',
          },
        ],
        setFlags: ['mentor-python-progress-seen'],
      },
      {
        id: 'mentor-python-low-knowledge',
        priority: 3,
        minKnowledge: 1,
        maxKnowledge: 3,
        lines: [
          {
            speaker: 'Professor Python',
            text: 'Descanse e revise suas anotações. Conhecimento também se recupera com cuidado.',
          },
        ],
        setFlags: ['mentor-python-low-knowledge-seen'],
      },
    ],
  },
];
