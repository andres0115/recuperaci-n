import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { permisos } from "@/types/permisos";

export async function postPermiso(data: permisos): Promise<permisos> {
  const response = await axiosInstance.post("/permisos", data);
  return response.data;
}

export function usePostPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
} 