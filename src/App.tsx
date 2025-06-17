import { Routes, Route, Navigate } from 'react-router-dom';
import Aplicativos from './components/pages/aplicativos';
import Roles from './components/pages/roles';
import Modulos from './components/pages/modulos';
import Permisos from './components/pages/permisos';
import Rutas from './components/pages/rutas';
import Accesos from './components/pages/accesos';
import Usuarios from './components/pages/usuarios'

import DashboardPage from '@/components/pages/DashboardPage';
import SedesPage from '@/components/pages/SedesPages';
import CentroFormacionPage from '@/components/pages/CentroFormacionPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/aplicativos" element={<Aplicativos />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/modulos" element={<Modulos />} />
      <Route path="/permisos" element={<Permisos />} />
      <Route path="/rutas" element={<Rutas />} />
      <Route path="/accesos" element={<Accesos />} />
      <Route path="/usuarios" element={<Usuarios />} />

      
      <Route path="/sedes" element={<SedesPage />} />
      <Route path="/centroformacion" element={<CentroFormacionPage />} />

      {/* Aquí puedes agregar más rutas según sea necesario */}
    </Routes>
  );
}

export default App;
