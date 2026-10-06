import React from 'react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import styles from './Admin.module.css';
import { CONTROL_TESTS } from '../data/controlTests';
import { getStep, formatXp } from '../data/gamification';
import { useProgressStore, getStepStatus } from '../store/progressStore';
import { STEPS } from '../data/gamification';

const STATUS_LABEL: Record<string, string> = {
  locked: 'Заблокирована',
  available: 'Доступна',
  in_progress: 'В работе',
  completed: 'Завершена',
};

const Admin: React.FC = () => {
  const state = useProgressStore();

  // Сводка по тестам: результаты и слабые темы
  const testRows = CONTROL_TESTS.map((test) => {
    const result = state.testResults[test.id];
    return { test, result };
  });

  // Агрегация слабых тем по всем тестам
  const weakMap = new Map<string, number>();
  for (const categories of Object.values(state.weakAreas)) {
    for (const c of categories) {
      weakMap.set(c, (weakMap.get(c) ?? 0) + 1);
    }
  }
  const weakAreas = Array.from(weakMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const lessonsDone = Object.keys(state.completedLessons).length;
  const totalLessons = STEPS.reduce((acc, s) => acc + s.lessonIds.length, 0);
  const checklistTotal = STEPS.reduce((acc, s) => acc + s.checklist.length, 0);
  const checklistDone = Object.values(state.checklist).filter(Boolean).length;

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1 className={styles.title}>Панель администратора</h1>
        <p className={styles.subtitle}>Аналитика прогресса и слабых мест сотрудника</p>
      </div>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatXp(state.xp)}</span>
            <span className={styles.statLabel}>XP</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {lessonsDone}/{totalLessons}
            </span>
            <span className={styles.statLabel}>Уроки</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {checklistDone}/{checklistTotal}
            </span>
            <span className={styles.statLabel}>Чек-листы</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {Object.values(state.testResults).filter((r) => r.passed).length}/{CONTROL_TESTS.length}
            </span>
            <span className={styles.statLabel}>Тесты сданы</span>
          </div>
        </Card>
      </div>

      {weakAreas.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Слабые темы (по ошибкам в тестах)</h2>
          <Card>
            <div className={styles.weakList}>
              {weakAreas.map((w) => (
                <div key={w.category} className={styles.weakRow}>
                  <span className={styles.weakCategory}>{w.category}</span>
                  <span className={styles.weakCount}>Ошибок: {w.count}</span>
                </div>
              ))}
            </div>
            <p className={styles.hint}>
              Рекомендация: провести практический разбор тем с наибольшим числом ошибок перед допуском к
              аттестации.
            </p>
          </Card>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Результаты тестов</h2>
        <div className={styles.testRows}>
          {testRows.map(({ test, result }) => {
            const step = getStep(test.stepId)!;
            return (
              <Card key={test.id} className={styles.testRow}>
                <div className={styles.testRowTop}>
                  <div>
                    <p className={styles.testName}>{test.title}</p>
                    <p className={styles.testMeta}>
                      {step.level} · Step {step.index} · {STATUS_LABEL[getStepStatus(step, state)]}
                    </p>
                  </div>
                  {result ? (
                    <Badge variant={result.passed ? 'success' : 'warning'} size="small">
                      {result.bestScore}% · {result.attempts} поп.
                    </Badge>
                  ) : (
                    <Badge variant="secondary" size="small">
                      Не сдавался
                    </Badge>
                  )}
                </div>
                {result && <ProgressBar value={result.bestScore} showLabel={false} size="small" />}
                {state.weakAreas[test.id] && state.weakAreas[test.id].length > 0 && (
                  <p className={styles.testWeak}>Слабые темы: {state.weakAreas[test.id].join(', ')}</p>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Admin;
