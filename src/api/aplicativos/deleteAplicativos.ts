import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Aplicativo } from "@/types/aplicativos";

export async function deleteAplicativo(id: number): Promise<void> {
  if (!id) {
    throw new Error('ID de aplicativo no válido');
  }
  
  try {
    await axiosInstance.delete(`/aplicativos/${id}`);
  } catch (error) {
    console.error('Error al eliminar el aplicativo:', error);
    throw error;
  }
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