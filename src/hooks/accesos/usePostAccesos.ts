import { usePostAcceso as useApiPostAcceso } from "@/api/accesos/postAccesos";
import { Acceso } from "@/types/accesos";

export function usePostAcceso() {
  const post = useApiPostAcceso();
  const crearAcceso = async (data: Acceso) => post.mutateAsync(data);
  return { crearAcceso };
}
