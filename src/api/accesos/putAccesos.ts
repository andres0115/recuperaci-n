import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Acceso } from "@/types/accesos";

export async function putAcceso(data: Partial<Acceso> & { id: number }): Promise<Acceso> {
  const response = await axiosInstance.put(`/accesos/${data.id}`, data);
  return response.data;
}

export function usePutAcceso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putAcceso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accesos"] });
    },
  });
} 