import { Routes, Route } from 'react-router-dom';
import Aplicativos from './components/pages/aplicativos';
import Roles from './components/pages/roles';
import Modulos from './components/pages/modulos';
import Permisos from './components/pages/permisos';
import Rutas from './components/pages/rutas';
import Accesos from './components/pages/accesos';
import Usuarios from './components/pages/usuarios';
import InicioSesion from './components/pages/inicioSesion';
import AreasPage from '@/components/pages/AreasPage';
import Programaspage from '@/components/pages/Programaspage';
import DashboardPage from '@/components/pages/DashboardPage';
import SedesPage from '@/components/pages/SedesPages';
import CentroFormacionPage from '@/components/pages/CentroFormacionPage';
import CursosPage from '@/components/pages/CursosPage';
import MatriculasPage from '@/components/pages/MatriculasPage';
import PersonasPage from '@/components/pages/personas';
import Ambiente from './components/templates/Ambientes/Ambiente';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioSesion />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/aplicativos" element={<Aplicativos />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/modulos" element={<Modulos />} />
      <Route path="/permisos" element={<Permisos />} />
      <Route path="/rutas" element={<Rutas />} />
      <Route path="/accesos" element={<Accesos />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/areas" element={<AreasPage />} />
      <Route path="/programas" element={<Programaspage />} />
      <Route path="/sedes" element={<SedesPage />} />
      <Route path="/centroformacion" element={<CentroFormacionPage />} />
      <Route path="/cursos" element={<CursosPage />} />
      <Route path="/matriculas" element={<MatriculasPage />} />
      <Route path="/personas" element={<PersonasPage />} />
      <Route path="/ambientes" element={<Ambiente />} />
    </Routes>
  );
}

export default App;
