import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Acceso } from "@/types/accesos";

export async function postAcceso(data: Acceso): Promise<Acceso> {
  const response = await axiosInstance.post("/accesos", data);
  return response.data;
}

export function usePostAcceso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAcceso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accesos"] });
    },
  });
} 