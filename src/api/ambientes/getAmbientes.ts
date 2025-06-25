import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { GetAmbiente } from "@/types/ambiente"; 

export async function getAmbientes(): Promise<GetAmbiente[]> {
  const response = await axiosInstance.get("/ambientes");
  return response.data;
}

export function useGetAmbientes() {
  return useQuery<GetAmbiente[]>({
    queryKey: ["ambientes"],
    queryFn: getAmbientes,
  });
}
