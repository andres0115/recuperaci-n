import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";

export async function deleteAplicativo(idAplicativo: number): Promise<void> {
  await axiosInstance.delete(`/aplicativos/${idAplicativo}`);
}

export function useDeleteAplicativo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAplicativo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
    },
  });
}
