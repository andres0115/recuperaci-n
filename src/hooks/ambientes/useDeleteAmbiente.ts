import { useDeleteAmbiente as useApiDeleteAmbiente } from "@/api/ambientes/deleteAmbiente";

export function useDeleteAmbiente() {
  const { mutateAsync: eliminarAmbiente, isPending: isDeleting } = useApiDeleteAmbiente();
  return { eliminarAmbiente, isDeleting };
}
