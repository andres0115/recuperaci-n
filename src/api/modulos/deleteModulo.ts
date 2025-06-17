import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";

export async function deleteModulo(id: number): Promise<void> {
  if (!id) {
    throw new Error('ID de módulo no válido');
  }
  
  try {
    await axiosInstance.delete(`/modulos/${id}`);
  } catch (error) {
    console.error('Error al eliminar el módulo:', error);
    throw error;
  }
}

export function useDeleteModulo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
    },
  });
} 