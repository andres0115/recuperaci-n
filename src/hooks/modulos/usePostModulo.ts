import { usePostModulo as useApiPostModulo } from "@/api/modulos/postModulo";
import { Modulo } from "@/types/modulos";

export function usePostModulo() {
  const post = useApiPostModulo();
  const crearModulo = async (data: Modulo) => post.mutateAsync(data);
  return { crearModulo };
}
