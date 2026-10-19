import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

/**
 * Локальная auth-модель (этап 1).
 * Пользователи и пароли хранятся в localStorage устройства.
 * Бэкенд с настоящим хешированием и sync — следующий этап (см. роадмап).
 */

interface StoredUser extends User {
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const USERS_KEY = '202f-users';

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredUser[]) : [];
    const hasAdmin = parsed.some((u) => u.role === 'admin');
    if (!hasAdmin) {
      parsed.push({
        id: 'admin-seed',
        name: 'Head Barista',
        email: 'admin@202f.coffee',
        role: 'admin',
        password: 'admin202f',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(u: StoredUser): User {
  const { password: _password, ...rest } = u;
  return rest;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        const users = loadUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );
        if (!found) {
          set({ isLoading: false, error: 'err.notFound' });
          throw new Error('not-found');
        }
        set({ user: toPublicUser(found), isAuthenticated: true, isLoading: false });
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        if (!name.trim() || !email.trim() || password.length < 6) {
          set({ isLoading: false, error: 'err.fields' });
          throw new Error('invalid');
        }
        const users = loadUsers();
        const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (exists) {
          set({ isLoading: false, error: 'err.exists' });
          throw new Error('exists');
        }
        const newUser: StoredUser = {
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'student' as UserRole,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(newUser);
        saveUsers(users);
        set({ user: toPublicUser(newUser), isAuthenticated: true, isLoading: false });
      },

      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: '202f-auth-store',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);

/** Список зарегистрированных пользователей (для админ-панели) */
export function listUsers(): User[] {
  return loadUsers().map(toPublicUser);
}
