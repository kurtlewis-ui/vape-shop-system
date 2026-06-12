import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from './types';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (accessToken: string, user: AuthUser) => void;
  logout: () => void;
}

/**
 * Global auth store. Persists the access token + user to localStorage so a
 * page refresh keeps you logged in. (For production you'd keep the access
 * token in memory only and rely on the refresh-token cookie, but localStorage
 * keeps this starter simple to follow.)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'vape-shop-auth',
    },
  ),
);
