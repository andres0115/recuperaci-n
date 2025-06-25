export interface Persona {
  id_persona: number;
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
  genero: string;
  municipio: number | null;
  cargo: string;
  estado: boolean;
}