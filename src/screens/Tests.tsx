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

interface TestsProps {
  initialTestId?: string | null;
}

type Phase = 'list' | 'runner' | 'result';

interface AnswerRecord {
  questionId: string;
  category: string;
  selectedIndex: number;
  correct: boolean;
}

const Tests: React.FC<TestsProps> = ({ initialTestId }) => {
  const state = useProgressStore();
  const [phase, setPhase] = useState<Phase>('list');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    if (initialTestId) {
      const test = CONTROL_TESTS.find((t) => t.id === initialTestId);
      if (test && isStepUnlocked(getStep(test.stepId)!, state)) {
        startTest(initialTestId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTestId]);

  const activeTest = activeTestId ? CONTROL_TESTS.find((t) => t.id === activeTestId) : undefined;
  const questions = useMemo(
    () => (activeTest ? getTestQuestions(activeTest.id) : []),
    [activeTest]
  );

  function startTest(testId: string) {
    setActiveTestId(testId);
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setPhase('runner');
  }

  function submitAnswer() {
    if (selectedIndex === null || !activeTest) return;
    const q = questions[questionIndex];
    const record: AnswerRecord = {
      questionId: q.id,
      category: q.category,
      selectedIndex,
      correct: selectedIndex === q.correctIndex,
    };
    const allAnswers = [...answers, record];
    setAnswers(allAnswers);
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((i) => i + 1);
      setSelectedIndex(null);
    } else {
      finishTest(allAnswers);
    }
  }

  function finishTest(finalAnswers: AnswerRecord[]) {
    if (!activeTest) return;
    const correct = finalAnswers.filter((a) => a.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const weakCategories = Array.from(
      new Set(finalAnswers.filter((a) => !a.correct).map((a) => a.category))
    );
    state.recordTestResult(activeTest.id, score, activeTest.passingScore, weakCategories);
    setPhase('result');
  }

  // ===== Список тестов =====
  if (phase === 'list') {
    return (
      <div className={styles.tests}>
        <div className={styles.header}>
          <h1 className={styles.title}>Контрольные тесты</h1>
          <p className={styles.subtitle}>
            Порог прохождения — 85%. Тест открывается после завершения теории ступени и допуска к ней.
          </p>
        </div>

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
                  <Button
                    size="small"
                    disabled={!canStart}
                    onClick={() => startTest(test.id)}
                  >
                    {!unlocked ? '🔒' : !lessonsDone ? 'Теория не пройдена' : result?.passed ? 'Пересдать' : 'Начать'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== Результат =====
  if (phase === 'result' && activeTest) {
    const correct = answers.filter((a) => a.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= activeTest.passingScore;
    const weak = getWeakAreas(answers.map((a) => ({ category: a.category, correct: a.correct })));
    const wrongAnswers = answers.filter((a) => !a.correct);

    return (
      <div className={styles.tests}>
        <Card className={`${styles.resultCard} ${passed ? styles.resultPassed : styles.resultFailed}`}>
          <p className={styles.resultLabel}>{passed ? 'Тест сдан' : 'Тест не сдан'}</p>
          <p className={styles.resultScore}>{score}%</p>
          <p className={styles.resultThreshold}>Порог: {activeTest.passingScore}% · верных ответов: {correct} из {questions.length}</p>
          <ProgressBar value={score} showLabel={false} />
          {!passed && (
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
                    <p className={styles.reviewWrong}>Ваш ответ: {q.options[a.selectedIndex]}</p>
                    <p className={styles.reviewCorrect}>Верно: {q.options[q.correctIndex]}</p>
                    <p className={styles.reviewExplanation}>{q.explanation}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.resultActions}>
          <Button variant="secondary" onClick={() => setPhase('list')}>
            К списку тестов
          </Button>
          {!passed && (
            <Button onClick={() => startTest(activeTest.id)}>Пересдать тест</Button>
          )}
        </div>
      </div>
    );
  }

  // ===== Раннер =====
  if (phase === 'runner' && activeTest && questions.length > 0) {
    const q: BankQuestion = questions[questionIndex];
    return (
      <div className={styles.tests}>
        <div className={styles.runnerHeader}>
          <button type="button" className={styles.backButton} onClick={() => setPhase('list')}>
            ← Прервать
          </button>
          <p className={styles.runnerTitle}>{activeTest.title}</p>
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
            <span className={styles.questionCategory}>{q.category}</span>
          </div>
          <h2 className={styles.questionText}>{q.question}</h2>

          <div className={styles.options} role="radiogroup" aria-label="Варианты ответа">
            {q.options.map((option, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selectedIndex === i}
                className={`${styles.option} ${selectedIndex === i ? styles.optionSelected : ''}`}
                onClick={() => setSelectedIndex(i)}
              >
                <span className={styles.optionLetter} aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={styles.optionText}>{option}</span>
              </button>
            ))}
          </div>

          <Button fullWidth disabled={selectedIndex === null} onClick={submitAnswer}>
            {questionIndex + 1 < questions.length ? 'Следующий вопрос' : 'Завершить тест'}
          </Button>
        </Card>
      </div>
    );
  }

  return null;
};

export default Tests;
