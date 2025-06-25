import React, { useState } from 'react';
import { useAuth } from '../../hooks/auth/usePostAuth';
import Card from '../atomos/Card';
import Form, { FormField } from '../organismos/Form';
import { LoginCredentials } from '../../types/auth';

const InicioSesion: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(error);

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

  const handleSubmit = async (values: LoginCredentials) => {
    setLoginError(null);
    try {
      await login(values);
    } catch (err) {
      setLoginError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md mx-auto bg-slate-700 shadow-lg rounded-xl overflow-hidden border border-slate-600">
        <div className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-emerald-400 mb-2">Bienvenido</h1>
            <p className="text-gray-300">Ingresa tus credenciales para continuar</p>
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

          <div className="mt-6 text-center text-sm text-gray-300">
            <p>Credenciales de prueba:</p>
            <p className="font-mono bg-slate-600 p-2 rounded mt-1 text-gray-200">Usuario: victor | Contraseña: 123456</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InicioSesion;