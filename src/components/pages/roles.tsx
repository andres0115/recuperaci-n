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
// Import Aplicativo type for type checking
import type { Aplicativo } from "@/types/aplicativos";

const Roles = () => {
  const { roles, loading } = useGetRoles();
  const { crearRol } = usePostRol();
  const { actualizarRol } = usePutRol();
  const { aplicativos, loading: loadingAplicativos } = useGetAplicativos();
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

  // Función para obtener el nombre del aplicativo
  const getAplicativoNombre = (aplicativoId: number): string => {
    if (!validAplicativos.length) return 'Cargando aplicativos...';
    const aplicativo = validAplicativos.find(app => app.idAplicativo === aplicativoId);
    return aplicativo ? aplicativo.nombre : 'Sin aplicativo asignado';
  };

  const columns: Column<Rol & { key: number; aplicativo_nombre?: string }>[]= [
    { key: "nombre", label: "Nombre del Rol", filterable: true },
    {
      key: "aplicativo",
      label: "Aplicativo",
      filterable: true,
      render: (item) => getAplicativoNombre(item.aplicativo)
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

  const getAplicativoOptions = () => {
    return validAplicativos.map(app => ({
      value: app.idAplicativo.toString(),
      label: `${app.nombre} (ID: ${app.idAplicativo})`
    }));
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
      if (!values.nombre_rol || values.nombre_rol.trim() === '') {
        console.error('El nombre del rol es obligatorio');
        return;
      }

      const aplicativoId = parseInt(values.aplicativo_id);
      if (isNaN(aplicativoId)) {
        console.error('El ID del aplicativo no es válido');
        return;
      }

      // Crear el objeto rol con la estructura correcta para el DTO
      const rolData = {
        id_rol: 0, // Este campo no se envía al crear
        nombre: values.nombre_rol.trim(),
        aplicativo: aplicativoId
      };

      console.log('Intentando crear rol con datos:', {
        nombre: rolData.nombre,
        aplicativo: { idAplicativo: rolData.aplicativo }
      });

      if (editingId) {
        await actualizarRol(editingId, {
          nombre: values.nombre_rol.trim(),
          aplicativo: aplicativoId
        });
      } else {
        await crearRol(rolData);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error: any) {
      console.error('Error al guardar el rol:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
        console.error('Datos enviados:', error.config?.data);
      }
    }
  };

  const handleEdit = (rol: Rol & { aplicativo_nombre?: string }) => {
    setFormData({
      nombre_rol: rol.nombre,
      aplicativo_id: rol.aplicativo ? rol.aplicativo.toString() : ''
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
                  ? roles.map((rol: Rol) => {
                      // Process each role
                      return {
                        ...rol,
                        key: rol.id_rol || Math.random()
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
