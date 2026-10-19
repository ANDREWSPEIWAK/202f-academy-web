// Центральное хранилище прогресса квалификации.
// Строгая последовательность: нельзя перепрыгивать уровни и ступени.
// Ступень завершена только при: пройденных уроках + закрытом чек-листе + контрольном тесте ≥85%.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STEPS, Step, XP, getStep } from '../data/gamification';
import { CategoryStat, updateStat } from '../engine/testingEngine';

export type StepStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface TestResult {
  bestScore: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt: string;
}

interface ProgressState {
  xp: number;
  completedLessons: Record<string, boolean>;
  checklist: Record<string, boolean>; // ключ: `${stepId}:${index}`
  testResults: Record<string, TestResult>; // ключ: testId
  weakAreas: Record<string, string[]>; // testId → категории с ошибками последней попытки
  completedSteps: string[];
  completedLevels: string[];
  /** spaced repetition: статистика по категориям вопросов */
  categoryStats: Record<string, CategoryStat>;
  /** последние показанные вопросы тренажёра (защита от повторов) */
  recentQuestionIds: string[];

  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  toggleChecklistItem: (stepId: string, index: number) => void;
  recordTestResult: (testId: string, score: number, passingScore: number, weakCategories?: string[]) => void;
  recordCategoryAnswers: (answers: { category: string; correct: boolean; questionId: string }[]) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      completedLessons: {},
      checklist: {},
      testResults: {},
      weakAreas: {},
      completedSteps: [],
      completedLevels: [],
      categoryStats: {},
      recentQuestionIds: [],

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      completeLesson: (lessonId) => {
        const { completedLessons, xp } = get();
        if (completedLessons[lessonId]) return;
        set({
          completedLessons: { ...completedLessons, [lessonId]: true },
          xp: xp + XP.LESSON_COMPLETED,
        });
      },

      toggleChecklistItem: (stepId, index) => {
        const { checklist, xp } = get();
        const key = `${stepId}:${index}`;
        const wasChecked = !!checklist[key];
        const next = { ...checklist, [key]: !wasChecked };
        set({
          checklist: next,
          xp: wasChecked ? Math.max(0, xp - XP.CHECKLIST_ITEM) : xp + XP.CHECKLIST_ITEM,
        });
      },

      recordTestResult: (testId, score, passingScore, weakCategories) => {
        const { testResults, xp } = get();
        const prev = testResults[testId];
        const passed = score >= passingScore;
        const next: TestResult = {
          bestScore: Math.max(prev?.bestScore ?? 0, score),
          passed: (prev?.passed ?? false) || passed,
          attempts: (prev?.attempts ?? 0) + 1,
          lastAttemptAt: new Date().toISOString(),
        };
        // XP начисляется только за первое прохождение
        const step = STEPS.find((s) => s.controlTestId === testId);
        const gain = passed && !prev?.passed ? (step?.isAttestation ? XP.ATTESTATION_PASS : XP.CONTROL_TEST_PASS) : 0;
        set({
          testResults: { ...testResults, [testId]: next },
          weakAreas: weakCategories ? { ...get().weakAreas, [testId]: weakCategories } : get().weakAreas,
          xp: xp + gain,
        });
      },

      recordCategoryAnswers: (answers) => {
        const { categoryStats, recentQuestionIds, xp } = get();
        const nextStats = { ...categoryStats };
        for (const a of answers) {
          nextStats[a.category] = updateStat(nextStats[a.category], a.correct);
        }
        // кольцо последних 40 вопросов для защиты от повторов
        const nextRecent = [...new Set([...answers.map((a) => a.questionId), ...recentQuestionIds])].slice(0, 40);
        const correctCount = answers.filter((a) => a.correct).length;
        set({
          categoryStats: nextStats,
          recentQuestionIds: nextRecent,
          xp: xp + correctCount * XP.DRILL_CORRECT,
        });
      },

      resetProgress: () =>
        set({
          xp: 0,
          completedLessons: {},
          checklist: {},
          testResults: {},
          weakAreas: {},
          completedSteps: [],
          completedLevels: [],
          categoryStats: {},
          recentQuestionIds: [],
        }),
    }),
    { name: '202f-progress-store' }
  )
);

// ===== Селекторы и логика допуска =====

export function isStepLessonsDone(step: Step, completedLessons: Record<string, boolean>): boolean {
  return step.lessonIds.every((id) => completedLessons[id]);
}

export function isStepChecklistDone(step: Step, checklist: Record<string, boolean>): boolean {
  return step.checklist.every((_, i) => checklist[`${step.id}:${i}`]);
}

export function isStepTestPassed(step: Step, testResults: Record<string, TestResult>): boolean {
  return !!testResults[step.controlTestId]?.passed;
}

/** Ступень полностью завершена */
export function isStepCompleted(step: Step, state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>): boolean {
  return (
    isStepLessonsDone(step, state.completedLessons) &&
    isStepChecklistDone(step, state.checklist) &&
    isStepTestPassed(step, state.testResults)
  );
}

/** Предыдущая ступень завершена (для первой ступени уровня — завершён предыдущий уровень) */
function isPreviousStepCompleted(step: Step, state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>): boolean {
  if (step.index === 1) return true; // вход в уровень открывается завершением предыдущего уровня (см. isStepUnlocked)
  const idx = STEPS.findIndex((s) => s.id === step.id);
  const prev = STEPS[idx - 1];
  return isStepCompleted(prev, state);
}

/**
 * Доступ к ступени: строгая цепочка.
 * - Первая ступень Junior всегда доступна.
 * - Первая ступень уровня N открывается после аттестации уровня N-1.
 * - Ступень k открывается после завершения ступени k-1.
 * - Дополнительно требуется накопительный XP-порог.
 */
export function isStepUnlocked(
  step: Step,
  state: Pick<ProgressState, 'xp' | 'completedLessons' | 'checklist' | 'testResults'>
): boolean {
  if (step.level === 'JUNIOR' && step.index === 1) {
    return state.xp >= step.xpRequired;
  }
  if (!isPreviousStepCompleted(step, state)) return false;
  return state.xp >= step.xpRequired;
}

export function getStepStatus(
  step: Step,
  state: Pick<ProgressState, 'xp' | 'completedLessons' | 'checklist' | 'testResults'>
): StepStatus {
  if (isStepCompleted(step, state)) return 'completed';
  if (!isStepUnlocked(step, state)) return 'locked';
  const started =
    step.lessonIds.some((id) => state.completedLessons[id]) ||
    step.checklist.some((_, i) => state.checklist[`${step.id}:${i}`]) ||
    !!state.testResults[step.controlTestId];
  return started ? 'in_progress' : 'available';
}

/** Прогресс ступени 0–100: уроки 40%, чек-лист 30%, тест 30% */
export function getStepProgress(
  step: Step,
  state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>
): number {
  const lessons = step.lessonIds.filter((id) => state.completedLessons[id]).length / step.lessonIds.length;
  const checklist = step.checklist.filter((_, i) => state.checklist[`${step.id}:${i}`]).length / step.checklist.length;
  const test = isStepTestPassed(step, state.testResults) ? 1 : 0;
  return Math.round((lessons * 0.4 + checklist * 0.3 + test * 0.3) * 100);
}

/** Текущая ступень: первая незавершённая доступная */
export function getCurrentStep(
  state: Pick<ProgressState, 'xp' | 'completedLessons' | 'checklist' | 'testResults'>
): Step {
  for (const step of STEPS) {
    const status = getStepStatus(step, state);
    if (status === 'available' || status === 'in_progress') return step;
  }
  // Все ступени завершены
  return STEPS[STEPS.length - 1];
}

/** Уровень завершён, если завершена его аттестация (ступень 5) */
export function isLevelCompleted(level: string, state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>): boolean {
  const attestation = STEPS.find((s) => s.level === level && s.isAttestation);
  return attestation ? isStepCompleted(attestation, state) : false;
}

/** Число завершённых ступеней (вычисляется, а не хранится) */
export function countCompletedSteps(
  state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>
): number {
  return STEPS.filter((s) => isStepCompleted(s, state)).length;
}

/** Слабые темы по результатам тестов: категории с ошибками */
export function getWeakAreas(
  answers: { category: string; correct: boolean }[]
): { category: string; total: number; wrong: number }[] {
  const map = new Map<string, { total: number; wrong: number }>();
  for (const a of answers) {
    const entry = map.get(a.category) ?? { total: 0, wrong: 0 };
    entry.total += 1;
    if (!a.correct) entry.wrong += 1;
    map.set(a.category, entry);
  }
  return Array.from(map.entries())
    .map(([category, v]) => ({ category, ...v }))
    .filter((v) => v.wrong > 0)
    .sort((a, b) => b.wrong / b.total - a.wrong / a.total);
}

export { getStep };
