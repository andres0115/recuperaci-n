import { Usuario } from './usuarios';
import { Rol } from './roles';
import { Ruta } from './rutas';

export type permisos = {
    id_permiso: number;
    usuario: number | Usuario | { id_usuario: number; idUsuario: number; login: string; [key: string]: any };
    rol: number | Rol | { id_rol: number; idRol: number; nombre: string; [key: string]: any };
    ruta: number | Ruta | { id_ruta: number; idRuta: number; nombre: string; [key: string]: any };
}
