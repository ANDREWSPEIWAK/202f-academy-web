import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Test, TestAttempt, TestQuestion } from '../types';

interface TestState {
  tests: Map<string, Test>;
  questions: Map<string, TestQuestion>;
  testAttempts: TestAttempt[];
  addTest: (test: Test) => void;
  addQuestion: (question: TestQuestion) => void;
  getTest: (testId: string) => Test | undefined;
  getQuestion: (questionId: string) => TestQuestion | undefined;
  submitTestAttempt: (attempt: TestAttempt) => void;
  getUserTestAttempts: (userId: string) => TestAttempt[];
  getTestAttempt: (attemptId: string) => TestAttempt | undefined;
}

export const useTestStore = create<TestState>()(persist(
  (set, get) => ({
    tests: new Map(),
    questions: new Map(),
    testAttempts: [],

    addTest: (test: Test) => set((state) => {
      const next = new Map(state.tests);
      next.set(test.id, test);
      return { tests: next };
    }),

    addQuestion: (question: TestQuestion) => set((state) => {
      const next = new Map(state.questions);
      next.set(question.id, question);
      return { questions: next };
    }),

    getTest: (testId: string) => {
      const { tests } = get();
      return tests.get(testId);
    },

    getQuestion: (questionId: string) => {
      const { questions } = get();
      return questions.get(questionId);
    },

    submitTestAttempt: (attempt: TestAttempt) => set((state) => ({
      testAttempts: [...state.testAttempts, attempt]
    })),

    getUserTestAttempts: (userId: string) => {
      const { testAttempts } = get();
      return testAttempts.filter((a) => a.userId === userId);
    },

    getTestAttempt: (attemptId: string) => {
      const { testAttempts } = get();
      return testAttempts.find((a) => a.id === attemptId);
    },
  }),
  {
    name: '202f-test-store',
  }
));
