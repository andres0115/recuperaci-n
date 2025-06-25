import React, {useState} from "react";
import Header from "../organismos/Header";
import Sidebar from "../organismos/Sidebar";
import GlobalTable from "../organismos/Table";
import { Programa } from "../../types/programa";
import Boton from "../atomos/Boton";
import { X } from "lucide-react";
import Form from "../organismos/Form";

interface ProgramasProps {
    userName?: string;
}

const Programas: React.FC<ProgramasProps> = ({ userName }) => {
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPrograma, setEditingPrograma] = useState<Programa | null>(null);
    // Ya no necesitamos formData ni setFormData, lo maneja el Form global
// esto es para editar
    const handleEdit = (programa: Programa) => {
        setEditingPrograma(programa);
        setShowModal(true);
    };
// esto es para eliminar
    const handleDelete = (programa: Programa) => {
        const confirmDelete = window.confirm('¿Está seguro de eliminar este programa?');
        if (confirmDelete) {
            setProgramas(programas.filter(p => p.key !== programa.key));
        }
    };

    // Nuevo handleSubmit que recibe los valores del Form global
    const handleSubmit = (values: { nombre: string; tipo: string }) => {
        const newKey = programas.length > 0 
            ? Math.max(...programas.map(p => typeof p.key === 'number' ? p.key : 0)) + 1
            : 1;

        const newPrograma: Programa = {
            key: editingPrograma ? editingPrograma.key : newKey,
            id_programa: editingPrograma ? editingPrograma.id_programa : newKey,
            nombre: values.nombre,
            tipo: Number(values.tipo)
        };

        if (editingPrograma) {
            setProgramas(programas.map(p => p.key === editingPrograma.key ? newPrograma : p));
        } else {
            setProgramas([...programas, newPrograma]);
        }

        setEditingPrograma(null);
        setShowModal(false);
    };

    const handleCreate = () => {
        setEditingPrograma(null);
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-gray-900">
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
                        columns={[
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
                            fields={[
                                { key: 'nombre', label: 'Nombre', type: 'text', required: true },
                                { key: 'tipo', label: 'Tipo', type: 'text', required: true }
                            ]}
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