import { useDeleteRol as useApiDeleteRol } from "@/api/rol/deleteRol";

export function useDeleteRol() {
  const { mutateAsync: eliminarRol, isPending: isDeleting } = useApiDeleteRol();
  return { eliminarRol, isDeleting };
} 