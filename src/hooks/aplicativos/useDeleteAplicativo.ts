import { useDeleteAplicativo as useApiDeleteAplicativo } from "@/api/aplicativos/deleteAplicativos";

export function useDeleteAplicativo() {
  const { mutateAsync: eliminarAplicativo, isPending: isDeleting } = useApiDeleteAplicativo();
  return { eliminarAplicativo, isDeleting };
  
} 
