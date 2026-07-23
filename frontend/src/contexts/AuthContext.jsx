import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const savedUser = authService.getCurrentUser();
      if (savedUser) setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la connexion';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const isAuthenticated = authService.isAuthenticated;

  const value = { user, loading, error, register, login, logout, isAuthenticated };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};