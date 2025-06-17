import { usePutModulo as useApiPutModulo } from "@/api/modulos/putModulo";
import { Modulo } from "@/types/modulos";

export function usePutModulo() {
  const put = useApiPutModulo();
  const actualizarModulo = async (id: number, data: Partial<Modulo>) => put.mutateAsync({ ...data, id });
  return { actualizarModulo };
}
