import { useState } from "react";
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

  // Validar y filtrar aplicativos que no tengan idAplicativo
  const validAplicativos = (aplicativos || []).filter((app): app is Aplicativo => {
    if (!app || typeof app.idAplicativo !== 'number') {
      console.warn('Aplicativo inválido encontrado:', app);
      return false;
    }
    return true;
  });

  const columns: Column<Aplicativo & { key: string }>[]= [
    { key: "idAplicativo", label: "ID", filterable: true },
    { key: "nombre", label: "Nombre del Aplicativo", filterable: true },
    { 
      key: "acciones", 
      label: "Acciones", 
      render: (item) => (
        <div className="flex gap-2" key={`actions-${item.idAplicativo}`}>
          <Boton 
            onClick={() => handleEdit(item)} 
            className="bg-yellow-500 text-white px-2 py-1 text-xs"
            title={`ID: ${item.idAplicativo}`}
            key={`edit-${item.idAplicativo}`}
          >
            Editar
          </Boton>
          <Boton 
            onClick={() => handleDelete(item)} 
            className="bg-red-500 text-white px-2 py-1 text-xs"
            title={`ID: ${item.idAplicativo}`}
            key={`delete-${item.idAplicativo}`}
          >
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (!values.nombre_aplicativo || values.nombre_aplicativo.trim() === '') {
        alert('El nombre del aplicativo es obligatorio');
        return;
      }

      if (editingId) {
        // Actualizar aplicativo existente
        await actualizarAplicativo(editingId, { nombre: values.nombre_aplicativo.trim() });
        alert('Aplicativo actualizado con éxito');
      } else {
        // Crear nuevo aplicativo
        const createPayload = {
          nombre: values.nombre_aplicativo.trim(),
          idAplicativo: 0 // Este valor será reemplazado por el backend
        };

        await crearAplicativo(createPayload);
        alert('Aplicativo creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el aplicativo. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async (aplicativo: Aplicativo) => {
    if (!aplicativo || typeof aplicativo.idAplicativo !== 'number') {
      console.error('Error: No se puede eliminar el aplicativo porque no tiene ID válido');
      return;
    }

      try {
        await eliminarAplicativo(aplicativo.idAplicativo);
      } catch (error) {
      console.error('Error al eliminar el aplicativo:', error);
    }
  };

  const handleEdit = (aplicativo: Aplicativo) => {
    if (!aplicativo || typeof aplicativo.idAplicativo !== 'number') {
      alert('Error: No se puede editar el aplicativo porque no tiene ID válido');
      return;
    }

    setFormData({
      nombre_aplicativo: aplicativo.nombre
    });
    setEditingId(aplicativo.idAplicativo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const formFieldsCreate: FormField[] = [
    { 
      key: "nombre_aplicativo", 
      label: "Nombre del Aplicativo", 
      type: "text", 
      required: true
    }
  ];

  const formFieldsEdit: FormField[] = [
    { 
      key: "nombre_aplicativo", 
      label: "Nombre del Aplicativo", 
      type: "text", 
      required: true
    }
  ];

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
                data={validAplicativos.map((app) => ({
                  ...app,
                  key: `aplicativo-${app.idAplicativo}`
                }))}
                defaultSortColumn="nombre"
              />
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
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
