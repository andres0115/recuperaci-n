import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Modulo } from "@/types/modulos";

export async function postModulo(data: Modulo): Promise<Modulo> {
  const response = await axiosInstance.post("/modulos", data);
  return response.data;
}

export function usePostModulo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
    },
  });
} 