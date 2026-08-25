import { GameProgress } from '@/types/gameProgress';
import { DialogueVariant, NPCDialogueDefinition } from '@/utils/types';
import { NPC_DIALOGUES } from '@/data/dialogues';

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

export function getDialogueDefinition(
  dialogueId: string
): NPCDialogueDefinition | undefined {
  return NPC_DIALOGUES.find((dialogue) => dialogue.id === dialogueId);
}

export function selectDialogueVariant(
  dialogueId: string,
  progress: Pick<GameProgress, 'currentDay' | 'knowledge' | 'dialogueFlags'>
): DialogueVariant | undefined {
  return getDialogueDefinition(dialogueId)?.variants
    .filter((variant) => matchesVariant(variant, progress))
    .sort((first, second) => second.priority - first.priority)[0];
}
