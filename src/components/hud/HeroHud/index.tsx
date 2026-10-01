import { BookOpen, Sun } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { overworldActiveUISelector } from '@/atoms/overworldStateAtom';
import { NineSliceBox } from './NineSliceBox';
import { KnowledgeBar } from './KnowledgeBar';
import { memo } from 'react';

function HeroHud() {
  const currentDay = useRecoilValue(currentDayAtom);
  const activeUI = useRecoilValue(overworldActiveUISelector);

  return (
    <div className="absolute left-6 top-6 z-50">
      <NineSliceBox scale={4}>
        <div className="flex items-center gap-4">
          {/* Day Indicator Pill */}
          <div className="bg-yellow-400 rounded-2xl px-4 py-1 font-bold flex items-center gap-2 text-slate-950 shadow-sm border-2 border-yellow-500">
            <Sun
              className="w-5 h-5 fill-slate-950"
              strokeWidth={3}
            />
            <span className="text-lg tracking-wider">DIA {currentDay}</span>
          </div>

          {/* Knowledge Diary button */}
          <button
            type="button"
            aria-label="Abrir Diário do Conhecimento"
            title="Diário do Conhecimento"
            disabled={activeUI !== null}
            className="bg-amber-50 rounded-2xl px-4 py-1 font-bold flex items-center gap-2 text-slate-950 shadow-sm border-2 border-amber-500 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (activeUI !== null) return;
              // Same overlay flow used by the classroom, locker and NPC dialogue.
              window.dispatchEvent(
                new CustomEvent('OVERWORLD_UI_TOGGLE', {
                  detail: 'DIARY',
                })
              );
            }}
          >
            <BookOpen
              className="w-5 h-5"
              strokeWidth={3}
            />
            <span className="text-lg tracking-wider">DIÁRIO</span>
          </button>
        </div>

        {/* Knowledge Bar overlapping the bottom edge */}
        <KnowledgeBar />
      </NineSliceBox>
    </div>
  );
}

export default memo(HeroHud);
