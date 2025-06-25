import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Persona } from "@/types/personas"; 


export async function getPersonas(): Promise<Persona[]> {
  const response = await axiosInstance.get("/personas");
  return response.data;
}


export function useGetPersonas() {
  return useQuery({
    queryKey: ["personas"],
    queryFn: getPersonas,
  });
}
