import Boton from '@/components/atomos/Boton';
import GlobalTable, { Column } from '@/components/organismos/Table';
import React from 'react';

interface SedesListProps {
    onEdit?: (item: Sede) => void;
    onDelete?: (item: Sede) => void;
    sedes: Sede[];
}
const SedesList: React.FC<SedesListProps> = ({ onEdit, onDelete , sedes}) => {
    const columns: Column<Sede>[] = [
        { key: 'id_sede', label: 'ID', sortable: true, filterable: true },
        { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
        { key: 'centroFormacionNombre', label: 'Centro', sortable: true, filterable: true },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (item) => (
                <div className="flex space-x-2">
                    <Boton color="primary" size="sm" onClick={() => onEdit?.(item)}>Editar</Boton>
                    <Boton color="danger" size="sm" onClick={() => onDelete?.(item)}>Eliminar</Boton>
                </div>
            )
        }
    ];

    return (
        <div className="p-4">
            <GlobalTable
                columns={columns}
                data={sedes}
                rowsPerPage={5}
                defaultSortColumn="id_sede"
                defaultSortDirection="asc"
            />
        </div>
    );
};

export default SedesList;
