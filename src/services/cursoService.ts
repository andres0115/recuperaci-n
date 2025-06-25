import { Curso, CursoInput } from '../types/curso';
import { API_CONFIG, MOCK_API_CONFIG } from '../config/api.config';
import { api } from './api.service';

// Datos de ejemplo para simular la API
const mockCursos: Curso[] = [
  {
    id_curso: 1,
    codigo: 101,
    fecha_inicio: '2024-01-01',
    fecha_fin: '2024-06-30',
    fin_lectiva: '2024-05-15',
    area: 1,
    programa: 1,
    lider: 1
  },
  {
    id_curso: 2,
    codigo: 102,
    fecha_inicio: '2024-02-01',
    fecha_fin: '2024-07-31',
    fin_lectiva: '2024-06-15',
    area: 2,
    programa: 2,
    lider: 2
  }
];

// Simular un retraso de API
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para manejar respuestas mock
const handleMockResponse = async <T>(data: T): Promise<T> => {
  await simulateDelay(MOCK_API_CONFIG.delay);
  return data;
};

export const getAllCursos = async (): Promise<Curso[]> => {
  if (MOCK_API_CONFIG.enabled) {
    return handleMockResponse(mockCursos);
  }
  return api.get<Curso[]>(API_CONFIG.endpoints.cursos.getAll);
};

export const getCursoById = async (id: number): Promise<Curso | undefined> => {
  if (MOCK_API_CONFIG.enabled) {
    const curso = mockCursos.find(c => c.id_curso === id);
    return handleMockResponse(curso);
  }
  return api.get<Curso>(API_CONFIG.endpoints.cursos.getById(id));
};

export const createCurso = async (curso: CursoInput): Promise<Curso> => {
  if (MOCK_API_CONFIG.enabled) {
    const newId = Math.max(...mockCursos.map(c => c.id_curso)) + 1;
    const newCurso: Curso = {
      ...curso,
      id_curso: newId
    };
    mockCursos.push(newCurso);
    return handleMockResponse(newCurso);
  }
  return api.post<Curso>(API_CONFIG.endpoints.cursos.create, curso);
};

export const updateCurso = async (curso: Curso): Promise<Curso> => {
  if (MOCK_API_CONFIG.enabled) {
    const index = mockCursos.findIndex(c => c.id_curso === curso.id_curso);
    if (index === -1) throw new Error('Curso no encontrado');
    mockCursos[index] = curso;
    return handleMockResponse(curso);
  }
  return api.put<Curso>(API_CONFIG.endpoints.cursos.update(curso.id_curso), curso);
};

export const deleteCurso = async (id: number): Promise<void> => {
  if (MOCK_API_CONFIG.enabled) {
    const index = mockCursos.findIndex(c => c.id_curso === id);
    if (index === -1) throw new Error('Curso no encontrado');
    mockCursos.splice(index, 1);
    return handleMockResponse(undefined);
  }
  return api.delete(API_CONFIG.endpoints.cursos.delete(id));
}; 