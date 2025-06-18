import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";

export async function deleteRol(id: number): Promise<void> {
  if (!id) {
    throw new Error('ID de rol no válido');
  }
  
  try {
    await axiosInstance.delete(`/roles/${id}`);
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    throw error;
  }
}

export function useDeleteRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
} 