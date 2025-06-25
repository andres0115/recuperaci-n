import { Matricula, MatriculaInput } from '../types/matricula';
import { API_CONFIG, MOCK_API_CONFIG } from '../config/api.config';
import { api } from './api.service';

// Datos de ejemplo para simular la API
const mockMatriculas: Matricula[] = [
  {
    id_matricula: 1,
    persona: 1,
    curso: 1
  },
  {
    id_matricula: 2,
    persona: 2,
    curso: 2
  }
];

// Simular un retraso de API
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para manejar respuestas mock
const handleMockResponse = async <T>(data: T): Promise<T> => {
  await simulateDelay(MOCK_API_CONFIG.delay);
  return data;
};

export const getAllMatriculas = async (): Promise<Matricula[]> => {
  if (MOCK_API_CONFIG.enabled) {
    return handleMockResponse(mockMatriculas);
  }
  return api.get<Matricula[]>(API_CONFIG.endpoints.matriculas.getAll);
};

export const getMatriculaById = async (id: number): Promise<Matricula | undefined> => {
  if (MOCK_API_CONFIG.enabled) {
    const matricula = mockMatriculas.find(m => m.id_matricula === id);
    return handleMockResponse(matricula);
  }
  return api.get<Matricula>(API_CONFIG.endpoints.matriculas.getById(id));
};

export const createMatricula = async (matricula: MatriculaInput): Promise<Matricula> => {
  if (MOCK_API_CONFIG.enabled) {
    const newId = mockMatriculas.length > 0 ? Math.max(...mockMatriculas.map(m => m.id_matricula)) + 1 : 1;
    const newMatricula: Matricula = {
      ...matricula,
      id_matricula: newId
    };
    mockMatriculas.push(newMatricula);
    return handleMockResponse(newMatricula);
  }
  return api.post<Matricula>(API_CONFIG.endpoints.matriculas.create, matricula);
};

export const updateMatricula = async (matricula: Matricula): Promise<Matricula> => {
  if (MOCK_API_CONFIG.enabled) {
    const index = mockMatriculas.findIndex(m => m.id_matricula === matricula.id_matricula);
    if (index === -1) throw new Error('Matrícula no encontrada');
    
    mockMatriculas[index] = matricula;
    return handleMockResponse(matricula);
  }
  return api.put<Matricula>(API_CONFIG.endpoints.matriculas.update(matricula.id_matricula), matricula);
};

export const deleteMatricula = async (id: number): Promise<void> => {
  if (MOCK_API_CONFIG.enabled) {
    const index = mockMatriculas.findIndex(m => m.id_matricula === id);
    if (index === -1) throw new Error('Matrícula no encontrada');
    mockMatriculas.splice(index, 1);
    return handleMockResponse(undefined);
  }
  return api.delete(API_CONFIG.endpoints.matriculas.delete(id));
}; 