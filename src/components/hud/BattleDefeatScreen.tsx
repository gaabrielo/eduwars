import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BookOpen } from 'lucide-react';
import { currentDayAtom, INITIAL_DAY } from '@/atoms/currentDayAtom';
import {
  INITIAL_KNOWLEDGE_CURRENT,
  INITIAL_KNOWLEDGE_MAX,
  knowledgeStateAtom,
} from '@/atoms/knowledgeStateAtom';
import {
  overworldActiveUISelector,
  overworldStateAtom,
} from '@/atoms/overworldStateAtom';
import { diaryAtom } from '@/atoms/diaryAtom';

export default function BattleDefeatScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const diary = useRecoilValue(diaryAtom);
  const setCurrentDay = useSetRecoilState(currentDayAtom);
  const setKnowledge = useSetRecoilState(knowledgeStateAtom);

  if (activeUI !== 'BATTLE_DEFEAT') return null;

  const lastAttempt = diary.days.find(
    (entry) => entry.day === currentDay
  )?.last;
  const defeatedAttempt =
    lastAttempt && lastAttempt.outcome === 'DEFEAT' ? lastAttempt : null;

  const restartGame = () => {
    window.dispatchEvent(new CustomEvent('BATTLE_RESTART'));
    setCurrentDay(INITIAL_DAY);
    setKnowledge({
      current: INITIAL_KNOWLEDGE_CURRENT,
      max: INITIAL_KNOWLEDGE_MAX,
    });
    setOverworldState((prev) => ({
      ...prev,
      activeUI: null,
      previousLevelId: null,
      battleEnemy: null,
      battleSummary: null,
      completedBattleIds: [],
      courseSequenceAcknowledged: false,
    }));
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Você foi derrotado!</h2>
        <p className="mb-4 text-gray-700">
          Seu conhecimento chegou a zero. A jornada será reiniciada no primeiro dia.
        </p>
        {defeatedAttempt && (
          <p className="mb-4 flex items-center justify-center gap-2 rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800">
            <BookOpen className="h-4 w-4" />
            Diário atualizado: {defeatedAttempt.correctCount}/
            {defeatedAttempt.questionTotal} nesta tentativa.
          </p>
        )}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
          onClick={restartGame}
        >
          Recomeçar jornada
        </button>
      </div>
    </div>
  );
}
