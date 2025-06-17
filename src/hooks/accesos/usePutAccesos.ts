import { usePutAcceso as useApiPutAcceso } from "@/api/accesos/putAccesos";
import { Acceso } from "@/types/accesos";

export function usePutAcceso() {
  const put = useApiPutAcceso();
  const actualizarAcceso = async (id: number, data: Acceso) => put.mutateAsync({ ...data, id });
  return { actualizarAcceso };
}
