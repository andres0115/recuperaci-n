import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Modulo } from "@/types/modulos";

export async function putModulo(data: Partial<Modulo> & { id: number }): Promise<Modulo> {
  const response = await axiosInstance.put(`/modulos/${data.id}`, data);
  return response.data;
}

export function usePutModulo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
    },
  });
} 