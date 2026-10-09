import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useRecoilValue } from "recoil";
import { overworldActiveUISelector } from "@/atoms/overworldStateAtom";
import {
  isSfxMuted,
  setClassroomAudioOpen,
  startAmbient,
  stopAmbient,
  subscribeSfxMuted,
  toggleSfxMuted,
} from "@/services/sfx";

export default function SfxControls() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const [muted, setMuted] = useState(isSfxMuted());

  useEffect(() => {
    startAmbient();
    const unlock = () => startAmbient();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    const unsubscribe = subscribeSfxMuted(setMuted);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      unsubscribe();
      stopAmbient();
    };
  }, []);

  useEffect(() => {
    setClassroomAudioOpen(activeUI === "CLASSROOM");
  }, [activeUI]);

  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={muted ? "Ativar sons" : "Silenciar sons"}
      title={muted ? "Ativar sons" : "Silenciar sons"}
      className="absolute top-6 right-52 z-40 flex items-center gap-2 rounded-2xl border-2 border-amber-500 bg-amber-50 px-4 py-2.5 font-bold text-slate-950 shadow-sm transition-colors hover:bg-amber-100"
      onClick={toggleSfxMuted}
    >
      {muted ? <VolumeX className="h-5 w-5" strokeWidth={3} /> : <Volume2 className="h-5 w-5" strokeWidth={3} />}
      {/* {muted ? "Mudo" : "Som"} */}
    </button>
  );
}
