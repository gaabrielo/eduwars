import { forwardRef, memo, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import HTMLFlipBook from "react-pageflip";
import { AlertTriangle, BookOpen, Check, ChevronLeft, ChevronRight, GraduationCap, Star, X } from "lucide-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { overworldActiveUISelector, overworldStateAtom } from "@/atoms/overworldStateAtom";
import { currentDayAtom } from "@/atoms/currentDayAtom";
import { diaryAtom } from "@/atoms/diaryAtom";
import { PYTHON_COURSE } from "@/data/pythonCourse";
import { getDiaryConcept } from "@/data/pythonConcepts";
import { aggregateConceptMisses, getConceptRelatedDays, getDayStatus } from "@/services/diary";
import type { DiaryDayEntry, DiaryDayStatus, DiaryState } from "@/types/diary";

// react-pageflip exposes no public type for the imperative handle; this
// structural type covers the flip methods used here.
interface DiaryBookHandle {
  pageFlip(): {
    flipNext(): void;
    flipPrev(): void;
  };
}

interface DiaryPageProps {
  children: ReactNode;
  className?: string;
  pageName?: string;
}

const DiaryPage = forwardRef<HTMLDivElement, DiaryPageProps>(({ className = "", children, pageName }, ref) => (
  // The outer div is the element react-pageflip controls (it rewrites its
  // inline styles every frame); it must carry NO classes that could fight
  // those inline styles (Tailwind is configured with `important: true`,
  // so any utility here would override the library's page geometry).
  <div ref={ref} data-page={pageName}>
    <div className={`h-full w-full ${className}`}>{children}</div>
  </div>
));
DiaryPage.displayName = "DiaryPage";

const DIARY_STATUS_ORDER: DiaryDayStatus[] = ["NAO_INICIADA", "AULA_ASSISTIDA", "DESAFIO_CONCLUIDO"];

const STATUS_META: Record<DiaryDayStatus, { icon: string; text: string }> = {
  NAO_INICIADA: { icon: "○", text: "Não iniciada" },
  AULA_ASSISTIDA: { icon: "✓", text: "Aula assistida" },
  DESAFIO_CONCLUIDO: { icon: "★", text: "Aula + desafio concluídos" },
};

/**
 * Hand-drawn "crossed off" stroke laid over a completed status line. Two
 * slightly uneven passes mimic a pen strike; each stroke animates as if the
 * player just crossed it out (see `diary-strike-draw` in globals.css).
 */
function HandwrittenStrike() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      className="diary-strike pointer-events-none absolute -left-1 top-1/2 h-3.5 w-[calc(100%+0.5rem)] -translate-y-1/2"
    >
      <path
        d="M2 8 C 18 6.4, 36 9.2, 54 7.2 S 94 8.8, 118 6.2"
        fill="none"
        stroke="rgba(68, 63, 58, 0.75)"
        strokeWidth="1.7"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 0,
          animation: "diary-strike-draw 0.45s ease-out",
        }}
      />
      <path
        d="M5 9.8 C 28 8.6, 60 10.6, 86 8.4 S 108 9.2, 116 8"
        fill="none"
        stroke="rgba(68, 63, 58, 0.45)"
        strokeWidth="1"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 0,
          animation: "diary-strike-draw 0.45s ease-out 0.15s backwards",
        }}
      />
    </svg>
  );
}

/**
 * All three progression steps are always visible, like activities written on
 * a notebook page; completed ones are struck through and the current one is
 * highlighted with a marker swipe.
 */
function DayProgressStatus({ status }: { status: DiaryDayStatus }) {
  const currentIndex = DIARY_STATUS_ORDER.indexOf(status);

  return (
    <div>
      <ul className="flex flex-col gap-1.5">
        {DIARY_STATUS_ORDER.map((step, index) => {
          const meta = STATUS_META[step];
          const done = index < currentIndex;
          const current = index === currentIndex;

          return (
            <li
              key={step}
              aria-current={current ? "step" : undefined}
              className="relative flex w-fit items-center gap-2 px-1 text-sm leading-snug"
            >
              <span aria-hidden className={done ? "text-slate-300" : current ? "text-amber-700" : "text-slate-400"}>
                {meta.icon}
              </span>
              <span
                className={
                  done
                    ? "text-slate-400"
                    : current
                      ? "rounded-sm bg-yellow-300/60 px-1 font-bold text-slate-900"
                      : "text-slate-500"
                }
              >
                {meta.text}
              </span>
              {done && <HandwrittenStrike />}
            </li>
          );
        })}
      </ul>
      <p className="sr-only">Status atual: {STATUS_META[status].text}</p>
    </div>
  );
}

function ConceptChip({
  conceptId,
  misses,
  onClick,
  tone,
}: {
  conceptId: string;
  misses?: number;
  onClick: (conceptId: string) => void;
  tone: "review" | "taught";
}) {
  const concept = getDiaryConcept(conceptId);
  const label = concept?.label ?? conceptId;

  return (
    <button
      type="button"
      className={`rounded-lg border px-2 py-1 text-left text-xs font-semibold transition-colors ${
        tone === "review"
          ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
          : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100"
      }`}
      onClick={() => onClick(conceptId)}
    >
      {tone === "review" ? "⚠ " : ""}
      {label}
      {misses !== undefined && misses > 0 ? ` · ${misses} erro${misses > 1 ? "s" : ""}` : ""}
    </button>
  );
}

function DayPageBody({
  lesson,
  dayEntry,
  status,
  isCurrentDay,
  onConceptClick,
}: {
  lesson: (typeof PYTHON_COURSE)[number];
  dayEntry: DiaryDayEntry | undefined;
  status: DiaryDayStatus;
  isCurrentDay: boolean;
  onConceptClick: (conceptId: string) => void;
}) {
  const dayData = dayEntry;
  const best = dayData?.best ?? null;
  const last = dayData?.last ?? null;
  const answeredCount = dayData?.answeredCount ?? 0;
  const correctCount = dayData?.correctCount ?? 0;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;

  return (
    <div className="flex h-full flex-col gap-3 border-x border-amber-200 bg-amber-50 p-5 text-slate-800">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-amber-700">Dia {lesson.day}</p>
          {isCurrentDay && (
            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
              DIA ATUAL
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold leading-tight text-slate-900">{lesson.title}</h3>
      </div>

      <DayProgressStatus status={status} />

      {dayData && (
        <div className="rounded-lg border border-slate-200 bg-white/70 p-3 text-xs">
          <p className="mb-2 text-xs font-bold text-slate-500">Desempenho</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <span className="text-slate-500">Tentativas:</span>
            <span className="font-semibold">{dayData.attempts.length}</span>
            <span className="text-slate-500">Melhor resultado:</span>
            <span className="font-semibold">{best ? `${best.correctCount}/${best.questionTotal}` : "sem vitória"}</span>
            <span className="text-slate-500">Última tentativa:</span>
            <span className="font-semibold">
              {last
                ? `${last.correctCount}/${last.questionTotal}${last.outcome === "VICTORY" ? " (vitória)" : " (derrota)"}`
                : "-"}
            </span>
            <span className="text-slate-500">Vidas perdidas:</span>
            <span className="font-semibold">{last ? last.knowledgeLost : 0}</span>
            <span className="text-slate-500">Aproveitamento:</span>
            <span className="font-semibold">{accuracy !== null ? `${accuracy}%` : "-"}</span>
          </div>
        </div>
      )}

      {dayData && dayData.allConceptIds.length > 0 && (
        <div className="min-h-0 flex-1">
          <p className="mb-1 text-xs font-bold text-slate-500">Conceitos da aula</p>
          <div className="flex flex-wrap gap-1">
            {dayData.allConceptIds.map((conceptId) => (
              <ConceptChip key={conceptId} conceptId={conceptId} onClick={onConceptClick} tone="taught" />
            ))}
          </div>
        </div>
      )}

      {dayData && dayData.conceptMisses.length > 0 && (
        <div>
          <p className="mb-1 flex items-center gap-1 text-xs font-bold text-red-600">
            <AlertTriangle className="h-3 w-3" />
            Para revisar
          </p>
          <div className="flex flex-wrap gap-1">
            {dayData.conceptMisses.map((miss) => (
              <ConceptChip
                key={miss.conceptId}
                conceptId={miss.conceptId}
                misses={miss.misses}
                onClick={onConceptClick}
                tone="review"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewPageBody({
  diary,
  watchedLessonDays,
  completedBattleIds,
  onConceptClick,
}: {
  diary: DiaryState;
  watchedLessonDays: number[];
  completedBattleIds: string[];
  onConceptClick: (conceptId: string) => void;
}) {
  const watchedCount = PYTHON_COURSE.filter((lesson) => watchedLessonDays.includes(lesson.day)).length;
  const challengesDone = PYTHON_COURSE.filter(
    (lesson) =>
      getDayStatus(lesson.day, {
        watchedLessonDays,
        completedBattleIds,
      }) === "DESAFIO_CONCLUIDO",
  ).length;
  const answeredCount = diary.days.reduce((total, dayEntry) => total + dayEntry.answeredCount, 0);
  const correctCount = diary.days.reduce((total, dayEntry) => total + dayEntry.correctCount, 0);
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;
  const conceptMisses = aggregateConceptMisses(diary);

  return (
    <div className="flex h-full flex-col gap-3 border-x border-amber-200 bg-amber-50 p-5 text-slate-800">
      <div>
        <p className="text-xs font-bold text-amber-700">Sequência didática</p>
        <h3 className="text-lg font-bold text-slate-900">Resumo da jornada</h3>
      </div>

      <div className="grid grid-cols-1 gap-1 rounded-lg border border-slate-200 bg-white/70 p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Aulas concluídas:</span>
          <span className="font-bold">
            {watchedCount}/{PYTHON_COURSE.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Desafios concluídos:</span>
          <span className="font-bold">
            {challengesDone}/{PYTHON_COURSE.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Questões respondidas:</span>
          <span className="font-bold">{answeredCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Acertos:</span>
          <span className="font-bold">{correctCount}</span>
        </div>
        {accuracy !== null && (
          <div className="flex justify-between">
            <span className="text-slate-500">Aproveitamento:</span>
            <span className="font-bold">{accuracy}%</span>
          </div>
        )}
      </div>

      {conceptMisses.length > 0 && (
        <div className="min-h-0 flex-1">
          <p className="mb-1 flex items-center gap-1 text-xs font-bold text-red-600">
            <AlertTriangle className="h-3 w-3" />
            Conceitos para revisar
          </p>
          <div className="flex flex-col gap-1">
            {conceptMisses.map((miss) => (
              <ConceptChip
                key={miss.conceptId}
                conceptId={miss.conceptId}
                misses={miss.misses}
                onClick={onConceptClick}
                tone="review"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface KnowledgeDiaryBookProps {
  diary: DiaryState;
  watchedLessonDays: number[];
  completedBattleIds: string[];
  currentDay: number;
  onConceptClick: (conceptId: string) => void;
}

const PAGE_WIDTH = 340;
const PAGE_HEIGHT = 470;

function KnowledgeDiaryBook({
  diary,
  watchedLessonDays,
  completedBattleIds,
  currentDay,
  onConceptClick,
}: KnowledgeDiaryBookProps) {
  const bookRef = useRef<DiaryBookHandle>(null);
  const [bookPage, setBookPage] = useState(0);

  // Pages are memoized so react-pageflip never receives a changing children
  // array while the book is open (it re-initializes pages on every change).
  const pages = useMemo(
    () => [
      <DiaryPage
        key="cover"
        pageName="cover"
        className="flex flex-col items-center justify-center gap-3 rounded-l-xl border-4 border-amber-950/60 bg-green-900 p-6 text-center text-yellow-100 shadow-inner"
      >
        <BookOpen className="h-12 w-12 text-yellow-200" />
        <h2 className="text-2xl font-black leading-tight">DIÁRIO DO CONHECIMENTO</h2>
        <GraduationCap className="h-8 w-8 text-yellow-400" />
        <p className="text-xs text-yellow-100/80">Sua jornada de aprendizado em Python</p>
        <p className="text-[10px] text-yellow-100/60">Arraste ou clique nas bordas para folhear</p>
      </DiaryPage>,
      <DiaryPage key="overview" pageName="overview">
        <OverviewPageBody
          diary={diary}
          watchedLessonDays={watchedLessonDays}
          completedBattleIds={completedBattleIds}
          onConceptClick={onConceptClick}
        />
      </DiaryPage>,
      ...PYTHON_COURSE.map((lesson) => {
        const status = getDayStatus(lesson.day, {
          watchedLessonDays,
          completedBattleIds,
        });
        const dayEntry = diary.days.find((entry) => entry.day === lesson.day);
        return (
          <DiaryPage key={`day-${lesson.day}`} pageName={`day-${lesson.day}`}>
            <DayPageBody
              lesson={lesson}
              dayEntry={dayEntry}
              status={status}
              isCurrentDay={currentDay === lesson.day}
              onConceptClick={onConceptClick}
            />
          </DiaryPage>
        );
      }),
      <DiaryPage
        key="back"
        pageName="back"
        className="flex flex-col items-center justify-center gap-2 rounded-r-xl border-4 border-amber-950/60 bg-green-900 p-6 text-center text-yellow-100"
      >
        <Star className="h-8 w-8 text-yellow-300" />
        <p className="text-sm font-bold">Continue estudando!</p>
        <p className="text-xs text-yellow-100/80">Cada aula assistida e cada desafio vencido fica registrado aqui.</p>
      </DiaryPage>,
    ],
    [diary, watchedLessonDays, completedBattleIds, currentDay, onConceptClick],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      {/* When the book is closed on the cover, StPageFlip draws the cover on
          the right half of the landscape block; slide the block left so the
          cover appears centered in the overlay. */}
      <div
        className="transition-transform duration-300"
        style={{
          transform: `translateX(${bookPage === 0 ? -PAGE_WIDTH / 2 : 0}px)`,
        }}
      >
        <HTMLFlipBook
          ref={bookRef}
          className="diary-book"
          style={{}}
          startPage={0}
          size="fixed"
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          minWidth={PAGE_WIDTH}
          maxWidth={PAGE_WIDTH}
          minHeight={PAGE_HEIGHT}
          maxHeight={PAGE_HEIGHT}
          drawShadow
          flippingTime={700}
          usePortrait={false}
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={0.5}
          showCover
          mobileScrollSupport={false}
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          onInit={(event) => {
            const page = (event as { data?: { page?: unknown } }).data?.page;
            if (typeof page === "number") setBookPage(page);
          }}
          onFlip={(event) => {
            const page = (event as { data?: unknown }).data;
            if (typeof page === "number") setBookPage(page);
          }}
        >
          {pages}
        </HTMLFlipBook>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Página anterior"
          className="rounded-full border-2 border-amber-500 bg-amber-50 p-2 text-slate-900 transition-colors hover:bg-amber-100"
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próxima página"
          className="rounded-full border-2 border-amber-500 bg-amber-50 p-2 text-slate-900 transition-colors hover:bg-amber-100"
          onClick={() => bookRef.current?.pageFlip().flipNext()}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function ConceptReviewPanel({
  conceptId,
  diary,
  onClose,
}: {
  conceptId: string;
  diary: DiaryState;
  onClose: () => void;
}) {
  const concept = getDiaryConcept(conceptId);
  const relatedDays = getConceptRelatedDays(conceptId);
  const totalMisses = aggregateConceptMisses(diary).find((miss) => miss.conceptId === conceptId);

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-amber-700">Conceito</p>
            <h3 className="text-xl font-bold text-slate-900">{concept?.label ?? conceptId}</h3>
          </div>
          <button
            type="button"
            aria-label="Fechar conceito"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-700">{concept?.explanation ?? "Conceito sem descrição cadastrada."}</p>

        {totalMisses && totalMisses.misses > 0 && (
          <p className="mb-2 flex items-center gap-1 text-sm font-bold text-red-600">
            <AlertTriangle className="h-4 w-4" />
            {totalMisses.misses} erro{totalMisses.misses > 1 ? "s" : ""} registrado
            {totalMisses.misses > 1 ? "s" : ""} no diário
          </p>
        )}

        {relatedDays.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-bold text-slate-500">Relacionado às aulas</p>
            <ul className="text-sm text-slate-700">
              {relatedDays.map((day) => {
                const lesson = PYTHON_COURSE.find((entry) => entry.day === day);
                return (
                  <li key={day} className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    Dia {day} · {lesson?.title ?? ""}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function KnowledgeDiaryScreen() {
  const activeUI = useRecoilValue(overworldActiveUISelector);
  const setOverworldState = useSetRecoilState(overworldStateAtom);
  const currentDay = useRecoilValue(currentDayAtom);
  const overworldState = useRecoilValue(overworldStateAtom);
  const diary = useRecoilValue(diaryAtom);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  // Closing the diary must also drop any open concept panel.
  useEffect(() => {
    if (activeUI !== "DIARY" && selectedConceptId !== null) {
      setSelectedConceptId(null);
    }
  }, [activeUI, selectedConceptId]);

  if (activeUI !== "DIARY") return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 font-handwriting">
      <KnowledgeDiaryBook
        diary={diary}
        watchedLessonDays={overworldState.watchedLessonDays}
        completedBattleIds={overworldState.completedBattleIds}
        currentDay={currentDay}
        onConceptClick={setSelectedConceptId}
      />

      <button
        type="button"
        className="mt-3 rounded bg-blue-600 px-6 py-2 font-bold text-white transition-colors hover:bg-blue-700 font-sans"
        onClick={() => {
          setOverworldState((previous) => ({ ...previous, activeUI: null }));
        }}
      >
        Fechar Diário
      </button>

      {selectedConceptId !== null && (
        <ConceptReviewPanel conceptId={selectedConceptId} diary={diary} onClose={() => setSelectedConceptId(null)} />
      )}
    </div>
  );
}

export default memo(KnowledgeDiaryScreen);
