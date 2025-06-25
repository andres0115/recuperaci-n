import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { GetAmbiente } from "@/types/ambiente"; 

export async function putAmbiente(
  data: Partial<GetAmbiente> & { id_ambiente: number }
): Promise<GetAmbiente> {
  const response = await axiosInstance.put(`/ambientes/${data.id_ambiente}`, data);
  return response.data;
}

export function usePutAmbiente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putAmbiente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambientes"] });
    },
  });
}
