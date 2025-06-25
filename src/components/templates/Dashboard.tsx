import React, { useState, useEffect } from 'react';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';
import Card from '../atomos/Card';
import GlobalTable, { Column } from '../organismos/Table';
import Boton from '../atomos/Boton';
import { Activity, TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  userName?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change, isPositive }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-auto">
          <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {change}
          </span>
          <TrendingUp size={16} className={`ml-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
      )}
    </Card>
  );
};



// Definir la interfaz para los datos de la tabla
interface TableItem {
  key: number;
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  estado: string;
}

// Datos de ejemplo para la tabla
const tableData: TableItem[] = [
  { key: 1, id: 1, nombre: 'Material 1', categoria: 'Categoría A', cantidad: 150, estado: 'Disponible' },
  { key: 2, id: 2, nombre: 'Material 2', categoria: 'Categoría B', cantidad: 75, estado: 'Bajo stock' },
  { key: 3, id: 3, nombre: 'Material 3', categoria: 'Categoría A', cantidad: 300, estado: 'Disponible' },
  { key: 4, id: 4, nombre: 'Material 4', categoria: 'Categoría C', cantidad: 50, estado: 'Crítico' },
  { key: 5, id: 5, nombre: 'Material 5', categoria: 'Categoría B', cantidad: 125, estado: 'Disponible' },
];

const columns: Column<TableItem>[] = [
  { key: 'id', label: 'ID', sortable: true, filterable: true },
  { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
  { key: 'categoria', label: 'Categoría', sortable: true, filterable: true },
  { key: 'cantidad', label: 'Cantidad', sortable: true, filterable: true },
  { 
    key: 'estado', 
    label: 'Estado', 
    sortable: true, 
    filterable: true,
    render: (item: TableItem) => {
      const colorMap: Record<string, string> = {
        'Disponible': 'bg-emerald-500',
        'Bajo stock': 'bg-yellow-500',
        'Crítico': 'bg-red-500'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs text-white ${colorMap[item.estado] || 'bg-gray-500'}`}>
          {item.estado}
        </span>
      );
    }
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: () => (
      <div className="flex space-x-2">
        <Boton color="primary" size="sm">Ver</Boton>
        <Boton color="secondary" size="sm">Editar</Boton>
      </div>
    )
  }
];

const Dashboard: React.FC<DashboardProps> = ({ userName = "Administrador" }) => {
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    // Simulación de alertas que podrían venir de una API
    setAlertsCount(3);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={userName} />
        
        {/* Contenido del dashboard */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Bienvenido de nuevo, {userName}</p>
          </div>
          
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Usuarios" 
              value="1,254" 
              icon={<Users size={24} className="text-white" />} 
              color="bg-blue-500"
              change="+12.5% desde el mes pasado"
              isPositive={true}
            />
            <StatCard 
              title="Inventario Total" 
              value="8,532" 
              icon={<Package size={24} className="text-white" />} 
              color="bg-emerald-500"
              change="+8.2% desde el mes pasado"
              isPositive={true}
            />
            <StatCard 
              title="Movimientos Recientes" 
              value="245" 
              icon={<Activity size={24} className="text-white" />} 
              color="bg-purple-500"
              change="+18.7% desde el mes pasado"
              isPositive={true}
            />
            <StatCard 
              title="Alertas de Stock" 
              value={alertsCount} 
              icon={<AlertTriangle size={24} className="text-white" />} 
              color="bg-red-500"
              change="-5.1% desde el mes pasado"
              isPositive={false}
            />
          </div>
          

          
          {/* Tabla de inventario reciente */}
          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-medium text-gray-800">Inventario Reciente</h2>
            </div>
            <div className="p-4">
              <GlobalTable 
                columns={columns} 
                data={tableData} 
                rowsPerPage={5}
                defaultSortColumn="id"
                defaultSortDirection="asc"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
