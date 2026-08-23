import { useRecoilState } from 'recoil';
import { overworldStateAtom } from '@/atoms/overworldStateAtom';
import { knowledgeStateAtom } from '@/atoms/knowledgeStateAtom';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { getBattleQuestionsForDay, getLessonByDay } from '@/data/pythonCourse';
import { useState, useEffect } from 'react';
import Sprite from '@/components/object-graphics/Sprite';
import { TILES } from '@/utils/tiles';

export default function BattleQuizScreen() {
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);
  const [knowledge, setKnowledge] = useRecoilState(knowledgeStateAtom);
  const [currentDay, setCurrentDay] = useRecoilState(currentDayAtom);
  const lesson = getLessonByDay(currentDay);
  const questions = getBattleQuestionsForDay(currentDay);
  const battleEnemy = overworldState.battleEnemy;
  const [npcHealth, setNpcHealth] = useState(questions.length);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  useEffect(() => {
    setNpcHealth(questions.length);
    setCurrentQuestionIndex(0);
    setShowFeedback(null);
  }, [currentDay, questions.length]);

  if (overworldState.activeUI !== 'NPC_BATTLE') return null;

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
  
  const handleAnswer = (selectedIndex: number) => {
    if (showFeedback) return; // Ignore clicks during feedback
    
    const isCorrect = selectedIndex === questions[currentQuestionIndex].answerIndex;
    
    if (isCorrect) {
      setShowFeedback('Correto! O NPC perdeu vida.');
      const newHealth = npcHealth - 1;
      setNpcHealth(newHealth);
      
      setTimeout(() => {
        if (newHealth <= 0) {
          endBattle(true);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setShowFeedback(null);
        }
      }, 1500);
    } else {
      const damage = isSpecialAttack ? 2 : 1;
      const newKnowledge = Math.max(0, knowledge.current - damage);
      
      setShowFeedback(`Incorreto! Cuidado, o NPC revidou tirando ${damage} Conhecimento!`);
      
      setKnowledge(prev => ({
        ...prev,
        current: newKnowledge
      }));
      
      setTimeout(() => {
        if (newKnowledge <= 0) {
          if (battleEnemy) {
            window.dispatchEvent(
              new CustomEvent('BATTLE_FINISHED', {
                detail: {
                  battleId: battleEnemy.fieldId,
                  victory: false,
                  playerDefeated: true,
                },
              })
            );
          }

          setNpcHealth(questions.length);
          setCurrentQuestionIndex(0);
          setShowFeedback(null);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setShowFeedback(null);
          // If it was the last question but player didn't finish off the NPC
          if (currentQuestionIndex >= questions.length - 1) {
            endBattle(false);
          }
        }
      }, 2000);
    }
  };

  const endBattle = (victory: boolean) => {
    if (!battleEnemy) return;

    window.dispatchEvent(
      new CustomEvent('BATTLE_FINISHED', {
        detail: {
          battleId: battleEnemy.fieldId,
          victory,
          playerDefeated: false,
        },
      })
    );

    if (victory) {
      setCurrentDay((day) => day + 1);
      setKnowledge((previous) => ({
        ...previous,
        current: previous.max + 1,
        max: previous.max + 1,
      }));
    }
    setNpcHealth(questions.length);
    setCurrentQuestionIndex(0);
    setShowFeedback(null);
    
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Batalha Quiz: {battleEnemy?.name || 'Inimigo'}
        </h2>
        
        {/* Enemy avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center transform scale-150">
             <div className="absolute top-4 left-4">
               <Sprite
                 frameCoordinate={battleEnemy?.spriteFrame || TILES.ROGUE_LEFT}
                 size={32} 
               />
             </div>
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
              <p className="absolute inset-0 flex items-center justify-center font-bold text-white shadow-black drop-shadow-md" style={{ fontSize: '10px' }}>
                {npcHealth} / {questions.length}
              </p>
            </div>
          </div>

          {/* Special Charge Bar */}
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1 text-right">Especial</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative border border-gray-400 flex">
               <div className={`h-4 flex-1 border-r border-gray-400 transition-colors duration-300 ${specialCharge >= 1 || isSpecialAttack ? 'bg-orange-500' : 'bg-transparent'}`} />
               <div className={`h-4 flex-1 border-r border-gray-400 transition-colors duration-300 ${specialCharge >= 2 || isSpecialAttack ? 'bg-orange-500' : 'bg-transparent'}`} />
               <div className={`h-4 flex-1 transition-colors duration-300 ${isSpecialAttack ? 'bg-orange-500 animate-pulse' : 'bg-transparent'}`} />
            </div>
          </div>
        </div>

        {npcHealth > 0 && currentQuestionIndex < questions.length ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-500">Pergunta {currentQuestionNumber}/{questions.length}</span>
              <span className="text-sm font-bold text-blue-600">Seu Conhecimento: {knowledge.current}/{knowledge.max}</span>
            </div>
            
            <p className="text-xl mb-6 font-semibold min-h-16">{questions[currentQuestionIndex].question}</p>
            
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <button 
                  key={idx}
                  className={`bg-gray-100 hover:bg-gray-200 p-4 rounded border font-medium transition-colors ${showFeedback ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={!!showFeedback}
                >
                  {String.fromCharCode(65 + idx)}) {option}
                </button>
              ))}
            </div>
            
            {showFeedback && (
              <div className={`mt-6 p-3 rounded font-bold text-lg ${showFeedback.includes('Correto') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {showFeedback}
              </div>
            )}
          </div>
        ) : (
           <div className="text-green-600 text-xl font-bold py-8">
             NPC derrotado!
          </div>
        )}

      </div>
    </div>
  );
}
