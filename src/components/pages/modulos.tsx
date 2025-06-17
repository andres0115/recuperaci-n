import { useState } from "react";
import { useGetModulos } from '@/hooks/modulos/useGetModulos';
import { usePostModulo } from '@/hooks/modulos/usePostModulo';
import { usePutModulo } from '@/hooks/modulos/usePutModulo';
import { useGetAplicativos } from '@/hooks/aplicativos/useGetAplicativos';
import { Modulo } from '@/types/modulos';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Modulos = () => {
  const { modulos, loading } = useGetModulos();
  const { crearModulo } = usePostModulo();
  const { actualizarModulo } = usePutModulo();
  const { aplicativos, loading: loadingAplicativos } = useGetAplicativos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Modulo & { key: number; aplicativo_nombre?: string }>[]= [
    { key: "Modulo", label: "Nombre del Módulo", filterable: true },
    { key: "aplicativo_nombre", label: "Aplicativo", filterable: true },
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
        </div>
      )
    }
  ];

  // Create safe options for select dropdown
  const getAplicativoOptions = () => {
    if (!aplicativos || aplicativos.length === 0) {
      return [];
    }
    
    return aplicativos.map(app => ({
      value: app.id_aplicativo?.toString() || '',
      label: app.nombre || 'Sin nombre'
    }));
  };

  const formFieldsCreate: FormField[] = [
    { key: "nombre_modulo", label: "Nombre del Módulo", type: "text", required: true },
    { 
      key: "aplicativo_id", 
      label: "Aplicativo", 
      type: "select", 
      required: true,
      options: getAplicativoOptions()
    },
  ];
  
  const formFieldsEdit: FormField[] = [
    { key: "nombre_modulo", label: "Nombre del Módulo", type: "text", required: true },
    { 
      key: "aplicativo_id", 
      label: "Aplicativo", 
      type: "select", 
      required: true,
      options: getAplicativoOptions()
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Preparar los datos para enviar
      const aplicativoId = parseInt(values.aplicativo_id);
      
      if (editingId) {
        // Actualizar módulo existente
        await actualizarModulo(editingId, { 
          Modulo: values.nombre_modulo,
          aplicativo: aplicativoId
        });
        alert('Módulo actualizado con éxito');
      } else {
        const createPayload = {
          Modulo: values.nombre_modulo,
          aplicativo: aplicativoId
        };

        await crearModulo(createPayload as any);
        alert('Módulo creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el módulo');
      console.error(error);
    }
  };

  const handleEdit = (modulo: Modulo & { aplicativo_nombre?: string }) => {
    setFormData({
      nombre_modulo: modulo.Modulo,
      aplicativo_id: modulo.aplicativo ? modulo.aplicativo.toString() : ''
    });
    setEditingId(modulo.id_modulo);
    setIsModalOpen(true);
  };

  // Función para crear un nuevo módulo
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
          <h1 className="text-xl font-bold mb-4">Gestión de Módulos</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Módulo
          </Boton>
        </div>

        {loading || loadingAplicativos ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={
                Array.isArray(modulos) 
                  ? modulos.map((modulo: Modulo) => ({
                      ...modulo,
                      key: modulo.id_modulo || Math.random(),
                      aplicativo_nombre: modulo.aplicativo && Array.isArray(aplicativos)
                        ? (aplicativos.find(app => app && app.id_aplicativo === modulo.aplicativo)?.nombre || 'Desconocido')
                        : 'No asignado'
                    }))
                  : []
              }
              defaultSortColumn="Modulo"
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
                  {editingId ? "Editar Módulo" : "Crear Nuevo Módulo"}
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

export default Modulos;
