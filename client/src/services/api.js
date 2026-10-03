import axios from 'axios'

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// Créer une instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Service d'authentification
export const authService = {
  // Inscription
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  },

  // Connexion
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  // Obtenir le profil
  getProfile: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  // Mettre à jour le profil
  updateProfile: async (userData) => {
    const response = await api.put('/api/auth/update-profile', userData)
    return response.data
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    const response = await api.put('/api/auth/change-password', passwordData)
    return response.data
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post('/api/auth/logout')
    return response.data
  },

  // Vérifier le token
  verifyToken: async () => {
    const response = await api.get('/api/auth/verify-token')
    return response.data
  }
}

export default api
