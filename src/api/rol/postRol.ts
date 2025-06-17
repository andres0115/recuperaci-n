import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Rol } from "@/types/roles";

export async function postRol(data: Rol): Promise<Rol> {
  // Transformar los datos al formato que espera TypeORM para relaciones
  const payload = {
    nombre: data.nombre,
    aplicativo: { idAplicativo: data.aplicativo }
  };

  console.log('Enviando datos al servidor:', payload);
  const response = await axiosInstance.post("/roles", payload);
  return response.data;
}

export function usePostRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
