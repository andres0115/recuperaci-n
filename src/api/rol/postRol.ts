import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Rol } from "@/types/roles";

export async function postRol(data: Rol): Promise<Rol> {
  const response = await axiosInstance.post("/roles", data);
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
