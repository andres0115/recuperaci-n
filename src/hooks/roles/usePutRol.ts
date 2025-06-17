import { usePutRol as useApiPutRol } from "@/api/rol/putRol";
import { Rol } from "@/types/roles";

export function usePutRol() {
  const put = useApiPutRol();
  const actualizarRol = async (id: number, data: Partial<Rol>) => put.mutateAsync({ id, ...data });
  return { actualizarRol };
}
