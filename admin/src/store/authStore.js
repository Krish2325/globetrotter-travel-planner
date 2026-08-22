import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      loading: false,

      setLoading: (v) => set({ loading: v }),

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.user.role !== 'ADMIN') throw new Error('Access denied: not an admin account');
        localStorage.setItem('globetrotter_admin_token', data.token);
        set({ admin: data.user, token: data.token });
        return data;
      },

      signup: async (name, email, password) => {
        const { data } = await api.post('/auth/admin-signup', { name, email, password });
        localStorage.setItem('globetrotter_admin_token', data.token);
        set({ admin: data.user, token: data.token });
        return data;
      },

      logout: () => {
        localStorage.removeItem('globetrotter_admin_token');
        set({ admin: null, token: null });
      },

      checkAuth: async () => {
        set({ loading: true });
        const token = localStorage.getItem('globetrotter_admin_token');
        if (!token) { set({ admin: null, loading: false }); return; }
        try {
          // Timeout after 6 seconds — don't leave user stuck on spinner
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 6000);
          const { data } = await api.get('/auth/me', { signal: controller.signal });
          clearTimeout(timer);
          if (data.role !== 'ADMIN') throw new Error('Not admin');
          set({ admin: data });
        } catch (err) {
          // Network timeout or invalid token — clear credentials silently
          localStorage.removeItem('globetrotter_admin_token');
          set({ admin: null, token: null });
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'globetrotter-admin-store', partialize: (s) => ({ admin: s.admin, token: s.token }) }
  )
);

export default useAuthStore;
