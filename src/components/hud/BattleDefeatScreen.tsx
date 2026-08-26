import { useRecoilValue, useSetRecoilState } from 'recoil';
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

export default function BattleDefeatScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);
  const setCurrentDay = useSetRecoilState(currentDayAtom);
  const setKnowledge = useSetRecoilState(knowledgeStateAtom);

  if (activeUI !== 'BATTLE_DEFEAT') return null;

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
      completedBattleIds: [],
    }));
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Você foi derrotado!</h2>
        <p className="mb-6 text-gray-700">
          Seu conhecimento chegou a zero. A jornada será reiniciada no primeiro dia.
        </p>
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
