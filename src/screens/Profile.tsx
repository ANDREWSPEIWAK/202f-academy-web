import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import CheckIcon from '../components/CheckIcon';
import styles from './Profile.module.css';
import { LEVELS, getStepsByLevel, formatXp, Step } from '../data/gamification';
import {
  useProgressStore,
  getStepStatus,
  getStepProgress,
  isLevelCompleted,
  countCompletedSteps,
} from '../store/progressStore';
import { seedData } from '../data/seedData';

const STATUS_LABEL: Record<string, string> = {
  locked: '🔒',
  available: '○',
  in_progress: '◐',
};

const Profile: React.FC = () => {
  const state = useProgressStore();

  const lessonsDone = Object.keys(state.completedLessons).length;
  const testsPassed = Object.values(state.testResults).filter((r) => r.passed).length;
  const stepsDone = countCompletedSteps(state);
  const unlockedAchievements = seedData.achievements.filter((ach) => {
    if (ach.requirement.type === 'lessons_completed') return lessonsDone >= ach.requirement.value;
    if (ach.requirement.type === 'tests_passed') return testsPassed >= ach.requirement.value;
    return false;
  });

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1 className="srOnly">Профиль</h1>
        
</div>

      <Card className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <div className={styles.summaryBlock}>
            <span className={styles.summaryValue}>{formatXp(state.xp)}</span>
            <span className={styles.summaryLabel}>XP</span>
          </div>
          <div className={styles.summaryBlock}>
            <span className={styles.summaryValue}>{stepsDone}/15</span>
            <span className={styles.summaryLabel}>Ступеней</span>
          </div>
          <div className={styles.summaryBlock}>
            <span className={styles.summaryValue}>{testsPassed}</span>
            <span className={styles.summaryLabel}>Тестов сдано</span>
          </div>
        </div>
      </Card>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Квалификация</h2>
        <p className={styles.sectionHint}>
          Уровни проходятся строго последовательно. Аттестация уровня открывает следующий уровень.
        </p>
        <div className={styles.levelsList}>
          {LEVELS.map((level) => {
            const steps = getStepsByLevel(level.id);
            const levelDone = isLevelCompleted(level.id, state);
            const levelProgress = Math.round(
              steps.reduce((acc, s) => acc + getStepProgress(s, state), 0) / steps.length
            );
            return (
              <Card key={level.id} className={`${styles.levelCard} ${styles[`level_${level.accent}`]}`}>
                <div className={styles.levelHeader}>
                  <div>
                    <p className={styles.levelName}>{level.name}</p>
                    <p className={styles.levelSubtitle}>{level.subtitle}</p>
                  </div>
                  <Badge variant={levelDone ? 'success' : 'secondary'} size="small">
                    {levelDone ? 'Уровень сдан' : 'В процессе'}
                  </Badge>
                </div>
                <ProgressBar value={levelProgress} label="Прогресс уровня" />
                <div className={styles.stepsRow}>
                  {steps.map((step: Step) => {
                    const status = getStepStatus(step, state);
                    return (
                      <div
                        key={step.id}
                        className={`${styles.stepDot} ${styles[`dot_${status}`]}`}
                        title={`Step ${step.index}: ${step.title} — ${status}`}
                      >
                        <span className={styles.stepDotIndex}>{step.index}</span>
                        <span className={styles.stepDotMark} aria-hidden="true">
                          {status === 'completed' ? <CheckIcon size={12} /> : STATUS_LABEL[status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Достижения</h2>
        <div className={styles.achievements}>
          {seedData.achievements.map((ach) => {
            const unlocked =
              (ach.requirement.type === 'lessons_completed' && lessonsDone >= ach.requirement.value) ||
              (ach.requirement.type === 'tests_passed' && testsPassed >= ach.requirement.value);
            return (
              <Card key={ach.id} className={`${styles.achievement} ${unlocked ? styles.achievementUnlocked : ''}`}>
                <span className={styles.achievementIcon} aria-hidden="true">
                  {unlocked ? ach.icon : '·'}
                </span>
                <div>
                  <p className={styles.achievementName}>{ach.name}</p>
                  <p className={styles.achievementDesc}>{ach.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
        <p className={styles.sectionHint}>Открыто достижений: {unlockedAchievements.length} из {seedData.achievements.length}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Данные</h2>
        <Card>
          <p className={styles.dataText}>
            Прогресс хранится локально на устройстве. Сброс удалит XP, отметки уроков, чек-листы и результаты
            тестов без возможности восстановления.
          </p>
          <Button
            variant="danger"
            size="small"
            onClick={() => {
              if (window.confirm('Сбросить весь прогресс? Это действие необратимо.')) {
                state.resetProgress();
              }
            }}
          >
            Сбросить прогресс
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Profile;
