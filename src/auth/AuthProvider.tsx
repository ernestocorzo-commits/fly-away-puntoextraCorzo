import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';
import { AuthContext } from './authContextValue';
import type { User } from './authContextValue';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get<User>('/users/current')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [token]);

  async function login(email: string, password: string) {
    const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
    localStorage.setItem('token', data.token); // la clave debe ser 'token'
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}