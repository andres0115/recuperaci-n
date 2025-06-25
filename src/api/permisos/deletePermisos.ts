import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";

export async function deletePermiso(idPermiso: number): Promise<void> {
  await axiosInstance.delete(`/permisos/${idPermiso}`);
}

export function useDeletePermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
}
