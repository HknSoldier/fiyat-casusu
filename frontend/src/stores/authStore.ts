import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId?: string;
  company?: {
    id: string;
    name: string;
    subscriptionPlan: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  companyName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu.onrender.com/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Login failed');
          }

          const data = await response.json();
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Demo mode for testing without backend
      setDemoMode: () => {
        set({
          user: {
            id: 'demo-1',
            email: 'demo@fiyatcasusu.com',
            name: 'Demo Kullanıcı',
            role: 'user',
            companyId: 'demo-company',
            company: {
              id: 'demo-company',
              name: 'Demo Şirket',
              subscriptionPlan: 'pro',
            },
          },
          token: 'demo-token',
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);