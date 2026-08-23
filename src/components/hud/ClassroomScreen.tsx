import { useRecoilState, useRecoilValue } from 'recoil';
import { overworldStateAtom } from '@/atoms/overworldStateAtom';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { getLessonByDay } from '@/data/pythonCourse';

export default function ClassroomScreen() {
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const lesson = getLessonByDay(currentDay);

  if (overworldState.activeUI !== 'CLASSROOM') return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {lesson ? `Dia ${lesson.day}: ${lesson.title}` : 'Curso concluído'}
        </h2>
        {lesson ? (
          <iframe
            className="aspect-video bg-gray-200 w-full rounded mb-6"
            src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="aspect-video bg-gray-200 w-full rounded flex justify-center items-center mb-6">
            <span className="text-gray-500">Todas as aulas disponíveis foram concluídas.</span>
          </div>
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
