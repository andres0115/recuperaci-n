import Boton from '@/components/atomos/Boton';
import GlobalTable, { Column } from '@/components/organismos/Table';
import React from 'react';


interface CentroFormacionListProps {
  onEdit?: (item: CentroFormacion) => void;
  onDelete?: (item: CentroFormacion) => void;
  centros: CentroFormacion[];
}

const CentroFormacionList: React.FC<CentroFormacionListProps> = ({ onEdit, onDelete, centros }) => {
  const columns: Column<CentroFormacion>[] = [
    { key: 'id_centro', label: 'ID', sortable: true, filterable: true },
    { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
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
        <GlobalTable
  columns={columns}
  data={centros.map(c => ({ ...c, key: c.id_centro }))}
  rowsPerPage={5}
  defaultSortColumn="id_centro"
/>

    );
};

export default CentroFormacionList;
