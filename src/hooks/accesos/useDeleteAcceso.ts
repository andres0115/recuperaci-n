import { useDeleteAcceso as useApiDeleteAcceso } from '@/api/accesos/deleteAccesos';

export function useDeleteAcceso() {
  const deleteAcceso = useApiDeleteAcceso();
  const eliminarAcceso = async (id: number) => deleteAcceso.mutateAsync(id);
  return { eliminarAcceso };
}
