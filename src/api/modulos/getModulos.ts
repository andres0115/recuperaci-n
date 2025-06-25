import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Modulo } from "@/types/modulos";

export async function getModulos(): Promise<Modulo[]> {
  const response = await axiosInstance.get("/modulos");
  return response.data;
}

export function useGetModulos() {
  return useQuery<Modulo[]>({
    queryKey: ["modulos"],
    queryFn: getModulos,
  });
} 
