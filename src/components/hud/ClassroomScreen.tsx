import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import {
  overworldActiveUISelector,
  overworldStateAtom,
} from '@/atoms/overworldStateAtom';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { getLessonByDay } from '@/data/pythonCourse';
import { useGameProgress } from '@/contexts/GameProgressContext';
import { loadYouTubeIframeApi, YouTubePlayer } from '@/services/youtubeIframeApi';

export default function ClassroomScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const lesson = getLessonByDay(currentDay);
  const { markLessonWatched } = useGameProgress();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    if (activeUI !== 'CLASSROOM' || !lesson) return;

    let cancelled = false;
    setLessonCompleted(false);

    loadYouTubeIframeApi()
      .then((api) => {
        if (cancelled || !iframeRef.current) return;

        playerRef.current?.destroy();
        playerRef.current = new api.Player(iframeRef.current, {
          events: {
            onStateChange: (event) => {
              if (event.data !== api.PlayerState.ENDED) return;

              setLessonCompleted(true);
              markLessonWatched(lesson.day);
            },
          },
        });
      })
      .catch(() => {
        // The iframe remains usable if the optional completion API is unavailable.
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [lesson, markLessonWatched, activeUI]);

  if (activeUI !== 'CLASSROOM') return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {lesson ? `Dia ${lesson.day}: ${lesson.title}` : 'Curso concluído'}
        </h2>
        {lesson ? (
          <iframe
            ref={iframeRef}
            className="aspect-video bg-gray-200 w-full rounded mb-6"
            src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?enablejsapi=1`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="aspect-video bg-gray-200 w-full rounded flex justify-center items-center mb-6">
            <span className="text-gray-500">Todas as aulas disponíveis foram concluídas.</span>
          </div>
        )}

        {lessonCompleted && (
          <p className="mb-4 text-sm font-semibold text-green-700">
            Aula concluída! A batalha do dia está liberada.
          </p>
        )}
        
        <div className="flex justify-end mt-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
            onClick={() => {
              setOverworldState((prev) => ({ ...prev, activeUI: null }));
            }}
          >
            Sair da Aula
          </button>
        </div>
      </div>
    </div>
  );
}
