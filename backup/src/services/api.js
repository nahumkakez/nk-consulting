import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configuration de base d'axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('📤 Requête à:', config.url);
    if (token) {
      console.log('🔑 Token présent');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('⚠️ Pas de token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse reçue:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  register: async (userData) => {
    console.log('📝 Inscription:', userData);
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    console.log('🔑 Connexion:', credentials.email);
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getProfile: async () => {
    console.log('📋 Récupération profil');
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Déconnexion');
  },
  
  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('token');
    console.log('🔐 Authentifié:', hasToken);
    return hasToken;
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default api;