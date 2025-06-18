import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Aplicativo } from "@/types/aplicativos";

export async function getAplicativos(): Promise<Aplicativo[]> {
  const response = await axiosInstance.get("/aplicativos");
  return response.data;
}

export function useGetAplicativos() {
  return useQuery<Aplicativo[]>({
    queryKey: ["aplicativos"],
    queryFn: getAplicativos,
  });   
} 
