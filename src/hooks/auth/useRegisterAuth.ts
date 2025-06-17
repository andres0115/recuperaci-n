import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFormValues } from '@/types/auth';
import { register as apiRegister } from '@/api/auth/token';
import { setTokenCookie } from './useGetAuth';

export function useRegisterAuth() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  const register = async (values: RegisterFormValues) => {
    setValidationErrors(null);

    const payload = {
      ...values,
      contrasena: values.password,
      edad: values.edad ? Number(values.edad) : null,
      estado: true,
      fecha_registro: new Date().toISOString(),
      rol_id: 1,
    };

    try {
      const response = await apiRegister(payload);

      if (response.token) {
        setTokenCookie(response.token);
        navigate('/dashboard');
        return { success: true };
      }

      if (response.message?.toLowerCase().includes('usuario registrado exitosamente')) {
        navigate('/dashboard');
        return { success: true };
      }

      throw new Error(response.message || 'Error al registrar usuario');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error al registrar usuario';
      return { success: false, errors: { general: message } };
    }
  };

  return { register, validationErrors };
}
