
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './components/pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Aquí puedes agregar más rutas según sea necesario */}
    </Routes>
  );
}

export default App;
