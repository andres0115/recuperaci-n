import { useDeletePermiso as useApiDeletePermiso } from '@/api/permisos/deletePermisos';

export function useDeletePermiso() {
  const deletePermiso = useApiDeletePermiso();
  const eliminarPermiso = async (id: number) => deletePermiso.mutateAsync(id);
  return { eliminarPermiso };
}
