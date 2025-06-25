// Agregamos base para disponer la propiedad key
type CentroFormacion = {
    id_centro: number;
    nombre: string;
} & Base;

// Modelo para Crear y Editar Centro de Formacion
type SaveCentroFormacion = {
    id_centro?: number;
    nombre: string;
};
