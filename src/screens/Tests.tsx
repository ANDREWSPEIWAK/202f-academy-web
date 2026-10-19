import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProgressStore } from '../store';
import { recipes, ttkCategories } from '../data/recipes';
import { examBlocks, examQuestions } from '../data/exam';
import { serviceCases } from '../data/cases';
import { ProgressRing, Bar, Pill, SectionHead, EmptyNote } from '../components/app-ui';
import { cn } from '../lib/utils';

type Mode = 'quiz' | 'blitz' | 'exam' | 'cases';
type Phase = 'hub' | 'play' | 'result';
type OptionState = 'idle' | 'right' | 'wrong' | 'dim';

type QuizKind = 'recipe' | 'cards' | 'first-step';

interface QuizQuestion {
  id: string;
  kind: QuizKind;
  prompt: string;
  options: string[];
  correctIndex: number;
}

const QUIZ_KINDS: QuizKind[] = ['recipe', 'cards', 'first-step'];

function genQuiz(n: number): QuizQuestion[] {
  const pool = [...recipes]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(n, recipes.length));
  return pool.map((r, i) => {
    const kind = QUIZ_KINDS[i % QUIZ_KINDS.length];
    let prompt = '';
    let correct = '';
    let distractors: string[] = [];
    if (kind === 'recipe') {
      prompt = `Рецепт «${r.name}»?`;
      correct = r.recipe.ru;
      distractors = recipes.filter((x) => x.id !== r.id).slice(0, 3).map((x) => x.recipe.ru);
    } else if (kind === 'first-step') {
      prompt = `Первый шаг «${r.name}»?`;
      correct = r.steps.ru[0];
      distractors = recipes.filter((x) => x.id !== r.id).slice(0, 3).map((x) => x.steps.ru[0]);
    } else {
      prompt = `Какой напиток: "${r.taste.ru}"?`;
      correct = r.name;
      distractors = recipes.filter((x) => x.id !== r.id).slice(0, 3).map((x) => x.name);
    }
    const mapped = [correct, ...distractors]
      .map((text, idx) => ({ text, idx }))
      .sort(() => Math.random() - 0.5);
    const options = mapped.map((o) => o.text);
    const correctIndex = mapped.findIndex((o) => o.idx === 0);
    return { id: `${r.id}-${kind}`, kind, prompt, options, correctIndex };
  });
}

interface ModeCardProps {
  m: { id: Mode; title: string; sub: string; stat: string; color: string; icon: string };
  index: number;
  active: boolean;
  onClick: () => void;
}

function ModeCard({ m, index, active, onClick }: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'anim-rise relative flex flex-col rounded-2xl border p-4 transition-all duration-200',
        active ? 'bg-[#222a2a]' : 'bg-[#1a2121]/60 hover:border-[#33403f]',
      )}
      style={{ borderColor: m.color, animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{m.icon}</span>
        <Pill color={m.color}>{m.stat}</Pill>
      </div>
      <h3 className="text-xl font-bold">{m.title}</h3>
      <p className="mt-1 text-xs text-[#6b6b5c] uppercase tracking-wider">{m.sub}</p>
    </button>
  );
}

interface OptionBtnProps {
  text: string;
  state: OptionState;
  onClick?: () => void;
}

function OptionBtn({ text, state, onClick }: OptionBtnProps) {
  const base = 'w-full py-2.5 px-3 rounded-xl border text-sm font-semibold text-left transition-colors';
  const look: Record<OptionState, string> = {
    idle: `${base} border-[#33403f] bg-[#222a2a] text-[#E2DAC2]`,
    right: `${base} border-[#4FBBBC] bg-[#4FBBBC] text-[#0b1414]`,
    wrong: `${base} border-[#EC4624] bg-[#EC4624] text-white`,
    dim: `${base} border-[#33403f] bg-[#1a2121] text-[#6b6b5c]`,
  };
  return (
    <button type="button" disabled={state !== 'idle'} onClick={onClick} className={look[state]}>
      {text}
    </button>
  );
}

const Tests: React.FC = () => {
  const store = useProgressStore();
  const { quizBest, blitzBest, examKnown, casesScore, recordQuiz, recordBlitz, recordExam, recordCase, dayOpened } = store;

  const examTotal = Object.values(examKnown).filter(Boolean).length;
  const casesPerfect = Object.values(casesScore).filter((s) => s === 2).length;

  const [mode, setMode] = useState<Mode>('quiz');
  const [phase, setPhase] = useState<Phase>('hub');

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(0);

  const [blitzQuestion, setBlitzQuestion] = useState<QuizQuestion | null>(null);
  const [blitzSelected, setBlitzSelected] = useState<number | null>(null);
  const [blitzRevealed, setBlitzRevealed] = useState(false);
  const blitzCorrectRef = useRef(0);

  const [timeLeft, setTimeLeft] = useState(60);
  const blitzTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [examIdx, setExamIdx] = useState(0);
  const [examRevealed, setExamRevealed] = useState(false);

  const [caseIdx, setCaseIdx] = useState(0);
  const [caseRevealed, setCaseRevealed] = useState(false);

  const modeDefs = useMemo(
    () => [
      { id: 'quiz' as Mode, title: 'Квиз', sub: '10 вопросов', stat: `${quizBest}%`, color: '#4FBBBC', icon: '🧩' },
      { id: 'blitz' as Mode, title: 'Блиц', sub: '60 секунд', stat: `${blitzBest} верных`, color: '#F39120', icon: '⚡' },
      { id: 'exam' as Mode, title: 'Экзамен', sub: '40 вопросов · 4 блока', stat: `${examTotal} / 40`, color: '#EC4624', icon: '📄' },
      { id: 'cases' as Mode, title: 'Кейсы', sub: '12 ситуаций', stat: `${casesPerfect} / 12`, color: '#E2DAC2', icon: '📋' },
    ],
    [quizBest, blitzBest, examTotal, casesPerfect],
  );

  useEffect(() => {
    dayOpened();
    return () => {
      if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    };
  }, [dayOpened]);

  const endBlitz = useCallback(() => {
    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    blitzTimerRef.current = null;
    setPhase('result');
    recordBlitz(blitzCorrectRef.current);
  }, [recordBlitz]);

  const startBlitz = useCallback(() => {
    blitzCorrectRef.current = 0;
    setTimeLeft(60);
    setBlitzQuestion(genQuiz(1)[0]);
    setBlitzSelected(null);
    setBlitzRevealed(false);
    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    blitzTimerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endBlitz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [endBlitz]);

  const enterMode = useCallback((m: Mode) => {
    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    blitzTimerRef.current = null;
    setMode(m);
    setPhase('play');
    setQuiz([]);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setQuizCorrect(0);
    setBlitzQuestion(null);
    setBlitzSelected(null);
    setBlitzRevealed(false);
    blitzCorrectRef.current = 0;
    setTimeLeft(60);
    setExamIdx(0);
    setExamRevealed(false);
    setCaseIdx(0);
    setCaseRevealed(false);
    if (m === 'quiz') {
      setQuiz(genQuiz(10));
    } else if (m === 'blitz') {
      startBlitz();
    }
  }, [startBlitz]);

  const handleQuizSelect = useCallback((idx: number) => {
    if (revealed) return;
    const q = quiz[qIndex];
    if (!q) return;
    setSelected(idx);
    setRevealed(true);
    if (idx === q.correctIndex) setQuizCorrect((c) => c + 1);
  }, [revealed, quiz, qIndex]);

  const nextQuiz = useCallback(() => {
    setSelected(null);
    setRevealed(false);
    setQIndex((i) => (i + 1 < quiz.length ? i + 1 : i));
  }, [quiz.length]);

  const finishQuiz = useCallback(() => {
    const pct = quiz.length ? Math.round((quizCorrect / quiz.length) * 100) : 0;
    recordQuiz(pct);
    setPhase('result');
  }, [quiz.length, quizCorrect, recordQuiz]);

  const handleBlitzAnswer = useCallback((idx: number) => {
    if (blitzRevealed || !blitzQuestion) return;
    if (idx === blitzQuestion.correctIndex) blitzCorrectRef.current += 1;
    setBlitzSelected(idx);
    setBlitzRevealed(true);
  }, [blitzRevealed, blitzQuestion]);

  useEffect(() => {
    if (mode === 'blitz' && phase === 'play' && blitzRevealed && blitzQuestion) {
      const id = setTimeout(() => {
        setBlitzQuestion(genQuiz(1)[0]);
        setBlitzSelected(null);
        setBlitzRevealed(false);
      }, 1200);
      return () => clearTimeout(id);
    }
  }, [mode, phase, blitzRevealed, blitzQuestion]);

  const handleExamMark = useCallback((known: boolean) => {
    if (examRevealed) return;
    const q = examQuestions[examIdx];
    recordExam(q.id, known);
    setExamRevealed(true);
  }, [examRevealed, examIdx, recordExam]);

  const nextExam = useCallback(() => {
    setExamRevealed(false);
    setExamIdx((i) => (i + 1 < examQuestions.length ? i + 1 : i));
  }, [examQuestions.length]);

  const handleCasePick = useCallback((score: number) => {
    if (caseRevealed) return;
    const c = serviceCases[caseIdx];
    recordCase(c.id, score);
    setCaseRevealed(true);
  }, [caseRevealed, caseIdx, recordCase]);

  const nextCase = useCallback(() => {
    setCaseRevealed(false);
    setCaseIdx((i) => (i + 1 < serviceCases.length ? i + 1 : i));
  }, [serviceCases.length]);

  function renderQuiz() {
    const q = quiz[qIndex];
    if (!q) return <EmptyNote>Вопросы не сгенерированы</EmptyNote>;
    const pct = quiz.length ? Math.round(((qIndex + 1) / quiz.length) * 100) : 0;
    const optionState = (i: number): OptionState => {
      if (!revealed) return 'idle';
      if (i === selected) return i === q.correctIndex ? 'right' : 'wrong';
      return i === q.correctIndex ? 'right' : 'dim';
    };
    return (
      <div className="bg-[#161c1c] min-h-screen text-[#E2DAC2] font-body anim-rise py-10">
        <SectionHead kicker="Квиз · 10 вопросов" title={q.prompt} />
        <div className="mx-auto max-w-md px-4">
          <p className="mb-4 text-sm text-[#6b6b5c]">Вопрос {qIndex + 1} из {quiz.length}</p>
          <Bar value={pct} color="#4FBBBC" />
          <div className="mt-6 space-y-2" role="radiogroup" aria-label={q.prompt}>
            {q.options.map((opt, i) => (
              <OptionBtn
                key={i}
                text={opt}
                state={optionState(i)}
                onClick={revealed ? undefined : () => handleQuizSelect(i)}
              />
            ))}
          </div>
          {revealed && (
            <div className="mt-4 flex gap-2">
              {qIndex + 1 < quiz.length ? (
                <button type="button" onClick={nextQuiz} className="anim-pop px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
                  Следующий
                </button>
              ) : (
                <button type="button" onClick={finishQuiz} className="anim-pop px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
                  Завершить
                </button>
              )}
              <button type="button" onClick={() => setPhase('hub')} className="px-4 py-2 rounded-xl border border-[#33403f] bg-[#222a2a] text-[#E2DAC2] text-sm font-semibold">
                Войти
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderBlitz() {
    const q = blitzQuestion;
    if (!q) return <EmptyNote>Запуск блица…</EmptyNote>;
    const pct = Math.round((timeLeft / 60) * 100);
    return (
      <div className="bg-[#161c1c] min-h-screen text-[#E2DAC2] font-body anim-rise py-10">
        <SectionHead kicker="Блиц · 60 секунд" title="Отвечайте как можно быстрее" />
        <div className="mx-auto max-w-md px-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-[#6b6b5c]">Осталось</span>
            <span className="text-2xl font-mono font-bold text-[#E2DAC2]">{timeLeft} с</span>
          </div>
          <Bar value={pct} color="#F39120" />
          <p className="mb-4 text-sm text-[#6b6b5c]">Верных: {blitzCorrectRef.current}</p>
          <div className="space-y-2" role="radiogroup" aria-label={q.prompt}>
            {q.options.map((opt, i) => {
              const st: OptionState = blitzRevealed
                ? i === blitzSelected
                  ? i === q.correctIndex
                    ? 'right'
                    : 'wrong'
                  : i === q.correctIndex
                    ? 'right'
                    : 'dim'
                : 'idle';
              return (
                <OptionBtn
                  key={i}
                  text={opt}
                  state={st}
                  onClick={blitzRevealed ? undefined : () => handleBlitzAnswer(i)}
                />
              );
            })}
          </div>
          <button type="button" onClick={endBlitz} className="mt-6 px-4 py-2 rounded-xl border border-[#33403f] bg-[#222a2a] text-[#E2DAC2] text-sm font-semibold">
            Завершить сейчас
          </button>
        </div>
      </div>
    );
  }

  function renderExam() {
    const q = examQuestions[examIdx];
    if (!q) return null;
    const blockIndex = examBlocks.indexOf(q.block);
    const blockStart = examQuestions.findIndex((x) => x.block === q.block);
    return (
      <div className="bg-[#161c1c] min-h-screen text-[#E2DAC2] font-body anim-rise py-10">
        <SectionHead kicker="Экзамен · 4 блока" title={q.prompt} />
        <div className="mx-auto max-w-md px-4">
          {examIdx === blockStart && (
            <div className="mb-4">
              <Pill color="#EC4624">{`Блок ${blockIndex + 1} из ${examBlocks.length} · ${q.block}`}</Pill>
            </div>
          )}
          <p className="mb-6 text-sm text-[#6b6b5c]">Вопрос {examIdx + 1} из {examQuestions.length} · известно {examTotal}</p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleExamMark(true)}
              disabled={examRevealed}
              className={cn(
                'w-full py-3 rounded-xl border text-sm font-semibold transition-colors',
                examRevealed ? 'border-[#33403f] bg-[#1a2121] text-[#6b6b5c]' : 'border-[#4FBBBC] bg-[#4FBBBC]/10 text-[#4FBBBC]',
              )}
            >
              Знаю
            </button>
            <button
              type="button"
              onClick={() => handleExamMark(false)}
              disabled={examRevealed}
              className={cn(
                'w-full py-3 rounded-xl border text-sm font-semibold transition-colors',
                examRevealed ? 'border-[#33403f] bg-[#1a2121] text-[#6b6b5c]' : 'border-[#EC4624] bg-[#EC4624]/10 text-[#EC4624]',
              )}
            >
              Не знаю
            </button>
          </div>
          {examRevealed && (
            <div className="mt-4 anim-pop rounded-xl border border-[#33403f] bg-[#1a2121] p-4">
              <p className="mb-2 text-xs text-[#6b6b5c] uppercase tracking-wider">Ответ бариста</p>
              <p className="text-sm text-[#E2DAC2]">{q.model}</p>
            </div>
          )}
          <div className="mt-6 flex gap-2">
            {examIdx + 1 < examQuestions.length ? (
              <button type="button" onClick={nextExam} disabled={!examRevealed} className="px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
                Далее
              </button>
            ) : (
              <button type="button" onClick={() => setPhase('result')} disabled={!examRevealed} className="px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
                Завершить
              </button>
            )}
            <button type="button" onClick={() => setPhase('hub')} className="px-4 py-2 rounded-xl border border-[#33403f] bg-[#222a2a] text-[#E2DAC2] text-sm font-semibold">
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderCases() {
    const c = serviceCases[caseIdx];
    if (!c) return null;
    return (
      <div className="bg-[#161c1c] min-h-screen text-[#E2DAC2] font-body anim-rise py-10">
        <SectionHead kicker="Кейсы · 12 ситуаций" title={c.scene} />
        <div className="mx-auto max-w-md px-4">
          <Pill color="#E2DAC2" className="mb-4">
            {c.block}
          </Pill>
          <p className="mb-6 text-sm text-[#6b6b5c]">Кейс {caseIdx + 1} из {serviceCases.length} · идеально {casesPerfect}</p>
          <div className="space-y-2">
            {c.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={caseRevealed ? undefined : () => handleCasePick(opt.score)}
                disabled={caseRevealed}
                className="w-full py-2.5 px-3 rounded-xl border text-left text-sm font-semibold transition-colors border-[#33403f] bg-[#222a2a] text-[#E2DAC2]"
              >
                {opt.text}
              </button>
            ))}
          </div>
          {caseRevealed && (
            <div className="mt-4 anim-pop rounded-xl border border-[#33403f] bg-[#1a2121] p-4">
              <p className="mb-2 text-xs text-[#6b6b5c] uppercase tracking-wider">Разбор</p>
              <p className="text-sm text-[#E2DAC2]">{c.explain}</p>
            </div>
          )}
          <div className="mt-6 flex gap-2">
            {caseIdx + 1 < serviceCases.length ? (
              <button type="button" onClick={nextCase} disabled={!caseRevealed} className="px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
                Далее
              </button>
            ) : (
              <button type="button" onClick={() => setPhase('result')} disabled={!caseRevealed} className="px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
                Завершить
              </button>
            )}
            <button type="button" onClick={() => setPhase('hub')} className="px-4 py-2 rounded-xl border border-[#33403f] bg-[#222a2a] text-[#E2DAC2] text-sm font-semibold">
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPlay() {
    if (mode === 'quiz') return renderQuiz();
    if (mode === 'blitz') return renderBlitz();
    if (mode === 'exam') return renderExam();
    return renderCases();
  }

  if (phase === 'hub') {
    return (
      <div className="bg-[#161c1c] min-h-screen text-[#E2DAC2] font-body anim-rise">
        <SectionHead kicker="Проверка знаний" title="Тесты и экзамен" sub={`Рецепты · карточки · первый шаг · ${ttkCategories.length} категорий`} />
        <div className="mx-auto max-w-5xl px-4 pb-28 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {modeDefs.map((m, i) => (
              <ModeCard key={m.id} m={m} index={i} active={mode === m.id} onClick={() => enterMode(m.id)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    let pct = 0;
    let label = '';
    let note: React.ReactNode = null;
    if (mode === 'quiz') {
      pct = quiz.length ? Math.round((quizCorrect / quiz.length) * 100) : 0;
      label = `Квиз завершён · ${quizCorrect} из ${quiz.length}`;
    } else if (mode === 'blitz') {
      pct = Math.min(100, blitzCorrectRef.current * 10);
      label = `Блиц завершён · ${blitzCorrectRef.current} верных`;
    } else if (mode === 'exam') {
      pct = Math.round((examTotal / examQuestions.length) * 100);
      label = `Экзамен · известно ${examTotal} из ${examQuestions.length}`;
      note = examTotal === 0 ? <EmptyNote>Ещё нет известных вопросов экзамена</EmptyNote> : null;
    } else {
      pct = Math.round((casesPerfect / serviceCases.length) * 100);
      label = `Кейсы · идеально ${casesPerfect} из ${serviceCases.length}`;
      note = casesPerfect === 0 ? <EmptyNote>Ещё нет идеальнорешённых кейсов</EmptyNote> : null;
    }
    return (
      <div className="bg-[#161c1c] min-h-screen text-[#E2DAC2] font-body anim-rise py-10">
        <SectionHead kicker="Проверка знаний" title="Результат" />
        <div className="mx-auto max-w-md px-4">
          <div className="flex flex-col items-center gap-4 anim-pop">
            <ProgressRing value={pct} size={150} color={pct >= 80 ? '#4FBBBC' : pct >= 50 ? '#F39120' : '#EC4624'}>
              {pct}%
            </ProgressRing>
            <p className="text-xl font-bold">{label}</p>
          </div>
          {note && <div className="mt-6">{note}</div>}
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setPhase('hub')} className="px-4 py-2 rounded-xl border border-[#33403f] bg-[#222a2a] text-[#E2DAC2] text-sm font-semibold">
              К хабу
            </button>
            <button type="button" onClick={() => enterMode(mode)} className="px-4 py-2 rounded-xl bg-[#4FBBBC] text-[#0b1414] text-sm font-semibold">
              Снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return renderPlay();
};

export default Tests;
