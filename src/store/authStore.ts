import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserProfile, UserRole } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setProfile: (profile: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email: string, _password: string) => {
      set({ isLoading: true });
      try {
        // Mock authentication - replace with actual API call
        const mockUser: User = {
          id: '1',
          name: 'Barista Pro',
          email,
          role: 'student' as UserRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockProfile: UserProfile = {
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
      } catch (error) {
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

    setUser: (user: User) => set({ user }),
    setProfile: (profile: UserProfile) => set({ profile }),
  }),
  {
    name: '202f-auth-store',
  }
));
