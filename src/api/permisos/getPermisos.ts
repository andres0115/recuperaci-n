import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { permisos } from "@/types/permisos";

export async function getPermisos(): Promise<permisos[]> {
  const response = await axiosInstance.get("/permisos");
  return response.data;
}

export function useGetPermisos() {
  return useQuery<permisos[]>({
    queryKey: ["permisos"],
    queryFn: getPermisos,
  });
}
