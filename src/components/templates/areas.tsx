import React, {useState} from "react";
import Header from "../organismos/Header";
import Sidebar from "../organismos/Sidebar";
import GlobalTable from "../organismos/Table";
import { Area } from "../../types/area";
import Boton from "../atomos/Boton";
import { X } from "lucide-react";
import Form from "../organismos/Form";

interface AreasProps {
    userName?: string;
}

const Areas: React.FC<AreasProps> = ({ userName }) => {
    const [Areas, setAreas] = useState<Area[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingArea, setEditingArea] = useState<Area | null>(null);
    // Ya no necesitamos formData ni setFormData, lo maneja el Form global

    const handleEdit = (Area: Area) => {
        setEditingArea(Area);
        setShowModal(true);
    };

    const handleDelete = (Area: Area) => {
        const confirmDelete = window.confirm('¿Está seguro de eliminar este Area?');
        if (confirmDelete) {
            setAreas(Areas.filter(p => p.key !== Area.key));
        }
    };

    const handleSubmit = (values: { nombre: string; sede: string }) => {
        const newKey = Areas.length > 0 
            ? Math.max(...Areas.map(p => typeof p.key === 'number' ? p.key : 0)) + 1
            : 1; 

        const newArea: Area = {
            key: editingArea ? editingArea.key : newKey,
            id_area: editingArea ? editingArea.id_area : newKey,
            nombre: values.nombre,
            sede: String(values.sede)
        };

        if (editingArea) {
            setAreas(Areas.map(p => p.key ===  editingArea.key ? newArea : p));
        } else {
            setAreas([...Areas, newArea]);
        }

        setEditingArea(null);
        setShowModal(false);
    };

    const handleCreate = () => {
        setEditingArea(null);
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Areas</h1>
                        <Boton color="primary" onClick={handleCreate}>Crear Area</Boton>
                    </div>
                    <GlobalTable
                        data={Areas}
                        columns={[
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
                            fields={[
                                { key: 'nombre', label: 'Nombre', type: 'text', required: true },
                                { key: 'sede', label: 'Sede', type: 'text', required: true },
                                { key: 'sede', label: 'Sede', type: 'select', required: true, options: [] }
                            ]}
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