import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Ruta } from "@/types/rutas";

export async function getRutas(): Promise<Ruta[]> {
  const response = await axiosInstance.get("/rutas");
  return response.data;
}

export function useGetRutas() {
  return useQuery<Ruta[]>({
    queryKey: ["rutas"],
    queryFn: getRutas,
  });
} 
