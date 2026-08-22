import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('globetrotter_admin')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('globetrotter_admin_token');
    if (token) {
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          if (data.role !== 'ADMIN') throw new Error('Not admin');
          setAdmin(data);
          localStorage.setItem('globetrotter_admin', JSON.stringify(data));
        })
        .catch(() => {
          localStorage.removeItem('globetrotter_admin_token');
          localStorage.removeItem('globetrotter_admin');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.user.role !== 'ADMIN') throw new Error('Access denied: not an admin account');
    localStorage.setItem('globetrotter_admin_token', data.token);
    localStorage.setItem('globetrotter_admin', JSON.stringify(data.user));
    setAdmin(data.user);
    return data;
  };

  const adminSignup = async (name, email, password) => {
    const { data } = await api.post('/auth/admin-signup', { name, email, password });
    localStorage.setItem('globetrotter_admin_token', data.token);
    localStorage.setItem('globetrotter_admin', JSON.stringify(data.user));
    setAdmin(data.user);
    return data;
  };

  const adminLogout = () => {
    localStorage.removeItem('globetrotter_admin_token');
    localStorage.removeItem('globetrotter_admin');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, adminLogin, adminSignup, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
