import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Ruta } from "@/types/rutas";

export async function putRuta(data: Partial<Ruta> & { id: number }): Promise<Ruta> {
  const response = await axiosInstance.put(`/rutas/${data.id}`, data);
  return response.data;
}

export function usePutRuta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putRuta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rutas"] });
    },
  });
}
