import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Usuario } from "@/types/usuarios";

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await axiosInstance.get("/usuarios");
  return response.data;
}

export function useGetUsuarios() {
  return useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });
}
