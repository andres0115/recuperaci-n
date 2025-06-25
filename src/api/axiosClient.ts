import axios from 'axios';

const TOKEN_KEY = 'token';

// Get API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, Promise.reject);

// Handle 401 errors globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/iniciosesion';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
