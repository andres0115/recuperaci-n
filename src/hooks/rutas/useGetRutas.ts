import { useGetRutas as useApiGetRutas } from "@/api/rutas/getRutas";

export function useGetRutas() {
  const { data: rutas = [], isLoading: loading } = useApiGetRutas();
  return { rutas, loading };
}
