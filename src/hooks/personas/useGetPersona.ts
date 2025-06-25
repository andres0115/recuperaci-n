import { useCallback, useState } from 'react';
import { useGetPersonas as useApiGetPersonas } from '@/api/personas/getPersona'; 
export function useGetPersonas() {
  const { data: personas = [], isLoading: loading, refetch } = useApiGetPersonas();
  const [error, setError] = useState<string | null>(null);

  const fetchPersonas = useCallback(async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError('Error al cargar las personas');
    }
  }, [refetch]);

  return {
    personas,
    loading,
    error,
    fetchPersonas,
  };
}
