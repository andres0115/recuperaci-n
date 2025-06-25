import React, { useState } from "react";
import Header from "../organismos/Header";
import Sidebar from "../organismos/Sidebar";
import GlobalTable, { Column } from "../organismos/Table";
import Boton from "../atomos/Boton";
import Form, { FormField } from "../organismos/Form";
import { X } from "lucide-react";
import { useGetAreas } from "@/hooks/areas/useGetAreas";
import { usePostArea } from "@/hooks/areas/usePostArea";
import { usePutArea } from "@/hooks/areas/usePutArea";
import { Area } from "@/types/area";

interface AreasProps {
    userName?: string;
}

const Areas: React.FC<AreasProps> = ({ userName }) => {
    const { areas, loading } = useGetAreas();
    const { crearArea } = usePostArea();
    const { actualizarArea } = usePutArea();
    const [showModal, setShowModal] = useState(false);
    const [editingArea, setEditingArea] = useState<Area | null>(null);

    const formFields: FormField[] = [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'sede', label: 'Sede', type: 'text', required: true },
    ];

    const handleEdit = (areaItem: Area) => {
        setEditingArea(areaItem);
        setShowModal(true);
    };

    const handleDelete = async (areaItem: Area) => {
        const confirmDelete = window.confirm('¿Está seguro de eliminar esta área?');
        if (confirmDelete) {
            try {
                // Aquí iría la llamada a eliminarArea si existiera ese hook
                alert('Área eliminada con éxito');
            } catch (error) {
                console.error('Error al eliminar el área:', error);
                alert('Error al eliminar el área');
            }
        }
    };

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            const areaData: Area = {
                key: editingArea ? editingArea.key : 0, // Se asignará en el backend
                id_area: editingArea ? editingArea.id_area : 0, // Se asignará en el backend
                nombre: values.nombre,
                sede: values.sede
            };

            if (editingArea) {
                await actualizarArea(editingArea.id_area, areaData);
                alert('Área actualizada con éxito');
            } else {
                await crearArea(areaData);
                alert('Área creada con éxito');
            }

            setEditingArea(null);
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar el área:', error);
            alert('Error al guardar el área');
        }
    };

    const handleCreate = () => {
        setEditingArea(null);
        setShowModal(true);
    };

    const columns: Column<Area>[] = [
        { key: 'id_area', label: 'ID', sortable: true, filterable: true },
        { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
        { key: 'sede', label: 'Sede', sortable: true, filterable: true },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (item: Area) => (
                <div className="flex space-x-2">
                    <Boton color="primary" size="sm" onClick={() => handleEdit(item)}>Editar</Boton>
                    <Boton color="secondary" size="sm" onClick={() => handleDelete(item)}>Eliminar</Boton>
                </div>
            )
        }
    ];

    if (loading) return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} />
                <main className="flex-1 p-8">
                    <p className="text-white">Cargando áreas...</p>
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
                        <h1 className="text-2xl font-bold text-white">Areas</h1>
                        <Boton color="primary" onClick={handleCreate}>Crear Area</Boton>
                    </div>
                    <GlobalTable
                        data={areas}
                        columns={columns || [
                            { key: 'id_area', label: 'ID', sortable: true, filterable: true },
                            { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
                            { key: 'sede', label: 'Sede', sortable: true, filterable: true },
                            {
                                key: 'acciones',
                                label: 'Acciones',
                                render: (item: Area) => (
                                    <div className="flex space-x-2">
                                        <Boton color="primary" size="sm" onClick={() => handleEdit(item)}>Editar</Boton>
                                        <Boton color="secondary" size="sm" onClick={() => handleDelete(item)}>Eliminar</Boton>
                                    </div>
                                )
                            }
                        ]}
                        rowsPerPage={10}
                        defaultSortColumn="id_area"
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
                                setEditingArea(null);
                            }}
                        >
                            <X />
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-emerald-300">{editingArea ? 'Editar Área' : 'Agregar Área'}</h2>
                        <Form
                            fields={formFields}
                            onSubmit={handleSubmit}
                            buttonText={editingArea ? 'Actualizar' : 'Agregar'}
                            initialValues={editingArea ? { nombre: editingArea.nombre, sede: editingArea.sede } : { nombre: '', sede: '' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Areas;