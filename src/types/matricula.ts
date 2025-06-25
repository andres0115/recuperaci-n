import { Curso } from './curso';

export interface Matricula {
  key?: React.Key;
  id_matricula: number;
  persona: number;
  curso: number;
}

export type MatriculaInput = Omit<Matricula, 'id_matricula' | 'key'>;

export interface MatriculaResponse {
  success: boolean;
  data?: Matricula;
  error?: string;
}

export interface MatriculasResponse {
  success: boolean;
  data?: Matricula[];
  error?: string;
}

// Tipos para la relación con otras entidades
export interface MatriculaWithDetails extends Omit<Matricula, 'curso'> {
  curso?: Curso;
}

export interface MatriculasWithDetailsResponse {
  success: boolean;
  data?: MatriculaWithDetails[];
  error?: string;
} 