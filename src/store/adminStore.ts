import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AssignmentKind = 'drill' | 'test';

export interface Assignment {
  id: string;
  targetEmail: string;
  kind: AssignmentKind;
  /** для drill — категория слабого места; для test — id контрольного теста */
  refId: string;
  note: string;
  createdAt: string;
  done: boolean;
}

interface AdminState {
  assignments: Assignment[];
  addAssignment: (a: Omit<Assignment, 'id' | 'createdAt' | 'done'>) => void;
  markDone: (id: string) => void;
  removeAssignment: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      assignments: [],

      addAssignment: (a) =>
        set((s) => ({
          assignments: [
            { ...a, id: `a-${Date.now()}`, createdAt: new Date().toISOString(), done: false },
            ...s.assignments,
          ],
        })),

      markDone: (id) =>
        set((s) => ({
          assignments: s.assignments.map((a) => (a.id === id ? { ...a, done: true } : a)),
        })),

      removeAssignment: (id) =>
        set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),
    }),
    { name: '202f-admin-store' }
  )
);
