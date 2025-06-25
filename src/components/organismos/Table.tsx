import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";

// Exportamos Column como exportación con nombre
export type Column<T> = {
  key: keyof T | "acciones";
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
};

type Props<T> = {
  columns: Column<T>[];
  defaultFilterableColumns?: boolean;
  data: T[];
  rowsPerPage?: number;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  idColumnKey?: string;
};

type SortDirection = 'asc' | 'desc' | null;

const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];

// Definimos el componente GlobalTable
const GlobalTable = <T,>({ 
  columns, 
  data, 
  rowsPerPage: initialRowsPerPage = 10,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  idColumnKey
}: Props<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [filterValue, setFilterValue] = useState("");
  const [pagedData, setPagedData] = useState<T[]>([]);
  
  const sortData = (data: T[], column: keyof T, direction: SortDirection): T[] => {
    if (!column || !direction) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const filterData = (data: T[], value: string): T[] => {
    if (!value) return data;
    const searchValue = value.toLowerCase();
    return data.filter(item => 
      columns.some(column => {
        if (column.key === 'acciones' || !column.filterable) return false;
        const val = item[column.key as keyof T];
        if (val === undefined) return false;
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val)) {
          const date = new Date(val);
          const formatted = format(date, 'dd/MM/yyyy');
          return val.toLowerCase().includes(searchValue) || formatted.includes(searchValue);
        }
        return String(val).toLowerCase().includes(searchValue);
      })
    );
  };

  const processedData = useMemo(() => {
    let result = [...data];
    
    result = filterData(result, filterValue);
    
    if (sortColumn && sortDirection) {
      result = sortData(result, sortColumn, sortDirection);
    }
    
    return result;
  }, [data, filterValue, sortColumn, sortDirection]);

  const pages = Math.ceil(processedData.length / rowsPerPage);

  useEffect(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setPagedData(processedData.slice(start, end));
  }, [page, processedData, rowsPerPage]);

  const handleSortChange = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full bg-white text-gray-800">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Registros</span>
          <select
            className="w-20 bg-white text-gray-800 border border-gray-200 rounded px-2 py-1"
            value={String(rowsPerPage)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRowsPerPage(Number(e.target.value))}
            aria-label="Filas por página"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {String(option)}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">por página</span>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</span>
            <input
              className="w-full pl-10 py-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
              placeholder="Buscar..."
              value={filterValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="min-h-[222px] rounded-lg shadow-sm bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
              {columns.map((col) => (
                <th 
                  key={String(col.key)}
                  className={`px-4 py-3 text-left ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => col.sortable && handleSortChange(col.key as keyof T)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortColumn === col.key && (
                      sortDirection === 'asc' ? 
                        <span className="text-xs">▲</span> : 
                        <span className="text-xs">▼</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.length > 0 ? (
              pagedData.map((item) => {
                // Usar idColumnKey si está definido, de lo contrario generar una clave única
                const rowKey = idColumnKey && item[idColumnKey as keyof T] ? 
                  String(item[idColumnKey as keyof T]) : 
                  Math.random().toString(36).substring(2, 9);
                  
                return (
                <tr key={rowKey} className="hover:bg-blue-50 border-b border-gray-200">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {col.render ? col.render(item) :
                        (() => {
                          const value = item[col.key as keyof T];
                          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value)) {
                            const date = new Date(value);
                            return format(date, 'dd/MM/yyyy');
                          }
                          if (typeof value === 'object' && value !== null) {
                            return JSON.stringify(value);
                          }
                          return value !== undefined && value !== null ? String(value) : '';
                        })()
                      }
                    </td>
                  ))}
                </tr>
              );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-600">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 mt-2 rounded-b-lg">
        <div className="text-sm text-gray-600">
          Mostrando {processedData.length > 0 ? ((page - 1) * rowsPerPage) + 1 : 0} a {Math.min(page * rowsPerPage, processedData.length)} de {processedData.length} registros
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
          >
            &lt;
          </button>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            // Mostrar páginas alrededor de la página actual
            let pageToShow;
            if (pages <= 5) {
              pageToShow = i + 1;
            } else if (page <= 3) {
              pageToShow = i + 1;
            } else if (page >= pages - 2) {
              pageToShow = pages - 4 + i;
            } else {
              pageToShow = page - 2 + i;
            }
            
            return (
              <button
                key={pageToShow}
                onClick={() => setPage(pageToShow)}
                className={`px-3 py-1 rounded ${page === pageToShow ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
              >
                {pageToShow}
              </button>
            );
          })}
          <button 
            onClick={() => setPage(p => Math.min(pages, p + 1))} 
            disabled={page === pages || pages === 0}
            className={`px-3 py-1 rounded ${page === pages || pages === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

// Exportamos GlobalTable como exportación por defecto
export default GlobalTable;