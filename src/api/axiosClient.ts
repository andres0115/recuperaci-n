import axios from 'axios';

const TOKEN_KEY = 'token';

// === Axios Instance ===

// Get API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`));
  return match ? match[2] : null;
}

function getToken(): string | null {
  const cookieToken = getTokenFromCookie();
  if (cookieToken) return cookieToken;

  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) {
    document.cookie = `${TOKEN_KEY}=${localToken}; path=/; max-age=86400; samesite=strict`;
    return localToken;
  }

  return null;
}

function clearToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=strict`;
}

// Add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  console.log('Realizando petición a:', `${config.baseURL || ''}${config.url || ''}`);
  return config;
}, Promise.reject);

// Handle 401 errors globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('Error en la petición:', {
      url: error.config?.url || 'URL no disponible',
      método: error.config?.method || 'Método no disponible',
      estado: error.response?.status || 'Estado no disponible',
      mensaje: error.response?.data || 'Mensaje no disponible'
    });
    
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/iniciosesion';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
