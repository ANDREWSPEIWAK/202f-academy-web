import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTrainerStore = create()(persist((set, get) => ({
    messages: [],
    currentMode: 'TRAINER',
    setMode: (mode) => {
        set({ currentMode: mode });
    },
    addMessage: (message) => {
        const { messages } = get();
        messages.push(message);
        set({ messages });
    },
    getUserMessages: (userId) => {
        const { messages } = get();
        return messages.filter((m) => m.userId === userId);
    },
}), {
    name: '202f-trainer-store',
}));
