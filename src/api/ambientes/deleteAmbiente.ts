import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";

export async function deleteAmbiente(id: number): Promise<void> {
  if (!id) {
    throw new Error("ID de ambiente no válido");
  }

  try {
    await axiosInstance.delete(`/ambientes/${id}`);
  } catch (error) {
    console.error("Error al eliminar el ambiente:", error);
    throw error;
  }
}

export function useDeleteAmbiente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmbiente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambientes"] });
    },
  });
}
