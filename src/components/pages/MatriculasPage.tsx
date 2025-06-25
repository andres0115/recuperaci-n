import React, { useState } from 'react';
import GlobalTable, { Column } from '../organismos/Table';
import Modal from '../organismos/Modal';
import Form, { FormField } from '../organismos/Form';
import Boton from '../atomos/Boton';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';

import { 
  MatriculaInput, 
  MatriculaWithDetails
} from '@/types/matricula';
import { useMatriculas } from '@/hooks/Matriculas/useMatriculas';

const formFields: FormField[] = [
  { key: 'persona', label: 'Persona (ID)', type: 'number', required: true },
  { key: 'curso', label: 'Curso (ID)', type: 'number', required: true },
];

const MatriculasPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMatricula, setEditingMatricula] = useState<MatriculaWithDetails | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [matriculaToDelete, setMatriculaToDelete] = useState<MatriculaWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { matriculas, loading, error, addMatricula, updateMatricula, deleteMatricula } = useMatriculas();

  const columns: Column<MatriculaWithDetails>[] = [
    { key: 'id_matricula', label: 'ID', sortable: true, filterable: true },
    {
      key: 'persona',
      label: 'Persona',
      sortable: true,
      filterable: true,
      render: (item: MatriculaWithDetails) => item.persona.toString()
    },
    {
      key: 'curso',
      label: 'Curso',
      sortable: true,
      filterable: true,
      render: (item: MatriculaWithDetails) => {
        if (typeof item.curso === 'number') {
          return item.curso.toString();
        }
        if (item.curso) {
          return `${item.curso.id_curso} - ${item.curso.codigo}`;
        }
        return 'N/A';
      }
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (item: MatriculaWithDetails) => (
        <div className="flex space-x-2">
          <Boton color="primary" size="sm" onClick={() => {
            setEditingMatricula(item);
            setIsModalOpen(true);
          }}>Editar</Boton>
          <Boton color="danger" size="sm" onClick={() => {
            setMatriculaToDelete(item);
            setShowDeleteConfirmModal(true);
          }}>Eliminar</Boton>
        </div>
      ),
    },
  ];

  const handleSubmit = async (values: Record<string, any>): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const matriculaToSubmit: MatriculaInput = {
      persona: Number(values.persona),
      curso: Number(values.curso),
    };

    try {
      if (editingMatricula) {
        await updateMatricula({ ...matriculaToSubmit, id_matricula: editingMatricula.id_matricula });
      } else {
        await addMatricula(matriculaToSubmit);
      }
      setIsModalOpen(false);
      setEditingMatricula(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteMatricula = async (): Promise<void> => {
    if (matriculaToDelete) {
      await deleteMatricula(matriculaToDelete.id_matricula);
      setShowDeleteConfirmModal(false);
      setMatriculaToDelete(null);
    }
  };

  const openAddModal = (): void => {
    setEditingMatricula(null);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <p>Cargando matrículas...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <p>Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Matrículas</h1>
            <Boton color="success" onClick={openAddModal}>Agregar Matrícula</Boton>
          </div>

          <GlobalTable
            columns={columns}
            data={matriculas}
            rowsPerPage={10}
            defaultSortColumn="id_matricula"
            defaultSortDirection="asc"
            idColumnKey="id_matricula"
          />

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMatricula ? "Editar Matrícula" : "Agregar Nueva Matrícula"}>
            <Form
              fields={formFields}
              onSubmit={handleSubmit}
              buttonText={editingMatricula ? "Guardar Cambios" : "Crear Matrícula"}
              initialValues={editingMatricula || {}}
            />
          </Modal>

          <Modal isOpen={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} title="Confirmar Eliminación">
            <p>¿Estás seguro de que quieres eliminar la matrícula con ID: {matriculaToDelete?.id_matricula}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Boton color="secondary" onClick={() => setShowDeleteConfirmModal(false)}>Cancelar</Boton>
              <Boton color="danger" onClick={confirmDeleteMatricula}>Confirmar</Boton>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MatriculasPage;