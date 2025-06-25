import { useState, useEffect } from "react";
import { useGetAplicativos } from '@/hooks/aplicativos/useGetAplicativos';
import { usePostAplicativo } from '@/hooks/aplicativos/usePostAplicativos';
import { usePutAplicativo } from '@/hooks/aplicativos/usePutAplicativos';
import { useDeleteAplicativo } from '@/hooks/aplicativos/useDeleteAplicativo';
import { Aplicativo } from '@/types/aplicativos';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Aplicativos = () => {
  const { aplicativos, loading } = useGetAplicativos();
  const { crearAplicativo } = usePostAplicativo();
  const { actualizarAplicativo } = usePutAplicativo();
  const { eliminarAplicativo } = useDeleteAplicativo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Definir columnas para la tabla
  const columns: Column<Aplicativo & { key: number }>[]= [
    { key: "nombre", label: "Nombre del Aplicativo", filterable: true },
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
            onClick={() => handleDelete(item.idAplicativo)} 
            className="bg-red-500 text-white px-2 py-1 text-xs"
          >
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_aplicativo", label: "Nombre del Aplicativo", type: "text", required: true },
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_aplicativo", label: "Nombre del Aplicativo", type: "text", required: true },
    
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Preparar los datos para enviar
      
      if (editingId !== null) {
        // Actualizar aplicativo existente
        console.log('Actualizando aplicativo con ID:', editingId);
        await actualizarAplicativo(editingId, { nombre: values.nombre_aplicativo });
        alert('Aplicativo actualizado con éxito');
      } else {
        const createPayload = {
          nombre: values.nombre_aplicativo
        };

        await crearAplicativo(createPayload as any);
        alert('Aplicativo creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el aplicativo');
      console.error(error);
    }
  };

  const handleEdit = (aplicativo: Aplicativo) => {
    setFormData({
      nombre_aplicativo: aplicativo.nombre
    });
    setEditingId(aplicativo.idAplicativo);
    setIsModalOpen(true);
  };

  // Función para crear un nuevo aplicativo
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Función para eliminar un aplicativo
  const handleDelete = async (id: number) => {
    console.log('Eliminando aplicativo con ID:', id);
    if (window.confirm('¿Está seguro que desea eliminar este aplicativo?')) {
      try {
        await eliminarAplicativo(id);
        alert('Aplicativo eliminado con éxito');
      } catch (error) {
        alert('Error al eliminar el aplicativo');
        console.error(error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
        <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Aplicativos</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Aplicativo
          </Boton>
        </div>

        {loading ? (
          <p>Cargando aplicativos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={
                // Asegurarnos de que cada elemento tenga un idAplicativo válido y único
                aplicativos
                  .filter(app => app && typeof app.idAplicativo === 'number')
                  .map((app: Aplicativo) => ({
                    ...app,
                    key: app.idAplicativo
                  }))
              }
              defaultSortColumn="nombre"
            />
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-lg">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                {/* Botón X para cerrar en la esquina superior derecha */}
                <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Aplicativo" : "Crear Nuevo Aplicativo"}
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

export default Aplicativos;
