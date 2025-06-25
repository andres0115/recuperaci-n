import { useState } from "react";
import { useGetAccesos } from '@/hooks/accesos/useGetAccesos';
import { usePostAcceso } from '@/hooks/accesos/usePostAccesos';
import { usePutAcceso } from '@/hooks/accesos/usePutAccesos';
import { useDeleteAcceso } from '@/hooks/accesos/useDeleteAcceso';
import { Acceso } from '@/types/accesos';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const accesos = () => {
  const { accesos, loading } = useGetAccesos();
  const { crearAcceso } = usePostAcceso();
  const { actualizarAcceso } = usePutAcceso();
  const { eliminarAcceso } = useDeleteAcceso();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Acceso & { key: number }>[]= [
    { key: "token", label: "Token", filterable: true },
    { key: "usuario", label: "Usuario ID", filterable: true },
    { key: "fecha_ingreso", label: "Fecha de Ingreso", filterable: true },
    { key: "fecha_salida", label: "Fecha de Salida", filterable: true },
    { key: "estado", label: "Estado", filterable: true, render: (item) => item.estado ? 'Activo' : 'Inactivo' },
    { 
      key: "acciones", 
      label: "Acciones", 
      render: (item) => (
        <div className="flex gap-2">
          <Boton 
            onClick={() => handleEdit(item)} 
            className="bg-yellow-500 text-white px-2 py-1 text-xs"
          >
            Editar
          </Boton>
          <Boton 
            onClick={() => handleDelete(item.idAcceso)} 
            className="bg-red-500 text-white px-2 py-1 text-xs"
          >
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  const formFieldsCreate: FormField[] = [
    { key: "token", label: "Token", type: "text", required: true },
    { key: "usuario", label: "Usuario ID", type: "number", required: true },
    { key: "fecha_ingreso", label: "Fecha de Ingreso", type: "datetime-local", required: true },
    { key: "fecha_salida", label: "Fecha de Salida", type: "datetime-local", required: false },
    { key: "estado", label: "Estado", type: "checkbox", required: false }
  ];
  const formFieldsEdit: FormField[] = [
    { key: "token", label: "Token", type: "text", required: true },
    { key: "usuario", label: "Usuario ID", type: "number", required: true },
    { key: "fecha_ingreso", label: "Fecha de Ingreso", type: "datetime-local", required: true },
    { key: "fecha_salida", label: "Fecha de Salida", type: "datetime-local", required: false },
    { key: "estado", label: "Estado", type: "checkbox", required: false }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Preparar los datos para enviar
      
      if (editingId) {
        // Actualizar acceso existente
        const updatePayload: Partial<Acceso> = {
          token: values.token,
          usuario: parseInt(values.usuario),
          fecha_ingreso: values.fecha_ingreso,
          fecha_salida: values.fecha_salida || undefined,
          estado: Boolean(values.estado)
        };
        await actualizarAcceso(editingId, updatePayload as any);
        alert('Acceso actualizado con éxito');
      } else {
        const createPayload: Partial<Acceso> = {
          token: values.token,
          usuario: parseInt(values.usuario),
          fecha_ingreso: values.fecha_ingreso,
          fecha_salida: values.fecha_salida || undefined,
          estado: Boolean(values.estado)
        };

        await crearAcceso(createPayload as any);
        alert('Acceso creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el aplicativo');
      console.error(error);
    }
  };

  const handleEdit = (acceso: Acceso) => {
    setFormData({
      token: acceso.token,
      usuario: String(acceso.usuario),
      fecha_ingreso: acceso.fecha_ingreso,
      fecha_salida: acceso.fecha_salida || '',
      estado: String(acceso.estado)
    });
    setEditingId(acceso.idAcceso);
    setIsModalOpen(true);
  };

  // Función para eliminar un acceso
  const handleDelete = async (id: number) => {
    console.log('Eliminando acceso con ID:', id);
    if (window.confirm('¿Está seguro que desea eliminar este acceso?')) {
      try {
        await eliminarAcceso(id);
        alert('Acceso eliminado con éxito');
      } catch (error) {
        alert('Error al eliminar el acceso');
        console.error(error);
      }
    }
  };

  // Función para crear un nuevo aplicativo
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
        <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Accesos</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Acceso
          </Boton>
        </div>

        {loading ? (
          <p>Cargando accesos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={accesos
                .filter(acc => acc && typeof acc.idAcceso === 'number')
                .map((acc: Acceso) => ({ ...acc, key: acc.idAcceso }))}
              defaultSortColumn="token"
            />
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-lg">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                {/* Botón X para cerrar en la esquina superior derecha */}
                <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Acceso" : "Crear Nuevo Acceso"}
                </h2>
                <Form
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData}
                />
              </div>
            </div>
          </div> 
        )}
        </div>
      </div>
    </div>
  );
};

export default accesos;
