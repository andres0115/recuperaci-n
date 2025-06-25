import axios from 'axios';
import { API_CONFIG, MOCK_API_CONFIG } from '../config/api.config';

// Crear instancia de Axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Interceptor para peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar lógica adicional antes de cada petición
    // Por ejemplo, agregar tokens de autenticación
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Simular un retraso de API
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función base para hacer peticiones
const apiRequest = async <T>(endpoint: string, options: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
} = {}): Promise<T> => {
  if (MOCK_API_CONFIG.enabled) {
    await simulateDelay(MOCK_API_CONFIG.delay);
    throw new Error('Mock API is enabled. Use mock data instead.');
  }

  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
      headers: options.headers
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.data?.message || 'Error en la petición'}`);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error(`Error en la petición: ${error.message}`);
    }
  }
};

// Métodos específicos para cada tipo de petición
export const api = {
  get: <T>(endpoint: string, params?: any, headers?: Record<string, string>) => 
    apiRequest<T>(endpoint, { method: 'GET', params, headers }),

  post: <T>(endpoint: string, data: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'POST', data, headers }),

  put: <T>(endpoint: string, data: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'PUT', data, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', headers })
}; 