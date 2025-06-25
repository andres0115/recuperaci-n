import { useState } from 'react';
import { useGetPermisos } from '@/hooks/permisos/useGetPermisos';
import { usePostPermiso } from '@/hooks/permisos/usePostPermiso';
import { usePutPermiso } from '@/hooks/permisos/usePutPermiso';
import { useDeletePermiso } from '@/hooks/permisos/useDeletePermiso';
import { useGetUsuarios } from '@/hooks/usuario/useGetUsuarios';
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { useGetRutas } from '@/hooks/rutas/useGetRutas';
import { permisos } from '@/types/permisos';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Permisos = () => {
  const { permisos, loading } = useGetPermisos();
  const { crearPermiso } = usePostPermiso();
  const { actualizarPermiso } = usePutPermiso();
  const { eliminarPermiso } = useDeletePermiso();
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
          <Boton 
            onClick={() => handleDelete(item.id_permiso)} 
            className="bg-red-500 text-white px-2 py-1 text-xs"
          >
            Eliminar
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
    
    const options = usuarios.map((usuario: any) => {
      // Usar idUsuario si existe, o id_usuario como fallback
      const id = usuario.idUsuario || usuario.id_usuario;
      return {
        value: id?.toString() || '',
        label: usuario.login || 'Sin nombre'
      };
    });
    
    console.log('Usuario options:', options);
    return options;
  };

  const getRolOptions = () => {
    if (!roles || roles.length === 0) {
      return [];
    }
    
    const options = roles.map((rol: any) => {
      // Usar idRol si existe, o id_rol como fallback
      const id = rol.idRol || rol.id_rol;
      return {
        value: id?.toString() || '',
        label: rol.nombre || 'Sin nombre'
      };
    });
    
    console.log('Rol options:', options);
    return options;
  };

  const getRutaOptions = () => {
    if (!rutas || rutas.length === 0) {
      return [];
    }
    
    const options = rutas.map((ruta: any) => {
      // Usar idRuta si existe, o id_ruta como fallback
      const id = ruta.idRuta || ruta.id_ruta;
      return {
        value: id?.toString() || '',
        label: ruta.nombre || 'Sin nombre'
      };
    });
    
    console.log('Ruta options:', options);
    return options;
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
      console.log('handleSubmit recibió valores:', values);
      
      // Verificar que los valores existan
      if (!values.usuario_id || !values.rol_id || !values.ruta_id) {
        alert('Por favor seleccione valores para Usuario, Rol y Ruta');
        return;
      }
      
      // Preparar los datos para enviar
      const usuarioId = parseInt(values.usuario_id);
      const rolId = parseInt(values.rol_id);
      const rutaId = parseInt(values.ruta_id);
      
      // Verificar que los IDs sean válidos
      if (isNaN(usuarioId) || isNaN(rolId) || isNaN(rutaId)) {
        alert('Por favor seleccione valores válidos para Usuario, Rol y Ruta');
        return;
      }
      
      // Verificar que los IDs existan en los arrays correspondientes
      const usuarioExiste = Array.isArray(usuarios) ? usuarios.some((u: any) => (u.idUsuario || u.id_usuario) === usuarioId) : false;
      const rolExiste = Array.isArray(roles) ? roles.some((r: any) => (r.idRol || r.id_rol) === rolId) : false;
      const rutaExiste = Array.isArray(rutas) ? rutas.some((r: any) => (r.idRuta || r.id_ruta) === rutaId) : false;
      
      if (!usuarioExiste || !rolExiste || !rutaExiste) {
        console.warn('Alguno de los IDs seleccionados no existe en los datos cargados');
        // Continuamos de todos modos, ya que podría ser un problema de carga de datos
      }
      
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
        
        console.log('Creando permiso con payload:', createPayload);
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
    // Extraer IDs de los objetos si son objetos, o usar directamente si son números
    let usuarioId: number | undefined;
    let rolId: number | undefined;
    let rutaId: number | undefined;
    
    if (typeof permiso.usuario === 'object' && permiso.usuario !== null) {
      // Usar tipado 'any' para evitar errores de TypeScript
      const usuarioObj: any = permiso.usuario;
      usuarioId = usuarioObj.idUsuario || usuarioObj.id_usuario;
    } else {
      usuarioId = permiso.usuario as number;
    }
    
    if (typeof permiso.rol === 'object' && permiso.rol !== null) {
      // Usar tipado 'any' para evitar errores de TypeScript
      const rolObj: any = permiso.rol;
      rolId = rolObj.idRol || rolObj.id_rol;
    } else {
      rolId = permiso.rol as number;
    }
    
    if (typeof permiso.ruta === 'object' && permiso.ruta !== null) {
      // Usar tipado 'any' para evitar errores de TypeScript
      const rutaObj: any = permiso.ruta;
      rutaId = rutaObj.idRuta || rutaObj.id_ruta;
    } else {
      rutaId = permiso.ruta as number;
    }
    
    console.log('Editando permiso:', permiso);
    console.log('IDs extraídos:', { usuarioId, rolId, rutaId });
    
    setFormData({
      usuario_id: usuarioId ? usuarioId.toString() : '',
      rol_id: rolId ? rolId.toString() : '',
      ruta_id: rutaId ? rutaId.toString() : ''
    });
    setEditingId(permiso.id_permiso);
    setIsModalOpen(true);
  };

  // Función para eliminar un permiso
  const handleDelete = async (id: number) => {
    console.log('Eliminando permiso con ID:', id);
    if (window.confirm('¿Está seguro que desea eliminar este permiso?')) {
      try {
        await eliminarPermiso(id);
        alert('Permiso eliminado con éxito');
      } catch (error) {
        alert('Error al eliminar el permiso');
        console.error(error);
      }
    }
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
                  ? permisos.map((permiso: any) => {
                      // Extraer información directamente de los objetos anidados
                      const usuarioObj = typeof permiso.usuario === 'object' ? permiso.usuario : null;
                      const rolObj = typeof permiso.rol === 'object' ? permiso.rol : null;
                      const rutaObj = typeof permiso.ruta === 'object' ? permiso.ruta : null;
                      
                      // Logs para depurar cada permiso
                      console.log(`Permiso ID: ${permiso.id_permiso}`);
                      console.log(`Usuario en permiso:`, usuarioObj);
                      console.log(`Rol en permiso:`, rolObj);
                      console.log(`Ruta en permiso:`, rutaObj);
                      
                      return {
                        ...permiso,
                        key: permiso.id_permiso || Math.random(),
                        usuario_nombre: usuarioObj?.login || 'Desconocido',
                        rol_nombre: rolObj?.nombre || 'Desconocido',
                        ruta_nombre: rutaObj?.nombre || 'Desconocido'
                      };
                    })
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
                  className="text-black"
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
