import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";

export async function deleteAcceso(idAcceso: number): Promise<void> {
  await axiosInstance.delete(`/accesos/${idAcceso}`);
}

export function useDeleteAcceso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAcceso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accesos"] });
    },
  });
}
