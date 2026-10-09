import { useSetRecoilState, useRecoilValue } from "recoil";
import { overworldActiveUISelector, overworldStateAtom } from "@/atoms/overworldStateAtom";
import { COURSE_FEEDBACK_FORM_URL } from "@/utils/consts";

export default function CourseCompleteScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);

  if (activeUI !== "COURSE_COMPLETE") return null;

  const acknowledge = () => {
    setOverworldState((previous) => ({
      ...previous,
      activeUI: null,
      courseSequenceAcknowledged: true,
    }));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-complete-title"
        className="max-h-[90%] w-3/4 max-w-xl overflow-y-auto rounded-lg bg-white p-6 text-left shadow-xl"
      >
        <h2 id="course-complete-title" className="mb-4 text-center text-2xl font-bold text-slate-900">
          Parabéns, você concluiu a sequência! 🎉
        </h2>
        <p className="mb-3 text-sm text-gray-700">
          Você terminou as 4 aulas de introdução a Python e lógica de programação do EduWars.
        </p>
        <p className="mb-3 text-sm text-gray-700">
          Agora gostaria de saber o que você achou da experiência. Suas respostas fazem parte da minha pesquisa de TCC e
          me ajudam a melhorar o jogo.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>Leva alguns minutos</li>
          <li>
            É <strong>voluntário</strong>: você pode não responder ou desistir a qualquer momento, sem nenhum prejuízo
          </li>
          <li>
            É <strong>anônimo</strong>: o questionário não pede nome, e-mail ou outros dados que identifiquem você (o
            Google Forms pode exigir login com uma conta Google, mas seus dados não serão compartilhados)
          </li>
          <li>O texto de consentimento está no início do formulário. Leia antes de decidir participar</li>
        </ul>
        <p className="mb-5 text-center text-sm font-semibold text-slate-800">Obrigado por jogar!</p>
        <div className="flex flex-col items-center gap-3">
          <a
            href={COURSE_FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-blue-600 px-6 py-2 text-center font-bold text-white transition-colors hover:bg-blue-700 cursor-pointer"
            onClick={acknowledge}
          >
            Responder ao questionário
          </a>
          <button
            type="button"
            className="text-sm font-semibold text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
            onClick={acknowledge}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
