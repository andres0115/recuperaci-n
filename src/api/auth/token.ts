import axiosInstance from '../axiosClient';
import { LoginCredentials, AuthResponse } from '@/types/auth';

// Función genérica para peticiones POST con manejo centralizado de errores
const postRequest = async <T, R>(url: string, data: T): Promise<R> => {
  try {
    const response = await axiosInstance.post<R>(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error;
    }
    throw new Error('Error al conectar con el servidor');
  }
};
// Función para manejar el inicio de sesión con credenciales hardcodeadas
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Verificar credenciales hardcodeadas primero
  if (credentials.login === 'victor' && credentials.password === '123456') {
    // Simular respuesta exitosa
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-for-victor',
      user: {
        id: 1,
        login: 'victor',
        role: 'admin'
      },
      message: 'Login successful'
    };
    
    return mockResponse;
  }
  
  // Si no coinciden las credenciales hardcodeadas, intentar con la API
  try {
    return await postRequest<LoginCredentials, AuthResponse>('/auth/login', credentials);
  } catch (error) {
    // Si falla la API, lanzar error de credenciales inválidas
    throw new Error('Credenciales inválidas');
  }
};
