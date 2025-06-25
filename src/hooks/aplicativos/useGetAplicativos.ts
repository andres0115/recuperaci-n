import { useGetAplicativos as useApiGetAplicativos } from "@/api/aplicativos/getAplicativos";

export function useGetAplicativos() {
  const { data: aplicativos = [], isLoading: loading } = useApiGetAplicativos();
  return { aplicativos, loading };
  
}
