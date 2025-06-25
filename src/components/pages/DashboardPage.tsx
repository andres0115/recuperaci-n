import React from 'react';
import Dashboard from '../templates/Dashboard';

const DashboardPage: React.FC = () => {
  // Aquí podrías obtener datos de usuario de una API o contexto
  const userName = "Wilson"; // Ejemplo de nombre de usuario
  
  return (
    <Dashboard userName={userName} />
  );
};

export default DashboardPage;
