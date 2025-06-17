import { usePostPermiso as useApiPostPermiso } from "@/api/permisos/postPermiso";
import { permisos } from "@/types/permisos";

export function usePostPermiso() {
  const post = useApiPostPermiso();
  const crearPermiso = async (data: permisos) => post.mutateAsync(data);
  return { crearPermiso };
}
