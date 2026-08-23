import styles from './RenderLevel.module.css';
import { LEVEL_THEMES, THEME_BACKGROUNDS, CELL_SIZE } from '@/utils/consts';
import LevelBackgroundTilesLayer from './LevelBackgroundTilesLayer';
import LevelPlacementsLayer from '@/components/level-layout/LevelPlacementsLayer';
import { useEffect, useState, useRef } from 'react';
import { LevelState } from '@/classes/LevelState';
import { LevelProps } from '@/utils/types';
import { HeroHud } from '@/components/hud/HeroHud';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentLevelIdAtom } from '@/atoms/currentLevelIdAtom';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { currentCharacterNameAtom } from '@/atoms/currentCharacterNameAtom';
import { overworldStateAtom } from '@/atoms/overworldStateAtom';
import ClassroomScreen from '@/components/hud/ClassroomScreen';
import BattleQuizScreen from '@/components/hud/BattleQuizScreen';
import BattleDefeatScreen from '@/components/hud/BattleDefeatScreen';
import SkinSelectionScreen from '@/components/hud/SkinSelectionScreen';

export default function RenderLevel() {
  const [level, setLevel] = useState<LevelProps['level'] | null>(null);
  const [currentLevelId, setCurrentId] = useRecoilState(currentLevelIdAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const characterName = useRecoilValue(currentCharacterNameAtom);
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);
  const levelStateRef = useRef<LevelState | null>(null);

  useEffect(() => {
    // create and subscribe to state changes
    const levelState = new LevelState(
      currentLevelId,
      characterName,
      (newState) => {
        setLevel(newState);
      },
      currentDay,
      overworldState.completedBattleIds,
      (battle) => {
        setOverworldState((prev) => ({
          ...prev,
          activeUI: 'NPC_BATTLE',
          previousLevelId: currentLevelId,
          battleEnemy: battle,
        }));
      },
    );
    levelStateRef.current = levelState;

    // get initial state
    setLevel(levelState.getState());

    // Listen for custom overworld UI interactions (Classroom, NPC, etc)
    const handleOverworldAction = (e: any) => {
      setOverworldState((prev) => ({
        ...prev,
        activeUI: e.detail,
        previousLevelId: currentLevelId,
      }));
    };
    window.addEventListener('OVERWORLD_UI_TOGGLE', handleOverworldAction);

    const handleTeleport = (e: any) => {
      const { mapId } = e.detail;
      // Update the recoil level atom which forces the LevelState to re-initiate
      // TODO: the x/y should be persisted in a user save state or player atom
      // For now we just change the level
      setCurrentId(mapId);
      setOverworldState((prev) => ({
        ...prev,
        activeUI: null,
        battleEnemy: null,
      }));
    };
    window.addEventListener('OVERWORLD_TELEPORT', handleTeleport);

    const handleBattleFinished = (e: any) => {
      const { battleId, victory, playerDefeated } = e.detail;
      levelStateRef.current?.finishBattle(battleId, victory, playerDefeated);
      setOverworldState((prev) => ({
        ...prev,
        activeUI: playerDefeated ? 'BATTLE_DEFEAT' : null,
        battleEnemy: null,
        completedBattleIds:
          victory && !prev.completedBattleIds.includes(battleId)
            ? [...prev.completedBattleIds, battleId]
            : prev.completedBattleIds,
      }));
    };
    window.addEventListener('BATTLE_FINISHED', handleBattleFinished);

    const handleBattleRestart = () => {
      if (currentLevelId === 'DormRoomLevel') {
        levelStateRef.current?.restart([]);
        setLevel(levelStateRef.current?.getState() || null);
      } else {
        setCurrentId('DormRoomLevel');
      }
    };
    window.addEventListener('BATTLE_RESTART', handleBattleRestart);

    // destroy method when component unmounts
    return () => {
      levelState.destroy();
      levelStateRef.current = null;
      window.removeEventListener('OVERWORLD_UI_TOGGLE', handleOverworldAction);
      window.removeEventListener('OVERWORLD_TELEPORT', handleTeleport);
      window.removeEventListener('BATTLE_FINISHED', handleBattleFinished);
      window.removeEventListener('BATTLE_RESTART', handleBattleRestart);
    };
  }, [currentLevelId, setOverworldState, setCurrentId]);

  useEffect(() => {
    if (levelStateRef.current) {
      levelStateRef.current.heroSkin = characterName;
    }
  }, [characterName]);

  useEffect(() => {
    levelStateRef.current?.setCurrentDay(currentDay);
  }, [currentDay]);

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
            <div style={{ position: 'absolute', top: 0, left: 0, width: `${level.tilesWidth * CELL_SIZE}px`, height: `${level.tilesHeight * CELL_SIZE}px` }}>
               <img src={level.backgroundImage} alt="Background Map" className="pixelated" style={{ display: 'block', width: '100%', height: '100%' }} />
            </div>
          ) : (
            <LevelBackgroundTilesLayer level={level} />
          )}
          <LevelPlacementsLayer level={level} />
        </div>
      </div>

      <HeroHud level={level} />
      {/* Overworld UI Overlays */}
      <ClassroomScreen />
      <BattleQuizScreen />
      <BattleDefeatScreen />
      <SkinSelectionScreen />
    </div>
  );
}
