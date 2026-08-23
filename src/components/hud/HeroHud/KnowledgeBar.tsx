import React from 'react';
import { useRecoilValue } from 'recoil';
import { knowledgeStateAtom } from '@/atoms/knowledgeStateAtom';
import { NineSliceBox } from './NineSliceBox';

export function KnowledgeBar() {
  const knowledge = useRecoilValue(knowledgeStateAtom);
  const percentage = Math.max(0, Math.min(100, (knowledge.current / knowledge.max) * 100));

  return (
    <div className="absolute -bottom-14 left-8 z-20 flex flex-col gap-1.5 w-[240px]">
      <div 
        className="text-white font-bold text-sm tracking-wider uppercase ml-4 relative z-30 drop-shadow-md translate-y-2" 
        style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
      >
        <p className="relative -left-2">Conhecimento: {knowledge.current}/{knowledge.max}</p>
      </div>
      
      <NineSliceBox 
        spriteDir="/hud-sprites/container" 
        scale={4}
        width={"100%"}
        height={40}
        fillPercentage={percentage}
        fillSprite="/hud-sprites/knowledge-bar/center.png"
        fillInsetX={16}
        fillInsetY={10}
      />
    </div>
  );
}
