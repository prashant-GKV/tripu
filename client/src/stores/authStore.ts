import { create } from 'zustand';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

/**
 * Minimal auth store. The token is persisted to localStorage so the api helper
 * can attach it. The server-core agent's auth UI populates this on login.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('tripu_token'),
  setAuth: (user, token) => {
    localStorage.setItem('tripu_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('tripu_token');
    set({ user: null, token: null });
  },
}));
