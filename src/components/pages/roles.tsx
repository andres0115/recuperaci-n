import { useState } from "react";
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { useGetAplicativos } from '@/hooks/aplicativos/useGetAplicativos';
import { usePostRol } from '@/hooks/roles/usePostRol';
import { usePutRol } from '@/hooks/roles/usePutRol';
import { Rol } from '@/types/roles';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Roles = () => {
  const { roles, loading } = useGetRoles();
  const { crearRol } = usePostRol();
  const { actualizarRol } = usePutRol();
  const { aplicativos, loading: loadingAplicativos } = useGetAplicativos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({}); 

  const columns: Column<Rol & { key: number; aplicativo_nombre?: string }>[]= [
    { key: "nombre", label: "Nombre del Rol", filterable: true },
    {
      key: "aplicativo",
      label: "Aplicativo",
      filterable: true,
      render: (item) => {
        // Check if aplicativos is available and is an array
        if (!aplicativos || !Array.isArray(aplicativos)) {
          return 'Cargando...';
        }

        // Extraer el ID del aplicativo, manejando posibles diferencias en la estructura
        let aplicativoId: number | undefined;
        
        if (typeof item.aplicativo === 'object' && item.aplicativo !== null) {
          // Si aplicativo es un objeto, extraer su ID
          const aplicativoObj: any = item.aplicativo;
          aplicativoId = aplicativoObj.idAplicativo || aplicativoObj.id_aplicativo;
        } else {
          // Si aplicativo es un ID directo
          aplicativoId = item.aplicativo as number;
        }
        
        console.log(`Buscando aplicativo con ID: ${aplicativoId}`);
        
        // Find the matching aplicativo
        const aplicativoEncontrado = aplicativos.find((app: any) => {
          const appId = app.idAplicativo || app.id_aplicativo;
          return app && appId === aplicativoId;
        });
        
        // Return the name or a default message
        return aplicativoEncontrado ? aplicativoEncontrado.nombre : 'Desconocido';
      }
    },
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

  // Función para obtener las opciones de aplicativos para el selector
  const getAplicativoOptions = () => {
    if (!aplicativos || aplicativos.length === 0) {
      return [];
    }
    
    const options = aplicativos.map((aplicativo: any) => {
      // Usar idAplicativo si existe, o id_aplicativo como fallback
      const id = aplicativo.idAplicativo || aplicativo.id_aplicativo;
      return {
        value: id?.toString() || '',
        label: aplicativo.nombre || 'Sin nombre'
      };
    });
    
    console.log('Aplicativo options:', options);
    return options;
  };

  const formFieldsCreate: FormField[] = [
    { key: "nombre_rol", label: "Nombre del Rol", type: "text", required: true },
    { 
      key: "aplicativo_id", 
      label: "Aplicativo", 
      type: "select", 
      required: true,
      options: getAplicativoOptions()
    },
  ];
  
  const formFieldsEdit: FormField[] = [
    { key: "nombre_rol", label: "Nombre del Rol", type: "text", required: true },
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
      console.log('Valores del formulario:', values);
      
      // Validar que se haya seleccionado un aplicativo
      if (!values.aplicativo_id) {
        alert('Debe seleccionar un aplicativo');
        return;
      }
      
      // Convertir el ID del aplicativo a número
      const aplicativoId = parseInt(values.aplicativo_id);
      if (isNaN(aplicativoId)) {
        alert('ID de aplicativo inválido');
        return;
      }
      
      // Verificar que el aplicativo exista
      const aplicativoExiste = Array.isArray(aplicativos) ? 
        aplicativos.some((a: any) => {
          const id = a.idAplicativo || a.id_aplicativo;
          return id === aplicativoId;
        }) : false;
      
      if (!aplicativoExiste) {
        console.warn('El aplicativo seleccionado no existe en los datos cargados');
      }
      
      // Preparar los datos para enviar
      const payload = {
        nombre: values.nombre_rol,
        aplicativo: aplicativoId
      };
      
      console.log('Payload a enviar:', payload);
      
      if (editingId) {
        // Actualizar rol existente
        await actualizarRol(editingId, payload);
        alert('Rol actualizado con éxito');
      } else {
        // Crear nuevo rol
        await crearRol(payload as any);
        alert('Rol creado con éxito');
      }
      
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el rol');
      console.error(error);
    }
  };

  const handleEdit = (rol: Rol & { aplicativo_nombre?: string }) => {
    console.log('Editando rol:', rol);
    
    // Extraer el ID del aplicativo, manejando posibles diferencias en la estructura
    let aplicativoId: string = '';
    
    if (typeof rol.aplicativo === 'object' && rol.aplicativo !== null) {
      // Si aplicativo es un objeto, extraer su ID
      const aplicativoObj: any = rol.aplicativo;
      aplicativoId = (aplicativoObj.idAplicativo || aplicativoObj.id_aplicativo)?.toString() || '';
    } else if (rol.aplicativo) {
      // Si aplicativo es un ID directo
      aplicativoId = rol.aplicativo.toString();
    }
    
    setFormData({
      nombre_rol: rol.nombre || '',
      aplicativo_id: aplicativoId
    });
    
    console.log('Valores iniciales del formulario:', {
      nombre_rol: rol.nombre || '',
      aplicativo_id: aplicativoId
    });
    
    setEditingId(rol.id_rol);
    setIsModalOpen(true);
  };

  // Función para crear un nuevo rol
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
          <h1 className="text-xl font-bold mb-4">Gestión de Roles</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Rol
          </Boton>
        </div>

        {loading || loadingAplicativos ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={
                Array.isArray(roles) 
                  ? roles.map((rol: any) => {
                      console.log('Procesando rol:', rol);
                      
                      // Extraer información del rol
                      const rolId = rol.idRol || rol.id_rol;
                      
                      // Process each role
                      return {
                        ...rol,
                        key: rolId || Math.random()
                        // We don't need aplicativo_nombre here as we're using a render function
                      };
                    })
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
                  {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
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

export default Roles;
