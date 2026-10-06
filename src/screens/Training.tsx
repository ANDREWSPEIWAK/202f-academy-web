import React, { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input from '../components/Input';
import ProgressBar from '../components/ProgressBar';
import styles from './Training.module.css';
import { useT, useI18nStore } from '../i18n';
import { TRAINING_TASKS, getTask, DIFFICULTY_RU, DIFFICULTY_EN } from '../data/trainingTasks';
import { useTrainingStore, summarizeTask } from '../store/trainingStore';
import { useJournalStore } from '../store/journalStore';
import { useProgressStore } from '../store/progressStore';
import { XP } from '../data/gamification';

interface TrainingProps {
  initialTaskId?: string | null;
}

const Training: React.FC<TrainingProps> = ({ initialTaskId }) => {
  const t = useT();
  const lang = useI18nStore((s) => s.lang);
  const attempts = useTrainingStore((s) => s.attempts);
  const recordAttempt = useTrainingStore((s) => s.recordAttempt);
  const addJournalEntry = useJournalStore((s) => s.addEntry);
  const addXp = useProgressStore((s) => s.addXp);

  const [openTaskId, setOpenTaskId] = useState<string | null>(initialTaskId ?? null);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [criteriaScores, setCriteriaScores] = useState<Record<number, number>>({});
  const [measured, setMeasured] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const task = openTaskId ? getTask(openTaskId) : null;
  const summary = useMemo(
    () => (openTaskId ? summarizeTask(attempts, openTaskId) : null),
    [attempts, openTaskId]
  );

  const openTask = (id: string) => {
    setOpenTaskId(id);
    setCheckedSteps({});
    setCriteriaScores({});
    setMeasured('');
    setNote('');
    setSaved(false);
  };

  const score = useMemo(() => {
    if (!task) return null;
    const values = Object.values(criteriaScores);
    if (values.length === 0) return null;
    return Math.round((values.reduce((a, b) => a + b, 0) / (task.criteriaRu.length * 5)) * 100);
  }, [criteriaScores, task]);

  const allStepsChecked = task ? task.stepsRu.every((_, i) => checkedSteps[i]) : false;

  const saveResult = () => {
    if (!task || score === null) return;
    recordAttempt({
      taskId: task.id,
      score,
      measured: measured ? parseFloat(measured.replace(',', '.')) : undefined,
      note: note.trim() || undefined,
    });
    addXp(XP.TRAINING_COMPLETE);
    setSaved(true);
  };

  const pushToJournal = () => {
    if (!task) return;
    addJournalEntry({
      training: lang === 'en' ? task.titleEn : task.titleRu,
      taskId: task.id,
      coffee: '',
      equipment: task.equipment.join(', '),
      recipe: lang === 'en' ? task.targetEn : task.targetRu,
      result: measured ? `${measured} ${task.measurement.unit}` : `${score}%`,
      taste: '',
      problem: '',
      changed: '',
      nextStep: '',
      rating: score ? Math.max(1, Math.min(5, Math.round(score / 20))) : 3,
    });
    setOpenTaskId(null);
  };

  // ===== Список тренировок =====
  if (!task) {
    return (
      <div className={styles.training}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('training.title')}</h1>
          <p className={styles.subtitle}>{t('training.subtitle')}</p>
        </div>

        <div className={styles.list}>
          {TRAINING_TASKS.map((taskItem) => {
            const s = summarizeTask(attempts, taskItem.id);
            const name = lang === 'en' ? taskItem.titleEn : taskItem.titleRu;
            return (
              <Card key={taskItem.id} interactive onClick={() => openTask(taskItem.id)}>
                <div className={styles.taskRow}>
                  <div className={styles.taskText}>
                    <p className={styles.taskName}>{name}</p>
                    <p className={styles.taskMeta}>
                      {lang === 'en' ? DIFFICULTY_EN[taskItem.difficulty] : DIFFICULTY_RU[taskItem.difficulty]}
                      {' · '}
                      {taskItem.durationMin} {t('training.min')}
                    </p>
                  </div>
                  {s.attempts > 0 ? (
                    <div className={styles.taskScore}>
                      <Badge variant={s.bestScore >= 70 ? 'success' : 'warning'} size="small">
                        {t('training.best')} {s.bestScore}%
                      </Badge>
                      <span className={styles.taskAttempts}>
                        {t('training.attemptsPrefix')} {s.attempts}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="secondary" size="small">
                      {t('training.notTried')}
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== Деталь тренировки =====
  const name = lang === 'en' ? task.titleEn : task.titleRu;
  const criteria = lang === 'en' ? task.criteriaEn : task.criteriaRu;

  return (
    <div className={styles.training}>
      <button type="button" className={styles.back} onClick={() => setOpenTaskId(null)}>
        ← {t('common.back')}
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>{name}</h1>
        <div className={styles.headerMeta}>
          <Badge variant={task.difficulty === 'HARD' ? 'danger' : task.difficulty === 'MEDIUM' ? 'warning' : 'success'} size="small">
            {lang === 'en' ? DIFFICULTY_EN[task.difficulty] : DIFFICULTY_RU[task.difficulty]}
          </Badge>
          <span className={styles.duration}>
            ~{task.durationMin} {t('training.min')}
          </span>
          {summary && summary.attempts > 0 && (
            <Badge variant="secondary" size="small">
              {t('training.best')} {summary.bestScore}%
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <p className={styles.sectionLabel}>{t('training.goal')}</p>
        <p className={styles.goalText}>{lang === 'en' ? task.goalEn : task.goalRu}</p>
        <div className={styles.factRow}>
          <div className={styles.fact}>
            <p className={styles.factLabel}>{t('training.equipment')}</p>
            <ul className={styles.factList}>
              {task.equipment.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div className={styles.fact}>
            <p className={styles.factLabel}>{t('training.ingredients')}</p>
            <ul className={styles.factList}>
              {task.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.target}>
          <strong>{t('training.target')}:</strong> {lang === 'en' ? task.targetEn : task.targetRu}
        </p>
      </Card>

      <Card>
        <p className={styles.sectionLabel}>{t('training.steps')}</p>
        <div className={styles.steps}>
          {(lang === 'en' ? task.stepsEn : task.stepsRu).map((step, i) => (
            <label key={i} className={styles.step}>
              <input
                type="checkbox"
                checked={!!checkedSteps[i]}
                onChange={() => setCheckedSteps((s) => ({ ...s, [i]: !s[i] }))}
              />
              <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`${styles.stepText} ${checkedSteps[i] ? styles.stepDone : ''}`}>{step}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <p className={styles.sectionLabel}>{t('training.measurement')}</p>
        <p className={styles.measureHint}>
          {task.measurement.labelRu} ({lang === 'en' ? task.measurement.labelEn : task.measurement.labelRu}):{' '}
          {task.measurement.min}–{task.measurement.max} {task.measurement.unit}
        </p>
        <Input
          type="number"
          placeholder={`${task.measurement.ideal} ${task.measurement.unit}`}
          value={measured}
          onChange={(e) => setMeasured(e.target.value)}
          fullWidth
        />
      </Card>

      <Card>
        <p className={styles.sectionLabel}>{t('training.selfAssessment')}</p>
        <div className={styles.criteria}>
          {criteria.map((c, i) => (
            <div key={i} className={styles.criterion}>
              <span className={styles.criterionText}>{c}</span>
              <div className={styles.scoreButtons} role="radiogroup" aria-label={c}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={(criteriaScores[i] ?? 0) === v}
                    className={`${styles.scoreBtn} ${(criteriaScores[i] ?? 0) >= v ? styles.scoreOn : ''}`}
                    onClick={() => setCriteriaScores((s) => ({ ...s, [i]: v }))}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {score !== null && (
          <div className={styles.scorePreview}>
            <ProgressBar value={score} showLabel={false} size="small" />
            <span className={styles.scoreValue}>{score}%</span>
          </div>
        )}

        <Input
          placeholder={t('training.notePlaceholder')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
        />

        {!saved ? (
          <Button fullWidth disabled={!allStepsChecked || score === null} onClick={saveResult}>
            {allStepsChecked ? t('training.finish') : t('training.finishHint')}
          </Button>
        ) : (
          <div className={styles.savedPanel}>
            <p className={styles.savedText}>{t('training.savedNote')}</p>
            <div className={styles.savedActions}>
              <Button variant="secondary" size="small" onClick={() => setOpenTaskId(null)}>
                {t('training.closeTask')}
              </Button>
              <Button size="small" onClick={pushToJournal}>
                {t('training.toJournal')}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Training;
