import React, { useState } from 'react';
import Dashboard from '../templates/Dashboard';
import GlobalTable, { Column } from '../organismos/Table';
import Modal from '../organismos/Modal';
import Form, { FormField } from '../organismos/Form';
import Boton from '../atomos/Boton';
import { format } from 'date-fns';
import { Curso, CursoInput } from '../../types/curso';
import { useCursos } from '../../hooks/cursos/useCursos';

const formFields: FormField[] = [
  { key: 'codigo', label: 'Código', type: 'number', required: true },
  { key: 'fecha_inicio', label: 'Fecha Inicio', type: 'date', required: true },
  { key: 'fecha_fin', label: 'Fecha Fin', type: 'date', required: true },
  { key: 'fin_lectiva', label: 'Fin Lectiva', type: 'date', required: true },
  { key: 'area', label: 'Área (ID)', type: 'number', required: true },
  { key: 'programa', label: 'Programa (ID)', type: 'number', required: true },
  { key: 'lider', label: 'Líder (ID)', type: 'number', required: true },
];

const CursosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Curso | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Curso | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cursos, loading, error, addCurso, updateCurso, deleteCurso } = useCursos();

  const columns: Column<Curso>[] = [
    { key: 'id_curso', label: 'ID', sortable: true, filterable: true },
    { key: 'codigo', label: 'Código', sortable: true, filterable: true },
    {
      key: 'fecha_inicio',
      label: 'Fecha Inicio',
      sortable: true,
      filterable: true,
      render: (item: Curso) => format(new Date(item.fecha_inicio), 'dd/MM/yyyy'),
    },
    {
      key: 'fecha_fin',
      label: 'Fecha Fin',
      sortable: true,
      filterable: true,
      render: (item: Curso) => format(new Date(item.fecha_fin), 'dd/MM/yyyy'),
    },
    {
      key: 'fin_lectiva',
      label: 'Fin Lectiva',
      sortable: true,
      filterable: true,
      render: (item: Curso) => format(new Date(item.fin_lectiva), 'dd/MM/yyyy'),
    },
    { key: 'area', label: 'Área', sortable: true, filterable: true },
    { key: 'programa', label: 'Programa', sortable: true, filterable: true },
    { key: 'lider', label: 'Líder', sortable: true, filterable: true },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (item: Curso) => (
        <div className="flex space-x-2">
          <Boton color="primary" size="sm" onClick={() => {
            setEditingCourse(item);
            setIsModalOpen(true);
          }}>Editar</Boton>
          <Boton color="danger" size="sm" onClick={() => {
            setCourseToDelete(item);
            setShowDeleteConfirmModal(true);
          }}>Eliminar</Boton>
        </div>
      ),
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const courseToSubmit: CursoInput = {
      codigo: Number(values.codigo),
      fecha_inicio: values.fecha_inicio,
      fecha_fin: values.fecha_fin,
      fin_lectiva: values.fin_lectiva,
      area: Number(values.area),
      programa: Number(values.programa),
      lider: Number(values.lider),
    };

    try {
      if (editingCourse) {
        await updateCurso({ ...editingCourse, ...courseToSubmit });
      } else {
        await addCurso(courseToSubmit);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCourse = async () => {
    if (courseToDelete) {
      await deleteCurso(courseToDelete.id_curso);
      setShowDeleteConfirmModal(false);
      setCourseToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  if (loading) return <Dashboard userName="Administrador"><p>Cargando cursos...</p></Dashboard>;
  if (error) return <Dashboard userName="Administrador"><p>Error: {error}</p></Dashboard>;

  return (
    <Dashboard userName="Administrador">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h1>
        <Boton color="success" onClick={openAddModal}>Agregar Curso</Boton>
      </div>

      <GlobalTable
        columns={columns}
        data={cursos}
        rowsPerPage={10}
        defaultSortColumn="id_curso"
        defaultSortDirection="asc"
        idColumnKey="id_curso"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? "Editar Curso" : "Agregar Nuevo Curso"}>
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          buttonText={editingCourse ? "Guardar Cambios" : "Crear Curso"}
          initialValues={editingCourse || {}}
        />
      </Modal>

      <Modal isOpen={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} title="Confirmar Eliminación">
        <p>¿Estás seguro de que quieres eliminar el curso con ID: {courseToDelete?.id_curso}?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Boton color="secondary" onClick={() => setShowDeleteConfirmModal(false)}>Cancelar</Boton>
          <Boton color="danger" onClick={confirmDeleteCourse}>Confirmar</Boton>
        </div>
      </Modal>
    </Dashboard>
  );
};

export default CursosPage; 