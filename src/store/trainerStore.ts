import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrainerMessage } from '../types';

interface TrainerState {
  messages: TrainerMessage[];
  currentMode: 'TRAINER' | 'GUEST' | 'EXAM';
  setMode: (mode: 'TRAINER' | 'GUEST' | 'EXAM') => void;
  addMessage: (message: TrainerMessage) => void;
  getUserMessages: (userId: string) => TrainerMessage[];
}

export const useTrainerStore = create<TrainerState>()(persist(
  (set, get) => ({
    messages: [],
    currentMode: 'TRAINER',

    setMode: (mode: 'TRAINER' | 'GUEST' | 'EXAM') => {
      set({ currentMode: mode });
    },

    addMessage: (message: TrainerMessage) => {
      const { messages } = get();
      messages.push(message);
      set({ messages });
    },

    getUserMessages: (userId: string) => {
      const { messages } = get();
      return messages.filter((m) => m.userId === userId);
    },
  }),
  {
    name: '202f-trainer-store',
  }
));
