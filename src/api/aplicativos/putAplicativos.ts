import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Aplicativo } from "@/types/aplicativos";

export async function putAplicativo(data: Partial<Aplicativo> & { id: number }): Promise<Aplicativo> {
  const response = await axiosInstance.put(`/aplicativos/${data.id}`, data);
  return response.data;
}

export function usePutAplicativo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putAplicativo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
    },
  });
} 