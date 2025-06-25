import React, { useState } from "react";
import { Alert } from "@heroui/react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetPersonas } from "@/hooks/personas/useGetPersona";
import { usePostPersonas } from "@/hooks/personas/usePostPersona";
import { usePutPersonas } from "@/hooks/personas/usePutPersona";
import { useDeletePersonas } from "@/hooks/personas/useDeletePersona"; // Importa el hook para eliminar
import { Persona } from "@/types/personas";


const Personas = () => {
  const { personas, loading, fetchPersonas } = useGetPersonas();
  const { crearPersona } = usePostPersonas();
  const { actualizarPersona } = usePutPersonas();
  const { mutateAsync: eliminarPersona } = useDeletePersonas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Persona>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<Persona>[] = [
    { key: "nombre", label: "Nombre", filterable: true },
    { key: "telefono", label: "Teléfono", filterable: true },
    { key: "direccion", label: "Dirección", filterable: true },
    { key: "correo", label: "Correo", filterable: true },
    { key: "genero", label: "Género", filterable: true },
    { key: "municipio", label: "Municipio", filterable: true },
    { key: "cargo", label: "Cargo", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (persona) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(persona)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(persona.id_persona)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    { key: "direccion", label: "Dirección", type: "text", required: true },
    { key: "correo", label: "Correo", type: "text", required: true },
    {
      key: "genero",
      label: "Género",
      type: "select",
      required: true,
      options: ["Masculino", "Femenino", "Otro"]
    },
    { key: "municipio", label: "Municipio", type: "number", required: false },
    {
      key: "cargo",
      label: "Cargo",
      type: "select",
      required: true,
      options: ["Instructor", "Administrador", "Otro"] // ajusta según tu dominio
    },
    {
      key: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: ["Activo", "Inactivo"]
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      if (editingId) {
        await actualizarPersona(editingId, values);
        setSuccessAlertText("Persona actualizada con éxito");
      } else {
        await crearPersona(values);
        setSuccessAlertText("Persona creada con éxito");
      }
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      fetchPersonas();
    } catch (error) {
      console.error("Error:", error);
      setSuccessAlertText("Ocurrió un error al guardar la persona");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (persona: Persona) => {
    setFormData(persona);
    setEditingId(persona.id_persona);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta persona?");
    if (confirmDelete) {
      try {
        await eliminarPersona(id);
        setSuccessAlertText("Persona eliminada con éxito");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        fetchPersonas();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setSuccessAlertText("Ocurrió un error al eliminar la persona");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
    }
  };

  return (
    <>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Personas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Persona
          </Boton>

        {loading ? (
          <p>Cargando personas...</p>
        ) : (
            <GlobalTable
              columns={columns}
              data={personas.map((p) => ({ ...p, key: p.id_persona }))}
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Persona" : "Crear Nueva Persona"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData}
                />
                <div className="flex justify-end mt-4">
                  <Boton
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2"
                  >
                    Cancelar
                  </Boton>
                </div>
              </div>
          </div>
        )}
      </div>

      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            hideIconWrapper
            color="success"
            description={successAlertText}
            title="¡Éxito!"
            variant="solid"
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(Personas);
