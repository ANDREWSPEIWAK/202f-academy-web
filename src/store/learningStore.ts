import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, Module, Lesson, UserLessonProgress } from '../types';

interface LearningState {
  courses: Course[];
  modules: Map<string, Module>;
  lessons: Map<string, Lesson>;
  userLessonProgress: Map<string, UserLessonProgress>;
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
    modules: new Map(),
    lessons: new Map(),
    userLessonProgress: new Map(),

    setCourses: (courses: Course[]) => set({ courses }),

    addModule: (module: Module) => {
      const { modules } = get();
      modules.set(module.id, module);
      set({ modules });
    },

    addLesson: (lesson: Lesson) => {
      const { lessons } = get();
      lessons.set(lesson.id, lesson);
      set({ lessons });
    },

    markLessonCompleted: (userId: string, lessonId: string) => {
      const key = `${userId}-${lessonId}`;
      const { userLessonProgress } = get();
      const progress = userLessonProgress.get(key) || {
        userId,
        lessonId,
        completed: false,
        startedAt: new Date(),
        timeSpent: 0,
      };

      progress.completed = true;
      progress.completedAt = new Date();
      userLessonProgress.set(key, progress);
      set({ userLessonProgress });
    },

    updateLessonProgress: (progress: UserLessonProgress) => {
      const { userLessonProgress } = get();
      const key = `${progress.userId}-${progress.lessonId}`;
      userLessonProgress.set(key, progress);
      set({ userLessonProgress });
    },

    getLessonProgress: (userId: string, lessonId: string) => {
      const { userLessonProgress } = get();
      return userLessonProgress.get(`${userId}-${lessonId}`);
    },

    getCourseProgress: (userId: string, courseId: string) => {
      const { courses, lessons, userLessonProgress } = get();
      const course = courses.find((c) => c.id === courseId);
      if (!course) return 0;

      const courseLessons = course.moduleIds
        .flatMap((moduleId) => {
          // Get lessons for this module
          return Array.from(lessons.values()).filter((l) => l.moduleId === moduleId);
        })
        .filter((l) => !!l);

      if (courseLessons.length === 0) return 0;

      const completedCount = courseLessons.filter(
        (l) => userLessonProgress.get(`${userId}-${l.id}`)?.completed
      ).length;

      return Math.round((completedCount / courseLessons.length) * 100);
    },
  }),
  {
    name: '202f-learning-store',
  }
));
