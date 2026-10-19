// Результаты практических тренировок: самооценка по критериям,
// измерение и лучший результат по каждой тренировке.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrainingAttempt {
  id: string;
  taskId: string;
  at: string; // ISO
  /** средняя самооценка по критериям, 0–100 */
  score: number;
  /** измеренное значение (время, температура и т.п.) */
  measured?: number;
  note?: string;
}

interface TrainingState {
  attempts: TrainingAttempt[];
  recordAttempt: (attempt: Omit<TrainingAttempt, 'id' | 'at'>) => void;
  reset: () => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      attempts: [],
      recordAttempt: (attempt) =>
        set((s) => ({
          attempts: [
            ...s.attempts,
            { ...attempt, id: `ta-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString() },
          ],
        })),
      reset: () => set({ attempts: [] }),
    }),
    { name: '202f-training-store' }
  )
);

/** Сводка по тренировке: лучший результат и число попыток */
export function summarizeTask(attempts: TrainingAttempt[], taskId: string) {
  const rows = attempts.filter((a) => a.taskId === taskId);
  return {
    attempts: rows.length,
    bestScore: rows.length ? Math.max(...rows.map((a) => a.score)) : 0,
    lastScore: rows.length ? rows[rows.length - 1].score : 0,
    lastAt: rows.length ? rows[rows.length - 1].at : null,
  };
}

/** Сводка по всем тренировкам для матрицы навыков */
export function summarizeAll(attempts: TrainingAttempt[]): Record<string, { bestScore: number; attempts: number }> {
  const map: Record<string, { bestScore: number; attempts: number }> = {};
  for (const a of attempts) {
    const cur = map[a.taskId] ?? { bestScore: 0, attempts: 0 };
    map[a.taskId] = { bestScore: Math.max(cur.bestScore, a.score), attempts: cur.attempts + 1 };
  }
  return map;
}
