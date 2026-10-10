import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useLearningStore = create()(persist((set, get) => ({
    courses: [],
    modules: new Map(),
    lessons: new Map(),
    userLessonProgress: new Map(),
    setCourses: (courses) => set({ courses }),
    addModule: (module) => set((state) => {
        const next = new Map(state.modules);
        next.set(module.id, module);
        return { modules: next };
    }),
    addLesson: (lesson) => set((state) => {
        const next = new Map(state.lessons);
        next.set(lesson.id, lesson);
        return { lessons: next };
    }),
    markLessonCompleted: (userId, lessonId) => set((state) => {
        const key = `${userId}-${lessonId}`;
        const next = new Map(state.userLessonProgress);
        const progress = next.get(key) || {
            userId,
            lessonId,
            completed: false,
            startedAt: new Date(),
            timeSpent: 0,
        };
        progress.completed = true;
        progress.completedAt = new Date();
        next.set(key, progress);
        return { userLessonProgress: next };
    }),
    updateLessonProgress: (progress) => set((state) => {
        const next = new Map(state.userLessonProgress);
        const key = `${progress.userId}-${progress.lessonId}`;
        next.set(key, progress);
        return { userLessonProgress: next };
    }),
    getLessonProgress: (userId, lessonId) => {
        const { userLessonProgress } = get();
        return userLessonProgress.get(`${userId}-${lessonId}`);
    },
    getCourseProgress: (userId, courseId) => {
        const { courses, lessons, userLessonProgress } = get();
        const course = courses.find((c) => c.id === courseId);
        if (!course)
            return 0;
        const courseLessons = course.moduleIds
            .flatMap((moduleId) => {
            // Get lessons for this module
            return Array.from(lessons.values()).filter((l) => l.moduleId === moduleId);
        })
            .filter((l) => !!l);
        if (courseLessons.length === 0)
            return 0;
        const completedCount = courseLessons.filter((l) => userLessonProgress.get(`${userId}-${l.id}`)?.completed).length;
        return Math.round((completedCount / courseLessons.length) * 100);
    },
}), {
    name: '202f-learning-store',
}));
