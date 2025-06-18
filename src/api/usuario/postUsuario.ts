import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Usuario } from "@/types/usuarios";

export async function postUsuario(data: Usuario): Promise<Usuario> {
  const response = await axiosInstance.post("/usuarios", data);
  return response.data;
}

export function usePostUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
