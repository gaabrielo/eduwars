import React from "react";
import { useRecoilValue } from "recoil";
import { knowledgeStateAtom } from "@/atoms/knowledgeStateAtom";

export function KnowledgeBar() {
  const knowledge = useRecoilValue(knowledgeStateAtom);
  const percentage =
    knowledge.max > 0
      ? Math.max(0, Math.min(100, (knowledge.current / knowledge.max) * 100))
      : 0;

  return (
    <div className="absolute -bottom-14 left-8 z-20 flex flex-col gap-1.5 w-[240px]">
      <div
        className="text-white font-bold text-sm tracking-wider uppercase ml-4 relative z-30 drop-shadow-md translate-y-2"
        style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000" }}
      >
        <p className="relative -left-2">
          Conhecimento: {knowledge.current}/{knowledge.max}
        </p>
      </div>

      <div className="knowledge-bar-frame relative h-10 w-full bg-[#1c140c]">
        <div className="knowledge-bar-track absolute bg-[#3a2a1a]" />
        <div
          className="knowledge-bar-fill absolute bg-amber-400"
          style={{ width: `calc((100% - 32px) * ${percentage / 100})` }}
        />
      </div>
    </div>
  );
}
