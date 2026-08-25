import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { currentCharacterNameAtom } from '@/atoms/currentCharacterNameAtom';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { currentLevelIdAtom } from '@/atoms/currentLevelIdAtom';
import { knowledgeStateAtom } from '@/atoms/knowledgeStateAtom';
import { overworldStateAtom } from '@/atoms/overworldStateAtom';
import type { OverworldState } from '@/atoms/overworldStateAtom';
import {
  clearGameProgress,
  loadGameProgress,
  saveGameProgress,
} from '@/services/gameProgressStorage';
import {
  BattleSnapshot,
  createInitialGameProgress,
  GameProgress,
  HeroPosition,
} from '@/types/gameProgress';

interface GameProgressContextValue {
  saveNow: () => void;
  captureBattleSnapshot: (
    levelId: string,
    heroPositionOverride?: HeroPosition
  ) => BattleSnapshot;
  restoreBattleSnapshot: (snapshot: BattleSnapshot) => void;
  updateHeroPosition: (levelId: string, position: HeroPosition) => void;
  markPlacementCollected: (levelId: string, placementId: number) => void;
  addDialogueFlag: (flag: string) => void;
  markLessonWatched: (day: number) => void;
  resetProgress: () => void;
}

const GameProgressContext = createContext<GameProgressContextValue | null>(
  null
);

function buildProgress(
  currentLevelId: string,
  currentDay: number,
  knowledge: GameProgress['knowledge'],
  characterName: string,
  overworldState: OverworldState
): GameProgress {
  return {
    version: 1,
    currentLevelId,
    currentDay,
    knowledge,
    characterName,
    heroPositionByLevel: overworldState.heroPositionByLevel,
    completedBattleIds: overworldState.completedBattleIds,
    watchedLessonDays: overworldState.watchedLessonDays,
    collectedPlacementIdsByLevel:
      overworldState.collectedPlacementIdsByLevel,
    dialogueFlags: overworldState.dialogueFlags,
    savedAt: new Date().toISOString(),
  };
}

export function GameProgressProvider({
  children,
}: PropsWithChildren): JSX.Element | null {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentDay, setCurrentDay] = useRecoilState(currentDayAtom);
  const [knowledge, setKnowledge] = useRecoilState(knowledgeStateAtom);
  const [currentLevelId, setCurrentLevelId] = useRecoilState(
    currentLevelIdAtom
  );
  const [characterName, setCharacterName] = useRecoilState(
    currentCharacterNameAtom
  );
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);

  const currentDayRef = useRef(currentDay);
  const knowledgeRef = useRef(knowledge);
  const currentLevelIdRef = useRef(currentLevelId);
  const characterNameRef = useRef(characterName);
  const overworldStateRef = useRef(overworldState);

  currentDayRef.current = currentDay;
  knowledgeRef.current = knowledge;
  currentLevelIdRef.current = currentLevelId;
  characterNameRef.current = characterName;
  overworldStateRef.current = overworldState;

  useEffect(() => {
    const savedProgress = loadGameProgress();
    setCurrentDay(savedProgress.currentDay);
    setKnowledge(savedProgress.knowledge);
    setCurrentLevelId(savedProgress.currentLevelId);
    setCharacterName(savedProgress.characterName);
    setOverworldState((previous) => ({
      ...previous,
      completedBattleIds: savedProgress.completedBattleIds,
      watchedLessonDays: savedProgress.watchedLessonDays,
      heroPositionByLevel: savedProgress.heroPositionByLevel,
      collectedPlacementIdsByLevel:
        savedProgress.collectedPlacementIdsByLevel,
      dialogueFlags: savedProgress.dialogueFlags,
      activeUI: null,
      battleEnemy: null,
    }));
    setIsHydrated(true);
  }, [
    setCharacterName,
    setCurrentDay,
    setCurrentLevelId,
    setKnowledge,
    setOverworldState,
  ]);

  useEffect(() => {
    if (!isHydrated || overworldState.activeUI === 'NPC_BATTLE') return;

    const timeout = window.setTimeout(() => {
      saveGameProgress(
        buildProgress(
          currentLevelId,
          currentDay,
          knowledge,
          characterName,
          overworldState
        )
      );
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [
    characterName,
    currentDay,
    currentLevelId,
    isHydrated,
    knowledge,
    overworldState,
  ]);

  const saveNow = useCallback(() => {
    if (overworldStateRef.current.activeUI === 'NPC_BATTLE') return;

    saveGameProgress(
      buildProgress(
        currentLevelIdRef.current,
        currentDayRef.current,
        knowledgeRef.current,
        characterNameRef.current,
        overworldStateRef.current
      )
    );
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => saveNow();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveNow]);

  const captureBattleSnapshot = useCallback(
    (levelId: string, heroPositionOverride?: HeroPosition): BattleSnapshot => {
      const state = overworldStateRef.current;
      return {
        currentLevelId: currentLevelIdRef.current,
        currentDay: currentDayRef.current,
        knowledge: { ...knowledgeRef.current },
        characterName: characterNameRef.current,
        heroPositionByLevel: {
          ...state.heroPositionByLevel,
          ...(heroPositionOverride
            ? { [levelId]: heroPositionOverride }
            : {}),
        },
        completedBattleIds: [...state.completedBattleIds],
        collectedPlacementIdsByLevel: Object.fromEntries(
          Object.entries(state.collectedPlacementIdsByLevel).map(
            ([mapId, placementIds]) => [mapId, [...placementIds]]
          )
        ),
        dialogueFlags: [...state.dialogueFlags],
      };
    },
    []
  );

  const restoreBattleSnapshot = useCallback((snapshot: BattleSnapshot) => {
    setCurrentDay(snapshot.currentDay);
    setKnowledge(snapshot.knowledge);
    setCurrentLevelId(snapshot.currentLevelId);
    setCharacterName(snapshot.characterName);
    setOverworldState((previous) => ({
      ...previous,
      activeUI: null,
      battleEnemy: null,
      completedBattleIds: [...snapshot.completedBattleIds],
      heroPositionByLevel: { ...snapshot.heroPositionByLevel },
      collectedPlacementIdsByLevel: Object.fromEntries(
        Object.entries(snapshot.collectedPlacementIdsByLevel).map(
          ([mapId, placementIds]) => [mapId, [...placementIds]]
        )
      ),
      dialogueFlags: [...snapshot.dialogueFlags],
    }));

    saveGameProgress({
      version: 1,
      ...snapshot,
      watchedLessonDays: overworldStateRef.current.watchedLessonDays,
      savedAt: new Date().toISOString(),
    });
  }, [setCharacterName, setCurrentDay, setCurrentLevelId, setKnowledge, setOverworldState]);

  const updateHeroPosition = useCallback(
    (levelId: string, position: HeroPosition) => {
      setOverworldState((previous) => ({
        ...previous,
        heroPositionByLevel: {
          ...previous.heroPositionByLevel,
          [levelId]: position,
        },
      }));
    },
    [setOverworldState]
  );

  const markPlacementCollected = useCallback(
    (levelId: string, placementId: number) => {
      setOverworldState((previous) => {
        const collectedIds =
          previous.collectedPlacementIdsByLevel[levelId] ?? [];
        if (collectedIds.includes(placementId)) return previous;

        return {
          ...previous,
          collectedPlacementIdsByLevel: {
            ...previous.collectedPlacementIdsByLevel,
            [levelId]: [...collectedIds, placementId],
          },
        };
      });
    },
    [setOverworldState]
  );

  const addDialogueFlag = useCallback(
    (flag: string) => {
      setOverworldState((previous) => {
        if (previous.dialogueFlags.includes(flag)) return previous;
        return {
          ...previous,
          dialogueFlags: [...previous.dialogueFlags, flag],
        };
      });
    },
    [setOverworldState]
  );

  const markLessonWatched = useCallback(
    (day: number) => {
      setOverworldState((previous) => {
        if (previous.watchedLessonDays.includes(day)) return previous;

        return {
          ...previous,
          watchedLessonDays: [...previous.watchedLessonDays, day],
        };
      });
    },
    [setOverworldState]
  );

  const resetProgress = useCallback(() => {
    const initialProgress = createInitialGameProgress();
    clearGameProgress();
    setCurrentDay(initialProgress.currentDay);
    setKnowledge(initialProgress.knowledge);
    setCurrentLevelId(initialProgress.currentLevelId);
    setCharacterName(initialProgress.characterName);
    setOverworldState((previous) => ({
      ...previous,
      activeUI: null,
      battleEnemy: null,
      completedBattleIds: [],
      heroPositionByLevel: {},
      collectedPlacementIdsByLevel: {},
      watchedLessonDays: [],
      dialogueFlags: [],
    }));
  }, [setCharacterName, setCurrentDay, setCurrentLevelId, setKnowledge, setOverworldState]);

  const contextValue = useMemo(
    () => ({
      saveNow,
      captureBattleSnapshot,
      restoreBattleSnapshot,
      updateHeroPosition,
      markPlacementCollected,
      addDialogueFlag,
      markLessonWatched,
      resetProgress,
    }),
    [
      addDialogueFlag,
      captureBattleSnapshot,
      markPlacementCollected,
      markLessonWatched,
      resetProgress,
      restoreBattleSnapshot,
      saveNow,
      updateHeroPosition,
    ]
  );

  if (!isHydrated) return null;

  return (
    <GameProgressContext.Provider value={contextValue}>
      {children}
    </GameProgressContext.Provider>
  );
}

export function useGameProgress(): GameProgressContextValue {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error('useGameProgress must be used inside GameProgressProvider');
  }
  return context;
}
