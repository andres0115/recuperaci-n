// /hooks/personas/useDeletePersona.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function eliminarPersona(id: number) {
  const response = await axiosInstance.delete(`/personas/${id}`);
  return response.data;
}

export function useDeletePersonas() {
  return useMutation({
    mutationFn: eliminarPersona,
  });
}
