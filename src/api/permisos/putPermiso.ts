import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { permisos } from "@/types/permisos";

export async function putPermiso(data: Partial<permisos> & { id: number }): Promise<permisos> {
  const response = await axiosInstance.put(`/permisos/${data.id}`, data);
  return response.data;
}

export function usePutPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
} 