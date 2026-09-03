import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, UserAchievement } from '../types';

interface AchievementState {
  achievements: Map<string, Achievement>;
  userAchievements: UserAchievement[];
  addAchievement: (achievement: Achievement) => void;
  getAchievement: (id: string) => Achievement | undefined;
  unlockAchievement: (userId: string, achievementId: string) => void;
  getUserAchievements: (userId: string) => Achievement[];
}

export const useAchievementStore = create<AchievementState>()(persist(
  (set, get) => ({
    achievements: new Map(),
    userAchievements: [],

    addAchievement: (achievement: Achievement) => {
      const { achievements } = get();
      achievements.set(achievement.id, achievement);
      set({ achievements });
    },

    getAchievement: (id: string) => {
      const { achievements } = get();
      return achievements.get(id);
    },

    unlockAchievement: (userId: string, achievementId: string) => {
      const { userAchievements } = get();
      const exists = userAchievements.some(
        (ua) => ua.userId === userId && ua.achievementId === achievementId
      );
      if (!exists) {
        userAchievements.push({
          userId,
          achievementId,
          unlockedAt: new Date(),
        });
        set({ userAchievements });
      }
    },

    getUserAchievements: (userId: string) => {
      const { userAchievements, achievements } = get();
      return userAchievements
        .filter((ua) => ua.userId === userId)
        .map((ua) => achievements.get(ua.achievementId))
        .filter((a) => !!a) as Achievement[];
    },
  }),
  {
    name: '202f-achievement-store',
  }
));
