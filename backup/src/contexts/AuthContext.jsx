import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 Initialisation AuthProvider');
    const token = localStorage.getItem('token');
    console.log('🔑 Token présent:', !!token);
    
    if (token) {
      const savedUser = authService.getCurrentUser();
      console.log('👤 Utilisateur sauvegardé:', savedUser);
      if (savedUser) {
        setUser(savedUser);
      }
    }
    setLoading(false);
    console.log('✅ AuthProvider initialisé');
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      console.log('📝 Appel register avec:', userData);
      const response = await authService.register(userData);
      console.log('✅ Réponse register:', response);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      console.error('❌ Erreur register:', message);
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('🔑 Appel login avec:', credentials.email);
      const response = await authService.login(credentials);
      console.log('✅ Réponse login:', response);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la connexion';
      console.error('❌ Erreur login:', message);
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    console.log('👋 Déconnexion effectuée');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};