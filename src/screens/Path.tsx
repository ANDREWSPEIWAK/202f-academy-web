import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import CheckIcon from '../components/CheckIcon';
import styles from './Path.module.css';
import {
  LEVELS,
  Step,
  getStepsByLevel,
  getStep,
  formatXp,
} from '../data/gamification';
import { getLessonsByStep, Lesson } from '../data/curriculum';
import {
  useProgressStore,
  getStepStatus,
  getStepProgress,
  isStepLessonsDone,
  isStepTestPassed,
} from '../store/progressStore';

interface PathProps {
  initialStepId?: string | null;
  onGoToTest: (testId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  locked: 'Заблокирована',
  available: 'Доступна',
  in_progress: 'В работе',
  completed: 'Завершена',
};

const STATUS_VARIANT: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  locked: 'secondary',
  available: 'warning',
  in_progress: 'primary',
  completed: 'success',
};

const Path: React.FC<PathProps> = ({ initialStepId, onGoToTest }) => {
  const state = useProgressStore();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(initialStepId ?? null);

  useEffect(() => {
    if (initialStepId) setSelectedStepId(initialStepId);
  }, [initialStepId]);

  const selectedStep = selectedStepId ? getStep(selectedStepId) : undefined;

  if (selectedStep) {
    return <StepDetail step={selectedStep} onBack={() => setSelectedStepId(null)} onGoToTest={onGoToTest} />;
  }

  return (
    <div className={styles.path}>
      <div className={styles.header}>
        <h1 className="srOnly">Путь квалификации</h1>
        
</div>

      {LEVELS.map((level) => {
        const steps = getStepsByLevel(level.id);
        const done = steps.filter((s) => getStepStatus(s, state) === 'completed').length;
        return (
          <section key={level.id} className={`${styles.levelSection} ${styles[`level_${level.accent}`]}`}>
            <div className={styles.levelHeader}>
              <div>
                <h2 className={styles.levelName}>{level.name}</h2>
                <p className={styles.levelSubtitle}>{level.subtitle}</p>
              </div>
              <Badge variant={done === steps.length ? 'success' : 'secondary'}>
                {done}/{steps.length}
              </Badge>
            </div>
            <p className={styles.levelDesc}>{level.description}</p>

            <div className={styles.stepsList}>
              {steps.map((step) => {
                const status = getStepStatus(step, state);
                const progress = getStepProgress(step, state);
                return (
                  <Card
                    key={step.id}
                    interactive={status !== 'locked'}
                    onClick={status !== 'locked' ? () => setSelectedStepId(step.id) : undefined}
                    className={`${styles.stepCard} ${status === 'locked' ? styles.stepLocked : ''} ${
                      status === 'completed' ? styles.stepDone : ''
                    }`}
                  >
                    <div className={styles.stepRow}>
                      <div className={styles.stepIndex} aria-hidden="true">
                        {status === 'completed' ? <CheckIcon size={16} /> : status === 'locked' ? '🔒' : step.index}
                      </div>
                      <div className={styles.stepInfo}>
                        <p className={styles.stepTitle}>
                          Step {step.index}
                          {step.isAttestation ? ' · Аттестация' : ''} — {step.title}
                        </p>
                        <p className={styles.stepFocus}>{step.focus}</p>
                        {status === 'locked' && (
                          <p className={styles.stepLockHint}>
                            Требуется: {formatXp(step.xpRequired)} XP и завершение предыдущей ступени
                          </p>
                        )}
                        {status !== 'locked' && <ProgressBar value={progress} size="small" showLabel={false} />}
                      </div>
                      <Badge variant={STATUS_VARIANT[status]} size="small">
                        {STATUS_LABEL[status]}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

// ===== Деталь ступени =====

interface StepDetailProps {
  step: Step;
  onBack: () => void;
  onGoToTest: (testId: string) => void;
}

const StepDetail: React.FC<StepDetailProps> = ({ step, onBack, onGoToTest }) => {
  const state = useProgressStore();
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const lessons = getLessonsByStep(step.id);
  const status = getStepStatus(step, state);
  const progress = getStepProgress(step, state);
  const lessonsDone = isStepLessonsDone(step, state.completedLessons);
  const testPassed = isStepTestPassed(step, state.testResults);
  const testResult = state.testResults[step.controlTestId];

  return (
    <div className={styles.detail}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← К пути
      </button>

      <div className={styles.detailHeader}>
        <p className={styles.detailLevel}>
          {step.level} · Step {step.index}
          {step.isAttestation ? ' · Аттестация' : ''}
        </p>
        <h1 className={styles.detailTitle}>{step.title}</h1>
        <p className={styles.detailFocus}>{step.focus}</p>
        <ProgressBar value={progress} label="Прогресс ступени" />
      </div>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>1. Теория</h2>
        <div className={styles.lessons}>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={!!state.completedLessons[lesson.id]}
              open={openLessonId === lesson.id}
              onToggle={() => setOpenLessonId(openLessonId === lesson.id ? null : lesson.id)}
            />
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>2. Практический чек-лист</h2>
        <Card>
          <div className={styles.checklist}>
            {step.checklist.map((item, i) => {
              const checked = !!state.checklist[`${step.id}:${i}`];
              return (
                <label key={i} className={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => state.toggleChecklistItem(step.id, i)}
                    className={styles.checkbox}
                  />
                  <span className={`${styles.checkText} ${checked ? styles.checkTextDone : ''}`}>{item}</span>
                </label>
              );
            })}
          </div>
        </Card>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>3. Контрольный тест</h2>
        <Card className={styles.testCard}>
          <div className={styles.testRow}>
            <div>
              <p className={styles.testStatus}>
                {testPassed
                  ? `Сдан: лучший результат ${testResult?.bestScore}%`
                  : testResult
                    ? `Попыток: ${testResult.attempts} · лучший результат ${testResult.bestScore}%`
                    : 'Не пройден'}
              </p>
            </div>
            <Button
              onClick={() => onGoToTest(step.controlTestId)}
              disabled={!lessonsDone}
            >
              {testPassed ? 'Пересдать' : 'Пройти тест'}
            </Button>
          </div>
        </Card>
      </section>

      {status === 'completed' && (
        <Card className={styles.doneCard}>
          <p className={styles.doneText}>Ступень завершена</p>
        </Card>
      )}
    </div>
  );
};

// ===== Карточка урока =====

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  open: boolean;
  onToggle: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, completed, open, onToggle }) => {
  const completeLesson = useProgressStore((s) => s.completeLesson);

  return (
    <Card className={`${styles.lessonCard} ${completed ? styles.lessonDone : ''}`}>
      <button type="button" className={styles.lessonHeader} onClick={onToggle} aria-expanded={open}>
        <span className={styles.lessonMark} aria-hidden="true">
          {completed ? <CheckIcon size={13} /> : open ? '−' : '+'}
        </span>
        <span className={styles.lessonTitle}>{lesson.title}</span>
      </button>

      {open && (
        <div className={styles.lessonBody}>
          {lesson.theory.map((paragraph, i) => (
            <p key={i} className={styles.theory}>
              {paragraph}
            </p>
          ))}

          <div className={styles.lessonMeta}>
            <div className={styles.metaBlock}>
              <h3 className={styles.metaTitle}>Цели урока</h3>
              <ul className={styles.metaList}>
                {lesson.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
            <div className={styles.metaBlock}>
              <h3 className={styles.metaTitle}>Типичные ошибки</h3>
              <ul className={styles.metaList}>
                {lesson.mistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div className={styles.metaBlock}>
              <h3 className={styles.metaTitle}>Практическое задание</h3>
              <p className={styles.metaText}>{lesson.practicalTask}</p>
            </div>
          </div>

          {!completed && (
            <Button fullWidth onClick={() => completeLesson(lesson.id)}>
              Отметить урок завершённым (+60 XP)
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default Path;
