import { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

const API_BASE = '/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');

    if (savedAccessToken && savedRefreshToken && savedUser) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = useCallback(async (email, password, name) => {
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      const data = await res.json();
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        logout();
        return false;
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [refreshToken, logout]);

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
