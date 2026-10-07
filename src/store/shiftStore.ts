import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShiftIncident {
  id: string;
  text: string;
  at: string;
}

export interface ShiftNote {
  id: string;
  text: string;
  at: string;
}

export interface ClosedShift {
  id: string;
  openedAt: string;
  closedAt: string;
  drinks: number;
  incidents: ShiftIncident[];
  notes: ShiftNote[];
}

interface ShiftState {
  open: {
    openedAt: string;
    drinks: number;
    incidents: ShiftIncident[];
    notes: ShiftNote[];
  } | null;
  history: ClosedShift[];

  openShift: () => void;
  closeShift: () => void;
  addDrinks: (n: number) => void;
  addIncident: (text: string) => void;
  addNote: (text: string) => void;
}

export const useShiftStore = create<ShiftState>()(
  persist(
    (set, get) => ({
      open: null,
      history: [],

      openShift: () =>
        set({
          open: { openedAt: new Date().toISOString(), drinks: 0, incidents: [], notes: [] },
        }),

      closeShift: () => {
        const { open, history } = get();
        if (!open) return;
        set({
          open: null,
          history: [
            {
              id: `s-${Date.now()}`,
              openedAt: open.openedAt,
              closedAt: new Date().toISOString(),
              drinks: open.drinks,
              incidents: open.incidents,
              notes: open.notes,
            },
            ...history,
          ].slice(0, 30),
        });
      },

      addDrinks: (n) => {
        const open = get().open;
        if (!open) return;
        set({ open: { ...open, drinks: open.drinks + n } });
      },

      addIncident: (text) => {
        const open = get().open;
        if (!open || !text.trim()) return;
        set({
          open: {
            ...open,
            incidents: [...open.incidents, { id: `i-${Date.now()}`, text: text.trim(), at: new Date().toISOString() }],
          },
        });
      },

      addNote: (text) => {
        const open = get().open;
        if (!open || !text.trim()) return;
        set({
          open: {
            ...open,
            notes: [...open.notes, { id: `n-${Date.now()}`, text: text.trim(), at: new Date().toISOString() }],
          },
        });
      },
    }),
    { name: '202f-shift-store' }
  )
);
