// Журнал тренировок 202f — профессиональная лабораторная тетрадь.
// Каждая запись: что тренировал, на чём, что вышло, что менял, следующий шаг.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  createdAt: string; // ISO
  /** тип тренировки: id задачи или свободное название */
  training: string;
  taskId?: string;
  coffee: string;
  equipment: string;
  recipe: string;
  result: string;
  taste: string;
  problem: string;
  changed: string;
  nextStep: string;
  rating: number; // 1–5
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  removeEntry: (id: string) => void;
  reset: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({
          entries: [
            { ...entry, id: `je-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() },
            ...s.entries,
          ],
        })),
      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      reset: () => set({ entries: [] }),
    }),
    { name: '202f-journal-store' }
  )
);

/** История попыток одной тренировки — для сравнения прогресса */
export function entriesForTask(entries: JournalEntry[], taskId: string): JournalEntry[] {
  return entries.filter((e) => e.taskId === taskId);
}
