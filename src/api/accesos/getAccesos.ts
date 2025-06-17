import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Acceso } from "@/types/accesos";

export async function getAccesos(): Promise<Acceso[]> {
  const response = await axiosInstance.get("/accesos");
  return response.data;
}

export function useGetAccesos() {
  return useQuery<Acceso[]>({
    queryKey: ["accesos"],
    queryFn: getAccesos,
  });
} 
