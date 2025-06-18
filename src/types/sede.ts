// Modelo principal de sede- Lista
type Sede = {
    id_sede: number;
    nombre: string;
    centroFormacionNombre: string;
    centro_formacion_id?: number;
} & Base;

// Modelo para Crear y Editar Sede
type SaveSede = {
    id_sede?: number;
    nombre: string;
    centro_formacion_id: number;
};