import styles from './RenderLevel.module.css';
import { LEVEL_THEMES, THEME_BACKGROUNDS, CELL_SIZE } from '@/utils/consts';
import LevelBackgroundTilesLayer from './LevelBackgroundTilesLayer';
import LevelPlacementsLayer from '@/components/level-layout/LevelPlacementsLayer';
import { useEffect, useRef, useState } from 'react';
import { LevelState } from '@/classes/LevelState';
import { LevelProps } from '@/utils/types';
import { HeroHud } from '@/components/hud/HeroHud';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentLevelIdAtom } from '@/atoms/currentLevelIdAtom';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { knowledgeStateAtom } from '@/atoms/knowledgeStateAtom';
import { currentCharacterNameAtom } from '@/atoms/currentCharacterNameAtom';
import {
  overworldStateAtom,
  OverworldState,
} from '@/atoms/overworldStateAtom';
import { dialogueStateAtom } from '@/atoms/dialogueStateAtom';
import ClassroomScreen from '@/components/hud/ClassroomScreen';
import BattleQuizScreen from '@/components/hud/BattleQuizScreen';
import BattleDefeatScreen from '@/components/hud/BattleDefeatScreen';
import SkinSelectionScreen from '@/components/hud/SkinSelectionScreen';
import DialogueScreen from '@/components/hud/DialogueScreen';
import { useGameProgress } from '@/contexts/GameProgressContext';
import { selectDialogueVariant } from '@/services/dialogue';
import { BattleSnapshot, HeroPosition } from '@/types/gameProgress';

export default function RenderLevel() {
  const [level, setLevel] = useState<LevelProps['level'] | null>(null);
  const [currentLevelId, setCurrentId] = useRecoilState(currentLevelIdAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const [, setCurrentDay] = useRecoilState(currentDayAtom);
  const knowledge = useRecoilValue(knowledgeStateAtom);
  const [, setKnowledge] = useRecoilState(knowledgeStateAtom);
  const characterName = useRecoilValue(currentCharacterNameAtom);
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);
  const [, setDialogueState] = useRecoilState(dialogueStateAtom);
  const levelStateRef = useRef<LevelState | null>(null);
  const battleSnapshotRef = useRef<BattleSnapshot | null>(null);
  const currentDayRef = useRef(currentDay);
  const knowledgeRef = useRef(knowledge);
  const overworldStateRef = useRef(overworldState);
  const {
    captureBattleSnapshot,
    restoreBattleSnapshot,
    updateHeroPosition,
    markPlacementCollected,
  } = useGameProgress();

  currentDayRef.current = currentDay;
  knowledgeRef.current = knowledge;
  overworldStateRef.current = overworldState;

  useEffect(() => {
    const levelState = new LevelState(
      currentLevelId,
      characterName,
      (newState) => {
        setLevel(newState);
      },
      currentDay,
      overworldState.completedBattleIds,
      (battle) => {
        setOverworldState((previous) => ({
          ...previous,
          activeUI: 'NPC_BATTLE',
          previousLevelId: currentLevelId,
          battleEnemy: battle,
        }));
      },
      {
        initialHeroPosition: overworldState.heroPositionByLevel[currentLevelId],
        collectedPlacementIds:
          overworldState.collectedPlacementIdsByLevel[currentLevelId],
        onHeroPositionChange: (position) => {
          updateHeroPosition(currentLevelId, position);
        },
        onPlacementCollected: (placementId) => {
          markPlacementCollected(currentLevelId, placementId);
        },
        onBattleStarted: (origin) => {
          battleSnapshotRef.current = captureBattleSnapshot(currentLevelId, origin);
        },
        watchedLessonDays: overworldState.watchedLessonDays,
      }
    );
    levelStateRef.current = levelState;
    setLevel(levelState.getState());

    const handleOverworldAction = (event: Event) => {
      const { detail } = event as CustomEvent<
        NonNullable<OverworldState['activeUI']>
      >;
      setOverworldState((previous) => ({
        ...previous,
        activeUI: detail,
        previousLevelId: currentLevelId,
      }));
    };
    window.addEventListener('OVERWORLD_UI_TOGGLE', handleOverworldAction);

    const handleNPCInteraction = (event: Event) => {
      const { npcId, dialogueId } = (event as CustomEvent<{
        npcId: string;
        dialogueId: string;
      }>).detail;
      const variant = selectDialogueVariant(dialogueId, {
        currentDay: currentDayRef.current,
        knowledge: knowledgeRef.current,
        dialogueFlags: overworldStateRef.current.dialogueFlags,
      });

      if (!variant) return;

      setDialogueState({
        npcId,
        variantId: variant.id,
        lines: variant.lines,
        currentLineIndex: 0,
        setFlags: variant.setFlags ?? [],
      });
      setOverworldState((previous) => ({
        ...previous,
        activeUI: 'DIALOGUE',
        previousLevelId: currentLevelId,
      }));
    };
    window.addEventListener('NPC_INTERACTION', handleNPCInteraction);

    const handleBattleLocked = () => {
      if (overworldStateRef.current.activeUI !== null) return;

      setDialogueState({
        npcId: 'system',
        variantId: 'battle-locked-lesson',
        lines: [
          {
            speaker: 'Aviso',
            text: 'A aula do dia vai começar, dirija-se para a sala de aula, o professor está esperando!',
          },
        ],
        currentLineIndex: 0,
        setFlags: [],
      });
      setOverworldState((previous) => ({
        ...previous,
        activeUI: 'DIALOGUE',
        previousLevelId: currentLevelId,
      }));
    };
    window.addEventListener('BATTLE_LOCKED', handleBattleLocked);

    const handleTeleport = (event: Event) => {
      const { mapId, x, y } = (event as CustomEvent<{
        mapId: string;
        x: number;
        y: number;
      }>).detail;
      updateHeroPosition(mapId, {
        x,
        y,
        facingDirection:
          overworldStateRef.current.heroPositionByLevel[currentLevelId]
            ?.facingDirection ?? 'RIGHT',
      });
      setCurrentId(mapId);
      setOverworldState((previous) => ({
        ...previous,
        activeUI: null,
        battleEnemy: null,
      }));
    };
    window.addEventListener('OVERWORLD_TELEPORT', handleTeleport);

    const handleBattleFinished = (event: Event) => {
      const { battleId, victory, playerDefeated } = (event as CustomEvent<{
        battleId: string;
        victory: boolean;
        playerDefeated: boolean;
      }>).detail;
      if (victory) {
        setCurrentDay((day) => day + 1);
        setKnowledge((previous) => ({
          ...previous,
          current: previous.max + 1,
          max: previous.max + 1,
        }));
      }
      levelStateRef.current?.finishBattle(battleId, victory, playerDefeated);
      battleSnapshotRef.current = null;
      setOverworldState((previous) => ({
        ...previous,
        activeUI: playerDefeated ? 'BATTLE_DEFEAT' : null,
        battleEnemy: null,
        completedBattleIds:
          victory && !previous.completedBattleIds.includes(battleId)
            ? [...previous.completedBattleIds, battleId]
            : previous.completedBattleIds,
      }));
    };
    window.addEventListener('BATTLE_FINISHED', handleBattleFinished);

    const handleBattleFled = (event: Event) => {
      const { battleId } = (event as CustomEvent<{ battleId: string }>).detail;
      if (
        !battleSnapshotRef.current ||
        levelStateRef.current?.activeBattleFrame?.battleId !== battleId
      ) {
        return;
      }

      const snapshot = battleSnapshotRef.current;
      levelStateRef.current.fleeBattle();
      restoreBattleSnapshot(snapshot);
      battleSnapshotRef.current = null;
      setLevel(levelStateRef.current.getState());
    };
    window.addEventListener('BATTLE_FLED', handleBattleFled);

    const handleBattleRestart = () => {
      battleSnapshotRef.current = null;
      if (currentLevelId === 'DormRoomLevel') {
        levelStateRef.current?.restart([]);
        setLevel(levelStateRef.current?.getState() || null);
      } else {
        setCurrentId('DormRoomLevel');
      }
    };
    window.addEventListener('BATTLE_RESTART', handleBattleRestart);

    return () => {
      levelState.destroy();
      levelStateRef.current = null;
      window.removeEventListener('OVERWORLD_UI_TOGGLE', handleOverworldAction);
      window.removeEventListener('NPC_INTERACTION', handleNPCInteraction);
      window.removeEventListener('BATTLE_LOCKED', handleBattleLocked);
      window.removeEventListener('OVERWORLD_TELEPORT', handleTeleport);
      window.removeEventListener('BATTLE_FINISHED', handleBattleFinished);
      window.removeEventListener('BATTLE_FLED', handleBattleFled);
      window.removeEventListener('BATTLE_RESTART', handleBattleRestart);
    };
  }, [
    captureBattleSnapshot,
    currentLevelId,
    markPlacementCollected,
    restoreBattleSnapshot,
    setCurrentId,
    setCurrentDay,
    setDialogueState,
    setKnowledge,
    setOverworldState,
    updateHeroPosition,
  ]);

  useEffect(() => {
    if (levelStateRef.current) {
      levelStateRef.current.heroSkin = characterName;
    }
  }, [characterName]);

  useEffect(() => {
    levelStateRef.current?.setCurrentDay(currentDay);
  }, [currentDay]);

  useEffect(() => {
    levelStateRef.current?.setWatchedLessonDays(overworldState.watchedLessonDays);
  }, [overworldState.watchedLessonDays]);

  useEffect(() => {
    levelStateRef.current?.setInputBlocked(
      Boolean(overworldState.activeUI && overworldState.activeUI !== 'NPC_BATTLE')
    );
  }, [overworldState.activeUI]);

  if (!level) return null;

  const cameraTranslate = `translate3d(${level.cameraTransformX}, ${level.cameraTransformY}, 0)`;

  return (
    <div
      className={styles.fullScreenContainer}
      style={{
        backgroundColor: THEME_BACKGROUNDS[level.theme],
      }}
    >
      <div className={styles.gameScreen}>
        <div
          style={{
            transform: cameraTranslate,
          }}
        >
          {level.backgroundImage ? (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${level.tilesWidth * CELL_SIZE}px`,
                height: `${level.tilesHeight * CELL_SIZE}px`,
              }}
            >
              <img
                src={level.backgroundImage}
                alt="Background Map"
                className="pixelated"
                style={{ display: 'block', width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <LevelBackgroundTilesLayer level={level} />
          )}
          <LevelPlacementsLayer level={level} />
        </div>
      </div>

      <HeroHud level={level} />
      <ClassroomScreen />
      <BattleQuizScreen />
      <BattleDefeatScreen />
      <SkinSelectionScreen />
      <DialogueScreen />
    </div>
  );
}
