import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserProfile, UserRole } from '../types';

// Mock user database for development
const MOCK_USERS: Record<string, User> = {
  'student@example.com': {
    id: '1',
    name: 'Barista Pro',
    email: 'student@example.com',
    role: 'student' as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'trainer@example.com': {
    id: '2',
    name: 'Trainer Joe',
    email: 'trainer@example.com',
    role: 'instructor' as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'admin@example.com': {
    id: '3',
    name: 'Admin Alice',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
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
    token: null,

    login: async (email: string, password: string) => {
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email format');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      set({ isLoading: true });
      try {
        // Mock authentication - simulates token-based flow with user lookup
        const mockUser = MOCK_USERS[email];
        if (!mockUser) {
          throw new Error('Invalid credentials');
        }

        const mockProfile: UserProfile = {
          userId: mockUser.id,
          currentLevel: 'JUNIOR',
          totalProgress: 31,
          currentStreak: 7,
          totalLessonsCompleted: 8,
          totalTestsPassed: 3,
          totalBrewLogsRecorded: 15,
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        };

        const mockToken = `mock-token-${mockUser.id}-${Date.now()}`;

        set({
          user: mockUser,
          profile: mockProfile,
          isAuthenticated: true,
          isLoading: false,
          token: mockToken,
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
        token: null,
      });
    },

    setUser: (user: User) => set({ user }),
    setProfile: (profile: UserProfile) => set({ profile }),
  }),
  {
    name: '202f-auth-store',
  }
));
