import React, { useState, useEffect } from 'react';
import Header from '@/components/organismos/Header';
import Sidebar from '@/components/organismos/Sidebar';
import Card from '@/components/atomos/Card';
import GlobalTable, { Column } from '@/components/organismos/Table';
import Boton from '@/components/atomos/Boton';
import Modal from '@/components/organismos/Modal';

interface DashboardProps {
  userName?: string;
}

interface TableItem {
  key: number;
  id: number;
  nombre: string;
  municipio: string;
  sede: number;
}

// Datos quemados para la demostracion (esto se deberia remplazar por una peticion a la API)
const initialData: TableItem[] = [
  { key: 1, id: 1, nombre: 'Y-10', municipio: 'Acevedo', sede: 1 },
  { key: 2, id: 3, nombre: 'Y-11', municipio: 'Aipe', sede: 4 },
  { key: 3, id: 8, nombre: 'Y-12', municipio: 'Gigante', sede: 8 },
  { key: 4, id: 4, nombre: 'Y-13', municipio: 'Isnos', sede: 5 },
  { key: 5, id: 5, nombre: 'Y-14', municipio: 'San Agustín', sede: 9 },
];

const Ambiente: React.FC<DashboardProps> = ({ userName = "Administrador" }) => {
  const [, setAlertsCount] = useState(0);
  const [tableData, setTableData] = useState<TableItem[]>(initialData); // En producción, esto debe llenarse desde la API

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAmbiente, setSelectedAmbiente] = useState<TableItem | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ambienteEditandoId, setAmbienteEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    municipio: '',
    sede: '',
  });

  // Este EFFECT seutiliza para cargar datos iniciales desde la API
  useEffect(() => {
    setAlertsCount(3);

    // Aquí se debería hacer la solicitud GET a la API
    // Ejemplo:
    /*
    getAmbientes()
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar ambientes", error);
      });
    */
  }, []);

  const handleVerAmbiente = (ambiente: TableItem) => {
    setSelectedAmbiente(ambiente);
    setIsViewModalOpen(true);
  };

  const handleAgregarAmbiente = () => {
    setModoEdicion(false);
    setFormData({ nombre: '', municipio: '', sede: '' });
    setIsFormModalOpen(true);
  };

  const handleEditarAmbiente = (ambiente: TableItem) => {
    setModoEdicion(true);
    setAmbienteEditandoId(ambiente.id);
    setFormData({
      nombre: ambiente.nombre,
      municipio: ambiente.municipio,
      sede: ambiente.sede.toString(),
    });
    setIsFormModalOpen(true);
  };

  const handleEliminarAmbiente = (id: number) => {
    // Aquí deberías llamar a DELETE /ambientes/:id
    /*
    deleteAmbiente(id)
      .then(() => {
        const nuevosDatos = tableData.filter((item) => item.id !== id);
        setTableData(nuevosDatos);
      })
      .catch((error) => console.error("Error al eliminar", error));
    */

    // Eliminación local quemada
    const nuevosDatos = tableData.filter((item) => item.id !== id);
    setTableData(nuevosDatos);
  };

  const handleGuardarAmbiente = () => {
    if (modoEdicion && ambienteEditandoId !== null) {
      // Aquí deberías hacer PUT /ambientes/:id
      /*
      updateAmbiente(ambienteEditandoId, {
        nombre: formData.nombre,
        municipio: formData.municipio,
        sede: parseInt(formData.sede),
      }).then(() => {
        // Actualizar tabla local después de éxito
      });
      */

      // Actualización local
      const nuevosDatos = tableData.map((item) =>
        item.id === ambienteEditandoId
          ? {
              ...item,
              nombre: formData.nombre,
              municipio: formData.municipio,
              sede: parseInt(formData.sede),
            }
          : item
      );
      setTableData(nuevosDatos);
    } else {
      // Aquí deberías hacer POST /ambientes
      /*
      createAmbiente({
        nombre: formData.nombre,
        municipio: formData.municipio,
        sede: parseInt(formData.sede),
      }).then((res) => {
        setTableData([...tableData, res.data]);
      });
      */

      // Inserción local
      const nuevoAmbiente: TableItem = {
        key: Date.now(),
        id: tableData.length + 1,
        nombre: formData.nombre,
        municipio: formData.municipio,
        sede: parseInt(formData.sede),
      };
      setTableData([...tableData, nuevoAmbiente]);
    }

    setFormData({ nombre: '', municipio: '', sede: '' });
    setModoEdicion(false);
    setAmbienteEditandoId(null);
    setIsFormModalOpen(false);
  };

  const columns: Column<TableItem>[] = [
    { key: 'id', label: 'ID', sortable: true, filterable: true },
    { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
    { key: 'municipio', label: 'Municipio', sortable: true, filterable: true },
    { key: 'sede', label: 'Sede', sortable: true, filterable: true },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (item) => (
        <div className="flex space-x-2">
          <Boton color="primary" size="sm" onClick={() => handleVerAmbiente(item)}>
            Ver
          </Boton>
          <Boton color="secondary" size="sm" onClick={() => handleEditarAmbiente(item)}>
            Editar
          </Boton>
          <Boton color="danger" size="sm" onClick={() => handleEliminarAmbiente(item.id)}>
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} />

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Ambientes</h1>
            <p className="text-gray-600">Bienvenido de nuevo, {userName}</p>
          </div>

          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Inventario Reciente</h2>
              <Boton color="success" size="md" onClick={handleAgregarAmbiente}>
                Agregar Ambiente
              </Boton>
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

      {/* Modal Ver */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detalle del Ambiente">
        {selectedAmbiente && (
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {selectedAmbiente.nombre}</p>
            <p><strong>Municipio:</strong> {selectedAmbiente.municipio}</p>
            <p><strong>Sede:</strong> {selectedAmbiente.sede}</p>
          </div>
        )}
      </Modal>

      {/* Modal Formulario */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modoEdicion ? "Editar Ambiente" : "Agregar Ambiente"}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Municipio</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              value={formData.municipio}
              onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sede</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
              value={formData.sede}
              onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
            />
          </div>
          <div className="pt-4 text-right">
            <Boton color="primary" size="md" onClick={handleGuardarAmbiente}>
              Guardar
            </Boton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Ambiente;
