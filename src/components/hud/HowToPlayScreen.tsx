import { ClipboardIcon, HelpCircle } from "lucide-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { overworldActiveUISelector, overworldStateAtom } from "@/atoms/overworldStateAtom";
import { COURSE_FEEDBACK_FORM_URL } from "@/utils/consts";

export default function HowToPlayScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);

  const openInstructions = () => {
    if (activeUI !== null) return;
    window.dispatchEvent(
      new CustomEvent("OVERWORLD_UI_TOGGLE", {
        detail: "HOW_TO_PLAY",
      }),
    );
  };

  const closeInstructions = () => {
    setOverworldState((previous) => ({ ...previous, activeUI: null }));
  };

  return (
    <>
      <button
        type="button"
        className="absolute top-6 right-6 z-40 flex items-center gap-2 rounded-2xl border-2 border-amber-500 bg-amber-50 px-4 py-2 font-bold text-slate-950 shadow-sm transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={activeUI !== null}
        onClick={openInstructions}
      >
        <HelpCircle className="h-5 w-5" strokeWidth={3} />
        Como jogar?
      </button>

      <a
        href={COURSE_FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute cursor-pointer bottom-6 right-6 z-40 flex flex-col justify-center items-center rounded-2xl border-2 border-amber-500 bg-amber-50 px-4 py-2 font-bold text-slate-950 shadow-sm transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center gap-2">
          <ClipboardIcon className="h-5 w-5" strokeWidth={3} />
          Responda ao questionário
        </div>
        <span className="text-sm text-muted-foreground">{"É pro meu TCC (ɔ◔‿◔)ɔ ♥"}</span>
      </a>

      {activeUI === "HOW_TO_PLAY" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-play-title"
            className="w-3/4 max-w-lg rounded-lg bg-white p-6 text-left shadow-xl"
          >
            <h2 id="how-to-play-title" className="mb-4 text-center text-2xl font-bold text-slate-900">
              Como jogar?
            </h2>
            <ul className="mb-6 list-disc space-y-3 pl-5 text-sm text-gray-700">
              <li>Todo dia, assista à aula primeiro. A batalha do dia só é liberada depois da aula.</li>
              <li>Em seguida, encontre o campo de batalha. Ele pode estar em qualquer lugar do campus da faculdade.</li>
              <li>Ao avançar nos desafios, seu conhecimento geral aumenta.</li>
            </ul>
            <div className="flex justify-center">
              <button
                type="button"
                className="rounded bg-blue-600 px-6 py-2 font-bold text-white transition-colors hover:bg-blue-700"
                onClick={closeInstructions}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
