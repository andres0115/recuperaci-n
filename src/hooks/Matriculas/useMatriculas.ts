import { useState, useEffect } from 'react';
import { Matricula, MatriculaInput, MatriculaWithDetails } from '../../types/matricula';
import { getAllMatriculas, createMatricula, updateMatricula as updateMatriculaService, deleteMatricula as deleteMatriculaService } from '../../services/matriculaService';

export const useMatriculas = () => {
  const [matriculas, setMatriculas] = useState<MatriculaWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const data = await getAllMatriculas();
        // Convertir Matricula[] a MatriculaWithDetails[] y agregar key
        const matriculasWithDetails: MatriculaWithDetails[] = data.map(matricula => ({
          ...matricula,
          key: matricula.id_matricula,
          curso: undefined // Por ahora no tenemos los detalles del curso
        }));
        setMatriculas(matriculasWithDetails);
      } catch (err) {
        setError('Error al cargar las matrículas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatriculas();
  }, []);

  const addMatricula = async (newMatricula: MatriculaInput) => {
    setLoading(true);
    try {
      const addedMatricula = await createMatricula(newMatricula);
      const matriculaWithDetails: MatriculaWithDetails = {
        ...addedMatricula,
        key: addedMatricula.id_matricula,
        curso: undefined
      };
      setMatriculas((prev) => [...prev, matriculaWithDetails]);
      return matriculaWithDetails;
    } catch (err) {
      setError('Error al agregar la matrícula');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMatricula = async (updatedMatricula: Matricula): Promise<MatriculaWithDetails> => {
    setLoading(true);
    try {
      const matricula = await updateMatriculaService(updatedMatricula);
      const matriculaWithDetails: MatriculaWithDetails = {
        ...matricula,
        key: matricula.id_matricula,
        curso: undefined
      };
      setMatriculas((prev) =>
        prev.map((m) => (m.id_matricula === matricula.id_matricula ? matriculaWithDetails : m))
      );
      return matriculaWithDetails;
    } catch (err) {
      setError('Error al actualizar la matrícula');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMatricula = async (id: number) => {
    setLoading(true);
    try {
      await deleteMatriculaService(id);
      setMatriculas(prev => prev.filter(m => m.id_matricula !== id));
    } catch (err) {
      setError('Error al eliminar la matrícula');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    matriculas,
    loading,
    error,
    addMatricula,
    updateMatricula,
    deleteMatricula
  };
}; 