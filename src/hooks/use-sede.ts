// useSede.ts
import { createSedeApi, deleteSedeApi, findAllSedesApi, updateSedeApi } from "@/api/sede.api";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export function useSedes() {
  const queryClient = useQueryClient();

  // GET
  const { data: sedes, isLoading, isError, refetch } = useQuery<Sede[]>({
    queryKey: ["sede"],
    queryFn: findAllSedesApi,
     select: (data) =>
      data.map((centro) => ({
        ...centro,
        key: centro.id_sede, // agregamos la key ara el datatable
      })),
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createSedeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sede"] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateSedeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sede"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteSedeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sede"] });
    },
  });

  return {
    sedes,
    isLoading,
    isError,
    refetch,
    createSede: createMutation.mutate,
    updateSede: updateMutation.mutate,
    deleteSede: deleteMutation.mutate,
    createStatus: createMutation.status,
    updateStatus: updateMutation.status,
    deleteStatus: deleteMutation.status,
  };
}
