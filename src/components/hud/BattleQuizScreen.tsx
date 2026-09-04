import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  overworldActiveUISelector,
  overworldBattleEnemySelector,
  overworldStateAtom,
} from "@/atoms/overworldStateAtom";
import { knowledgeStateAtom } from "@/atoms/knowledgeStateAtom";
import { currentDayAtom } from "@/atoms/currentDayAtom";
import { getBattleQuestionsForDay, getLessonByDay } from "@/data/pythonCourse";
import { useState, useEffect, useRef } from "react";
import Sprite from "@/components/object-graphics/Sprite";
import { TILES } from "@/utils/tiles";

const ENEMY_IDLE_FRAMES_BY_BASE_FRAME: Record<string, readonly [string, string]> = {
  [TILES.HERO_LEFT]: [TILES.HERO_LEFT, TILES.HERO_RUN_1_LEFT],
  [TILES.HERO_RIGHT]: [TILES.HERO_RIGHT, TILES.HERO_RUN_1_RIGHT],
  [TILES.ENGINEER_LEFT]: [TILES.ENGINEER_LEFT, TILES.ENGINEER_RUN_1_LEFT],
  [TILES.ENGINEER_RIGHT]: [TILES.ENGINEER_RIGHT, TILES.ENGINEER_RUN_1_RIGHT],
  [TILES.CLERIC_LEFT]: [TILES.CLERIC_LEFT, TILES.CLERIC_RUN_1_LEFT],
  [TILES.CLERIC_RIGHT]: [TILES.CLERIC_RIGHT, TILES.CLERIC_RUN_1_RIGHT],
  [TILES.ROGUE_LEFT]: [TILES.ROGUE_LEFT, TILES.ROGUE_RUN_1_LEFT],
  [TILES.ROGUE_RIGHT]: [TILES.ROGUE_RIGHT, TILES.ROGUE_RUN_1_RIGHT],
};

const getIdleFrames = (frameCoordinate: string) => {
  return ENEMY_IDLE_FRAMES_BY_BASE_FRAME[frameCoordinate] || [frameCoordinate];
};

export default function BattleQuizScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const battleEnemy = useRecoilValue(overworldBattleEnemySelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);
  const [knowledge, setKnowledge] = useRecoilState(knowledgeStateAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const lesson = getLessonByDay(currentDay);
  const questions = getBattleQuestionsForDay(currentDay);
  const [npcHealth, setNpcHealth] = useState(questions.length);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [damagePop, setDamagePop] = useState<{
    key: number;
    amount: number;
  } | null>(null);
  const [enemyHitKey, setEnemyHitKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const battleFinishedRef = useRef(false);

  useEffect(() => {
    battleFinishedRef.current = false;
    setNpcHealth(questions.length);
    setCurrentQuestionIndex(0);
    setShowFeedback(null);
    setDamagePop(null);
    setEnemyHitKey(0);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [battleEnemy?.fieldId]);

  if (activeUI !== "NPC_BATTLE") return null;

  if (!lesson) {
    return (
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Curso concluído!</h2>
          <p className="mb-6 text-gray-700">Você concluiu todas as aulas disponíveis de Python.</p>
          <button
            className="text-gray-500 hover:text-gray-700 underline text-sm"
            onClick={() => setOverworldState((prev) => ({ ...prev, activeUI: null }))}
          >
            Voltar ao mapa
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionNumber = currentQuestionIndex + 1;
  const specialCharge = currentQuestionIndex % 3; // 0, 1, 2 (2 is max/special)
  const isSpecialAttack = specialCharge === 2;
  const enemyIdleFrames = getIdleFrames(battleEnemy?.spriteFrame || TILES.ROGUE_LEFT);

  const handleAnswer = (selectedIndex: number) => {
    if (showFeedback || battleFinishedRef.current) return; // Ignore clicks during feedback

    const question = questions[currentQuestionIndex];
    if (!question) return;

    const isCorrect = selectedIndex === question.answerIndex;
    const npcDamage = 1;
    const newHealth = Math.max(0, npcHealth - npcDamage);

    setNpcHealth(newHealth);
    setDamagePop({ key: Date.now(), amount: npcDamage });
    setEnemyHitKey((prev) => prev + 1);

    if (isCorrect) {
      setShowFeedback("Correto! O NPC perdeu vida.");

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (newHealth <= 0) {
          endBattle(true);
        } else {
          advanceQuestion();
        }
      }, 1500);
    } else {
      const knowledgeDamage = isSpecialAttack ? 2 : 1;
      const newKnowledge = Math.max(0, knowledge.current - knowledgeDamage);

      setShowFeedback(`Incorreto! Cuidado, o NPC revidou tirando ${knowledgeDamage} Conhecimento!`);

      setKnowledge((prev) => ({
        ...prev,
        current: newKnowledge,
      }));

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (newKnowledge <= 0) {
          defeatPlayer();
        } else if (newHealth <= 0) {
          endBattle(true);
        } else {
          advanceQuestion();
        }
      }, 2000);
    }
  };

  const advanceQuestion = () => {
    setShowFeedback(null);
    setDamagePop(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const defeatPlayer = () => {
    if (!battleEnemy || battleFinishedRef.current) return;
    battleFinishedRef.current = true;

    window.dispatchEvent(
      new CustomEvent("BATTLE_FINISHED", {
        detail: {
          battleId: battleEnemy.fieldId,
          victory: false,
          playerDefeated: true,
        },
      }),
    );
  };

  const endBattle = (victory: boolean) => {
    if (!battleEnemy || battleFinishedRef.current) return;
    battleFinishedRef.current = true;

    window.dispatchEvent(
      new CustomEvent("BATTLE_FINISHED", {
        detail: {
          battleId: battleEnemy.fieldId,
          victory,
          playerDefeated: false,
        },
      }),
    );
  };

  const fleeBattle = () => {
    if (!battleEnemy || battleFinishedRef.current) return;
    battleFinishedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setNpcHealth(questions.length);
    setCurrentQuestionIndex(0);
    setShowFeedback(null);
    setDamagePop(null);
    setEnemyHitKey(0);
    window.dispatchEvent(
      new CustomEvent("BATTLE_FLED", {
        detail: { battleId: battleEnemy.fieldId },
      }),
    );
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Batalha Quiz: {battleEnemy?.name || "Inimigo"}
        </h2>

        <div className="mb-5 flex justify-end">
          <button
            className="rounded border border-slate-400 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            onClick={fleeBattle}
          >
            Fugir da batalha
          </button>
        </div>

        {/* Enemy avatar */}
        <div className="flex justify-center mb-6">
          <div
            key={`enemy-hit-${enemyHitKey}`}
            className="relative w-28 h-28 bg-gray-100 border-4 border-gray-300 rounded-xl overflow-hidden flex items-center justify-center animate-enemy-hit"
          >
            <div className="scale-[2.25] -translate-y-[16px]">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 animate-enemy-idle-base">
                  <Sprite frameCoordinate={enemyIdleFrames[0]} size={32} />
                </div>

                {enemyIdleFrames[1] && (
                  <div className="absolute inset-0 animate-enemy-idle-one">
                    <Sprite frameCoordinate={enemyIdleFrames[1]} size={32} />
                  </div>
                )}
              </div>
            </div>

            {damagePop && (
              <span
                key={damagePop.key}
                className="absolute top-2 right-2 text-red-600 font-black text-2xl drop-shadow animate-damage-float pointer-events-none select-none"
                style={{ textShadow: "1px 1px 0 #fff, -1px -1px 0 #fff" }}
              >
                -{damagePop.amount}
              </span>
            )}
          </div>
        </div>

        {/* Header and Special Attack Warning */}
        {isSpecialAttack && (
          <div className="bg-orange-100 text-orange-800 p-2 rounded mb-4 font-bold animate-pulse">
            ⚠️ CUIDADO: O NPC carregou um ataque especial! Errar tirará 2 de conhecimento!
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {/* NPC Health Bar */}
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1 text-left">Vida do NPC</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative border border-gray-400">
              <div
                className="bg-red-600 h-4 transition-all duration-300"
                style={{ width: `${(npcHealth / questions.length) * 100}%` }}
              ></div>
              <p
                className="absolute inset-0 flex items-center justify-center font-bold text-white shadow-black drop-shadow-md"
                style={{ fontSize: "10px" }}
              >
                {npcHealth} / {questions.length}
              </p>
            </div>
          </div>

          {/* Special Charge Bar */}
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1 text-right">Especial</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative border border-gray-400 flex">
              <div
                className={`h-4 flex-1 border-r border-gray-400 transition-colors duration-300 ${specialCharge >= 1 || isSpecialAttack ? "bg-orange-500" : "bg-transparent"}`}
              />
              <div
                className={`h-4 flex-1 border-r border-gray-400 transition-colors duration-300 ${specialCharge >= 2 || isSpecialAttack ? "bg-orange-500" : "bg-transparent"}`}
              />
              <div
                className={`h-4 flex-1 transition-colors duration-300 ${isSpecialAttack ? "bg-orange-500 animate-pulse" : "bg-transparent"}`}
              />
            </div>
          </div>
        </div>

        {npcHealth > 0 && currentQuestionIndex < questions.length ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-500">
                Pergunta {currentQuestionNumber}/{questions.length}
              </span>
              <span className="text-sm font-bold text-blue-600">
                Seu Conhecimento: {knowledge.current}/{knowledge.max}
              </span>
            </div>

            <p className="text-xl mb-6 font-semibold min-h-16">
              {questions[currentQuestionIndex].question}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  className={`bg-gray-100 hover:bg-gray-200 p-4 rounded border font-medium transition-colors ${showFeedback ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={!!showFeedback}
                >
                  {String.fromCharCode(65 + idx)}) {option}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div
                className={`mt-6 p-3 rounded font-bold text-lg ${showFeedback.includes("Correto") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {showFeedback}
              </div>
            )}
          </div>
        ) : (
          <div className="text-green-600 text-xl font-bold py-8">NPC derrotado!</div>
        )}
      </div>
    </div>
  );
}
