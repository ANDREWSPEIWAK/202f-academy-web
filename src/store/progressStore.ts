// ===== 202f Academy — Единое хранилище прогресса + геймификация =====
// Объединение существующего progressStore (уроки, тесты, чек-листы ступеней)
// с эталонной моделью живого сайта (XP, ранги, бейджи, квесты дня, стрик,
// известные рецепты, прочитанные методики, модули, экзамен, кейсы, rush).

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  STEPS,
  Step,
  XP,
  getStep,
  badges,
  questPool,
  QuestTemplate,
  badgeFor,
} from '../data/gamification';
import { CategoryStat, updateStat } from '../engine/testingEngine';

const TODAY = new Date().toISOString().slice(0, 10);

export type StepStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface TestResult {
  bestScore: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt: string;
}

export interface QuestStateStored {
  id: string;
  title: string;
  target: number;
  xp: number;
  metric: QuestTemplate['metric'];
  progress: number;
  done: boolean;
}

export interface ProgressState {
  // --- Существующее (курс, шаги, уроки, тесты) ---
  xp: number;
  completedLessons: Record<string, boolean>;
  checklist: Record<string, boolean>; // ключ: `${stepId}:${index}`
  testResults: Record<string, TestResult>; // ключ: testId
  weakAreas: Record<string, string[]>;
  completedSteps: string[];
  completedLevels: string[];
  categoryStats: Record<string, CategoryStat>;
  recentQuestionIds: string[];

  // --- Геймификация (эталон живого сайта) ---
  known: Record<string, boolean>; // recipe id → known
  lessonsRead: Record<string, boolean>; // library item id → read
  modulesDone: Record<string, boolean>; // module id → done
  quizBest: number;
  blitzBest: number;
  examKnown: Record<string, boolean>; // exam question id → known
  casesScore: Record<string, number>; // case id → best score (0/1/2)
  checklistsDone: Record<string, string[]>; // checklistId → date strings
  rushBest: number;
  streak: { count: number; last: string };
  days: string[]; // opened dates
  earnedBadges: string[];
  quests: { date: string; items: QuestStateStored[] };
  toasts: string[]; // исключено из persist

  // --- Действия (существующие) ---
  addXp: (amount: number, reason?: string) => void;
  completeLesson: (lessonId: string) => void;
  toggleChecklistItem: (stepId: string, index: number) => void;
  recordTestResult: (testId: string, score: number, passingScore: number, weakCategories?: string[]) => void;
  recordCategoryAnswers: (answers: { category: string; correct: boolean; questionId: string }[]) => void;
  resetProgress: () => void;

  // --- Новые действия геймификации ---
  dayOpened: () => void;
  markKnown: (id: string, value?: boolean) => void;
  readLesson: (id: string) => void;
  completeModule: (id: string) => void;
  recordQuiz: (scorePct: number) => void;
  recordBlitz: (correct: number) => void;
  recordExam: (id: string, known: boolean) => void;
  recordCase: (id: string, score: number) => void;
  completeChecklist: (id: string) => void;
  recordRush: (served: number) => void;
  bumpQuest: (metric: QuestTemplate['metric'], amount: number) => void;
  checkBadges: () => void;
  syncNow: () => void;
  claimCode: (code: string) => void;
  resetAll: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // --- Начальное состояние ---
      xp: 0,
      completedLessons: {},
      checklist: {},
      testResults: {},
      weakAreas: {},
      completedSteps: [],
      completedLevels: [],
      categoryStats: {},
      recentQuestionIds: [],

      known: {},
      lessonsRead: {},
      modulesDone: {},
      quizBest: 0,
      blitzBest: 0,
      examKnown: {},
      casesScore: {},
      checklistsDone: {},
      rushBest: 0,
      streak: { count: 0, last: '' },
      days: [],
      earnedBadges: [],
      quests: { date: TODAY, items: [] },
      toasts: [],

      // --- Существующие действия ---

      addXp: (amount, reason) => {
        const { xp, toasts } = get();
        const nextXp = xp + amount;
        set({ xp: nextXp, toasts: [...toasts, `+${amount} XP${reason ? ` · ${reason}` : ''}`] });
        get().checkBadges();
      },

      completeLesson: (lessonId) => {
        const { completedLessons, xp, toasts } = get();
        if (completedLessons[lessonId]) return;
        set({
          completedLessons: { ...completedLessons, [lessonId]: true },
          xp: xp + XP.LESSON_COMPLETED,
          toasts: [...toasts, `+${XP.LESSON_COMPLETED} XP · методика изучена`],
        });
        get().bumpQuest('lesson', 1);
        get().checkBadges();
      },

      toggleChecklistItem: (stepId, index) => {
        const { checklist, xp, toasts } = get();
        const key = `${stepId}:${index}`;
        const wasChecked = !!checklist[key];
        const next = { ...checklist, [key]: !wasChecked };
        set({
          checklist: next,
          xp: wasChecked ? Math.max(0, xp - XP.CHECKLIST_ITEM) : xp + XP.CHECKLIST_ITEM,
          toasts: [
            ...toasts,
            `${wasChecked ? '−' : '+'}${XP.CHECKLIST_ITEM} XP · чек-лист`,
          ],
        });
        get().checkBadges();
      },

      recordTestResult: (testId, score, passingScore, weakCategories) => {
        const { testResults, xp, toasts } = get();
        const prev = testResults[testId];
        const passed = score >= passingScore;
        const next: TestResult = {
          bestScore: Math.max(prev?.bestScore ?? 0, score),
          passed: (prev?.passed ?? false) || passed,
          attempts: (prev?.attempts ?? 0) + 1,
          lastAttemptAt: new Date().toISOString(),
        };
        const step = STEPS.find((s) => s.controlTestId === testId);
        const gain =
          passed && !prev?.passed
            ? step?.isAttestation
              ? XP.ATTESTATION_PASS
              : XP.CONTROL_TEST_PASS
            : 0;
        set({
          testResults: { ...testResults, [testId]: next },
          weakAreas: weakCategories ? { ...get().weakAreas, [testId]: weakCategories } : get().weakAreas,
          xp: xp + gain,
          toasts: gain > 0 ? [...toasts, `+${gain} XP · тест пройден`] : toasts,
        });
        get().checkBadges();
      },

      recordCategoryAnswers: (answers) => {
        const { categoryStats, recentQuestionIds, xp, toasts } = get();
        const nextStats = { ...categoryStats };
        for (const a of answers) {
          nextStats[a.category] = updateStat(nextStats[a.category], a.correct);
        }
        const nextRecent = [...new Set([...answers.map((a) => a.questionId), ...recentQuestionIds])].slice(0, 40);
        const correctCount = answers.filter((a) => a.correct).length;
        set({
          categoryStats: nextStats,
          recentQuestionIds: nextRecent,
          xp: xp + correctCount * XP.DRILL_CORRECT,
          toasts: correctCount > 0 ? [...toasts, `+${correctCount * XP.DRILL_CORRECT} XP · тренировка`] : toasts,
        });
        get().checkBadges();
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
          known: {},
          lessonsRead: {},
          modulesDone: {},
          quizBest: 0,
          blitzBest: 0,
          examKnown: {},
          casesScore: {},
          checklistsDone: {},
          rushBest: 0,
          streak: { count: 0, last: '' },
          days: [],
          earnedBadges: [],
          quests: { date: TODAY, items: [] },
          toasts: [],
        }),

      // --- Новые действия геймификации ---

      dayOpened: () => {
        const { streak, days, quests, toasts } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const nextCount = streak.last === yesterday ? streak.count + 1 : 1;
        const nextDays = [...new Set([...days, TODAY])];
        const nextStreak = { count: nextCount, last: TODAY };

        // Свежие квесты на новую дату
        let nextQuests = quests;
        if (quests.date !== TODAY) {
          nextQuests = { date: TODAY, items: freshQuests(TODAY) };
        }

        set({
          streak: nextStreak,
          days: nextDays,
          quests: nextQuests,
          toasts: [...toasts, `Сменина открыта · стрик ${nextCount}`],
        });
        get().checkBadges();
      },

      markKnown: (id, value = true) => {
        const { known, xp, toasts } = get();
        const wasKnown = !!known[id];
        if (value && !wasKnown) {
          set({
            known: { ...known, [id]: true },
            xp: xp + 6,
            toasts: [...toasts, `+6 XP · рецепт ТТК`],
          });
          get().bumpQuest('known', 1);
          get().checkBadges();
        } else if (!value && wasKnown) {
          set({
            known: { ...known, [id]: false },
            xp: Math.max(0, xp - 6),
            toasts: [...toasts, '−6 XP · рецепт снят'],
          });
        }
      },

      readLesson: (id) => {
        const { lessonsRead, xp, toasts } = get();
        if (lessonsRead[id]) return;
        set({
          lessonsRead: { ...lessonsRead, [id]: true },
          xp: xp + 10,
          toasts: [...toasts, `+10 XP · методика изучена`],
        });
        get().bumpQuest('lesson', 1);
        get().checkBadges();
      },

      completeModule: (id) => {
        const { modulesDone, xp, toasts } = get();
        if (modulesDone[id]) return;
        set({
          modulesDone: { ...modulesDone, [id]: true },
          xp: xp + 40,
          toasts: [...toasts, `+40 XP · модуль закрыт`],
        });
        get().checkBadges();
      },

      recordQuiz: (scorePct) => {
        const { quizBest, xp, toasts } = get();
        const nextBest = Math.max(quizBest, scorePct);
        const gain = Math.round(scorePct / 5);
        set({
          quizBest: nextBest,
          xp: xp + gain,
          toasts: [...toasts, `+${gain} XP · квиз ${scorePct}%`],
        });
        get().bumpQuest('quiz', 1);
        get().checkBadges();
      },

      recordBlitz: (correct) => {
        const { blitzBest, xp, toasts } = get();
        const nextBest = Math.max(blitzBest, correct);
        const gain = correct * 3;
        set({
          blitzBest: nextBest,
          xp: xp + gain,
          toasts: [...toasts, `+${gain} XP · блиц ${correct}`],
        });
        get().bumpQuest('blitz', correct);
        get().checkBadges();
      },

      recordExam: (id, known) => {
        const { examKnown, xp, toasts } = get();
        const wasKnown = !!examKnown[id];
        if (known && !wasKnown) {
          set({
            examKnown: { ...examKnown, [id]: true },
            xp: xp + 8,
            toasts: [...toasts, `+8 XP · экзамен`],
          });
        } else if (!known && wasKnown) {
          set({
            examKnown: { ...examKnown, [id]: false },
            xp: Math.max(0, xp - 8),
            toasts: [...toasts, '−8 XP · экзамен снят'],
          });
        }
        get().checkBadges();
      },

      recordCase: (id, score) => {
        const { casesScore, toasts } = get();
        const prev = casesScore[id] ?? -1;
        if (score > prev) {
          set({
            casesScore: { ...casesScore, [id]: score },
            toasts: [...toasts, `Кейс ${id}: ${score}/2`],
          });
          if (score === 2 && prev < 2) {
            set((s) => ({ xp: s.xp + 12, toasts: [...s.toasts, `+12 XP · кейс решён`] }));
            get().bumpQuest('checklist', 1);
          }
        }
        get().checkBadges();
      },

      completeChecklist: (id) => {
        const { checklistsDone, xp, toasts } = get();
        const dates = checklistsDone[id] ?? [];
        if (dates.includes(TODAY)) return;
        set({
          checklistsDone: { ...checklistsDone, [id]: [...dates, TODAY] },
          xp: xp + 30,
          toasts: [...toasts, `+30 XP · чек-лист закрыт`],
        });
        get().bumpQuest('checklist', 1);
        get().checkBadges();
      },

      recordRush: (served) => {
        const { rushBest, xp, toasts } = get();
        const nextBest = Math.max(rushBest, served);
        const gain = served * 5;
        set({
          rushBest: nextBest,
          xp: xp + gain,
          toasts: [...toasts, `+${gain} XP · rush ${served}`],
        });
        get().bumpQuest('rush', served);
        get().checkBadges();
      },

      bumpQuest: (metric, amount) => {
        const { quests, toasts } = get();
        if (quests.date !== TODAY) return; // квесты уже сброшены dayOpened
        const nextItems = quests.items.map((q) => {
          if (q.done || q.metric !== metric) return q;
          const nextProgress = Math.min(q.progress + amount, q.target);
          return { ...q, progress: nextProgress, done: nextProgress >= q.target };
        });
        const allDone = nextItems.every((q) => q.done);
        set({
          quests: { date: TODAY, items: nextItems },
          toasts: allDone
            ? [...toasts, 'Все квесты дня выполнены · бейдж quest-day']
            : toasts,
        });
        if (allDone) get().checkBadges();
      },

      checkBadges: () => {
        const {
          known,
          quizBest,
          blitzBest,
          streak,
          rushBest,
          days,
          examKnown,
          quests,
          earnedBadges,
          toasts,
          checklistsDone,
        } = get();

        const knownCount = Object.values(known).filter(Boolean).length;
        const examKnownCount = Object.values(examKnown).filter(Boolean).length;
        const questsDoneToday = quests.items.filter((q) => q.done).length;

        const newlyEarned = badgeFor({
          knownCount,
          quizBest,
          blitzBest,
          streak: streak.count,
          rushBest,
          days: days.length,
          examKnownCount,
          questsDoneToday,
          questsTotalToday: quests.items.length,
          checklistsDoneToday: Object.values(checklistsDone).flat(),
        }).filter((b) => !earnedBadges.includes(b));

        if (newlyEarned.length > 0) {
          const nextBadges = [...earnedBadges, ...newlyEarned];
          set({
            earnedBadges: nextBadges,
            toasts: [
              ...toasts,
              ...newlyEarned.map((bId) => {
                const b = badges.find((x) => x.id === bId);
                return `Бейдж: ${b ? b.title : bId}`;
              }),
            ],
          });
        }
      },

      syncNow: () => {
        // Заглушка — реальная синхронизация через сервер (Волна 5)
        set((s) => ({ toasts: [...s.toasts, 'Синхронизация: сервер будет добавлен в следующей волне'] }));
      },

      claimCode: (code) => {
        // Заглушка — привязка устройства по коду (Волна 5)
        set((s) => ({ toasts: [...s.toasts, `Код ${code} будет привязан к устройству в следующей волне`] }));
      },

      resetAll: () => {
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
          known: {},
          lessonsRead: {},
          modulesDone: {},
          quizBest: 0,
          blitzBest: 0,
          examKnown: {},
          casesScore: {},
          checklistsDone: {},
          rushBest: 0,
          streak: { count: 0, last: '' },
          days: [],
          earnedBadges: [],
          quests: { date: TODAY, items: [] },
          toasts: [],
        });
      },
    }),
    {
      name: '202f-progress-store',
      partialize: (s) => {
        const { toasts, ...rest } = s;
        return rest;
      },
    }
  )
);

// ===== Селекторы и логика допуска (существующие, сохранены) =====

export function isStepLessonsDone(step: Step, completedLessons: Record<string, boolean>): boolean {
  return step.lessonIds.every((id) => completedLessons[id]);
}

export function isStepChecklistDone(step: Step, checklist: Record<string, boolean>): boolean {
  return step.checklist.every((_, i) => checklist[`${step.id}:${i}`]);
}

export function isStepTestPassed(step: Step, testResults: Record<string, TestResult>): boolean {
  return !!testResults[step.controlTestId]?.passed;
}

export function isStepCompleted(step: Step, state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>): boolean {
  return (
    isStepLessonsDone(step, state.completedLessons) &&
    isStepChecklistDone(step, state.checklist) &&
    isStepTestPassed(step, state.testResults)
  );
}

function isPreviousStepCompleted(step: Step, state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>): boolean {
  if (step.index === 1) return true;
  const idx = STEPS.findIndex((s) => s.id === step.id);
  const prev = STEPS[idx - 1];
  return isStepCompleted(prev, state);
}

export function isStepUnlocked(
  step: Step,
  state: Pick<ProgressState, 'xp' | 'completedLessons' | 'checklist' | 'testResults'>
): boolean {
  if (step.level === 'Junior' && step.index === 0) {
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

export function getStepProgress(
  step: Step,
  state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>
): number {
  const lessons = step.lessonIds.filter((id) => state.completedLessons[id]).length / step.lessonIds.length;
  const checklist = step.checklist.filter((_, i) => state.checklist[`${step.id}:${i}`]).length / step.checklist.length;
  const test = isStepTestPassed(step, state.testResults) ? 1 : 0;
  return Math.round((lessons * 0.4 + checklist * 0.3 + test * 0.3) * 100);
}

export function getCurrentStep(
  state: Pick<ProgressState, 'xp' | 'completedLessons' | 'checklist' | 'testResults'>
): Step {
  for (const step of STEPS) {
    const status = getStepStatus(step, state);
    if (status === 'available' || status === 'in_progress') return step;
  }
  return STEPS[STEPS.length - 1];
}

export function isLevelCompleted(level: string, state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>): boolean {
  const attestation = STEPS.find((s) => s.level === level && s.isAttestation);
  return attestation ? isStepCompleted(attestation, state) : false;
}

export function countCompletedSteps(
  state: Pick<ProgressState, 'completedLessons' | 'checklist' | 'testResults'>
): number {
  return STEPS.filter((s) => isStepCompleted(s, state)).length;
}

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

// ===== Вспомогательные функции квестов (внутренние) =====

function seedFromDate(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function freshQuests(date: string): QuestStateStored[] {
  let seed = seedFromDate(date);
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const shuffled = [...questPool].sort(() => next() - 0.5);
  return shuffled.slice(0, 3).map((t) => ({
    id: t.id,
    title: t.title,
    target: t.target,
    xp: t.xp,
    metric: t.metric,
    progress: 0,
    done: false,
  }));
}

export { getStep };