import { useRecoilState } from 'recoil';
import { dialogueStateAtom } from '@/atoms/dialogueStateAtom';
import { overworldStateAtom } from '@/atoms/overworldStateAtom';
import { useGameProgress } from '@/contexts/GameProgressContext';

export default function DialogueScreen() {
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);
  const [dialogue, setDialogue] = useRecoilState(dialogueStateAtom);
  const { addDialogueFlag } = useGameProgress();

  if (overworldState.activeUI !== 'DIALOGUE' || !dialogue) return null;

  const line = dialogue.lines[dialogue.currentLineIndex];
  const isLastLine = dialogue.currentLineIndex === dialogue.lines.length - 1;

  const advanceDialogue = () => {
    if (!isLastLine) {
      setDialogue((previous) =>
        previous
          ? {
              ...previous,
              currentLineIndex: previous.currentLineIndex + 1,
            }
          : previous
      );
      return;
    }

    dialogue.setFlags.forEach(addDialogueFlag);
    setDialogue(null);
    setOverworldState((previous) => ({ ...previous, activeUI: null }));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 p-6">
      <div className="w-full max-w-3xl rounded-lg border-4 border-slate-800 bg-white p-5 shadow-xl">
        <p className="mb-2 text-lg font-bold text-blue-700">{line.speaker}</p>
        <p className="min-h-16 text-lg text-slate-800">{line.text}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="rounded bg-blue-600 px-5 py-2 font-bold text-white transition-colors hover:bg-blue-700"
            onClick={advanceDialogue}
          >
            {isLastLine ? 'Fechar' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}
