import { usePostUsuario as useApiPostUsuario } from "@/api/usuario/postUsuario";
import { Usuario } from "@/types/usuarios";

export function usePostUsuario() {
  const post = useApiPostUsuario();
  const crearUsuario = async (data: Usuario) => post.mutateAsync(data);
  return { crearUsuario };
}
