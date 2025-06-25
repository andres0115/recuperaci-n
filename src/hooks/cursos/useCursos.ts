import { useState, useEffect } from 'react';
import { Curso, CursoInput } from '../../types/curso';
import { getAllCursos, createCurso, updateCurso as updateCursoService, deleteCurso as deleteCursoService } from '../../services/cursoService';

export const useCursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getAllCursos();
        const cursosWithKey = data.map(curso => ({
          ...curso,
          key: curso.id_curso
        }));
        setCursos(cursosWithKey);
      } catch (err) {
        setError('Error al cargar los cursos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const addCurso = async (newCurso: CursoInput) => {
    setLoading(true);
    try {
      const addedCurso = await createCurso(newCurso);
      const cursoWithKey = {
        ...addedCurso,
        key: addedCurso.id_curso
      };
      setCursos((prev) => [...prev, cursoWithKey]);
      return cursoWithKey;
    } catch (err) {
      setError('Error al agregar el curso');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCurso = async (updatedCurso: Curso): Promise<Curso> => {
    setLoading(true);
    try {
      const curso = await updateCursoService(updatedCurso);
      const cursoWithKey = {
        ...curso,
        key: curso.id_curso
      };
      setCursos((prev) =>
        prev.map((c) => (c.id_curso === curso.id_curso ? cursoWithKey : c))
      );
      return cursoWithKey;
    } catch (err) {
      setError('Error al actualizar el curso');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCurso = async (id: number) => {
    setLoading(true);
    try {
      await deleteCursoService(id);
      setCursos(prev => prev.filter(c => c.id_curso !== id));
    } catch (err) {
      setError('Error al eliminar el curso');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cursos,
    loading,
    error,
    addCurso,
    updateCurso,
    deleteCurso
  };
}; 