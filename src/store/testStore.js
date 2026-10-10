import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTestStore = create()(persist((set, get) => ({
    tests: new Map(),
    questions: new Map(),
    testAttempts: [],
    addTest: (test) => set((state) => {
        const next = new Map(state.tests);
        next.set(test.id, test);
        return { tests: next };
    }),
    addQuestion: (question) => set((state) => {
        const next = new Map(state.questions);
        next.set(question.id, question);
        return { questions: next };
    }),
    getTest: (testId) => {
        const { tests } = get();
        return tests.get(testId);
    },
    getQuestion: (questionId) => {
        const { questions } = get();
        return questions.get(questionId);
    },
    submitTestAttempt: (attempt) => {
        const { testAttempts } = get();
        testAttempts.push(attempt);
        set({ testAttempts });
    },
    getUserTestAttempts: (userId) => {
        const { testAttempts } = get();
        return testAttempts.filter((a) => a.userId === userId);
    },
    getTestAttempt: (attemptId) => {
        const { testAttempts } = get();
        return testAttempts.find((a) => a.id === attemptId);
    },
}), {
    name: '202f-test-store',
}));
