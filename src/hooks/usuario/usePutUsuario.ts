import { usePutUsuario as useApiPutUsuario } from "@/api/usuario/putUsuario";
import { Usuario } from "@/types/usuarios";

export function usePutUsuario() {
  const put = useApiPutUsuario();
  const actualizarUsuario = async (id: number, data: Partial<Usuario>) => put.mutateAsync({ id, ...data });
  return { actualizarUsuario };
}
