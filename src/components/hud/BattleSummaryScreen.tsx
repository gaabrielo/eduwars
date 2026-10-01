import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import confetti from 'canvas-confetti';
import {
  overworldActiveUISelector,
  overworldStateAtom,
} from '@/atoms/overworldStateAtom';
import { knowledgeStateAtom } from '@/atoms/knowledgeStateAtom';
import { getDiaryConceptLabel } from '@/data/pythonConcepts';
import { CheckCircle2, Lightbulb, Medal, XCircle } from 'lucide-react';

// Celebration palette follows the game's yellow/green style.
const CONFETTI_COLORS = ['#facc15', '#f59e0b', '#22c55e', '#ffffff'];

// The summary screen is victory-only, so this screen's activation IS the
// victory state; nothing fires on defeat (defeat opens BattleDefeatScreen).
// One immediate celebration: a center burst plus two side cannons, all drawn
// on the library's own fixed canvas (z-index above the modal's z-50).
function fireVictoryConfetti() {
  const base = {
    colors: CONFETTI_COLORS,
    zIndex: 200,
    disableForReducedMotion: true,
  } as const;

  confetti({ ...base, particleCount: 120, spread: 75, origin: { y: 0.6 } });
  confetti({
    ...base,
    particleCount: 60,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.7 },
  });
  confetti({
    ...base,
    particleCount: 60,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.7 },
  });
}

// Module-level guard: reactStrictMode is enabled, so dev double-invokes
// effects on mount; without it the celebration would double-fire (and any
// rapid re-trigger with a fresh battleSummary object would also double).
let lastCelebrationAt = 0;
const CELEBRATION_MIN_INTERVAL_MS = 1000;

function ConceptList({
  conceptIds,
  tone,
}: {
  conceptIds: string[];
  tone: 'mastered' | 'missed';
}) {
  if (conceptIds.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        {tone === 'mastered'
          ? 'Nenhum conceito marcado nesta batalha.'
          : 'Nenhum conceito para revisar!'}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {conceptIds.map((conceptId) => (
        <li key={conceptId} className="flex items-center gap-1 text-sm font-medium">
          {tone === 'mastered' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-red-500" />
          )}
          {getDiaryConceptLabel(conceptId)}
        </li>
      ))}
    </ul>
  );
}

export default function BattleSummaryScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);
  const battleSummary = useRecoilValue(overworldStateAtom).battleSummary;
  const knowledge = useRecoilValue(knowledgeStateAtom);

  // The battleSummary object is created once per victory and kept stable
  // while the modal is open, so this effect runs exactly when the screen
  // becomes active, not on later re-renders.
  useEffect(() => {
    if (activeUI !== 'BATTLE_SUMMARY' || !battleSummary) return;

    const now = Date.now();
    if (now - lastCelebrationAt < CELEBRATION_MIN_INTERVAL_MS) return;
    lastCelebrationAt = now;

    fireVictoryConfetti();
  }, [activeUI, battleSummary]);

  if (activeUI !== 'BATTLE_SUMMARY') return null;
  if (!battleSummary) return null;

  const accuracy =
    battleSummary.questionTotal > 0
      ? Math.round(
          (battleSummary.correctCount / battleSummary.questionTotal) * 100
        )
      : 0;

  const closeSummary = () => {
    setOverworldState((previous) => ({
      ...previous,
      activeUI: null,
      battleSummary: null,
    }));
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
      <div className="w-3/4 max-w-lg rounded-lg bg-white p-6 text-center shadow-xl">
        <div className="mb-2 flex items-center justify-center gap-2 text-green-600">
          <Medal className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Desafio concluído!</h2>
        </div>
        <p className="mb-1 text-sm text-gray-500">
          Dia {battleSummary.day} — {battleSummary.lessonTitle}
        </p>
        <p className="mb-4 text-3xl font-black text-slate-900">
          {battleSummary.correctCount}/{battleSummary.questionTotal}{' '}
          <span className="text-lg font-semibold text-gray-500">
            ({accuracy}% de acerto)
          </span>
        </p>

        <div className="mb-4 grid grid-cols-1 gap-1 rounded border border-green-200 bg-green-50 p-3 text-left text-sm text-green-800">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Dia concluído
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> +1 Conhecimento máximo (
            {knowledge.current}/{knowledge.max})
          </span>
        </div>

        <div className="mb-3 grid grid-cols-1 gap-3 text-left">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Conceitos dominados
            </p>
            <ConceptList conceptIds={battleSummary.masteredConceptIds} tone="mastered" />
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600">
              <Lightbulb className="h-4 w-4" />
              Para revisar
            </p>
            <ConceptList conceptIds={battleSummary.missedConceptIds} tone="missed" />
          </div>
        </div>

        <p className="mb-4 text-xs text-gray-500">
          O resultado foi registrado no seu Diário do Conhecimento.
        </p>

        <button
          type="button"
          className="rounded bg-blue-600 px-6 py-2 font-bold text-white transition-colors hover:bg-blue-700"
          onClick={closeSummary}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
