import { NPCDefinition } from "@/utils/types";

export const NPC_DEFINITIONS: NPCDefinition[] = [
  {
    id: "professor-python",
    name: "Professor Snake",
    personality:
      "Observador, paciente e sempre pronto para fazer uma pergunta.",
    backstory:
      "Professor Snake ensina lógica há anos e acredita que todo problema pode ser dividido em partes menores.",
    dialogues: [
      {
        id: "mentor-python-day-1",
        priority: 1,
        maxDay: 1,
        lines: [
          { text: "Comece observando os problemas ao seu redor." },
          { text: "Todo programa nasce de uma pergunta." },
        ],
        setFlags: ["met-mentor-python"],
      },
      {
        id: "mentor-python-progress",
        priority: 2,
        minDay: 2,
        requiredFlags: ["met-mentor-python"],
        lines: [
          {
            text: "Você está avançando. Continue usando a lógica antes de tentar responder rapidamente.",
          },
        ],
        setFlags: ["mentor-python-progress-seen"],
      },
      {
        id: "mentor-python-low-knowledge",
        priority: 3,
        minKnowledge: 1,
        maxKnowledge: 3,
        lines: [
          { text: "Descanse e revise suas anotações." },
          { text: "Conhecimento também se recupera com cuidado." },
        ],
        setFlags: ["mentor-python-low-knowledge-seen"],
      },
    ],
  },
];
