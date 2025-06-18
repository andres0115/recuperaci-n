import { useState } from "react";
import { useGetPermisos } from '@/hooks/permisos/useGetPermisos';
import { usePostPermiso } from '@/hooks/permisos/usePostPermiso';
import { usePutPermiso } from '@/hooks/permisos/usePutPermiso';
import { useGetUsuarios } from '@/hooks/usuario/useGetUsuarios';
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { useGetRutas } from '@/hooks/rutas/useGetRutas';
import { permisos } from '@/types/permisos';
import { Usuario } from '@/types/usuarios';
import { Rol } from '@/types/roles';
import { Ruta } from '@/types/rutas';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Permisos = () => {
  const { permisos, loading } = useGetPermisos();
  const { crearPermiso } = usePostPermiso();
  const { actualizarPermiso } = usePutPermiso();
  const { usuarios, loading: loadingUsuarios } = useGetUsuarios();
  const { roles, loading: loadingRoles } = useGetRoles();
  const { rutas, loading: loadingRutas } = useGetRutas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<permisos & { key: number; usuario_nombre?: string; rol_nombre?: string; ruta_nombre?: string }>[]= [
    { key: "usuario_nombre", label: "Usuario", filterable: true },
    { key: "rol_nombre", label: "Rol", filterable: true },
    { key: "ruta_nombre", label: "Ruta", filterable: true },
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

  // Create safe options for select dropdowns
  const getUsuarioOptions = () => {
    if (!usuarios || usuarios.length === 0) {
      return [];
    }
    
    return usuarios.map((user: Usuario) => ({
      value: user.id_usuario?.toString() || '',
      label: user.login || 'Sin nombre'
    }));
  };

  const getRolOptions = () => {
    if (!roles || roles.length === 0) {
      return [];
    }
    
    return roles.map((rol: Rol) => ({
      value: rol.id_rol?.toString() || '',
      label: rol.nombre || 'Sin nombre'
    }));
  };

  const getRutaOptions = () => {
    if (!rutas || rutas.length === 0) {
      return [];
    }
    
    return rutas.map((ruta: Ruta) => ({
      value: ruta.id_ruta?.toString() || '',
      label: ruta.nombre || 'Sin nombre'
    }));
  };

  const formFieldsCreate: FormField[] = [
    { 
      key: "usuario_id", 
      label: "Usuario", 
      type: "select", 
      required: true,
      options: getUsuarioOptions()
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true,
      options: getRolOptions()
    },
    { 
      key: "ruta_id", 
      label: "Ruta", 
      type: "select", 
      required: true,
      options: getRutaOptions()
    },
  ];
  
  const formFieldsEdit: FormField[] = [
    { 
      key: "usuario_id", 
      label: "Usuario", 
      type: "select", 
      required: true,
      options: getUsuarioOptions()
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true,
      options: getRolOptions()
    },
    { 
      key: "ruta_id", 
      label: "Ruta", 
      type: "select", 
      required: true,
      options: getRutaOptions()
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Preparar los datos para enviar
      const usuarioId = parseInt(values.usuario_id);
      const rolId = parseInt(values.rol_id);
      const rutaId = parseInt(values.ruta_id);
      
      if (editingId) {
        // Actualizar permiso existente
        await actualizarPermiso(editingId, { 
          id_permiso: editingId,
          usuario: usuarioId,
          rol: rolId,
          ruta: rutaId
        });
        alert('Permiso actualizado con éxito');
      } else {
        const createPayload = {
          id_permiso: 0, // This will be replaced by the backend
          usuario: usuarioId,
          rol: rolId,
          ruta: rutaId
        };

        await crearPermiso(createPayload);
        alert('Permiso creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el permiso');
      console.error(error);
    }
  };

  const handleEdit = (permiso: permisos & { usuario_nombre?: string; rol_nombre?: string; ruta_nombre?: string }) => {
    setFormData({
      usuario_id: permiso.usuario ? permiso.usuario.toString() : '',
      rol_id: permiso.rol ? permiso.rol.toString() : '',
      ruta_id: permiso.ruta ? permiso.ruta.toString() : ''
    });
    setEditingId(permiso.id_permiso);
    setIsModalOpen(true);
  };

  // Función para crear un nuevo permiso
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
          <h1 className="text-xl font-bold mb-4">Gestión de Permisos</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Permiso
          </Boton>
        </div>

        {loading || loadingUsuarios || loadingRoles || loadingRutas ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={
                Array.isArray(permisos) 
                  ? permisos.map((permiso: permisos) => ({
                      ...permiso,
                      key: permiso.id_permiso || Math.random(),
                      usuario_nombre: permiso.usuario && Array.isArray(usuarios)
                        ? (usuarios.find(user => user && user.id_usuario === permiso.usuario)?.login || 'Desconocido')
                        : 'No asignado',
                      rol_nombre: permiso.rol && Array.isArray(roles)
                        ? (roles.find(rol => rol && rol.id_rol === permiso.rol)?.nombre || 'Desconocido')
                        : 'No asignado',
                      ruta_nombre: permiso.ruta && Array.isArray(rutas)
                        ? (rutas.find(ruta => ruta && ruta.id_ruta === permiso.ruta)?.nombre || 'Desconocido')
                        : 'No asignado'
                    }))
                  : []
              }
              defaultSortColumn="usuario_nombre"
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
                  {editingId ? "Editar Permiso" : "Crear Nuevo Permiso"}
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

export default Permisos;
