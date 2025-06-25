
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './components/pages/DashboardPage';
import AreasPage from './components/pages/AreasPage';
import Programaspage from './components/pages/Programaspage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/areas" element={<AreasPage />} />
      <Route path="/programas" element={<Programaspage />} />
      {/* Aquí puedes agregar más rutas según sea necesario */}
    </Routes>

  );
}

export default App;
