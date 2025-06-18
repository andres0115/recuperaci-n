export interface Curso {
  key?: React.Key;
  id_curso: number;
  codigo: number;
  fecha_inicio: string;
  fecha_fin: string;
  fin_lectiva: string;
  area: number;
  programa: number;
  lider: number;
}

export type CursoInput = Omit<Curso, 'id_curso' | 'key'>;

export interface CursoResponse {
  success: boolean;
  data?: Curso;
  error?: string;
}

export interface CursosResponse {
  success: boolean;
  data?: Curso[];
  error?: string;
} 