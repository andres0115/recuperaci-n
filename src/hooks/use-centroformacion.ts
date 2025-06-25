// useCentrosFormacion.ts
import {
  createCentroFormacionApi,
  deleteCentroFormacionApi,
  findAllcentrosFormacionApi,
  updateCentroFormacionApi,
} from "@/api/centro-formacion.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCentrosFormacion() {
  const queryClient = useQueryClient();

  // GET
  const {
    data: centros,
    isLoading,
    isError,
    refetch,
  } = useQuery<CentroFormacion[]>({
    queryKey: ["centrosFormacion"],
    queryFn: findAllcentrosFormacionApi,
    select: (data) =>
      data.map((centro) => ({
        ...centro,
        key: centro.id_centro, // agregamos la key ara el datatable
      })),
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createCentroFormacionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centrosFormacion"] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateCentroFormacionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centrosFormacion"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteCentroFormacionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centrosFormacion"] });
    },
  });

  return {
    centros,
    isLoading,
    isError,
    refetch,
    createCentroFormacion: createMutation.mutate,
    updateCentroFormacion: updateMutation.mutate,
    deleteCentroFormacion: deleteMutation.mutate,
    createStatus: createMutation.status,
    updateStatus: updateMutation.status,
    deleteStatus: deleteMutation.status,
  };
}
