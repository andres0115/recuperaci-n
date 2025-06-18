import axios from 'axios';

// Configuración base de la API
export const API_CONFIG = {
  baseURL: 'http://localhost:3000/api', // URL base de la API
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: {
    cursos: {
      getAll: '/cursos',
      getById: (id: number) => `/cursos/${id}`,
      create: '/cursos',
      update: (id: number) => `/cursos/${id}`,
      delete: (id: number) => `/cursos/${id}`,
    },
    matriculas: {
      getAll: '/matriculas',
      getById: (id: number) => `/matriculas/${id}`,
      create: '/matriculas',
      update: (id: number) => `/matriculas/${id}`,
      delete: (id: number) => `/matriculas/${id}`,
    }
  }
};

// Configuración para simular la API
export const MOCK_API_CONFIG = {
  enabled: true, // Cambiar a false cuando se quiera usar la API real
  delay: 500, // Tiempo de espera simulado en ms
};

// Instancia de axios client
export const axiosClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Interceptor para peticiones
axiosClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar lógica adicional antes de cada petición
    // Por ejemplo, agregar tokens de autenticación
    console.log('Petición enviada:', config);
    return config;
  },
  (error) => {
    console.error('Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', response);
    return response;
  },
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