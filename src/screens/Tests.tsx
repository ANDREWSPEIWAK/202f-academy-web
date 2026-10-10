import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import styles from './Tests.module.css';
import { CONTROL_TESTS, getTestQuestions } from '../data/controlTests';
import { BankQuestion } from '../data/questions';
import { getStep } from '../data/gamification';
import {
  useProgressStore,
  isStepUnlocked,
  getWeakAreas,
} from '../store/progressStore';
import {
  Answer,
  gradeAnswer,
  isAnswerComplete,
  buildDrillSession,
  kindLabel,
  errorRate,
  isDue,
} from '../engine/testingEngine';

interface TestsProps {
  initialTestId?: string | null;
}

type Mode = 'control' | 'drill';
type Phase = 'list' | 'runner' | 'result';

interface AnswerRecord {
  questionId: string;
  category: string;
  correct: boolean;
  answer: Answer;
}

const DRILL_SIZE = 10;

const Tests: React.FC<TestsProps> = ({ initialTestId }) => {
  const state = useProgressStore();
  const [mode, setMode] = useState<Mode>('control');
  const [phase, setPhase] = useState<Phase>('list');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [drillQuestions, setDrillQuestions] = useState<BankQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const activeTest = activeTestId ? CONTROL_TESTS.find((t) => t.id === activeTestId) : undefined;
  const questions = useMemo(
    () => (mode === 'control' && activeTest ? getTestQuestions(activeTest.id) : drillQuestions),
    [activeTest, mode, drillQuestions]
  );

  useEffect(() => {
    if (initialTestId) {
      const test = CONTROL_TESTS.find((t) => t.id === initialTestId);
      if (test && isStepUnlocked(getStep(test.stepId)!, state)) {
        setMode('control');
        startTest(initialTestId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTestId]);

  function reset() {
    setQuestionIndex(0);
    setAnswer(null);
    setAnswers([]);
  }

  function startTest(testId: string) {
    setActiveTestId(testId);
    reset();
    setPhase('runner');
  }

  function startDrill() {
    // Ограничение сложности по уровню: Junior — до MEDIUM, Skilled/PRO — весь банк
    const tierCap = state.completedLevels.includes('JUNIOR') ? undefined : ('MEDIUM' as const);
    const session = buildDrillSession({
      size: DRILL_SIZE,
      categoryStats: state.categoryStats,
      recentQuestionIds: state.recentQuestionIds,
      tierCap,
    });
    setMode('drill');
    setActiveTestId(null);
    setDrillQuestions(session);
    reset();
    setPhase('runner');
  }

  function submitAnswer() {
    if (!answer) return;
    const q = questions[questionIndex];
    const grade = gradeAnswer(q, answer);
    const record: AnswerRecord = {
      questionId: q.id,
      category: q.category,
      correct: grade.correct,
      answer,
    };
    const allAnswers = [...answers, record];
    setAnswers(allAnswers);
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((i) => i + 1);
      setAnswer(null);
    } else {
      finish(allAnswers);
    }
  }

  function finish(finalAnswers: AnswerRecord[]) {
    // spaced repetition: контрольные и тренажёр обновляют статистику категорий
    state.recordCategoryAnswers(
      finalAnswers.map((a) => ({ category: a.category, correct: a.correct, questionId: a.questionId }))
    );
    if (mode === 'control' && activeTest) {
      const correct = finalAnswers.filter((a) => a.correct).length;
      const score = Math.round((correct / questions.length) * 100);
      const weakCategories = Array.from(new Set(finalAnswers.filter((a) => !a.correct).map((a) => a.category)));
      state.recordTestResult(activeTest.id, score, activeTest.passingScore, weakCategories);
    }
    setPhase('result');
  }

  // ===== Список =====
  if (phase === 'list') {
    return (
      <div className={styles.tests}>
        <div className={styles.header}>
          <h1 className={styles.title}>Тесты</h1>
        </div>

        <div className={styles.modeTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'control'}
            className={`${styles.modeTab} ${mode === 'control' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('control')}
          >
            Контрольные
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'drill'}
            className={`${styles.modeTab} ${mode === 'drill' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('drill')}
          >
            Тренажёр
          </button>
        </div>

        {mode === 'control' ? (
          <div className={styles.testList}>
            {CONTROL_TESTS.map((test) => {
              const step = getStep(test.stepId)!;
              const unlocked = isStepUnlocked(step, state);
              const result = state.testResults[test.id];
              const lessonsDone = step.lessonIds.every((id) => state.completedLessons[id]);
              const canStart = unlocked && lessonsDone;
              return (
                <Card key={test.id} className={`${styles.testCard} ${!unlocked ? styles.testLocked : ''}`}>
                  <div className={styles.testCardRow}>
                    <div className={styles.testCardInfo}>
                      <div className={styles.testCardTop}>
                        <Badge variant={test.isAttestation ? 'danger' : 'primary'} size="small">
                          {test.isAttestation ? 'Аттестация' : 'Контроль'}
                        </Badge>
                        <span className={styles.testCardLevel}>
                          {step.level} · Step {step.index}
                        </span>
                      </div>
                      <p className={styles.testCardTitle}>{test.title}</p>
                      <p className={styles.testCardDesc}>{test.description}</p>
                      {result && (
                        <p className={`${styles.testCardScore} ${result.passed ? styles.scorePassed : styles.scoreFailed}`}>
                          Лучший результат: {result.bestScore}% · попыток: {result.attempts}
                        </p>
                      )}
                    </div>
                    <Button size="small" disabled={!canStart} onClick={() => startTest(test.id)}>
                      {!unlocked ? '🔒' : !lessonsDone ? 'Теория не пройдена' : result?.passed ? 'Пересдать' : 'Начать'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <DrillPanel onStart={startDrill} />
        )}
      </div>
    );
  }

  // ===== Результат =====
  if (phase === 'result') {
    const correct = answers.filter((a) => a.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = mode === 'control' && activeTest ? score >= activeTest.passingScore : score >= 70;
    const weak = getWeakAreas(answers.map((a) => ({ category: a.category, correct: a.correct })));
    const wrongAnswers = answers.filter((a) => !a.correct);

    return (
      <div className={styles.tests}>
        <Card className={`${styles.resultCard} ${passed ? styles.resultPassed : styles.resultFailed}`}>
          <p className={styles.resultLabel}>
            {mode === 'drill' ? 'Тренировка завершена' : passed ? 'Тест сдан' : 'Тест не сдан'}
          </p>
          <p className={styles.resultScore}>{score}%</p>
          <p className={styles.resultThreshold}>
            {mode === 'control'
              ? `Порог: ${activeTest?.passingScore}% · верных ответов: ${correct} из ${questions.length}`
              : `Верных ответов: ${correct} из ${questions.length} · статистика категорий обновлена`}
          </p>
          <ProgressBar value={score} showLabel={false} />
          {mode === 'control' && !passed && (
            <p className={styles.resultHint}>
              Пересдача доступна после разбора ошибок. Ступень завершается только при результате ≥85%.
            </p>
          )}
        </Card>

        {weak.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Слабые темы</h2>
            <Card>
              <div className={styles.weakList}>
                {weak.map((w) => (
                  <div key={w.category} className={styles.weakRow}>
                    <span className={styles.weakCategory}>{w.category}</span>
                    <span className={styles.weakScore}>
                      {w.wrong} из {w.total} ошибок
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {wrongAnswers.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Разбор ошибок</h2>
            <div className={styles.reviewList}>
              {wrongAnswers.map((a) => {
                const q = questions.find((qq) => qq.id === a.questionId)!;
                return (
                  <Card key={a.questionId} className={styles.reviewCard}>
                    <p className={styles.reviewQuestion}>{q.question}</p>
                    <p className={styles.reviewWrong}>Ваш ответ: {formatAnswer(q, a.answer)}</p>
                    <p className={styles.reviewCorrect}>Верно: {formatCorrect(q)}</p>
                    <p className={styles.reviewExplanation}>{q.explanation}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.resultActions}>
          <Button variant="secondary" onClick={() => setPhase('list')}>
            К списку
          </Button>
          {mode === 'control' && !passed && activeTest && <Button onClick={() => startTest(activeTest.id)}>Пересдать тест</Button>}
          {mode === 'drill' && <Button onClick={startDrill}>Новая тренировка</Button>}
        </div>
      </div>
    );
  }

  // ===== Раннер =====
  if (phase === 'runner' && questions.length > 0) {
    const q = questions[questionIndex];
    const kind = q.kind ?? 'single';

    return (
      <div className={styles.tests}>
        <div className={styles.runnerHeader}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => {
              setPhase('list');
              setMode('control');
            }}
          >
            ← Прервать
          </button>
          <p className={styles.runnerTitle}>
            {mode === 'control' ? activeTest?.title : 'Адаптивная тренировка'}
          </p>
          <p className={styles.runnerCounter}>
            Вопрос {questionIndex + 1} из {questions.length}
          </p>
        </div>
        <ProgressBar value={questionIndex} max={questions.length} showLabel={false} />

        <Card className={styles.questionCard}>
          <div className={styles.questionTop}>
            <Badge variant="secondary" size="small">
              {q.tier === 'BASE' ? 'База' : q.tier === 'MEDIUM' ? 'Средний' : 'PRO'}
            </Badge>
            <span className={styles.questionKind}>{kindLabel(q)}</span>
            <span className={styles.questionCategory}>{q.category}</span>
          </div>

          {q.scenario && <div className={styles.scenario}>{q.scenario}</div>}
          <h2 className={styles.questionText}>{q.question}</h2>

          {kind === 'single' && (
            <div className={styles.options} role="radiogroup" aria-label="Варианты ответа">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={answer?.kind === 'single' && answer.index === i}
                  className={`${styles.option} ${answer?.kind === 'single' && answer.index === i ? styles.optionSelected : ''}`}
                  onClick={() => setAnswer({ kind: 'single', index: i })}
                >
                  <span className={styles.optionLetter} aria-hidden="true">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={styles.optionText}>{option}</span>
                </button>
              ))}
            </div>
          )}

          {kind === 'multi' && (
            <div className={styles.options} role="group" aria-label="Варианты ответа">
              <p className={styles.kindHint}>Выберите все подходящие варианты</p>
              {q.options.map((option, i) => {
                const checked = answer?.kind === 'multi' && answer.indexes.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    className={`${styles.option} ${checked ? styles.optionSelected : ''}`}
                    onClick={() =>
                      setAnswer((prev) => {
                        const cur = prev?.kind === 'multi' ? prev.indexes : [];
                        return {
                          kind: 'multi',
                          indexes: checked ? cur.filter((x) => x !== i) : [...cur, i],
                        };
                      })
                    }
                  >
                    <span className={`${styles.optionLetter} ${checked ? styles.optionLetterChecked : ''}`} aria-hidden="true">
                      {checked ? '✓' : String.fromCharCode(65 + i)}
                    </span>
                    <span className={styles.optionText}>{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {kind === 'number' && (
            <div className={styles.numberBlock}>
              <p className={styles.kindHint}>
                Введите число{q.correctNumber?.unit ? ` (${q.correctNumber.unit})` : ''}
              </p>
              <input
                className={styles.numberInput}
                type="text"
                inputMode="decimal"
                value={answer?.kind === 'number' ? answer.value : ''}
                onChange={(e) => setAnswer({ kind: 'number', value: e.target.value })}
                placeholder="—"
                aria-label="Ответ числом"
              />
            </div>
          )}

          {kind === 'order' && (
            <div className={styles.orderBlock}>
              <p className={styles.kindHint}>Нажимайте шаги в правильной последовательности</p>
              <ol className={styles.orderSequence} aria-label="Ваша последовательность">
                {(answer?.kind === 'order' ? answer.sequence : []).map((optIdx, pos) => (
                  <li key={pos}>
                    <button
                      type="button"
                      className={styles.orderSeqItem}
                      onClick={() =>
                        setAnswer((prev) => {
                          const cur = prev?.kind === 'order' ? prev.sequence : [];
                          return { kind: 'order', sequence: cur.filter((_, p) => p !== pos) };
                        })
                      }
                    >
                      <span className={styles.orderSeqNum}>{pos + 1}</span>
                      {q.options[optIdx]}
                    </button>
                  </li>
                ))}
                {(answer?.kind === 'order' ? answer.sequence : []).length === 0 && (
                  <li className={styles.orderEmpty}>Последовательность пуста</li>
                )}
              </ol>
              <div className={styles.options}>
                {q.options.map((option, i) => {
                  const used = answer?.kind === 'order' && answer.sequence.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={used}
                      className={`${styles.option} ${used ? styles.optionUsed : ''}`}
                      onClick={() =>
                        setAnswer((prev) => {
                          const cur = prev?.kind === 'order' ? prev.sequence : [];
                          return { kind: 'order', sequence: [...cur, i] };
                        })
                      }
                    >
                      <span className={styles.optionLetter} aria-hidden="true">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={styles.optionText}>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Button fullWidth disabled={!isAnswerComplete(q, answer)} onClick={submitAnswer}>
            {questionIndex + 1 < questions.length ? 'Следующий вопрос' : 'Завершить'}
          </Button>
        </Card>
      </div>
    );
  }

  return null;
};

/** Панель тренажёра: слабые категории и запуск сессии */
function DrillPanel({ onStart }: { onStart: () => void }) {
  const categoryStats = useProgressStore((s) => s.categoryStats);
  const entries = Object.entries(categoryStats);

  const weak = entries
    .filter(([, s]) => errorRate(s) >= 0.3)
    .sort((a, b) => errorRate(b[1]) - errorRate(a[1]))
    .slice(0, 5);
  const due = entries.filter(([, s]) => isDue(s)).length;

  return (
    <div className={styles.drillPanel}>
      <Card className={styles.drillCard}>
        <p className={styles.drillTitle}>Адаптивная тренировка</p>
        <p className={styles.drillDesc}>
          10 вопросов разных типов: расчёты, сценарии, последовательности. Движок подбирает вопросы по вашим слабым категориям и расписанию интервальных повторений.
        </p>
        {entries.length > 0 && (
          <p className={styles.drillMeta}>
            К повторению: {due} · отслеживается: {entries.length}
          </p>
        )}
        <p className={styles.drillMeta}>
          Первая сессия — диагностическая: движок определит сильные и слабые темы.
        </p>
        <Button fullWidth onClick={onStart}>
          Начать тренировку ({DRILL_SIZE} вопросов)
        </Button>
      </Card>

      {weak.length > 0 && (
        <Card>
          <p className={styles.drillSubTitle}>Топ слабых категорий</p>
          <div className={styles.weakList}>
            {weak.map(([category, s]) => (
              <div key={category} className={styles.weakRow}>
                <span className={styles.weakCategory}>{category}</span>
                <span className={styles.weakScore}>{Math.round(errorRate(s) * 100)}% ошибок</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/** Текст ответа пользователя для разбора */
function formatAnswer(q: BankQuestion, answer: Answer): string {
  switch (answer.kind) {
    case 'single':
      return q.options[answer.index] ?? '—';
    case 'multi':
      return answer.indexes.map((i) => q.options[i]).join(', ') || '—';
    case 'number':
      return answer.value || '—';
    case 'order':
      return answer.sequence.map((i, p) => `${p + 1}. ${q.options[i]}`).join(' → ') || '—';
  }
}

function formatCorrect(q: BankQuestion): string {
  const kind = q.kind ?? 'single';
  switch (kind) {
    case 'multi':
      return (q.correctIndexes ?? []).map((i) => q.options[i]).join(', ');
    case 'number':
      return `${q.correctNumber?.value}${q.correctNumber?.unit ? ' ' + q.correctNumber.unit : ''} (±${q.correctNumber?.tolerance})`;
    case 'order':
      return (q.correctOrder ?? []).map((i, p) => `${p + 1}. ${q.options[i]}`).join(' → ');
    default:
      return q.options[q.correctIndex];
  }
}

export default Tests;
