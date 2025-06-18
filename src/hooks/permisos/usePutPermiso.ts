import { usePutPermiso as useApiPutPermiso } from "@/api/permisos/putPermiso";
import { permisos } from "@/types/permisos";

export function usePutPermiso() {
  const put = useApiPutPermiso();
  const actualizarPermiso = async (id: number, data: permisos) => put.mutateAsync({ ...data, id });
  return { actualizarPermiso };
}
