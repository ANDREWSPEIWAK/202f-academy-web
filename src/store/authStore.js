import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            // Mock authentication - replace with actual API call
            const mockUser = {
                id: '1',
                name: 'Barista Pro',
                email,
                role: 'student',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockProfile = {
                userId: '1',
                currentLevel: 'JUNIOR',
                totalProgress: 31,
                currentStreak: 7,
                totalLessonsCompleted: 8,
                totalTestsPassed: 3,
                totalBrewLogsRecorded: 15,
                joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            };
            set({
                user: mockUser,
                profile: mockProfile,
                isAuthenticated: true,
                isLoading: false,
            });
        }
        catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    logout: () => {
        set({
            user: null,
            profile: null,
            isAuthenticated: false,
        });
    },
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
}), {
    name: '202f-auth-store',
}));
