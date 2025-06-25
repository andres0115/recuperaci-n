import { usePostAmbiente as useApiPostAmbiente } from "@/api/ambientes/postAmbiente";

export function usePostAmbiente() {
  const { mutateAsync: crearAmbiente, isPending: isCreating } = useApiPostAmbiente();
  return { crearAmbiente, isCreating };
}
