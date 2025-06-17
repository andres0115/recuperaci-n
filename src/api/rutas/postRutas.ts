import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Ruta } from "@/types/rutas";

export async function postRuta(data: Ruta): Promise<Ruta> {
  const response = await axiosInstance.post("/rutas", data);
  return response.data;
}

export function usePostRuta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRuta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rutas"] });
    },
  });
}
