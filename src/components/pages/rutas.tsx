import { useState } from "react";
import { useGetRutas } from '@/hooks/rutas/useGetRutas';
import { usePostRuta } from '@/hooks/rutas/usePostRutas';
import { usePutRuta } from '@/hooks/rutas/usePutRutas';
import { useGetModulos } from '@/hooks/modulos/useGetModulos';
import { Ruta } from '@/types/rutas';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Rutas = () => {
  const { rutas, loading } = useGetRutas();
  const { crearRuta } = usePostRuta();
  const { actualizarRuta } = usePutRuta();
  const { modulos, loading: loadingModulos } = useGetModulos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Ruta & { key: number; modulo_nombre?: string }>[]= [
    { key: "nombre", label: "Nombre de la Ruta", filterable: true },
    { key: "url", label: "URL", filterable: true },
    { key: "modulo_nombre", label: "Módulo", filterable: true },
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
  const getModuloOptions = () => {
    if (!modulos || modulos.length === 0) {
      return [];
    }
    
    return modulos.map(mod => ({
      value: mod.id_modulo?.toString() || '',
      label: mod.Modulo || 'Sin nombre'
    }));
  };

  const formFieldsCreate: FormField[] = [
    { key: "nombre_ruta", label: "Nombre de la Ruta", type: "text", required: true },
    { key: "url_ruta", label: "URL", type: "text", required: true },
    { 
      key: "modulo_id", 
      label: "Módulo", 
      type: "select", 
      required: true,
      options: getModuloOptions()
    },
  ];
  
  const formFieldsEdit: FormField[] = [
    { key: "nombre_ruta", label: "Nombre de la Ruta", type: "text", required: true },
    { key: "url_ruta", label: "URL", type: "text", required: true },
    { 
      key: "modulo_id", 
      label: "Módulo", 
      type: "select", 
      required: true,
      options: getModuloOptions()
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Preparar los datos para enviar
      const moduloId = parseInt(values.modulo_id);
      
      if (editingId) {
        // Actualizar ruta existente
        await actualizarRuta(editingId, { 
          nombre: values.nombre_ruta,
          url: values.url_ruta,
          modulo: moduloId,
          id_ruta: editingId
        });
        alert('Ruta actualizada con éxito');
      } else {
        const createPayload = {
          nombre: values.nombre_ruta,
          url: values.url_ruta,
          modulo: moduloId,
          id_ruta: 0 // El backend asignará el ID real
        };

        await crearRuta(createPayload as any);
        alert('Ruta creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar la ruta');
      console.error(error);
    }
  };

  const handleEdit = (ruta: Ruta & { modulo_nombre?: string }) => {
    setFormData({
      nombre_ruta: ruta.nombre,
      url_ruta: ruta.url,
      modulo_id: ruta.modulo ? ruta.modulo.toString() : ''
    });
    setEditingId(ruta.id_ruta);
    setIsModalOpen(true);
  };

  // Función para crear una nueva ruta
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
          <h1 className="text-xl font-bold mb-4">Gestión de Rutas</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Ruta
          </Boton>
        </div>

        {loading || loadingModulos ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={
                Array.isArray(rutas) 
                  ? rutas.map((ruta: Ruta) => ({
                      ...ruta,
                      key: ruta.id_ruta || Math.random(),
                      modulo_nombre: ruta.modulo && Array.isArray(modulos)
                        ? (modulos.find(mod => mod && mod.id_modulo === ruta.modulo)?.Modulo || 'Desconocido')
                        : 'No asignado'
                    }))
                  : []
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
                  {editingId ? "Editar Ruta" : "Crear Nueva Ruta"}
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

export default Rutas;
