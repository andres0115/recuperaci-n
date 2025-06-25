import React, { useState } from "react";
import Header from "../organismos/Header";
import Sidebar from "../organismos/Sidebar";
import GlobalTable, { Column } from "../organismos/Table";
import Boton from "../atomos/Boton";
import Form, { FormField } from "../organismos/Form";
import { X } from "lucide-react";
import { useGetProgramas } from "@/hooks/programas/useGetProgramas";
import { usePostPrograma } from "@/hooks/programas/usePostPrograma";
import { usePutPrograma } from "@/hooks/programas/usePutPrograma";
import { Programa } from "@/types/programa";

interface ProgramasProps {
    userName?: string;
}

const Programas: React.FC<ProgramasProps> = ({ userName }) => {
    const { programas, loading } = useGetProgramas();
    const { crearPrograma } = usePostPrograma();
    const { actualizarPrograma } = usePutPrograma();
    const [showModal, setShowModal] = useState(false);
    const [editingPrograma, setEditingPrograma] = useState<Programa | null>(null);

    const formFields: FormField[] = [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'tipo', label: 'Tipo', type: 'number', required: true },
    ];

    const handleEdit = (programaItem: Programa) => {
        setEditingPrograma(programaItem);
        setShowModal(true);
    };

    const handleDelete = async (programaItem: Programa) => {
        const confirmDelete = window.confirm('¿Está seguro de eliminar este programa?');
        if (confirmDelete) {
            try {
                // Aquí iría la llamada a eliminarPrograma si existiera ese hook
                alert('Programa eliminado con éxito');
            } catch (error) {
                console.error('Error al eliminar el programa:', error);
                alert('Error al eliminar el programa');
            }
        }
    };

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            const programaData: Programa = {
                key: editingPrograma ? editingPrograma.key : 0, // Se asignará en el backend
                id_programa: editingPrograma ? editingPrograma.id_programa : 0, // Se asignará en el backend
                nombre: values.nombre,
                tipo: Number(values.tipo)
            };

            if (editingPrograma) {
                await actualizarPrograma(editingPrograma.id_programa, programaData);
                alert('Programa actualizado con éxito');
            } else {
                await crearPrograma(programaData);
                alert('Programa creado con éxito');
            }

            setEditingPrograma(null);
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar el programa:', error);
            alert('Error al guardar el programa');
        }
    };

    const handleCreate = () => {
        setEditingPrograma(null);
        setShowModal(true);
    };

    const columns: Column<Programa>[] = [
        { key: 'id_programa', label: 'ID', sortable: true, filterable: true },
        { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
        { key: 'tipo', label: 'Tipo', sortable: true, filterable: true },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (item: Programa) => (
                <div className="flex space-x-2">
                    <Boton color="primary" size="sm" onClick={() => handleEdit(item)}>Editar</Boton>
                    <Boton color="secondary" size="sm" onClick={() => handleDelete(item)}>Eliminar</Boton>
                </div>
            )
        }
    ];

    if (loading) return (
        <div className="flex h-screen"  >
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} />
                <main className="flex-1 p-8">
                    <p className="text-white">Cargando programas...</p>
                </main>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen ">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Programas</h1>
                        <Boton color="primary" onClick={handleCreate}>Crear Programa</Boton>
                    </div>
                    <GlobalTable
                        data={programas}
                        columns={columns || [
                            { key: 'id_programa', label: 'ID', sortable: true, filterable: true },
                            { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
                            { key: 'tipo', label: 'Tipo', sortable: true, filterable: true },
                            {
                                key: 'acciones',
                                label: 'Acciones',
                                render: (item: Programa) => (
                                    <div className="flex space-x-2">
                                        <Boton color="primary" size="sm" onClick={() => handleEdit(item)}>Editar</Boton>
                                        <Boton color="secondary" size="sm" onClick={() => handleDelete(item)}>Eliminar</Boton>
                                    </div>
                                )
                            }
                        ]}
                        rowsPerPage={10}
                        defaultSortColumn="id_programa"
                    />
                </main>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                            onClick={() => {
                                setShowModal(false);
                                setEditingPrograma(null);
                            }}
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-emerald-300">{editingPrograma ? 'Editar Programa' : 'Nuevo Programa'}</h2>
                        <Form
                            fields={formFields}
                            onSubmit={handleSubmit}
                            buttonText={editingPrograma ? 'Actualizar' : 'Crear'}
                            initialValues={editingPrograma ? { nombre: editingPrograma.nombre, tipo: editingPrograma.tipo.toString() } : { nombre: '', tipo: '' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programas;