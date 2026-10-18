import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTestStore = create()(persist((set, get) => ({
    tests: new Map(),
    questions: new Map(),
    testAttempts: [],
    addTest: (test) => {
        const { tests } = get();
        tests.set(test.id, test);
        set({ tests });
    },
    addQuestion: (question) => {
        const { questions } = get();
        questions.set(question.id, question);
        set({ questions });
    },
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
