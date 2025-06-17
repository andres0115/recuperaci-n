import { usePostRol as useApiPostRol } from "@/api/rol/postRol";
import { Rol } from "@/types/roles";

export function usePostRol() {
  const post = useApiPostRol();
  const crearRol = async (data: Rol) => post.mutateAsync(data);
  return { crearRol };
}
