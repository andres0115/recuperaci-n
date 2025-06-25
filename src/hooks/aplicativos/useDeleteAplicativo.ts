import { useDeleteAplicativo as useApiDeleteAplicativo } from "@/api/aplicativos/deleteAplicativos";

export function useDeleteAplicativo() {
  const del = useApiDeleteAplicativo();
  const eliminarAplicativo = async (id: number) => del.mutateAsync(id);
  return { eliminarAplicativo };
}
