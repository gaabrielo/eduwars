import { GameProgress } from '@/types/gameProgress';
import { DialogueVariant, NPCDefinition } from '@/utils/types';
import { NPC_DEFINITIONS } from '@/data/dialogues';

function matchesVariant(
  variant: DialogueVariant,
  progress: Pick<GameProgress, 'currentDay' | 'knowledge' | 'dialogueFlags'>
): boolean {
  const flags = new Set(progress.dialogueFlags);

  return (
    (variant.minDay === undefined || progress.currentDay >= variant.minDay) &&
    (variant.maxDay === undefined || progress.currentDay <= variant.maxDay) &&
    (variant.minKnowledge === undefined ||
      progress.knowledge.current >= variant.minKnowledge) &&
    (variant.maxKnowledge === undefined ||
      progress.knowledge.current <= variant.maxKnowledge) &&
    (variant.requiredFlags ?? []).every((flag) => flags.has(flag)) &&
    (variant.excludedFlags ?? []).every((flag) => !flags.has(flag))
  );
}

export function getNPCDefinition(npcId: string): NPCDefinition | undefined {
  return NPC_DEFINITIONS.find((npc) => npc.id === npcId);
}

export function selectDialogueVariant(
  npcId: string,
  progress: Pick<GameProgress, 'currentDay' | 'knowledge' | 'dialogueFlags'>
): DialogueVariant | undefined {
  const variants = getNPCDefinition(npcId)?.dialogues.filter(
    (variant) => variant.lines.length > 0
  );

  if (!variants?.length) return undefined;

  const matchingVariant = variants
    .filter((variant) => matchesVariant(variant, progress))
    .sort((first, second) => second.priority - first.priority)[0];

  return (
    matchingVariant ??
    variants.sort((first, second) => first.priority - second.priority)[0]
  );
}
