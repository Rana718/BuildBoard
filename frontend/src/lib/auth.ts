import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER';
  profileImageUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          // Set cookie for middleware
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Remove cookie
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { user, token };
};
