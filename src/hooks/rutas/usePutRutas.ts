import { usePutRuta as useApiPutRuta } from "@/api/rutas/putRutas";
import { Ruta } from "@/types/rutas";

export function usePutRuta() {
  const put = useApiPutRuta();
  const actualizarRuta = async (id: number, data: Ruta) => put.mutateAsync({ ...data, id });
  return { actualizarRuta };
}
