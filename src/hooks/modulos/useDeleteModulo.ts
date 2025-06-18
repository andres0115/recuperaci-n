import { useDeleteModulo as useApiDeleteModulo } from "@/api/modulos/deleteModulo";

export function useDeleteModulo() {
  const { mutateAsync: eliminarModulo, isPending: isDeleting } = useApiDeleteModulo();
  return { eliminarModulo, isDeleting };
} 