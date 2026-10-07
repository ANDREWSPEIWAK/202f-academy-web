import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAchievementStore = create()(persist((set, get) => ({
    achievements: new Map(),
    userAchievements: [],
    addAchievement: (achievement) => {
        const { achievements } = get();
        achievements.set(achievement.id, achievement);
        set({ achievements });
    },
    getAchievement: (id) => {
        const { achievements } = get();
        return achievements.get(id);
    },
    unlockAchievement: (userId, achievementId) => {
        const { userAchievements } = get();
        const exists = userAchievements.some((ua) => ua.userId === userId && ua.achievementId === achievementId);
        if (!exists) {
            userAchievements.push({
                userId,
                achievementId,
                unlockedAt: new Date(),
            });
            set({ userAchievements });
        }
    },
    getUserAchievements: (userId) => {
        const { userAchievements, achievements } = get();
        return userAchievements
            .filter((ua) => ua.userId === userId)
            .map((ua) => achievements.get(ua.achievementId))
            .filter((a) => !!a);
    },
}), {
    name: '202f-achievement-store',
}));
