import React, { useState } from 'react';
import { useAuth } from '../../hooks/auth/usePostAuth';
import Card from '../atomos/Card';
import Form, { FormField } from '../organismos/Form';
import { LoginCredentials } from '../../types/auth';

const InicioSesion: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(error);

  // Define form fields for login
  const loginFields: FormField[] = [
    {
      key: 'login',
      label: 'Usuario',
      type: 'text',
      required: true,
    },
    {
      key: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
    },
  ];

  // Handle form submission
  const handleSubmit = async (values: LoginCredentials) => {
    setLoginError(null);
    const success = await login(values);
    if (!success && error) {
      setLoginError(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-emerald-600 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
              {loginError}
            </div>
          )}

          <Form
            fields={loginFields}
            onSubmit={handleSubmit}
            buttonText={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            className="space-y-4"
          />

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Credenciales de prueba:</p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-1">Usuario: victor | Contraseña: 123456</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InicioSesion;