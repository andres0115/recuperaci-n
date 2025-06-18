import { useGetAccesos as useApiGetAccesos } from "@/api/accesos/getAccesos";

export function useGetAccesos() {
  const { data: accesos = [], isLoading: loading } = useApiGetAccesos();
  return { accesos, loading };
} 
