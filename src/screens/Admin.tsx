import React, { useMemo, useState } from 'react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import styles from './Admin.module.css';
import { CONTROL_TESTS } from '../data/controlTests';
import { QUESTIONS } from '../data/questions';
import { getStep, formatXp, STEPS } from '../data/gamification';
import { useProgressStore, getStepStatus } from '../store/progressStore';
import { useAuthStore, listUsers } from '../store/authStore';
import { useAdminStore, Assignment } from '../store/adminStore';
import { errorRate } from '../engine/testingEngine';
import { computeSkillMatrix, averageSkillValue } from '../data/skillMatrix';
import { useTrainingStore, summarizeAll } from '../store/trainingStore';

const STATUS_LABEL: Record<string, string> = {
  locked: 'Заблокирована',
  available: 'Доступна',
  in_progress: 'В работе',
  completed: 'Завершена',
};

const Admin: React.FC = () => {
  const state = useProgressStore();
  const user = useAuthStore((s) => s.user);
  const { assignments, addAssignment, removeAssignment } = useAdminStore();

  const [targetEmail, setTargetEmail] = useState('');
  const [kind, setKind] = useState<'drill' | 'test'>('drill');
  const [refId, setRefId] = useState('');
  const [note, setNote] = useState('');

  const users = useMemo(() => listUsers(), []);
  const categories = useMemo(
    () => Array.from(new Set(QUESTIONS.map((q) => q.category))).sort(),
    []
  );

  // Сводка по тестам
  const testRows = CONTROL_TESTS.map((test) => ({ test, result: state.testResults[test.id] }));

  // Слабые темы: из контрольных тестов + из статистики тренажёра
  const weakMap = new Map<string, number>();
  for (const cats of Object.values(state.weakAreas)) {
    for (const c of cats) weakMap.set(c, (weakMap.get(c) ?? 0) + 1);
  }
  for (const [category, stat] of Object.entries(state.categoryStats)) {
    const rate = errorRate(stat);
    if (rate >= 0.3) weakMap.set(category, (weakMap.get(category) ?? 0) + Math.round(rate * 10));
  }
  const weakAreas = Array.from(weakMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const lessonsDone = Object.keys(state.completedLessons).length;
  const totalLessons = STEPS.reduce((acc, s) => acc + s.lessonIds.length, 0);
  const checklistTotal = STEPS.reduce((acc, s) => acc + s.checklist.length, 0);
  const checklistDone = Object.values(state.checklist).filter(Boolean).length;

  // Аналитика навыков: матрица по данным устройства + главный разрыв
  const trainingAttempts = useTrainingStore((s) => s.attempts);
  const skillMetrics = useMemo(
    () => computeSkillMatrix(state.categoryStats, state.testResults, summarizeAll(trainingAttempts)),
    [state.categoryStats, state.testResults, trainingAttempts]
  );
  const avgSkill = averageSkillValue(skillMetrics);
  const mainGap = [...skillMetrics].sort((a, b) => a.value - b.value)[0];

  if (user?.role !== 'admin') {
    return (
      <div className={styles.admin}>
        <Card>
          <p className={styles.hint}>Панель администратора доступна только роли Admin.</p>
        </Card>
      </div>
    );
  }

  const submitAssignment = () => {
    if (!targetEmail || !refId) return;
    addAssignment({ targetEmail, kind, refId, note: note.trim() });
    setRefId('');
    setNote('');
  };

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1 className={styles.title}>Панель администратора</h1>
        <p className={styles.subtitle}>Мониторинг прогресса, слабые места, назначения команде</p>
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Команда ({users.length})</h2>
        <Card>
          <div className={styles.userList}>
            {users.map((u) => {
              const openAssignments = assignments.filter((a) => a.targetEmail === u.email && !a.done).length;
              return (
                <div key={u.id} className={styles.userRow}>
                  <div>
                    <p className={styles.userName}>{u.name}</p>
                    <p className={styles.userMeta}>{u.email}</p>
                  </div>
                  <Badge variant={u.role === 'admin' ? 'danger' : 'secondary'} size="small">
                    {u.role === 'admin' ? 'Admin' : 'Бариста'}
                  </Badge>
                  {openAssignments > 0 && (
                    <span className={styles.userAssign}>Назначений: {openAssignments}</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className={styles.hint}>
            Данные прогресса синхронизируются в рамках этого устройства. Облачный sync прогресса и аналитики —
            следующий этап бэкенда.
          </p>
        </Card>
      </section>

      {weakAreas.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Слабые темы (тесты + тренажёр)</h2>
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
              Рекомендация: назначить точечную тренировку по теме или провести практический разбор перед допуском к
              аттестации.
            </p>
          </Card>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Аналитика навыков</h2>
        <Card>
          <div className={styles.skillGrid}>
            {skillMetrics.map((m) => (
              <div key={m.def.id} className={styles.skillCell}>
                <span className={styles.skillCellValue}>{m.value}%</span>
                <span className={styles.skillCellName}>{m.def.nameRu}</span>
                <ProgressBar value={m.value} showLabel={false} size="small" />
              </div>
            ))}
          </div>
          <p className={styles.hint}>
            Средний навык: {avgSkill}%. Главный разрыв: {mainGap ? mainGap.def.nameRu.toLowerCase() : '—'}
            {mainGap && mainGap.weakAreas.length > 0 ? ` (${mainGap.weakAreas.join(', ').toLowerCase()})` : ''}.
            Рекомендация: назначить тренажёр или практическую тренировку по этой теме перед допуском к аттестации.
          </p>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Назначить работу</h2>
        <Card className={styles.assignForm}>
          <label className={styles.field}>
            <span>Кому</span>
            <select value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)}>
              <option value="">— выбрать бариста —</option>
              {users.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </label>

          <div className={styles.kindRow} role="radiogroup" aria-label="Тип назначения">
            <button
              type="button"
              role="radio"
              aria-checked={kind === 'drill'}
              className={`${styles.kindBtn} ${kind === 'drill' ? styles.kindActive : ''}`}
              onClick={() => {
                setKind('drill');
                setRefId('');
              }}
            >
              Тренажёр по категории
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={kind === 'test'}
              className={`${styles.kindBtn} ${kind === 'test' ? styles.kindActive : ''}`}
              onClick={() => {
                setKind('test');
                setRefId('');
              }}
            >
              Контрольный тест
            </button>
          </div>

          <label className={styles.field}>
            <span>{kind === 'drill' ? 'Категория' : 'Тест'}</span>
            <select value={refId} onChange={(e) => setRefId(e.target.value)}>
              <option value="">— выбрать —</option>
              {kind === 'drill'
                ? categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                : CONTROL_TESTS.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title}
                    </option>
                  ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Комментарий</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Например: повторить расчёты соотношений перед сменой"
            />
          </label>

          <Button fullWidth disabled={!targetEmail || !refId} onClick={submitAssignment}>
            Назначить
          </Button>
        </Card>

        {assignments.length > 0 && (
          <div className={styles.assignList}>
            {assignments.map((a: Assignment) => (
              <Card key={a.id} className={styles.assignRow}>
                <div className={styles.assignInfo}>
                  <p className={styles.assignTarget}>{a.targetEmail}</p>
                  <p className={styles.assignDetail}>
                    {a.kind === 'drill' ? `Тренажёр: ${a.refId}` : a.refId}
                    {a.note ? ` · ${a.note}` : ''}
                  </p>
                </div>
                <div className={styles.assignActions}>
                  {a.done ? (
                    <Badge variant="success" size="small">
                      Выполнено
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="small">
                      Активно
                    </Badge>
                  )}
                  <button type="button" className={styles.assignRemove} onClick={() => removeAssignment(a.id)} aria-label="Удалить назначение">
                    ×
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

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
