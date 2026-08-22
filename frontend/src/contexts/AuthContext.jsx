import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('globetrotter_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('globetrotter_token');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => { setUser(data); localStorage.setItem('globetrotter_user', JSON.stringify(data)); })
        .catch(() => { localStorage.removeItem('globetrotter_token'); localStorage.removeItem('globetrotter_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('globetrotter_token', data.token);
    localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('globetrotter_token', data.token);
    localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
