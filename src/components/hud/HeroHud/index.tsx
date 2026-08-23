import { Sun } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { currentDayAtom } from '@/atoms/currentDayAtom';
import { NineSliceBox } from './NineSliceBox';
import { KnowledgeBar } from './KnowledgeBar';

export function HeroHud({ level }: any) {
  const currentDay = useRecoilValue(currentDayAtom);

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

          {/* Spacer if we need to add more items inside the box later */}
          <div className="w-12" />
        </div>

        {/* Knowledge Bar overlapping the bottom edge */}
        <KnowledgeBar />
      </NineSliceBox>
    </div>
  );
}
