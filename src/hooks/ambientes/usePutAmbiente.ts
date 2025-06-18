import { usePutAmbiente as useApiPutAmbiente } from "@/api/ambientes/putAmbiente";

export function usePutAmbiente() {
  const { mutateAsync: actualizarAmbiente, isPending: isUpdating } = useApiPutAmbiente();
  return { actualizarAmbiente, isUpdating };
}
