import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, Module, Lesson, UserLessonProgress } from '../types';

interface LearningState {
  courses: Course[];
  modules: Record<string, Module>;
  lessons: Record<string, Lesson>;
  userLessonProgress: Record<string, UserLessonProgress>;
  setCourses: (courses: Course[]) => void;
  addModule: (module: Module) => void;
  addLesson: (lesson: Lesson) => void;
  markLessonCompleted: (userId: string, lessonId: string) => void;
  updateLessonProgress: (progress: UserLessonProgress) => void;
  getLessonProgress: (userId: string, lessonId: string) => UserLessonProgress | undefined;
  getCourseProgress: (userId: string, courseId: string) => number;
}

export const useLearningStore = create<LearningState>()(persist(
  (set, get) => ({
    courses: [],
    modules: {},
    lessons: {},
    userLessonProgress: {},

    setCourses: (courses: Course[]) => set({ courses }),

    addModule: (module: Module) => {
      const { modules } = get();
      set({ modules: { ...modules, [module.id]: module } });
    },

    addLesson: (lesson: Lesson) => {
      const { lessons } = get();
      set({ lessons: { ...lessons, [lesson.id]: lesson } });
    },

    markLessonCompleted: (userId: string, lessonId: string) => {
      const key = `${userId}-${lessonId}`;
      const { userLessonProgress } = get();
      const progress = userLessonProgress[key] || {
        userId,
        lessonId,
        completed: false,
        startedAt: new Date(),
        timeSpent: 0,
      };

      progress.completed = true;
      progress.completedAt = new Date();
      set({ userLessonProgress: { ...userLessonProgress, [key]: progress } });
    },

    updateLessonProgress: (progress: UserLessonProgress) => {
      const { userLessonProgress } = get();
      const key = `${progress.userId}-${progress.lessonId}`;
      set({ userLessonProgress: { ...userLessonProgress, [key]: progress } });
    },

    getLessonProgress: (userId: string, lessonId: string) => {
      const { userLessonProgress } = get();
      return userLessonProgress[`${userId}-${lessonId}`];
    },

    getCourseProgress: (userId: string, courseId: string) => {
      const { courses, lessons, userLessonProgress } = get();
      const course = courses.find((c) => c.id === courseId);
      if (!course) return 0;

      const courseLessons = course.moduleIds
        .flatMap((moduleId) => {
          return Object.values(lessons).filter((l) => l.moduleId === moduleId);
        })
        .filter((l) => !!l);

      if (courseLessons.length === 0) return 0;

      const completedCount = courseLessons.filter(
        (l) => userLessonProgress[`${userId}-${l.id}`]?.completed
      ).length;

      return Math.round((completedCount / courseLessons.length) * 100);
    },
  }),
  {
    name: '202f-learning-store',
  }
));