import { usePutAplicativo as useApiPutAplicativo } from "@/api/aplicativos/putAplicativos";
import { Aplicativo } from "@/types/aplicativos";

export function usePutAplicativo() {
  const put = useApiPutAplicativo();
  const actualizarAplicativo = async (id: number, data: Partial<Aplicativo>) => put.mutateAsync({ id, ...data });
  return { actualizarAplicativo };
}
