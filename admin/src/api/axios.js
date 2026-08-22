import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('globetrotter_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isOnLoginPage = window.location.pathname.includes('/login');
      const isCheckingAuth = err.config?.url?.includes('/auth/me');
      // Don't redirect if already on login or this was just the initial auth check
      if (!isOnLoginPage && !isCheckingAuth) {
        localStorage.removeItem('globetrotter_admin_token');
        localStorage.removeItem('globetrotter_admin');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

