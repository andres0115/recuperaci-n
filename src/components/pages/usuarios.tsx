import { useState } from "react";
import { useGetUsuarios } from '@/hooks/usuario/useGetUsuarios';
import { usePostUsuario } from '@/hooks/usuario/usePostUsuario';
import { usePutUsuario } from '@/hooks/usuario/usePutUsuario';
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { useGetAplicativos } from '@/hooks/aplicativos/useGetAplicativos';
import { useGetPersonas } from '@/hooks/personas/useGetPersona';
import { Usuario } from '@/types/usuarios';
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Header from "@/components/organismos/Header";
import Sidebar from "@/components/organismos/Sidebar";

const Usuarios = () => {
  const { usuarios, loading } = useGetUsuarios();
  const { crearUsuario } = usePostUsuario();
  const { actualizarUsuario } = usePutUsuario();
  const { roles, loading: loadingRoles } = useGetRoles();
  const { aplicativos, loading: loadingAplicativos } = useGetAplicativos();
  const { personas, loading: loadingPersonas } = useGetPersonas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Usuario & { key: number; rol_nombre?: string; aplicativo_nombre?: string; persona_nombre?: string }>[]= [
    { key: "login", label: "Usuario", filterable: true },
    { key: "persona_nombre", label: "Persona", filterable: true },
    { key: "aplicativo_nombre", label: "Aplicativo", filterable: true },
    { key: "rol_nombre", label: "Rol", filterable: true },
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

  // Create safe options for select dropdown - Roles
  const getRolOptions = () => {
    if (!roles || roles.length === 0) {
      return [];
    }
    
    return roles.map(rol => ({
      value: rol.id_rol?.toString() || '',
      label: rol.nombre || 'Sin nombre'
    }));
  };

  // Create safe options for select dropdown - Aplicativos
  const getAplicativoOptions = () => {
    if (!aplicativos || aplicativos.length === 0) {
      return [];
    }
    
    return aplicativos.map(app => ({
      value: app.idAplicativo?.toString() || '',
      label: app.nombre || 'Sin nombre'
    }));
  };

  // Create safe options for select dropdown - Personas
  const getPersonaOptions = () => {
    if (!personas || personas.length === 0) {
      return [];
    }
    
    return personas.map(persona => ({
      value: persona.id_persona?.toString() || '',
      label: `${persona.nombre} ${persona.apellido} (${persona.documento})` || 'Sin nombre'
    }));
  };

  const formFieldsCreate: FormField[] = [
    { key: "login", label: "Usuario", type: "text", required: true },
    { key: "password", label: "Contraseña", type: "password", required: true },
    { 
      key: "persona_id", 
      label: "Persona", 
      type: "select", 
      required: true,
      options: getPersonaOptions()
    },
    { 
      key: "aplicativo_id", 
      label: "Aplicativo", 
      type: "select", 
      required: true,
      options: getAplicativoOptions()
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true,
      options: getRolOptions()
    },
  ];
  
  const formFieldsEdit: FormField[] = [
    { key: "login", label: "Usuario", type: "text", required: true },
    { key: "password", label: "Contraseña", type: "password", required: false },
    { 
      key: "persona_id", 
      label: "Persona", 
      type: "select", 
      required: true,
      options: getPersonaOptions()
    },
    { 
      key: "aplicativo_id", 
      label: "Aplicativo", 
      type: "select", 
      required: true,
      options: getAplicativoOptions()
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true,
      options: getRolOptions()
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Preparar los datos para enviar
      const aplicativoId = parseInt(values.aplicativo_id);
      const rolId = parseInt(values.rol_id);
      const personaId = parseInt(values.persona_id);
      
      if (editingId) {
        // Actualizar usuario existente
        const updateData: Partial<Usuario> = { 
          login: values.login,
          persona: personaId,
          aplicativo: aplicativoId,
          rol: rolId
        };
        
        // Solo incluir contraseña si se ha proporcionado una nueva
        if (values.password && values.password.trim() !== '') {
          updateData.password = values.password;
        }

        await actualizarUsuario(editingId, updateData);
        alert('Usuario actualizado con éxito');
      } else {
        const createPayload = {
          login: values.login,
          password: values.password,
          persona: personaId,
          aplicativo: aplicativoId,
          rol: rolId,
          id_usuario: 0 // El backend asignará el ID real
        };

        await crearUsuario(createPayload as any);
        alert('Usuario creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el usuario');
      console.error(error);
    }
  };

  const handleEdit = (usuario: Usuario & { rol_nombre?: string; aplicativo_nombre?: string }) => {
    setFormData({
      login: usuario.login,
      persona_id: usuario.persona ? usuario.persona.toString() : '',
      aplicativo_id: usuario.aplicativo ? usuario.aplicativo.toString() : '',
      rol_id: usuario.rol ? usuario.rol.toString() : ''
    });
    setEditingId(usuario.id_usuario);
    setIsModalOpen(true);
  };

  // Función para crear un nuevo usuario
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
          <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
        </div>
      
        <div>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Usuario
          </Boton>
        </div>

        {loading || loadingRoles || loadingAplicativos || loadingPersonas ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="w-full">
            <GlobalTable
              columns={columns}
              data={
                Array.isArray(usuarios) 
                  ? usuarios.map((usuario: Usuario) => {
                      const rolInfo = roles?.find(r => r.id_rol === usuario.rol);
                      const aplicativoInfo = aplicativos?.find(a => a.idAplicativo === usuario.aplicativo);
                      const personaInfo = personas?.find(p => p.id_persona === usuario.persona);
                      
                      return {
                        ...usuario,
                        key: usuario.id_usuario || Math.random(),
                        rol_nombre: rolInfo?.nombre || 'Desconocido',
                        aplicativo_nombre: aplicativoInfo?.nombre || 'Desconocido',
                        persona_nombre: personaInfo ? `${personaInfo.nombre} ${personaInfo.apellido}` : 'Desconocido'
                      };
                    })
                  : []
              }
              defaultSortColumn="login"
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
                  {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
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

export default Usuarios;
