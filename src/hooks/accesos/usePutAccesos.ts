import { usePutAcceso as useApiPutAcceso } from "@/api/accesos/putAccesos";
import { Acceso } from "@/types/accesos";

export function usePutAcceso() {
  const put = useApiPutAcceso();
  const actualizarAcceso = async (idAcceso: number, data: Partial<Acceso>) => put.mutateAsync({ ...data, idAcceso });
  return { actualizarAcceso };
}
