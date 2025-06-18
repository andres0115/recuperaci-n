
interface Sede {
    key: number;
    id: number;
    nombre: string;
    centroFormacionNombre: string;
    centroFormacionId?: number;
}


interface SaveSede {
    id?: number;
    nombre: string;
    centroFormacionId: number;
}